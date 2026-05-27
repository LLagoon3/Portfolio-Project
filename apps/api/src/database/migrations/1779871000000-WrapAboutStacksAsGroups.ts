import { MigrationInterface, QueryRunner } from 'typeorm';

export class WrapAboutStacksAsGroups1779871000000
  implements MigrationInterface
{
  name = 'WrapAboutStacksAsGroups1779871000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // legacy ABOUT_PROFILE.stacks (flat string[]) → 그룹 형상 {title, techs[]}[] 으로
    // 단일 그룹 wrap. 첫 요소 JSON_TYPE 이 STRING 일 때만 적용 — 이미 OBJECT 형상으로
    // 옮긴 데이터는 WHERE 조건에서 제외돼 idempotent.
    //
    // 이 단계 없이 코드만 배포하면 AboutBrands 의 g?.techs?.length 가 false 가 돼
    // 섹션 전체 미렌더 + admin 폼이 flat 데이터를 빈 {title, techs} 로 hydrate 해서
    // 저장 시 silent data loss 발생.
    await queryRunner.query(`
      UPDATE \`ABOUT_PROFILE\`
      SET stacks = JSON_ARRAY(JSON_OBJECT('title', '기술 스택', 'techs', stacks))
      WHERE stacks IS NOT NULL
        AND JSON_TYPE(stacks) = 'ARRAY'
        AND JSON_LENGTH(stacks) > 0
        AND JSON_TYPE(JSON_EXTRACT(stacks, '$[0]')) = 'STRING'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 첫 그룹의 techs 만 보존하고 flat string[] 으로 복원. 여러 그룹으로 세분화된
    // 데이터는 첫 그룹 외 손실 — 가역성 한계가 있으니 운영 환경에서는 신중히.
    await queryRunner.query(`
      UPDATE \`ABOUT_PROFILE\`
      SET stacks = JSON_EXTRACT(stacks, '$[0].techs')
      WHERE stacks IS NOT NULL
        AND JSON_TYPE(stacks) = 'ARRAY'
        AND JSON_LENGTH(stacks) > 0
        AND JSON_TYPE(JSON_EXTRACT(stacks, '$[0]')) = 'OBJECT'
    `);
  }
}
