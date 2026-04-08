import { Injectable } from '@nestjs/common';
import { HealthRepository } from './health.repository';

@Injectable()
export class HealthService {
  constructor(private readonly healthRepository: HealthRepository) {}

  getHello(): string {
    return this.healthRepository.getHelloMessage();
  }

  getHealth(): { status: string; checkedAt: string } {
    return this.healthRepository.getStatus();
  }
}
