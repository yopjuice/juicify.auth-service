export interface JwtPayload {
  sub: string;    // user's id
  email: string;
  role: string;
  tokenId?: string;
}
