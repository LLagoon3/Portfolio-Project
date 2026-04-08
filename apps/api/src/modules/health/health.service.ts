import { Injectable } from '@nestjs/common';
import { HealthRepository } from './health.repository';

@Injectable()
export class HealthService {
  constructor(private readonly healthRepository: HealthRepository) {}

  getHello(): string {
    return this.healthRepository.getHelloMessage();
  }

  async getHealth(): Promise<{ status: string; database: string; checkedAt: string }> {
    return this.healthRepository.getStatus();
  }
}
