import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProjectHeroRoleClient1779870000000
  implements MigrationInterface
{
  name = 'AddProjectHeroRoleClient1779870000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Hero meta strip 의 Role / Client 전용 컬럼 (#125). 이전엔 PROJECT_COMPANY_INFO
    // 의 title 키워드 매칭으로 추출했지만 명명 의존 + admin 직관성 부족 문제로 분리.
    await queryRunner.query(
      `ALTER TABLE \`PROJECT\` ` +
        `ADD COLUMN \`hero_role\` varchar(100) NULL, ` +
        `ADD COLUMN \`hero_client\` varchar(100) NULL`,
    );

    // 기존 데이터 backfill — companyInfo 의 첫 매칭 row 의 details 를 사용 (web 의
    // buildHeroMeta 폴백 로직과 동일 키워드). sort_order asc 의 첫 매칭만.
    await queryRunner.query(`
      UPDATE \`PROJECT\` p
      SET \`hero_role\` = (
        SELECT ci.details FROM \`PROJECT_COMPANY_INFO\` ci
        WHERE ci.project_id = p.id
          AND (
            LOWER(ci.title) LIKE '%role%'
            OR ci.title LIKE '%역할%'
            OR ci.title LIKE '%담당%'
          )
        ORDER BY ci.sort_order ASC
        LIMIT 1
      )
      WHERE \`hero_role\` IS NULL
    `);
    await queryRunner.query(`
      UPDATE \`PROJECT\` p
      SET \`hero_client\` = (
        SELECT ci.details FROM \`PROJECT_COMPANY_INFO\` ci
        WHERE ci.project_id = p.id
          AND (
            LOWER(ci.title) LIKE '%client%'
            OR ci.title LIKE '%클라이언트%'
            OR ci.title LIKE '%고객%'
          )
        ORDER BY ci.sort_order ASC
        LIMIT 1
      )
      WHERE \`hero_client\` IS NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`PROJECT\` DROP COLUMN \`hero_client\`, DROP COLUMN \`hero_role\``,
    );
  }
}
