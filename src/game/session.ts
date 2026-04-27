import type { GameMode, LevelConfig, MathProblem } from './types';

export interface GameSession {
  mode: GameMode;
  levelIndex: number;
  score: number;
  levelConfig: LevelConfig;
  problems: MathProblem[];
  targetAnswers: number[];
  startTimeMs: number;
  wrongAttempts: number;
}
