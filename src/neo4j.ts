import neo4j, { Driver } from "neo4j-driver";
import dotenv from "dotenv";

dotenv.config();

function getEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function createNeo4jDriver(): Driver {
  const uri = getEnv("NEO4J_URI", "bolt://localhost:7687");
  const username = getEnv("NEO4J_USERNAME", "neo4j");
  const password = getEnv("NEO4J_PASSWORD", "neo4jpassword");

  return neo4j.driver(uri, neo4j.auth.basic(username, password));
}

export async function verifyNeo4jConnection(driver: Driver): Promise<void> {
  const session = driver.session();
  try {
    const result = await session.run(
      "MERGE (n:HealthCheck {id: 'startup'}) ON CREATE SET n.createdAt = timestamp() RETURN n"
    );
    const single = result.records[0];
    if (!single) {
      throw new Error("No result returned from Neo4j health check");
    }
  } finally {
    await session.close();
  }
}

