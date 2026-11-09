"use client";

/**
 * In-memory student state for Phase 1.
 * Initialised from the demo dataset and lost on reload — the UI says so.
 * In Phase 2 this provider will read/write through src/services/progress
 * without changing its public API.
 */
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { DEMO_STUDENT, DEMO_TODAY, type StudentState } from "@/data/demo/student";
import { chapterLessonIds } from "@/content/php/course";
import { activityOn, computeStreak, totalXp } from "@/domain/activity";
import { unlockedAchievements } from "@/domain/achievements";
import type { ConceptId, LessonId, MisconceptionId } from "@/domain/curriculum";
import { recurringMisconceptions, type ConceptStat } from "@/domain/mistakes";
import { levelFromXp, type LevelInfo } from "@/domain/xp";

export interface LessonResult {
  lessonId: LessonId;
  passed: boolean;
  masteryScore: number;
  xpEarned: number;
  correctAnswers: number;
  mistakes: MisconceptionId[];
  conceptStats: Record<ConceptId, ConceptStat>;
}

interface Derived {
  today: string;
  totalXp: number;
  level: LevelInfo;
  streak: number;
  todayXp: number;
  achievements: Set<string>;
  recurring: ReturnType<typeof recurringMisconceptions>;
}

interface ProgressContextValue {
  state: StudentState;
  derived: Derived;
  /** Data source. "demo" until persistence exists. */
  source: "demo";
  startLesson: (lessonId: LessonId) => void;
  recordLessonResult: (result: LessonResult) => void;
  setDailyGoal: (xp: number) => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function deriveState(state: StudentState, today: string): Derived {
  const xp = totalXp(state.activity);
  const level = levelFromXp(xp);
  const streak = computeStreak(state.activity, today);
  return {
    today,
    totalXp: xp,
    level,
    streak,
    todayXp: activityOn(state.activity, today).xp,
    achievements: unlockedAchievements({
      progress: state.lessons,
      streak,
      level: level.level,
      chapterLessons: chapterLessonIds(),
    }),
    recurring: recurringMisconceptions(state.mistakes, today),
  };
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StudentState>(DEMO_STUDENT);
  const today = DEMO_TODAY;

  const startLesson = useCallback((lessonId: LessonId) => {
    setState((s) =>
      s.lessons[lessonId]
        ? s
        : { ...s, lessons: { ...s.lessons, [lessonId]: { status: "in-progress" } } },
    );
  }, []);

  const recordLessonResult = useCallback(
    (r: LessonResult) => {
      setState((s) => {
        const previous = s.lessons[r.lessonId];
        const wasCompleted = previous?.status === "completed";
        const best = Math.max(previous?.bestMasteryScore ?? 0, r.masteryScore);

        const todayActivity = activityOn(s.activity, today);
        const activity = [
          ...s.activity.filter((a) => a.day !== today),
          {
            day: today,
            xp: todayActivity.xp + r.xpEarned,
            correctAnswers: todayActivity.correctAnswers + r.correctAnswers,
          },
        ].sort((a, b) => a.day.localeCompare(b.day));

        const conceptStats = { ...s.conceptStats };
        for (const [concept, stat] of Object.entries(r.conceptStats)) {
          const prev = conceptStats[concept] ?? { correct: 0, attempts: 0 };
          conceptStats[concept] = {
            correct: prev.correct + stat.correct,
            attempts: prev.attempts + stat.attempts,
          };
        }

        return {
          ...s,
          lessons: {
            ...s.lessons,
            [r.lessonId]:
              r.passed || wasCompleted
                ? {
                    status: "completed",
                    bestMasteryScore: best,
                    completedOn: wasCompleted ? previous?.completedOn : today,
                  }
                : { status: "in-progress", bestMasteryScore: best },
          },
          activity,
          mistakes: [
            ...s.mistakes,
            ...r.mistakes.map((misconceptionId) => ({ day: today, lessonId: r.lessonId, misconceptionId })),
          ],
          conceptStats,
        };
      });
    },
    [today],
  );

  const setDailyGoal = useCallback((xp: number) => setState((s) => ({ ...s, dailyGoalXp: xp })), []);

  const value = useMemo<ProgressContextValue>(
    () => ({
      state,
      derived: deriveState(state, today),
      source: "demo",
      startLesson,
      recordLessonResult,
      setDailyGoal,
    }),
    [state, today, startLesson, recordLessonResult, setDailyGoal],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used inside <ProgressProvider>");
  return ctx;
}
