import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WalletEntity } from '../../wallet/entities/wallet.entity';
import {
  EPixKeyType,
  ETransactionStatus,
  ETransactionType,
  ITransaction,
} from '../interfaces/transaction.interface';

@Entity('transactions')
@Index(['fromWalletId', 'createdAt'])
@Index(['toWalletId', 'createdAt'])
@Index(['idempotencyKey'], { unique: true })
@Index(['externalId'])
export class TransactionEntity implements ITransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'from_wallet_id',
    type: 'int',
    nullable: true,
  })
  fromWalletId?: number;

  @Column({
    name: 'to_wallet_id',
    type: 'int',
    nullable: true,
  })
  toWalletId?: number;

  @Column({
    type: 'enum',
    enum: ETransactionType,
    nullable: false,
  })
  type: ETransactionType;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: false,
  })
  amount: number;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
    default: 0,
  })
  fee?: number;

  @Column({
    type: 'enum',
    enum: ETransactionStatus,
    nullable: false,
    default: ETransactionStatus.PENDING,
  })
  status: ETransactionStatus;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  description?: string;

  @Column({
    name: 'external_id',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  externalId?: string;

  @Column({
    name: 'pix_key',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  pixKey?: string;

  @Column({
    name: 'pix_key_type',
    type: 'enum',
    enum: EPixKeyType,
    nullable: true,
  })
  pixKeyType?: EPixKeyType;

  @Column({
    name: 'idempotency_key',
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  idempotencyKey: string;

  @Column({
    name: 'processed_at',
    type: 'timestamp',
    nullable: true,
  })
  processedAt?: Date;

  @Column({
    name: 'error_message',
    type: 'text',
    nullable: true,
  })
  errorMessage?: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  metadata?: Record<string, any>;

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

  @ManyToOne(() => WalletEntity, (wallet) => wallet.outgoingTransactions, {
    eager: false,
  })
  @JoinColumn({ name: 'from_wallet_id' })
  fromWallet?: WalletEntity;

  @ManyToOne(() => WalletEntity, (wallet) => wallet.incomingTransactions, {
    eager: false,
  })
  @JoinColumn({ name: 'to_wallet_id' })
  toWallet?: WalletEntity;
}
