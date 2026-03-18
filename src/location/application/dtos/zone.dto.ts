import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateZoneDto {
  @IsString()
  @IsNotEmpty({ message: 'የዞን ስም ያስፈልጋል' })
  name: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsUUID()
  @IsNotEmpty({ message: 'የክልል አይዲ ያስፈልጋል' })
  regionId: string;
}

export class UpdateZoneDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsUUID()
  @IsOptional()
  regionId?: string;
}

export class ZoneResponseDto {
  id: string;
  name: string;
  code?: string;
  regionId: string;
  regionName?: string;
  createdAt: Date;
  updatedAt: Date;
}