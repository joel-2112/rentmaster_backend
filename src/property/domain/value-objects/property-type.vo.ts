// የቤት አይነቶች
export enum PropertyTypeEnum {
  APARTMENT = 'APARTMENT',
  HOUSE = 'HOUSE',
  VILLA = 'VILLA',
  STUDIO = 'STUDIO',
  COMMERCIAL = 'COMMERCIAL',
  OFFICE = 'OFFICE',
  WAREHOUSE = 'WAREHOUSE',
  LAND = 'LAND'
}

export class PropertyTypeValue {
  private constructor(private readonly value: PropertyTypeEnum) {}

  static create(type: PropertyTypeEnum): PropertyTypeValue {
    return new PropertyTypeValue(type);
  }

  static fromString(type: string): PropertyTypeValue {
    const normalizedType = type.toUpperCase();
    if (!Object.values(PropertyTypeEnum).includes(normalizedType as PropertyTypeEnum)) {
      throw new Error(`የቤት አይነት '${type}' ትክክል አይደለም`);
    }
    return new PropertyTypeValue(normalizedType as PropertyTypeEnum);
  }

  getValue(): PropertyTypeEnum {
    return this.value;
  }

  equals(other: PropertyTypeValue): boolean {
    return this.value === other.getValue();
  }

  // የአይነት መግለጫዎች
  isApartment(): boolean {
    return this.value === PropertyTypeEnum.APARTMENT;
  }

  isHouse(): boolean {
    return this.value === PropertyTypeEnum.HOUSE;
  }

  isCommercial(): boolean {
    return [
      PropertyTypeEnum.COMMERCIAL,
      PropertyTypeEnum.OFFICE,
      PropertyTypeEnum.WAREHOUSE
    ].includes(this.value);
  }

  isResidential(): boolean {
    return [
      PropertyTypeEnum.APARTMENT,
      PropertyTypeEnum.HOUSE,
      PropertyTypeEnum.VILLA,
      PropertyTypeEnum.STUDIO
    ].includes(this.value);
  }

  getDisplayName(): string {
    const displayNames: Record<PropertyTypeEnum, string> = {
      [PropertyTypeEnum.APARTMENT]: 'አፓርትመንት',
      [PropertyTypeEnum.HOUSE]: 'ቤት',
      [PropertyTypeEnum.VILLA]: 'ቪላ',
      [PropertyTypeEnum.STUDIO]: 'ስቱዲዮ',
      [PropertyTypeEnum.COMMERCIAL]: 'የንግድ ቦታ',
      [PropertyTypeEnum.OFFICE]: 'ቢሮ',
      [PropertyTypeEnum.WAREHOUSE]: 'መጋዘን',
      [PropertyTypeEnum.LAND]: 'መሬት'
    };
    return displayNames[this.value];
  }
}