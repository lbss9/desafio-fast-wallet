export enum ENotificationType {
  EMAIL = 'fw__email',
  SMS = 'fw__sms',
  PUSH = 'fw__push',
  IN_APP = 'fw__in_app',
}

export enum ENotificationStatus {
  PENDING = 'fw__pending',
  SENT = 'fw__sent',
  DELIVERED = 'fw__delivered',
  FAILED = 'fw__failed',
  CANCELLED = 'fw__cancelled',
}

export enum ENotificationCategory {
  SECURITY = 'fw__security',
  TRANSACTION = 'fw__transaction',
  MARKETING = 'fw__marketing',
  SYSTEM = 'fw__system',
  ACCOUNT = 'fw__account',
}

export interface INotification {
  id?: number;
  userId: number;
  transactionId?: number;
  type: ENotificationType;
  category: ENotificationCategory;
  status: ENotificationStatus;
  title: string;
  message: string;
  recipient: string;
  metadata?: Record<string, any>;
  templateId?: string;
  attempts: number;
  maxAttempts: number;
  sentAt?: Date;
  deliveredAt?: Date;
  failedAt?: Date;
  errorMessage?: string;
  retryAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
