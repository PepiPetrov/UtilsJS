export function runLengthEncode(input: string): string {
  let result = '';
  let count = 1;
  for (let i = 1; i <= input.length; i++) {
    if (i === input.length || input.charAt(i) !== input.charAt(i - 1)) {
      result += count + input.charAt(i - 1);
      count = 1;
    } else {
      count++;
    }
  }
  return result;
}

export function runLengthDecode(input: string): string {
  let result = '';
  let count = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charAt(i);
    if (/[0-9]/.test(char)) {
      count = count * 10 + parseInt(char);
    } else {
      result += char.repeat(count);
      count = 0;
    }
  }
  return result;
}
