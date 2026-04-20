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

## 환경별 첫 도입 절차

baseline migration은 migration 체계를 처음 도입할 때 한 번만 치르는
과정이다. 환경 상태에 따라 절차가 다르다.

### (a) 완전히 새로운 DB (테이블이 하나도 없는 상태)

아무 사전 작업도 필요하지 않다. baseline 코드가 들어있는 이미지로
api를 기동하면 `migrationsRun: true` 설정에 의해 TypeORM이

1. `migrations` 메타 테이블을 자동 생성
2. 이 baseline migration을 실행해 실제 스키마(`PROJECT`, `CONTACT_SUBMISSION` 등) 생성
3. `migrations` 테이블에 적용 이력 기록

까지 전부 처리한다. 이후 `seed:projects` 등 데이터 적재 스크립트를 돌리면 된다.

### (b) 이미 테이블이 존재하는 DB (기존 운영 환경)

테이블은 이미 있지만 `migrations` 메타 테이블이 아직 없는 상태다. 이
상태에서 baseline 코드를 그대로 배포하면, 부팅 시 TypeORM이 baseline을
"미적용"으로 판단하고 `CREATE TABLE ... already exists`로 실패한다.

배포 **이전에** 아래 SQL을 한 번 실행해 `migrations` 테이블을 수동
생성하고 baseline이 이미 적용된 것으로 마킹해야 한다.

```sql
-- 1) 메타 테이블 생성 (이미 있으면 무시)
CREATE TABLE IF NOT EXISTS `migrations` (
  `id`        INT NOT NULL AUTO_INCREMENT,
  `timestamp` BIGINT NOT NULL,
  `name`      VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- 2) baseline migration을 "이미 적용"으로 마킹
INSERT INTO `migrations` (`timestamp`, `name`)
VALUES (<timestamp>, '<ClassName>');
-- 예: (1776680123017, 'InitialSchema1776680123017')
```

`<timestamp>`와 `<ClassName>`은 baseline 파일명(`<timestamp>-<Name>.ts`)과
파일 내부의 클래스 이름(`<Name><timestamp>`)에서 그대로 가져온다.

이후 api를 기동하면 TypeORM은 baseline을 "이미 적용됨"으로 인식하고
스킵한다. 다음 migration부터는 일반 흐름을 따른다.

## 주의

- `synchronize`는 모든 환경에서 false. 엔티티 변경 후에는 반드시
  `migration:generate`로 파일을 만들고 리뷰해서 커밋한다.
- 마이그레이션 파일은 실수로도 편집 후 재배포하지 않는다. 이미 적용된
  파일을 바꾸면 환경 간 상태가 어긋난다. 되돌려야 할 때는 새 migration을
  추가하는 방식으로 처리한다.
