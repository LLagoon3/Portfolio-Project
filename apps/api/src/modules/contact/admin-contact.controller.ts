import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminContactService } from './admin-contact.service';
import {
  ContactDetailDto,
  ContactListPageDto,
} from './dto/contact-list.dto';
import { ListContactQueryDto } from './dto/list-contact-query.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@ApiTags('Admin · Contact')
@Controller('api/admin/contact')
@UseGuards(JwtAuthGuard)
export class AdminContactController {
  constructor(private readonly adminContactService: AdminContactService) {}

  @Get()
  @ApiOperation({ summary: '연락 폼 제출 목록 (status 필터 + 페이지네이션)' })
  @ApiResponse({ status: 200, type: ContactListPageDto })
  async list(
    @Query() query: ListContactQueryDto,
  ): Promise<ContactListPageDto> {
    return this.adminContactService.list(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '연락 폼 단건 조회 (본문 message 포함)' })
  @ApiResponse({ status: 200, type: ContactDetailDto })
  @ApiResponse({ status: 404 })
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ContactDetailDto> {
    return this.adminContactService.getById(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'status 토글 (pending / read / replied)' })
  @ApiResponse({ status: 200, type: ContactDetailDto })
  @ApiResponse({ status: 404 })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStatusDto,
  ): Promise<ContactDetailDto> {
    return this.adminContactService.updateStatus(id, dto);
  }
}
