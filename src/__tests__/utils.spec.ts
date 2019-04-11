import { randInt, extractUserFrom } from '../utils';

describe('extractIDFromMention', () => {
  describe('when an empty string is passed', () => {
    it('returns undefined', () => {
      expect(extractUserFrom('')).toBe(undefined);
    });
  });

  describe('when an invalid mention is passed', () => {
    it('returns undefined', () => {
      expect(extractUserFrom('Some invalid string')).toBe(undefined);
    });
  });

  describe('when a basic mention is passed', () => {
    it('extracts the ID', () => {
      expect(extractUserFrom('<@123456789012345678>')).toBe('123456789012345678');
    });
  });

  describe('when mention passed has nickname', () => {
    it('extracts the ID', () => {
      expect(extractUserFrom('<@!123456789012345678>')).toBe('123456789012345678');
    });
  });

  describe('when a basic ID is passed', () => {
    it('returns the raw ID', () => {
      expect(extractUserFrom('123456789012345678')).toBe('123456789012345678');
    });
  });
});

describe("randInt", () => {
  it("returns a random integer between min and max", () => {
    const result = randInt(0, 4);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThan(4);
  });
});