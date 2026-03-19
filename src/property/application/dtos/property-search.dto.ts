import { IsOptional, IsString, IsNumber, Min, Max, IsEnum, IsBoolean, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { PropertyType, PropertyStatus } from '@prisma/client';
import { PropertyResponseDto } from './property-response.dto';

export class PropertySearchDto {
  // የፍለጋ ቁልፍ ቃል
  @IsString()
  @IsOptional()
  keyword?: string;

  // የአካባቢ ማጣሪያ
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
  woredaId?: string;

  @IsString()
  @IsOptional()
  kebeleId?: string;

  // የዋጋ ማጣሪያ
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  minPrice?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  maxPrice?: number;

  // የቤት ዝርዝሮች ማጣሪያ
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  bedrooms?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  bathrooms?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  minArea?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  maxArea?: number;

  // የቤት አይነት ማጣሪያ
  @IsEnum(PropertyType)
  @IsOptional()
  propertyType?: PropertyType;

  @IsEnum(PropertyStatus)
  @IsOptional()
  status?: PropertyStatus;

  // ተጨማሪ መገልገያዎች ማጣሪያ
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  hasFurniture?: boolean;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  hasParking?: boolean;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  hasElevator?: boolean;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  hasBalcony?: boolean;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  hasGarden?: boolean;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  hasSecurity?: boolean;

  // ማረጋገጫ ማጣሪያ
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isVerified?: boolean;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  featured?: boolean;

  // የደረደር (Sorting)
  @IsString()
  @IsOptional()
  sortBy?: 'price' | 'area' | 'createdAt' | 'viewCount' | 'monthlyRent';

  @IsString()
  @IsOptional()
  sortOrder?: 'asc' | 'desc';

  // ገጽ መቁጠርያ (Pagination)
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;
}

// የፍለጋ ውጤት ምላሽ
export class PropertySearchResponseDto {
  data: PropertyResponseDto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}