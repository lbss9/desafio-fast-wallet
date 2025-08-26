import { MockField } from '@/common/decorators/mock-field.decorator';
import { fakerPT_BR as faker } from '@faker-js/faker';
import { HydrateSeeder } from '../../../common/decorators/hydrate-seeder.decorator';
import { BaseSeeder } from '../../../utils/repository/base-seeder';
import { WalletEntity } from '../entities/wallet.entity';
import { EWalletStatus, EWalletType } from '../interfaces/wallet.interface';

@HydrateSeeder(WalletEntity)
export class WalletSeeder extends BaseSeeder<WalletEntity> {
  @MockField(() => faker.number.int({ min: 1, max: 100 }))
  userId: number;

  @MockField(() => {
    return faker.string.numeric(faker.number.int({ min: 6, max: 10 }));
  })
  accountNumber: string;

  @MockField(() => {
    return 'FW' + faker.string.numeric(8);
  })
  walletNumber: string;

  @MockField(() => {
    return faker.string.numeric(4);
  })
  agency: string;

  @MockField(() => faker.helpers.enumValue(EWalletType))
  accountType: EWalletType;

  @MockField(() => faker.helpers.enumValue(EWalletType))
  walletType: EWalletType;

  @MockField(() => {
    return faker.number.float({ min: 0, max: 50000, fractionDigits: 2 });
  })
  balance: number;

  @MockField(() => {
    const statusWeights = [
      { value: EWalletStatus.ACTIVE, weight: 85 },
      { value: EWalletStatus.BLOCKED, weight: 10 },
      { value: EWalletStatus.SUSPENDED, weight: 5 },
    ];
    return faker.helpers.weightedArrayElement(statusWeights);
  })
  status: EWalletStatus;

  @MockField(() => {
    if (faker.datatype.boolean({ probability: 0.7 })) {
      const pixTypes = [
        () => faker.string.numeric(11),
        () => faker.internet.email(),
        () => `+55${faker.string.numeric(2)}9${faker.string.numeric(8)}`,
        () => faker.string.uuid(),
      ];
      return faker.helpers.arrayElement(pixTypes)();
    }
    return undefined;
  })
  pixKey?: string;

  @MockField(() => {
    return faker.number.float({ min: 1000, max: 10000, fractionDigits: 2 });
  })
  dailyWithdrawLimit: number;

  @MockField(() => {
    return faker.number.float({ min: 20000, max: 200000, fractionDigits: 2 });
  })
  monthlyWithdrawLimit: number;

  @MockField(() => {
    return undefined;
  })
  blockedAt?: Date;

  @MockField(() => {
    return undefined;
  })
  blockedBy?: number;

  @MockField(() => {
    const blockReasons = [
      'Atividade suspeita detectada na conta',
      'Solicitação do titular da conta',
      'Documentação pendente para verificação',
      'Transações irregulares identificadas',
      'Bloqueio preventivo por segurança',
      'Ordem judicial',
      undefined,
    ];
    return faker.helpers.arrayElement(blockReasons);
  })
  blockReason?: string;

  @MockField(() => {
    return faker.datatype.boolean({ probability: 0.05 });
  })
  locked?: boolean;
}
