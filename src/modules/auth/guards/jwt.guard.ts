import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Metadata } from '@grpc/grpc-js';
import { TokenService } from '../../token/token.service';
import { UnauthenticatedError } from '../../../shared/errors/domain-errors';

@Injectable()
export class GrpcJwtGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rpcContext = context.switchToRpc();
    const metadata: Metadata = rpcContext.getContext();
    const authHeader = metadata.get('authorization')[0] as string;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthenticatedError()
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload = this.tokenService.verifyAccessToken(token);

      const args = rpcContext.getContext();
      if (args) {
        args.user = payload;
      }

      return true;
    } catch {
      throw new UnauthenticatedError();
    }
  }
}
