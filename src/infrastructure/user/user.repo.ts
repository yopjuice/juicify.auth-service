import { Injectable } from '@nestjs/common';
import { buildUpdateQuery } from '../../shared/utils/sql-update-builder';
import { UpdateUserDto } from '../../modules/user/dto/update-user.dto';
import { User } from '../../modules/user/user.entity';
import { UserMapper, DbUser } from './user.mapper';
import { DatabaseProvider } from '../db/db.provider';
import { CreateUserDto } from '../../modules/user/dto/create-user.dto';
import { EntityNotFoundError } from '../../shared/errors/domain-errors';
import { userFindById } from '../../../sql/queries/generated/user.findById.types';
import { userCreate } from '../../../sql/queries/generated/user.create.types';
import { userDelete } from '../../../sql/queries/generated/user.delete.types';
import { userFindAll } from '../../../sql/queries/generated/user.findall.types';
import { userFindByEmail } from '../../../sql/queries/generated/user.findByEmail.types';

@Injectable()
export class UserRepo {
  constructor(
    private readonly db: DatabaseProvider,
  ) { }

  async findAll(): Promise<User[]> {
    const rows = await this.db.run(userFindAll);
    return rows.map((row) => UserMapper.toDomain(row));
  }

  async create(dto: CreateUserDto): Promise<User> {
    const row = await this.db.runOne(userCreate, {
      name: dto.name,
      phone: dto.phone ?? null,
      email: dto.email,
      password_hash: dto.password,
      role: dto.role,
      is_phone_verified: false,
      is_email_verified: false,
    }) as DbUser;
    return UserMapper.toDomain(row);
  }

  async findById(id: string): Promise<User | null> {
    const result = await this.db.runOne(userFindById, { id });
    if (!result) return null;
    return UserMapper.toDomain(result);
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.db.runOne(userFindByEmail, { email });
    if (!result) return null;
    return UserMapper.toDomain(result);
  }

  // DELETE
  async delete (id: string): Promise < boolean > {
      const existingUser = await this.findById(id);

      if(!existingUser) {
        throw new EntityNotFoundError('user');
      }

    await this.db.runOne(userDelete, { id })
    return true;
    }

  // PARTIAL UPDATE
  async update(id: string, dto: UpdateUserDto): Promise < User > {
      const existingUser = await this.findById(id);

      if(!existingUser) {
        throw new EntityNotFoundError('user');
      }
    const { query, values } = buildUpdateQuery({
        table: 'users',
        data: dto,
        where: { id },
      });

      const result = (await this.db.queryOne<DbUser>(
        query,
        values,
      )) as DbUser;
      return UserMapper.toDomain(result);
    }
  }
