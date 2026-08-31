import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepo } from '../../infrastructure/user/user.repo';

@Module({
  providers: [UserService, UserRepo],
  exports: [UserService],
})
export class UserModule {}
