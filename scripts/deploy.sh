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

# 늦게 끝난 이전 커밋의 CI 가 최신 배포 이후 도착해 stale 이미지로 되감기는 상황 방지.
# CD 가 전달한 DEPLOY_SHA 가 더 이상 origin/$BRANCH 의 tip 이 아니면 배포 중단.
# 수동 롤백(DEPLOY_SHA 미설정 + IMAGE_TAG 지정) 경로는 이 가드와 충돌하지 않는다.
if [ -n "$DEPLOY_SHA" ]; then
  LATEST_SHA="$(git rev-parse "origin/$BRANCH")"
  if [ "$DEPLOY_SHA" != "$LATEST_SHA" ]; then
    echo "=== Skip stale deploy: DEPLOY_SHA=$DEPLOY_SHA origin/$BRANCH=$LATEST_SHA ===" >&2
    exit 0
  fi
fi

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
# mysql 은 mutable 태그(mysql:8.0) 라 매 pull 마다 digest 가 바뀔 수 있고,
# 그러면 뒤이은 up -d 가 mysql 까지 recreate 한다. web/api 만 명시적으로 pull 한다.
# mysql 자체 설정/이미지 변경 시에는 수동으로 `docker compose up -d mysql` 호출 필요.
docker compose pull web api

echo "=== Restarting containers ==="
docker compose up -d

echo "=== Cleaning up dangling images ==="
docker image prune -f

echo "=== Deploy complete ==="
docker compose ps
