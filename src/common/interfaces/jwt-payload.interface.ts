import { EUserType } from '@modules/user/interfaces/user.interface';

export interface JwtPayload {
  sub: number;
  email: string;
  userType: EUserType;
  fullName: string;
  iat?: number;
  exp?: number;
}
