# DB Migrations

TypeORM migrations로 스키마 변경을 코드 이력으로 관리한다.

## 디렉터리

- 마이그레이션 파일: `apps/api/src/database/migrations/<timestamp>-<Name>.ts`
- CLI 설정: `apps/api/src/database/data-source.ts`

## 로컬에서 사용

루트에서 `-w apps/api`로 호출한다. DB 접속 정보는 환경변수로 전달.

```bash
# 현재 상태 조회
DB_HOST=127.0.0.1 DB_PORT=3307 DB_USERNAME=portfolio \
  DB_PASSWORD=portfolio_secret DB_DATABASE=portfolio \
  npm run -w apps/api migration:show

# 적용되지 않은 마이그레이션 실행
npm run -w apps/api migration:run

# 엔티티 변경분을 새 마이그레이션으로 생성
npm run -w apps/api migration:generate src/database/migrations/<Name>

# 빈 마이그레이션 템플릿 생성 (데이터 이관 등 엔티티 변경 없는 작업용)
npm run -w apps/api migration:create src/database/migrations/<Name>

# 마지막 마이그레이션 되돌리기
npm run -w apps/api migration:revert
```

## 런타임 동작

`apps/api/src/config/database.config.ts`는 `migrationsRun: true`로 설정되어 있어,
api 컨테이너/프로세스가 기동될 때 미적용 마이그레이션을 자동 실행한다. 따라서
배포 시 별도 명령 없이 컨테이너가 뜨면 최신 스키마까지 도달한다.

## 기존 운영 DB 마킹 절차 (baseline 1회성)

이미 테이블이 존재하는 환경에 처음 migration 체계를 도입할 때, baseline
migration을 "이미 적용된" 것으로 마킹해야 한다. 그러지 않으면 부팅 시
`CREATE TABLE ... already exists` 오류로 실패한다.

```sql
-- MySQL 접속 후 실행 (한 번만)
INSERT INTO migrations (timestamp, name)
VALUES (<timestamp>, '<ClassName>');
-- 예: (1776680123017, 'InitialSchema1776680123017')
```

baseline 파일명(`<timestamp>-<Name>.ts`)의 timestamp와 파일 안의 클래스
이름을 그대로 넣는다. 이후부터는 migration 파일을 추가·반영하는 일반 흐름을 따른다.

## 주의

- `synchronize`는 모든 환경에서 false. 엔티티 변경 후에는 반드시
  `migration:generate`로 파일을 만들고 리뷰해서 커밋한다.
- 마이그레이션 파일은 실수로도 편집 후 재배포하지 않는다. 이미 적용된
  파일을 바꾸면 환경 간 상태가 어긋난다. 되돌려야 할 때는 새 migration을
  추가하는 방식으로 처리한다.
