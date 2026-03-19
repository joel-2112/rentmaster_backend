import { IsString, IsNotEmpty, IsOptional, IsEmail, IsUUID, IsEnum } from 'class-validator';
import { InquiryStatus } from '@prisma/client';

export class CreatePropertyInquiryDto {
  @IsUUID()
  @IsNotEmpty({ message: 'የቤት አይዲ ያስፈልጋል' })
  propertyId: string;

  // ተመዝጋቢ ከሆነ
  @IsUUID()
  @IsOptional()
  userId?: string;

  // እንግዳ ከሆነ
  @IsString()
  @IsOptional()
  guestName?: string;

  @IsEmail()
  @IsOptional()
  guestEmail?: string;

  @IsString()
  @IsOptional()
  guestPhone?: string;

  @IsString()
  @IsNotEmpty({ message: 'መልዕክት ያስፈልጋል' })
  message: string;
}

export class UpdatePropertyInquiryDto {
  @IsEnum(InquiryStatus)
  @IsOptional()
  status?: InquiryStatus;

  @IsString()
  @IsOptional()
  response?: string;
}

export class PropertyInquiryResponseDto {
  id: string;
  propertyId: string;
  propertyTitle?: string;
  
  // ተመዝጋቢ ከሆነ
  userId?: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  
  // እንግዳ ከሆነ
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  
  message: string;
  status: InquiryStatus;
  response?: string;
  respondedBy?: string;
  respondedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}