import { Strings } from '../../src';

const { runLengthEncode, runLengthDecode } = Strings.RLE;

describe('rleEncode', () => {
  it('should return an empty string for an empty string input', () => {
    expect(runLengthEncode('')).toBe('');
  });

  it('should correctly encode a string with no repeated characters', () => {
    expect(runLengthEncode('abcdefg')).toBe('1a1b1c1d1e1f1g');
  });

  it('should correctly encode a string with repeated characters', () => {
    expect(runLengthEncode('aabbbbcccc')).toBe('2a4b4c');
  });
});

describe('rleDecode', () => {
  it('should return an empty string for an empty string input', () => {
    expect(runLengthDecode('')).toBe('');
  });

  it('should correctly decode a string with no repeated characters', () => {
    expect(runLengthDecode('1a1b1c1d1e1f1g')).toBe('abcdefg');
  });

  it('should correctly decode a string with repeated characters', () => {
    expect(runLengthDecode('2a4b4c')).toBe('aabbbbcccc');
  });
});
