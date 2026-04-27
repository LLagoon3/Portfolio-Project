import { ApiProperty } from '@nestjs/swagger';

export class AboutResponseDto {
  @ApiProperty({ example: 'Lagoon' })
  name!: string;

  @ApiProperty({
    example: 'Backend Developer',
    nullable: true,
    required: false,
  })
  tagline!: string | null;

  @ApiProperty({ example: '/images/profile.jpeg' })
  profileImage!: string;

  @ApiProperty({
    type: [String],
    example: ['첫 단락...', '두 단락...'],
    description: 'sort_order 오름차순으로 정렬된 소개 단락들. 마크다운 허용.',
  })
  bio!: string[];

  @ApiProperty({ example: 'Seoul, South Korea', nullable: true, required: false })
  address!: string | null;

  @ApiProperty({ example: 'me@example.com', nullable: true, required: false })
  email!: string | null;

  @ApiProperty({ example: '+82 10-1234-5678', nullable: true, required: false })
  phone!: string | null;
}
