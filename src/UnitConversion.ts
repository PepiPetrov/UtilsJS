type ConversionFactor = {
  [key: string]: number | Abbreviations;
};

type Abbreviations = { [key: string]: string };

type ConversionFactors = {
  [key: string]: ConversionFactor & {
    abbreviations: { [key: string]: string };
  };
};

export class UnitConversion {
  private static conversionFactors: ConversionFactors = {};

  static addConversionFactor(
    type: string,
    unit: string,
    factor: number,
    abbreviations?: { [key: string]: string }
  ) {
    if (!this.conversionFactors[type]) {
      this.conversionFactors[type] = {
        abbreviations: abbreviations || {},
      };
    }
    this.conversionFactors[type][unit] = factor;
    if (abbreviations) {
      this.conversionFactors[type].abbreviations = {
        ...this.conversionFactors[type].abbreviations,
        ...abbreviations,
      };
    }
  }

  static detectInputUnit(value: string, type: string): string {
    const inputUnit = Object.keys(this.conversionFactors[type]).find(unit => {
      return (
        unit === value ||
        this.conversionFactors[type].abbreviations[value] === unit
      );
    });
    if (!inputUnit) {
      throw new Error(`Invalid input unit: ${value}`);
    }
    return inputUnit;
  }

  static convert(
    from: string,
    to: string | string[],
    value: number,
    type: string,
    roundTo?: number
  ): number | { [key: string]: number } {
    const fromUnit = this.detectInputUnit(from, type);
    const outputUnits = Array.isArray(to) ? to : [to];
    const output: { [key: string]: number } = {};
    outputUnits.forEach(outputUnit => {
      const toUnit = this.detectInputUnit(outputUnit, type);
      if (
        this.conversionFactors[type] &&
        this.conversionFactors[type][fromUnit] &&
        this.conversionFactors[type][toUnit]
      ) {
        let result =
          (value * (this.conversionFactors[type][fromUnit] as number)) /
          (this.conversionFactors[type][toUnit] as number);
        if (roundTo !== undefined) {
          result =
            Math.round(result * Math.pow(10, roundTo)) / Math.pow(10, roundTo);
        }
        output[outputUnit] = result;
      } else {
        throw new Error(`Unsupported conversion from ${from} to ${outputUnit}`);
      }
    });
    return Array.isArray(to) ? output : output[to];
  }
}
