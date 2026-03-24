import { PartialType } from '@nestjs/mapped-types';
import { CreateContractDto } from './create-contract.dto';
import { IsNumber, IsDate, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateContractDto extends PartialType(CreateContractDto) {
  @IsNumber()
  @Min(0)
  @IsOptional()
  monthlyRent?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  securityDeposit?: number;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDate?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate?: Date;

  @IsNumber()
  @Min(1)
  @Max(28)
  @IsOptional()
  paymentDay?: number;
}