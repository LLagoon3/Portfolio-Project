import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

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
  techs!: string[];
}

export class UpsertProjectDetailDto {
  @ApiProperty({ description: '마크다운 허용' })
  @IsString()
  @IsNotEmpty()
  details!: string;
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

  @ApiProperty({ type: [UpsertTechnologyGroupDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpsertTechnologyGroupDto)
  technologies!: UpsertTechnologyGroupDto[];

  @ApiProperty({ type: [UpsertProjectDetailDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpsertProjectDetailDto)
  details!: UpsertProjectDetailDto[];
}
