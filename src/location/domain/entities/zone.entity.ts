import { RegionEntity } from "./region.entity";

export class ZoneEntity {
  id: string;
  name: string;
  code?: string | null;
  regionId: string;
  createdAt: Date;
  updatedAt: Date;

  region?: RegionEntity;

  constructor(partial: Partial<ZoneEntity>) {
    Object.assign(this, partial);
  }

  getFullName(): string {
    return this.code ? `${this.name} (${this.code})` : this.name;
  }
}