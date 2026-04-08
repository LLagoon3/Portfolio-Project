# 프론트엔드 API 계획 (apps/web)

이 문서는 `apps/web` (Next.js 포트폴리오)이 필요로 할 API를 정리합니다. 현재 데이터는 `apps/web/data/*.js`에 하드코딩되어 있고, `pages/api/hello.js`만 존재하며, `apps/api`는 placeholder 상태입니다. 아래 분류는 실제 화면(`pages/index.jsx`, `about.jsx`, `projects/`, `contact.jsx`)을 기준으로 합니다.

---

## 1. 지금 당장 필요한 API

현재 정적 데이터/미구현 동작을 대체하기 위해 가장 먼저 만들어야 하는 것들.

### 1.1 Projects API
- `GET /api/projects` — 목록 (필터: `category`, 페이지네이션 `?page=&limit=`)
  - 대체 대상: `data/projectsData.js`, `pages/projects/index.jsx`의 카테고리 필터/검색
- `GET /api/projects/:url` — 단건 (slug 기반, `pages/projects/[id].jsx`에서 사용)
- 응답 필드: `id, title, url, category, img, ProjectHeader, ProjectImages, ProjectInfo`
- **구현 상태 (2026-04-08)**
  - [x] `GET /api/projects?category=` NestJS 모듈 (controller/service/repository) 구현
  - [x] `GET /api/projects/:url` slug 기반 단건 조회 + 404 처리
  - [x] 정규화 엔티티 6종 (PROJECT, PROJECT_IMAGE, PROJECT_COMPANY_INFO,
    PROJECT_TECHNOLOGY, PROJECT_TECHNOLOGY_ITEM, PROJECT_DETAIL) + CASCADE
  - [x] `project-detail.mapper`로 프론트 호환 nested 응답 조립
  - [x] `data/projectsData.js` → DB 시드 스크립트 (`npm run seed:projects -w apps/api`)
  - [x] 프론트 연동: `pages/projects/index.jsx` getServerSideProps,
    `pages/projects/[id].jsx → [url].jsx` slug 기반 라우팅
  - [x] 단위 테스트 (service/controller/repository/mapper, Jest 15 케이스)
  - [ ] 페이지네이션 (`?page=&limit=`)
  - [ ] 검색 (`?q=`) — 프론트 검색 input은 broken 상태
  - [ ] Admin CRUD (POST/PUT/DELETE), 이미지 업로드

### 1.2 Contact / Hire-me Form
- `POST /api/contact` — `components/contact/ContactForm.jsx`, `HireMeModal.jsx` 제출 처리
  - 입력: `name, email, subject, message, projectType?, budget?`
  - 검증: 이메일 형식, 길이, 봇 차단(honeypot 또는 캡차)
  - 동작: 메일 발송 또는 DB 저장 + 관리자 알림
  - 응답: `{ ok: true }` / 4xx 검증 오류
- **구현 상태 (2026-04-08)**
  - [x] `POST /api/contact` NestJS 모듈 (controller/service/repository) 구현
  - [x] MySQL `CONTACT_SUBMISSION` 테이블 저장 (TypeORM)
  - [x] `class-validator` 기반 DTO 검증 (이메일/길이/필수)
  - [x] `ContactForm.jsx` ↔ API 연동 + 성공/에러 UI
  - [x] 단위 테스트 (controller/service/repository, Jest 7 케이스)
  - [ ] `HireMeModal.jsx` 연동
  - [ ] `projectType`, `budget` 필드 지원
  - [ ] 봇 차단(honeypot/캡차)
  - [ ] 관리자 메일 알림

### 1.3 About / Profile
- `GET /api/about` — `data/aboutMeData.js`, `data/clientsData.js` 대체
  - 자기소개, 스킬, 클라이언트 로고 등 정적이지만 CMS화 시 유리

### 1.4 Health (선택)
- `GET /api/health` — `apps/api`를 실제 서비스화할 때 첫 엔드포인트

> 우선순위: **Contact > Projects > About**. Contact는 동작 자체가 없고, Projects/About는 데이터 소스 분리만 필요.

---

## 2. 나중에 필요할 수 있는 API

기능이 커질 때 도입을 고려.

- **Auth**: 관리자가 프로젝트/About을 직접 편집하는 admin 페이지용. `POST /api/auth/login`, 세션/JWT.
- **Admin CRUD**: `POST/PUT/DELETE /api/projects`, 이미지 업로드 (`POST /api/uploads` → S3/R2 presigned URL).
- **Analytics 수집 엔드포인트**: 페이지 뷰/이벤트 자체 수집 (`POST /api/events`). 외부 도구로 갈음 가능.
- **Comments / Guestbook**: 프로젝트 상세에 코멘트. `GET/POST /api/projects/:id/comments`. 스팸 필터 필요.
- **Newsletter 구독**: `POST /api/subscribe`. 외부 SaaS로 대체 가능.
- **Search**: `GET /api/search?q=` — 프로젝트 수가 많아지면 필요. 작을 때는 클라이언트 필터로 충분.
- **Sitemap / RSS 동적 생성**: 정적 생성으로 충분하지만, CMS 연동 시 API 필요.
- **i18n 콘텐츠**: 다국어 지원 시 `GET /api/content?lang=`.

---

## 3. 외부 서비스로 대체 가능한 영역

자체 API를 만들기 전에 우선 검토할 것들. 포트폴리오 규모에서는 대부분 외부 서비스가 합리적.

| 용도 | 사용할 수 있는 서비스 |
|---|---|
| Contact 폼 전송 | **Resend**, **Formspree**, **Getform**, **Web3Forms** |
| 콘텐츠 관리 (Projects/About) | **Sanity**, **Contentful**, **Notion API**, **MDX (GitHub)** |
| 이미지 호스팅/최적화 | **Cloudinary**, **Vercel Blob/Image**, **Cloudflare Images** |
| Analytics | **Vercel Analytics**, **Plausible**, **Umami**, **GA4** |
| 에러 모니터링 | **Sentry** |
| Newsletter | **Buttondown**, **ConvertKit**, **Mailchimp** |
| Comments | **Giscus** (GitHub Discussions), **Disqus** |
| 검색 | **Algolia**, **Meilisearch Cloud** |
| 인증 | **Auth.js (NextAuth)** + GitHub/Google OAuth, **Clerk** |
| Spam/봇 방지 | **hCaptcha**, **Cloudflare Turnstile** |

---

## 4. 추천 초기 전략

`apps/api`를 당장 만들지 않고, **Next.js Route + 외부 서비스 조합**으로 시작하는 것을 권장한다.

1. **Contact 폼**: `Resend` + `POST /api/contact` (Next.js Route Handler) + Cloudflare Turnstile.
   - 가장 먼저, 가장 적은 비용으로 "동작하지 않던 기능"을 동작하게 만든다.
2. **콘텐츠(Projects/About)**: 1단계는 현재의 `data/*.js`를 유지하되, 타입만 `packages/`로 추출. 2단계에서 **MDX** 또는 **Sanity**로 이전.
   - 이전 후에도 프론트는 `GET /api/projects`, `GET /api/about`라는 동일한 계약을 바라보게 해서 백엔드 교체 비용을 낮춘다.
3. **운영 가시성**: `Vercel Analytics` + `Sentry`를 초기부터 붙인다. 자체 `POST /api/events`는 필요해질 때 추가.
4. **`apps/api` 승격 시점**: 아래 중 하나라도 해당되면 분리한다.
   - 관리자 전용 CRUD/Auth가 생긴다.
   - Route Handler로 감당 어려운 장기 작업(이미지 처리, 큐, 크론)이 생긴다.
   - 다른 클라이언트(모바일 등)가 같은 데이터를 공유한다.
5. **공통 원칙**
   - 모든 입력은 `zod` 등으로 검증, 응답은 `{ data, error }` 형태로 일관화.
   - 비밀 값은 `.env.local`, 공유는 `.env.example`로 키만.
   - 프론트의 fetch 레이어는 단일 모듈로 묶어 외부 서비스/자체 API 교체에 대비.
