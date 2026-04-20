import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1776680123017 implements MigrationInterface {
    name = 'InitialSchema1776680123017'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`PROJECT_IMAGE\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(200) NOT NULL, \`img\` varchar(500) NOT NULL, \`sort_order\` int NOT NULL DEFAULT '0', \`project_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`PROJECT_COMPANY_INFO\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(100) NOT NULL, \`details\` varchar(500) NOT NULL, \`sort_order\` int NOT NULL DEFAULT '0', \`project_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`PROJECT_TECHNOLOGY_ITEM\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`sort_order\` int NOT NULL DEFAULT '0', \`technology_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`PROJECT_TECHNOLOGY\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(200) NOT NULL, \`sort_order\` int NOT NULL DEFAULT '0', \`project_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`PROJECT_DETAIL\` (\`id\` int NOT NULL AUTO_INCREMENT, \`details\` text NOT NULL, \`sort_order\` int NOT NULL DEFAULT '0', \`project_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`PROJECT\` (\`id\` int NOT NULL AUTO_INCREMENT, \`url\` varchar(200) NOT NULL, \`title\` varchar(200) NOT NULL, \`category\` varchar(100) NOT NULL, \`thumbnail_img\` varchar(500) NOT NULL, \`header_publish_date\` varchar(100) NOT NULL, \`header_tags\` varchar(200) NOT NULL, \`client_heading\` varchar(200) NOT NULL, \`objectives_heading\` varchar(200) NOT NULL, \`objectives_details\` text NOT NULL, \`project_details_heading\` varchar(200) NOT NULL, \`social_sharing_heading\` varchar(200) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_de3db186421162db8d6a8bf14e\` (\`url\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`CONTACT_SUBMISSION\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`email\` varchar(255) NOT NULL, \`subject\` varchar(200) NOT NULL, \`message\` text NOT NULL, \`status\` enum ('pending', 'read', 'replied') NOT NULL DEFAULT 'pending', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`PROJECT_IMAGE\` ADD CONSTRAINT \`FK_bedbf8e38d69fce777a8e8e948b\` FOREIGN KEY (\`project_id\`) REFERENCES \`PROJECT\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`PROJECT_COMPANY_INFO\` ADD CONSTRAINT \`FK_b0cf36aa03560ca425deedcadcc\` FOREIGN KEY (\`project_id\`) REFERENCES \`PROJECT\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`PROJECT_TECHNOLOGY_ITEM\` ADD CONSTRAINT \`FK_f3a410a10415855a4705000b70f\` FOREIGN KEY (\`technology_id\`) REFERENCES \`PROJECT_TECHNOLOGY\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`PROJECT_TECHNOLOGY\` ADD CONSTRAINT \`FK_2c729edeef17e3348f5a9b82e8d\` FOREIGN KEY (\`project_id\`) REFERENCES \`PROJECT\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`PROJECT_DETAIL\` ADD CONSTRAINT \`FK_168dd322342c64a5c03e5debe94\` FOREIGN KEY (\`project_id\`) REFERENCES \`PROJECT\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`PROJECT_DETAIL\` DROP FOREIGN KEY \`FK_168dd322342c64a5c03e5debe94\``);
        await queryRunner.query(`ALTER TABLE \`PROJECT_TECHNOLOGY\` DROP FOREIGN KEY \`FK_2c729edeef17e3348f5a9b82e8d\``);
        await queryRunner.query(`ALTER TABLE \`PROJECT_TECHNOLOGY_ITEM\` DROP FOREIGN KEY \`FK_f3a410a10415855a4705000b70f\``);
        await queryRunner.query(`ALTER TABLE \`PROJECT_COMPANY_INFO\` DROP FOREIGN KEY \`FK_b0cf36aa03560ca425deedcadcc\``);
        await queryRunner.query(`ALTER TABLE \`PROJECT_IMAGE\` DROP FOREIGN KEY \`FK_bedbf8e38d69fce777a8e8e948b\``);
        await queryRunner.query(`DROP TABLE \`CONTACT_SUBMISSION\``);
        await queryRunner.query(`DROP INDEX \`IDX_de3db186421162db8d6a8bf14e\` ON \`PROJECT\``);
        await queryRunner.query(`DROP TABLE \`PROJECT\``);
        await queryRunner.query(`DROP TABLE \`PROJECT_DETAIL\``);
        await queryRunner.query(`DROP TABLE \`PROJECT_TECHNOLOGY\``);
        await queryRunner.query(`DROP TABLE \`PROJECT_TECHNOLOGY_ITEM\``);
        await queryRunner.query(`DROP TABLE \`PROJECT_COMPANY_INFO\``);
        await queryRunner.query(`DROP TABLE \`PROJECT_IMAGE\``);
    }

}
