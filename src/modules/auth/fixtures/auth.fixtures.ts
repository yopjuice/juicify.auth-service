import { LoginDto } from "../dto/login.dto";
import { LogoutDto } from "../dto/logout.dto";
import { RefreshDto } from "../dto/refresh.dto";
import { RegisterDto } from "../dto/register.dto";

const dtoData = {
  name: 'test-name',
  password: 'test-password',
  email: 'test@email.com',
  refreshToken: 'sdfjfaksdf;asdflsaj',
}

export const AuthFixtures = {
  registerDto: (overrides?: Partial<RegisterDto>): RegisterDto => ({
    name: dtoData.name,
    email: dtoData.email,
    password: dtoData.password,
    ...overrides,
  }),

  loginDto: (overrides?: Partial<LoginDto>): LoginDto => ({
    email: dtoData.email,
    password: dtoData.password,
    ...overrides,
  }),

  refreshDto: (overrides?: Partial<RefreshDto>): RefreshDto => ({
    refreshToken: dtoData.refreshToken,
    ...overrides,
  }),

  logoutDto: (overrides?: Partial<LogoutDto>): LogoutDto => ({
    refreshToken: dtoData.refreshToken,
    ...overrides,
  }),
}
