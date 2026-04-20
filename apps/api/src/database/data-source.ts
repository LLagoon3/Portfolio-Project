import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { join } from 'node:path';

const isCompiled = __filename.endsWith('.js');
const srcExt = isCompiled ? 'js' : 'ts';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST ?? '127.0.0.1',
  port: parseInt(process.env.DB_PORT ?? '3307', 10),
  username: process.env.DB_USERNAME ?? 'portfolio',
  password: process.env.DB_PASSWORD ?? 'portfolio_secret',
  database: process.env.DB_DATABASE ?? 'portfolio',
  entities: [join(__dirname, '..', 'modules', '**', `*.entity.${srcExt}`)],
  migrations: [join(__dirname, 'migrations', `*.${srcExt}`)],
  synchronize: false,
  migrationsRun: false,
});
