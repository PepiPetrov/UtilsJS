export function runLengthEncode(str: string): string {
  let result = '';
  let count = 1;
  for (let i = 1; i <= str.length; i++) {
    if (i === str.length || str.charAt(i) !== str.charAt(i - 1)) {
      result += count + str.charAt(i - 1);
      count = 1;
    } else {
      count++;
    }
  }
  return result;
}

export function runLengthDecode(str: string): string {
  let result = '';
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charAt(i);
    if (/[0-9]/.test(char)) {
      count = count * 10 + parseInt(char);
    } else {
      result += char.repeat(count);
      count = 0;
    }
  }
  return result;
}
