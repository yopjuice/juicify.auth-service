import { Controller, UseGuards } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto'
import { AuthTokensResponse, GetMyInfoResponse } from '@juice11-micro/contracts';
import {CurrentUser} from './decorators/user.decorator'
import type { JwtPayload } from './interfaces/jwt-payload.interface';
import { RefreshDto } from './dto/refresh.dto';
import { LogoutDto } from './dto/logout.dto';
import { UseRoles } from './decorators/use-roles.decorator';
import { Role } from '../user/user.entity';


@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @GrpcMethod('AuthService', 'Register')
  async register(data: RegisterDto): Promise<AuthTokensResponse> {
    return this.authService.register(data);
  }

  @GrpcMethod('AuthService', 'Login')
  async login(data: LoginDto): Promise<AuthTokensResponse> {
    return this.authService.login(data);
  }

  @GrpcMethod('AuthService', 'RefreshTokens')
  async refreshTokens(data: RefreshDto): Promise<AuthTokensResponse> {
    return this.authService.refreshTokens(data.refreshToken);
  }

  @GrpcMethod('AuthService', 'Logout')
  async logout(data: LogoutDto): Promise<void> {
    return this.authService.logout(data.refreshToken);
  }

  @UseRoles([Role.Admin])
  @GrpcMethod('AuthService', 'GetMyInfo')
  async getProfile(data: undefined, @CurrentUser() user: JwtPayload): Promise<GetMyInfoResponse> {

    return {
      id: user.sub,
      email: user.email,
      role: user.role,
    };
  }
}

