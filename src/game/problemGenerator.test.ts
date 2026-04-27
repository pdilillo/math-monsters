import { describe, expect, it } from 'vitest';
import { generateProblems } from './problemGenerator';

const makeRng = (sequence: number[]): (() => number) => {
  let index = 0;
  return () => {
    const value = sequence[index % sequence.length];
    index += 1;
    return value;
  };
};

describe('generateProblems', () => {
  it('creates multiplication prompts with correct answers', () => {
    const problems = generateProblems('multiplication', 4, 2, 5, makeRng([0.05, 0.2, 0.4, 0.6, 0.8, 0.1, 0.7, 0.3]));
    expect(problems).toHaveLength(4);
    problems.forEach((problem) => {
      const [a, , b] = problem.prompt.split(' ');
      expect(problem.answer).toBe(Number(a) * Number(b));
    });
  });

  it('creates division prompts with integer answers', () => {
    const problems = generateProblems('division', 3, 2, 6, makeRng([0.15, 0.4, 0.65, 0.8, 0.25, 0.55]));
    expect(problems).toHaveLength(3);
    problems.forEach((problem) => {
      const [dividend, , divisor] = problem.prompt.split(' ');
      expect(Number(dividend) / Number(divisor)).toBe(problem.answer);
    });
  });
});
