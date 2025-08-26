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
  MaxLength,
  Min,
} from 'class-validator';
import {
  EPixKeyType,
  ETransactionStatus,
  ETransactionType,
  ITransaction,
} from '../interfaces/transaction.interface';

export class TransactionDTO
  extends Serializer<TransactionDTO>
  implements ITransaction
{
  @IsOptional()
  @IsNumber({}, { message: 'ID deve ser um número' })
  @IsPositive({ message: 'ID deve ser um número positivo' })
  @Expose()
  id?: number;

  @IsOptional()
  @IsNumber({}, { message: 'ID da carteira de origem deve ser um número' })
  @IsPositive({
    message: 'ID da carteira de origem deve ser um número positivo',
  })
  @Expose()
  fromWalletId?: number;

  @IsOptional()
  @IsNumber({}, { message: 'ID da carteira de destino deve ser um número' })
  @IsPositive({
    message: 'ID da carteira de destino deve ser um número positivo',
  })
  @Expose()
  toWalletId?: number;

  @IsNotEmpty({ message: 'Tipo de transação é obrigatório' })
  @IsEnum(ETransactionType, {
    message: `Tipo de transação deve ser: ${Object.values(ETransactionType).join(' ou ')}`,
  })
  @Expose()
  type: ETransactionType;

  @IsNotEmpty({ message: 'Valor da transação é obrigatório' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Valor deve ser um número com no máximo 2 casas decimais' },
  )
  @Min(0.01, { message: 'Valor deve ser maior que zero' })
  @Expose()
  amount: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Taxa deve ser um número com no máximo 2 casas decimais' },
  )
  @Min(0, { message: 'Taxa não pode ser negativa' })
  @Expose()
  fee?: number;

  @IsNotEmpty({ message: 'Status da transação é obrigatório' })
  @IsEnum(ETransactionStatus, {
    message: `Status deve ser: ${Object.values(ETransactionStatus).join(' ou ')}`,
  })
  @Expose()
  status: ETransactionStatus;

  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  @MaxLength(500, { message: 'Descrição deve ter no máximo 500 caracteres' })
  @Expose()
  description?: string;

  @IsOptional()
  @IsString({ message: 'ID externo deve ser uma string' })
  @MaxLength(100, { message: 'ID externo deve ter no máximo 100 caracteres' })
  @Expose()
  externalId?: string;

  @IsOptional()
  @IsString({ message: 'Chave PIX deve ser uma string' })
  @MaxLength(255, { message: 'Chave PIX deve ter no máximo 255 caracteres' })
  @Expose()
  pixKey?: string;

  @IsOptional()
  @IsEnum(EPixKeyType, {
    message: `Tipo de chave PIX deve ser: ${Object.values(EPixKeyType).join(' ou ')}`,
  })
  @Expose()
  pixKeyType?: EPixKeyType;

  @IsNotEmpty({ message: 'Chave de idempotência é obrigatória' })
  @IsString({ message: 'Chave de idempotência deve ser uma string' })
  @MaxLength(255, {
    message: 'Chave de idempotência deve ter no máximo 255 caracteres',
  })
  @Expose()
  idempotencyKey: string;

  @IsOptional()
  @IsDate({ message: 'Data de processamento deve ser uma data válida' })
  @Type(() => Date)
  @Expose()
  processedAt?: Date;

  @IsOptional()
  @IsString({ message: 'Mensagem de erro deve ser uma string' })
  @Expose()
  errorMessage?: string;

  @IsOptional()
  @IsObject({ message: 'Metadados devem ser um objeto' })
  @Expose()
  metadata?: Record<string, any>;

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
