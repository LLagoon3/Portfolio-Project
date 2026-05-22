import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddContactTopic1779421639911 implements MigrationInterface {
  name = 'AddContactTopic1779421639911';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Bold 폼의 topic chip 선택값 저장용. 기존 폼 호환 (기존 데이터는 null).
    await queryRunner.query(
      `ALTER TABLE \`CONTACT_SUBMISSION\` ADD \`topic\` varchar(50) NULL`,
    );
    // Bold 폼은 subject 를 수집하지 않아 NULL 허용으로 변경.
    // 기존 자유 입력 폼은 그대로 사용 가능.
    await queryRunner.query(
      `ALTER TABLE \`CONTACT_SUBMISSION\` MODIFY \`subject\` varchar(200) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // NULL row 가 있으면 NOT NULL 복귀가 실패하므로 빈 문자열로 채운 뒤 변경.
    await queryRunner.query(
      `UPDATE \`CONTACT_SUBMISSION\` SET \`subject\` = '' WHERE \`subject\` IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`CONTACT_SUBMISSION\` MODIFY \`subject\` varchar(200) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`CONTACT_SUBMISSION\` DROP COLUMN \`topic\``,
    );
  }
}
