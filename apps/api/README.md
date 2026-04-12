# apps/api

NestJS 기반 포트폴리오 백엔드.

## 스크립트

루트에서:

```bash
npm install
npm run api:dev     # 개발 (watch)
npm run api:build   # 빌드
npm run api:start   # 프로덕션 실행 (dist/main.js)
```

기본 포트는 `3001` (환경변수 `PORT`로 override).

## 엔드포인트

- `GET /` — 헬로 메시지
- `GET /health` — `{ status: "ok" }`
