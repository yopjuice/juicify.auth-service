import { User as DomainUser } from '../../modules/user/user.entity';
import { Role } from '../../modules/user/user.entity';

// Database object interface
export interface DbUser {
  id: string;
  name: string;
  phone: string | null;
  email: string;
  password_hash: string | null;
  role: Role;
  is_phone_verified: boolean;
  is_email_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

export class UserMapper {
  // From Database to Domain
  public static toDomain(raw: DbUser): DomainUser {
    return new DomainUser({
      id: raw.id,
      name: raw.name,
      phone: raw.phone ?? undefined,
      email: raw.email,
      password: raw.password_hash ?? undefined,
      role: raw.role,
      isPhoneVerified: raw.is_phone_verified,
      isEmailVerified: raw.is_email_verified,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
    });
  }

  // From Domain to Database
  public static toPersistence(domain: DomainUser): DbUser {
    return {
      id: domain.id,
      name: domain.name,
      phone: domain.phone ?? null,
      email: domain.email,
      password_hash: domain.password ?? null,
      role: domain.role,
      is_phone_verified: domain.isPhoneVerified,
      is_email_verified: domain.isEmailVerified,
      created_at: domain.createdAt,
      updated_at: domain.updatedAt,
    };
  }
}
