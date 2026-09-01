export interface TokenProps {
  id: string;
  tokenHash: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Token {
  // Real data is secured
  private props: TokenProps;

  constructor(props: TokenProps) {
    this.props = props;
  }
  // Getters and setters for props

  public get id(): string {
    return this.props.id;
  }
  public get tokenHash(): string {
    return this.props.tokenHash;
  }
  public get userId(): string {
    return this.props.userId;
  }
  public get createdAt(): Date {
    return this.props.createdAt;
  }
  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

}
