import type { LevelConfig } from './types';

export const LEVELS: LevelConfig[] = [
  { level: 1, rows: 4, cols: 5, timeLimitSeconds: 70, problemCount: 4, minFactor: 1, maxFactor: 5 },
  { level: 2, rows: 5, cols: 5, timeLimitSeconds: 75, problemCount: 5, minFactor: 2, maxFactor: 8 },
  { level: 3, rows: 5, cols: 6, timeLimitSeconds: 80, problemCount: 6, minFactor: 3, maxFactor: 10 },
  { level: 4, rows: 6, cols: 6, timeLimitSeconds: 85, problemCount: 7, minFactor: 4, maxFactor: 12 },
];
