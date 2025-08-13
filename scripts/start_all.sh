#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "[1/4] Ensuring Docker Desktop is running..."
if ! docker info >/dev/null 2>&1; then
  if [[ "$(uname -s)" == "Darwin" ]];
  then
    echo "Starting Docker Desktop..."
    open -a Docker || true
  else
    echo "Docker daemon not running. Please start Docker and rerun."
  fi
fi

TRIES=0
until docker info >/dev/null 2>&1; do
  TRIES=$((TRIES+1))
  if [[ $TRIES -gt 120 ]]; then
    echo "Timed out waiting for Docker daemon."
    exit 1
  fi
  sleep 1
done
echo "Docker is ready."

echo "[2/4] Starting Neo4j via docker compose..."
docker compose -f "$PROJECT_ROOT_DIR/docker-compose.yml" up -d

echo "[3/4] Waiting for Neo4j Bolt on localhost:7687..."
TRIES=0
until (echo > /dev/tcp/127.0.0.1/7687) >/dev/null 2>&1; do
  TRIES=$((TRIES+1))
  if [[ $TRIES -gt 120 ]]; then
    echo "Timed out waiting for Neo4j to open Bolt port."
    docker compose -f "$PROJECT_ROOT_DIR/docker-compose.yml" logs neo4j | tail -n 100 || true
    exit 1
  fi
  sleep 1
done
echo "Neo4j Bolt is available."

echo "[4/4] Running app with Bun..."
cd "$PROJECT_ROOT_DIR"
bun src/index.ts
