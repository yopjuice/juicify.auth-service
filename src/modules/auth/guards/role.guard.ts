import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '../../user/user.service';
import { Role } from '../../user/user.entity';
import { PermissionDeniedError } from '../../../shared/errors/domain-errors';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
		private reflector: Reflector,
    private userService: UserService,
	) {}
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<Role[]>('roles', ctx.getHandler());
    if (!roles) {
      return true;
    }
    const context = ctx.switchToRpc().getContext();

    console.log({context})

		if (!context.user) throw new PermissionDeniedError();

    const user = await this.userService.findById(context.user.sub);

    if (!roles.some((role) => user?.role == role)) 
			throw new PermissionDeniedError();

		return true;
  }
}
