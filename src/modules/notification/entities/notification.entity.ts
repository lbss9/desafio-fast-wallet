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
import { TransactionEntity } from '../../transaction/entities/transaction.entity';
import { UserEntity } from '../../user/entities/user.entity';
import {
  ENotificationCategory,
  ENotificationStatus,
  ENotificationType,
  INotification,
} from '../interfaces/notification.interface';

@Entity('notifications')
@Index(['userId', 'status'])
@Index(['status', 'retryAt'])
@Index(['createdAt'])
export class NotificationEntity implements INotification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'user_id',
    type: 'int',
    nullable: false,
  })
  userId: number;

  @Column({
    name: 'transaction_id',
    type: 'int',
    nullable: true,
  })
  transactionId?: number;

  @Column({
    type: 'enum',
    enum: ENotificationType,
    nullable: false,
  })
  type: ENotificationType;

  @Column({
    type: 'enum',
    enum: ENotificationCategory,
    nullable: false,
  })
  category: ENotificationCategory;

  @Column({
    type: 'enum',
    enum: ENotificationStatus,
    nullable: false,
    default: ENotificationStatus.PENDING,
  })
  status: ENotificationStatus;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  title: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  message: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  recipient: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  metadata?: Record<string, any>;

  @Column({
    name: 'template_id',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  templateId?: string;

  @Column({
    type: 'int',
    nullable: false,
    default: 0,
  })
  attempts: number;

  @Column({
    name: 'max_attempts',
    type: 'int',
    nullable: false,
    default: 3,
  })
  maxAttempts: number;

  @Column({
    name: 'sent_at',
    type: 'timestamp',
    nullable: true,
  })
  sentAt?: Date;

  @Column({
    name: 'delivered_at',
    type: 'timestamp',
    nullable: true,
  })
  deliveredAt?: Date;

  @Column({
    name: 'failed_at',
    type: 'timestamp',
    nullable: true,
  })
  failedAt?: Date;

  @Column({
    name: 'error_message',
    type: 'text',
    nullable: true,
  })
  errorMessage?: string;

  @Column({
    name: 'retry_at',
    type: 'timestamp',
    nullable: true,
  })
  retryAt?: Date;

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

  @ManyToOne(() => TransactionEntity, { eager: false })
  @JoinColumn({ name: 'transaction_id' })
  transaction?: TransactionEntity;
}
