export class PropertyImageEntity {
  id: string;
  propertyId: string;
  url: string;
  thumbnailUrl?: string | null;
  caption?: string | null;
  isPrimary: boolean;
  order: number;
  fileSize?: number | null;
  mimeType?: string | null;
  width?: number | null;
  height?: number | null;
  createdAt: Date;

  constructor(partial: Partial<PropertyImageEntity>) {
    Object.assign(this, partial);
  }

  // ==================== ቢዝነስ ሎጂክ ====================

  // ዋና ፎቶ መሆኑን ማረጋገጥ
  isMainImage(): boolean {
    return this.isPrimary;
  }

  // የማሳያ ዩአርኤል ማግኘት (thumbnail ካለ ያን፣ ከሌለ ዋናውን)
  getDisplayUrl(): string {
    return this.thumbnailUrl || this.url;
  }

  // ፎቶ መለወጥ
  setAsPrimary(): void {
    this.isPrimary = true;
  }

  // ዋናነትን ማስወገድ
  removeAsPrimary(): void {
    this.isPrimary = false;
  }
}