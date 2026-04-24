import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAboutContactFields1777003970857 implements MigrationInterface {
  name = 'AddAboutContactFields1777003970857';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`ABOUT_PROFILE\` ADD \`address\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ABOUT_PROFILE\` ADD \`email\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ABOUT_PROFILE\` ADD \`phone\` varchar(50) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`ABOUT_PROFILE\` DROP COLUMN \`phone\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`ABOUT_PROFILE\` DROP COLUMN \`email\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`ABOUT_PROFILE\` DROP COLUMN \`address\``,
    );
  }
}
