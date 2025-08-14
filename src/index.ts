import { createNeo4jDriver, verifyNeo4jConnection } from "./neo4j";
import { WikiScraper } from "./scraper";

async function testBasicScraping(): Promise<void> {
  console.log("\n🧪 Testing basic scraping functionality...");
  
  const driver = createNeo4jDriver();
  try {
    // Test with Marvel wiki
    const marvelScraper = new WikiScraper('marvel', 3, driver);
    
    // Test 1: Search for Spider-Man
    console.log("\n--- Test 1: Searching for Spider-Man ---");
    const spiderManResults = await marvelScraper.searchCharacters('Spider-Man');
    console.log(`Found ${spiderManResults.length} Spider-Man results:`);
    spiderManResults.forEach((result, index) => {
      console.log(`  ${index + 1}. ${result.title} (ID: ${result.id})`);
      console.log(`     URL: ${result.url}`);
      console.log(`     Preview: ${result.article.substring(0, 100)}...`);
    });

    // Test 2: Store results in Neo4j
    console.log("\n--- Test 2: Storing in Neo4j ---");
    await marvelScraper.scrapeAndStore('Iron Man');

    // Test 3: Retrieve stored characters
    console.log("\n--- Test 3: Retrieving stored characters ---");
    const storedCharacters = await marvelScraper.getStoredCharacters();
    console.log(`Found ${storedCharacters.length} stored characters:`);
    storedCharacters.forEach((char, index) => {
      console.log(`  ${index + 1}. ${char.title}`);
      console.log(`     URL: ${char.url}`);
      console.log(`     Stored: ${char.updatedAt.toISOString()}`);
    });

  } finally {
    await driver.close();
  }
}

async function testJoJoScraping(): Promise<void> {
  console.log("\n🧪 Testing JoJo wiki scraping...");
  
  const driver = createNeo4jDriver();
  try {
    // Test with JoJo wiki (from the documentation example)
    const jojoScraper = new WikiScraper('jojo', 2, driver);
    
    console.log("\n--- JoJo Test: Searching for Josuke ---");
    const josukeResults = await jojoScraper.searchCharacters('Josuke Higashikata');
    console.log(`Found ${josukeResults.length} Josuke results:`);
    josukeResults.forEach((result, index) => {
      console.log(`  ${index + 1}. ${result.title}`);
      console.log(`     Preview: ${result.article.substring(0, 150)}...`);
    });

  } finally {
    await driver.close();
  }
}

async function main(): Promise<void> {
  const driver = createNeo4jDriver();
  try {
    // Verify Neo4j connection first
    await driver.getServerInfo();
    await verifyNeo4jConnection(driver);
    console.log("✅ Neo4j connection OK. Wrote health-check node.");

    // Run scraping tests
    await testBasicScraping();
    await testJoJoScraping();

    console.log("\n🎉 All tests completed successfully!");
    
  } catch (error) {
    console.error("❌ Error during testing:", error);
    throw error;
  } finally {
    await driver.close();
  }
}

main().catch((err) => {
  console.error("Startup error:", err);
  process.exit(1);
});

