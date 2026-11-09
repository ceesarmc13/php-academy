"use client";

import {
  ArrowRight,
  Flame,
  Footprints,
  Layers,
  Lock,
  RotateCcw,
  Sparkles,
  Target,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { DemoNotice } from "@/components/ui/demo-notice";
import { PageHeader, SectionTitle } from "@/components/ui/page-header";
import { ProgressBar } from "@/components/ui/progress-bar";
import { RichText } from "@/components/ui/rich-text";
import { MISCONCEPTIONS } from "@/content/php/concepts";
import { PHP_COURSE } from "@/content/php/course";
import { ACHIEVEMENTS, type Achievement } from "@/domain/achievements";
import { activityOn, addDays, formatDayLong, weekdayIndex } from "@/domain/activity";
import { getNextLesson, unitCompletion } from "@/domain/progression";
import { useProgress } from "@/features/progress/progress-provider";
import { cn } from "@/lib/cn";

const ACHIEVEMENT_ICONS: Record<Achievement["icon"], LucideIcon> = {
  footprints: Footprints,
  flame: Flame,
  target: Target,
  layers: Layers,
  "trending-up": TrendingUp,
  sparkles: Sparkles,
};

function ContinueCard() {
  const { state } = useProgress();
  const next = getNextLesson(PHP_COURSE, state.lessons);
  const chapter = PHP_COURSE.units.flatMap((u) => u.chapters).find((c) => c.lessons.some((l) => l.id === next?.id));
  const inProgress = next && state.lessons[next.id]?.status === "in-progress";

  if (!next) {
    return (
      <section className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold text-fg">Has completado todo el contenido disponible</h2>
        <p className="mt-2 text-[15px] text-fg-muted">
          Las siguientes lecciones están en preparación. Mientras tanto, puedes repasar las que ya dominas.
        </p>
        <ButtonLink href="/aprender" variant="secondary" className="mt-5">
          Ver itinerario
        </ButtonLink>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="continue-title"
      className="relative overflow-hidden rounded-2xl border border-border bg-surface p-6 sm:p-7"
    >
      <p className="text-sm font-medium text-accent">{inProgress ? "Continúa donde lo dejaste" : "Siguiente lección"}</p>
      <h2 id="continue-title" className="mt-2 text-2xl font-semibold tracking-tight text-fg">
        <span className="mr-2 font-mono text-lg font-normal text-fg-subtle">{next.code}</span>
        {next.title}
      </h2>
      {chapter && (
        <p className="mt-1 text-sm text-fg-subtle">
          Capítulo {chapter.number} · {chapter.title}
        </p>
      )}
      <p className="mt-4 max-w-xl text-[15px] leading-6 text-fg-muted">
        <RichText text={next.summary} />
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <ButtonLink href={`/leccion/${next.id}`} size="lg" iconRight={<ArrowRight aria-hidden className="size-4" />}>
          {inProgress ? "Continuar lección" : "Empezar lección"}
        </ButtonLink>
        <span className="text-sm text-fg-subtle">
          Unos {next.estimatedMinutes} min · 7 fases · prueba de dominio al final
        </span>
      </div>
    </section>
  );
}

function DailyGoal() {
  const { state, derived } = useProgress();
  const goal = state.dailyGoalXp;
  const ratio = Math.min(1, derived.todayXp / goal);
  const r = 34;
  const c = 2 * Math.PI * r;
  const done = derived.todayXp >= goal;

  return (
    <section aria-labelledby="goal-title" className="flex items-center gap-5">
      <div
        role="meter"
        aria-label="Objetivo diario de experiencia"
        aria-valuemin={0}
        aria-valuemax={goal}
        aria-valuenow={Math.min(derived.todayXp, goal)}
        className="relative size-20 shrink-0"
      >
        <svg viewBox="0 0 80 80" className="size-20 -rotate-90">
          <circle cx="40" cy="40" r={r} fill="none" strokeWidth="8" className="stroke-surface-3" />
          <circle
            cx="40"
            cy="40"
            r={r}
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - ratio)}
            className="stroke-accent transition-[stroke-dashoffset] duration-700 ease-out"
          />
        </svg>
        <span className="absolute inset-0 grid place-items-center text-sm font-semibold tabular-nums text-fg">
          {Math.round(ratio * 100)}%
        </span>
      </div>
      <div>
        <h2 id="goal-title" className="text-sm font-medium text-fg-subtle">
          Objetivo de hoy
        </h2>
        <p className="mt-0.5 text-2xl font-semibold text-fg">
          {derived.todayXp} <span className="text-base font-normal text-fg-subtle">/ {goal} XP</span>
        </p>
        <p className="mt-0.5 text-sm text-fg-muted">
          {done ? "Objetivo cumplido." : `Te faltan ${goal - derived.todayXp} XP: más o menos una lección.`}
        </p>
      </div>
    </section>
  );
}

function StreakWeek() {
  const { state, derived } = useProgress();
  const today = derived.today;
  const monday = addDays(today, -weekdayIndex(today));
  const days = Array.from({ length: 7 }, (_, i) => addDays(monday, i));
  const labels = ["L", "M", "X", "J", "V", "S", "D"];

  return (
    <section aria-labelledby="streak-title">
      <div className="flex items-center gap-3">
        <Flame aria-hidden className={cn("size-7", derived.streak > 0 ? "text-warning" : "text-fg-subtle")} />
        <div>
          <h2 id="streak-title" className="text-sm font-medium text-fg-subtle">
            Racha
          </h2>
          <p className="text-2xl font-semibold text-fg">
            {derived.streak} {derived.streak === 1 ? "día" : "días"}
          </p>
        </div>
      </div>
      <ol className="mt-4 grid grid-cols-7 gap-1.5" aria-label="Actividad de esta semana">
        {days.map((day, i) => {
          const active = activityOn(state.activity, day).correctAnswers > 0;
          const future = day > today;
          const isToday = day === today;
          return (
            <li key={day} className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  "grid size-8 place-items-center rounded-full",
                  active ? "bg-warning-soft text-warning" : "bg-surface-2 text-fg-subtle",
                  isToday && "ring-2 ring-fg-subtle ring-offset-2 ring-offset-surface",
                  future && "opacity-50",
                )}
              >
                {active ? <Flame aria-hidden className="size-4" /> : <span aria-hidden className="size-1.5 rounded-full bg-current" />}
              </span>
              <span className={cn("text-xs", isToday ? "font-semibold text-fg" : "text-fg-subtle")} aria-hidden>
                {labels[i]}
              </span>
              <span className="sr-only">
                {formatDayLong(day)}: {future ? "pendiente" : active ? "con actividad" : "sin actividad"}
              </span>
            </li>
          );
        })}
      </ol>
      <p className="mt-3 text-xs leading-5 text-fg-subtle">Cuenta un día si resuelves al menos un ejercicio.</p>
    </section>
  );
}

function ModuleProgress() {
  const { state } = useProgress();
  const unit = PHP_COURSE.units[0];
  return (
    <section aria-labelledby="module-title">
      <SectionTitle
        aside={
          <Link href="/aprender" className="shrink-0 whitespace-nowrap text-sm font-medium text-accent hover:underline">
            Ver itinerario
          </Link>
        }
      >
        <span id="module-title">Módulo {unit.number} · {unit.title}</span>
      </SectionTitle>
      <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
        {unit.chapters.map((chapter) => {
          const { completed, total, ratio } = unitCompletion(chapter.lessons, state.lessons);
          return (
            <li key={chapter.id}>
              <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
                <span className="truncate text-fg">
                  <span className="text-fg-subtle">{chapter.number}.</span> {chapter.title}
                </span>
                <span className="shrink-0 tabular-nums text-fg-subtle">
                  {completed}/{total}
                </span>
              </div>
              <ProgressBar value={ratio} size="sm" label={`Capítulo ${chapter.number}: ${completed} de ${total}`} />
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function FocusConcepts() {
  const { derived } = useProgress();
  const items = derived.recurring.slice(0, 3);
  return (
    <section aria-labelledby="focus-title">
      <SectionTitle>
        <span id="focus-title">Conceptos a reforzar</span>
      </SectionTitle>
      {items.length === 0 ? (
        <p className="text-[15px] text-fg-muted">Ningún error se repite por ahora. Buen trabajo.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
          {items.map((item) => {
            const m = MISCONCEPTIONS[item.misconceptionId];
            if (!m) return null;
            return (
              <li key={item.misconceptionId} className="p-4">
                <p className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <span className="font-semibold text-fg">{m.title}</span>
                  <span className="text-sm text-fg-subtle">
                    {item.occurrences} veces · {item.distinctDays} {item.distinctDays === 1 ? "día" : "días"}
                  </span>
                </p>
                <p className="mt-1.5 text-[15px] leading-6 text-fg-muted">
                  <RichText text={m.explanation} />
                </p>
              </li>
            );
          })}
        </ul>
      )}
      <p className="mt-3 text-xs leading-5 text-fg-subtle">
        Un error cuenta como recurrente si aparece en 2 días distintos o 3 veces en una semana. Los ejercicios de repaso
        específicos llegarán con la sección Práctica.
      </p>
    </section>
  );
}

function Achievements() {
  const { derived } = useProgress();
  return (
    <section aria-labelledby="achievements-title">
      <SectionTitle
        aside={
          <span className="text-sm tabular-nums text-fg-subtle">
            {derived.achievements.size}/{ACHIEVEMENTS.length}
          </span>
        }
      >
        <span id="achievements-title">Logros</span>
      </SectionTitle>
      <ul className="grid grid-cols-2 gap-2">
        {ACHIEVEMENTS.map((a) => {
          const unlocked = derived.achievements.has(a.id);
          const Icon = ACHIEVEMENT_ICONS[a.icon];
          return (
            <li
              key={a.id}
              title={a.description}
              className={cn(
                "flex items-center gap-2.5 rounded-lg border p-2.5",
                unlocked ? "border-accent/30 bg-accent-soft" : "border-border",
              )}
            >
              <span
                className={cn(
                  "grid size-8 shrink-0 place-items-center rounded-md",
                  unlocked ? "bg-accent text-accent-fg" : "bg-surface-2 text-fg-subtle",
                )}
              >
                {unlocked ? <Icon aria-hidden className="size-4" /> : <Lock aria-hidden className="size-3.5" />}
              </span>
              <span className="min-w-0">
                <span className={cn("block text-sm leading-5 font-medium", unlocked ? "text-fg" : "text-fg-muted")}>
                  {a.title}
                </span>
                <span className="sr-only">{unlocked ? "Conseguido. " : "Pendiente. "}{a.description}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function ReviewLink() {
  const { state } = useProgress();
  const mastered = PHP_COURSE.units
    .flatMap((u) => u.chapters.flatMap((c) => c.lessons))
    .filter((l) => state.lessons[l.id]?.status === "completed");
  if (mastered.length === 0) return null;
  return (
    <section aria-labelledby="review-title">
      <SectionTitle>
        <span id="review-title">Repasar</span>
      </SectionTitle>
      <ul className="flex flex-col gap-1">
        {mastered.map((l) => (
          <li key={l.id}>
            <Link
              href={`/leccion/${l.id}`}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-surface"
            >
              <RotateCcw aria-hidden className="size-4 text-fg-subtle" />
              <span className="font-mono text-sm text-fg-subtle">{l.code}</span>
              <span className="flex-1 truncate text-[15px] text-fg">{l.title}</span>
              <span className="text-sm text-fg-subtle">
                {Math.round((state.lessons[l.id]?.bestMasteryScore ?? 0) * 100)} %
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Dashboard() {
  const { state, derived } = useProgress();
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow={<span className="inline-block first-letter:uppercase">{formatDayLong(derived.today)}</span>}
        title={`Hola, ${state.displayName}`}
        description="Esto es lo que te toca hoy."
      />
      <DemoNotice />

      <div className="grid gap-x-10 gap-y-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="flex min-w-0 flex-col gap-10">
          <ContinueCard />
          <ModuleProgress />
          <FocusConcepts />
        </div>
        <aside className="flex flex-col gap-8" aria-label="Tu actividad">
          <div className="flex flex-col gap-7 rounded-2xl border border-border bg-surface p-5">
            <DailyGoal />
            <div className="border-t border-border" />
            <StreakWeek />
          </div>
          <Achievements />
          <ReviewLink />
        </aside>
      </div>
    </div>
  );
}
