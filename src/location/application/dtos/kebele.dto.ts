import { IsString, IsNotEmpty, IsOptional, IsUUID, IsNumber, IsBoolean, IsInt, IsEmail } from 'class-validator';

export class CreateKebeleDto {
  @IsString()
  @IsNotEmpty({ message: 'የቀበሌ ስም ያስፈልጋል' })
  name: string;

  @IsInt()
  @IsOptional()
  number?: number;

  @IsUUID()
  @IsNotEmpty({ message: 'የክልል አይዲ ያስፈልጋል' })
  regionId: string;

  @IsUUID()
  @IsOptional()
  zoneId?: string;

  @IsUUID()
  @IsOptional()
  cityId?: string;

  @IsUUID()
  @IsOptional()
  subcityId?: string;

  @IsUUID()
  @IsOptional()
  woredaId?: string;

  @IsString()
  @IsOptional()
  officeName?: string;

  @IsString()
  @IsOptional()
  officePhone?: string;

  @IsEmail()
  @IsOptional()
  officeEmail?: string;

  @IsString()
  @IsOptional()
  officialName?: string;

  @IsString()
  @IsOptional()
  officialTitle?: string;

  @IsString()
  @IsOptional()
  officialPhone?: string;

  @IsInt()
  @IsOptional()
  population?: number;

  @IsNumber()
  @IsOptional()
  area?: number;

  @IsString()
  @IsOptional()
  sealImage?: string;

  @IsString()
  @IsOptional()
  sealCode?: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  hasDigitalSeal?: boolean;
}

export class UpdateKebeleDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsInt()
  @IsOptional()
  number?: number;

  @IsUUID()
  @IsOptional()
  regionId?: string;

  @IsUUID()
  @IsOptional()
  zoneId?: string;

  @IsUUID()
  @IsOptional()
  cityId?: string;

  @IsUUID()
  @IsOptional()
  subcityId?: string;

  @IsUUID()
  @IsOptional()
  woredaId?: string;

  @IsString()
  @IsOptional()
  officeName?: string;

  @IsString()
  @IsOptional()
  officePhone?: string;

  @IsEmail()
  @IsOptional()
  officeEmail?: string;

  @IsString()
  @IsOptional()
  officialName?: string;

  @IsString()
  @IsOptional()
  officialTitle?: string;

  @IsString()
  @IsOptional()
  officialPhone?: string;

  @IsInt()
  @IsOptional()
  population?: number;

  @IsNumber()
  @IsOptional()
  area?: number;

  @IsString()
  @IsOptional()
  sealImage?: string;

  @IsString()
  @IsOptional()
  sealCode?: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  hasDigitalSeal?: boolean;
}

export class KebeleResponseDto {
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
  woredaId?: string;
  woredaName?: string;
  officeName?: string;
  officePhone?: string;
  officeEmail?: string;
  officialName?: string;
  officialTitle?: string;
  officialPhone?: string;
  population?: number;
  area?: number;
  sealImage?: string;
  sealCode?: string;
  latitude?: number;
  longitude?: number;
  isActive: boolean;
  hasDigitalSeal: boolean;
  createdAt: Date;
  updatedAt: Date;
}