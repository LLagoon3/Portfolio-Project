import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
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

// Bold 리디자인 후속 — 신규 nested DTO 4개.

export class UpsertStatDto {
  @ApiProperty({ maxLength: 100 })
  @Transform(({ value }) => trimIfString(value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  label!: string;

  @ApiProperty({ maxLength: 100 })
  @Transform(({ value }) => trimIfString(value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  value!: string;

  @ApiProperty({ maxLength: 255, nullable: true, required: false })
  @Transform(({ value }) => trimToNull(value))
  @IsOptional()
  @IsString()
  @MaxLength(255)
  sub?: string | null;
}

export class UpsertPrincipleDto {
  @ApiProperty({ maxLength: 200 })
  @Transform(({ value }) => trimIfString(value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @ApiProperty()
  @Transform(({ value }) => trimIfString(value))
  @IsString()
  @IsNotEmpty()
  body!: string;
}

export class UpsertJourneyDto {
  @ApiProperty({ maxLength: 100, description: '자유 표현 — "2026.01 — Now" 등' })
  @Transform(({ value }) => trimIfString(value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  year!: string;

  @ApiProperty({ maxLength: 200 })
  @Transform(({ value }) => trimIfString(value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @ApiProperty({ maxLength: 200, nullable: true, required: false })
  @Transform(({ value }) => trimToNull(value))
  @IsOptional()
  @IsString()
  @MaxLength(200)
  role?: string | null;

  @ApiProperty()
  @Transform(({ value }) => trimIfString(value))
  @IsString()
  @IsNotEmpty()
  body!: string;
}

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

  // Bold 리디자인 후속 — 5개 신규 필드. 모두 optional / 빈 배열 default.

  @ApiProperty({ maxLength: 255, nullable: true, required: false })
  @Transform(({ value }) => trimToNull(value))
  @IsOptional()
  @IsString()
  @MaxLength(255)
  availability?: string | null;

  @ApiProperty({ type: [UpsertStatDto], required: false })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => UpsertStatDto)
  stats?: UpsertStatDto[];

  @ApiProperty({ type: [UpsertPrincipleDto], required: false })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => UpsertPrincipleDto)
  principles?: UpsertPrincipleDto[];

  @ApiProperty({ type: [UpsertJourneyDto], required: false })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => UpsertJourneyDto)
  journey?: UpsertJourneyDto[];

  @ApiProperty({ type: [String], required: false })
  @Transform(({ value }) => trimArray(value))
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(30)
  @IsString({ each: true })
  stacks?: string[];
}
