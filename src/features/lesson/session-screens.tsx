"use client";

import {
  ArrowLeft,
  BookOpen,
  CircleCheck,
  Clock,
  Lock,
  RotateCcw,
  ShieldCheck,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { RichText } from "@/components/ui/rich-text";
import { conceptName, MISCONCEPTIONS } from "@/content/php/concepts";
import { ACHIEVEMENTS } from "@/domain/achievements";
import { PHASE_LABELS, PHASE_ORDER, type Lesson, type LessonSummary } from "@/domain/curriculum";
import type { LevelInfo } from "@/domain/xp";
import { cn } from "@/lib/cn";
import type { SessionMistake, SessionSummary } from "./lesson-state";
import { KeyIdea } from "./teaching-screens";

const PHASE_DESCRIPTIONS: Record<string, string> = {
  explanation: "La idea con palabras sencillas",
  example: "Un programa explicado línea a línea",
  check: "Preguntas para ver si se ha entendido",
  guided: "Completas código con ayuda",
  practice: "Construyes un programa tú solo",
  review: "Repasamos tus errores",
  mastery: "Demuestras lo aprendido, sin pistas",
};

function ScreenTitle({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <div>
      {eyebrow && <p className="mb-2 text-sm font-medium text-fg-subtle">{eyebrow}</p>}
      <h1 className="text-2xl font-semibold tracking-tight text-fg sm:text-[1.75rem] sm:leading-9">{title}</h1>
    </div>
  );
}

export function IntroScreen({
  lesson,
  chapterTitle,
  alreadyCompleted,
}: {
  lesson: Lesson;
  chapterTitle: string;
  alreadyCompleted: boolean;
}) {
  const needed = Math.ceil(lesson.mastery.passingScore * lesson.mastery.questions.length);
  return (
    <div className="flex flex-col gap-8">
      <div>
        <ScreenTitle eyebrow={`Lección ${lesson.code} · ${chapterTitle}`} title={lesson.title} />
        <p className="mt-3 text-[17px] leading-7 text-fg-muted">{lesson.summary}</p>
        <p className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-fg-subtle">
          <span className="inline-flex items-center gap-1.5">
            <Clock aria-hidden className="size-4" /> Unos {lesson.estimatedMinutes} minutos
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck aria-hidden className="size-4" /> Prueba final: {needed} de {lesson.mastery.questions.length}{" "}
            aciertos
          </span>
        </p>
      </div>

      {alreadyCompleted && (
        <p className="rounded-xl border border-border bg-surface px-4 py-3 text-[15px] text-fg-muted">
          Ya dominas esta lección. Puedes repasarla cuando quieras; el repaso da el 25 % de la XP.
        </p>
      )}

      <section aria-labelledby="objetivos">
        <h2 id="objetivos" className="mb-3 text-sm font-semibold uppercase tracking-wide text-fg-subtle">
          Al terminar sabrás
        </h2>
        <ul className="flex flex-col gap-2.5">
          {lesson.objectives.map((o) => (
            <li key={o} className="flex gap-3 text-[15px] leading-6 text-fg">
              <CircleCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-accent" />
              <RichText text={o} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="fases">
        <h2 id="fases" className="mb-3 text-sm font-semibold uppercase tracking-wide text-fg-subtle">
          Cómo es esta lección
        </h2>
        <ol className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
          {PHASE_ORDER.map((phase, i) => (
            <li key={phase} className="flex items-start gap-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-md bg-surface-2 font-mono text-xs font-semibold text-fg-muted">
                {i + 1}
              </span>
              <span className="text-[15px] leading-6">
                <span className="font-medium text-fg">{PHASE_LABELS[phase]}</span>
                <span className="block text-sm text-fg-subtle">{PHASE_DESCRIPTIONS[phase]}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <p className="flex gap-2.5 border-t border-border pt-5 text-sm leading-6 text-fg-subtle">
        <BookOpen aria-hidden className="mt-0.5 size-4 shrink-0" />
        Explicaciones y ejercicios de PHP Academy basados en el Tema 3 de Programación (Prof. Alejandro Zazo). Los
        ejercicios de esta lección son de refuerzo: no forman parte del documento original.
      </p>
    </div>
  );
}

export function ReviewScreen({
  lesson,
  summary,
  mistakes,
}: {
  lesson: Lesson;
  summary: SessionSummary;
  mistakes: SessionMistake[];
}) {
  const grouped = new Map<string, number>();
  const looseConcepts = new Set<string>();
  for (const m of mistakes) {
    if (m.misconceptionId) grouped.set(m.misconceptionId, (grouped.get(m.misconceptionId) ?? 0) + 1);
    else m.concepts.forEach((c) => looseConcepts.add(c));
  }
  const stats = [
    { label: "Ejercicios resueltos", value: `${summary.solved} de ${summary.exercises}` },
    { label: "A la primera", value: `${summary.firstTry}` },
    { label: "Pistas usadas", value: `${summary.hintsUsed}` },
  ];

  return (
    <div className="flex flex-col gap-8">
      <ScreenTitle eyebrow="Fase 6 · Corrección" title="Repasemos lo que has hecho" />

      <dl className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-surface px-4 py-3">
            <dt className="text-xs font-medium text-fg-subtle sm:text-sm">{s.label}</dt>
            <dd className="mt-1 text-xl font-semibold text-fg">{s.value}</dd>
          </div>
        ))}
      </dl>

      {grouped.size > 0 || looseConcepts.size > 0 ? (
        <section aria-labelledby="errores">
          <h2 id="errores" className="mb-3 text-lg font-semibold text-fg">
            Tus errores, explicados
          </h2>
          <ul className="flex flex-col gap-3">
            {[...grouped.entries()].map(([id, count]) => {
              const m = MISCONCEPTIONS[id];
              if (!m) return null;
              return (
                <li key={id} className="rounded-xl border border-border bg-surface p-4">
                  <p className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-semibold text-fg">{m.title}</span>
                    <span className="text-sm text-fg-subtle">{count === 1 ? "1 vez" : `${count} veces`}</span>
                  </p>
                  <p className="mt-2 text-[15px] leading-6 text-fg-muted">
                    <RichText text={m.explanation} />
                  </p>
                </li>
              );
            })}
          </ul>
          {looseConcepts.size > 0 && (
            <p className="mt-3 text-[15px] text-fg-muted">
              También has fallado algún intento sobre:{" "}
              {[...looseConcepts].map(conceptName).join(", ").toLowerCase()}.
            </p>
          )}
          {summary.skipped > 0 && (
            <p className="mt-3 text-[15px] text-fg-muted">
              Has dejado {summary.skipped === 1 ? "un ejercicio" : `${summary.skipped} ejercicios`} sin resolver. Sus
              conceptos quedan marcados para reforzar.
            </p>
          )}
        </section>
      ) : (
        <p className="flex items-center gap-3 rounded-xl border border-accent/30 bg-accent-soft px-4 py-3.5 text-[15px] text-fg">
          <CircleCheck aria-hidden className="size-5 shrink-0 text-accent" />
          No has cometido ningún error en los ejercicios de esta lección.
        </p>
      )}

      <section aria-labelledby="ideas">
        <h2 id="ideas" className="mb-3 text-lg font-semibold text-fg">
          Ideas clave
        </h2>
        <div className="flex flex-col gap-2.5">
          {lesson.keyIdeas.map((idea) => (
            <KeyIdea key={idea} text={idea} />
          ))}
        </div>
      </section>
    </div>
  );
}

export function MasteryIntroScreen({ lesson, attempt }: { lesson: Lesson; attempt: number }) {
  const total = lesson.mastery.questions.length;
  const needed = Math.ceil(lesson.mastery.passingScore * total);
  return (
    <div className="flex flex-col items-start gap-6">
      <span className="grid size-14 place-items-center rounded-2xl bg-accent-soft text-accent">
        <Target aria-hidden className="size-7" />
      </span>
      <ScreenTitle
        eyebrow={attempt > 1 ? `Fase 7 · Intento ${attempt}` : "Fase 7"}
        title="Prueba de dominio"
      />
      <ul className="flex flex-col gap-3 text-[17px] leading-7 text-fg-muted">
        <li>
          <strong className="font-semibold text-fg">{total} preguntas</strong> sobre lo que acabas de aprender.
        </li>
        <li>
          Sin pistas y con una sola respuesta por pregunta.
        </li>
        <li>
          Necesitas <strong className="font-semibold text-fg">{needed} aciertos</strong> para completar la lección y
          desbloquear la siguiente.
        </li>
        <li>Si no la superas, verás qué repasar y podrás repetirla.</li>
      </ul>
    </div>
  );
}

export interface CommitResult {
  correct: number;
  total: number;
  passed: boolean;
  exerciseXp: number;
  masteryXp: number;
  alreadyMastered: boolean;
  achievementsBefore: Set<string>;
  levelBefore: number;
}

export function ResultScreen({
  result,
  level,
  achievements,
  masteryMistakes,
  nextLesson,
}: {
  result: CommitResult;
  level: LevelInfo;
  achievements: Set<string>;
  masteryMistakes: SessionMistake[];
  nextLesson: LessonSummary | null;
}) {
  const totalXp = result.exerciseXp + result.masteryXp;
  const newAchievements = ACHIEVEMENTS.filter((a) => achievements.has(a.id) && !result.achievementsBefore.has(a.id));
  const leveledUp = level.level > result.levelBefore;
  const failedConcepts = [...new Set(masteryMistakes.flatMap((m) => m.concepts))];
  const failedMisconceptions = [
    ...new Set(masteryMistakes.map((m) => m.misconceptionId).filter((id): id is string => !!id)),
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-start gap-5">
        <span
          className={cn(
            "grid size-16 animate-pop place-items-center rounded-2xl",
            result.passed ? "bg-accent text-accent-fg" : "bg-warning-soft text-warning",
          )}
        >
          {result.passed ? <Trophy aria-hidden className="size-8" /> : <RotateCcw aria-hidden className="size-8" />}
        </span>
        <ScreenTitle
          title={result.passed ? "¡Lección superada!" : "Casi: todavía no la has superado"}
          eyebrow={`Prueba de dominio: ${result.correct} de ${result.total} aciertos`}
        />
        <p className="text-[17px] leading-7 text-fg-muted">
          {!result.passed
            ? "Repasa los conceptos de abajo y vuelve a intentarlo. La siguiente lección se desbloquea al superar la prueba."
            : `Has demostrado que dominas los conceptos de esta lección.${
                !nextLesson
                  ? ""
                  : nextLesson.contentStatus === "ready"
                    ? ` Ya puedes empezar la lección ${nextLesson.code}.`
                    : ` La siguiente lección (${nextLesson.code} ${nextLesson.title}) todavía está en preparación.`
              }`}
        </p>
      </div>

      {!result.passed && (failedMisconceptions.length > 0 || failedConcepts.length > 0) && (
        <section aria-labelledby="repasar" className="flex flex-col gap-3">
          <h2 id="repasar" className="text-lg font-semibold text-fg">
            Qué repasar
          </h2>
          {failedMisconceptions.map((id) => {
            const m = MISCONCEPTIONS[id];
            return m ? (
              <div key={id} className="rounded-xl border border-border bg-surface p-4">
                <p className="font-semibold text-fg">{m.title}</p>
                <p className="mt-2 text-[15px] leading-6 text-fg-muted">
                  <RichText text={m.explanation} />
                </p>
              </div>
            ) : null;
          })}
          {failedMisconceptions.length === 0 && (
            <p className="text-[15px] text-fg-muted">
              Conceptos con fallos: {failedConcepts.map(conceptName).join(", ").toLowerCase()}.
            </p>
          )}
        </section>
      )}

      <section aria-labelledby="xp" className="rounded-xl border border-border bg-surface p-5">
        <h2 id="xp" className="flex items-center gap-2 text-sm font-semibold text-fg">
          <Zap aria-hidden className="size-4 text-accent" /> Experiencia ganada
        </h2>
        <dl className="mt-3 flex flex-col gap-1.5 text-[15px]">
          <div className="flex justify-between text-fg-muted">
            <dt>Ejercicios</dt>
            <dd className="tabular-nums">+{result.exerciseXp} XP</dd>
          </div>
          <div className="flex justify-between text-fg-muted">
            <dt>Prueba de dominio</dt>
            <dd className="tabular-nums">+{result.masteryXp} XP</dd>
          </div>
          <div className="mt-1 flex justify-between border-t border-border pt-2 font-semibold text-fg">
            <dt>Total</dt>
            <dd className="tabular-nums">+{totalXp} XP</dd>
          </div>
        </dl>
        {result.alreadyMastered && (
          <p className="mt-2 text-sm text-fg-subtle">Repaso de una lección ya dominada: 25 % de la XP.</p>
        )}
        <div className="mt-5">
          <div className="mb-2 flex justify-between text-sm">
            <span className="font-medium text-fg">
              Nivel {level.level}
              {leveledUp && <span className="ml-2 text-accent">¡Has subido de nivel!</span>}
            </span>
            <span className="text-fg-subtle">{level.xpToNext} XP para el nivel {level.level + 1}</span>
          </div>
          <ProgressBar value={level.progress} label={`Progreso hacia el nivel ${level.level + 1}`} />
        </div>
      </section>

      {newAchievements.length > 0 && (
        <section aria-labelledby="logros-nuevos">
          <h2 id="logros-nuevos" className="mb-3 text-lg font-semibold text-fg">
            Logros desbloqueados
          </h2>
          <ul className="flex flex-col gap-2">
            {newAchievements.map((a) => (
              <li key={a.id} className="flex animate-rise items-center gap-3 rounded-xl border border-accent/30 bg-accent-soft p-3">
                <Trophy aria-hidden className="size-5 shrink-0 text-accent" />
                <span>
                  <span className="block font-semibold text-fg">{a.title}</span>
                  <span className="block text-sm text-fg-muted">{a.description}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export function LockedScreen({ missing }: { missing: LessonSummary[] }) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col items-start justify-center gap-6 px-6 py-16">
      <span className="grid size-14 place-items-center rounded-2xl bg-surface-2 text-fg-muted">
        <Lock aria-hidden className="size-7" />
      </span>
      <ScreenTitle title="Esta lección todavía está bloqueada" />
      <p className="text-[17px] leading-7 text-fg-muted">
        Usa conceptos que se aprenden antes. Supera la prueba de dominio de estas lecciones para desbloquearla:
      </p>
      <ul className="flex w-full flex-col gap-2">
        {missing.map((l) => (
          <li key={l.id} className="rounded-xl border border-border bg-surface px-4 py-3">
            <span className="font-mono text-sm text-fg-subtle">{l.code}</span>{" "}
            <span className="font-medium text-fg">{l.title}</span>
          </li>
        ))}
      </ul>
      <ButtonLink href="/aprender" variant="secondary" icon={<ArrowLeft aria-hidden className="size-4" />}>
        Volver al itinerario
      </ButtonLink>
    </div>
  );
}
