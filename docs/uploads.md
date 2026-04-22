# Image Uploads

어드민에서 올리는 이미지는 `/app/uploads/` (`uploads` named docker volume) 에 저장되고, `api` 가 `/uploads/<filename>` 경로로 정적 서빙한다. 프론트는 `next.config.js` rewrite 로 이 경로를 api 로 프록시한다.

## URL / 저장 규칙

- URL 포맷: `/uploads/<uuid>.jpg` — 업로드 후 sharp 로 JPEG 재인코딩 되면서 확장자도 `.jpg` 로 통일된다
- 외부 URL(`http://`, `https://`) 과 수동 자산(`/images/*`) 은 이 문서의 라이프사이클 관리 대상 아님 — 관리하지 않는다

## 슬롯별 preset (서버 리사이즈)

| preset | 규격 | fit | 비고 |
|---|---|---|---|
| `thumbnail` | 1600×900 | cover | 프로젝트 카드 썸네일 (16:9) |
| `gallery` | 최대 1600×1600 | inside | 프로젝트 상세 갤러리, 비율 유지 |
| `profile` | 512×512 | cover | About 프로필 (1:1) |

업로드 엔드포인트: `POST /api/admin/uploads?preset=<name>` (미지정 시 `gallery`)

## 자동 정리 (hot path)

프로젝트·프로필이 업데이트되거나 삭제될 때 참조가 끊긴 `/uploads/*` 파일이 즉시 정리된다.

- `AdminProjectsService.update` — DTO 의 새 thumbnail/gallery 목록과 이전 상태를 비교해 사라진 URL 을 삭제
- `AdminProjectsService.remove` — 모든 참조 파일 삭제
- `AdminAboutService.upsert` — 이전 `profile_image` 가 바뀌었고 `/uploads/*` 였다면 삭제

수동 자산(`/images/*`) 은 URL 접두어 검사로 제외되므로 건드리지 않는다. 파일 삭제 실패는 로그에 남기고 도메인 트랜잭션 성공을 유지한다.

## 주기적 청소 스크립트 (safety net)

두 가지 엔트리포인트가 있다. 실행 환경에 따라 골라 쓴다.

- `cleanup:uploads` — **개발/체크아웃 환경용**. `ts-node` 로 직접 실행 (devDependency 필요)
- `cleanup:uploads:prod` — **프로덕션 컨테이너 / 컴파일 이후 환경용**. `node dist/scripts/cleanup-uploads.js` 를 바로 실행 (runtime 이미지에 ts-node 가 없어서 이 엔트리가 필요)

두 변형 모두 같은 `--dry-run` / `--verbose` 옵션을 지원한다.

### 개발 환경 (소스 체크아웃)

```bash
# 어느 파일이 고아인지만 확인 (삭제하지 않음)
DB_HOST=... DB_PORT=... DB_USERNAME=... DB_PASSWORD=... DB_DATABASE=... \
ADMIN_PASSWORD_HASH=... JWT_SECRET=... \
  npm run -w apps/api cleanup:uploads -- --dry-run

# 실제 삭제
DB_HOST=... DB_PORT=... DB_USERNAME=... DB_PASSWORD=... DB_DATABASE=... \
ADMIN_PASSWORD_HASH=... JWT_SECRET=... \
  npm run -w apps/api cleanup:uploads

# 참조된 파일도 같이 보기
npm run -w apps/api cleanup:uploads -- --dry-run --verbose
```

### 프로덕션 컨테이너

컨테이너의 WORKDIR 은 `/app` (워크스페이스 루트) 이라 `-w apps/api` 로 워크스페이스를 명시해야 한다. 환경변수는 이미 `.env` 로 주입되어 있다.

```bash
# 어느 파일이 고아인지만 확인 (삭제하지 않음)
docker compose exec api npm run -w apps/api cleanup:uploads:prod -- --dry-run

# 실제 삭제
docker compose exec api npm run -w apps/api cleanup:uploads:prod

# 참조된 파일도 같이 보기
docker compose exec api npm run -w apps/api cleanup:uploads:prod -- --dry-run --verbose
```

스크립트는 DB(`PROJECT.thumbnail_img`, `PROJECT_IMAGE.img`, `ABOUT_PROFILE.profile_image`) 가 참조하는 `/uploads/*` 파일명 집합을 만들고, 그 집합에 없는 업로드 디렉터리의 모든 파일을 정리한다.

## 주의

- S3/R2 이관(#28) 시점에는 hot path 와 스크립트 모두 object storage API 로 교체된다. 인터페이스(`UploadsStorageService.deleteByUrl / listOrphans`) 는 그대로 유지하도록 설계되어 있다.
- 스크립트 실행 중 어드민이 동시에 이미지를 교체하면 race condition 으로 방금 업로드된 파일이 고아로 잡힐 수 있다. 가능한 경우 짧은 유지보수 창 또는 낮은 트래픽 시간에 실행할 것.
