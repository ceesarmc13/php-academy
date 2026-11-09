/**
 * Daily activity, streaks and calendar helpers.
 * Dates are ISO calendar days ("2026-11-09") handled in UTC to stay deterministic.
 */

export interface DailyActivity {
  /** ISO day, YYYY-MM-DD. */
  day: string;
  xp: number;
  /** Exercises solved correctly that day. A day only counts for the streak if > 0. */
  correctAnswers: number;
}

const DAY_MS = 86_400_000;

export function parseDay(day: string): Date {
  return new Date(`${day}T00:00:00Z`);
}

export function formatDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addDays(day: string, amount: number): string {
  return formatDay(new Date(parseDay(day).getTime() + amount * DAY_MS));
}

/** 0 = Monday … 6 = Sunday. */
export function weekdayIndex(day: string): number {
  return (parseDay(day).getUTCDay() + 6) % 7;
}

function isActive(activity: DailyActivity | undefined): boolean {
  return !!activity && activity.correctAnswers > 0;
}

/**
 * Consecutive active days ending today. If today has no activity yet,
 * the streak is still alive when yesterday was active.
 */
export function computeStreak(activity: DailyActivity[], today: string): number {
  const byDay = new Map(activity.map((a) => [a.day, a]));
  let cursor = isActive(byDay.get(today)) ? today : addDays(today, -1);
  let streak = 0;
  while (isActive(byDay.get(cursor))) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export function totalXp(activity: DailyActivity[]): number {
  return activity.reduce((sum, a) => sum + a.xp, 0);
}

export function activityOn(activity: DailyActivity[], day: string): DailyActivity {
  return activity.find((a) => a.day === day) ?? { day, xp: 0, correctAnswers: 0 };
}

/** Monday-aligned weeks covering the last `weeks` weeks up to `today`. */
export function calendarWeeks(today: string, weeks: number): string[][] {
  const lastMonday = addDays(today, -weekdayIndex(today));
  const firstMonday = addDays(lastMonday, -7 * (weeks - 1));
  return Array.from({ length: weeks }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => addDays(firstMonday, w * 7 + d)),
  );
}

/** Weekly XP totals for the last `weeks` weeks (Monday-aligned). */
export function weeklyXp(activity: DailyActivity[], today: string, weeks: number) {
  return calendarWeeks(today, weeks).map((days) => ({
    weekStart: days[0],
    xp: days.reduce((sum, d) => sum + activityOn(activity, d).xp, 0),
  }));
}

/** Map XP to a 0–4 intensity step for the activity heatmap. */
export function intensity(xp: number): 0 | 1 | 2 | 3 | 4 {
  if (xp <= 0) return 0;
  if (xp < 10) return 1;
  if (xp < 20) return 2;
  if (xp < 30) return 3;
  return 4;
}

const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sept", "oct", "nov", "dic"];
const WEEKDAYS = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];

export function formatDayLong(day: string): string {
  const d = parseDay(day);
  return `${WEEKDAYS[weekdayIndex(day)]} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}

export function formatDayShort(day: string): string {
  const d = parseDay(day);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}
