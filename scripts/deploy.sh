#!/usr/bin/env bash
set -euo pipefail

ENV_NAME="${1:-prod}"

case "$ENV_NAME" in
  prod)
    PROJECT_DIR="/home/lagoon3/.openclaw/workspace/Portfolio-Project"
    BRANCH="main"
    COMPOSE_PROJECT="portfolio-project"
    COMPOSE_FILES=(-f docker-compose.yml)
    COMPOSE_PROFILES=(--profile prod)
    ENV_FILE=".env"
    ;;
  dev)
    PROJECT_DIR="/home/lagoon3/.openclaw/workspace/Portfolio-Project-dev"
    BRANCH="dev"
    COMPOSE_PROJECT="portfolio-dev"
    COMPOSE_FILES=(-f docker-compose.yml -f docker-compose.dev.yml)
    COMPOSE_PROFILES=()
    ENV_FILE=".env.dev"
    ;;
  *)
    echo "usage: deploy.sh [prod|dev]" >&2
    exit 1
    ;;
esac

DEPLOY_SHA="${DEPLOY_SHA:-}"

echo "=== Deploying $ENV_NAME (project=$COMPOSE_PROJECT dir=$PROJECT_DIR) ==="
cd "$PROJECT_DIR"

echo "=== Fetching latest changes ==="
git fetch origin "$BRANCH"

if [ -n "$DEPLOY_SHA" ]; then
  echo "=== Checking out exact SHA: $DEPLOY_SHA ==="
  git checkout "$DEPLOY_SHA"
else
  echo "=== Resetting to origin/$BRANCH ==="
  git reset --hard "origin/$BRANCH"
fi

COMPOSE=(docker compose -p "$COMPOSE_PROJECT" "${COMPOSE_FILES[@]}" "${COMPOSE_PROFILES[@]}" --env-file "$ENV_FILE")

echo "=== Building and restarting containers ==="
"${COMPOSE[@]}" build --no-cache
"${COMPOSE[@]}" up -d

echo "=== Cleaning up dangling images ==="
docker image prune -f

echo "=== Deploy complete ==="
"${COMPOSE[@]}" ps
