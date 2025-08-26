export enum EAuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  TRANSACTION = 'TRANSACTION',
  BLOCK_ACCOUNT = 'BLOCK_ACCOUNT',
  UNBLOCK_ACCOUNT = 'UNBLOCK_ACCOUNT',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  PASSWORD_RESET = 'PASSWORD_RESET',
}

export enum EAuditResource {
  USER = 'USER',
  WALLET = 'WALLET',
  TRANSACTION = 'TRANSACTION',
  AUTH = 'AUTH',
  NOTIFICATION = 'NOTIFICATION',
}

export interface IAuditLog {
  id?: number;
  userId?: number;
  action: EAuditAction;
  resource: EAuditResource;
  resourceId?: number;
  description: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  createdAt?: Date;
}
