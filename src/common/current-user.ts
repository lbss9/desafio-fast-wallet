import { EUserType } from '@modules/user/interfaces/user.interface';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { Serializer } from './base-dto';
import { ICurrentUser } from './interfaces/current-user.interface';

export class CurrentUserDTO
  extends Serializer<ICurrentUser>
  implements ICurrentUser
{
  @ApiProperty({
    description: 'Identificador único do usuário',
    example: 1,
    type: 'integer',
    minimum: 1,
  })
  @Expose()
  @IsInt({ message: 'O identificador do usuário deve ser um número inteiro' })
  @IsPositive({ message: 'O identificador do usuário deve ser positivo' })
  @Type(() => Number)
  sub: number;

  @ApiProperty({
    description: 'Endereço de email do usuário',
    example: 'usuario@exemplo.com',
    format: 'email',
  })
  @Expose()
  @IsEmail({}, { message: 'Formato de email inválido' })
  @IsString({ message: 'O email deve ser uma string' })
  email: string;

  @ApiProperty({
    description: 'Tipo/perfil do usuário no sistema',
    enum: EUserType,
    example: EUserType.EMPLOYEE,
  })
  @Expose()
  @IsEnum(EUserType, {
    message: `Tipo de usuário deve ser um dos valores: ${Object.values(EUserType).join(', ')}`,
  })
  userType: EUserType;

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva',
    minLength: 2,
    maxLength: 255,
  })
  @Expose()
  @IsString({ message: 'O nome completo deve ser uma string' })
  fullName: string;

  @ApiPropertyOptional({
    description: 'Timestamp de emissão do token JWT',
    example: 1640995200,
    type: 'integer',
  })
  @Expose()
  @IsOptional()
  @IsInt({ message: 'O timestamp de emissão deve ser um número inteiro' })
  @Min(0, { message: 'O timestamp de emissão deve ser positivo' })
  @Type(() => Number)
  iat?: number;

  @ApiPropertyOptional({
    description: 'Timestamp de expiração do token JWT',
    example: 1640998800,
    type: 'integer',
  })
  @Expose()
  @IsOptional()
  @IsInt({ message: 'O timestamp de expiração deve ser um número inteiro' })
  @Min(0, { message: 'O timestamp de expiração deve ser positivo' })
  @Type(() => Number)
  exp?: number;

  public isTokenValid(): boolean {
    if (!this.exp) {
      return true;
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);
    return this.exp > currentTimestamp;
  }

  public getTimeToExpiration(): number | null {
    if (!this.exp) {
      return null;
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const timeRemaining = this.exp - currentTimestamp;

    return Math.max(0, timeRemaining);
  }

  public hasUserType(userType: EUserType): boolean {
    return this.userType === userType;
  }

  public isAdministrator(): boolean {
    return this.hasUserType(EUserType.ADMINISTRATOR);
  }
}
