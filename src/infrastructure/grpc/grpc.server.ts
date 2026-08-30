import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { grpcPackages, grpcProtoPaths, grpcLoader } from './gprc.options';
import { MyConfigService } from '../../config/config.service';
import { ReflectionService } from '@grpc/reflection';
import { AppModule } from '../../app/app.module';
import { NestFactory } from '@nestjs/core';
import { Server } from '@grpc/grpc-js';
import { PackageDefinition } from '@grpc/proto-loader';

export async function createGrpcServer(config: MyConfigService) {
  const host = config.get('grpc.host');
  const port = config.get('grpc.port');

  const url = `${host}:${port}`;
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: grpcPackages,
        protoPath: grpcProtoPaths,
        url,
        loader: grpcLoader,
        onLoadPackageDefinition: (pkg: PackageDefinition, server: Server) => {
          new ReflectionService(pkg).addToServer(server);
        },
      },
    },
  );
  return app;
}
