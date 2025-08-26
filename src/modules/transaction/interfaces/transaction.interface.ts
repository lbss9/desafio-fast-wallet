export enum ETransactionType {
  DEPOSIT = 'fw__deposit',
  WITHDRAWAL = 'fw__withdrawal',
  TRANSFER = 'fw__transfer',
  PIX_TRANSFER = 'fw__pix_transfer',
  PAYMENT = 'fw__payment',
  REFUND = 'fw__refund',
}

export enum ETransactionStatus {
  PENDING = 'fw__pending',
  PROCESSING = 'fw__processing',
  COMPLETED = 'fw__completed',
  FAILED = 'fw__failed',
  CANCELLED = 'fw__cancelled',
  REFUNDED = 'fw__refunded',
}

export enum EPixKeyType {
  CPF = 'fw__cpf',
  CNPJ = 'fw__cnpj',
  EMAIL = 'fw__email',
  PHONE = 'fw__phone',
  RANDOM = 'fw__random',
}

export interface ITransaction {
  id?: number;
  fromWalletId?: number;
  toWalletId?: number;
  type: ETransactionType;
  amount: number;
  fee?: number;
  status: ETransactionStatus;
  description?: string;
  externalId?: string;
  pixKey?: string;
  pixKeyType?: EPixKeyType;
  idempotencyKey: string;
  processedAt?: Date;
  errorMessage?: string;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}
