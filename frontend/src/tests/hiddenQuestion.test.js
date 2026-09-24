import { describe, it, expect, beforeEach } from 'vitest';
import * as mockStore from '../api/mockStore';
import seedData from '../data/seedData.json';

describe('Hidden Question & Anti-Fraud Security Flow', () => {
  beforeEach(() => {
    // Reset mock store with seed data
    mockStore.initializeMockStore(true);
  });

  it('verifies correct answer, keeps contact absent before verification, and unlocks contact after', () => {
    const meenaId = 'std_1';
    const matchId = 'match_demo_1';

    // 1. Query match detail prior to verification - verify contact is NOT in payload
    const detail = mockStore.getMatchDetail(matchId, meenaId);
    expect(detail.finderName).toBeUndefined();
    expect(detail.finderPhone).toBeUndefined();
    expect(detail.finderEmail).toBeUndefined();
    expect(detail.status).toBe('pending');
    expect(detail.attemptsLeft).toBe(3);

    // 2. Attempting to getContact prior to verification throws error
    expect(() => mockStore.getVerifiedContact(matchId, meenaId)).toThrow();

    // 3. Submit correct answer: "Green frog sticker"
    const result = mockStore.submitHiddenQuestionAnswer(matchId, 'Green frog sticker', meenaId);
    expect(result.verified).toBe(true);
    expect(result.success).toBe(true);

    // 4. Contact is now unlocked and accessible
    const contact = mockStore.getVerifiedContact(matchId, meenaId);
    expect(contact.finderName).toBe('Arun Kumar');
    expect(contact.finderPhone).toBe('9876543211');
    expect(contact.finderEmail).toBe('arun@college.edu');
    expect(contact.currentLocation).toBe('With me');
  });

  it('decrements attempts on wrong answers and locks for 24 hours on 3rd wrong answer', () => {
    const meenaId = 'std_1';
    const matchId = 'match_demo_1';

    // 1st wrong attempt
    const res1 = mockStore.submitHiddenQuestionAnswer(matchId, 'Yellow smiley', meenaId);
    expect(res1.verified).toBe(false);
    expect(res1.attemptsLeft).toBe(2);
    expect(res1.lockoutUntil).toBeNull();

    // 2nd wrong attempt
    const res2 = mockStore.submitHiddenQuestionAnswer(matchId, 'Blue wave', meenaId);
    expect(res2.verified).toBe(false);
    expect(res2.attemptsLeft).toBe(1);
    expect(res2.lockoutUntil).toBeNull();

    // 3rd wrong attempt -> Lockout for 24 hours
    const res3 = mockStore.submitHiddenQuestionAnswer(matchId, 'Red heart', meenaId);
    expect(res3.verified).toBe(false);
    expect(res3.attemptsLeft).toBe(0);
    expect(res3.lockoutUntil).not.toBeNull();

    // Subsequent attempt throws lockout error
    expect(() => mockStore.submitHiddenQuestionAnswer(matchId, 'Green frog sticker', meenaId)).toThrow(
      /temporarily locked/
    );
  });
});
