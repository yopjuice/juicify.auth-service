import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TokenModule } from '../token/token.module';
import { AuthGrpc } from '../../infrastructure/auth/auth.client';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MyConfigService } from '../../config/config.service';
import { grpcPackages, grpcProtoPaths } from '../../infrastructure/grpc/gprc.options';
import { grpcClientInterceptor } from '../../infrastructure/grpc/grpc.client.interceptor';

@Module({
  imports: [
    UserModule,
    TokenModule,
    ClientsModule.registerAsync([
      {
        name: 'AUTH_INTERNAL_PROXY',
        inject: [MyConfigService],
        useFactory: (config: MyConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: `localhost:${config.get('grpc.port')}`,
            package: grpcPackages,
            protoPath: grpcProtoPaths,
            channelOptions: {
              interceptors: [grpcClientInterceptor],
            },
          },
        }),
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGrpc],
})
export class AuthModule {}
