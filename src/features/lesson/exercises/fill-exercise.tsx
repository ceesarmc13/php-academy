"use client";

import { Fragment } from "react";
import { CodeTokens } from "@/components/code/code-block";
import { tokenizeLines } from "@/components/code/highlight-php";
import type { Evaluation, FillAnswer } from "@/domain/answers";
import type { FillExercise as FillExerciseType } from "@/domain/curriculum";
import { cn } from "@/lib/cn";

const BLANK = /\[\[(\w+)\]\]/;

export function FillExercise({
  exercise,
  answer,
  onChange,
  evaluation,
  locked,
}: {
  exercise: FillExerciseType;
  answer: FillAnswer;
  onChange: (answer: FillAnswer) => void;
  evaluation: Evaluation | null;
  locked: boolean;
}) {
  const blanks = new Map(exercise.blanks.map((b, i) => [b.id, { ...b, index: i }]));
  const lines = exercise.template.split("\n");

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-code-bg">
      <div className="overflow-x-auto">
        <div className="min-w-max py-3 font-mono text-[13.5px] leading-6 sm:text-sm">
          {lines.map((line, lineIndex) => {
            const parts = line.split(BLANK);
            return (
              <div key={lineIndex} className="flex min-h-9 items-center pr-6">
                <span aria-hidden className="w-10 shrink-0 select-none pr-3 text-right tabular-nums text-fg-subtle/70">
                  {lineIndex + 1}
                </span>
                <span className="flex items-center whitespace-pre">
                  {parts.map((part, i) => {
                    // Odd indexes are blank ids captured by the split.
                    if (i % 2 === 1) {
                      const blank = blanks.get(part);
                      if (!blank) return null;
                      const state = evaluation?.blankResults?.[blank.id];
                      const width = Math.max(4, ...blank.accept.map((a) => a.length)) + 2;
                      return (
                        <input
                          key={i}
                          type="text"
                          value={answer.values[blank.id] ?? ""}
                          onChange={(e) =>
                            onChange({ kind: "fill", values: { ...answer.values, [blank.id]: e.target.value } })
                          }
                          disabled={locked}
                          aria-label={blank.label}
                          aria-invalid={state === false || undefined}
                          autoComplete="off"
                          autoCapitalize="off"
                          autoCorrect="off"
                          spellCheck={false}
                          placeholder={`${blank.index + 1}`}
                          style={{ width: `${width}ch` }}
                          className={cn(
                            "mx-0.5 h-8 rounded-md border-2 bg-surface px-1.5 text-center font-mono text-fg outline-none transition-colors placeholder:text-fg-subtle/60",
                            "focus:border-accent",
                            state === true && "border-accent bg-accent-soft",
                            state === false && "border-danger bg-danger-soft",
                            state === undefined && "border-dashed border-border-strong",
                          )}
                        />
                      );
                    }
                    const tokens = tokenizeLines(part)[0] ?? [];
                    return (
                      <Fragment key={i}>
                        <CodeTokens tokens={tokens} />
                      </Fragment>
                    );
                  })}
                  {line === "" && " "}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
