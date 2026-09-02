import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { BusinessRuleViolationError } from '../../../shared/errors/domain-errors';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtPayload => {
    const rpcContext = ctx.switchToRpc();
    
    const context = rpcContext.getContext();

    const user = context?.user ?? context?.req?.user;

    if (!user) throw new BusinessRuleViolationError('CurrentUser decorator is used with no guards')

    return user as JwtPayload;
  },
);
