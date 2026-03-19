// የቤት ሁኔታዎች
export enum PropertyStatusEnum {
  AVAILABLE = 'AVAILABLE',
  RENTED = 'RENTED',
  UNDER_MAINTENANCE = 'UNDER_MAINTENANCE',
  UNAVAILABLE = 'UNAVAILABLE',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION'
}

export class PropertyStatusValue {
  private constructor(private readonly value: PropertyStatusEnum) {}

  static create(status: PropertyStatusEnum): PropertyStatusValue {
    return new PropertyStatusValue(status);
  }

  static fromString(status: string): PropertyStatusValue {
    const normalizedStatus = status.toUpperCase();
    if (!Object.values(PropertyStatusEnum).includes(normalizedStatus as PropertyStatusEnum)) {
      throw new Error(`የቤት ሁኔታ '${status}' ትክክል አይደለም`);
    }
    return new PropertyStatusValue(normalizedStatus as PropertyStatusEnum);
  }

  getValue(): PropertyStatusEnum {
    return this.value;
  }

  equals(other: PropertyStatusValue): boolean {
    return this.value === other.getValue();
  }

  // የሁኔታ ማረጋገጫዎች
  isAvailable(): boolean {
    return this.value === PropertyStatusEnum.AVAILABLE;
  }

  isRented(): boolean {
    return this.value === PropertyStatusEnum.RENTED;
  }

  isUnderMaintenance(): boolean {
    return this.value === PropertyStatusEnum.UNDER_MAINTENANCE;
  }

  isUnavailable(): boolean {
    return this.value === PropertyStatusEnum.UNAVAILABLE;
  }

  isPendingVerification(): boolean {
    return this.value === PropertyStatusEnum.PENDING_VERIFICATION;
  }

  canBeRented(): boolean {
    return this.isAvailable() && !this.isUnderMaintenance() && !this.isUnavailable();
  }

  getDisplayName(): string {
    const displayNames: Record<PropertyStatusEnum, string> = {
      [PropertyStatusEnum.AVAILABLE]: 'ባዶ',
      [PropertyStatusEnum.RENTED]: 'ተከራይቷል',
      [PropertyStatusEnum.UNDER_MAINTENANCE]: 'በጥገና ላይ',
      [PropertyStatusEnum.UNAVAILABLE]: 'አይገኝም',
      [PropertyStatusEnum.PENDING_VERIFICATION]: 'ማረጋገጫ በመጠባበቅ ላይ'
    };
    return displayNames[this.value];
  }

  getColor(): string {
    const colors: Record<PropertyStatusEnum, string> = {
      [PropertyStatusEnum.AVAILABLE]: 'green',
      [PropertyStatusEnum.RENTED]: 'blue',
      [PropertyStatusEnum.UNDER_MAINTENANCE]: 'orange',
      [PropertyStatusEnum.UNAVAILABLE]: 'red',
      [PropertyStatusEnum.PENDING_VERIFICATION]: 'yellow'
    };
    return colors[this.value];
  }
}