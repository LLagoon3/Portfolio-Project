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

  @ApiProperty({ type: ProjectHeaderDto })
  ProjectHeader!: ProjectHeaderDto;

  @ApiProperty({ type: [ProjectImageDto] })
  ProjectImages!: ProjectImageDto[];

  @ApiProperty({ type: ProjectInfoDto })
  ProjectInfo!: ProjectInfoDto;
}
