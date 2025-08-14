import { HermitPurple } from 'hermitpurple';
import { Driver } from 'neo4j-driver';

export interface WikiArticle {
  id: string;
  url: string;
  img: string;
  article: string;
  title: string;
}

export class WikiScraper {
  private hermit: HermitPurple;
  private driver: Driver;

  constructor(fandom: string, searchLimit: number, neo4jDriver: Driver) {
    this.hermit = new HermitPurple(fandom, searchLimit);
    this.driver = neo4jDriver;
  }

  async searchCharacters(query: string): Promise<WikiArticle[]> {
    try {
      console.log(`🔍 Searching for "${query}" in ${this.hermit.fandom} wiki...`);
      const results = await this.hermit.search(query);
      console.log(`✅ Found ${results.length} results`);
      return results;
    } catch (error) {
      console.error(`❌ Error searching for "${query}":`, error);
      throw error;
    }
  }

  async getArticleContent(title: string): Promise<WikiArticle> {
    try {
      console.log(`📖 Fetching article: "${title}"`);
      const article = await this.hermit.getArticle(title);
      console.log(`✅ Retrieved article for "${title}"`);
      return article;
    } catch (error) {
      console.error(`❌ Error fetching article "${title}":`, error);
      throw error;
    }
  }

  async saveToNeo4j(article: WikiArticle): Promise<void> {
    const session = this.driver.session();
    try {
      console.log(`💾 Saving "${article.title}" to Neo4j...`);
      
      const result = await session.run(`
        MERGE (c:Character {id: $id})
        SET c.title = $title,
            c.url = $url,
            c.imageUrl = $img,
            c.content = $article,
            c.updatedAt = timestamp()
        RETURN c
      `, {
        id: article.id,
        title: article.title,
        url: article.url,
        img: article.img,
        article: article.article
      });

      console.log(`✅ Saved "${article.title}" to Neo4j`);
      return result.records[0]?.get('c').properties;
    } catch (error) {
      console.error(`❌ Error saving "${article.title}" to Neo4j:`, error);
      throw error;
    } finally {
      await session.close();
    }
  }

  async scrapeAndStore(query: string): Promise<WikiArticle[]> {
    try {
      // Search for articles
      const searchResults = await this.searchCharacters(query);
      
      // Store each result in Neo4j
      const storedArticles: WikiArticle[] = [];
      for (const result of searchResults) {
        await this.saveToNeo4j(result);
        storedArticles.push(result);
      }

      console.log(`🎉 Successfully scraped and stored ${storedArticles.length} articles`);
      return storedArticles;
    } catch (error) {
      console.error(`❌ Error in scrapeAndStore:`, error);
      throw error;
    }
  }

  async getStoredCharacters(): Promise<any[]> {
    const session = this.driver.session();
    try {
      const result = await session.run(`
        MATCH (c:Character)
        RETURN c.title as title, c.url as url, c.imageUrl as imageUrl, c.updatedAt as updatedAt
        ORDER BY c.updatedAt DESC
      `);

      return result.records.map(record => ({
        title: record.get('title'),
        url: record.get('url'),
        imageUrl: record.get('imageUrl'),
        updatedAt: new Date(record.get('updatedAt').toNumber())
      }));
    } finally {
      await session.close();
    }
  }
}
