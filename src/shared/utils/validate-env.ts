import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { ValidationError } from '../errors/domain-errors';

// Validates object against class schema and returns safe object
export function validateEnv<T extends object>(
  config: Record<string, unknown>,
  cls: ClassConstructor<T>,
): T {
  const validatedConfig = plainToInstance(cls, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const msg = errors
      .map((e) => Object.values(e.constraints ?? {}).join(', '))
      .join('; ');
    throw new ValidationError(`Environment validation failed: ${msg}`);
  }
  return validatedConfig;
}
