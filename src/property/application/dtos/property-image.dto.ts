import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsInt, Min, IsUUID } from 'class-validator';

export class CreatePropertyImageDto {
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

export class UpdatePropertyImageDto {
  @IsString()
  @IsOptional()
  url?: string;

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

export class PropertyImageResponseDto {
  id: string;
  propertyId: string;
  url: string;
  thumbnailUrl?: string;
  caption?: string;
  isPrimary: boolean;
  order: number;
  createdAt: Date;
}