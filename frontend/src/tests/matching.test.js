import { describe, it, expect } from 'vitest';
import {
  calculateJaccardSimilarity,
  calculateLocationScore,
  calculateTimeScore,
  calculateColorScore,
  calculateImageSimilarity,
  scoreMatchPair
} from '../api/matching';

describe('Matching Scoring Engine', () => {
  describe('calculateLocationScore', () => {
    it('gives 1.0 for exact same location', () => {
      expect(calculateLocationScore('Library', 'Library')).toBe(1.0);
    });

    it('gives 0.6 for adjacent campus places', () => {
      expect(calculateLocationScore('Library', 'Block A')).toBe(0.6);
      expect(calculateLocationScore('Block A', 'Block B')).toBe(0.6);
      expect(calculateLocationScore('Canteen', 'Auditorium')).toBe(0.6);
    });

    it('gives 0.0 for non-adjacent distant places', () => {
      expect(calculateLocationScore('Library', 'Sports Ground')).toBe(0);
      expect(calculateLocationScore('Parking', 'Labs')).toBe(0);
    });
  });

  describe('calculateColorScore', () => {
    it('returns 1.0 for exact color matches', () => {
      expect(calculateColorScore('Black', 'Black')).toBe(1.0);
    });

    it('returns matching score for color variants', () => {
      expect(calculateColorScore('Navy / Dark Blue', 'Dark Blue')).toBeGreaterThanOrEqual(0.7);
    });
  });

  describe('calculateTimeScore', () => {
    it('returns 1.0 if found within or right at end time window', () => {
      const start = '2026-09-24T08:00:00.000Z';
      const end = '2026-09-24T09:00:00.000Z';
      const found = '2026-09-24T08:30:00.000Z';
      expect(calculateTimeScore(start, end, found)).toBe(1.0);
    });

    it('decays linearly over 48 hours after end window', () => {
      const start = '2026-09-24T08:00:00.000Z';
      const end = '2026-09-24T09:00:00.000Z';
      // 24 hours after end
      const found24h = new Date(new Date(end).getTime() + 24 * 60 * 60 * 1000).toISOString();
      const score = calculateTimeScore(start, end, found24h);
      expect(score).toBeCloseTo(0.5, 1);
    });

    it('returns 0 if found more than 48 hours after window', () => {
      const start = '2026-09-24T08:00:00.000Z';
      const end = '2026-09-24T09:00:00.000Z';
      const found50h = new Date(new Date(end).getTime() + 50 * 60 * 60 * 1000).toISOString();
      expect(calculateTimeScore(start, end, found50h)).toBe(0);
    });

    it('returns 0 if found before start time', () => {
      const start = '2026-09-24T08:00:00.000Z';
      const end = '2026-09-24T09:00:00.000Z';
      const foundBefore = '2026-09-24T07:00:00.000Z';
      expect(calculateTimeScore(start, end, foundBefore)).toBe(0);
    });
  });

  describe('scoreMatchPair with Synonyms and Thresholds', () => {
    it('matches "navy backpack" with "dark blue bag" and creates match >= 0.60', () => {
      const lostPost = {
        category: 'bag',
        itemName: 'Navy Backpack',
        description: 'navy backpack bag',
        color: 'Navy / Dark Blue',
        location: 'Block A',
        timeStart: '2026-09-24T07:00:00.000Z',
        timeEnd: '2026-09-24T08:30:00.000Z'
      };

      const foundPost = {
        category: 'bag',
        itemName: 'Dark Blue Bag',
        description: 'dark blue bag',
        color: 'Navy / Dark Blue',
        location: 'Block A',
        timeFound: '2026-09-24T08:00:00.000Z'
      };

      const match = scoreMatchPair(lostPost, foundPost);
      expect(match).not.toBeNull();
      expect(match.score).toBeGreaterThanOrEqual(0.80);
      expect(match.band).toBe('High');
    });

    it('creates Medium band when score is between 0.60 and 0.79', () => {
      const lostPost = {
        category: 'bottle',
        itemName: 'Samsung Bottle',
        description: 'black bottle lost in hallway',
        color: 'Black',
        location: 'Block A',
        timeStart: '2026-09-24T07:00:00.000Z',
        timeEnd: '2026-09-24T08:00:00.000Z'
      };

      const foundPost = {
        category: 'bottle',
        itemName: 'Android Flask',
        description: 'black bottle with case',
        color: 'Black',
        location: 'Block B', // adjacent (0.6 * 0.25 = 0.15)
        timeFound: '2026-09-24T08:00:00.000Z'
      };

      const match = scoreMatchPair(lostPost, foundPost);
      expect(match).not.toBeNull();
      expect(match.score).toBeGreaterThanOrEqual(0.60);
      expect(match.band).toBeDefined();
    });

    it('rejects pairs with completely different categories', () => {
      const lostPost = {
        category: 'phone',
        itemName: 'iPhone',
        color: 'Black',
        location: 'Library',
        timeStart: '2026-09-24T08:00:00.000Z',
        timeEnd: '2026-09-24T09:00:00.000Z'
      };

      const foundPost = {
        category: 'bottle',
        itemName: 'Water Flask',
        color: 'Black',
        location: 'Library',
        timeFound: '2026-09-24T08:30:00.000Z'
      };

      const match = scoreMatchPair(lostPost, foundPost);
      expect(match).toBeNull();
    });
  });

  describe('Optional Image Similarity Bonus', () => {
    it('returns null if either photo is missing', () => {
      expect(calculateImageSimilarity(null, 'data:image/png;base64,123')).toBeNull();
      expect(calculateImageSimilarity('data:image/png;base64,123', undefined)).toBeNull();
    });

    it('returns 1.0 for identical photo sources', () => {
      const photo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      expect(calculateImageSimilarity(photo, photo)).toBe(1.0);
    });

    it('awards an image bonus when matching photo is provided', () => {
      const lostPost = {
        category: 'earphones',
        itemName: 'Earbuds Case',
        description: 'black earbuds',
        color: 'Black',
        location: 'Library',
        timeStart: '2026-09-24T08:00:00.000Z',
        timeEnd: '2026-09-24T09:00:00.000Z',
        photo: 'https://campus.edu/photos/earbuds_case.jpg'
      };

      const foundPost = {
        category: 'earphones',
        itemName: 'Earbuds Case',
        description: 'black earbuds',
        color: 'Black',
        location: 'Library',
        timeFound: '2026-09-24T08:30:00.000Z',
        photo: 'https://campus.edu/photos/earbuds_case.jpg'
      };

      const matchWithImage = scoreMatchPair(lostPost, foundPost);
      expect(matchWithImage).not.toBeNull();
      expect(matchWithImage.imageBonus).toBeGreaterThan(0);
      expect(matchWithImage.whyMatched).toContain('visual photo similarity');
    });
  });
});
