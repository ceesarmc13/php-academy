"use client";

import { Plus, RotateCcw, X } from "lucide-react";
import { useMemo } from "react";
import { InlineCode, OutputBlock } from "@/components/code/code-block";
import type { Evaluation, OrderAnswer } from "@/domain/answers";
import type { OrderExercise as OrderExerciseType, OrderLine } from "@/domain/curriculum";
import { cn } from "@/lib/cn";

/** Deterministic shuffle so server and client render the same bank, never in solution order. */
function shuffledLines(exercise: OrderExerciseType): OrderLine[] {
  const hash = (s: string) => [...s].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) | 0, 7);
  const sorted = [...exercise.lines].sort((a, b) => hash(exercise.id + a.id) - hash(exercise.id + b.id));
  const sameAsSolution = sorted.every((l, i) => l.id === exercise.lines[i].id);
  return sameAsSolution ? sorted.reverse() : sorted;
}

export function OrderExercise({
  exercise,
  answer,
  onChange,
  evaluation,
  locked,
}: {
  exercise: OrderExerciseType;
  answer: OrderAnswer;
  onChange: (answer: OrderAnswer) => void;
  evaluation: Evaluation | null;
  locked: boolean;
}) {
  const bank = useMemo(() => shuffledLines(exercise), [exercise]);
  const byId = new Map(exercise.lines.map((l) => [l.id, l]));
  const chosen = answer.lineIds.map((id) => byId.get(id)!).filter(Boolean);
  const available = bank.filter((l) => !answer.lineIds.includes(l.id));
  const needed = exercise.solution.length;
  const full = chosen.length >= needed;

  const add = (id: string) => !full && onChange({ kind: "order", lineIds: [...answer.lineIds, id] });
  const remove = (id: string) => onChange({ kind: "order", lineIds: answer.lineIds.filter((l) => l !== id) });

  return (
    <div className="flex flex-col gap-5">
      {exercise.expectedOutput && <OutputBlock output={exercise.expectedOutput} />}

      <section aria-labelledby={`${exercise.id}-program`}>
        <div className="mb-2 flex items-center justify-between gap-3">
          <h3 id={`${exercise.id}-program`} className="text-sm font-semibold text-fg">
            Tu programa{" "}
            <span className="font-normal text-fg-subtle">
              · {chosen.length} de {needed} líneas
            </span>
          </h3>
          {chosen.length > 0 && !locked && (
            <button
              type="button"
              onClick={() => onChange({ kind: "order", lineIds: [] })}
              className="inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-sm font-medium text-fg-muted hover:bg-surface-2 hover:text-fg"
            >
              <RotateCcw aria-hidden className="size-3.5" /> Vaciar
            </button>
          )}
        </div>
        <ol className="min-h-24 overflow-hidden rounded-xl border border-border bg-code-bg py-2">
          {chosen.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-fg-subtle">
              Toca las líneas de abajo en el orden en que deben ejecutarse.
            </li>
          )}
          {chosen.map((line, i) => {
            const wrong = evaluation && !evaluation.correct && evaluation.firstWrongIndex === i;
            const right = evaluation?.correct;
            return (
              <li key={line.id}>
                <button
                  type="button"
                  disabled={locked}
                  onClick={() => remove(line.id)}
                  aria-label={`Quitar la línea ${i + 1}: ${line.text.trim()}`}
                  className={cn(
                    "group flex w-full items-center border-l-2 py-1 pr-3 text-left transition-colors",
                    wrong ? "border-danger bg-danger-soft" : right ? "border-accent" : "border-transparent hover:bg-surface-2",
                  )}
                >
                  <span aria-hidden className="w-10 shrink-0 pr-3 text-right font-mono text-[13px] tabular-nums text-fg-subtle/70">
                    {i + 1}
                  </span>
                  <InlineCode code={line.text} className="flex-1 text-[13.5px] sm:text-sm" />
                  {!locked && (
                    <X aria-hidden className="size-4 shrink-0 text-fg-subtle opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
                  )}
                </button>
              </li>
            );
          })}
        </ol>
      </section>

      {!locked && (
        <section aria-labelledby={`${exercise.id}-bank`}>
          <h3 id={`${exercise.id}-bank`} className="mb-2 text-sm font-semibold text-fg">
            Líneas disponibles
          </h3>
          <ul className="flex flex-col gap-2">
            {available.map((line) => (
              <li key={line.id}>
                <button
                  type="button"
                  onClick={() => add(line.id)}
                  disabled={full}
                  aria-label={`Añadir línea: ${line.text.trim()}`}
                  className="flex min-h-11 w-full items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2 text-left transition-colors hover:border-border-strong hover:bg-surface-2 disabled:opacity-50"
                >
                  <Plus aria-hidden className="size-4 shrink-0 text-fg-subtle" />
                  <InlineCode code={line.text} className="text-[13.5px] [overflow-wrap:anywhere] sm:text-sm" />
                </button>
              </li>
            ))}
          </ul>
          {full && available.length > 0 && (
            <p className="mt-2 text-sm text-fg-subtle">
              Tu programa ya tiene {needed} líneas. Quita alguna si quieres cambiarla.
            </p>
          )}
        </section>
      )}
    </div>
  );
}
