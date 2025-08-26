import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogEntity } from './modules/audit/entities/audit-log.entity';
import { AuditLogRepository } from './modules/audit/repositories/audit-log.repository';
import { NotificationEntity } from './modules/notification/entities/notification.entity';
import { NotificationRepository } from './modules/notification/repositories/notification.repository';
import { TransactionEntity } from './modules/transaction/entities/transaction.entity';
import { TransactionRepository } from './modules/transaction/repositories/transaction.repository';
import { UserEntity } from './modules/user/entities/user.entity';
import { UserRepository } from './modules/user/repositories/user.repository';
import { WalletEntity } from './modules/wallet/entities/wallet.entity';
import { WalletRepository } from './modules/wallet/repositories/wallet.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      WalletEntity,
      TransactionEntity,
      NotificationEntity,
      AuditLogEntity,
    ]),
  ],
  providers: [
    UserRepository,
    WalletRepository,
    TransactionRepository,
    NotificationRepository,
    AuditLogRepository,
  ],
  exports: [
    UserRepository,
    WalletRepository,
    TransactionRepository,
    NotificationRepository,
    AuditLogRepository,
  ],
})
export class RepositoriesModule {}
