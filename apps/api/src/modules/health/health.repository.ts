import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class HealthRepository {
  constructor(private readonly dataSource: DataSource) {}

  getHelloMessage(): string {
    return 'Portfolio API is running.';
  }

  async getStatus(): Promise<{ status: string; database: string; checkedAt: string }> {
    let database = 'disconnected';
    try {
      await this.dataSource.query('SELECT 1');
      database = 'connected';
    } catch {
      database = 'disconnected';
    }
    return { status: 'ok', database, checkedAt: new Date().toISOString() };
  }
}
