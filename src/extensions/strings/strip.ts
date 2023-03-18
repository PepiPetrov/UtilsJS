export function stripTags(
  subject: string = '',
  allowableTags: string | string[] = [],
  replacement: string = ''
): string {
  if (!subject) {
    return '';
  }

  // Ensure allowableTags is an array of strings
  if (typeof allowableTags === 'string') {
    allowableTags = allowableTags.trim().split(/\s+/);
  } else if (Array.isArray(allowableTags)) {
    allowableTags = allowableTags.filter(tag => typeof tag === 'string');
  } else {
    allowableTags = [];
  }

  // Create a regular expression to match all HTML tags except for the allowable tags
  const regex = new RegExp(`</?(?!${allowableTags.join('|')})[^>]*>`, 'gi');

  // Replace the matched HTML tags with the replacement string
  return subject
    .trim()
    .replace(regex, replacement)
    .replace(/\s+/g, ' ');
}

export function stripBom(subject: string = ''): string {
  const bom = '\uFEFF';

  if (subject.startsWith(bom)) {
    return subject.substring(1);
  }

  return subject;
}
