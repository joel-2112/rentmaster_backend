import { CityEntity } from './city.entity';
import { RegionEntity } from './region.entity';
import { SubcityEntity } from './subcity.entity';
import { WoredaEntity } from './woreda.entity';
import { ZoneEntity } from './zone.entity';

export class KebeleEntity {
  id: string;
  name: string;
  number?: number | null;
  regionId: string;
  zoneId?: string | null;
  cityId?: string | null;
  subcityId?: string | null;
  woredaId?: string | null;
  officeName?: string | null;
  officePhone?: string | null;
  officeEmail?: string | null;
  officialName?: string | null;
  officialTitle?: string | null;
  officialPhone?: string | null;
  population?: number | null;
  area?: number | null;
  sealImage?: string | null;
  sealCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  isActive: boolean;
  hasDigitalSeal: boolean;
  createdAt: Date;
  updatedAt: Date;

  // ግንኙነቶች
  region?: RegionEntity;
  zone?: ZoneEntity;
  city?: CityEntity;
  subcity?: SubcityEntity;
  woreda?: WoredaEntity;

  constructor(partial: Partial<KebeleEntity>) {
    Object.assign(this, partial);
  }

  // ቢዝነስ ሎጂክ
  hasSeal(): boolean {
    return this.hasDigitalSeal && !!this.sealImage;
  }

  getFullHierarchy(): string {
    const parts: string[] = [];

    if (this.region?.name) {
      parts.push(this.region.name);
    }
    if (this.zone?.name) {
      parts.push(this.zone.name);
    }
    if (this.city?.name) {
      parts.push(this.city.name);
    }
    if (this.subcity?.name) {
      parts.push(this.subcity.name);
    }
    if (this.woreda?.name) {
      parts.push(this.woreda.name);
    }

    parts.push(this.name);

    return parts.join(' → ');
  }

  getOfficialInfo(): { name: string; title: string; phone: string } | null {
    if (this.officialName && this.officialTitle) {
      return {
        name: this.officialName,
        title: this.officialTitle,
        phone: this.officialPhone || '',
      };
    }
    return null;
  }
}
