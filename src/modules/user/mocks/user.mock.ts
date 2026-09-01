import { UserRepo } from '../../../infrastructure/user/user.repo';
import { UserService } from '../user.service';
import { Mock } from 'vitest';

export const createUserServiceMock = (): Record<
  keyof UserService,
  Mock
> => ({
  create: vi.fn(),
  findById: vi.fn(),
  findAll: vi.fn(),
  getById: vi.fn(),
  getByEmail: vi.fn(),
  findByEmail: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
});

export const createUserRepoMock = (): Record<
  keyof UserRepo,
  Mock
> => ({
  create: vi.fn(),
  findById: vi.fn(),
  findByEmail: vi.fn(),
  findAll: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
});
