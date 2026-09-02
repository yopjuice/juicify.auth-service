import { registerAs } from '@nestjs/config';
import { validateEnv } from '../../shared/utils/validate-env';
import type { JwtConfig } from '../interfaces/jwt.interface';
import { JwtValidator } from '../validators/jwt.validator';

// Loader for jwt env
export const jwtEnv = registerAs<JwtConfig>('jwt', () => {
  const env = validateEnv(process.env, JwtValidator);
  return {
    accessSecret: env.JWT_ACCESS_SECRET,
    accessExpiresIn: env.JWT_ACCESS_EXPIRES_IN,
    refreshSecret: env.JWT_REFRESH_SECRET,
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
  };
});
