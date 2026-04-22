# Changelog

## [0.1.3](https://github.com/LLagoon3/Portfolio-Project/compare/portfolio-project-v0.1.2...portfolio-project-v0.1.3) (2026-04-22)


### Features

* **api:** cleanup:uploads 고아 파일 정리 스크립트와 운영 문서 추가 ([485c0b7](https://github.com/LLagoon3/Portfolio-Project/commit/485c0b77e0d0f314755fe3d3f18000d8fdcd848f)), closes [#37](https://github.com/LLagoon3/Portfolio-Project/issues/37)
* **api:** UploadsStorageService 로 /uploads 파일 라이프사이클 공용화 ([fb95b41](https://github.com/LLagoon3/Portfolio-Project/commit/fb95b41e227426bd682f0d7481b176c621067ec5)), closes [#37](https://github.com/LLagoon3/Portfolio-Project/issues/37)
* **api:** 어드민 About 편집 엔드포인트 추가 ([f747af8](https://github.com/LLagoon3/Portfolio-Project/commit/f747af89a1a2d5a2fedd7f1290a931a3b0883a37)), closes [#26](https://github.com/LLagoon3/Portfolio-Project/issues/26)
* **api:** 어드민 Auth 모듈 (login/logout/me + JwtAuthGuard) 추가 ([71b99d1](https://github.com/LLagoon3/Portfolio-Project/commit/71b99d18940d63c241f257563ffd6b5d7c5254a5)), closes [#23](https://github.com/LLagoon3/Portfolio-Project/issues/23)
* **api:** 어드민 Contact 수신함 엔드포인트 추가 ([1abc82f](https://github.com/LLagoon3/Portfolio-Project/commit/1abc82f541c559b4190a83d19feb5ff3b1d3c685)), closes [#27](https://github.com/LLagoon3/Portfolio-Project/issues/27)
* **api:** 어드민 Projects CRUD 엔드포인트 추가 (이미지 업로드 제외) ([fd0b72e](https://github.com/LLagoon3/Portfolio-Project/commit/fd0b72e960a12607b600b805fbb866388196aab0)), closes [#24](https://github.com/LLagoon3/Portfolio-Project/issues/24)
* **api:** 어드민 이미지 업로드 엔드포인트와 /uploads 정적 서빙 추가 ([eebc882](https://github.com/LLagoon3/Portfolio-Project/commit/eebc882dbd9c5e8da8f18818488ff5befbb9dda8)), closes [#25](https://github.com/LLagoon3/Portfolio-Project/issues/25)
* **api:** 업로드 preset 도입과 sharp 기반 서버 사이드 리사이즈 ([fe4f38a](https://github.com/LLagoon3/Portfolio-Project/commit/fe4f38a9ece9a1062bf2aec074e45211a5d226e5)), closes [#36](https://github.com/LLagoon3/Portfolio-Project/issues/36)
* **api:** 프로젝트/About update·remove 에 업로드 파일 즉시 정리 연결 ([6927a1b](https://github.com/LLagoon3/Portfolio-Project/commit/6927a1bf27c553d34859695aa385d4d59d7a6f3e)), closes [#37](https://github.com/LLagoon3/Portfolio-Project/issues/37)
* **web:** /admin/about 편집 페이지 추가 ([4857d7c](https://github.com/LLagoon3/Portfolio-Project/commit/4857d7c2ec2a4f6f0e24a93e86449020f093b5c6)), closes [#26](https://github.com/LLagoon3/Portfolio-Project/issues/26)
* **web:** /admin/contact 수신함 목록/상세 페이지 추가 ([b76ba1d](https://github.com/LLagoon3/Portfolio-Project/commit/b76ba1d778393e3501e032fe1839234296b3a4e3)), closes [#27](https://github.com/LLagoon3/Portfolio-Project/issues/27)
* **web:** ImageUploader preset 전파와 공개 페이지 비율 고정 ([734397c](https://github.com/LLagoon3/Portfolio-Project/commit/734397c95ef1e917abfd7d3fb3e91a069d12db11)), closes [#36](https://github.com/LLagoon3/Portfolio-Project/issues/36)
* **web:** ImageUploader 교체 UX 개선 (Replace 버튼·drop 교체·메타 표시) ([4aa3b42](https://github.com/LLagoon3/Portfolio-Project/commit/4aa3b4273b8e124814cb90b9ff0315a7e9cc6c5b)), closes [#35](https://github.com/LLagoon3/Portfolio-Project/issues/35)
* **web:** ImageUploader 컴포넌트와 /uploads 프록시 rewrite 추가 ([c4885ad](https://github.com/LLagoon3/Portfolio-Project/commit/c4885adf980a70187ed5e6911bf66db4c8e9dd76)), closes [#25](https://github.com/LLagoon3/Portfolio-Project/issues/25)
* **web:** 어드민 Projects 관리 UI (목록·생성·편집)와 공용 컴포넌트 추가 ([b32d0a2](https://github.com/LLagoon3/Portfolio-Project/commit/b32d0a2f7c697d03ade677a593774cfda5f06635)), closes [#24](https://github.com/LLagoon3/Portfolio-Project/issues/24)
* **web:** 어드민 공용 레이아웃과 /admin/login · /admin 대시보드 추가 ([d02c387](https://github.com/LLagoon3/Portfolio-Project/commit/d02c38745d64991105a096c130d0a804ce79cf74)), closes [#23](https://github.com/LLagoon3/Portfolio-Project/issues/23)


### Bug Fixes

* **api:** admin 관련 env 를 IsNotEmpty 로 강화 ([51672cf](https://github.com/LLagoon3/Portfolio-Project/commit/51672cfcaa407ccb3af83fbc890f89ea09ad9afd))
* **api:** cleanup:uploads 프로덕션 컨테이너 대응 엔트리포인트 추가 ([31a3b58](https://github.com/LLagoon3/Portfolio-Project/commit/31a3b585ec052062272e5507843e6842eb9567ce))
* **api:** Multer 에러를 400 으로 매핑하는 안전망 추가 ([d1c4c40](https://github.com/LLagoon3/Portfolio-Project/commit/d1c4c40da92a990b6f00e30220fbde7889dc41a6))
* **api:** uploads 테스트의 미사용 overrides 변수 제거 (lint) ([94003d1](https://github.com/LLagoon3/Portfolio-Project/commit/94003d17979a7ef5c04f1d356097a64703fd2782))
* **api:** UpsertAboutDto 에 입력 trim + 공백-only 거부 ([e8bd98d](https://github.com/LLagoon3/Portfolio-Project/commit/e8bd98d10d9045f5af6f332e9f7d4d2eca7d5f46))
* **api:** UpsertProjectDto 의 technologies 최소 1개 강제 및 techs 길이 제한 ([6a29752](https://github.com/LLagoon3/Portfolio-Project/commit/6a29752a6a6d05c7f75abaac5ed1091571e585c5))
* **api:** 업로드 정리 시 다른 레코드의 참조 확인 (데이터 손실 방지) ([4fa895b](https://github.com/LLagoon3/Portfolio-Project/commit/4fa895b31b38d23596583b1aaeb07393c113a5ce))
* **web:** About 폼 제출 시 Bio 단락도 trim 후 빈 값 필터링 ([fa7b8a1](https://github.com/LLagoon3/Portfolio-Project/commit/fa7b8a132e24897cc6b74aa13ec2f19f90f504d8))
* **web:** admin 로그인의 미사용 next 쿼리 처리 제거 ([410457a](https://github.com/LLagoon3/Portfolio-Project/commit/410457a4e3349266a2959793e63f38cde8fff68c))
* **web:** contact 수신함 페이지의 필터 변경 시 stale state 해소 ([e8bddc2](https://github.com/LLagoon3/Portfolio-Project/commit/e8bddc23866a2ecde36a34328e14d832e944a904))
* **web:** ImageUploader 의 외부 value 변경 시 이전 메타 잔존 문제 해소 ([03d20e6](https://github.com/LLagoon3/Portfolio-Project/commit/03d20e628bd30fe1bea31d1330d1af038d6b56c2))
* **web:** ProjectForm 썸네일 업로더에 preset="thumbnail" 실제로 전달 ([5f4fadb](https://github.com/LLagoon3/Portfolio-Project/commit/5f4fadb9cb37acab6f18456ed791c1584eeecbef))
* **web:** ProjectForm 에서 technologies 최소 1 그룹 보장 ([74c3f2c](https://github.com/LLagoon3/Portfolio-Project/commit/74c3f2cfd12b22d032e3e7b57a86248ac1fbfd17))

## [0.1.2](https://github.com/LLagoon3/Portfolio-Project/compare/portfolio-project-v0.1.1...portfolio-project-v0.1.2) (2026-04-20)


### Features

* **api:** About 모듈 스켈레톤과 GET /api/about 엔드포인트 추가 ([7c22c94](https://github.com/LLagoon3/Portfolio-Project/commit/7c22c94be822fc2974f7c00fed7fd8c08a27a959)), closes [#10](https://github.com/LLagoon3/Portfolio-Project/issues/10)
* **api:** About 시드 스크립트와 placeholder 데이터 적재 ([5654c49](https://github.com/LLagoon3/Portfolio-Project/commit/5654c490d49dadf5aef14f1b845576402ee715d4)), closes [#11](https://github.com/LLagoon3/Portfolio-Project/issues/11)
* **api:** About 테이블 생성 migration 추가 ([493d4c7](https://github.com/LLagoon3/Portfolio-Project/commit/493d4c7bca21994b1b90486667b8fcf592ecd572)), closes [#10](https://github.com/LLagoon3/Portfolio-Project/issues/10)
* **api:** TypeORM Migration 인프라 도입 및 synchronize 비활성화 ([6b0ca2b](https://github.com/LLagoon3/Portfolio-Project/commit/6b0ca2bc4bf43715669cacf6cd479dbed1ebf63f)), closes [#13](https://github.com/LLagoon3/Portfolio-Project/issues/13)
* **api:** 기존 스키마를 baseline migration으로 캡처 ([d281262](https://github.com/LLagoon3/Portfolio-Project/commit/d281262869ed449a3e9d52dff1c70972ca7f4309)), closes [#14](https://github.com/LLagoon3/Portfolio-Project/issues/14)
* **api:** 실제 포트폴리오 프로젝트 6건으로 시드 데이터 교체 ([aee7e1e](https://github.com/LLagoon3/Portfolio-Project/commit/aee7e1e8caed03ff627b19b13856b51d76cc8922))
* **web:** About 페이지를 API 기반 SSR 로 전환 ([0f80d22](https://github.com/LLagoon3/Portfolio-Project/commit/0f80d222529164dbbcef6decd6bead047875addc)), closes [#12](https://github.com/LLagoon3/Portfolio-Project/issues/12)
* **web:** add @tailwindcss/typography plugin for markdown rendering ([7587f02](https://github.com/LLagoon3/Portfolio-Project/commit/7587f02489f952b5ff7d66a199cfe38ab765b303))
* **web:** apply ReactMarkdown renderer to project Challenge section ([a9f8e80](https://github.com/LLagoon3/Portfolio-Project/commit/a9f8e8097865777fe5437867dd44d41e358191b8))
* **web:** install react-markdown and @tailwindcss/typography ([44dae01](https://github.com/LLagoon3/Portfolio-Project/commit/44dae01304dbc6f69cf97dd5baabe2a3d7ba5d2c))
* **web:** replace Stoman logo text with Lagoon branding ([909a886](https://github.com/LLagoon3/Portfolio-Project/commit/909a886d9607427c649fd5a793abe5ca0182d3f1))
* **web:** translate project search placeholder text to Korean ([4a1ea65](https://github.com/LLagoon3/Portfolio-Project/commit/4a1ea651f5d1b37fef0bb0cef14d4565ae5a164e))
* **web:** update project search text wording ([a7bdfe4](https://github.com/LLagoon3/Portfolio-Project/commit/a7bdfe46dad80f5a44c30b8a932312773daf5835))
* **web:** 메인 배너 이름/소개/CTA를 실제 정보로 커스텀 ([fb46383](https://github.com/LLagoon3/Portfolio-Project/commit/fb46383459dfd475fa8ed6e9198d7dd4e6935401))
* **web:** 프로젝트 목록에 실제 검색 필터 구현 ([e935f2d](https://github.com/LLagoon3/Portfolio-Project/commit/e935f2d17c85119cad486a8552f2dd071bf08163))


### Bug Fixes

* **api:** data-source의 DB 접속값을 fail-fast로 전환 ([01023e9](https://github.com/LLagoon3/Portfolio-Project/commit/01023e93bb97d2de3c7fd0dedd00dce227a09cf0))
* **repo:** package-lock.json을 package.json과 동기화 ([5f32fa9](https://github.com/LLagoon3/Portfolio-Project/commit/5f32fa9d49611ca3a0dd7bcaa9495e8f425ca82e))
* **web:** About fetch 실패 시 404 와 5xx 를 구분 처리 ([95dec36](https://github.com/LLagoon3/Portfolio-Project/commit/95dec36e0d3b9503940fe3fc1bf3f49be18e9294))
* **web:** add break-all to website URL to prevent overflow into adjacent column ([b15b41e](https://github.com/LLagoon3/Portfolio-Project/commit/b15b41ed887488091483862722a5c2c43078b544))
* **web:** adjust RelatedProjects grid columns to match actual project count ([6ee07f1](https://github.com/LLagoon3/Portfolio-Project/commit/6ee07f18b11d9a88418cdc0028bbd8fc95677cc5))
* **web:** reduce prose h2 size to stay below Challenge heading ([baab367](https://github.com/LLagoon3/Portfolio-Project/commit/baab3672000f70e66ccb6e1c243d5ac62e9ad7da))
* **web:** SSR 런타임 API_INTERNAL_URL 누락으로 /projects 비어있는 버그 수정 ([5f22ca1](https://github.com/LLagoon3/Portfolio-Project/commit/5f22ca160b6089c8c124d46bc0b42840e26651c4))
* **web:** 프로젝트 메타 정보의 URL 값을 자동으로 링크 렌더링 ([cdbd699](https://github.com/LLagoon3/Portfolio-Project/commit/cdbd6992f185a225b4673b891aabfc5df25a2285))
* **web:** 프로젝트 목록 SSR 에서 5xx 를 드러내고 silent 빈 배열 fallback 제거 ([0500754](https://github.com/LLagoon3/Portfolio-Project/commit/05007546c6ab201f8183d40e641b8d63dda2d50c)), closes [#17](https://github.com/LLagoon3/Portfolio-Project/issues/17)
* **web:** 프로젝트 상세 SSR 에서 5xx 를 404 로 위장하지 않도록 수정 ([5e8fe09](https://github.com/LLagoon3/Portfolio-Project/commit/5e8fe098c7d11d3c7f36c0571a2b69e1d08e24e9)), closes [#17](https://github.com/LLagoon3/Portfolio-Project/issues/17)
* **web:** 프로젝트 상세 마크다운 헤딩 계층 정렬 ([62901c5](https://github.com/LLagoon3/Portfolio-Project/commit/62901c5f7db6b02d568138dd50ecf45b8c2173de))
* **web:** 홈 페이지 SSR 에서 5xx 를 드러내고 silent 빈 배열 fallback 제거 ([997914f](https://github.com/LLagoon3/Portfolio-Project/commit/997914faa0a4d8210e7357f552b967e1a34819fd)), closes [#17](https://github.com/LLagoon3/Portfolio-Project/issues/17)

## [0.1.1](https://github.com/LLagoon3/Portfolio-Project/compare/portfolio-project-v0.1.0...portfolio-project-v0.1.1) (2026-04-12)


### Features

* **api:** Config/Validation/Swagger/공통 응답 기반 추가 ([6fd9614](https://github.com/LLagoon3/Portfolio-Project/commit/6fd9614e85e9b43f6fafcbd2a9a05fcea57ce42b))
* **api:** Contact API 모듈 구현 (POST /api/contact) ([9902d23](https://github.com/LLagoon3/Portfolio-Project/commit/9902d234c5603c96545605c6137364dd4e46c842))
* **api:** Projects 모듈 + 정규화 엔티티 6종 추가 (GET /api/projects, /:url) ([4754060](https://github.com/LLagoon3/Portfolio-Project/commit/4754060dcb64d235a0c01554493e074bfd0c7717))
* **api:** TypeORM + MySQL 연동 설정 및 헬스체크 DB 상태 확인 추가 ([6830bc1](https://github.com/LLagoon3/Portfolio-Project/commit/6830bc1da9104413d59c687bf51c2e57717d1043))
* **web:** Contact 폼 전송 결과 메시지 UI 개선 ([4ec8627](https://github.com/LLagoon3/Portfolio-Project/commit/4ec862771ecd6d14aa78bed8e4175dbd00cc9918))
* **web:** Contact 폼을 백엔드 API와 연동 ([2206286](https://github.com/LLagoon3/Portfolio-Project/commit/2206286f3643a716fc9549b29840c707bcd02e45))
* **web:** Projects 페이지를 백엔드 API와 연동 ([id] → [url] slug) ([e0c687d](https://github.com/LLagoon3/Portfolio-Project/commit/e0c687d21d03766bdf7f9b63fd3496f09b5ad531))
* **web:** ProjectsFilter 카테고리 목록을 API 데이터 기반으로 동적 생성 ([98dbb98](https://github.com/LLagoon3/Portfolio-Project/commit/98dbb984f778bf1383b1c001ba1f96f237ab5911))
* **web:** RelatedProjects 컴포넌트를 API 연동으로 전환 ([ecb9fe1](https://github.com/LLagoon3/Portfolio-Project/commit/ecb9fe162a540c3f68a66268e28bec8cfe386b5e))


### Bug Fixes

* cd.yml에 SHA 전달 및 concurrency 직렬화 추가 ([a7ededf](https://github.com/LLagoon3/Portfolio-Project/commit/a7ededf3dfd990c9bd12f6d85f4b7c6306ab46b3))
* clarify web API proxy build-time config ([eb8fdac](https://github.com/LLagoon3/Portfolio-Project/commit/eb8fdaccc62c5bb1138e2b62b8746874466e0861))
* deploy.sh를 SHA 기반 배포 + git reset 방식으로 변경 ([95833a5](https://github.com/LLagoon3/Portfolio-Project/commit/95833a5fee3843ef5a07df0255e3e2315cfc4144))
* **web:** about, contact 페이지 컴포넌트명을 PascalCase로 변경 ([ca73e59](https://github.com/LLagoon3/Portfolio-Project/commit/ca73e5923d296dee3e3fcd2fc4f3861cba6dca16))
* **web:** AboutClientSingle에서 deprecated layout="responsive" 제거 ([1edf17a](https://github.com/LLagoon3/Portfolio-Project/commit/1edf17a74426a76c3f437aba3be2587c3d7dd752))
* **web:** AppBanner의 img 태그를 Next.js Image 컴포넌트로 교체 ([53609ca](https://github.com/LLagoon3/Portfolio-Project/commit/53609ca687279ac494765d28c4b29fea3bc2bf57))
* **web:** AppHeader showHireMeModal에 SSR document 가드 추가 ([60defcb](https://github.com/LLagoon3/Portfolio-Project/commit/60defcb3fd3f0f2256722ead88a410c373f6d7f7))
* **web:** AppHeader에서 함수를 렌더링하려는 불필요한 코드 제거 ([bd71efb](https://github.com/LLagoon3/Portfolio-Project/commit/bd71efb6dc3f500eb4909b486e6d61e17440422d))
* **web:** contact form이 외부 도메인에서 실패하는 문제 수정 ([bc82fe1](https://github.com/LLagoon3/Portfolio-Project/commit/bc82fe113bcfaf49de7ffb47db2b70135d4f265a))
* **web:** ContactForm 한국어 메시지를 영문으로 통일 ([f9da527](https://github.com/LLagoon3/Portfolio-Project/commit/f9da52705ec0481eeaa326d9634cc1e40d714a2d))
* **web:** CSS 클래스 오타 및 target 속성 수정 ([e92c75f](https://github.com/LLagoon3/Portfolio-Project/commit/e92c75f8b47a1bcd0da9d7e2b764ea9f51fe9309))
* **web:** HireMeModal Send Request를 form onSubmit 기반으로 변경 ([6aa439d](https://github.com/LLagoon3/Portfolio-Project/commit/6aa439d722903d46ef5f981229d4b4debc1d37bd))
* **web:** index.jsx More Projects Link 구조 정리 ([318cd13](https://github.com/LLagoon3/Portfolio-Project/commit/318cd135ee860ee870a2f7bb5bd704c0724a7afc))
* **web:** PagesMetaHead keywords 중복 선언 및 description 기본값 누락 수정 ([30cbd7e](https://github.com/LLagoon3/Portfolio-Project/commit/30cbd7e41b8d2fd5b2008c74103ec5a6a0c850f9))
* **web:** ProjectImages의 Image 컴포넌트 중복 key prop 제거 ([fb56daf](https://github.com/LLagoon3/Portfolio-Project/commit/fb56daf5d05c3b21deb6e7c6906f75675d278728))
* **web:** ProjectsGrid의 리스트 key를 index에서 project.id로 변경 ([ec5a716](https://github.com/LLagoon3/Portfolio-Project/commit/ec5a71648e833512aff3577ddd13dede0e977cf0))
* **web:** SSR 페이지에서 API_INTERNAL_URL 환경변수 사용 ([8d68951](https://github.com/LLagoon3/Portfolio-Project/commit/8d689510ebb9195bf80c6021741250ef6aeb1f75))
* **web:** SSR/클라이언트 hydration mismatch 수정 ([669bc9a](https://github.com/LLagoon3/Portfolio-Project/commit/669bc9a6edb5309c94ce9e2bd7a0413384fa7bc1))
* **web:** useScrollToTop SSR 안전성 및 성능 개선 ([1fcda79](https://github.com/LLagoon3/Portfolio-Project/commit/1fcda7964774e58694f842a245cf2898b4cad178))
* **web:** 모바일 헤더 테마 스위처 위치를 햄버거 메뉴 옆으로 이동 ([2c09f87](https://github.com/LLagoon3/Portfolio-Project/commit/2c09f8734ebfdb0d551837f08a1f9b23a1220c40))
* **web:** 외부 링크에 rel="noopener noreferrer" 추가 ([9e525c9](https://github.com/LLagoon3/Portfolio-Project/commit/9e525c9f8c515d488d96cdeccf34fb9ed4635e45))
* **web:** 프로젝트 목록/상세 페이지 API 연동 및 기존 버그 수정 ([dfac20b](https://github.com/LLagoon3/Portfolio-Project/commit/dfac20b4ba46ad2ef99d5e00a9f591a4561613f1))
* **web:** 프로젝트 상세 CompanyInfo 링크 하드코딩 제거 ([348d88f](https://github.com/LLagoon3/Portfolio-Project/commit/348d88fe558b5afa1884e3137b3e658fa3f0c02e))
