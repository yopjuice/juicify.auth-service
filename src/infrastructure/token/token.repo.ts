import { Injectable } from '@nestjs/common';
import { buildUpdateQuery } from '../../shared/utils/sql-update-builder';
import { Token } from '../../modules/token/token.entity';
import { TokenMapper, DbToken } from './token.mapper';
import { DatabaseProvider } from '../db/db.provider';
import { EntityNotFoundError } from '../../shared/errors/domain-errors';
import { tokenFindById } from '../../../sql/queries/generated/token.findById.types';
import { tokenCreate } from '../../../sql/queries/generated/token.create.types';
import { tokenDelete } from '../../../sql/queries/generated/token.delete.types';
import { tokenFindByUser } from '../../../sql/queries/generated/token.findByUser.types';
import { tokenDeleteByUser } from '../../../sql/queries/generated/token.deleteByUser.types';

@Injectable()
export class TokenRepo {
  constructor(
    private readonly db: DatabaseProvider,
  ) { }

  async findByUser(): Promise<Token[]> {
    const rows = await this.db.run(tokenFindByUser);
    return rows.map((row) => TokenMapper.toDomain(row));
  }

  async create(userId: string, tokenHash: string): Promise<Token> {
    const row = await this.db.runOne(tokenCreate, {
      token_hash: tokenHash,
      userId,
    }) as DbToken;
    return TokenMapper.toDomain(row);
  }

  async findById(id: string): Promise<Token | null> {
    const result = await this.db.runOne(tokenFindById, { id });
    if (!result) return null;
    return TokenMapper.toDomain(result);
  }

  // DELETE
  async delete(id: string): Promise<boolean> {
    const existingToken = await this.findById(id);

    if (!existingToken) {
      throw new EntityNotFoundError('token');
    }

    await this.db.runOne(tokenDelete, { id })
    return true;
  }

  async deleteByUser(userId: string): Promise<boolean> {
    await this.db.runOne(tokenDeleteByUser, { userId });
    return true;
  }

  // PARTIAL UPDATE
  async update(id: string, tokenHash: string): Promise<Token> {
    const existingToken = await this.findById(id);

    if (!existingToken) {
      throw new EntityNotFoundError('token');
    }
    const { query, values } = buildUpdateQuery({
      table: 'tokens',
      data: { id, tokenHash },
      where: { id },
    });

    const result = (await this.db.queryOne<DbToken>(
      query,
      values,
    )) as DbToken;
    return TokenMapper.toDomain(result);
  }
}
