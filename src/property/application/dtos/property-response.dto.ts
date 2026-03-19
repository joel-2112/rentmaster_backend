import { PropertyType, PropertyStatus } from '@prisma/client';

// የአካባቢ ተዋረድ ስሞች ለማሳየት
class LocationHierarchyDto {
  regionId: string;
  regionName?: string;
  zoneId?: string;
  zoneName?: string;
  cityId?: string;
  cityName?: string;
  subcityId?: string;
  subcityName?: string;
  woredaId?: string;
  woredaName?: string;
  kebeleId?: string;
  kebeleName?: string;
  houseNumber?: string;
  streetName?: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;
  fullAddress?: string;
}

// የቤት ፎቶ ምላሽ
export class PropertyImageResponseDto {
  id: string;
  url: string;
  thumbnailUrl?: string;
  caption?: string;
  isPrimary: boolean;
  order: number;
  createdAt: Date;
}

// የቤት ባህሪ ምላሽ
export class PropertyFeatureResponseDto {
  id: string;
  name: string;
  category?: string;
  createdAt: Date;
}

// የቤት ባለቤት መረጃ (አጭር)
class LandlordInfoDto {
  id: string;
  name: string;
  phone: string;
  email?: string;
  isVerified: boolean;
}

// የደላላ መረጃ (አጭር)
class BrokerInfoDto {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

export class PropertyResponseDto {
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
  floor?: number;
  totalFloors?: number;

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

  // የአካባቢ መረጃ
  location: LocationHierarchyDto;

  // የማረጋገጫ መረጃ
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
  hasKebeleSeal: boolean;

  // የባለቤት መረጃ
  landlord: LandlordInfoDto;
  broker?: BrokerInfoDto;

  // ተያያዥ ዳታ
  images: PropertyImageResponseDto[];
  features: PropertyFeatureResponseDto[];

  // ስታቲስቲክስ
  viewCount: number;
  favoriteCount: number;
  inquiryCount: number;

  // ሌሎች
  availableFrom?: Date;
  isActive: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}