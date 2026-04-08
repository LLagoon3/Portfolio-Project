import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  getHello(): string {
    return this.healthService.getHello();
  }

  @Get('health')
  getHealth(): { status: string; checkedAt: string } {
    return this.healthService.getHealth();
  }
}
