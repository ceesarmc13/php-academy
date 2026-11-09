/**
 * Lesson unlocking and status. A lesson is available only when all its
 * prerequisite lessons have a passed mastery test. See LEARNING_SYSTEM.md §3.
 */
import type { Course, LessonId, LessonSummary } from "./curriculum";

export interface LessonProgress {
  status: "in-progress" | "completed";
  /** Best mastery score (0–1). Undefined until the mastery test is attempted. */
  bestMasteryScore?: number;
  completedOn?: string;
}

export type ProgressMap = Record<LessonId, LessonProgress>;

export type LessonStatus =
  | "completed"
  | "in-progress"
  | "available"
  | "locked"
  | "in-preparation";

export interface LessonStatusInfo {
  status: LessonStatus;
  missingPrerequisites: LessonId[];
}

export function isMastered(progress: ProgressMap, lessonId: LessonId): boolean {
  return progress[lessonId]?.status === "completed";
}

export function getLessonStatus(lesson: LessonSummary, progress: ProgressMap): LessonStatusInfo {
  const missingPrerequisites = lesson.prerequisites.filter((id) => !isMastered(progress, id));
  const own = progress[lesson.id]?.status;

  if (own === "completed") return { status: "completed", missingPrerequisites };
  if (missingPrerequisites.length > 0) return { status: "locked", missingPrerequisites };
  if (lesson.contentStatus !== "ready") return { status: "in-preparation", missingPrerequisites };
  if (own === "in-progress") return { status: "in-progress", missingPrerequisites };
  return { status: "available", missingPrerequisites };
}

export function allLessons(course: Course): LessonSummary[] {
  return course.units.flatMap((u) => u.chapters.flatMap((c) => c.lessons));
}

export function findLessonSummary(course: Course, id: LessonId): LessonSummary | undefined {
  return allLessons(course).find((l) => l.id === id);
}

/** First lesson in course order the student can work on right now. */
export function getNextLesson(course: Course, progress: ProgressMap): LessonSummary | undefined {
  const lessons = allLessons(course);
  return (
    lessons.find((l) => getLessonStatus(l, progress).status === "in-progress") ??
    lessons.find((l) => getLessonStatus(l, progress).status === "available")
  );
}

/** The lesson that follows `id` in course order, if any. */
export function getFollowingLesson(course: Course, id: LessonId): LessonSummary | undefined {
  const lessons = allLessons(course);
  const index = lessons.findIndex((l) => l.id === id);
  return index >= 0 ? lessons[index + 1] : undefined;
}

export function unitCompletion(lessons: LessonSummary[], progress: ProgressMap) {
  const completed = lessons.filter((l) => isMastered(progress, l.id)).length;
  return { completed, total: lessons.length, ratio: lessons.length ? completed / lessons.length : 0 };
}
