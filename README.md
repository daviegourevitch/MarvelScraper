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

4. Run the full setup and tests:

   ```bash
   bun run up
   ```

   This will start Docker, Neo4j, and run comprehensive scraping tests.

## Scripts

- `bun run up` – **start everything** (Docker + Neo4j + run tests)
- `bun run test` – run quick scraper test (requires Neo4j running)
- `bun run start` – run full test suite
- `bun run dev` – run in hot-reload mode
- `bun run neo4j:up` – start Neo4j via Docker only
- `bun run neo4j:down` – stop Neo4j
- `bun run neo4j:logs` – tail logs

## Features

✅ **Wiki Scraping** - Uses `hermitpurple` to scrape Wikia/Fandom sites  
✅ **Neo4j Storage** - Stores scraped data as Character nodes  
✅ **Multiple Wikis** - Supports Marvel, JoJo, DC, Pokemon, and more  
✅ **TypeScript** - Full type safety with Bun runtime  
✅ **Local Data** - All Neo4j data stored in `./neo4j/` directory  

## Quick Test

Edit `src/test-scraper.ts` to change the wiki and search terms:

```typescript
const WIKI = 'marvel';     // Try: 'jojo', 'dc', 'pokemon'
const QUERY = 'Thor';      // Try: 'Batman', 'Pikachu'
```

Then run: `bun run test`

## Environment

Some example values for .env

```
NEO4J_URI=bolt://localhost:7687
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=neo4jpassword
```

