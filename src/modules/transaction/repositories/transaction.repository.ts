import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../utils/repository/base.repository';
import { TransactionEntity } from '../entities/transaction.entity';

@Injectable()
export class TransactionRepository extends BaseRepository<TransactionEntity> {
  protected readonly entityName = 'Transaction';

  public constructor(
    @InjectRepository(TransactionEntity)
    protected readonly repository: Repository<TransactionEntity>,
  ) {
    super();
  }

  public async findByIdempotencyKey(
    idempotencyKey: string,
  ): Promise<TransactionEntity | null> {
    return this.repository.findOne({
      where: { idempotencyKey },
    });
  }

  public async findByWalletId(walletId: number): Promise<TransactionEntity[]> {
    return this.repository.find({
      where: [{ fromWalletId: walletId }, { toWalletId: walletId }],
      order: { createdAt: 'DESC' },
    });
  }

  public async findByExternalId(
    externalId: string,
  ): Promise<TransactionEntity | null> {
    return this.repository.findOne({
      where: { externalId },
    });
  }
}
