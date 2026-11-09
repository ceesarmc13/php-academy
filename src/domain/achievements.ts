/**
 * Achievements are derived from learning state, never stored as free-floating flags.
 * Each one rewards demonstrated learning or consistency, never time in the app.
 */
import type { LessonId } from "./curriculum";
import type { ProgressMap } from "./progression";

export interface AchievementContext {
  progress: ProgressMap;
  streak: number;
  level: number;
  /** Lesson ids of chapters, used for chapter achievements. */
  chapterLessons: Record<string, LessonId[]>;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: "footprints" | "flame" | "target" | "layers" | "trending-up" | "sparkles";
  isUnlocked: (ctx: AchievementContext) => boolean;
}

const completedCount = (p: ProgressMap) =>
  Object.values(p).filter((l) => l.status === "completed").length;

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-lesson",
    title: "Primer paso",
    description: "Supera la prueba de dominio de tu primera lección.",
    icon: "footprints",
    isUnlocked: ({ progress }) => completedCount(progress) >= 1,
  },
  {
    id: "streak-3",
    title: "Constancia",
    description: "Resuelve ejercicios 3 días seguidos.",
    icon: "flame",
    isUnlocked: ({ streak }) => streak >= 3,
  },
  {
    id: "flawless",
    title: "Dominio total",
    description: "Acierta todas las preguntas de una prueba de dominio.",
    icon: "target",
    isUnlocked: ({ progress }) => Object.values(progress).some((l) => l.bestMasteryScore === 1),
  },
  {
    id: "chapter-functions-concept",
    title: "Piensa en funciones",
    description: "Completa el capítulo «El concepto de función».",
    icon: "layers",
    isUnlocked: ({ progress, chapterLessons }) =>
      (chapterLessons["t3-c1"] ?? []).every((id) => progress[id]?.status === "completed"),
  },
  {
    id: "level-2",
    title: "Nivel 2",
    description: "Alcanza el nivel 2 acumulando experiencia.",
    icon: "trending-up",
    isUnlocked: ({ level }) => level >= 2,
  },
  {
    id: "streak-7",
    title: "Una semana entera",
    description: "Resuelve ejercicios 7 días seguidos.",
    icon: "sparkles",
    isUnlocked: ({ streak }) => streak >= 7,
  },
];

export function unlockedAchievements(ctx: AchievementContext): Set<string> {
  return new Set(ACHIEVEMENTS.filter((a) => a.isUnlocked(ctx)).map((a) => a.id));
}
