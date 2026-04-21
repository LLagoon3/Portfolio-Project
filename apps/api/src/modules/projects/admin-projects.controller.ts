import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpsertProjectDto } from './dto/upsert-project.dto';
import { ProjectDetailDto } from './dto/project-detail.dto';
import { AdminProjectsService } from './admin-projects.service';

@ApiTags('Admin · Projects')
@Controller('api/admin/projects')
@UseGuards(JwtAuthGuard)
export class AdminProjectsController {
  constructor(private readonly adminProjectsService: AdminProjectsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'id 기반 단건 조회 (편집 프리필 용)' })
  @ApiResponse({ status: 200, type: ProjectDetailDto })
  @ApiResponse({ status: 404 })
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProjectDetailDto> {
    return this.adminProjectsService.getById(id);
  }

  @Post()
  @ApiOperation({ summary: '프로젝트 생성' })
  @ApiResponse({ status: 201, type: ProjectDetailDto })
  async create(@Body() dto: UpsertProjectDto): Promise<ProjectDetailDto> {
    return this.adminProjectsService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: '프로젝트 수정 (관계 자식 전체 교체)' })
  @ApiResponse({ status: 200, type: ProjectDetailDto })
  @ApiResponse({ status: 404 })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpsertProjectDto,
  ): Promise<ProjectDetailDto> {
    return this.adminProjectsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: '프로젝트 삭제 (연관 row CASCADE)' })
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 404 })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.adminProjectsService.remove(id);
  }
}
