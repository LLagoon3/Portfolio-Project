import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateContactDto {
  @ApiProperty({ example: '홍길동', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @ApiProperty({ example: 'hong@example.com', maxLength: 255 })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email!: string;

  // 기존 자유 입력 폼 호환. Bold 폼에서는 미수집이라 옵셔널.
  @ApiProperty({
    example: '프로젝트 협업 문의',
    maxLength: 200,
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  subject?: string | null;

  // Bold 폼의 topic chip 선택값 ('신입 채용' / '외주 · 협업' / '기술 잡담' / '기타' 등).
  @ApiProperty({
    example: '신입 채용',
    maxLength: 50,
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  topic?: string | null;

  @ApiProperty({ example: '안녕하세요, 프로젝트 관련 문의드립니다.' })
  @IsString()
  @IsNotEmpty()
  message!: string;
}
