import { SetMetadata } from "@nestjs/common";
import { Role } from "../../user/user.entity";

export const Roles = (roles: Role[]) => SetMetadata('roles', roles);
