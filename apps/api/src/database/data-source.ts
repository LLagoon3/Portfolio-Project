import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { join } from 'node:path';

const isCompiled = __filename.endsWith('.js');
const srcExt = isCompiled ? 'js' : 'ts';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `환경변수 ${name} 가 필요합니다. CLI 경로에서도 런타임과 동일한 DB 접속값을 명시적으로 주입하세요.`,
    );
  }
  return value;
}

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: requireEnv('DB_HOST'),
  port: parseInt(requireEnv('DB_PORT'), 10),
  username: requireEnv('DB_USERNAME'),
  password: requireEnv('DB_PASSWORD'),
  database: requireEnv('DB_DATABASE'),
  entities: [join(__dirname, '..', 'modules', '**', `*.entity.${srcExt}`)],
  migrations: [join(__dirname, 'migrations', `*.${srcExt}`)],
  synchronize: false,
  migrationsRun: false,
});
