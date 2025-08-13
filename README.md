# MarvelScraper

TypeScript scraper scaffold with Neo4j, storing data locally via Docker volumes.

## Prerequisites

- Bun 1.1+
- Docker Desktop

## Setup

1. Install dependencies:

   ```bash
   bun install
   ```

2. Configure environment (defaults work out of the box):

   Create `.env` (optional) using the sample:

   ```bash
   cp env.sample .env
   ```

3. Start Neo4j locally (data persists to `./neo4j/*`):

   ```bash
   bun run neo4j:up
   ```

   Neo4j Browser: http://localhost:7474

4. Run the connection check:

   ```bash
   bun run start
   ```

   You should see: `Neo4j connection OK. Wrote health-check node.`

## Scripts

- `bun run dev` – run in hot-reload mode
- `bun run start` – run the app directly (TS supported)
- `bun run neo4j:up` – start Neo4j via Docker
- `bun run neo4j:down` – stop Neo4j
- `bun run neo4j:logs` – tail logs

## Environment

Some example values for .env

```
NEO4J_URI=bolt://localhost:7687
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=neo4jpassword
```

