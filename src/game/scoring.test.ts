import { describe, expect, it } from 'vitest';
import { levelCompleteBonus, penaltyForWrongAnswer, scoreForCorrectAnswer } from './scoring';

describe('scoring', () => {
  it('awards larger points on higher levels', () => {
    expect(scoreForCorrectAnswer(1)).toBeLessThan(scoreForCorrectAnswer(4));
  });

  it('returns a fixed wrong-answer penalty', () => {
    expect(penaltyForWrongAnswer()).toBe(35);
  });

  it('calculates level bonus from speed and mistakes', () => {
    const result = levelCompleteBonus({ basePoints: 120, timeRemaining: 10, wrongAttempts: 2 });
    expect(result).toBe(180);
  });
});
