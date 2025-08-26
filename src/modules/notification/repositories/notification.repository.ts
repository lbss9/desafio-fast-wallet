import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../utils/repository/base.repository';
import { NotificationEntity } from '../entities/notification.entity';
import { ENotificationStatus } from '../interfaces/notification.interface';

@Injectable()
export class NotificationRepository extends BaseRepository<NotificationEntity> {
  protected readonly entityName = 'Notification';

  public constructor(
    @InjectRepository(NotificationEntity)
    protected readonly repository: Repository<NotificationEntity>,
  ) {
    super();
  }

  public async findByUserId(userId: number): Promise<NotificationEntity[]> {
    return this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  public async findPendingNotifications(): Promise<NotificationEntity[]> {
    return this.repository.find({
      where: { status: ENotificationStatus.PENDING },
      order: { createdAt: 'ASC' },
    });
  }

  public async findForRetry(): Promise<NotificationEntity[]> {
    const now = new Date();
    return this.repository
      .createQueryBuilder('notification')
      .where('notification.status = :status', {
        status: ENotificationStatus.FAILED,
      })
      .andWhere('notification.attempts < notification.maxAttempts')
      .andWhere('notification.retryAt <= :now', { now })
      .orderBy('notification.retryAt', 'ASC')
      .getMany();
  }

  public async findByTransactionId(
    transactionId: number,
  ): Promise<NotificationEntity[]> {
    return this.repository.find({
      where: { transactionId },
      order: { createdAt: 'DESC' },
    });
  }
}
