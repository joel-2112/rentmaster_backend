export class PriceValue {
  private constructor(
    private readonly amount: number,
    private readonly currency: string = 'ETB'
  ) {
    this.validateAmount(amount);
  }

  static create(amount: number, currency: string = 'ETB'): PriceValue {
    return new PriceValue(amount, currency);
  }

  private validateAmount(amount: number): void {
    if (amount < 0) {
      throw new Error('ዋጋ ከዜሮ በታች መሆን አይችልም');
    }
    if (amount > 10000000) {
      throw new Error('ዋጋ በጣም ከፍተኛ ነው');
    }
  }

  getAmount(): number {
    return this.amount;
  }

  getCurrency(): string {
    return this.currency;
  }

  equals(other: PriceValue): boolean {
    return this.amount === other.getAmount() && this.currency === other.getCurrency();
  }

  add(other: PriceValue): PriceValue {
    if (this.currency !== other.getCurrency()) {
      throw new Error('የተለያየ ምንዛሪ መደመር አይቻልም');
    }
    return new PriceValue(this.amount + other.getAmount(), this.currency);
  }

  subtract(other: PriceValue): PriceValue {
    if (this.currency !== other.getCurrency()) {
      throw new Error('የተለያየ ምንዛሪ መቀነስ አይቻልም');
    }
    const result = this.amount - other.getAmount();
    if (result < 0) {
      throw new Error('ውጤቱ ከዜሮ በታች መሆን አይችልም');
    }
    return new PriceValue(result, this.currency);
  }

  multiply(factor: number): PriceValue {
    if (factor < 0) {
      throw new Error('ማባዣው ከዜሮ በላይ መሆን አለበት');
    }
    return new PriceValue(this.amount * factor, this.currency);
  }

  isGreaterThan(other: PriceValue): boolean {
    return this.amount > other.getAmount();
  }

  isLessThan(other: PriceValue): boolean {
    return this.amount < other.getAmount();
  }

  isBetween(min: PriceValue, max: PriceValue): boolean {
    return this.amount >= min.getAmount() && this.amount <= max.getAmount();
  }

  getFormatted(): string {
    return new Intl.NumberFormat('am-ET', {
      style: 'currency',
      currency: this.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(this.amount);
  }

  getAnnualPrice(): PriceValue {
    return this.multiply(12);
  }

  getMonthlyPrice(): PriceValue {
    return this;
  }
}