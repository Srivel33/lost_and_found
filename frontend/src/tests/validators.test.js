import { describe, it, expect } from 'vitest';
import {
  isValidCollegeEmail,
  isValidRegNumber,
  isValidPhone,
  isValidTimeWindow
} from '../utils/validators';

describe('Field Validators', () => {
  describe('isValidCollegeEmail', () => {
    it('accepts valid @snsct.org and @college.edu emails', () => {
      expect(isValidCollegeEmail('shahith@snsct.org')).toBe(true);
      expect(isValidCollegeEmail('arun@snsct.org')).toBe(true);
      expect(isValidCollegeEmail('meena.iyer@snsct.org')).toBe(true);
      expect(isValidCollegeEmail('student_2026@college.edu')).toBe(true);
    });

    it('rejects invalid or non-college domains', () => {
      expect(isValidCollegeEmail('arun@gmail.com')).toBe(false);
      expect(isValidCollegeEmail('arun@othercollege.com')).toBe(false);
      expect(isValidCollegeEmail('invalid-email')).toBe(false);
      expect(isValidCollegeEmail('')).toBe(false);
      expect(isValidCollegeEmail(null)).toBe(false);
    });
  });

  describe('isValidRegNumber', () => {
    it('accepts 8 to 14 alphanumeric characters matching college formats', () => {
      expect(isValidRegNumber('713524AM120')).toBe(true); // 11 chars (e.g. AM department)
      expect(isValidRegNumber('713524CS101')).toBe(true); // 11 chars (CS department)
      expect(isValidRegNumber('21CS1001AB')).toBe(true); // 10 chars
    });

    it('rejects numbers under 8 or over 14 chars or with special characters', () => {
      expect(isValidRegNumber('713524')).toBe(false); // 6 chars (too short)
      expect(isValidRegNumber('713524AM12099999')).toBe(false); // 16 chars (too long)
      expect(isValidRegNumber('7135-24AM-120')).toBe(false); // special char
      expect(isValidRegNumber('')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('accepts valid 10 digit phones', () => {
      expect(isValidPhone('9876543210')).toBe(true);
      expect(isValidPhone('98765-43210')).toBe(true);
    });

    it('rejects invalid lengths or letters', () => {
      expect(isValidPhone('987654321')).toBe(false); // 9 digits
      expect(isValidPhone('98765432100')).toBe(false); // 11 digits
      expect(isValidPhone('abcdefghij')).toBe(false);
    });
  });

  describe('isValidTimeWindow', () => {
    it('accepts valid historical time intervals', () => {
      const now = Date.now();
      const start = new Date(now - 7200000).toISOString();
      const end = new Date(now - 3600000).toISOString();
      expect(isValidTimeWindow(start, end)).toBe(true);
    });

    it('rejects future start or end dates', () => {
      const now = Date.now();
      const start = new Date(now + 1000000).toISOString();
      const end = new Date(now + 2000000).toISOString();
      expect(isValidTimeWindow(start, end)).toBe(false);
    });

    it('rejects when end is before start', () => {
      const now = Date.now();
      const start = new Date(now - 3600000).toISOString();
      const end = new Date(now - 7200000).toISOString();
      expect(isValidTimeWindow(start, end)).toBe(false);
    });
  });
});
