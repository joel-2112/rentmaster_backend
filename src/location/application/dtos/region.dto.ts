import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateRegionDto {
  @IsString()
  @IsNotEmpty({ message: 'የክልል ስም ያስፈልጋል' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'የክልል ኮድ ያስፈልጋል' })
  code: string;
}

export class UpdateRegionDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  code?: string;
}

export class RegionResponseDto {
  id: string;
  name: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
}