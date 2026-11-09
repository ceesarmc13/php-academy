/**
 * DEMO DATA — fictional student used while authentication and persistence
 * are not implemented (Phase 2). Everything here must be presented in the UI
 * with a visible "datos de demostración" notice.
 *
 * The dataset is internally consistent with the rules in src/domain:
 * total XP = sum of daily XP, streak computed from activity, etc.
 */
import type { DailyActivity } from "@/domain/activity";
import type { ConceptStats, MistakeRecord } from "@/domain/mistakes";
import type { ProgressMap } from "@/domain/progression";

/** Fixed "today" for the demo so that renders are deterministic. */
export const DEMO_TODAY = "2026-11-09";

export interface StudentState {
  displayName: string;
  dailyGoalXp: number;
  lessons: ProgressMap;
  activity: DailyActivity[];
  mistakes: MistakeRecord[];
  conceptStats: ConceptStats;
}

export const DEMO_STUDENT: StudentState = {
  displayName: "Estudiante demo",
  dailyGoalXp: 30,
  lessons: {
    "t3-que-es-una-funcion": { status: "completed", bestMasteryScore: 0.75, completedOn: "2026-11-07" },
    "t3-beneficios-modularizar": { status: "in-progress" },
  },
  activity: [
    { day: "2026-11-01", xp: 14, correctAnswers: 3 },
    { day: "2026-11-03", xp: 16, correctAnswers: 4 },
    { day: "2026-11-06", xp: 20, correctAnswers: 5 },
    { day: "2026-11-07", xp: 18, correctAnswers: 5 },
    { day: "2026-11-08", xp: 12, correctAnswers: 3 },
    { day: "2026-11-09", xp: 12, correctAnswers: 3 },
  ],
  mistakes: [
    { day: "2026-11-01", lessonId: "t3-que-es-una-funcion", misconceptionId: "call-without-parentheses" },
    { day: "2026-11-03", lessonId: "t3-que-es-una-funcion", misconceptionId: "define-runs-function" },
    { day: "2026-11-03", lessonId: "t3-que-es-una-funcion", misconceptionId: "call-without-parentheses" },
    { day: "2026-11-07", lessonId: "t3-que-es-una-funcion", misconceptionId: "call-without-parentheses" },
    { day: "2026-11-09", lessonId: "t3-beneficios-modularizar", misconceptionId: "refactor-change-everywhere" },
  ],
  conceptStats: {
    "function-concept": { correct: 4, attempts: 4 },
    "function-definition": { correct: 9, attempts: 11 },
    "function-call": { correct: 7, attempts: 10 },
    "execution-flow": { correct: 2, attempts: 3 },
    modularity: { correct: 2, attempts: 3 },
    reuse: { correct: 1, attempts: 1 },
  },
};
