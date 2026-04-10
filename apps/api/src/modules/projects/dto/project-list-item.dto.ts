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
}
