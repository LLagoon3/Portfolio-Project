# Portfolio-Project

개인 포트폴리오용 모노레포입니다.

## 구조

- `apps/web`: Next.js 포트폴리오 프론트엔드
- `apps/api`: 향후 백엔드 API 영역
- `packages`: 공용 패키지/타입 영역

## 개발 환경 기준

- Node.js: `24` (`.nvmrc` 기준)
- Package Manager: `npm@11.6.2`
- 의존성 설치는 저장소 루트에서 진행

## 시작 방법

```bash
nvm use
npm install
npm run dev
```

## 주요 스크립트

- `npm run dev`: 프론트 개발 서버 실행
- `npm run build`: 프론트 프로덕션 빌드
- `npm run start`: 프론트 프로덕션 서버 실행
- `npm run lint`: 프론트 린트 실행
- `npm run check`: 린트 + 빌드 일괄 확인

## 작업 규칙

- 앱별 의존성도 루트에서 설치/관리합니다.
- 프론트 관련 작업은 기본적으로 `apps/web` 기준으로 진행합니다.
- 공통 설정 변경은 루트 파일(`package.json`, `.npmrc`, `.nvmrc`, `.github/workflows/*`)에 반영합니다.

## CI

GitHub Actions는 다음 항목을 자동 확인합니다.

- `npm install`
- `npm run lint`
- `npm run build`
