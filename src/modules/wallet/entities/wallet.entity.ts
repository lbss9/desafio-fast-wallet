import { UserEntity } from '@/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  EWalletStatus,
  EWalletType,
  IWallet,
} from '../interfaces/wallet.interface';

@Entity('wallets')
export class WalletEntity implements IWallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'user_id',
    type: 'int',
    nullable: false,
  })
  userId: number;

  @Column({
    name: 'account_number',
    type: 'varchar',
    length: 20,
    nullable: false,
    unique: true,
  })
  accountNumber: string;

  @Column({
    name: 'account_type',
    type: 'enum',
    enum: EWalletType,
    nullable: false,
    default: EWalletType.CURRENT,
  })
  accountType: EWalletType;

  @Column({
    name: 'wallet_number',
    type: 'varchar',
    length: 20,
    nullable: false,
    unique: true,
  })
  walletNumber: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: false,
    default: '0001',
  })
  agency: string;

  @Column({
    name: 'wallet_type',
    type: 'enum',
    enum: EWalletType,
    nullable: false,
    default: EWalletType.CURRENT,
  })
  walletType: EWalletType;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: false,
    default: 0,
  })
  balance: number;

  @Column({
    type: 'enum',
    enum: EWalletStatus,
    nullable: false,
    default: EWalletStatus.ACTIVE,
  })
  status: EWalletStatus;

  @Column({
    name: 'pix_key',
    type: 'varchar',
    length: 255,
    nullable: true,
    unique: true,
  })
  pixKey?: string;

  @Column({
    name: 'daily_withdraw_limit',
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: false,
    default: 5000.0,
  })
  dailyWithdrawLimit: number;

  @Column({
    name: 'monthly_withdraw_limit',
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: false,
    default: 100000.0,
  })
  monthlyWithdrawLimit: number;

  @Column({
    name: 'blocked_at',
    type: 'timestamp',
    nullable: true,
  })
  blockedAt?: Date;

  @Column({
    name: 'blocked_by',
    type: 'int',
    nullable: true,
  })
  blockedBy?: number;

  @Column({
    name: 'block_reason',
    type: 'text',
    nullable: true,
  })
  blockReason?: string;

  @Column({
    name: 'locked',
    type: 'boolean',
    nullable: false,
    default: false,
  })
  locked?: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => UserEntity, { eager: false })
  @JoinColumn({ name: 'blocked_by' })
  blockedByUser?: UserEntity;

  @OneToMany(() => TransactionEntity, (transaction) => transaction.fromWallet)
  outgoingTransactions: TransactionEntity[];

  @OneToMany(() => TransactionEntity, (transaction) => transaction.toWallet)
  incomingTransactions: TransactionEntity[];
}
