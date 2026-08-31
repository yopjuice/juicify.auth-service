export const Role = {
  User: 'USER',
  Admin: 'ADMIN',
} as const;

export type Role = typeof Role[keyof typeof Role];

export interface UserProps {
  id: string;
  name: string;
  phone?: string;
  email: string;
  password?: string;
  role: Role;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  // Real data is secured
  private props: UserProps;

  constructor(props: UserProps) {
    this.props = props;
  }
  // Getters and setters for props

  public get id(): string {
    return this.props.id;
  }
  public get name(): string {
    return this.props.name;
  }
  public get phone(): string | undefined {
    return this.props.phone;
  }
  public get email(): string {
    return this.props.email;
  }
  public get password(): string | undefined {
    return this.props.password;
  }
  public get role(): Role {
    return this.props.role;
  }
  public get isPhoneVerified(): boolean {
    return this.props.isPhoneVerified;
  }
  public get isEmailVerified(): boolean {
    return this.props.isEmailVerified;
  }
  public get createdAt(): Date {
    return this.props.createdAt;
  }
  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public changeName(newName: string): void {
    if (newName.length < 3)
      throw new Error('Name must be at least 3 characters long');
    this.props.name = newName;
  }

  public verifyPhone(): void {
    if (this.props.isPhoneVerified) return;
    this.props.isPhoneVerified = true;
  }

  public verifyEmail(): void {
    if (this.props.isEmailVerified) return;
    this.props.isEmailVerified = true;
  }
}
