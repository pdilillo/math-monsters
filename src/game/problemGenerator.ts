import type { GameMode, MathProblem } from './types';

const randomInt = (min: number, max: number, rng: () => number): number =>
  Math.floor(rng() * (max - min + 1)) + min;

export const generateProblems = (
  mode: GameMode,
  count: number,
  minFactor: number,
  maxFactor: number,
  rng: () => number = Math.random,
): MathProblem[] => {
  const seen = new Set<string>();
  const problems: MathProblem[] = [];

  while (problems.length < count) {
    const a = randomInt(minFactor, maxFactor, rng);
    const b = randomInt(minFactor, maxFactor, rng);
    const key = `${mode}-${a}-${b}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);

    if (mode === 'multiplication') {
      problems.push({ prompt: `${a} x ${b}`, answer: a * b });
      continue;
    }

    const dividend = a * b;
    problems.push({ prompt: `${dividend} / ${a}`, answer: b });
  }

  return problems;
};
