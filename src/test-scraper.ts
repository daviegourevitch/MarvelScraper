#!/usr/bin/env bun
import { createNeo4jDriver } from "./neo4j";
import { WikiScraper } from "./scraper";

async function quickTest() {
  const driver = createNeo4jDriver();
  
  try {
    console.log("🚀 Quick Scraper Test\n");
    
    // You can easily change these parameters for testing
    const WIKI = 'marvel';  // Try: 'marvel', 'jojo', 'dc', 'pokemon', etc.
    const SEARCH_LIMIT = 2;
    const QUERY = 'Thor';   // Try: 'Thor', 'Batman', 'Pikachu', etc.
    
    const scraper = new WikiScraper(WIKI, SEARCH_LIMIT, driver);
    
    console.log(`📖 Searching for "${QUERY}" in ${WIKI} wiki...`);
    const results = await scraper.searchCharacters(QUERY);
    
    console.log(`\n✅ Found ${results.length} results:\n`);
    results.forEach((result, index) => {
      console.log(`${index + 1}. 📄 ${result.title}`);
      console.log(`   🔗 ${result.url}`);
      console.log(`   🖼️  ${result.img || 'No image'}`);
      console.log(`   📝 ${result.article.substring(0, 200)}...\n`);
    });
    
    // Store in Neo4j
    console.log(`💾 Storing results in Neo4j...`);
    await scraper.scrapeAndStore(QUERY);
    
    // Show what's stored
    console.log(`\n📊 All stored characters:`);
    const stored = await scraper.getStoredCharacters();
    stored.forEach((char, index) => {
      console.log(`${index + 1}. ${char.title} (${char.updatedAt.toLocaleString()})`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await driver.close();
  }
}

// Run if this file is executed directly
if (import.meta.main) {
  quickTest().catch(console.error);
}

export { quickTest };
