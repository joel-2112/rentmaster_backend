import { IsString, IsNotEmpty, IsOptional, IsUUID, IsNumber, IsBoolean } from 'class-validator';

export class CreateSubcityDto {
  @IsString()
  @IsNotEmpty({ message: 'የክፍለ ከተማ ስም ያስፈልጋል' })
  name: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsNotEmpty({ message: 'የከተማ አይዲ ያስፈልጋል' })
  cityId: string;

  @IsString()
  @IsOptional()
  officeName?: string;

  @IsString()
  @IsOptional()
  officePhone?: string;

  @IsString()
  @IsOptional()
  officeEmail?: string;

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

export class UpdateSubcityDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  cityId?: string;

  @IsString()
  @IsOptional()
  officeName?: string;

  @IsString()
  @IsOptional()
  officePhone?: string;

  @IsString()
  @IsOptional()
  officeEmail?: string;

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

export class SubcityResponseDto {
  id: string;
  name: string;
  code?: string;
  cityId: string;
  cityName?: string;
  officeName?: string;
  officePhone?: string;
  officeEmail?: string;
  latitude?: number;
  longitude?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}