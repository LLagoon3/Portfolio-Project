import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAboutTables1776686773344 implements MigrationInterface {
    name = 'AddAboutTables1776686773344'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`ABOUT_BIO\` (\`id\` int NOT NULL AUTO_INCREMENT, \`paragraph\` text NOT NULL, \`sort_order\` int NOT NULL DEFAULT '0', \`profile_id\` tinyint NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        // ABOUT_PROFILE 은 id=1 단일 row 만 허용하는 singleton. PK + CHECK 조합으로 DB 레벨에서 강제한다.
        await queryRunner.query(`CREATE TABLE \`ABOUT_PROFILE\` (\`id\` tinyint NOT NULL DEFAULT '1', \`name\` varchar(100) NOT NULL, \`tagline\` varchar(255) NULL, \`profile_image\` varchar(500) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`), CONSTRAINT \`CHK_about_profile_singleton\` CHECK (\`id\` = 1)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`ABOUT_BIO\` ADD CONSTRAINT \`FK_aaf47f3a22ae7945ad227e39f5e\` FOREIGN KEY (\`profile_id\`) REFERENCES \`ABOUT_PROFILE\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ABOUT_BIO\` DROP FOREIGN KEY \`FK_aaf47f3a22ae7945ad227e39f5e\``);
        await queryRunner.query(`DROP TABLE \`ABOUT_PROFILE\``);
        await queryRunner.query(`DROP TABLE \`ABOUT_BIO\``);
    }

}
