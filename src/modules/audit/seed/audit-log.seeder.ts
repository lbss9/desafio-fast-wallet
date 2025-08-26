import { MockField } from '@/common/decorators/mock-field.decorator';
import { fakerPT_BR as faker } from '@faker-js/faker';
import { HydrateSeeder } from '../../../common/decorators/hydrate-seeder.decorator';
import { BaseSeeder } from '../../../utils/repository/base-seeder';
import { AuditLogEntity } from '../entities/audit-log.entity';
import {
  EAuditAction,
  EAuditResource,
  IAuditLog,
} from '../interfaces/audit-log.interface';

@HydrateSeeder(AuditLogEntity)
export class AuditLogSeeder
  extends BaseSeeder<AuditLogEntity>
  implements IAuditLog
{
  @MockField(() => {
    if (faker.datatype.boolean({ probability: 0.8 })) {
      return faker.number.int({ min: 1, max: 100 });
    }
    return undefined;
  })
  userId?: number;

  @MockField(() => {
    const actionWeights = [
      { value: EAuditAction.LOGIN, weight: 25 },
      { value: EAuditAction.TRANSACTION, weight: 20 },
      { value: EAuditAction.UPDATE, weight: 15 },
      { value: EAuditAction.CREATE, weight: 15 },
      { value: EAuditAction.LOGOUT, weight: 10 },
      { value: EAuditAction.PASSWORD_CHANGE, weight: 5 },
      { value: EAuditAction.BLOCK_ACCOUNT, weight: 3 },
      { value: EAuditAction.UNBLOCK_ACCOUNT, weight: 3 },
      { value: EAuditAction.DELETE, weight: 2 },
      { value: EAuditAction.PASSWORD_RESET, weight: 2 },
    ];
    return faker.helpers.weightedArrayElement(actionWeights);
  })
  action: EAuditAction;

  @MockField(() => {
    const resourceWeights = [
      { value: EAuditResource.TRANSACTION, weight: 40 },
      { value: EAuditResource.USER, weight: 25 },
      { value: EAuditResource.WALLET, weight: 20 },
      { value: EAuditResource.AUTH, weight: 10 },
      { value: EAuditResource.NOTIFICATION, weight: 5 },
    ];
    return faker.helpers.weightedArrayElement(resourceWeights);
  })
  resource: EAuditResource;

  @MockField(() => {
    if (faker.datatype.boolean({ probability: 0.7 })) {
      return faker.number.int({ min: 1, max: 1000 });
    }
    return undefined;
  })
  resourceId?: number;

  @MockField(() => {
    const descriptions = [
      'Usuário realizou login no sistema',
      'Nova transação PIX processada',
      'Dados do usuário atualizados',
      'Nova conta criada no sistema',
      'Usuário fez logout',
      'Senha alterada pelo usuário',
      'Conta bloqueada por administrador',
      'Conta desbloqueada',
      'Registro removido do sistema',
      'Solicitação de reset de senha',
      'Transferência entre carteiras realizada',
      'Limite de saque alterado',
      'Chave PIX cadastrada',
      'Notificação enviada ao usuário',
      'Tentativa de login falhosa detectada',
      'Transação cancelada pelo usuário',
      'Carteira digital criada',
      'Status da carteira alterado',
      'Configurações de segurança atualizadas',
      'Acesso via API registrado',
    ];
    return faker.helpers.arrayElement(descriptions);
  })
  description: string;

  @MockField(() => faker.internet.ip())
  ipAddress?: string;

  @MockField(() => {
    const userAgents = [
      'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
      'Mozilla/5.0 (Android 11; Mobile; rv:90.0) Gecko/90.0 Firefox/90.0',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      'FastWallet-Mobile/1.0.0 (iOS)',
      'FastWallet-Mobile/1.0.0 (Android)',
      'FastWallet-API/1.0.0',
    ];
    return faker.helpers.arrayElement(userAgents);
  })
  userAgent?: string;

  @MockField(() => {
    const metadata = {
      sessionId: faker.string.uuid(),
      deviceId: faker.string.alphanumeric(16),
      platform: faker.helpers.arrayElement(['web', 'mobile', 'api']),
      version: faker.system.semver(),
      location: {
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
        country: 'BR',
      },
      transactionAmount: faker.number.float({
        min: 1,
        max: 10000,
        fractionDigits: 2,
      }),
      previousValue: faker.lorem.word(),
      newValue: faker.lorem.word(),
    };
    return faker.datatype.boolean({ probability: 0.8 }) ? metadata : undefined;
  })
  metadata?: Record<string, any>;

  @MockField(() => {
    if (faker.datatype.boolean({ probability: 0.3 })) {
      return {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        status: 'ACTIVE',
        balance: faker.number.float({ min: 0, max: 50000, fractionDigits: 2 }),
      };
    }
    return undefined;
  })
  oldValues?: Record<string, any>;

  @MockField(() => {
    if (faker.datatype.boolean({ probability: 0.3 })) {
      return {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        status: 'UPDATED',
        balance: faker.number.float({ min: 0, max: 50000, fractionDigits: 2 }),
      };
    }
    return undefined;
  })
  newValues?: Record<string, any>;
}
