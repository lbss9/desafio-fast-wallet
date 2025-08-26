import type {
  EntityClass,
  EntityInstance,
} from '@common/interfaces/seeder.types';
import { DataSource } from 'typeorm';

export class DatabaseUtils {
  static async executeInTransaction<T extends EntityInstance>(
    dataSource: DataSource,
    entityClass: EntityClass<T>,
    records: readonly T[],
  ): Promise<readonly T[]> {
    return dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(entityClass);
      const entities = records.map((record) => repository.create(record));
      const savedEntities = await repository.save(entities);
      return savedEntities as unknown as readonly T[];
    });
  }

  static async clearTable<T>(
    dataSource: DataSource,
    entityClass: EntityClass<T>,
  ): Promise<void> {
    const repository = dataSource.getRepository(entityClass);
    await repository.clear();
  }

  static isLocalhostConnection(host: string): boolean {
    const localhostHosts = [
      'localhost',
      '127.0.0.1',
      '::1',
      '0.0.0.0',
    ] as const;

    return localhostHosts.includes(host as (typeof localhostHosts)[number]);
  }
}
