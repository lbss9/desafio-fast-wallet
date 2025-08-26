import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateItem,
  DeleteItem,
  UpdateItem,
} from '@utils/repository/repository.interface';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../utils/repository/base.repository';
import { WalletEntity } from '../entities/wallet.entity';

@Injectable()
export class WalletRepository extends BaseRepository<WalletEntity> {
  protected readonly entityName = 'Wallet';

  public constructor(
    @InjectRepository(WalletEntity)
    protected readonly repository: Repository<WalletEntity>,
  ) {
    super();
  }

  public create: CreateItem<WalletEntity> = async (data) => {
    const wallet = this.repository.create(data);
    return this.repository.save(wallet);
  };

  public update: UpdateItem<number, WalletEntity> = async (
    id,
    fields,
  ): Promise<WalletEntity> => {
    return super.update(id, fields);
  };

  public delete: DeleteItem<number> = async (id): Promise<void> => {
    return super.delete(id);
  };
}
