import { PartialType } from '@nestjs/mapped-types';
import { CreatePropertyDto } from './create-property.dto';
import { IsArray, IsOptional, ValidateNested, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PropertyImageDto, PropertyFeatureDto } from './create-property.dto';

export class UpdatePropertyDto extends PartialType(CreatePropertyDto) {
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

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imagesToDelete?: string[]; // ለመሰረዝ የታቀዱ ፎቶዎች አይዲዎች
}