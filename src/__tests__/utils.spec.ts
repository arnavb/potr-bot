import { extractIDFromMention } from '../utils';

describe('extractIDFromMention', () => {
  describe('when an empty string is passed', () => {
    it('returns undefined', () => {
      expect(extractIDFromMention('')).toBe(undefined);
    });
  });

  describe('when an invalid mention is passed', () => {
    it('returns undefined', () => {
      expect(extractIDFromMention('Some invalid string')).toBe(undefined);
    });
  });

  describe('when a basic mention is passed', () => {
    it('extracts the ID', () => {
      expect(extractIDFromMention('<@123456789012345678>')).toBe('123456789012345678');
    });
  });

  describe('when mention passed has nickname', () => {
    it('extracts the ID', () => {
      expect(extractIDFromMention('<@!123456789012345678>')).toBe('123456789012345678');
    });
  });
});
