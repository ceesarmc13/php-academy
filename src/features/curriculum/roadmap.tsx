"use client";

import { ArrowRight, BookCheck, Check, CircleDashed, Clock, FileClock, Lock, Play, RotateCcw } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { DemoNotice } from "@/components/ui/demo-notice";
import { PageHeader } from "@/components/ui/page-header";
import { ProgressBar } from "@/components/ui/progress-bar";
import { RichText } from "@/components/ui/rich-text";
import type { Chapter, Course, LessonSummary, Unit } from "@/domain/curriculum";
import {
  allLessons,
  findLessonSummary,
  getLessonStatus,
  unitCompletion,
  type LessonStatus,
  type ProgressMap,
} from "@/domain/progression";
import { useProgress } from "@/features/progress/progress-provider";
import { cn } from "@/lib/cn";

const STATUS_LABEL: Record<LessonStatus, string> = {
  completed: "Dominada",
  "in-progress": "En curso",
  available: "Disponible",
  locked: "Bloqueada",
  "in-preparation": "En preparación",
};

function StatusNode({ status }: { status: LessonStatus }) {
  const base = "relative z-10 grid size-10 shrink-0 place-items-center rounded-full border-2";
  switch (status) {
    case "completed":
      return (
        <span className={cn(base, "border-accent bg-accent text-accent-fg")}>
          <Check aria-hidden className="size-5" strokeWidth={3} />
        </span>
      );
    case "in-progress":
      return (
        <span className={cn(base, "border-accent bg-bg text-accent ring-4 ring-accent-soft")}>
          <Play aria-hidden className="size-4 translate-x-px fill-current" />
        </span>
      );
    case "available":
      return (
        <span className={cn(base, "border-accent bg-bg text-accent")}>
          <Play aria-hidden className="size-4 translate-x-px" />
        </span>
      );
    case "in-preparation":
      return (
        <span className={cn(base, "border-dashed border-border-strong bg-bg text-fg-subtle")}>
          <CircleDashed aria-hidden className="size-4" />
        </span>
      );
    default:
      return (
        <span className={cn(base, "border-border bg-surface-2 text-fg-subtle")}>
          <Lock aria-hidden className="size-4" />
        </span>
      );
  }
}

function LessonRow({
  lesson,
  course,
  progress,
  isLast,
}: {
  lesson: LessonSummary;
  course: Course;
  progress: ProgressMap;
  isLast: boolean;
}) {
  const { status, missingPrerequisites } = getLessonStatus(lesson, progress);
  const openable = status === "available" || status === "in-progress" || status === "completed";
  const score = progress[lesson.id]?.bestMasteryScore;
  const missing = missingPrerequisites
    .map((id) => findLessonSummary(course, id)?.code)
    .filter(Boolean)
    .join(", ");

  const action =
    status === "completed" ? (
      <>
        <RotateCcw aria-hidden className="size-4" /> Repasar
      </>
    ) : status === "in-progress" ? (
      <>
        Continuar <ArrowRight aria-hidden className="size-4" />
      </>
    ) : (
      <>
        Empezar <ArrowRight aria-hidden className="size-4" />
      </>
    );

  const body = (
    <>
      <StatusNode status={status} />
      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-mono text-sm text-fg-subtle">{lesson.code}</span>
          <h3 className={cn("text-base font-semibold", openable ? "text-fg" : "text-fg-muted")}>{lesson.title}</h3>
        </div>
        <p className={cn("mt-1 text-[15px] leading-6", openable ? "text-fg-muted" : "text-fg-subtle")}>
          <RichText text={lesson.summary} />
        </p>
        <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-fg-subtle">
          <span className={cn("font-medium", status === "completed" || status === "in-progress" ? "text-accent" : "")}>
            {STATUS_LABEL[status]}
            {status === "completed" && score !== undefined && ` · ${Math.round(score * 100)} % en la prueba`}
          </span>
          {status === "locked" && missing && <span>Requiere superar {missing}</span>}
          {status === "in-preparation" && <span>Contenido en redacción</span>}
          {openable && (
            <span className="inline-flex items-center gap-1">
              <Clock aria-hidden className="size-3.5" /> {lesson.estimatedMinutes} min
            </span>
          )}
        </p>
      </div>
      {openable && (
        <span className="hidden shrink-0 items-center gap-1.5 self-center rounded-lg px-3 py-2 text-sm font-semibold text-accent transition-colors group-hover:bg-accent-soft sm:inline-flex">
          {action}
        </span>
      )}
    </>
  );

  return (
    <li className="relative">
      {!isLast && (
        <span
          aria-hidden
          className={cn(
            "absolute top-12 bottom-[-0.5rem] left-[1.875rem] w-0.5 sm:left-[2.125rem]",
            status === "completed" ? "bg-accent" : "bg-border",
          )}
        />
      )}
      {openable ? (
        <Link
          href={`/leccion/${lesson.id}`}
          className="group flex items-start gap-4 rounded-xl p-2.5 transition-colors hover:bg-surface sm:p-3.5"
        >
          {body}
        </Link>
      ) : (
        <div className="flex items-start gap-4 p-2.5 sm:p-3.5" aria-disabled="true">
          {body}
        </div>
      )}
    </li>
  );
}

function ChapterSection({ chapter, course, progress }: { chapter: Chapter; course: Course; progress: ProgressMap }) {
  const { completed, total } = unitCompletion(chapter.lessons, progress);
  return (
    <section aria-labelledby={`chapter-${chapter.id}`}>
      <div className="mb-2 flex items-baseline justify-between gap-3 px-2.5 sm:px-3.5">
        <h2 id={`chapter-${chapter.id}`} className="text-sm font-semibold uppercase tracking-wide text-fg-subtle">
          Capítulo {chapter.number} · <span className="normal-case tracking-normal text-fg">{chapter.title}</span>
        </h2>
        <span className="shrink-0 text-sm tabular-nums text-fg-subtle">
          {completed}/{total}
        </span>
      </div>
      <ol className="flex flex-col gap-1">
        {chapter.lessons.map((lesson, i) => (
          <LessonRow
            key={lesson.id}
            lesson={lesson}
            course={course}
            progress={progress}
            isLast={i === chapter.lessons.length - 1}
          />
        ))}
      </ol>
    </section>
  );
}

function OfficialExercises({ unit }: { unit: Unit }) {
  const nextChapter = unit.chapters.length + 1;
  return (
    <section aria-labelledby="oficiales" className="flex flex-col gap-3">
      <div className="px-2.5 sm:px-3.5">
        <h2 id="oficiales" className="text-sm font-semibold uppercase tracking-wide text-fg-subtle">
          Capítulo {nextChapter} ·{" "}
          <span className="normal-case tracking-normal text-fg">Ejercicios oficiales del Tema 3</span>
        </h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {unit.officialExercises.map((set) => (
          <div key={set.id} className="rounded-xl border border-dashed border-border-strong p-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold text-fg">{set.title}</h3>
              <Badge tone="warning" icon={<FileClock aria-hidden className="size-3.5" />}>
                Pendiente
              </Badge>
            </div>
            <p className="mt-1.5 text-[15px] leading-6 text-fg-muted">{set.description}</p>
            <p className="mt-3 text-sm text-fg-subtle">
              {set.exercises.length} de {set.expectedCount} importados
            </p>
          </div>
        ))}
      </div>
      <p className="px-2.5 text-sm leading-6 text-fg-subtle sm:px-3.5">
        Se importarán literalmente (enunciados, nombres de funciones y requisitos) cuando el documento original esté
        disponible en la plataforma. Su corrección necesita el motor de ejecución de PHP.
      </p>
    </section>
  );
}

export function Roadmap({ course }: { course: Course }) {
  const { state } = useProgress();
  const progress = state.lessons;
  const lessons = allLessons(course);
  const ready = lessons.filter((l) => l.contentStatus === "ready").length;

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        eyebrow={<DemoNotice compact />}
        title={course.title}
        description={course.description}
      />

      {course.units.map((unit) => {
        const unitLessons = unit.chapters.flatMap((c) => c.lessons);
        const completion = unitCompletion(unitLessons, progress);
        return (
          <article key={unit.id} aria-labelledby={`unit-${unit.id}`} className="flex flex-col gap-8">
            <header className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-fg-subtle">Módulo {unit.number}</p>
                  <h2 id={`unit-${unit.id}`} className="mt-1 text-xl font-semibold tracking-tight text-fg sm:text-2xl">
                    {unit.title}
                  </h2>
                  <p className="mt-2 max-w-2xl text-[15px] leading-6 text-fg-muted">{unit.description}</p>
                </div>
                <div className="w-full shrink-0 md:w-56">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium text-fg">
                      {completion.completed} de {completion.total} lecciones
                    </span>
                    <span className="tabular-nums text-fg-subtle">{Math.round(completion.ratio * 100)} %</span>
                  </div>
                  <ProgressBar value={completion.ratio} label={`Progreso del módulo ${unit.title}`} />
                </div>
              </div>

              {unit.source && (
                <p className="mt-5 flex gap-2.5 border-t border-border pt-4 text-sm leading-6 text-fg-muted">
                  <BookCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
                  <span>
                    Estructura basada en el <strong className="font-semibold text-fg">{unit.source.topic}</strong> ·{" "}
                    {unit.source.subject} · Prof. {unit.source.teacher} · {unit.source.program} · {unit.source.center}
                  </span>
                </p>
              )}
              {unit.externalPrerequisites.length > 0 && (
                <p className="mt-2 text-sm leading-6 text-fg-subtle">
                  Este módulo da por sabido:{" "}
                  {unit.externalPrerequisites.map((p, i) => (
                    <span key={p}>
                      <RichText text={p} />
                      {i < unit.externalPrerequisites.length - 1 ? ", " : ". "}
                    </span>
                  ))}
                  (Estimación de PHP Academy; la prueba diagnóstica llegará más adelante.)
                </p>
              )}
            </header>

            <p className="-mt-3 px-1 text-sm text-fg-subtle">
              {ready} de {lessons.length} lecciones tienen ya su contenido. Cada lección se desbloquea al superar la
              prueba de dominio de la anterior.
            </p>

            {unit.chapters.map((chapter) => (
              <ChapterSection key={chapter.id} chapter={chapter} course={course} progress={progress} />
            ))}

            <OfficialExercises unit={unit} />
          </article>
        );
      })}
    </div>
  );
}
