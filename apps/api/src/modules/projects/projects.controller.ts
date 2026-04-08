import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { ListProjectsQueryDto } from './dto/list-projects-query.dto';
import { ProjectListItemDto } from './dto/project-list-item.dto';
import { ProjectDetailDto } from './dto/project-detail.dto';

@ApiTags('Projects')
@Controller('api/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: '프로젝트 목록 조회 (카테고리 필터 지원)' })
  @ApiResponse({ status: 200, type: [ProjectListItemDto] })
  async list(
    @Query() query: ListProjectsQueryDto,
  ): Promise<ProjectListItemDto[]> {
    return this.projectsService.list(query);
  }

  @Get(':url')
  @ApiOperation({ summary: '프로젝트 단건 조회 (slug 기반)' })
  @ApiResponse({ status: 200, type: ProjectDetailDto })
  @ApiResponse({ status: 404, description: '프로젝트를 찾을 수 없음' })
  async getByUrl(@Param('url') url: string): Promise<ProjectDetailDto> {
    return this.projectsService.getByUrl(url);
  }
}
