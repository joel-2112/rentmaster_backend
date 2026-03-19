import { InquiryStatus } from '@prisma/client';

export class PropertyInquiryEntity {
  id: string;
  propertyId: string;
  
  // ተመዝጋቢ ከሆነ
  userId?: string | null;
  
  // እንግዳ ከሆነ
  guestName?: string | null;
  guestEmail?: string | null;
  guestPhone?: string | null;
  
  message: string;
  status: InquiryStatus;
  
  // ምላሽ
  response?: string | null;
  respondedBy?: string | null;
  respondedAt?: Date | null;
  
  createdAt: Date;
  updatedAt: Date;

  // ግንኙነቶች (Relations) - አማራጭ
  // property?: PropertyEntity;
  // user?: UserEntity;
  // responder?: UserEntity;

  constructor(partial: Partial<PropertyInquiryEntity>) {
    Object.assign(this, partial);
  }

  // ==================== ቢዝነስ ሎጂክ ሜቶዶች ====================

  // ጥያቄው ከተመዝጋቢ መሆኑን ማረጋገጥ
  isFromRegisteredUser(): boolean {
    return !!this.userId;
  }

  // ጥያቄው ከእንግዳ መሆኑን ማረጋገጥ
  isFromGuest(): boolean {
    return !this.userId && !!this.guestName;
  }

  // ጥያቄው ንቁ መሆኑን ማረጋገጥ (ምላሽ ያልተሰጠው)
  isPending(): boolean {
    return this.status === InquiryStatus.PENDING;
  }

  // ምላሽ የተሰጠው መሆኑን ማረጋገጥ
  hasResponse(): boolean {
    return !!this.response && !!this.respondedAt;
  }

  // ምላሽ የተሰጠው በዚህ ሰው መሆኑን ማረጋገጥ
  isRespondedBy(userId: string): boolean {
    return this.respondedBy === userId;
  }

  // የተዘጋ ጥያቄ መሆኑን ማረጋገጥ
  isClosed(): boolean {
    return this.status === InquiryStatus.CLOSED;
  }

  // አይፈለጌ መልዕክት መሆኑን ማረጋገጥ
  isSpam(): boolean {
    return this.status === InquiryStatus.SPAM;
  }

  // ምላሽ መስጠት
  respond(response: string, responderId: string): void {
    this.response = response;
    this.respondedBy = responderId;
    this.respondedAt = new Date();
    this.status = InquiryStatus.RESPONDED;
  }

  // ጥያቄ መዝጋት
  close(): void {
    this.status = InquiryStatus.CLOSED;
  }

  // እንደ አይፈለጌ መልዕክት ምልክት ማድረግ
  markAsSpam(): void {
    this.status = InquiryStatus.SPAM;
  }

  // ጥያቄው ከተፈጠረ ምን ያህል ጊዜ እንደሆነ ማስላት
  getAgeInHours(): number {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - this.createdAt.getTime());
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    return diffHours;
  }

  // አስቸኳይ ምላሽ የሚፈልግ መሆኑን ማረጋገጥ (ከ24 ሰአት በላይ ሲቆይ)
  needsUrgentResponse(): boolean {
    return this.isPending() && this.getAgeInHours() > 24;
  }

  // የእንግዳ መረጃ ማግኘት (ለማሳያ)
  getGuestInfo(): { name: string; email?: string; phone?: string } | null {
    if (!this.guestName) return null;
    return {
      name: this.guestName,
      email: this.guestEmail || undefined,
      phone: this.guestPhone || undefined,
    };
  }

  // ሙሉ የመልዕክት ዝርዝር ማግኘት
  getMessageDetails(): {
    from: string;
    contact: string;
    message: string;
    status: string;
    age: string;
  } {
    let from = 'እንግዳ';
    let contact = '';
    
    if (this.isFromRegisteredUser()) {
      from = 'ተመዝጋቢ';
    } else if (this.guestName) {
      from = this.guestName;
      contact = [this.guestEmail, this.guestPhone].filter(Boolean).join(', ');
    }

    return {
      from,
      contact,
      message: this.message,
      status: this.status,
      age: `${this.getAgeInHours()} ሰአት`,
    };
  }
}