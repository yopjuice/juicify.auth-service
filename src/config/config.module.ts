import { Global, Module } from '@nestjs/common';
import { MyConfigService } from './config.service';
import { ConfigModule } from '@nestjs/config';
import { grpcEnv } from './env/grpc.env';
import { databaseEnv } from './env/database.env';
import { jwtEnv } from './env/jwt.env';

// Making this module global to call service easier
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // Loads namespaces (e.x. database.url)
      load: [grpcEnv, databaseEnv, jwtEnv],
    }),
  ],
  providers: [MyConfigService],
  exports: [MyConfigService],
})
export class MyConfigModule {}
