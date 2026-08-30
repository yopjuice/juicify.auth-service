import { DatabaseConfig } from './database.interface';
import { GrpcConfig } from './grpc.interface';

// TODO: finish env
export interface AllConfigs {
  grpc: GrpcConfig;
  database: DatabaseConfig;
}
