#!/usr/bin/env bash
set -euo pipefail

ENV_NAME="${1:-prod}"
# 호스트 운영자 디렉토리 — .env / .env.dev 등 비공개 환경 파일이 위치.
# self-hosted runner 가 호스트의 다른 작업 (브랜치 작업, cherry-pick, rebase 등)
# 을 reset 으로 망가뜨리지 않도록 deploy 작업은 별도 디렉토리에서 수행한다.
ORIG_PROJECT_DIR="/home/lagoon3/.openclaw/workspace/Portfolio-Project"
# deploy 전용 작업 디렉토리 — 첫 실행 시 clone, 이후 매번 origin/main 으로 reset.
DEPLOY_DIR="${HOME}/.cache/portfolio-deploy"
DEPLOY_REPO_URL="https://github.com/LLagoon3/Portfolio-Project.git"
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

# deploy 디렉토리 부트스트랩 — 호스트 운영자 setup 불필요, 첫 실행이 자동 셋업.
if [ ! -d "$DEPLOY_DIR/.git" ]; then
  echo "=== First-time setup: cloning into $DEPLOY_DIR ==="
  mkdir -p "$(dirname "$DEPLOY_DIR")"
  git clone --branch main --depth 1 "$DEPLOY_REPO_URL" "$DEPLOY_DIR"
fi

cd "$DEPLOY_DIR"

# compose 정의는 항상 main 기준으로 동기화 (인프라 단일 출처).
# 이 reset 은 DEPLOY_DIR 안에서만 일어나므로 호스트 ORIG_PROJECT_DIR 의
# 진행 중인 git 작업은 영향을 받지 않는다.
echo "=== Syncing compose files from main (env=$ENV_NAME) ==="
git fetch --depth 1 origin main
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

# .env / .env.dev 는 git tracked 가 아니므로 DEPLOY_DIR 에는 없다.
# 호스트 ORIG_PROJECT_DIR 의 파일을 절대경로로 직접 참조.
ENV_FILE_ABS="${ORIG_PROJECT_DIR}/${ENV_FILE}"
if [ ! -f "$ENV_FILE_ABS" ]; then
  echo "=== Missing env file: $ENV_FILE_ABS ===" >&2
  exit 1
fi

# docker-compose.yml / docker-compose.dev.yml 의 service-level `env_file:` 디렉티브는
# compose CLI 의 `--env-file` 과 다른 메커니즘이고, **compose 파일 디렉토리**(=DEPLOY_DIR)
# 기준으로 path 를 해석한다. 따라서 `--env-file` 만 절대경로로 줘도 service env_file 은
# DEPLOY_DIR 내부의 `.env` / `.env.dev` 를 찾고 실패한다.
# 호스트 ORIG_PROJECT_DIR 의 실파일을 DEPLOY_DIR 에 symlink 해서 두 메커니즘 모두 만족시킨다.
# idempotent — 매번 실행해도 동일 결과.
ln -sf "$ENV_FILE_ABS" "$DEPLOY_DIR/$ENV_FILE"

COMPOSE=(docker compose -p "$COMPOSE_PROJECT" "${COMPOSE_FILES[@]}" "${COMPOSE_PROFILES[@]}" --env-file "$ENV_FILE_ABS")

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
