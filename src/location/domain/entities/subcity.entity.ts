import { CityEntity } from "./city.entity";

export class SubcityEntity {
  id: string;
  name: string;
  code?: string | null;
  cityId: string;
  officeName?: string | null;
  officePhone?: string | null;
  officeEmail?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  // ግንኙነቶች
  city?: CityEntity;

  constructor(partial: Partial<SubcityEntity>) {
    Object.assign(this, partial);
  }

  // ቢዝነስ ሎጂክ
  hasOffice(): boolean {
    return !!(this.officeName || this.officePhone || this.officeEmail);
  }

  getFullAddress(): string {
    let address = this.name;
    if (this.city) {
      address += `, ${this.city.name}`;
    }
    return address;
  }
}