import { ContractStatus } from './contract-status.enum';

export class ContractResponseDto {
  id: string;
  contractNumber: string;
  propertyId: string;
  propertyTitle?: string;
  tenantId: string;
  tenantName?: string;
  landlordId: string;
  landlordName?: string;
  brokerId?: string;
  brokerName?: string;
  monthlyRent: number;
  securityDeposit: number;
  startDate: Date;
  endDate: Date;
  paymentDay: number;
  termsAndConditions?: string;
  status: ContractStatus;
  landlordSigned: boolean;
  tenantSigned: boolean;
  brokerSigned: boolean;
  kebeleApproved: boolean;
  kebeleApprovedBy?: string;
  kebeleApprovedAt?: Date;
  kebeleStamp?: string;
  pdfUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}