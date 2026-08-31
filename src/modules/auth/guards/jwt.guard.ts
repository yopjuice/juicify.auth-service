import { RpcException } from '@nestjs/microservices';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Metadata } from '@grpc/grpc-js';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class GrpcJwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rpcContext = context.switchToRpc();
    const metadata: Metadata = rpcContext.getContext();
    const authHeader = metadata.get('authorization')[0] as string;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new RpcException({ code: 16, message: 'Missing or invalid token' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_ACCESS_SECRET || 'SUPER_SECRET_KEY',
      });

      const args = rpcContext.getContext();
      if (args) {
        args.user = payload;
      }

      return true;
    } catch {
      throw new RpcException({ code: 16, message: 'Token invalid or expired' });
    }
  }
}
