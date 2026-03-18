// src/users/application/dto/create-user.dto.ts
import { IsEmail, IsString, MinLength, IsOptional, IsEnum, Matches } from 'class-validator';

export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  KEBELE_OFFICIAL = 'KEBELE_OFFICIAL',
  LANDLORD = 'LANDLORD',
  TENANT = 'TENANT',
  BROKER = 'BROKER',
  SERVICE_PROVIDER = 'SERVICE_PROVIDER',
}

export class CreateUserDto {
  @IsString({ message: 'ስም ያስፈልጋል' })
  name: string;

  @IsEmail({}, { message: 'ትክክለኛ ኢሜይል አይደለም' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'የይለፍ ቃል ቢያንስ 6 ቁምፊዎች መሆን አለበት' })
  password: string;

  @IsString()
  @Matches(/^[0-9]{10,}$/, { message: 'ናሽናል አይዲ ቢያንስ 10 አሃዝ መሆን አለበት' })
  nationalId: string;

  @IsString()
  @Matches(/^[0-9]{10,}$/, { message: 'ስልክ ቁጥር ትክክል መሆን አለበት' })
  phone: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}