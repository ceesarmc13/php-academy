/**
 * Mistake history and recurring misconception detection. See LEARNING_SYSTEM.md §4.
 */
import type { LessonId, MisconceptionId } from "./curriculum";
import { addDays } from "./activity";

export interface MistakeRecord {
  day: string;
  lessonId: LessonId;
  misconceptionId: MisconceptionId;
}

export interface RecurringMisconception {
  misconceptionId: MisconceptionId;
  occurrences: number;
  distinctDays: number;
  lastSeen: string;
}

/**
 * A misconception is recurring when it appears on ≥ 2 different days,
 * or ≥ 3 times within the last 7 days.
 */
export function recurringMisconceptions(
  mistakes: MistakeRecord[],
  today: string,
): RecurringMisconception[] {
  const weekStart = addDays(today, -6);
  const groups = new Map<MisconceptionId, MistakeRecord[]>();
  for (const m of mistakes) {
    groups.set(m.misconceptionId, [...(groups.get(m.misconceptionId) ?? []), m]);
  }
  const result: RecurringMisconception[] = [];
  for (const [misconceptionId, records] of groups) {
    const days = new Set(records.map((r) => r.day));
    const lastWeek = records.filter((r) => r.day >= weekStart && r.day <= today).length;
    if (days.size >= 2 || lastWeek >= 3) {
      result.push({
        misconceptionId,
        occurrences: records.length,
        distinctDays: days.size,
        lastSeen: [...days].sort().at(-1) ?? today,
      });
    }
  }
  return result.sort((a, b) => b.occurrences - a.occurrences);
}

export interface ConceptStat {
  correct: number;
  attempts: number;
}

export type ConceptStats = Record<string, ConceptStat>;
