import { ApiProperty } from '@nestjs/swagger';

export class ProjectHeaderDto {
  @ApiProperty()
  title!: string;

  @ApiProperty()
  publishDate!: string;

  @ApiProperty()
  tags!: string;
}

export class ProjectImageDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  img!: string;
}

export class CompanyInfoItemDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  details!: string;
}

export class TechnologyGroupDto {
  @ApiProperty()
  title!: string;

  @ApiProperty({ type: [String] })
  techs!: string[];
}

export class ProjectDetailItemDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  details!: string;
}

export class ProjectStatItemDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  label!: string;

  @ApiProperty()
  value!: string;

  @ApiProperty({ required: false, nullable: true })
  sub!: string | null;
}

export class ProjectQuoteItemDto {
  @ApiProperty()
  text!: string;

  @ApiProperty({ required: false, nullable: true })
  author!: string | null;
}

export class ProjectInfoDto {
  @ApiProperty()
  ClientHeading!: string;

  @ApiProperty({ type: [CompanyInfoItemDto] })
  CompanyInfo!: CompanyInfoItemDto[];

  @ApiProperty()
  ObjectivesHeading!: string;

  @ApiProperty()
  ObjectivesDetails!: string;

  @ApiProperty({ type: [TechnologyGroupDto] })
  Technologies!: TechnologyGroupDto[];

  @ApiProperty()
  ProjectDetailsHeading!: string;

  @ApiProperty({ type: [ProjectDetailItemDto] })
  ProjectDetails!: ProjectDetailItemDto[];

  @ApiProperty()
  SocialSharingHeading!: string;

  // Phase 2 — 빈 배열 / null 이면 web 에서 섹션 미렌더.
  @ApiProperty({ type: [ProjectStatItemDto] })
  Impact!: ProjectStatItemDto[];

  @ApiProperty({ type: ProjectQuoteItemDto, required: false, nullable: true })
  Quote!: ProjectQuoteItemDto | null;
}

export class ProjectDetailDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  url!: string;

  @ApiProperty()
  category!: string;

  @ApiProperty()
  img!: string;

  // Phase 2 — Hero subtitle / accent 명시 필드. 미입력이면 null.
  @ApiProperty({ required: false, nullable: true })
  heroSubtitle!: string | null;

  @ApiProperty({ required: false, nullable: true })
  heroAccentWord!: string | null;

  @ApiProperty({ type: ProjectHeaderDto })
  ProjectHeader!: ProjectHeaderDto;

  @ApiProperty({ type: [ProjectImageDto] })
  ProjectImages!: ProjectImageDto[];

  @ApiProperty({ type: ProjectInfoDto })
  ProjectInfo!: ProjectInfoDto;
}
