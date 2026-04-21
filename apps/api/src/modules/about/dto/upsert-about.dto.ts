import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

const trimIfString = (value: unknown): unknown =>
  typeof value === 'string' ? value.trim() : value;

const trimArray = (value: unknown): unknown =>
  Array.isArray(value) ? value.map(trimIfString) : value;

export class UpsertAboutDto {
  @ApiProperty({ maxLength: 100 })
  @Transform(({ value }) => trimIfString(value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @ApiProperty({ maxLength: 255, nullable: true, required: false })
  @Transform(({ value }) => {
    // 빈 문자열/공백-only 는 명시적으로 null 로 정규화 (tagline 은 null 허용)
    if (typeof value !== 'string') return value;
    const trimmed = value.trim();
    return trimmed.length === 0 ? null : trimmed;
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  tagline?: string | null;

  @ApiProperty({ maxLength: 500 })
  @Transform(({ value }) => trimIfString(value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  profileImage!: string;

  @ApiProperty({ type: [String], description: '마크다운 허용, 입력 순서가 sort_order' })
  @Transform(({ value }) => trimArray(value))
  @IsArray()
  @ArrayMaxSize(50)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  bio!: string[];
}
