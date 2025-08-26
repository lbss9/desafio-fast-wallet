import { EUserType } from '@modules/user/interfaces/user.interface';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: EUserType[]) => SetMetadata(ROLES_KEY, roles);
