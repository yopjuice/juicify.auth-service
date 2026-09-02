import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenRepo } from '../../infrastructure/token/token.repo';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [
    JwtModule.register({}),
  ],
  providers: [TokenService, TokenRepo],
  exports: [TokenService]
})
export class TokenModule { }
