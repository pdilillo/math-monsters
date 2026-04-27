import type { ScoreEvent } from './types';

export const scoreForCorrectAnswer = (level: number): number => 100 + level * 20;

export const penaltyForWrongAnswer = (): number => 35;

export const levelCompleteBonus = ({ basePoints, timeRemaining, wrongAttempts }: ScoreEvent): number =>
  basePoints + Math.max(0, Math.floor(timeRemaining) * 8) - wrongAttempts * 10;
