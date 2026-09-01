import { RpcException } from '@nestjs/microservices';
import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { AuthTokens } from '../token/interfaces/token.interface';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '../user/user.entity';
import { User } from '../user/user.entity';


@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) { }

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);
    if (!user || !user.password) return null;
    const pwMatches = await bcrypt.compare(pass, user.password);
    if (user && pwMatches) {
      return user;
    }
    return null;
  }

  async register(dto: RegisterDto): Promise<AuthTokens> {
    const candidate = await this.userService.findByEmail(dto.email);
    if (candidate) {
      throw new RpcException({ code: 6, message: 'User with this email already exists' }); // ALREADY_EXISTS
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.userService.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: Role.User,
    });

    return this.tokenService.generateAndSaveTokens(user.id, user.email, user.role);
  }

  async login(dto: LoginDto): Promise<AuthTokens> {
    const user = await this.userService.getByEmail(dto.email);
    if (!user.password) throw new RpcException({ code: 16, message: 'User not found' }); // NOT_FOUND
    const pwMatches = await bcrypt.compare(dto.password, user.password);
    if (!user || !pwMatches) {
      throw new RpcException({ code: 16, message: 'Invalid credentials' }); // UNAUTHENTICATED
    }

    // HACK: drop all user tokens on login
    await this.tokenService.deleteByUser(user.id);
    const tokens = await this.tokenService.generateAndSaveTokens(user.id, user.email, user.role);
    return tokens;
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    try {
      const payload = await this.tokenService.verifyToken(refreshToken);
      const user = await this.userService.findById(payload.sub);
      if (!user) {
        throw new RpcException({ code: 16, message: 'User not found' });
      }

      return await this.tokenService.refreshTokens(
        payload.tokenId!,
        refreshToken,
        user.id,
        user.email,
        user.role
      );
    } catch (error) {
      if (error instanceof RpcException) throw error;
      throw new RpcException({ code: 16, message: 'Refresh token invalid, expired or reused' });
    }
  }

  async logout(refreshToken: string): Promise<void> {
    const payload = await this.tokenService.verifyToken(refreshToken);

    if (payload.tokenId) {
      await this.tokenService.delete(payload.tokenId);
      console.log('found and deleted token');
    }
  }
}
