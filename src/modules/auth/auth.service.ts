import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';
import * as bcrypt from 'bcrypt';
import { Injectable, Logger } from '@nestjs/common';
import { AuthTokens } from '../token/interfaces/token.interface';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '../user/user.entity';
import { User } from '../user/user.entity';
import { EntityAlreadyExistsError, InvalidCredentialsError } from '../../shared/errors/domain-errors';


@Injectable()
export class AuthService {

  private readonly logger = new Logger(AuthService.name);

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
      throw new EntityAlreadyExistsError('user');
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
    const user = await this.userService.findByEmail(dto.email);
    if (!user || !user.password) throw new InvalidCredentialsError();
    const pwMatches = await bcrypt.compare(dto.password, user.password);
    if (!pwMatches) {
      throw new InvalidCredentialsError();
    }

    // HACK: drop all user tokens on login
    await this.tokenService.deleteByUser(user.id);
    const tokens = await this.tokenService.generateAndSaveTokens(user.id, user.email, user.role);
    return tokens;
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    const payload = await this.tokenService.verifyToken(refreshToken);
    const user = await this.userService.findById(payload.sub);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    return await this.tokenService.refreshTokens(
      payload,
      payload.tokenId!,
      refreshToken,
    );
  }

  async logout(refreshToken: string): Promise<void> {
    const payload = await this.tokenService.verifyToken(refreshToken);

    if (payload.tokenId) {
      await this.tokenService.delete(payload.tokenId);
      this.logger.log('Found and deleted token');
    }
  }
}
