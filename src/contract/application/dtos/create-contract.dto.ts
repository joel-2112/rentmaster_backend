import { IsUUID, IsNotEmpty, IsNumber, IsDate, IsOptional, IsEnum, Min, Max, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ContractStatus } from './contract-status.enum';

export class CreateContractDto {
  @IsString()
  @IsNotEmpty({ message: 'የቤት አይዲ ያስፈልጋል' })
  propertyId: string;

  @IsString()
  @IsNotEmpty({ message: 'የተከራይ አይዲ ያስፈልጋል' })
  tenantId: string;

  @IsString()
  @IsOptional()
  brokerId?: string;

  @IsString()
  @IsNotEmpty({ message: 'የአከራይ አይዲ ያስፈልጋል' })  
  landlordId: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty({ message: 'ወርሃዊ ኪራይ ያስፈልጋል' })
  monthlyRent: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  securityDeposit?: number;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty({ message: 'የውል መጀመሪያ ቀን ያስፈልጋል' })
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty({ message: 'የውል ማብቂያ ቀን ያስፈልጋል' })
  endDate: Date;

  @IsNumber()
  @Min(1)
  @Max(28)
  @IsOptional()
  paymentDay?: number = 1;

  @IsString()
  @IsOptional()
  termsAndConditions?: string;
}