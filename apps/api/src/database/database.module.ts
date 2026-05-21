import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from '../config/database.config';

@Module({
  imports: [
    ConfigModule.forFeature(databaseConfig),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.username'),
        password: config.get<string>('database.password'),
        database: config.get<string>('database.database'),
        autoLoadEntities: true,
        synchronize: config.get<boolean>('database.synchronize'),
        // database.config.ts 에 정의된 migrations / migrationsRun 옵션을 useFactory
        // 반환 객체에 포함시켜야 typeorm 이 인식한다 (이전엔 누락되어 컨테이너
        // 부팅 시 pending migration 자동 실행이 동작하지 않았음).
        migrations: config.get<string[]>('database.migrations'),
        migrationsRun: config.get<boolean>('database.migrationsRun'),
      }),
    }),
  ],
})
export class DatabaseModule {}
