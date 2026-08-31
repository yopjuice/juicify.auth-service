import { DatabaseProvider } from '../../../infrastructure/db/db.provider';
import {  Mock } from 'vitest';

export const createDatabaseProviderMock = (): Record<
  keyof DatabaseProvider,
  Mock
> => ({
  query: vi.fn(),
  queryOne: vi.fn(),
  onApplicationShutdown: vi.fn(),
  run: vi.fn(),
  runOne: vi.fn(),
  runInTransaction: vi.fn(),
});
