import { describe, it, expect } from 'vitest';
import {
  sanitizeAmount,
  parseAmount,
  formatInputAmount,
  formatTokenAmount,
  formatUsd,
  formatRate,
  formatTime,
} from '../format';

describe('format utils', () => {
  describe('sanitizeAmount', () => {
    it('should strip non-numeric and non-dot characters', () => {
      expect(sanitizeAmount('12abc3')).toBe('123');
      expect(sanitizeAmount('1.2.3')).toBe('1.23');
      expect(sanitizeAmount('$12.34')).toBe('12.34');
    });

    it('should handle leading dots correctly', () => {
      expect(sanitizeAmount('.5')).toBe('0.5');
      expect(sanitizeAmount('.')).toBe('0.');
    });

    it('should enforce maximum length constraints', () => {
      // 14 digits whole, 8 digits fraction
      const longWhole = '123456789012345678';
      expect(sanitizeAmount(longWhole)).toBe('12345678901234');

      const longFraction = '0.123456789012';
      expect(sanitizeAmount(longFraction)).toBe('0.12345678');
    });
  });

  describe('parseAmount', () => {
    it('should return float for valid positive numbers', () => {
      expect(parseAmount('12')).toBe(12);
      expect(parseAmount('1.5')).toBe(1.5);
    });

    it('should return null for invalid inputs', () => {
      expect(parseAmount('abc')).toBeNull();
      expect(parseAmount('0')).toBeNull();
      expect(parseAmount('-5')).toBeNull();
      expect(parseAmount('')).toBeNull();
    });
  });

  describe('formatInputAmount', () => {
    it('should return empty string for invalid numbers', () => {
      expect(formatInputAmount(0)).toBe('');
      expect(formatInputAmount(-1)).toBe('');
    });

    it('should format numbers according to thresholds', () => {
      expect(formatInputAmount(1200)).toBe('1200'); // max 4 fraction digits
      expect(formatInputAmount(1.23456789)).toBe('1.234568'); // max 6 fraction digits
      expect(formatInputAmount(0.0001234567)).toBe('0.00012346'); // max 8 fraction digits
    });
  });

  describe('formatTokenAmount', () => {
    it('should return 0 for invalid numbers', () => {
      expect(formatTokenAmount(0)).toBe('0');
      expect(formatTokenAmount(-1)).toBe('0');
    });

    it('should format with group separators', () => {
      expect(formatTokenAmount(1500.5)).toBe('1,500.5');
    });
  });

  describe('formatUsd', () => {
    it('should format usd currency values correctly', () => {
      expect(formatUsd(1234.56)).toBe('$1,234.56');
      expect(formatUsd(0)).toBe('$0.00');
    });
  });

  describe('formatRate', () => {
    it('should format conversion rate correctly', () => {
      expect(formatRate(1.2345678)).toBe('1.234568'); // max 6 fraction digits
      expect(formatRate(0.000012345678)).toBe('0.0000123457'); // max 10 fraction digits
    });
  });

  describe('formatTime', () => {
    it('should format timestamp to hh:mm format', () => {
      const timestamp = new Date('2026-06-12T12:34:00Z').getTime();
      expect(formatTime(timestamp)).toMatch(/^\d{2}:\d{2}(\s?[A-Z]{2})?$/i);
    });
  });
});
