import { DataSource } from 'typeorm';

export type MockFieldFactory<T> = () => T;
export type EntityClass<T = unknown> = new () => T;
export type EntityInstance = Record<string, unknown>;

export interface SeederConfig {
  dataSource: DataSource;
}

export interface SaveableSeeder<T extends EntityInstance = EntityInstance> {
  execute(): Promise<readonly T[]>;
}
