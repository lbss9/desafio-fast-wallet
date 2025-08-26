// src/modules/users/dto/user.dto.ts

import { Serializer } from '@common/base-dto';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { EUserType, IUser } from '../interfaces/user.interface';

export class UserDTO extends Serializer<UserDTO> implements IUser {
  @IsOptional()
  @IsNumber({}, { message: 'ID deve ser um número' })
  @IsPositive({ message: 'ID deve ser um número positivo' })
  @Expose()
  id: number;

  @IsNotEmpty({ message: 'Nome completo é obrigatório' })
  @IsString({ message: 'Nome completo deve ser uma string' })
  @MinLength(2, { message: 'Nome completo deve ter pelo menos 2 caracteres' })
  @MaxLength(100, {
    message: 'Nome completo deve ter no máximo 100 caracteres',
  })
  @Transform(({ value }) => value?.trim())
  @Matches(/^[a-zA-ZÀ-ÿ\s]+$/, {
    message: 'Nome completo deve conter apenas letras e espaços',
  })
  @Expose()
  name: string;

  @IsNotEmpty({ message: 'Email é obrigatório' })
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  @MaxLength(255, { message: 'Email deve ter no máximo 255 caracteres' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  @Expose()
  email: string;

  @IsNotEmpty({ message: 'Tipo de usuário é obrigatório' })
  @IsEnum(EUserType, {
    message: `Tipo de usuário deve ser: ${Object.values(EUserType).join(' ou ')}`,
  })
  @Expose()
  userType: EUserType;

  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(8, { message: 'Senha deve ter pelo menos 8 caracteres' })
  @MaxLength(128, { message: 'Senha deve ter no máximo 128 caracteres' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message:
        'Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 símbolo',
    },
  )
  @Exclude({ toPlainOnly: true })
  password: string;

  @IsNotEmpty({ message: 'CPF é obrigatório' })
  @IsString({ message: 'CPF deve ser uma string' })
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
    message: 'CPF deve estar no formato xxx.xxx.xxx-xx',
  })
  @Expose()
  taxId: string;

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
