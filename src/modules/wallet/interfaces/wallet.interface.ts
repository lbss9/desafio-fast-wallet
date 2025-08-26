export enum EWalletStatus {
  ACTIVE = 'fw__active',
  BLOCKED = 'fw__blocked',
  SUSPENDED = 'fw__suspended',
}

export enum EWalletType {
  CURRENT = 'fw__current',
  SAVINGS = 'fw__savings',
}

export interface IWallet {
  id: number;
  userId: number;
  accountNumber: string;
  agency: string;
  accountType: EWalletType;
  balance: number;
  status: EWalletStatus;
  pixKey?: string;
  dailyWithdrawLimit: number;
  monthlyWithdrawLimit: number;
  blockedAt?: Date;
  blockedBy?: number;
  blockReason?: string;
  locked?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
