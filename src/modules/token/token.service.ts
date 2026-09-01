import { Injectable, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthTokens } from './interfaces/token.interface';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import * as bcrypt from 'bcrypt';
import { TokenRepo } from '../../infrastructure/token/token.repo';
import { MyConfigService } from '../../config/config.service';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private tokenRepo: TokenRepo,
    private configService: MyConfigService,
  ) { }

  async generateAndSaveTokens(userId: string, email: string, role: string): Promise<AuthTokens> {

    const token = await this.tokenRepo.create(userId, '');

    const { accessToken, refreshToken } = await this.generateTokens(userId, email, role, token.id);

    const hashedRt = await bcrypt.hash(refreshToken, 10);
    await this.tokenRepo.update(token.id, hashedRt);

    return { accessToken: accessToken, refreshToken: refreshToken };
  }

  async generateTokens(userId: string, email: string, role: string, tokenId: string): Promise<AuthTokens> {


    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync<JwtPayload>(
        { sub: userId, email, role } as JwtPayload,
        {
          secret: this.configService.get('jwt.accessSecret'),
          expiresIn: this.configService.get('jwt.accessExpiresIn') as any,
        },
      ),
      this.jwtService.signAsync<JwtPayload>(
        { sub: userId, email, role, tokenId },
        {
          secret: this.configService.get('jwt.refreshSecret'),
          expiresIn: this.configService.get('jwt.refreshExpiresIn') as any,
        }
      ),
    ]);

    return { accessToken: accessToken, refreshToken: refreshToken };
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
      secret: this.configService.get('jwt.refreshSecret'),
    });
    return payload;
  }

  async refreshTokens(tokenId: string, refreshToken: string, userId: string, email: string, role: string): Promise<AuthTokens> {
    const session = await this.tokenRepo.findById(tokenId);

    if (!session || !session.tokenHash) {
      throw new ForbiddenException('Access Denied / Invalid Session');
    }

    const rtMatches = await bcrypt.compare(refreshToken, session.tokenHash);
    if (!rtMatches) {
      throw new ForbiddenException('Access Denied / Invalid Token');
    }

    await this.tokenRepo.delete(tokenId);
    return this.generateAndSaveTokens(userId, email, role);
  }

  async delete(tokenId: string): Promise<void> {
    await this.tokenRepo.delete(tokenId);
  }

  async deleteByUser(userId: string): Promise<void> {
    await this.tokenRepo.deleteByUser(userId);
  }
}
