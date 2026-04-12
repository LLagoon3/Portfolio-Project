# Changelog

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
