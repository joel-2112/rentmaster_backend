import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsNumber, 
  IsBoolean, 
  IsEnum, 
  IsArray, 
  ValidateNested,
  Min,
  Max,
  IsUUID,
  IsInt,
  IsDate
} from 'class-validator';
import { Type } from 'class-transformer';
import { PropertyType, PropertyStatus } from '@prisma/client';

// ለቤት ፎቶዎች ንዑስ DTO
export class PropertyImageDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty({ message: 'የፎቶ ዩአርኤል ያስፈልጋል' })
  url: string;

  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  @IsString()
  @IsOptional()
  caption?: string;

  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;

  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number;
}

// ለቤት ባህሪያት ንዑስ DTO
export class PropertyFeatureDto {
  @IsString()
  @IsNotEmpty({ message: 'የባህሪ ስም ያስፈልጋል' })
  name: string;

  @IsString()
  @IsOptional()
  category?: string;
}

export class CreatePropertyDto {
  // ==================== መሰረታዊ መረጃ ====================
  
  @IsString()
  @IsNotEmpty({ message: 'የቤት ርዕስ ያስፈልጋል' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'የቤት መግለጫ ያስፈልጋል' })
  description: string;

  @IsEnum(PropertyType)
  @IsOptional()
  propertyType?: PropertyType;

  @IsEnum(PropertyStatus)
  @IsOptional()
  status?: PropertyStatus;

  // ==================== የቤት ዝርዝሮች ====================

  @IsInt()
  @Min(1)
  @IsOptional()
  bedrooms?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  bathrooms?: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty({ message: 'የቤት ስፋት ያስፈልጋል' })
  area: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  floor?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  totalFloors?: number;

  // ==================== ተጨማሪ መገልገያዎች ====================

  @IsBoolean()
  @IsOptional()
  hasFurniture?: boolean;

  @IsBoolean()
  @IsOptional()
  hasParking?: boolean;

  @IsBoolean()
  @IsOptional()
  hasElevator?: boolean;

  @IsBoolean()
  @IsOptional()
  hasBalcony?: boolean;

  @IsBoolean()
  @IsOptional()
  hasGarden?: boolean;

  @IsBoolean()
  @IsOptional()
  hasSecurity?: boolean;

  @IsBoolean()
  @IsOptional()
  hasBackupGenerator?: boolean;

  @IsBoolean()
  @IsOptional()
  hasWaterTank?: boolean;

  // ==================== የኪራይ ዝርዝሮች ====================

  @IsNumber()
  @Min(0)
  @IsNotEmpty({ message: 'ወርሃዊ ኪራይ ያስፈልጋል' })
  monthlyRent: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  securityDeposit?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  minimumLeaseMonths?: number;

  @IsBoolean()
  @IsOptional()
  isNegotiable?: boolean;

  // ==================== የአካባቢ መረጃ ====================

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
  woredaId?: string;

  @IsString()
  @IsOptional()
  kebeleId?: string;

  @IsString()
  @IsOptional()
  houseNumber?: string;

  @IsString()
  @IsOptional()
  streetName?: string;

  @IsString()
  @IsOptional()
  landmark?: string;

  @IsNumber()
  @IsOptional()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @IsNumber()
  @IsOptional()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @IsString()
  @IsOptional()
  googleMapsUrl?: string;

  // ==================== ባለቤት መረጃ ====================

  @IsString()
  @IsNotEmpty({ message: 'የቤት ባለቤት አይዲ ያስፈልጋል' })
  landlordId: string;

  @IsString()
  @IsOptional()
  brokerId?: string;

  // ==================== ተያያዥ ዳታ ====================

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PropertyImageDto)
  @IsOptional()
  images?: PropertyImageDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PropertyFeatureDto)
  @IsOptional()
  features?: PropertyFeatureDto[];

  // ==================== ሌሎች ====================

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  availableFrom?: Date;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @IsInt()
  @Min(0)
  @IsOptional()
  priority?: number;
}