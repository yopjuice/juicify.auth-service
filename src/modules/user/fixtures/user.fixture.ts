import {
  UserMapper,
  DbUser,
} from '../../../infrastructure/user/user.mapper';
import { Role, UserProps } from '../user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../user.entity';
import { CreateUserDto } from '../dto/create-user.dto';

// Default database object
const baseDbUser = {
  id: '5176cfd5-954f-46a1-bdb5-b4006a24ffcd',
  name: 'juice11',
  phone: '+1 (555) 555-5555',
  email: 'juice11@juice11.com',
  password_hash: 'fjdkfj;alkj;4lkj',
  role: Role.User,
  is_phone_verified: false,
  is_email_verified: false,
  created_at: new Date('1970-01-01T00:00:00.000Z'),
  updated_at: new Date('1970-01-01T00:00:00.000Z'),
} as const;

export const UserFixtures = {
  // Get valid UUID
  uuid: (): string => baseDbUser.id,
  // Generates an User entity
  entity: (overrides?: Partial<DbUser>): User =>
    UserMapper.toDomain({
      ...baseDbUser,
      ...overrides,
    }),

  password: () => 'my-password123',

  // Generates an incoming gRPC DTO payload
  createDto: (overrides?: Partial<CreateUserDto>): CreateUserDto => ({
    name: baseDbUser.name,
    phone: baseDbUser.phone,
    email: baseDbUser.email,
    role: baseDbUser.role,
    password: UserFixtures.password(),
    ...overrides,
  }),

  // Generates an incoming gRPC DTO payload
  updateDto: (overrides?: Partial<UpdateUserDto>): UpdateUserDto => ({
    name: 'updated name',
    ...overrides,
  }),
  // Generates arrays of User entities for bulk CRUD operations
  array: (count = 2): User[] =>
    Array.from({ length: count }, (_, i) =>
      UserMapper.toDomain({
        ...baseDbUser,
        id: `5176cfd5-954f-46a1-bdb5-b4006a24ffc${i}`,
      }),
    ),

  // Generates a raw database object
  raw: (override?: Partial<DbUser>): DbUser => ({
    ...baseDbUser,
    ...override,
  }),

  // Generates an array of raw database objects
  rawArray: (count = 2): DbUser[] =>
    Array.from({ length: count }, (_, i) =>
      UserFixtures.raw({
        ...baseDbUser,
        id: `5176cfd5-954f-46a1-bdb5-b4006a24ffc${i}`,
      }),
    ),

  // Generates User entity props
  props: (overrides?: Partial<UserProps>): UserProps => ({
  id: '5176cfd5-954f-46a1-bdb5-b4006a24ffcd',
  name: 'juice11',
  phone: '+1 (555) 555-5555',
  email: 'juice11@juice11.com',
  password: 'fjdkfj;alkj;4lkj',
  role: Role.User,
  isPhoneVerified: false,
  isEmailVerified: false,
  createdAt: new Date('1970-01-01T00:00:00.000Z'),
  updatedAt: new Date('1970-01-01T00:00:00.000Z'),
    ...overrides,
  }),
};
