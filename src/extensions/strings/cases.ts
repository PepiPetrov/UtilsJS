export function convertToCamelCase(input: string) {
  return input
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function(
      word: string,
      index: number
    ): string {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
}

export function convertToKebabCase(input: string) {
  return input
    .split('')
    .map((letter: string, idx: number) => {
      return letter.toUpperCase() === letter
        ? `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}`
        : letter;
    })
    .join('');
}

export function convertToSnakeCase(input: string) {
  return input
    .replace(/\W+/g, ' ')
    .split(/ |\B(?=[A-Z])/)
    .map(word => word.toLowerCase())
    .join('_');
}

export function convertToPascalCase(input: string): string {
  return input
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

export function convertToTitleCase(input: string): string {
  return input.toLowerCase().replace(/(^|\s)\S/g, match => match.toUpperCase());
}

export function convertToSwapCase(input: string): string {
  return input
    .split('')
    .map(char => {
      if (char === char.toLowerCase()) {
        return char.toUpperCase();
      } else {
        return char.toLowerCase();
      }
    })
    .join('');
}
