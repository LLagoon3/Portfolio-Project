# Portfolio-Project

개인 포트폴리오용 모노레포입니다.

## 구조

```
├── apps/
│   ├── web/          # Next.js 포트폴리오 프론트엔드 (port 7340)
│   └── api/          # NestJS 백엔드 API (port 7341)
├── packages/         # 공용 패키지/타입 영역
├── docs/             # API 계획, 데이터베이스 ERD, Migration 가이드 등
└── scripts/          # 배포 등 운영 스크립트
```

## 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | Next.js 13 (Pages Router), Tailwind CSS, Framer Motion |
| Backend | NestJS, TypeORM, MySQL 8.0 |
| Infra | Docker Compose, GitHub Actions (CI/CD) |

## 개발 환경 기준

- Node.js: `24` (`.nvmrc` 기준)
- Package Manager: `npm@11.6.2`
- 의존성 설치는 저장소 루트에서 진행

## 시작 방법

### 로컬 개발

```bash
nvm use
npm install
npm run dev          # 프론트 개발 서버 (localhost:7340)
npm run api:dev      # API 개발 서버 (localhost:7341)
```

### Docker (전체 실행)

web/api 이미지는 GHCR(`ghcr.io/llagoon3/portfolio-{web,api}`) 에 push 된 이미지를 그대로 pull 해 사용한다. 레포가 public 이므로 `docker login` 은 불필요.

```bash
docker compose pull    # GHCR 에서 web/api 이미지 가져오기
docker compose up -d   # web + api + mysql 전체 실행 (mysql 은 mysql:8.0 그대로)
docker compose ps      # 컨테이너 상태 확인
docker compose down    # 전체 종료
```

로컬에서 직접 소스 변경분으로 시험하려면 `docker compose up -d --build` 대신 일시적으로 `docker-compose.override.yml` 에 `build:` 블록을 따로 정의하거나, 단발성으로 `docker build -f apps/<web|api>/Dockerfile -t <local-tag> .` 후 compose 의 image 를 override 하면 된다.

## 주요 스크립트

### Web (Frontend)

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 프론트 개발 서버 실행 |
| `npm run build` | 프론트 프로덕션 빌드 |
| `npm run start` | 프론트 프로덕션 서버 실행 |
| `npm run lint` | 프론트 린트 실행 |

### API (Backend)

| 명령어 | 설명 |
|--------|------|
| `npm run api:dev` | API 개발 서버 실행 (watch 모드) |
| `npm run api:build` | API 프로덕션 빌드 |
| `npm run api:start` | API 프로덕션 서버 실행 |
| `npm run api:lint` | API 린트 실행 |
| `npm test -w apps/api` | API 단위 테스트 실행 |

### DB Migration & Seed

DB 접속 정보는 환경변수(`DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`)로 전달한다. 자세한 절차는 [`docs/migrations.md`](docs/migrations.md) 참고.

| 명령어 | 설명 |
|--------|------|
| `npm run migration:show -w apps/api` | 현재 migration 적용 상태 조회 |
| `npm run migration:run -w apps/api` | 미적용 migration 실행 |
| `npm run migration:generate -w apps/api src/database/migrations/<Name>` | 엔티티 변경분을 새 migration 파일로 생성 |
| `npm run migration:create -w apps/api src/database/migrations/<Name>` | 빈 migration 템플릿 생성 |
| `npm run migration:revert -w apps/api` | 마지막 migration 되돌리기 |
| `npm run seed:projects -w apps/api` | Projects 시드 (입력: `apps/api/src/database/seeds/portfolio-projects-data.json`) |
| `npm run seed:about -w apps/api` | About 시드 (입력: `apps/api/src/database/seeds/about-data.json`) |

런타임에서는 `migrationsRun: true` 설정으로 api 컨테이너 부팅 시 자동 적용된다.

## API 엔드포인트

| 메서드 | 경로 | 설명 |
|---|---|---|
| `GET` | `/` | health ping |
| `GET` | `/health` | 상태 체크 |
| `GET` | `/api/projects?category=` | 프로젝트 목록 |
| `GET` | `/api/projects/:url` | 프로젝트 단건 (slug) |
| `GET` | `/api/about` | 자기소개 (singleton) |
| `POST` | `/api/contact` | 연락 폼 제출 |
| `GET` | `/docs` | Swagger UI (OpenAPI JSON: `/docs-json`) |

상세 스펙과 보류된 후속 작업은 [`docs/api-plan.md`](docs/api-plan.md) 참고.

## 작업 규칙

- 앱별 의존성도 루트에서 설치/관리합니다.
- 프론트 관련 작업은 기본적으로 `apps/web` 기준으로 진행합니다.
- 공통 설정 변경은 루트 파일(`package.json`, `.npmrc`, `.nvmrc`, `.github/workflows/*`)에 반영합니다.

## CI/CD

### CI (GitHub Actions)

PR 및 push 시 자동 실행:

- **web-check**: lint + build
- **api-check**: lint + build + test (Jest)
- **docker-build**: web/api Docker 이미지 빌드 (matrix). `main`/`dev` push 트리거에서는 빌드 후 **GHCR 로 push** 까지 수행하고, PR 트리거에서는 빌드 검증만 한다.

이미지는 `ghcr.io/llagoon3/portfolio-{web,api}` 에 다음 태그로 push 된다.

| 태그 | 용도 | 예시 |
|------|------|------|
| `<branch>-<short-sha>` | 불변. 롤백/특정 배포 재현용 | `main-abc1234`, `dev-def5678` |
| `<branch>-latest` | 알리아스. 가장 최근 빌드를 가리킴 | `main-latest`, `dev-latest` |

### CD (Self-hosted Runner)

`main` 브랜치에 push 시 CI 통과 후 자동 배포된다.

1. CI 워크플로우 성공 확인 (workflow_run)
2. Self-hosted runner 에서 `IMAGE_TAG=main-<short-sha>` 로 `scripts/deploy.sh` 실행
3. `scripts/deploy.sh`:
   - `git fetch/reset` 으로 호스트의 compose 파일·.env 동기화 (호스트는 더 이상 `docker build` 를 수행하지 않음 — compose 정의를 읽기 위한 동기화 목적)
   - `docker compose pull` 로 GHCR 에서 해당 SHA 이미지 가져오기
   - `docker compose up -d` 로 새 이미지로 컨테이너 교체

### 롤백 절차

이미지는 GHCR 에 영구 보존되므로 환경변수만 바꿔 즉시 복귀 가능.

```bash
# self-hosted runner 호스트에서 직접 실행
IMAGE_TAG=main-<old-short-sha> bash scripts/deploy.sh
```

복귀 후 정상 확인되면 다음 main push 가 자동으로 `main-latest` 로 다시 끌어올린다.
