import { applyDecorators } from "@nestjs/common";
import { Roles } from "./role.decorator";
import { Role } from "../../user/user.entity";
import { UseGuards } from "@nestjs/common";
import { GrpcJwtGuard } from "../guards/jwt.guard";
import { RoleGuard } from "../guards/role.guard";


export function UseRoles(roles: Role[]) {
  return applyDecorators(
    Roles(roles),
    UseGuards(GrpcJwtGuard, RoleGuard),
  );
}
