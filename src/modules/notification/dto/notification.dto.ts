import { Serializer } from '@common/base-dto';
import { Expose, Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import {
  ENotificationCategory,
  ENotificationStatus,
  ENotificationType,
  INotification,
} from '../interfaces/notification.interface';

export class NotificationDTO
  extends Serializer<NotificationDTO>
  implements INotification
{
  @IsOptional()
  @IsNumber({}, { message: 'ID deve ser um número' })
  @IsPositive({ message: 'ID deve ser um número positivo' })
  @Expose()
  id?: number;

  @IsNotEmpty({ message: 'ID do usuário é obrigatório' })
  @IsNumber({}, { message: 'ID do usuário deve ser um número' })
  @IsPositive({ message: 'ID do usuário deve ser um número positivo' })
  @Expose()
  userId: number;

  @IsOptional()
  @IsNumber({}, { message: 'ID da transação deve ser um número' })
  @IsPositive({ message: 'ID da transação deve ser um número positivo' })
  @Expose()
  transactionId?: number;

  @IsNotEmpty({ message: 'Tipo de notificação é obrigatório' })
  @IsEnum(ENotificationType, {
    message: `Tipo deve ser: ${Object.values(ENotificationType).join(' ou ')}`,
  })
  @Expose()
  type: ENotificationType;

  @IsNotEmpty({ message: 'Categoria da notificação é obrigatória' })
  @IsEnum(ENotificationCategory, {
    message: `Categoria deve ser: ${Object.values(ENotificationCategory).join(' ou ')}`,
  })
  @Expose()
  category: ENotificationCategory;

  @IsNotEmpty({ message: 'Status da notificação é obrigatório' })
  @IsEnum(ENotificationStatus, {
    message: `Status deve ser: ${Object.values(ENotificationStatus).join(' ou ')}`,
  })
  @Expose()
  status: ENotificationStatus;

  @IsNotEmpty({ message: 'Título é obrigatório' })
  @IsString({ message: 'Título deve ser uma string' })
  @MinLength(1, { message: 'Título deve ter pelo menos 1 caractere' })
  @MaxLength(255, { message: 'Título deve ter no máximo 255 caracteres' })
  @Expose()
  title: string;

  @IsNotEmpty({ message: 'Mensagem é obrigatória' })
  @IsString({ message: 'Mensagem deve ser uma string' })
  @MinLength(1, { message: 'Mensagem deve ter pelo menos 1 caractere' })
  @Expose()
  message: string;

  @IsNotEmpty({ message: 'Destinatário é obrigatório' })
  @IsString({ message: 'Destinatário deve ser uma string' })
  @MaxLength(255, { message: 'Destinatário deve ter no máximo 255 caracteres' })
  @Expose()
  recipient: string;

  @IsOptional()
  @IsObject({ message: 'Metadados devem ser um objeto' })
  @Expose()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsString({ message: 'ID do template deve ser uma string' })
  @MaxLength(100, {
    message: 'ID do template deve ter no máximo 100 caracteres',
  })
  @Expose()
  templateId?: string;

  @IsNotEmpty({ message: 'Número de tentativas é obrigatório' })
  @IsNumber({}, { message: 'Tentativas deve ser um número' })
  @Min(0, { message: 'Tentativas não pode ser negativo' })
  @Expose()
  attempts: number;

  @IsNotEmpty({ message: 'Máximo de tentativas é obrigatório' })
  @IsNumber({}, { message: 'Máximo de tentativas deve ser um número' })
  @Min(1, { message: 'Máximo de tentativas deve ser pelo menos 1' })
  @Max(10, { message: 'Máximo de tentativas não pode exceder 10' })
  @Expose()
  maxAttempts: number;

  @IsOptional()
  @IsDate({ message: 'Data de envio deve ser uma data válida' })
  @Type(() => Date)
  @Expose()
  sentAt?: Date;

  @IsOptional()
  @IsDate({ message: 'Data de entrega deve ser uma data válida' })
  @Type(() => Date)
  @Expose()
  deliveredAt?: Date;

  @IsOptional()
  @IsDate({ message: 'Data de falha deve ser uma data válida' })
  @Type(() => Date)
  @Expose()
  failedAt?: Date;

  @IsOptional()
  @IsString({ message: 'Mensagem de erro deve ser uma string' })
  @Expose()
  errorMessage?: string;

  @IsOptional()
  @IsDate({ message: 'Data de nova tentativa deve ser uma data válida' })
  @Type(() => Date)
  @Expose()
  retryAt?: Date;

  @IsOptional()
  @IsDate({ message: 'Data de criação deve ser uma data válida' })
  @Type(() => Date)
  @Expose()
  createdAt?: Date;

  @IsOptional()
  @IsDate({ message: 'Data de atualização deve ser uma data válida' })
  @Type(() => Date)
  @Expose()
  updatedAt?: Date;
}
