import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropProjectUnusedColumnsAndCompanyInfo1779890000000
  implements MigrationInterface
{
  name = 'DropProjectUnusedColumnsAndCompanyInfo1779890000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // PROJECT_COMPANY_INFO 테이블 + PROJECT 의 6 컬럼은 Bold 리디자인 후 public web
    // 어디에도 노출되지 않음. Role/Client 핵심 정보는 PR #126 으로 hero_role /
    // hero_client 컬럼으로 이주 완료. heading 라벨 5개 + headerTags + heroSubtitle
    // 도 dead. 정리.
    //
    // 데이터 손실:
    //   - PROJECT_COMPANY_INFO 전체 (Role/Client 외 메모성 row)
    //   - PROJECT 의 6 컬럼 값
    // 운영 환경 적용 전 mysqldump 백업 권장.

    // 1. FK 먼저 끊고 → 2. 테이블 drop → 3. PROJECT 컬럼 drop
    await queryRunner.query(
      `ALTER TABLE \`PROJECT_COMPANY_INFO\` DROP FOREIGN KEY \`FK_b0cf36aa03560ca425deedcadcc\``,
    );
    await queryRunner.query(`DROP TABLE \`PROJECT_COMPANY_INFO\``);

    await queryRunner.query(
      `ALTER TABLE \`PROJECT\` ` +
        `DROP COLUMN \`header_tags\`, ` +
        `DROP COLUMN \`client_heading\`, ` +
        `DROP COLUMN \`objectives_heading\`, ` +
        `DROP COLUMN \`project_details_heading\`, ` +
        `DROP COLUMN \`social_sharing_heading\`, ` +
        `DROP COLUMN \`hero_subtitle\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // schema-only 복원. 데이터는 사전 백업에서 수동 적용 필요.
    await queryRunner.query(
      `ALTER TABLE \`PROJECT\` ` +
        `ADD COLUMN \`header_tags\` varchar(200) NOT NULL DEFAULT '', ` +
        `ADD COLUMN \`client_heading\` varchar(200) NOT NULL DEFAULT '', ` +
        `ADD COLUMN \`objectives_heading\` varchar(200) NOT NULL DEFAULT '', ` +
        `ADD COLUMN \`project_details_heading\` varchar(200) NOT NULL DEFAULT '', ` +
        `ADD COLUMN \`social_sharing_heading\` varchar(200) NOT NULL DEFAULT '', ` +
        `ADD COLUMN \`hero_subtitle\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `CREATE TABLE \`PROJECT_COMPANY_INFO\` (` +
        `\`id\` int NOT NULL AUTO_INCREMENT, ` +
        `\`title\` varchar(100) NOT NULL, ` +
        `\`details\` varchar(500) NOT NULL, ` +
        `\`sort_order\` int NOT NULL DEFAULT '0', ` +
        `\`project_id\` int NOT NULL, ` +
        `PRIMARY KEY (\`id\`)` +
        `) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`PROJECT_COMPANY_INFO\` ADD CONSTRAINT \`FK_b0cf36aa03560ca425deedcadcc\` ` +
        `FOREIGN KEY (\`project_id\`) REFERENCES \`PROJECT\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
