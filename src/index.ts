import { createNeo4jDriver, verifyNeo4jConnection } from "./neo4j";

async function main(): Promise<void> {
  const driver = createNeo4jDriver();
  try {
    await driver.getServerInfo();
    await verifyNeo4jConnection(driver);
    console.log("Neo4j connection OK. Wrote health-check node.");
  } finally {
    await driver.close();
  }
}

main().catch((err) => {
  console.error("Startup error:", err);
  process.exit(1);
});

