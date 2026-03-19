import { PropertyType, PropertyStatus } from '@prisma/client';
import { PropertyImageEntity } from './property-image.entity';
import { PropertyFeatureEntity } from './property-feature.entity';

export class PropertyEntity {
  // መሰረታዊ መረጃ
  id: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  status: PropertyStatus;

  // የቤት ዝርዝሮች
  bedrooms: number;
  bathrooms: number;
  area: number;
  floor?: number | null;
  totalFloors?: number | null;

  // ተጨማሪ መገልገያዎች
  hasFurniture: boolean;
  hasParking: boolean;
  hasElevator: boolean;
  hasBalcony: boolean;
  hasGarden: boolean;
  hasSecurity: boolean;
  hasBackupGenerator: boolean;
  hasWaterTank: boolean;

  // የኪራይ ዝርዝሮች
  monthlyRent: number;
  securityDeposit: number;
  minimumLeaseMonths: number;
  isNegotiable: boolean;

  // የአካባቢ መረጃ (IDs)
  regionId: string;
  zoneId?: string | null;
  cityId?: string | null;
  subcityId?: string | null;
  woredaId?: string | null;
  kebeleId?: string | null;
  houseNumber?: string | null;
  streetName?: string | null;
  landmark?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  googleMapsUrl?: string | null;
  fullAddress?: string | null;

  // የማረጋገጫ መረጃ
  isVerified: boolean;
  verifiedBy?: string | null;
  verifiedAt?: Date | null;
  verificationDocument?: string | null;
  kebeleSeal?: string | null;
  sealAppliedAt?: Date | null;
  sealExpiresAt?: Date | null;
  verificationHistory?: any | null; // JSON field

  // የእይታ እና ስታቲስቲክስ
  viewCount: number;
  favoriteCount: number;
  inquiryCount: number;

  // ሌሎች
  availableFrom?: Date | null;
  isActive: boolean;
  featured: boolean;
  priority: number;

  // የባለቤት መረጃ
  landlordId: string;
  brokerId?: string | null;

  // ታይምስታምፕ
  createdAt: Date;
  updatedAt: Date;

  // ግንኙነቶች (Relations) - አማራጭ
  images?: PropertyImageEntity[];
  features?: PropertyFeatureEntity[];
  // ሌሎች ግንኙነቶች በኋላ ልንጨምር እንችላለን
  // contracts?: ContractEntity[];
  // maintenanceRequests?: MaintenanceRequestEntity[];
  // favorites?: FavoriteEntity[];
  // inquiries?: PropertyInquiryEntity[];

  constructor(partial: Partial<PropertyEntity>) {
    Object.assign(this, partial);
  }

  // ==================== ቢዝነስ ሎጂክ ሜቶዶች ====================

  // ቤቱ ለኪራይ ዝግጁ መሆኑን ማረጋገጥ
  isAvailable(): boolean {
    return this.status === PropertyStatus.AVAILABLE && this.isActive;
  }

  // ቤቱ የተረጋገጠ መሆኑን ማረጋገጥ
  isFullyVerified(): boolean {
    return this.isVerified && !!this.kebeleSeal;
  }

  // የማህተም ማረጋገጫ
  hasValidSeal(): boolean {
    if (!this.sealExpiresAt) return false;
    return this.sealExpiresAt > new Date();
  }

  // ዋና ፎቶ ማግኘት
  getPrimaryImage(): PropertyImageEntity | undefined {
    return this.images?.find((img) => img.isPrimary);
  }

  // ሙሉ አድራሻ ማመንጨት
  generateFullAddress(
    regionName?: string,
    zoneName?: string,
    cityName?: string,
    subcityName?: string,
    woredaName?: string,
    kebeleName?: string,
  ): string {
    const parts: string[] = []; 

    if (regionName) parts.push(regionName);
    if (zoneName) parts.push(zoneName);
    if (cityName) parts.push(cityName);
    if (subcityName) parts.push(subcityName);
    if (woredaName) parts.push(woredaName);
    if (kebeleName) parts.push(kebeleName);
    if (this.streetName) parts.push(this.streetName);
    if (this.houseNumber) parts.push(`ቤት ቁጥር ${this.houseNumber}`);
    if (this.landmark) parts.push(`ከ${this.landmark} አጠገብ`);

    return parts.join('፣ ');
  }

  // የኪራይ ዋጋ ቅርጸት
  getFormattedPrice(): string {
    return new Intl.NumberFormat('am-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0,
    }).format(this.monthlyRent);
  }

  // እይታ ሲጨምር
  incrementViewCount(): void {
    this.viewCount += 1;
  }

  // ተወዳጅነት ሲጨምር
  incrementFavoriteCount(): void {
    this.favoriteCount += 1;
  }

  // ተወዳጅነት ሲቀንስ
  decrementFavoriteCount(): void {
    if (this.favoriteCount > 0) {
      this.favoriteCount -= 1;
    }
  }

  // ጥያቄ ሲጨምር
  incrementInquiryCount(): void {
    this.inquiryCount += 1;
  }

  // ቤት ማረጋገጥ
  verify(officialId: string, seal?: string): void {
    this.isVerified = true;
    this.verifiedBy = officialId;
    this.verifiedAt = new Date();
    if (seal) {
      this.kebeleSeal = seal;
      this.sealAppliedAt = new Date();
      // ማህተሙ ለ1 ዓመት ይሰራል ብለን እናስብ
      this.sealExpiresAt = new Date();
      this.sealExpiresAt.setFullYear(this.sealExpiresAt.getFullYear() + 1);
    }
  }

  // ቤት ማራዘም
  renewSeal(officialId: string, seal: string): void {
    this.verifiedBy = officialId;
    this.kebeleSeal = seal;
    this.sealAppliedAt = new Date();
    this.sealExpiresAt = new Date();
    this.sealExpiresAt.setFullYear(this.sealExpiresAt.getFullYear() + 1);
  }

  // ቤት ማሰናከል
  deactivate(): void {
    this.isActive = false;
    this.status = PropertyStatus.UNAVAILABLE;
  }

  // ቤት እንደገና ማንቃት
  activate(): void {
    this.isActive = true;
    if (this.status === PropertyStatus.UNAVAILABLE) {
      this.status = PropertyStatus.AVAILABLE;
    }
  }

  // ቤት መከራየት
  markAsRented(): void {
    this.status = PropertyStatus.RENTED;
  }

  // ቤት ነፃ መሆኑን ማመላከት
  markAsAvailable(): void {
    if (this.status === PropertyStatus.RENTED) {
      this.status = PropertyStatus.AVAILABLE;
    }
  }

  // በጥገና ላይ ማድረግ
  markAsUnderMaintenance(): void {
    this.status = PropertyStatus.UNDER_MAINTENANCE;
  }

  // ቤቱ ባለቤት መሆኑን ማረጋገጥ
  isOwnedBy(userId: string): boolean {
    return this.landlordId === userId;
  }

  // በደላላ መተዳደሩን ማረጋገጥ
  isManagedBy(userId: string): boolean {
    return this.brokerId === userId;
  }

  // ቤቱን ለማሳደግ (featured)
  feature(priority: number = 1): void {
    this.featured = true;
    this.priority = priority;
  }

  // ማሳደግን ማስወገድ
  unfeature(): void {
    this.featured = false;
    this.priority = 0;
  }
}
