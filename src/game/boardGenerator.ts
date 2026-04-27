const randomInt = (min: number, max: number, rng: () => number): number =>
  Math.floor(rng() * (max - min + 1)) + min;

const shuffle = <T>(items: T[], rng: () => number): T[] => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export const buildBoardAnswers = (
  targetAnswers: number[],
  totalTiles: number,
  minValue: number,
  maxValue: number,
  rng: () => number = Math.random,
): number[] => {
  const targetSet = new Set(targetAnswers);
  const values = [...targetAnswers];

  while (values.length < totalTiles) {
    const value = randomInt(minValue, maxValue, rng);
    if (targetSet.has(value)) {
      continue;
    }
    values.push(value);
  }

  return shuffle(values, rng);
};
