import { DatabaseConfig } from './database.interface';
import { GrpcConfig } from './grpc.interface';
import { JwtConfig } from './jwt.interface';

// TODO: finish env
export interface AllConfigs {
  grpc: GrpcConfig;
  database: DatabaseConfig;
  jwt: JwtConfig;
}
