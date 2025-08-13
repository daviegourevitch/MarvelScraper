# MarvelScraper

TypeScript scraper scaffold with Neo4j, storing data locally via Docker volumes.

## Prerequisites

- Node.js 18+
- Docker Desktop
- Git
- (Optional) GitHub CLI `gh` for automated repo creation

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment (defaults work out of the box):

   Create `.env` (optional) using the sample:

   ```bash
   cp env.sample .env
   ```

3. Start Neo4j locally (data persists to `./neo4j/*`):

   ```bash
   npm run neo4j:up
   ```

   Neo4j Browser: http://localhost:7474

4. Run the connection check:

   ```bash
   npm run build && npm start
   ```

   You should see: `Neo4j connection OK. Wrote health-check node.`

## Scripts

- `npm run dev` – run in watch mode
- `npm run build` – compile TypeScript to `dist/`
- `npm start` – run compiled app
- `npm run neo4j:up` – start Neo4j via Docker
- `npm run neo4j:down` – stop Neo4j
- `npm run neo4j:logs` – tail logs

## Environment

See `env.sample` for values. Defaults:

```
NEO4J_URI=bolt://localhost:7687
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=neo4jpassword
```

