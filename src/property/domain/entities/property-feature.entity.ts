export class PropertyFeatureEntity {
  id: string;
  propertyId: string;
  name: string;
  category?: string | null;
  createdAt: Date;

  constructor(partial: Partial<PropertyFeatureEntity>) {
    Object.assign(this, partial);
  }

  // ==================== ቢዝነስ ሎጂክ ====================

  // ባህሪው በምድብ መከፋፈሉን ማረጋገጥ
  hasCategory(): boolean {
    return !!this.category;
  }

  // ለማሳያ የሚሆን ስም ማግኘት
  getDisplayName(): string {
    return this.name;
  }
}