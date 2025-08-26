import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EUserType } from '../interfaces/user.interface';

@Entity('users')
@Index(['email'], { unique: true })
@Index(['taxId'], { unique: true })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'full_name',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    name: 'user_type',
    type: 'enum',
    enum: EUserType,
    nullable: false,
    default: EUserType.USER,
  })
  userType: EUserType;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  password: string;

  @Column({
    name: 'tax_id',
    type: 'varchar',
    length: 14,
    nullable: false,
    unique: true,
    comment: 'CPF do usuário',
  })
  taxId: string;

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

  @OneToMany(() => AccountEntity, (account) => account.user)
  accounts: AccountEntity[];

  @OneToMany(() => NotificationEntity, (notification) => notification.user)
  notifications: NotificationEntity[];

  @OneToMany(() => AuditLogEntity, (auditLog) => auditLog.user)
  auditLogs: AuditLogEntity[];
}
