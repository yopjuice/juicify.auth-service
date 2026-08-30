import { IsNumber, IsString } from 'class-validator';

export class GrpcValidator {
  @IsString()
  GRPC_HOST: string;

  @IsNumber()
  GRPC_PORT: number;
}
