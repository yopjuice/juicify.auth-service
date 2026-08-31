import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtPayload => {
    const rpcContext = ctx.switchToRpc();
    
    const context = rpcContext.getContext();

    const user = context?.user ?? context?.req?.user;

    return user as JwtPayload;
  },
);
