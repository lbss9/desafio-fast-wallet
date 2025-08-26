import { Serializer } from '@common/base-dto';
import { Expose, Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsIP,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  EAuditAction,
  EAuditResource,
  IAuditLog,
} from '../interfaces/audit-log.interface';

export class AuditLogDTO extends Serializer<AuditLogDTO> implements IAuditLog {
  @IsOptional()
  @IsNumber({}, { message: 'ID deve ser um número' })
  @IsPositive({ message: 'ID deve ser um número positivo' })
  @Expose()
  id?: number;

  @IsOptional()
  @IsNumber({}, { message: 'ID do usuário deve ser um número' })
  @IsPositive({ message: 'ID do usuário deve ser um número positivo' })
  @Expose()
  userId?: number;

  @IsNotEmpty({ message: 'Ação de auditoria é obrigatória' })
  @IsEnum(EAuditAction, {
    message: `Ação deve ser: ${Object.values(EAuditAction).join(' ou ')}`,
  })
  @Expose()
  action: EAuditAction;

  @IsNotEmpty({ message: 'Recurso de auditoria é obrigatório' })
  @IsEnum(EAuditResource, {
    message: `Recurso deve ser: ${Object.values(EAuditResource).join(' ou ')}`,
  })
  @Expose()
  resource: EAuditResource;

  @IsOptional()
  @IsNumber({}, { message: 'ID do recurso deve ser um número' })
  @IsPositive({ message: 'ID do recurso deve ser um número positivo' })
  @Expose()
  resourceId?: number;

  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  @IsString({ message: 'Descrição deve ser uma string' })
  @MinLength(1, { message: 'Descrição deve ter pelo menos 1 caractere' })
  @MaxLength(1000, { message: 'Descrição deve ter no máximo 1000 caracteres' })
  @Expose()
  description: string;

  @IsOptional()
  @IsIP(undefined, { message: 'Endereço IP deve ser válido' })
  @Expose()
  ipAddress?: string;

  @IsOptional()
  @IsString({ message: 'User agent deve ser uma string' })
  @MaxLength(500, { message: 'User agent deve ter no máximo 500 caracteres' })
  @Expose()
  userAgent?: string;

  @IsOptional()
  @IsObject({ message: 'Metadados devem ser um objeto' })
  @Expose()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsObject({ message: 'Valores antigos devem ser um objeto' })
  @Expose()
  oldValues?: Record<string, any>;

  @IsOptional()
  @IsObject({ message: 'Valores novos devem ser um objeto' })
  @Expose()
  newValues?: Record<string, any>;

  @IsOptional()
  @IsDate({ message: 'Data de criação deve ser uma data válida' })
  @Type(() => Date)
  @Expose()
  createdAt?: Date;
}
