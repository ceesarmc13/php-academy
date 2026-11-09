"use client";

import { Lightbulb } from "lucide-react";
import { RichText } from "@/components/ui/rich-text";

const LEVELS = ["Pista 1 · la idea", "Pista 2 · dónde mirar", "Pista 3 · casi la respuesta"];

/** Graduated hints, revealed one at a time. There is no "show solution". */
export function Hints({
  hints,
  used,
  onReveal,
  disabled,
}: {
  hints: string[];
  used: number;
  onReveal: () => void;
  disabled: boolean;
}) {
  if (hints.length === 0) return null;
  const remaining = hints.length - used;
  return (
    <div className="flex flex-col gap-3">
      {used > 0 && (
        <ol className="flex flex-col gap-2" aria-live="polite">
          {hints.slice(0, used).map((hint, i) => (
            <li key={i} className="animate-rise rounded-xl border border-warning/25 bg-warning-soft px-4 py-3">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-warning">
                {LEVELS[i] ?? `Pista ${i + 1}`}
              </p>
              <p className="text-[15px] leading-6 text-fg">
                <RichText text={hint} />
              </p>
            </li>
          ))}
        </ol>
      )}
      {remaining > 0 && !disabled && (
        <button
          type="button"
          onClick={onReveal}
          className="inline-flex h-9 items-center gap-2 self-start rounded-lg px-3 text-sm font-medium text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
        >
          <Lightbulb aria-hidden className="size-4 text-warning" />
          {used === 0 ? "Pedir una pista" : "Pedir otra pista"}
          <span className="text-fg-subtle">
            ({used + 1} de {hints.length} · −2 XP)
          </span>
        </button>
      )}
    </div>
  );
}
