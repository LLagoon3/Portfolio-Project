import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AboutService } from './about.service';
import { AboutResponseDto } from './dto/about-response.dto';

@ApiTags('About')
@Controller('api/about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Get()
  @ApiOperation({ summary: '자기소개 조회 (singleton)' })
  @ApiResponse({ status: 200, type: AboutResponseDto })
  @ApiResponse({
    status: 404,
    description: 'About 프로필이 아직 등록되지 않음',
  })
  async get(): Promise<AboutResponseDto> {
    return this.aboutService.get();
  }
}
