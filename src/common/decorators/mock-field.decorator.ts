import 'reflect-metadata';
import type { MockFieldFactory } from '../interfaces/seeder.types';

export const MOCK_FIELDS_KEY: unique symbol = Symbol('mockFields');

export function MockField<T>(factory: MockFieldFactory<T>): PropertyDecorator {
  return function (target: object, propertyKey: string | symbol): void {
    const Constructor = target.constructor as new () => object;
    const existingFields: Record<
      string | symbol,
      MockFieldFactory<unknown>
    > = Reflect.getMetadata(MOCK_FIELDS_KEY, Constructor) ?? {};

    const updatedFields = {
      ...existingFields,
      [propertyKey]: factory,
    };

    Reflect.defineMetadata(MOCK_FIELDS_KEY, updatedFields, Constructor);
  };
}
