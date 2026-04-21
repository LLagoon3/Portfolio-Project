import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminAboutService } from './admin-about.service';
import { AboutResponseDto } from './dto/about-response.dto';
import { UpsertAboutDto } from './dto/upsert-about.dto';

@ApiTags('Admin · About')
@Controller('api/admin/about')
@UseGuards(JwtAuthGuard)
export class AdminAboutController {
  constructor(private readonly adminAboutService: AdminAboutService) {}

  @Put()
  @ApiOperation({ summary: '자기소개 전체 덮어쓰기 (singleton)' })
  @ApiResponse({ status: 200, type: AboutResponseDto })
  async upsert(@Body() dto: UpsertAboutDto): Promise<AboutResponseDto> {
    return this.adminAboutService.upsert(dto);
  }
}
