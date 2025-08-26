import { MockField } from '@/common/decorators/mock-field.decorator';
import { fakerPT_BR as faker } from '@faker-js/faker';
import { HydrateSeeder } from '../../../common/decorators/hydrate-seeder.decorator';
import { BaseSeeder } from '../../../utils/repository/base-seeder';
import { TransactionEntity } from '../entities/transaction.entity';
import {
  EPixKeyType,
  ETransactionStatus,
  ETransactionType,
  ITransaction,
} from '../interfaces/transaction.interface';

@HydrateSeeder(TransactionEntity)
export class TransactionSeeder
  extends BaseSeeder<TransactionEntity>
  implements ITransaction
{
  @MockField(() => faker.number.int({ min: 1, max: 50 }))
  fromWalletId?: number;

  @MockField(() => faker.number.int({ min: 1, max: 50 }))
  toWalletId?: number;

  @MockField(() => {
    const typeWeights = [
      { value: ETransactionType.TRANSFER, weight: 40 },
      { value: ETransactionType.PIX_TRANSFER, weight: 30 },
      { value: ETransactionType.DEPOSIT, weight: 15 },
      { value: ETransactionType.WITHDRAWAL, weight: 10 },
      { value: ETransactionType.PAYMENT, weight: 4 },
      { value: ETransactionType.REFUND, weight: 1 },
    ];
    return faker.helpers.weightedArrayElement(typeWeights);
  })
  type: ETransactionType;

  @MockField(() => {
    return faker.number.float({ min: 1, max: 50000, fractionDigits: 2 });
  })
  amount: number;

  @MockField(() => {
    if (faker.datatype.boolean({ probability: 0.3 })) {
      return faker.number.float({ min: 0, max: 50, fractionDigits: 2 });
    }
    return 0;
  })
  fee?: number;

  @MockField(() => {
    const statusWeights = [
      { value: ETransactionStatus.COMPLETED, weight: 70 },
      { value: ETransactionStatus.PENDING, weight: 15 },
      { value: ETransactionStatus.PROCESSING, weight: 10 },
      { value: ETransactionStatus.FAILED, weight: 3 },
      { value: ETransactionStatus.CANCELLED, weight: 1 },
      { value: ETransactionStatus.REFUNDED, weight: 1 },
    ];
    return faker.helpers.weightedArrayElement(statusWeights);
  })
  status: ETransactionStatus;

  @MockField(() => {
    const descriptions = [
      'Transferência entre contas',
      'Pagamento de boleto',
      'Depósito via PIX',
      'Saque em caixa eletrônico',
      'Compra online',
      'Recarga de celular',
      'Pagamento de conta de luz',
      'Transferência para família',
      'Reembolso de compra',
      undefined,
    ];
    return faker.helpers.arrayElement(descriptions);
  })
  description?: string;

  @MockField(() => {
    if (faker.datatype.boolean({ probability: 0.2 })) {
      return `EXT_${faker.string.alphanumeric(10).toUpperCase()}`;
    }
    return undefined;
  })
  externalId?: string;

  @MockField(() => {
    if (faker.datatype.boolean({ probability: 0.6 })) {
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
    if (faker.datatype.boolean({ probability: 0.6 })) {
      return faker.helpers.enumValue(EPixKeyType);
    }
    return undefined;
  })
  pixKeyType?: EPixKeyType;

  @MockField(() => faker.string.uuid())
  idempotencyKey: string;

  @MockField(() => {
    if (faker.datatype.boolean({ probability: 0.8 })) {
      return faker.date.recent({ days: 30 });
    }
    return undefined;
  })
  processedAt?: Date;

  @MockField(() => {
    const errorMessages = [
      'Saldo insuficiente',
      'Conta de destino não encontrada',
      'Limite diário excedido',
      'Falha na comunicação com o banco',
      'Chave PIX inválida',
      'Transação bloqueada por segurança',
      undefined,
    ];
    return faker.helpers.arrayElement(errorMessages);
  })
  errorMessage?: string;

  @MockField(() => {
    const metadata = {
      ip: faker.internet.ip(),
      userAgent: faker.internet.userAgent(),
      channel: faker.helpers.arrayElement(['web', 'mobile', 'api']),
      location: faker.location.city(),
    };
    return faker.datatype.boolean({ probability: 0.7 }) ? metadata : undefined;
  })
  metadata?: Record<string, any>;
}
