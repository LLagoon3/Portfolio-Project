import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ListProjectsQueryDto {
  @ApiPropertyOptional({
    example: 'Web Application',
    description: '카테고리 필터',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;
}
