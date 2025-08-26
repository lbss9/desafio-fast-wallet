import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateItem,
  DeleteItem,
  UpdateItem,
} from '@utils/repository/repository.interface';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../utils/repository/base.repository';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository extends BaseRepository<UserEntity> {
  protected readonly entityName = 'User';

  public constructor(
    @InjectRepository(UserEntity)
    protected readonly repository: Repository<UserEntity>,
  ) {
    super();
  }

  public create: CreateItem<UserEntity> = async (data) => {
    const user = this.repository.create(data);
    return this.repository.save(user);
  };

  public update: UpdateItem<number, UserEntity> = async (
    id,
    fields,
  ): Promise<UserEntity> => {
    return super.update(id, fields);
  };

  public delete: DeleteItem<number> = async (id): Promise<void> => {
    return super.delete(id);
  };
}
