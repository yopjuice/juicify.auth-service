import { registerAs } from '@nestjs/config';
import { validateEnv } from '../../shared/utils/validate-env';
import type { DatabaseConfig } from '../interfaces/database.interface';
import { DatabaseValidator } from '../validators/database.validator';

// Loader for database env
export const databaseEnv = registerAs<DatabaseConfig>('database', () => {
  const env = validateEnv(process.env, DatabaseValidator);
  return {
    url: env.DATABASE_URL,
    host: env.DATABASE_HOST,
    port: env.DATABASE_PORT,
    user: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    db: env.DATABASE_DB,
  };
});
