// src/location/application/dto/city.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsUUID, IsNumber, IsBoolean, IsEnum } from 'class-validator';

// የራስህን Enum ፍጠር
export enum CityType {
  CITY = 'CITY',
  TOWN = 'TOWN',
  ADMINISTRATION = 'ADMINISTRATION',
  SPECIAL_ZONE = 'SPECIAL_ZONE'
}

export class CreateCityDto {
  @IsString()
  @IsNotEmpty({ message: 'የከተማ ስም ያስፈልጋል' })
  name: string;

  @IsUUID()
  @IsNotEmpty({ message: 'የክልል አይዲ ያስፈልጋል' })
  regionId: string;

  @IsUUID()
  @IsOptional()
  zoneId?: string;

  @IsEnum(CityType)
  @IsOptional()
  cityType?: CityType;  // 👈 ከላይ ከፈጠርነው Enum ጋር

  @IsString()
  @IsOptional()
  municipalityName?: string;

  @IsString()
  @IsOptional()
  municipalityPhone?: string;

  @IsString()
  @IsOptional()
  municipalityEmail?: string;

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

export class CityResponseDto {
  id: string;
  name: string;
  regionId: string;
  regionName?: string;
  zoneId?: string;
  zoneName?: string;
  cityType: CityType;  
  municipalityName?: string;
  municipalityPhone?: string;
  municipalityEmail?: string;
  latitude?: number;
  longitude?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}