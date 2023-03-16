export function getGraphemeAtPosition(
  subject: string,
  position: number
): string {
  let grapheme = '';
  let index = 0;

  while (index < subject.length) {
    const currentCodePoint = subject.codePointAt(index);

    if (currentCodePoint === undefined) {
      break;
    }

    const currentGrapheme = String.fromCodePoint(currentCodePoint);

    if (index === position) {
      grapheme = currentGrapheme;
      break;
    }

    index += currentGrapheme.length;
  }

  return grapheme;
}

export function prune(
  subject: string = '',
  length: number,
  ellipsis = '...'
): string {
  if (subject.length <= length) {
    return subject;
  }

  const words = subject.split(' ');
  let result = '';
  let count = 0;

  for (let i = 0; i < words.length; i++) {
    if (count + words[i].length + ellipsis.length > length) {
      break;
    }

    result += words[i] + ' ';
    count += words[i].length + 1;
  }

  return result.trim() + ellipsis;
}
