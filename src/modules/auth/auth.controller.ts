import { Controller, UseGuards } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { GrpcJwtGuard } from './guards/jwt.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto'
import { AuthTokensResponse, GetMyInfoResponse } from '@juice11-micro/contracts';
import {CurrentUser} from './decorators/user.decorator'
import type { JwtPayload } from './interfaces/jwt-payload.interface';
// import { RegisterDto, LoginDto, AuthTokens, UserProfile, Empty } from './interfaces/auth.interface';


@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @GrpcMethod('AuthService', 'Register')
  async register(data: RegisterDto): Promise<AuthTokensResponse> {
    return this.authService.register(data);
  }

  @GrpcMethod('AuthService', 'Login')
  async login(data: LoginDto): Promise<AuthTokensResponse> {
    const user = await this.authService.validateUser(data.email, data.password);
    if (!user) {
      throw new Error('Unauthorized: Invalid credentials');
    }
    return this.authService.login(user);
  }

  @UseGuards(GrpcJwtGuard)
  @GrpcMethod('AuthService', 'GetMyInfo')
  async getProfile(data: undefined, @CurrentUser() user: JwtPayload): Promise<GetMyInfoResponse> {

    return {
      id: user.sub,
      email: user.email,
      role: user.role,
    };
  }
}

