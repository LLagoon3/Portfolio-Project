import { Injectable } from '@nestjs/common';

/**
 * 레이어드 아키텍처 예시를 위한 Repository 계층.
 * 현재는 DB 없이 인메모리/상수 값을 반환한다.
 * 추후 ORM(Prisma/TypeORM 등) 도입 시 이 계층만 교체하면 된다.
 */
@Injectable()
export class HealthRepository {
  getHelloMessage(): string {
    return 'Portfolio API is running.';
  }

  getStatus(): { status: string; checkedAt: string } {
    return { status: 'ok', checkedAt: new Date().toISOString() };
  }
}
