#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="/home/lagoon3/.openclaw/workspace/Portfolio-Project"
DEPLOY_SHA="${DEPLOY_SHA:-}"

cd "$PROJECT_DIR"

echo "=== Fetching latest changes ==="
git fetch origin main

if [ -n "$DEPLOY_SHA" ]; then
  echo "=== Checking out exact SHA: $DEPLOY_SHA ==="
  git checkout "$DEPLOY_SHA"
else
  echo "=== Resetting to origin/main ==="
  git reset --hard origin/main
fi

echo "=== Building and restarting containers ==="
docker compose build --no-cache
docker compose up -d

echo "=== Cleaning up dangling images ==="
docker image prune -f

echo "=== Deploy complete ==="
docker compose ps
