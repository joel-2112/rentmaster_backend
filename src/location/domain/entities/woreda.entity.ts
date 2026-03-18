import { CityEntity } from "./city.entity";
import { RegionEntity } from "./region.entity";
import { SubcityEntity } from "./subcity.entity";
import { ZoneEntity } from "./zone.entity";

export class WoredaEntity {
  id: string;
  name: string;
  number?: number | null;
  regionId: string;
  zoneId?: string | null;
  cityId?: string | null;
  subcityId?: string | null;
  officeName?: string | null;
  officePhone?: string | null;
  officeEmail?: string | null;
  population?: number | null;
  area?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  // ግንኙነቶች
  region?: RegionEntity;
  zone?: ZoneEntity;
  city?: CityEntity;
  subcity?: SubcityEntity;

  constructor(partial: Partial<WoredaEntity>) {
    Object.assign(this, partial);
  }

  // ቢዝነስ ሎጂክ
  getDisplayName(): string {
    return this.number ? `${this.name} (ቁጥር ${this.number})` : this.name;
  }

  getPopulationDensity(): number | null {
    if (this.population && this.area && this.area > 0) {
      return this.population / this.area;
    }
    return null;
  }
}