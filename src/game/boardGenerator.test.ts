import { describe, expect, it } from 'vitest';
import { buildBoardAnswers } from './boardGenerator';

describe('buildBoardAnswers', () => {
  it('keeps all target answers on board', () => {
    const board = buildBoardAnswers([12, 18, 20], 12, 1, 30, () => 0.5);
    expect(board).toHaveLength(12);
    expect(board).toEqual(expect.arrayContaining([12, 18, 20]));
  });

  it('does not add duplicate target values as distractors', () => {
    const board = buildBoardAnswers([8, 9], 8, 1, 10, () => 0.25);
    expect(board.filter((value) => value === 8)).toHaveLength(1);
    expect(board.filter((value) => value === 9)).toHaveLength(1);
  });
});
