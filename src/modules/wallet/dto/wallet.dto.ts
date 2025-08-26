// src/modules/wallets/dto/wallet.dto.ts

import { Serializer } from '@common/base-dto';
import { Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';
import {
  EWalletStatus,
  EWalletType,
  IWallet,
} from '../interfaces/wallet.interface';

export class WalletDTO extends Serializer<WalletDTO> implements IWallet {
  @IsOptional()
  @IsNumber({}, { message: 'ID deve ser um número' })
  @IsPositive({ message: 'ID deve ser um número positivo' })
  @Expose()
  id: number;

  @IsNotEmpty({ message: 'ID do usuário é obrigatório' })
  @IsNumber({}, { message: 'ID do usuário deve ser um número' })
  @IsPositive({ message: 'ID do usuário deve ser um número positivo' })
  @Expose()
  userId: number;

  @IsNotEmpty({ message: 'Número da conta é obrigatório' })
  @IsString({ message: 'Número da conta deve ser uma string' })
  @Matches(/^\d{6,10}$/, {
    message: 'Número da conta deve ter entre 6 e 10 dígitos',
  })
  @Expose()
  accountNumber: string;

  @IsNotEmpty({ message: 'Agência é obrigatória' })
  @IsString({ message: 'Agência deve ser uma string' })
  @Matches(/^\d{4}$/, {
    message: 'Agência deve ter exatamente 4 dígitos',
  })
  @Expose()
  agency: string;

  @IsNotEmpty({ message: 'Tipo de conta é obrigatório' })
  @IsEnum(EWalletType, {
    message: `Tipo de conta deve ser: ${Object.values(EWalletType).join(' ou ')}`,
  })
  @Expose()
  accountType: EWalletType;

  @IsNotEmpty({ message: 'Saldo é obrigatório' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Saldo deve ser um número com no máximo 2 casas decimais' },
  )
  @Min(0, { message: 'Saldo não pode ser negativo' })
  @Expose()
  balance: number;

  @IsNotEmpty({ message: 'Status da carteira é obrigatório' })
  @IsEnum(EWalletStatus, {
    message: `Status deve ser: ${Object.values(EWalletStatus).join(' ou ')}`,
  })
  @Expose()
  status: EWalletStatus;

  @IsOptional()
  @IsString({ message: 'Chave PIX deve ser uma string' })
  @MaxLength(140, { message: 'Chave PIX deve ter no máximo 140 caracteres' })
  @Expose()
  pixKey?: string;

  @IsNotEmpty({ message: 'Limite diário de saque é obrigatório' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'Limite diário de saque deve ser um número com no máximo 2 casas decimais',
    },
  )
  @Min(0, { message: 'Limite diário de saque deve ser positivo' })
  @Expose()
  dailyWithdrawLimit: number;

  @IsNotEmpty({ message: 'Limite mensal de saque é obrigatório' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'Limite mensal de saque deve ser um número com no máximo 2 casas decimais',
    },
  )
  @Min(0, { message: 'Limite mensal de saque deve ser positivo' })
  @Expose()
  monthlyWithdrawLimit: number;

  @IsOptional()
  @IsDate({ message: 'Data de bloqueio deve ser uma data válida' })
  @Type(() => Date)
  @Expose()
  blockedAt?: Date;

  @IsOptional()
  @IsNumber({}, { message: 'ID do bloqueador deve ser um número' })
  @IsPositive({ message: 'ID do bloqueador deve ser um número positivo' })
  @Expose()
  blockedBy?: number;

  @IsOptional()
  @IsString({ message: 'Motivo do bloqueio deve ser uma string' })
  @MaxLength(500, {
    message: 'Motivo do bloqueio deve ter no máximo 500 caracteres',
  })
  @Expose()
  blockReason?: string;

  @IsOptional()
  @IsBoolean({ message: 'Campo bloqueado deve ser um valor booleano' })
  @Expose()
  locked?: boolean;

  @IsOptional()
  @IsDate({ message: 'Data de criação deve ser uma data válida' })
  @Type(() => Date)
  @Expose()
  createdAt: Date;

  @IsOptional()
  @IsDate({ message: 'Data de atualização deve ser uma data válida' })
  @Type(() => Date)
  @Expose()
  updatedAt: Date;
}
