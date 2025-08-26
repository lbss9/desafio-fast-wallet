import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { ENTITY_TARGET_KEY } from '../../common/decorators/hydrate-seeder.decorator';
import { MOCK_FIELDS_KEY } from '../../common/decorators/mock-field.decorator';
import type { EntityClass } from '../../common/interfaces/seeder.types';
import { DatabaseUtils } from '../database.utils';
import {
  DataSourceNotConfiguredError,
  EntityNotConfiguredError,
  EnvironmentError,
  LocalhostOnlyError,
} from './seeder.errors';

export abstract class BaseSeeder<T = any> {
  protected static dataSource: DataSource;

  public static setDataSource(
    dataSource: DataSource,
    configService: ConfigService,
  ): void {
    const environment = configService.get<string>('STAGE', 'development');
    const isValidEnvironment =
      environment === 'development' || environment === 'test';

    if (!isValidEnvironment) {
      throw new EnvironmentError();
    }

    const options = dataSource.options;
    const host = 'host' in options ? options.host : 'localhost';
    const isLocalhost = DatabaseUtils.isLocalhostConnection(host);

    if (!isLocalhost) {
      throw new LocalhostOnlyError();
    }

    this.dataSource = dataSource;
  }

  protected static getDataSource(): DataSource {
    if (!this.dataSource) {
      throw new DataSourceNotConfiguredError();
    }
    return this.dataSource;
  }

  private getEntityClass(): EntityClass<T> {
    const Constructor = this.constructor as new () => BaseSeeder<T>;
    const entityClass = Reflect.getMetadata(ENTITY_TARGET_KEY, Constructor);

    if (!entityClass) {
      throw new EntityNotConfiguredError();
    }

    return entityClass as EntityClass<T>;
  }

  protected getTableName(): string {
    const entityClass = this.getEntityClass();
    const dataSource = BaseSeeder.getDataSource();

    const entityMetadata = dataSource.getMetadata(entityClass);

    return entityMetadata.tableName;
  }

  protected createMockData(): T {
    const Constructor = this.constructor as new () => BaseSeeder<T>;
    const mockFields: Record<string | symbol, () => unknown> | undefined =
      Reflect.getMetadata(MOCK_FIELDS_KEY, Constructor);

    const mockData = {} as Record<string, unknown>;

    if (mockFields) {
      const entries = Object.entries(mockFields);

      entries.forEach(([field, factory]) => {
        mockData[field] = factory();
      });
    }

    return mockData as T;
  }

  protected customizeMock(mockData: T): T {
    return mockData;
  }

  protected mergeCustomData(mockData: T, customData?: Partial<T>): T {
    if (!customData) return mockData;
    return { ...mockData, ...customData };
  }

  public createOneMock(customData?: Partial<T>): T {
    const mockData = this.createMockData();
    const customizedData = this.customizeMock(mockData);
    return this.mergeCustomData(customizedData, customData);
  }

  public createManyMock(count: number, customData?: Partial<T>): T[] {
    return Array.from({ length: count }, () => {
      const mockData = this.createMockData();
      const customizedData = this.customizeMock(mockData);
      return this.mergeCustomData(customizedData, customData);
    });
  }

  public async createItem(customData?: Partial<T>): Promise<T> {
    const mockData = this.createMockData();
    const customizedData = this.customizeMock(mockData);
    const finalData = this.mergeCustomData(customizedData, customData);

    const dataSource = BaseSeeder.getDataSource();
    const entityClass = this.getEntityClass();

    const savedItems = await DatabaseUtils.executeInTransaction(
      dataSource,
      entityClass as any,
      [finalData as any],
    );

    return savedItems[0] as T;
  }

  public async createManyItems(
    count: number,
    customData?: Partial<T>,
  ): Promise<T[]> {
    const mockDataArray = Array.from({ length: count }, () => {
      const mockData = this.createMockData();
      const customizedData = this.customizeMock(mockData);
      return this.mergeCustomData(customizedData, customData);
    });

    const dataSource = BaseSeeder.getDataSource();
    const entityClass = this.getEntityClass();

    const savedItems = await DatabaseUtils.executeInTransaction(
      dataSource,
      entityClass as any,
      mockDataArray as any,
    );

    return savedItems as T[];
  }

  public static createOneMock<T = any>(
    this: new () => BaseSeeder<T>,
    customData?: Partial<T>,
  ): T {
    const instance = new this();
    return instance.createOneMock(customData);
  }

  public static createManyMock<T = any>(
    this: new () => BaseSeeder<T>,
    count: number,
    customData?: Partial<T>,
  ): T[] {
    const instance = new this();
    return instance.createManyMock(count, customData);
  }

  public static async createItem<T = any>(
    this: new () => BaseSeeder<T>,
    customData?: Partial<T>,
  ): Promise<T> {
    const instance = new this();
    return instance.createItem(customData);
  }

  public static async createManyItems<T = any>(
    this: new () => BaseSeeder<T>,
    count: number,
    customData?: Partial<T>,
  ): Promise<T[]> {
    const instance = new this();
    return instance.createManyItems(count, customData);
  }

  public static async clearTable(tableName: string): Promise<void> {
    const dataSource = this.getDataSource();
    await dataSource.query(`DELETE FROM ${tableName}`);
  }

  public async clearEntityTable(): Promise<void> {
    const dataSource = BaseSeeder.getDataSource();
    const entityClass = this.getEntityClass();
    await DatabaseUtils.clearTable(dataSource, entityClass as any);
  }

  public async clearTable(): Promise<void> {
    const tableName = this.getTableName();
    const dataSource = BaseSeeder.getDataSource();
    await dataSource.query(`DELETE FROM ${tableName}`);
  }
}
