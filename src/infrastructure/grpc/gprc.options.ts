import { GrpcOptions } from '@nestjs/microservices';
import { PROTO_PATHS } from '@juice11-micro/contracts';

// Names of packages included
export const grpcPackages = ['catalog.v1'];

// Where to search proto files
export const grpcProtoPaths = [...Object.values(PROTO_PATHS)];
// Options for proto loading
export const grpcLoader: NonNullable<GrpcOptions['options']['loader']> = {
  keepCase: false,
  longs: String,
  enums: String,
  defaults: false,
  oneofs: false,
};
