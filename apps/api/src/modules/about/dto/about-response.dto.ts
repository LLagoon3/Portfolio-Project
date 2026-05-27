import { ApiProperty } from '@nestjs/swagger';

export class AboutStatDto {
  @ApiProperty({ example: 'Shipped Projects' })
  label!: string;

  @ApiProperty({ example: '6' })
  value!: string;

  @ApiProperty({ example: '운영 / 외주 / 팀', nullable: true, required: false })
  sub!: string | null;
}

export class AboutPrincipleDto {
  @ApiProperty({ example: '원인을 끝까지 파고든다' })
  title!: string;

  @ApiProperty({ example: '증상이 아닌 원인부터 확인합니다...' })
  body!: string;
}

export class AboutSocialDto {
  @ApiProperty({ example: '@LLagoon3' })
  label!: string;

  @ApiProperty({ example: 'https://github.com/LLagoon3' })
  url!: string;
}

export class AboutFaqDto {
  @ApiProperty({ example: '주로 어떤 일을 하시나요?' })
  question!: string;

  @ApiProperty({ example: '백엔드를 중심으로...', description: '마크다운 허용' })
  answer!: string;
}

export class AboutStackGroupDto {
  @ApiProperty({ example: 'Backend' })
  title!: string;

  @ApiProperty({ type: [String], example: ['NestJS', 'Express'] })
  techs!: string[];
}

export class AboutJourneyDto {
  @ApiProperty({ example: '2026.01 — Now', description: '자유 표현 가능한 기간 라벨' })
  year!: string;

  @ApiProperty({ example: '통합 로그 시스템' })
  title!: string;

  @ApiProperty({ example: '백엔드 · 외주', nullable: true, required: false })
  role!: string | null;

  @ApiProperty({ example: '여러 보안 솔루션 로그를 통합...' })
  body!: string;
}

export class AboutResponseDto {
  @ApiProperty({ example: 'Lagoon' })
  name!: string;

  @ApiProperty({
    example: 'Backend Developer',
    nullable: true,
    required: false,
  })
  tagline!: string | null;

  @ApiProperty({ example: '/images/profile.jpeg' })
  profileImage!: string;

  @ApiProperty({
    type: [String],
    example: ['첫 단락...', '두 단락...'],
    description: 'sort_order 오름차순으로 정렬된 소개 단락들. 마크다운 허용.',
  })
  bio!: string[];

  @ApiProperty({ example: 'Seoul, South Korea', nullable: true, required: false })
  address!: string | null;

  @ApiProperty({ example: 'me@example.com', nullable: true, required: false })
  email!: string | null;

  @ApiProperty({ example: '+82 10-1234-5678', nullable: true, required: false })
  phone!: string | null;

  // Bold 리디자인 후속 — 5개 신규 필드. 빈 값(null / []) graceful fallback.
  @ApiProperty({ example: '신입 채용 검토 중', nullable: true, required: false })
  availability!: string | null;

  @ApiProperty({ type: [AboutStatDto], description: 'sort_order 정렬' })
  stats!: AboutStatDto[];

  @ApiProperty({ type: [AboutPrincipleDto], description: 'sort_order 정렬' })
  principles!: AboutPrincipleDto[];

  @ApiProperty({ type: [AboutJourneyDto], description: 'sort_order 정렬' })
  journey!: AboutJourneyDto[];

  @ApiProperty({ type: [AboutStackGroupDto] })
  stacks!: AboutStackGroupDto[];

  // Contact PR (#94) 보류분 — Contact Sidebar Direct / FAQ 섹션에 사용.
  @ApiProperty({ type: [AboutSocialDto], description: 'sort_order 정렬' })
  socials!: AboutSocialDto[];

  @ApiProperty({ type: [AboutFaqDto], description: 'sort_order 정렬' })
  faqs!: AboutFaqDto[];
}
