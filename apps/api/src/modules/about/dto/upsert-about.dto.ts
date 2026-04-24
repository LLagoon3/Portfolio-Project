import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

const trimIfString = (value: unknown): unknown =>
  typeof value === 'string' ? value.trim() : value;

const trimArray = (value: unknown): unknown =>
  Array.isArray(value) ? value.map(trimIfString) : value;

// 빈 문자열·공백-only 는 null 로 정규화 (선택 필드 공통 규칙).
const trimToNull = (value: unknown): unknown => {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
};

export class UpsertAboutDto {
  @ApiProperty({ maxLength: 100 })
  @Transform(({ value }) => trimIfString(value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @ApiProperty({ maxLength: 255, nullable: true, required: false })
  @Transform(({ value }) => trimToNull(value))
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

  @ApiProperty({ maxLength: 255, nullable: true, required: false })
  @Transform(({ value }) => trimToNull(value))
  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string | null;

  @ApiProperty({ maxLength: 255, nullable: true, required: false })
  @Transform(({ value }) => trimToNull(value))
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string | null;

  @ApiProperty({ maxLength: 50, nullable: true, required: false })
  @Transform(({ value }) => trimToNull(value))
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string | null;
}
