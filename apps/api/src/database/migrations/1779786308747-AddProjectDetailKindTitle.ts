import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProjectDetailKindTitle1779786308747 implements MigrationInterface {
  name = 'AddProjectDetailKindTitle1779786308747';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // PROJECT_DETAIL: Process step 의 admin 명시 kind / title (Phase 2 후속).
    // 모두 nullable — 기존 entry 는 그대로 두고 web 의 parseProcessSteps 폴백이 처리.
    await queryRunner.query(
      `ALTER TABLE \`PROJECT_DETAIL\` ADD \`kind\` varchar(50) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`PROJECT_DETAIL\` ADD \`title\` varchar(200) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`PROJECT_DETAIL\` DROP COLUMN \`title\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`PROJECT_DETAIL\` DROP COLUMN \`kind\``,
    );
  }
}
