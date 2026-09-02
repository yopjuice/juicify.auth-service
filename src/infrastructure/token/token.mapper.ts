import { Token as DomainToken } from '../../modules/token/token.entity';

// Database object interface
export interface DbToken {
  id: string;
  token_hash: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}

export class TokenMapper {
  // From Database to Domain
  public static toDomain(raw: DbToken): DomainToken {
    return new DomainToken({
      id: raw.id,
      tokenHash: raw.token_hash,
      userId: raw.user_id,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
    });
  }

  // From Domain to Database
  public static toPersistence(domain: DomainToken): DbToken {
    return {
      id: domain.id,
      token_hash: domain.tokenHash,
      user_id: domain.userId,
      created_at: domain.createdAt,
      updated_at: domain.updatedAt,
    };
  }
}
