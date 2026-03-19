export class AreaValue {
  private constructor(
    private readonly value: number,
    private readonly unit: 'sqm' | 'sqft' = 'sqm'
  ) {
    this.validateArea(value);
  }

  static create(value: number, unit: 'sqm' | 'sqft' = 'sqm'): AreaValue {
    return new AreaValue(value, unit);
  }

  private validateArea(value: number): void {
    if (value <= 0) {
      throw new Error('ስፋት ከዜሮ በላይ መሆን አለበት');
    }
    if (value > 10000) {
      throw new Error('ስፋት በጣም ከፍተኛ ነው');
    }
  }

  getValue(): number {
    return this.value;
  }

  getUnit(): string {
    return this.unit;
  }

  equals(other: AreaValue): boolean {
    return this.convertToSqm() === other.convertToSqm();
  }

  // ወደ ካሬ ሜትር መቀየር
  convertToSqm(): number {
    if (this.unit === 'sqm') {
      return this.value;
    }
    // sqft ወደ sqm (1 sqft = 0.092903 sqm)
    return this.value * 0.092903;
  }

  // ወደ ካሬ ጫማ መቀየር
  convertToSqft(): number {
    if (this.unit === 'sqft') {
      return this.value;
    }
    // sqm ወደ sqft (1 sqm = 10.7639 sqft)
    return this.value * 10.7639;
  }

  add(other: AreaValue): AreaValue {
    const totalSqm = this.convertToSqm() + other.convertToSqm();
    return new AreaValue(totalSqm, 'sqm');
  }

  isGreaterThan(other: AreaValue): boolean {
    return this.convertToSqm() > other.convertToSqm();
  }

  isLessThan(other: AreaValue): boolean {
    return this.convertToSqm() < other.convertToSqm();
  }

  getFormatted(): string {
    const unitDisplay = this.unit === 'sqm' ? 'ሜ²' : 'ጫ²';
    return `${this.value.toFixed(1)} ${unitDisplay}`;
  }
}