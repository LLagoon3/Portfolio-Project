# API Plan & Status (apps/api)

`apps/api` (NestJS) 가 `apps/web` 에 제공하는 엔드포인트의 현재 상태와 앞으로의 작업을 정리한다.
Priority 1 계획은 대부분 구현되어 운영 중이며, 이 문서는 이제 "진행 상황 + 남은 작업" 을 추적하는 역할을 한다.

---

## 1. 현재 구현된 엔드포인트

| 메서드 | 경로 | 역할 | 도입 |
|---|---|---|---|
| `GET` | `/` | 루트 health ping | PR #5 |
| `GET` | `/health` | 상태 체크 | PR #5 |
| `GET` | `/api/projects?category=` | 프로젝트 목록 (카테고리 필터) | PR #9 |
| `GET` | `/api/projects/:url` | 프로젝트 단건 (slug) | PR #9 |
| `GET` | `/api/about` | 자기소개 단건 (singleton) | PR #16 |
| `POST` | `/api/contact` | 연락 폼 제출 | PR #7 |

응답은 전역 포맷 `{ success, data }` 또는 에러 시 `{ success: false, error: {...} }` 로 통일되어 있다.

### 1.1 Projects

- `GET /api/projects` — 카테고리 필터(`?category=`) 지원, 페이지네이션 미구현
- `GET /api/projects/:url` — slug 기반 단건, 미존재 시 404
- 엔티티 6종(`PROJECT`, `PROJECT_IMAGE`, `PROJECT_COMPANY_INFO`, `PROJECT_TECHNOLOGY`, `PROJECT_TECHNOLOGY_ITEM`, `PROJECT_DETAIL`) + CASCADE 관계
- `project-detail.mapper` 로 프론트 호환 nested 응답 조립
- 시드: `npm run -w apps/api seed:projects` (입력 파일: `apps/api/src/database/seeds/portfolio-projects-data.json`)
- 프론트 연동: `pages/index.jsx`, `pages/projects/index.jsx`, `pages/projects/[url].jsx`, `RelatedProjects`, `ProjectsFilter`, `ProjectsGrid` 전부 API 소스
- 단위 테스트: service / controller / repository / mapper (Jest)

### 1.2 About

- `GET /api/about` — **singleton** (`ABOUT_PROFILE.id = 1` CHECK 제약)
- 응답 필드: `name`, `tagline`, `profileImage`, `bio[]`
- `ABOUT_BIO.paragraph` 는 마크다운 허용, 프론트가 ReactMarkdown 으로 렌더
- 시드: `npm run -w apps/api seed:about` (입력 파일: `apps/api/src/database/seeds/about-data.json`)
- 프론트 연동: `pages/about.jsx`, `components/about/AboutMeBio.jsx`
- 단위 테스트: service / controller / repository / mapper

### 1.3 Contact

- `POST /api/contact` — `class-validator` 기반 DTO 검증(이메일/길이/필수)
- 저장: `CONTACT_SUBMISSION` 테이블 (`status` enum: `pending / read / replied`)
- 프론트 연동: `ContactForm.jsx`
- 단위 테스트: controller / service / repository

### 1.4 Health

- `GET /` 와 `GET /health` 두 개의 루트-경로 엔드포인트. 컨테이너 readiness/liveness 용

---

## 2. 스키마 관리

`synchronize: false` 가 모든 환경에 적용되어 있고, 스키마 변경은 TypeORM Migration 파일로 관리한다.

- 상세 절차: [`migrations.md`](./migrations.md)
- ERD: [`database-erd.md`](./database-erd.md)
- 현재 적용된 마이그레이션
  1. `InitialSchema1776680123017` — Project 계열 + Contact 기준 baseline (PR #15)
  2. `AddAboutTables1776686773344` — `ABOUT_PROFILE`, `ABOUT_BIO` 신설 (PR #16)

---

## 3. 프론트에서 API 호출 실패 정책

`getServerSideProps` 내부에서 API 응답을 처리할 때 규칙 (PR #18 로 통일).

- **404 응답**: 데이터가 없는 합법적 상태로 간주. 목록은 빈 배열, 단건은 `notFound: true`, About 은 `EMPTY_ABOUT` 으로 graceful fallback.
- **5xx / 네트워크 오류**: 감추지 않고 `throw` 로 전파 → Next.js 에러 페이지 + 서버 로그. 운영자가 장애를 즉시 인지할 수 있도록 한다.
- 예외적으로 부가 섹션(예: `RelatedProjects`) 의 실패는 메인 페이지 렌더를 막지 않도록 별도 try/catch 에서 silent fallback 허용.

---

## 4. 아직 정적 파일로 남아있는 영역

- **`apps/web/data/clientsData.js`** — `/about` 하단의 브랜드/클라이언트 로고 섹션에서 사용 중
- DB/API 연동은 미완. 다음 중 하나로 정리 예정
  - 별도 `GET /api/clients` 추가 (독립 리소스로 관리)
  - About 응답에 `clients` 필드를 합치기 (단일 응답으로 통합)
- `apps/web/pages/api/hello.js` — Next.js 기본 샘플, 미사용. 후속 정리 대상

---

## 5. 보류된 후속 작업

Priority 1 계열의 잔여 항목.

### Projects
- [ ] 페이지네이션 `?page=&limit=`
- [ ] Admin 인증 + CRUD (`POST / PUT / DELETE /api/projects`)
- [ ] 이미지 업로드 파이프라인 (로컬 `public/images` 수동 관리 탈피)
- [ ] 프로젝트 `is_featured` 또는 정렬 제어

### Contact
- [ ] `HireMeModal.jsx` 에서도 `POST /api/contact` 호출 연동
- [ ] `projectType`, `budget` 필드 지원
- [ ] 봇 차단 (honeypot 또는 Cloudflare Turnstile)
- [ ] 관리자 메일 알림

### About
- [ ] `clientsData.js` DB 이관 (위 4번 결정 필요)
- [ ] 관리자 UI 로 bio 단락 편집

### 기타
- [ ] `apps/web` 단위 테스트 인프라 도입 (jest + @testing-library + fetch mock) — 현재는 수동 검증만 가능
- [ ] OpenAPI/Swagger 문서 노출 (`apps/api` 는 `@nestjs/swagger` 데코레이터를 이미 달고 있음, 라우트만 붙이면 됨)

---

## 6. 미래 확장 후보 (Priority 2+)

즉시 필요한 범위는 아니지만 서비스가 커질 때 고려.

- **Auth**: 어드민 전용 엔드포인트용. `POST /api/auth/login`, 세션/JWT. NextAuth 같은 SaaS 로 대체 가능
- **Admin CRUD**: Projects / About 편집. 이미지 업로드(`POST /api/uploads` → S3/R2 presigned URL)
- **Analytics**: 자체 수집(`POST /api/events`) 보다 Vercel Analytics, Plausible, GA4 등 외부 도구 우선
- **Comments / Guestbook**: `GET/POST /api/projects/:url/comments`, 스팸 필터 필수. Giscus (GitHub Discussions) 로 대체 가능
- **Newsletter 구독**: 외부 SaaS (Buttondown 등) 로 대체 가능
- **Search**: `GET /api/search?q=` — 프로젝트 수가 많아질 때. 지금은 클라이언트 필터로 충분
- **Sitemap / RSS 동적 생성**: 정적 생성으로 충분. CMS 연동 시 필요
- **i18n 콘텐츠**: 다국어 시 `GET /api/content?lang=`

---

## 7. 외부 서비스로 대체 가능한 영역

자체 구현 전에 검토할 만한 대안들. 포트폴리오 규모에서는 대부분 외부 서비스가 합리적이다.

| 용도 | 후보 |
|---|---|
| Contact 폼 전송 (내부 구현 대체) | Resend, Formspree, Getform, Web3Forms |
| 콘텐츠 관리 (Projects/About) | Sanity, Contentful, Notion API, MDX (GitHub) |
| 이미지 호스팅/최적화 | Cloudinary, Vercel Blob/Image, Cloudflare Images |
| Analytics | Vercel Analytics, Plausible, Umami, GA4 |
| 에러 모니터링 | Sentry |
| Newsletter | Buttondown, ConvertKit, Mailchimp |
| Comments | Giscus, Disqus |
| 검색 | Algolia, Meilisearch Cloud |
| 인증 | Auth.js (NextAuth) + OAuth, Clerk |
| Spam/봇 방지 | hCaptcha, Cloudflare Turnstile |
