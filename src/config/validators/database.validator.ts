import { IsNumber, IsString } from 'class-validator';

export class DatabaseValidator {
  @IsString()
  DATABASE_URL: string;
  @IsString()
  DATABASE_HOST: string;
  @IsNumber()
  DATABASE_PORT: number;
  @IsString()
  DATABASE_DB: string;
  @IsString()
  DATABASE_USER: string;
  @IsString()
  DATABASE_PASSWORD: string;
}
