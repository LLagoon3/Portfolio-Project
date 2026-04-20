import { registerAs } from '@nestjs/config';
import { join } from 'node:path';

const isCompiled = __filename.endsWith('.js');
const srcExt = isCompiled ? 'js' : 'ts';

export default registerAs('database', () => ({
  type: 'mysql' as const,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '3307', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  autoLoadEntities: true,
  synchronize: false,
  migrations: [join(__dirname, '..', 'database', 'migrations', `*.${srcExt}`)],
  migrationsRun: true,
}));
