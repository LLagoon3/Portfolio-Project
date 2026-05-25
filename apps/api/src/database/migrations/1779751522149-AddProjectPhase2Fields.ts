import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProjectPhase2Fields1779751522149 implements MigrationInterface {
  name = 'AddProjectPhase2Fields1779751522149';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // PROJECT: Hero subtitle / accent 명시 컬럼 (Phase 2 도입).
    await queryRunner.query(
      `ALTER TABLE \`PROJECT\` ADD \`hero_subtitle\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`PROJECT\` ADD \`hero_accent_word\` varchar(100) NULL`,
    );

    // PROJECT_STAT: Impact 섹션 (label/value/sub + sort_order + project_id). AboutStat 패턴.
    await queryRunner.query(
      `CREATE TABLE \`PROJECT_STAT\` (` +
        `\`id\` int NOT NULL AUTO_INCREMENT,` +
        `\`label\` varchar(100) NOT NULL,` +
        `\`value\` varchar(100) NOT NULL,` +
        `\`sub\` varchar(255) NULL,` +
        `\`sort_order\` int NOT NULL DEFAULT '0',` +
        `\`project_id\` int NOT NULL,` +
        `\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),` +
        `PRIMARY KEY (\`id\`)` +
        `) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`PROJECT_STAT\` ADD CONSTRAINT \`FK_project_stat_project\` ` +
        `FOREIGN KEY (\`project_id\`) REFERENCES \`PROJECT\`(\`id\`) ` +
        `ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    // PROJECT_QUOTE: Pull quote (text required + author optional). 프로젝트당 0~1개라 project_id UNIQUE.
    await queryRunner.query(
      `CREATE TABLE \`PROJECT_QUOTE\` (` +
        `\`id\` int NOT NULL AUTO_INCREMENT,` +
        `\`text\` text NOT NULL,` +
        `\`author\` varchar(200) NULL,` +
        `\`project_id\` int NOT NULL,` +
        `\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),` +
        `PRIMARY KEY (\`id\`),` +
        `UNIQUE KEY \`UQ_project_quote_project\` (\`project_id\`)` +
        `) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`PROJECT_QUOTE\` ADD CONSTRAINT \`FK_project_quote_project\` ` +
        `FOREIGN KEY (\`project_id\`) REFERENCES \`PROJECT\`(\`id\`) ` +
        `ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`PROJECT_QUOTE\` DROP FOREIGN KEY \`FK_project_quote_project\``,
    );
    await queryRunner.query(`DROP TABLE \`PROJECT_QUOTE\``);

    await queryRunner.query(
      `ALTER TABLE \`PROJECT_STAT\` DROP FOREIGN KEY \`FK_project_stat_project\``,
    );
    await queryRunner.query(`DROP TABLE \`PROJECT_STAT\``);

    await queryRunner.query(
      `ALTER TABLE \`PROJECT\` DROP COLUMN \`hero_accent_word\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`PROJECT\` DROP COLUMN \`hero_subtitle\``,
    );
  }
}
