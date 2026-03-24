import { ContractStatus } from '../../application/dtos/contract-status.enum';

export class ContractEntity {
  id: string;
  contractNumber: string;
  propertyId: string;
  tenantId: string;
  landlordId: string;
  brokerId?: string | null;
  monthlyRent: number;
  securityDeposit: number;
  startDate: Date;
  endDate: Date;
  paymentDay: number;
  termsAndConditions?: string | null;
  specialClauses?: any | null;
  status: ContractStatus;
  landlordSigned: boolean;
  tenantSigned: boolean;
  brokerSigned: boolean;
  landlordSignedAt?: Date | null;
  tenantSignedAt?: Date | null;
  brokerSignedAt?: Date | null;
  kebeleApproved: boolean;
  kebeleApprovedBy?: string | null;
  kebeleApprovedAt?: Date | null;
  kebeleStamp?: string | null;
  kebeleNotes?: string | null;
  pdfUrl?: string | null;
  pdfVersion: number;
  
  // 👇 እነዚህን የጎደሉትን ጨምር
  terminatedAt?: Date | null;
  terminationReason?: string | null;
  terminationBy?: string | null;
  renewalCount: number;
  lastRenewedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<ContractEntity>) {
    Object.assign(this, partial);
  }

  // ቢዝነስ ሎጂክ ሜቶዶች

  isFullySigned(): boolean {
    let signed = this.landlordSigned && this.tenantSigned;
    if (this.brokerId) {
      signed = signed && (this.brokerSigned || false);
    }
    return signed;
  }

  canBeActivated(): boolean {
    return this.isFullySigned() && this.kebeleApproved && this.status === ContractStatus.PENDING_KEBELE;
  }

  signByLandlord(): void {
    this.landlordSigned = true;
    this.landlordSignedAt = new Date();
    this.updateStatusAfterSign();
  }

  signByTenant(): void {
    this.tenantSigned = true;
    this.tenantSignedAt = new Date();
    this.updateStatusAfterSign();
  }

  signByBroker(): void {
    if (!this.brokerId) return;
    this.brokerSigned = true;
    this.brokerSignedAt = new Date();
    this.updateStatusAfterSign();
  }

  private updateStatusAfterSign(): void {
    if (this.landlordSigned && this.tenantSigned && (!this.brokerId || this.brokerSigned)) {
      this.status = ContractStatus.PENDING_KEBELE;
    } else if (this.landlordSigned && !this.tenantSigned) {
      this.status = ContractStatus.PENDING_TENANT;
    } else if (!this.landlordSigned && this.tenantSigned) {
      this.status = ContractStatus.PENDING_LANDLORD;
    } else if (this.brokerId && this.landlordSigned && this.tenantSigned && !this.brokerSigned) {
      this.status = ContractStatus.PENDING_BROKER;
    }
  }

  approveByKebele(officialId: string, stamp?: string, notes?: string): void {
    this.kebeleApproved = true;
    this.kebeleApprovedBy = officialId;
    this.kebeleApprovedAt = new Date();
    if (stamp) this.kebeleStamp = stamp;
    if (notes) this.kebeleNotes = notes;
    this.status = ContractStatus.ACTIVE;
  }

  rejectByKebele(reason: string): void {
    this.status = ContractStatus.DISPUTED;
    this.kebeleNotes = reason;
  }

  terminate(reason?: string, terminatedBy?: string): void {
    this.status = ContractStatus.TERMINATED;
    this.terminatedAt = new Date();
    this.terminationReason = reason;
    this.terminationBy = terminatedBy;
  }

  renew(newEndDate: Date): void {
    this.endDate = newEndDate;
    this.status = ContractStatus.ACTIVE;
    this.renewalCount += 1;
    this.lastRenewedAt = new Date();
  }

  expire(): void {
    this.status = ContractStatus.EXPIRED;
  }

  isActive(): boolean {
    return this.status === ContractStatus.ACTIVE;
  }

  isExpired(): boolean {
    return new Date() > this.endDate;
  }

  getRemainingDays(): number {
    const today = new Date();
    const diffTime = this.endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}