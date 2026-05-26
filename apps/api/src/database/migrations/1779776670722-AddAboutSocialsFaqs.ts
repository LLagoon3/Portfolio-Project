import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAboutSocialsFaqs1779776670722 implements MigrationInterface {
  name = 'AddAboutSocialsFaqs1779776670722';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ABOUT_SOCIAL: Contact Sidebar Direct 섹션에 동적 노출되는 social/외부 링크.
    await queryRunner.query(
      `CREATE TABLE \`ABOUT_SOCIAL\` (` +
        `\`id\` int NOT NULL AUTO_INCREMENT,` +
        `\`label\` varchar(100) NOT NULL,` +
        `\`url\` varchar(500) NOT NULL,` +
        `\`sort_order\` int NOT NULL DEFAULT '0',` +
        `\`profile_id\` tinyint NOT NULL,` +
        `\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),` +
        `PRIMARY KEY (\`id\`)` +
        `) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ABOUT_SOCIAL\` ADD CONSTRAINT \`FK_about_social_profile\` ` +
        `FOREIGN KEY (\`profile_id\`) REFERENCES \`ABOUT_PROFILE\`(\`id\`) ` +
        `ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    // ABOUT_FAQ: Contact 페이지의 FAQ 섹션. answer 는 markdown 허용 (text).
    await queryRunner.query(
      `CREATE TABLE \`ABOUT_FAQ\` (` +
        `\`id\` int NOT NULL AUTO_INCREMENT,` +
        `\`question\` varchar(200) NOT NULL,` +
        `\`answer\` text NOT NULL,` +
        `\`sort_order\` int NOT NULL DEFAULT '0',` +
        `\`profile_id\` tinyint NOT NULL,` +
        `\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),` +
        `PRIMARY KEY (\`id\`)` +
        `) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ABOUT_FAQ\` ADD CONSTRAINT \`FK_about_faq_profile\` ` +
        `FOREIGN KEY (\`profile_id\`) REFERENCES \`ABOUT_PROFILE\`(\`id\`) ` +
        `ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`ABOUT_FAQ\` DROP FOREIGN KEY \`FK_about_faq_profile\``,
    );
    await queryRunner.query(`DROP TABLE \`ABOUT_FAQ\``);
    await queryRunner.query(
      `ALTER TABLE \`ABOUT_SOCIAL\` DROP FOREIGN KEY \`FK_about_social_profile\``,
    );
    await queryRunner.query(`DROP TABLE \`ABOUT_SOCIAL\``);
  }
}
