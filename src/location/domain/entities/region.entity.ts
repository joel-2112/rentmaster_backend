export class RegionEntity {
  id: string;
  name: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<RegionEntity>) {
    Object.assign(this, partial);
  }


  isActive(): boolean {
    const daysSinceCreation = Math.floor((Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceCreation < 30;
  }
}