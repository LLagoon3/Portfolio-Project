#!/usr/bin/env bash
set -euo pipefail

ENV_NAME="${1:-prod}"
PROJECT_DIR="/home/lagoon3/.openclaw/workspace/Portfolio-Project"
DEPLOY_SHA="${DEPLOY_SHA:-}"

case "$ENV_NAME" in
  prod)
    COMPOSE_PROJECT="portfolio-project"
    COMPOSE_FILES=(-f docker-compose.yml)
    COMPOSE_PROFILES=(--profile prod)
    ENV_FILE=".env"
    TAG_PREFIX="main"
    ;;
  dev)
    COMPOSE_PROJECT="portfolio-dev"
    COMPOSE_FILES=(-f docker-compose.yml -f docker-compose.dev.yml)
    COMPOSE_PROFILES=()
    ENV_FILE=".env.dev"
    TAG_PREFIX="dev"
    ;;
  *)
    echo "usage: deploy.sh [prod|dev]" >&2
    exit 1
    ;;
esac

cd "$PROJECT_DIR"

# compose 정의는 항상 main 기준으로 동기화 (인프라 단일 출처).
# dev 환경의 코드는 GHCR 이미지(dev-<sha>) 안에 들어있으므로 호스트 git 상태와 무관.
echo "=== Syncing compose files from main (env=$ENV_NAME) ==="
git fetch origin main
git reset --hard origin/main

# stale SHA 가드는 prod 에만 적용.
# - prod 는 늦게 끝난 이전 커밋 CI 로 stale 이미지 되감기 방지 필요.
# - dev 는 곧 다음 push 로 덮여쓰여 영향 적음 → 단순화.
# - 수동 롤백(DEPLOY_SHA 미설정 + IMAGE_TAG 지정) 경로는 이 가드와 충돌하지 않는다.
if [ "$ENV_NAME" = "prod" ] && [ -n "$DEPLOY_SHA" ]; then
  LATEST_SHA="$(git rev-parse origin/main)"
  if [ "$DEPLOY_SHA" != "$LATEST_SHA" ]; then
    echo "=== Skip stale prod deploy: DEPLOY_SHA=$DEPLOY_SHA origin/main=$LATEST_SHA ===" >&2
    exit 0
  fi
fi

# CD 가 IMAGE_TAG 를 명시 전달하면 그 SHA 태그로 배포(롤백/검증), 미전달 시 <env>-latest 알리아스로 폴백.
TAG="${IMAGE_TAG:-${TAG_PREFIX}-latest}"
export WEB_IMAGE_TAG="$TAG"
export API_IMAGE_TAG="$TAG"

COMPOSE=(docker compose -p "$COMPOSE_PROJECT" "${COMPOSE_FILES[@]}" "${COMPOSE_PROFILES[@]}" --env-file "$ENV_FILE")

echo "=== Pulling images (env=$ENV_NAME tag=$TAG) ==="
# mysql 은 mutable 태그(mysql:8.0) 라 매 pull 마다 digest 가 바뀔 수 있고,
# 그러면 뒤이은 up -d 가 mysql 까지 recreate 한다. web/api 만 명시적으로 pull 한다.
# mysql 자체 설정/이미지 변경 시에는 수동으로 `docker compose --profile prod up -d mysql` 호출 필요.
"${COMPOSE[@]}" pull web api

echo "=== Restarting containers ==="
"${COMPOSE[@]}" up -d

echo "=== Cleaning up dangling images ==="
docker image prune -f

echo "=== Deploy complete ==="
"${COMPOSE[@]}" ps
