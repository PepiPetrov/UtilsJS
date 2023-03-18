export function words(
  subject: string = '',
  pattern: string | RegExp = /\b\w+\b/gi,
  flags: string = ''
): string[] {
  // Convert pattern to a regular expression if it is a string
  if (typeof pattern === 'string') {
    pattern = new RegExp(pattern, flags);
  }

  // Split the subject string into words using the pattern
  const words = subject.match(pattern) || [];

  // Return the array of words
  return words;
}
