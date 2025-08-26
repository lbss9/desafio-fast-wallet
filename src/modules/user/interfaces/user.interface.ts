export enum EUserType {
  USER = 'fw__user',
  ADMIN = 'fw__admin',
}

export interface IUser {
  id?: number;
  name: string;
  email: string;
  userType: EUserType;
  password: string;
  taxId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
