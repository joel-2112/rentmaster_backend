import { RegionEntity } from "./region.entity";
import { ZoneEntity } from "./zone.entity";

// ከዚህ በፊት የፈጠርነውን Enum እንጠቀም
export enum CityType {
  CITY = 'CITY',
  TOWN = 'TOWN',
  ADMINISTRATION = 'ADMINISTRATION',
  SPECIAL_ZONE = 'SPECIAL_ZONE'
}

export class CityEntity {
  id: string;
  name: string;
  regionId: string;
  zoneId?: string | null;
  cityType: CityType;
  municipalityName?: string | null;
  municipalityPhone?: string | null;
  municipalityEmail?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  // ግንኙነቶች
  region?: RegionEntity;
  zone?: ZoneEntity;

  constructor(partial: Partial<CityEntity>) {
    Object.assign(this, partial);
  }

  hasMunicipality(): boolean {
    return !!(this.municipalityName || this.municipalityPhone || this.municipalityEmail);
  }

  getLocationCoordinates(): { lat: number; lng: number } | null {
    if (this.latitude && this.longitude) {
      return { lat: this.latitude, lng: this.longitude };
    }
    return null;
  }
}