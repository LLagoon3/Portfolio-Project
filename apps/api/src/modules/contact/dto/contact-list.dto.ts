import { ApiProperty } from '@nestjs/swagger';
import { ContactStatus } from '../entities/contact-submission.entity';

export class ContactListItemDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty({ nullable: true })
  subject!: string | null;

  @ApiProperty({
    nullable: true,
    description: 'Bold 폼의 topic chip 선택값',
  })
  topic!: string | null;

  @ApiProperty({ enum: ContactStatus })
  status!: ContactStatus;

  @ApiProperty()
  createdAt!: Date;
}

export class ContactListPageDto {
  @ApiProperty({ type: [ContactListItemDto] })
  items!: ContactListItemDto[];

  @ApiProperty()
  total!: number;

  @ApiProperty()
  page!: number;

  @ApiProperty()
  limit!: number;
}

export class ContactDetailDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty({ nullable: true })
  subject!: string | null;

  @ApiProperty({
    nullable: true,
    description: 'Bold 폼의 topic chip 선택값',
  })
  topic!: string | null;

  @ApiProperty()
  message!: string;

  @ApiProperty({ enum: ContactStatus })
  status!: ContactStatus;

  @ApiProperty()
  createdAt!: Date;
}
