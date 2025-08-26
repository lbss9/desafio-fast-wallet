import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import {
  EAuditAction,
  EAuditResource,
  IAuditLog,
} from '../interfaces/audit-log.interface';

@Entity('audit_logs')
@Index(['userId', 'createdAt'])
@Index(['action', 'resource'])
@Index(['resourceId', 'resource'])
@Index(['createdAt'])
export class AuditLogEntity implements IAuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'user_id',
    type: 'int',
    nullable: true,
  })
  userId?: number;

  @Column({
    type: 'enum',
    enum: EAuditAction,
    nullable: false,
  })
  action: EAuditAction;

  @Column({
    type: 'enum',
    enum: EAuditResource,
    nullable: false,
  })
  resource: EAuditResource;

  @Column({
    name: 'resource_id',
    type: 'int',
    nullable: true,
  })
  resourceId?: number;

  @Column({
    type: 'text',
    nullable: false,
  })
  description: string;

  @Column({
    name: 'ip_address',
    type: 'inet',
    nullable: true,
  })
  ipAddress?: string;

  @Column({
    name: 'user_agent',
    type: 'text',
    nullable: true,
  })
  userAgent?: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  metadata?: Record<string, any>;

  @Column({
    name: 'old_values',
    type: 'jsonb',
    nullable: true,
  })
  oldValues?: Record<string, any>;

  @Column({
    name: 'new_values',
    type: 'jsonb',
    nullable: true,
  })
  newValues?: Record<string, any>;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;

  @ManyToOne(() => UserEntity, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;
}
