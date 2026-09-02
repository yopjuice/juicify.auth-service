import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MyConfigModule } from '../config/config.module';
import { DatabaseModule } from '../infrastructure/db/db.module';
import { AuthModule } from '../modules/auth/auth.module';
import { UserModule } from '../modules/user/user.module';

@Module({
  imports: [
    MyConfigModule,
    DatabaseModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
