import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProjectLinks1779792183503 implements MigrationInterface {
  name = 'AddProjectLinks1779792183503';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // PROJECT_LINK: 프로젝트의 외부 링크 (GitHub / Notion / Demo / 배포 등). About socials 패턴.
    await queryRunner.query(
      `CREATE TABLE \`PROJECT_LINK\` (` +
        `\`id\` int NOT NULL AUTO_INCREMENT,` +
        `\`label\` varchar(100) NOT NULL,` +
        `\`url\` varchar(500) NOT NULL,` +
        `\`sort_order\` int NOT NULL DEFAULT '0',` +
        `\`project_id\` int NOT NULL,` +
        `\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),` +
        `PRIMARY KEY (\`id\`)` +
        `) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`PROJECT_LINK\` ADD CONSTRAINT \`FK_project_link_project\` ` +
        `FOREIGN KEY (\`project_id\`) REFERENCES \`PROJECT\`(\`id\`) ` +
        `ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`PROJECT_LINK\` DROP FOREIGN KEY \`FK_project_link_project\``,
    );
    await queryRunner.query(`DROP TABLE \`PROJECT_LINK\``);
  }
}
