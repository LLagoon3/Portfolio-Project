#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="/home/lagoon3/.openclaw/workspace/Portfolio-Project"
BRANCH="main"
DEPLOY_SHA="${DEPLOY_SHA:-}"

cd "$PROJECT_DIR"

# 호스트는 더 이상 docker build 를 수행하지 않는다. 그러나 docker-compose.yml / .env 가
# 호스트에 있어야 docker compose 가 읽을 수 있으므로, git fetch/reset 으로 동기화는 유지한다.
echo "=== Syncing compose files & .env from git ==="
git fetch origin "$BRANCH"

if [ -n "$DEPLOY_SHA" ]; then
  echo "=== Checking out exact SHA: $DEPLOY_SHA ==="
  git checkout "$DEPLOY_SHA"
else
  echo "=== Resetting to origin/$BRANCH ==="
  git reset --hard "origin/$BRANCH"
fi

# CD 가 IMAGE_TAG 를 명시 전달하면 그 SHA 태그로 배포(롤백/검증), 미전달 시 main-latest 알리아스로 폴백.
TAG="${IMAGE_TAG:-main-latest}"
export WEB_IMAGE_TAG="$TAG"
export API_IMAGE_TAG="$TAG"

echo "=== Pulling images (tag=$TAG) ==="
docker compose pull

echo "=== Restarting containers ==="
docker compose up -d

echo "=== Cleaning up dangling images ==="
docker image prune -f

echo "=== Deploy complete ==="
docker compose ps
