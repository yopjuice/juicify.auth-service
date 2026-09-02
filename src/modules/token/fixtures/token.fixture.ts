import {
  TokenMapper,
  DbToken,
} from '../../../infrastructure/token/token.mapper';
import { AuthTokens } from '../interfaces/token.interface';
import { TokenProps } from '../token.entity';
import { Token } from '../token.entity';

// Default database object
const baseDbToken = {
  id: '5176cfd5-954f-46a1-bdb5-b4006a24ffcd',
  token_hash: '$2a$10$5.w3/8.8/6.6',
  user_id: '5176cfd5-954f-46a1-bdb5-b4006a24ffcd',
  created_at: new Date('1970-01-01T00:00:00.000Z'),
  updated_at: new Date('1970-01-01T00:00:00.000Z'),
} as const;

export const TokenFixtures = {
  // Get valid UUID
  uuid: (): string => baseDbToken.id,
  // Generates an Token entity
  entity: (overrides?: Partial<DbToken>): Token =>
    TokenMapper.toDomain({
      ...baseDbToken,
      ...overrides,
    }),

  password: () => 'my-password123',

  // Generates arrays of Token entities for bulk CRUD operations
  array: (count = 2): Token[] =>
    Array.from({ length: count }, (_, i) =>
      TokenMapper.toDomain({
        ...baseDbToken,
        id: `5176cfd5-954f-46a1-bdb5-b4006a24ffc${i}`,
      }),
    ),

  // Generates a raw database object
  raw: (override?: Partial<DbToken>): DbToken => ({
    ...baseDbToken,
    ...override,
  }),

  tokens: (): AuthTokens => ({accessToken: 'accessToken', refreshToken: 'refreshToken'}),

  // Generates an array of raw database objects
  rawArray: (count = 2): DbToken[] =>
    Array.from({ length: count }, (_, i) =>
      TokenFixtures.raw({
        ...baseDbToken,
        id: `5176cfd5-954f-46a1-bdb5-b4006a24ffc${i}`,
      }),
    ),

  // Generates Token entity props
  props: (overrides?: Partial<TokenProps>): TokenProps => ({
    id: '5176cfd5-954f-46a1-bdb5-b4006a24ffcd',
    tokenHash: '$ejm$10$5.w3/8.8/6.6',
    userId: '5176cfd5-954f-46a1-bdb5-b4006a24ffcd',
    createdAt: new Date('1970-01-01T00:00:00.000Z'),
    updatedAt: new Date('1970-01-01T00:00:00.000Z'),
    ...overrides,
  }),
};
