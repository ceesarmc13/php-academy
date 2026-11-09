/**
 * XP and levels. Rewards demonstrated learning, never time spent.
 * Rules documented in LEARNING_SYSTEM.md §6.
 */

export const EXERCISE_BASE_XP = 10;
export const EXERCISE_MIN_XP = 2;
export const MASTERY_BASE_XP = 20;
export const MASTERY_XP_PER_CORRECT = 5;
/** Share of XP granted when repeating an already mastered lesson. */
export const REPEAT_FACTOR = 0.25;

export interface ExerciseOutcome {
  solved: boolean;
  hintsUsed: number;
  failedAttempts: number;
}

export function exerciseXp({ solved, hintsUsed, failedAttempts }: ExerciseOutcome): number {
  if (!solved) return 0;
  if (hintsUsed === 0 && failedAttempts === 0) return EXERCISE_BASE_XP;
  return Math.max(EXERCISE_MIN_XP, EXERCISE_BASE_XP - 2 * hintsUsed - 2 * failedAttempts);
}

export function masteryXp(correctAnswers: number, passed: boolean): number {
  if (!passed) return 0;
  return MASTERY_BASE_XP + MASTERY_XP_PER_CORRECT * correctAnswers;
}

export function applyRepeatFactor(xp: number, alreadyMastered: boolean): number {
  return alreadyMastered ? Math.round(xp * REPEAT_FACTOR) : xp;
}

/** Total XP required to reach `level`: 50·n·(n−1). Level 1 starts at 0. */
export function xpForLevel(level: number): number {
  return 50 * level * (level - 1);
}

export interface LevelInfo {
  level: number;
  /** XP accumulated inside the current level. */
  xpIntoLevel: number;
  /** XP the current level spans. */
  xpLevelSpan: number;
  /** XP missing for the next level. */
  xpToNext: number;
  progress: number;
}

export function levelFromXp(totalXp: number): LevelInfo {
  let level = 1;
  while (totalXp >= xpForLevel(level + 1)) level++;
  const floor = xpForLevel(level);
  const ceil = xpForLevel(level + 1);
  const span = ceil - floor;
  return {
    level,
    xpIntoLevel: totalXp - floor,
    xpLevelSpan: span,
    xpToNext: ceil - totalXp,
    progress: (totalXp - floor) / span,
  };
}
