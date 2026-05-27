import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAboutExtendedFields1779372689864 implements MigrationInterface {
  name = 'AddAboutExtendedFields1779372689864';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ABOUT_PROFILE: Hero status (availability) + Tech Stack (stacks json) 추가.
    await queryRunner.query(
      `ALTER TABLE \`ABOUT_PROFILE\` ADD \`availability\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ABOUT_PROFILE\` ADD \`stacks\` json NULL`,
    );

    // ABOUT_STAT: In Numbers 섹션 (label/value/sub + sort_order + profile_id).
    await queryRunner.query(
      `CREATE TABLE \`ABOUT_STAT\` (` +
        `\`id\` int NOT NULL AUTO_INCREMENT,` +
        `\`label\` varchar(100) NOT NULL,` +
        `\`value\` varchar(100) NOT NULL,` +
        `\`sub\` varchar(255) NULL,` +
        `\`sort_order\` int NOT NULL DEFAULT '0',` +
        `\`profile_id\` tinyint NOT NULL,` +
        `\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),` +
        `PRIMARY KEY (\`id\`)` +
        `) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ABOUT_STAT\` ADD CONSTRAINT \`FK_about_stat_profile\` ` +
        `FOREIGN KEY (\`profile_id\`) REFERENCES \`ABOUT_PROFILE\`(\`id\`) ` +
        `ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    // ABOUT_PRINCIPLE: Principles 섹션 (title/body + sort_order + profile_id).
    await queryRunner.query(
      `CREATE TABLE \`ABOUT_PRINCIPLE\` (` +
        `\`id\` int NOT NULL AUTO_INCREMENT,` +
        `\`title\` varchar(200) NOT NULL,` +
        `\`body\` text NOT NULL,` +
        `\`sort_order\` int NOT NULL DEFAULT '0',` +
        `\`profile_id\` tinyint NOT NULL,` +
        `\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),` +
        `PRIMARY KEY (\`id\`)` +
        `) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ABOUT_PRINCIPLE\` ADD CONSTRAINT \`FK_about_principle_profile\` ` +
        `FOREIGN KEY (\`profile_id\`) REFERENCES \`ABOUT_PROFILE\`(\`id\`) ` +
        `ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    // ABOUT_JOURNEY: Journey 타임라인 (year string / title / role nullable / body + sort_order + profile_id).
    await queryRunner.query(
      `CREATE TABLE \`ABOUT_JOURNEY\` (` +
        `\`id\` int NOT NULL AUTO_INCREMENT,` +
        `\`year\` varchar(100) NOT NULL,` +
        `\`title\` varchar(200) NOT NULL,` +
        `\`role\` varchar(200) NULL,` +
        `\`body\` text NOT NULL,` +
        `\`sort_order\` int NOT NULL DEFAULT '0',` +
        `\`profile_id\` tinyint NOT NULL,` +
        `\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),` +
        `PRIMARY KEY (\`id\`)` +
        `) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ABOUT_JOURNEY\` ADD CONSTRAINT \`FK_about_journey_profile\` ` +
        `FOREIGN KEY (\`profile_id\`) REFERENCES \`ABOUT_PROFILE\`(\`id\`) ` +
        `ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`ABOUT_JOURNEY\` DROP FOREIGN KEY \`FK_about_journey_profile\``,
    );
    await queryRunner.query(`DROP TABLE \`ABOUT_JOURNEY\``);

    await queryRunner.query(
      `ALTER TABLE \`ABOUT_PRINCIPLE\` DROP FOREIGN KEY \`FK_about_principle_profile\``,
    );
    await queryRunner.query(`DROP TABLE \`ABOUT_PRINCIPLE\``);

    await queryRunner.query(
      `ALTER TABLE \`ABOUT_STAT\` DROP FOREIGN KEY \`FK_about_stat_profile\``,
    );
    await queryRunner.query(`DROP TABLE \`ABOUT_STAT\``);

    await queryRunner.query(
      `ALTER TABLE \`ABOUT_PROFILE\` DROP COLUMN \`stacks\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`ABOUT_PROFILE\` DROP COLUMN \`availability\``,
    );
  }
}
