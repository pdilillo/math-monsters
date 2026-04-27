export type GameMode = 'multiplication' | 'division';

export interface MathProblem {
  prompt: string;
  answer: number;
}

export interface LevelConfig {
  level: number;
  rows: number;
  cols: number;
  timeLimitSeconds: number;
  problemCount: number;
  minFactor: number;
  maxFactor: number;
}

export interface ScoreEvent {
  basePoints: number;
  timeRemaining: number;
  wrongAttempts: number;
}
