import { ApiProperty } from '@nestjs/swagger';

export class ProjectListItemDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Google Health Platform' })
  title!: string;

  @ApiProperty({ example: 'google-health-platform' })
  url!: string;

  @ApiProperty({ example: 'Web Application' })
  category!: string;

  @ApiProperty({ example: '/images/web-project-2.jpg' })
  img!: string;

  @ApiProperty({ example: '2026.01 – 2026.03', description: 'Bold 리스트의 연도 stat/그룹/뱃지에 사용. web 에서 첫 4자리를 파싱.' })
  headerPublishDate!: string;
}
