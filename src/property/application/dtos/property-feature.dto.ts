import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePropertyFeatureDto {
  @IsString()
  @IsNotEmpty({ message: 'የባህሪ ስም ያስፈልጋል' })
  name: string;

  @IsString()
  @IsOptional()
  category?: string;
}

export class UpdatePropertyFeatureDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  category?: string;
}

export class PropertyFeatureResponseDto {
  id: string;
  propertyId: string;
  name: string;
  category?: string;
  createdAt: Date;
}