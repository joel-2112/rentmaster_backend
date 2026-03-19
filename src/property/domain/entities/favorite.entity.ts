export class FavoriteEntity {
  id: string;
  userId: string;
  propertyId: string;
  createdAt: Date;

  // ግንኙነቶች (Relations) - አማራጭ
  // user?: UserEntity;
  // property?: PropertyEntity;

  constructor(partial: Partial<FavoriteEntity>) {
    Object.assign(this, partial);
  }

  // ==================== ቢዝነስ ሎጂክ ሜቶዶች ====================

  // ተወዳጅነቱ ከተፈጠረ ምን ያህል ጊዜ እንደሆነ ማስላት
  getAgeInDays(): number {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - this.createdAt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  // በቅርብ ጊዜ የተወደደ መሆኑን ማረጋገጥ (ከ7 ቀን በታች)
  isRecent(): boolean {
    return this.getAgeInDays() <= 7;
  }

  // ተመሳሳይ ተጠቃሚ እና ቤት መሆኑን ማረጋገጥ
  isSame(userId: string, propertyId: string): boolean {
    return this.userId === userId && this.propertyId === propertyId;
  }

  // የተወደደው በዚህ ተጠቃሚ መሆኑን ማረጋገጥ
  isFavoritedBy(userId: string): boolean {
    return this.userId === userId;
  }

  // የተወደደው ይህን ቤት መሆኑን ማረጋገጥ
  isForProperty(propertyId: string): boolean {
    return this.propertyId === propertyId;
  }
}