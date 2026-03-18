import { IsString, IsNotEmpty, IsOptional, IsUUID, IsNumber, IsBoolean, IsInt } from 'class-validator';

export class CreateWoredaDto {
  @IsString()
  @IsNotEmpty({ message: 'የወረዳ ስም ያስፈልጋል' })
  name: string;

  @IsInt()
  @IsOptional()
  number?: number;

  @IsString()
  @IsNotEmpty({ message: 'የክልል አይዲ ያስፈልጋል' })
  regionId: string;

  @IsString()
  @IsOptional()
  zoneId?: string;

  @IsString()
  @IsOptional()
  cityId?: string;

  @IsString()
  @IsOptional()
  subcityId?: string;

  @IsString()
  @IsOptional()
  officeName?: string;

  @IsString()
  @IsOptional()
  officePhone?: string;

  @IsString()
  @IsOptional()
  officeEmail?: string;

  @IsInt()
  @IsOptional()
  population?: number;

  @IsNumber()
  @IsOptional()
  area?: number;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateWoredaDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsInt()
  @IsOptional()
  number?: number;

  @IsString()
  @IsOptional()
  regionId?: string;

  @IsString()
  @IsOptional()
  zoneId?: string;

  @IsString()
  @IsOptional()
  cityId?: string;

  @IsString()
  @IsOptional()
  subcityId?: string;

  @IsString()
  @IsOptional()
  officeName?: string;

  @IsString()
  @IsOptional()
  officePhone?: string;

  @IsString()
  @IsOptional()
  officeEmail?: string;

  @IsInt()
  @IsOptional()
  population?: number;

  @IsNumber()
  @IsOptional()
  area?: number;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class WoredaResponseDto {
  id: string;
  name: string;
  number?: number;
  regionId: string;
  regionName?: string;
  zoneId?: string;
  zoneName?: string;
  cityId?: string;
  cityName?: string;
  subcityId?: string;
  subcityName?: string;
  officeName?: string;
  officePhone?: string;
  officeEmail?: string;
  population?: number;
  area?: number;
  latitude?: number;
  longitude?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}