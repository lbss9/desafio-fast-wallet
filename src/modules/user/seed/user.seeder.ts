import { MockField } from '@/common/decorators/mock-field.decorator';
import { fakerPT_BR as faker } from '@faker-js/faker';
import { HydrateSeeder } from '../../../common/decorators/hydrate-seeder.decorator';
import { BaseSeeder } from '../../../utils/repository/base-seeder';
import { UserEntity } from '../entities/user.entity';
import { EUserType, IUser } from '../interfaces/user.interface';

@HydrateSeeder(UserEntity)
export class UserSeeder extends BaseSeeder<UserEntity> implements IUser {
  @MockField(() => faker.person.fullName())
  name: string;

  @MockField(() => faker.internet.email())
  email: string;

  @MockField(() => {
    const userTypeWeights = [
      { value: EUserType.USER, weight: 90 },
      { value: EUserType.ADMIN, weight: 10 },
    ];
    return faker.helpers.weightedArrayElement(userTypeWeights);
  })
  userType: EUserType;

  @MockField(() => {
    return faker.internet.password({
      length: faker.number.int({ min: 8, max: 16 }),
      memorable: false,
      pattern: /[a-zA-Z0-9@$!%*?&]/,
    });
  })
  password: string;

  @MockField(() => {
    const generateCPF = (): string => {
      const randomDigits = Array.from({ length: 9 }, () =>
        faker.number.int({ min: 0, max: 9 }),
      );

      const calculateDigit = (digits: number[], factor: number): number => {
        const sum = digits.reduce(
          (acc, digit, index) => acc + digit * (factor - index),
          0,
        );
        const remainder = sum % 11;
        return remainder < 2 ? 0 : 11 - remainder;
      };

      const firstDigit = calculateDigit(randomDigits, 10);
      const secondDigit = calculateDigit([...randomDigits, firstDigit], 11);

      const cpfNumbers = [...randomDigits, firstDigit, secondDigit];
      return cpfNumbers.join('');
    };

    return generateCPF();
  })
  taxId: string;
}
