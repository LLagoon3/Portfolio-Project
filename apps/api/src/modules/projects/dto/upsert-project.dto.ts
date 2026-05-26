import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

// About 의 trim helper 와 동일 패턴 (apps/api/src/modules/about/dto/upsert-about.dto.ts:14-25).
// 후속에 apps/api/src/common/dto/transforms.ts 같은 공용 위치로 lift 검토.
const trimIfString = (value: unknown): unknown =>
  typeof value === 'string' ? value.trim() : value;

// 빈 문자열·공백-only 는 null 로 정규화 (선택 필드 공통 규칙).
const trimToNull = (value: unknown): unknown => {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
};

export class UpsertImageDto {
  @ApiProperty({ maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @ApiProperty({ maxLength: 500 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  img!: string;
}

export class UpsertCompanyInfoDto {
  @ApiProperty({ maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title!: string;

  @ApiProperty({ maxLength: 500 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  details!: string;
}

export class UpsertTechnologyGroupDto {
  @ApiProperty({ maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayMaxSize(100)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @MaxLength(100, { each: true })
  techs!: string[];
}

export class UpsertProjectDetailDto {
  // Phase 2 후속 — admin 이 명시하면 1 entry = 1 step. 비우면 web 의 parseProcessSteps
  // 가 details 의 h2 split + 키워드 매칭 폴백으로 처리.
  @ApiProperty({ maxLength: 50, required: false, nullable: true, example: 'DECISION' })
  @Transform(({ value }) => trimToNull(value))
  @IsOptional()
  @IsString()
  @MaxLength(50)
  kind?: string | null;

  @ApiProperty({ maxLength: 200, required: false, nullable: true })
  @Transform(({ value }) => trimToNull(value))
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string | null;

  @ApiProperty({ description: '마크다운 허용. 신규 entry 는 body. 기존 entry 는 h2 split 폴백' })
  @Transform(({ value }) => trimIfString(value))
  @IsString()
  @IsNotEmpty()
  details!: string;
}

export class UpsertProjectStatDto {
  @ApiProperty({ maxLength: 100, example: 'Latency' })
  @Transform(({ value }) => trimIfString(value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  label!: string;

  @ApiProperty({ maxLength: 100, example: '-72%' })
  @Transform(({ value }) => trimIfString(value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  value!: string;

  @ApiProperty({ maxLength: 255, required: false, nullable: true })
  @Transform(({ value }) => trimToNull(value))
  @IsOptional()
  @IsString()
  @MaxLength(255)
  sub?: string | null;
}

export class UpsertProjectQuoteDto {
  @ApiProperty({ description: '인용문 본문' })
  @Transform(({ value }) => trimIfString(value))
  @IsString()
  @IsNotEmpty()
  text!: string;

  @ApiProperty({ maxLength: 200, required: false, nullable: true })
  @Transform(({ value }) => trimToNull(value))
  @IsOptional()
  @IsString()
  @MaxLength(200)
  author?: string | null;
}

export class UpsertProjectDto {
  @ApiProperty({ maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @ApiProperty({ maxLength: 200, description: 'URL slug' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  url!: string;

  @ApiProperty({ maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  category!: string;

  @ApiProperty({ maxLength: 500 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  thumbnailImg!: string;

  @ApiProperty({ maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  headerPublishDate!: string;

  @ApiProperty({ maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  headerTags!: string;

  @ApiProperty({ maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  clientHeading!: string;

  @ApiProperty({ maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  objectivesHeading!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  objectivesDetails!: string;

  @ApiProperty({ maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  projectDetailsHeading!: string;

  @ApiProperty({ maxLength: 200, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  socialSharingHeading?: string;

  // Phase 2 — 모두 optional. 미입력 시 UI 폴백/미노출.
  @ApiProperty({ maxLength: 255, required: false, nullable: true })
  @Transform(({ value }) => trimToNull(value))
  @IsOptional()
  @IsString()
  @MaxLength(255)
  heroSubtitle?: string | null;

  @ApiProperty({ maxLength: 100, required: false, nullable: true })
  @Transform(({ value }) => trimToNull(value))
  @IsOptional()
  @IsString()
  @MaxLength(100)
  heroAccentWord?: string | null;

  @ApiProperty({ type: UpsertProjectQuoteDto, required: false, nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpsertProjectQuoteDto)
  quote?: UpsertProjectQuoteDto | null;

  @ApiProperty({ type: [UpsertProjectStatDto], required: false, maxItems: 3 })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(3)
  @ValidateNested({ each: true })
  @Type(() => UpsertProjectStatDto)
  stats?: UpsertProjectStatDto[];

  @ApiProperty({ type: [UpsertImageDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpsertImageDto)
  images!: UpsertImageDto[];

  @ApiProperty({ type: [UpsertCompanyInfoDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpsertCompanyInfoDto)
  companyInfo!: UpsertCompanyInfoDto[];

  @ApiProperty({ type: [UpsertTechnologyGroupDto], minItems: 1 })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UpsertTechnologyGroupDto)
  technologies!: UpsertTechnologyGroupDto[];

  @ApiProperty({ type: [UpsertProjectDetailDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpsertProjectDetailDto)
  details!: UpsertProjectDetailDto[];
}
