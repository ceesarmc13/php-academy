import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLesson, LESSONS, PHP_COURSE } from "@/content/php/course";
import { getFollowingLesson } from "@/domain/progression";
import { LessonPlayer } from "@/features/lesson/lesson-player";

/** Only lessons with finished content get a route. */
export function generateStaticParams() {
  return Object.keys(LESSONS).map((lessonId) => ({ lessonId }));
}

export async function generateMetadata({ params }: PageProps<"/leccion/[lessonId]">): Promise<Metadata> {
  const { lessonId } = await params;
  const lesson = getLesson(lessonId);
  return { title: lesson ? `${lesson.code} ${lesson.title}` : "Lección no encontrada" };
}

export default async function LessonPage({ params }: PageProps<"/leccion/[lessonId]">) {
  const { lessonId } = await params;
  const lesson = getLesson(lessonId);
  if (!lesson) notFound();

  const chapter = PHP_COURSE.units
    .flatMap((u) => u.chapters)
    .find((c) => c.lessons.some((l) => l.id === lesson.id));

  return (
    <LessonPlayer
      lesson={lesson}
      chapterTitle={chapter ? `Capítulo ${chapter.number} · ${chapter.title}` : ""}
      nextLesson={getFollowingLesson(PHP_COURSE, lesson.id) ?? null}
    />
  );
}
