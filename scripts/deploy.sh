#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="/home/lagoon3/.openclaw/workspace/Portfolio-Project"

cd "$PROJECT_DIR"

echo "=== Pulling latest changes ==="
git pull origin main

echo "=== Building and restarting containers ==="
docker compose build --no-cache
docker compose up -d

echo "=== Cleaning up dangling images ==="
docker image prune -f

echo "=== Deploy complete ==="
docker compose ps
