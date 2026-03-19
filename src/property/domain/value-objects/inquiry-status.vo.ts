// የጥያቄ ሁኔታዎች
export enum InquiryStatusEnum {
  PENDING = 'PENDING',
  RESPONDED = 'RESPONDED',
  CLOSED = 'CLOSED',
  SPAM = 'SPAM'
}

export class InquiryStatusValue {
  private constructor(private readonly value: InquiryStatusEnum) {}

  static create(status: InquiryStatusEnum): InquiryStatusValue {
    return new InquiryStatusValue(status);
  }

  static fromString(status: string): InquiryStatusValue {
    const normalizedStatus = status.toUpperCase();
    if (!Object.values(InquiryStatusEnum).includes(normalizedStatus as InquiryStatusEnum)) {
      throw new Error(`የጥያቄ ሁኔታ '${status}' ትክክል አይደለም`);
    }
    return new InquiryStatusValue(normalizedStatus as InquiryStatusEnum);
  }

  getValue(): InquiryStatusEnum {
    return this.value;
  }

  equals(other: InquiryStatusValue): boolean {
    return this.value === other.getValue();
  }

  isPending(): boolean {
    return this.value === InquiryStatusEnum.PENDING;
  }

  isResponded(): boolean {
    return this.value === InquiryStatusEnum.RESPONDED;
  }

  isClosed(): boolean {
    return this.value === InquiryStatusEnum.CLOSED;
  }

  isSpam(): boolean {
    return this.value === InquiryStatusEnum.SPAM;
  }

  canBeResponded(): boolean {
    return this.isPending();
  }

  canBeClosed(): boolean {
    return this.isResponded();
  }

  getDisplayName(): string {
    const displayNames: Record<InquiryStatusEnum, string> = {
      [InquiryStatusEnum.PENDING]: 'በመጠባበቅ ላይ',
      [InquiryStatusEnum.RESPONDED]: 'ምላሽ ተሰጥቷል',
      [InquiryStatusEnum.CLOSED]: 'ተዘግቷል',
      [InquiryStatusEnum.SPAM]: 'አይፈለጌ መልዕክት'
    };
    return displayNames[this.value];
  }
}