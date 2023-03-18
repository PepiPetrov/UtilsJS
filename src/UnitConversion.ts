type ConversionFactor = Map<string, number | Abbreviations>;
type Abbreviations = Map<string, string>;
type ConversionFactors = Map<string, ConversionFactor & { abbreviations: Abbreviations }>;

export class UnitConversion {
  private static conversionFactors: ConversionFactors = new Map();

  static addConversionFactor(
    type: string,
    unit: string,
    factor: number,
    abbreviations?: Abbreviations
  ) {
    if (!this.conversionFactors.has(type)) {
      this.conversionFactors.set(type, { abbreviations: new Map() });
    }

    this.conversionFactors.get(type)?.set(unit, factor);

    if (abbreviations) {
      const existingAbbreviations = this.conversionFactors.get(type)?.abbreviations || new Map();
      this.conversionFactors.get(type)?.set('abbreviations', new Map([...existingAbbreviations, ...abbreviations]));
    }
  }

  static detectInputUnit(value: string, type: string): string {
    const conversionFactor = this.conversionFactors.get(type);

    if (!conversionFactor) {
      throw new Error(`Invalid conversion factor type: ${type}`);
    }

    for (const [unit, factor] of conversionFactor.entries()) {
      if (unit === value || factor.abbreviations?.get(value) === unit) {
        return unit;
      }
    }

    throw new Error(`Invalid input unit: ${value}`);
  }

  static convert(
    from: string,
    to: string | string[],
    value: number,
    type: string,
    roundTo?: number
  ): number | Map<string, number> {
    const fromUnit = this.detectInputUnit(from, type);
    const outputUnits = Array.isArray(to) ? to : [to];
    const output = new Map<string, number>();

    for (const outputUnit of outputUnits) {
      const toUnit = this.detectInputUnit(outputUnit, type);
      const conversionFactor = this.conversionFactors.get(type);

      if (
        conversionFactor &&
        conversionFactor.get(fromUnit) &&
        conversionFactor.get(toUnit)
      ) {
        let result =
          (value * (conversionFactor.get(fromUnit) as number)) /
          (conversionFactor.get(toUnit) as number);

        if (roundTo !== undefined) {
          result =
            Math.round(result * Math.pow(10, roundTo)) / Math.pow(10, roundTo);
        }

        output.set(outputUnit, result);
      } else {
        throw new Error(`Unsupported conversion from ${from} to ${outputUnit}`);
      }
    }

    return Array.isArray(to) ? output : output.get(to);
  }
}
