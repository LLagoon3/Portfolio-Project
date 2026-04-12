import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';

@ApiTags('Contact')
@Controller('api/contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '연락처 폼 제출' })
  @ApiResponse({ status: 201, description: '제출 성공' })
  @ApiResponse({ status: 400, description: '유효성 검사 실패' })
  async submit(@Body() dto: CreateContactDto) {
    return this.contactService.submit(dto);
  }
}
