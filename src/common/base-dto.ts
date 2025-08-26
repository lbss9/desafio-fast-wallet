import { plainToInstance } from 'class-transformer';

export class Serializer<TInput extends object = object> {
  public static serialize<U extends Serializer<T>, T extends object>(
    this: new (...args: unknown[]) => U,
    data: T,
  ): U {
    return plainToInstance(this, data, {
      excludeExtraneousValues: true,
    });
  }

  public static serializeList<U extends Serializer<T>, T extends object>(
    this: new (...args: unknown[]) => U,
    dataArray: T[],
  ): U[] {
    if (!Array.isArray(dataArray)) {
      throw new Error('O valor fornecido não é uma lista.');
    }

    return dataArray.map((data) =>
      plainToInstance(this, data, {
        excludeExtraneousValues: true,
      }),
    );
  }
}
