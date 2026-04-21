import { ApiProperty } from '@nestjs/swagger';
import { ContactStatus } from '../entities/contact-submission.entity';

export class ContactListItemDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  subject!: string;

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

  @ApiProperty()
  subject!: string;

  @ApiProperty()
  message!: string;

  @ApiProperty({ enum: ContactStatus })
  status!: ContactStatus;

  @ApiProperty()
  createdAt!: Date;
}
