import 'reflect-metadata';
import type { EntityClass } from '../interfaces/seeder.types';

export const ENTITY_TARGET_KEY: unique symbol = Symbol('entityTarget');

export function HydrateSeeder<T>(entityClass: EntityClass<T>): ClassDecorator {
  return function (target: object): void {
    Reflect.defineMetadata(ENTITY_TARGET_KEY, entityClass, target);
  };
}
