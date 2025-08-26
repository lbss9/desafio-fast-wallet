import { MockField } from '@/common/decorators/mock-field.decorator';
import { fakerPT_BR as faker } from '@faker-js/faker';
import { HydrateSeeder } from '../../../common/decorators/hydrate-seeder.decorator';
import { BaseSeeder } from '../../../utils/repository/base-seeder';
import { NotificationEntity } from '../entities/notification.entity';
import {
  ENotificationCategory,
  ENotificationStatus,
  ENotificationType,
  INotification,
} from '../interfaces/notification.interface';

@HydrateSeeder(NotificationEntity)
export class NotificationSeeder
  extends BaseSeeder<NotificationEntity>
  implements INotification
{
  @MockField(() => faker.number.int({ min: 1, max: 100 }))
  userId: number;

  @MockField(() => {
    if (faker.datatype.boolean({ probability: 0.6 })) {
      return faker.number.int({ min: 1, max: 200 });
    }
    return undefined;
  })
  transactionId?: number;

  @MockField(() => {
    const typeWeights = [
      { value: ENotificationType.PUSH, weight: 40 },
      { value: ENotificationType.EMAIL, weight: 30 },
      { value: ENotificationType.SMS, weight: 20 },
      { value: ENotificationType.IN_APP, weight: 10 },
    ];
    return faker.helpers.weightedArrayElement(typeWeights);
  })
  type: ENotificationType;

  @MockField(() => {
    const categoryWeights = [
      { value: ENotificationCategory.TRANSACTION, weight: 50 },
      { value: ENotificationCategory.SECURITY, weight: 25 },
      { value: ENotificationCategory.ACCOUNT, weight: 15 },
      { value: ENotificationCategory.SYSTEM, weight: 7 },
      { value: ENotificationCategory.MARKETING, weight: 3 },
    ];
    return faker.helpers.weightedArrayElement(categoryWeights);
  })
  category: ENotificationCategory;

  @MockField(() => {
    const statusWeights = [
      { value: ENotificationStatus.DELIVERED, weight: 70 },
      { value: ENotificationStatus.SENT, weight: 15 },
      { value: ENotificationStatus.PENDING, weight: 10 },
      { value: ENotificationStatus.FAILED, weight: 4 },
      { value: ENotificationStatus.CANCELLED, weight: 1 },
    ];
    return faker.helpers.weightedArrayElement(statusWeights);
  })
  status: ENotificationStatus;

  @MockField(() => {
    const titles = [
      'Transação realizada com sucesso',
      'Sua conta foi acessada',
      'Novo PIX recebido',
      'Saque realizado',
      'Depósito confirmado',
      'Limite de conta atualizado',
      'Manutenção programada',
      'Nova funcionalidade disponível',
      'Comprovante de pagamento',
      'Transferência processada',
    ];
    return faker.helpers.arrayElement(titles);
  })
  title: string;

  @MockField(() => {
    const messages = [
      'Sua transação de R$ {amount} foi processada com sucesso.',
      'Detectamos um novo acesso à sua conta. Se não foi você, entre em contato conosco.',
      'Você recebeu um PIX no valor de R$ {amount}.',
      'Saque de R$ {amount} realizado em {location}.',
      'Depósito de R$ {amount} confirmado em sua conta.',
      'Seu limite diário foi atualizado para R$ {limit}.',
      'Realizaremos manutenção no sistema das 02h às 06h.',
      'Confira as novas funcionalidades em seu app.',
      'Comprovante disponível para download.',
      'Transferência para {recipient} foi concluída.',
    ];
    return faker.helpers.arrayElement(messages);
  })
  message: string;

  @MockField(() => {
    const recipients = [
      faker.internet.email(),
      `+55${faker.string.numeric(2)}9${faker.string.numeric(8)}`,
      `device_${faker.string.alphanumeric(10)}`,
      `user_${faker.number.int({ min: 1, max: 1000 })}`,
    ];
    return faker.helpers.arrayElement(recipients);
  })
  recipient: string;

  @MockField(() => {
    const metadata = {
      amount: faker.number.float({ min: 1, max: 10000, fractionDigits: 2 }),
      location: faker.location.city(),
      limit: faker.number.float({ min: 1000, max: 50000, fractionDigits: 2 }),
      recipient: faker.person.firstName(),
      device: faker.helpers.arrayElement(['iOS', 'Android', 'Web']),
      ip: faker.internet.ip(),
    };
    return faker.datatype.boolean({ probability: 0.8 }) ? metadata : undefined;
  })
  metadata?: Record<string, any>;

  @MockField(() => {
    const templates = [
      'transaction_success',
      'security_alert',
      'pix_received',
      'withdrawal_completed',
      'deposit_confirmed',
      'limit_updated',
      'maintenance_notice',
      'feature_announcement',
      undefined,
    ];
    return faker.helpers.arrayElement(templates);
  })
  templateId?: string;

  @MockField(() => faker.number.int({ min: 0, max: 3 }))
  attempts: number;

  @MockField(() => faker.number.int({ min: 3, max: 5 }))
  maxAttempts: number;

  @MockField(() => {
    if (faker.datatype.boolean({ probability: 0.8 })) {
      return faker.date.recent({ days: 7 });
    }
    return undefined;
  })
  sentAt?: Date;

  @MockField(() => {
    if (faker.datatype.boolean({ probability: 0.7 })) {
      return faker.date.recent({ days: 7 });
    }
    return undefined;
  })
  deliveredAt?: Date;

  @MockField(() => {
    if (faker.datatype.boolean({ probability: 0.1 })) {
      return faker.date.recent({ days: 7 });
    }
    return undefined;
  })
  failedAt?: Date;

  @MockField(() => {
    const errorMessages = [
      'Destinatário não encontrado',
      'Falha na conexão com o provedor',
      'Token de push inválido',
      'Número de telefone inválido',
      'Email com formato inválido',
      'Rate limit excedido',
      undefined,
    ];
    return faker.helpers.arrayElement(errorMessages);
  })
  errorMessage?: string;

  @MockField(() => {
    if (faker.datatype.boolean({ probability: 0.1 })) {
      return faker.date.soon({ days: 1 });
    }
    return undefined;
  })
  retryAt?: Date;
}
