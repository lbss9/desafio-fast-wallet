import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../utils/repository/base.repository';
import { AuditLogEntity } from '../entities/audit-log.entity';
import {
  EAuditAction,
  EAuditResource,
} from '../interfaces/audit-log.interface';

@Injectable()
export class AuditLogRepository extends BaseRepository<AuditLogEntity> {
  protected readonly entityName = 'AuditLog';

  constructor(
    @InjectRepository(AuditLogEntity)
    protected readonly repository: Repository<AuditLogEntity>,
  ) {
    super();
  }

  public async findByUserId(userId: number): Promise<AuditLogEntity[]> {
    return this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  public async findByAction(action: EAuditAction): Promise<AuditLogEntity[]> {
    return this.repository.find({
      where: { action },
      order: { createdAt: 'DESC' },
    });
  }

  public async findByResource(
    resource: EAuditResource,
    resourceId?: number,
  ): Promise<AuditLogEntity[]> {
    const where: any = { resource };
    if (resourceId) {
      where.resourceId = resourceId;
    }

    return this.repository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  public async findByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<AuditLogEntity[]> {
    return this.repository
      .createQueryBuilder('audit')
      .where('audit.createdAt >= :startDate', { startDate })
      .andWhere('audit.createdAt <= :endDate', { endDate })
      .orderBy('audit.createdAt', 'DESC')
      .getMany();
  }

  public async findSecurityEvents(userId?: number): Promise<AuditLogEntity[]> {
    const query = this.repository
      .createQueryBuilder('audit')
      .where('audit.action IN (:...actions)', {
        actions: [
          EAuditAction.LOGIN,
          EAuditAction.LOGOUT,
          EAuditAction.PASSWORD_CHANGE,
          EAuditAction.PASSWORD_RESET,
          EAuditAction.BLOCK_ACCOUNT,
          EAuditAction.UNBLOCK_ACCOUNT,
        ],
      });

    if (userId) {
      query.andWhere('audit.userId = :userId', { userId });
    }

    return query.orderBy('audit.createdAt', 'DESC').getMany();
  }
}
