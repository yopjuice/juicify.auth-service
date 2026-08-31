import { Injectable, ConflictException,  ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { AuthTokensResponse } from '@juice11-micro/contracts';
import { Role, User } from '../user/user.entity';
// import { TokenService } from '../token/token.service';


@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    // private tokenService: TokenService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User| null> {
    const user = await this.userService.findByEmail(email);
    if (!user || !user.password) return null;
    const pwMatches = await bcrypt.compare(pass, user.password);
    if (user && pwMatches) {
      return user;
    }
    return null;
  }

  async register(dto: RegisterDto): Promise<AuthTokensResponse> {
    const candidate = await this.userService.findByEmail(dto.email);
    if (candidate) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.userService.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: Role.User,
    });

    return this.getTokensAndSave(user.id, user.email, user.role);
  }

  async login(user: {id: string, email: string, role: Role}): Promise<AuthTokensResponse> {
    return this.getTokensAndSave(user.id, user.email, user.role);
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<AuthTokensResponse> {
    const user = await this.userService.findById(userId);
    if (!user || !user.password ) {
      throw new ForbiddenException('Access Denied');
    }

    // make sure password is correct
    const pwMatches = await bcrypt.compare(refreshToken, user.password);
    if (!pwMatches) {
      throw new ForbiddenException('Access Denied / Invalid Token');
    }

    // Выпускаем новые токены (Rotated Tokens)
    return this.getTokensAndSave(user.id, user.email, user.role);
  }

  // Хелпер: генерация токенов и запись хэша в БД
  private async getTokensAndSave(userId: string, email: string, role: string): Promise<AuthTokensResponse> {
    const payload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET || 'SUPER_SECRET_KEY',
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET || 'SUPER_REFRESH_KEY',
        expiresIn: '7d',
      }),
    ]);

    // const hashedRt = await bcrypt.hash(refreshToken, 10);
    // await this.tokenService.updateRefreshToken(userId, hashedRt);

    return { accessToken: accessToken, refreshToken: refreshToken };
  }
}
