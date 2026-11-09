"use client";

import { Check, X } from "lucide-react";
import { CodeBlock, InlineCode } from "@/components/code/code-block";
import { RichText } from "@/components/ui/rich-text";
import type { ChoiceAnswer, Evaluation } from "@/domain/answers";
import type { ChoiceExercise as ChoiceExerciseType } from "@/domain/curriculum";
import { cn } from "@/lib/cn";

export function ChoiceExercise({
  exercise,
  answer,
  onChange,
  evaluation,
  locked,
  revealCorrect,
}: {
  exercise: ChoiceExerciseType;
  answer: ChoiceAnswer;
  onChange: (answer: ChoiceAnswer) => void;
  evaluation: Evaluation | null;
  locked: boolean;
  /** After a final answer (mastery), show which option was right. */
  revealCorrect: boolean;
}) {
  const name = `choice-${exercise.id}`;
  return (
    <div className="flex flex-col gap-5">
      {exercise.code && <CodeBlock code={exercise.code} />}
      <fieldset>
        <legend className="sr-only">
          <RichText text={exercise.prompt} />
        </legend>
        <div className="flex flex-col gap-2.5">
          {exercise.options.map((option, i) => {
            const selected = answer.optionId === option.id;
            const showCorrect = (selected && evaluation?.correct) || (revealCorrect && option.correct);
            const showWrong = selected && evaluation && !evaluation.correct;
            return (
              <label
                key={option.id}
                className={cn(
                  "group relative flex min-h-14 cursor-pointer items-center gap-3.5 rounded-xl border-2 bg-surface px-4 py-3 transition-[border-color,background-color] duration-150",
                  "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent",
                  showCorrect
                    ? "border-accent bg-accent-soft"
                    : showWrong
                      ? "border-danger bg-danger-soft"
                      : selected
                        ? "border-fg-muted bg-surface-2"
                        : "border-border hover:border-border-strong hover:bg-surface-2",
                  locked && "cursor-default",
                )}
              >
                <input
                  type="radio"
                  name={name}
                  value={option.id}
                  checked={selected}
                  disabled={locked}
                  onChange={() => onChange({ kind: "choice", optionId: option.id })}
                  className="sr-only"
                />
                <span
                  aria-hidden
                  className={cn(
                    "grid size-7 shrink-0 place-items-center rounded-lg border text-xs font-semibold",
                    showCorrect
                      ? "border-accent bg-accent text-accent-fg"
                      : showWrong
                        ? "border-danger bg-danger text-bg"
                        : selected
                          ? "border-fg-muted text-fg"
                          : "border-border-strong text-fg-subtle",
                  )}
                >
                  {showCorrect ? (
                    <Check className="size-4" strokeWidth={3} />
                  ) : showWrong ? (
                    <X className="size-4" strokeWidth={3} />
                  ) : (
                    String.fromCharCode(65 + i)
                  )}
                </span>
                <span className="min-w-0 flex-1 text-[15px] leading-6 text-fg">
                  {option.isCode ? (
                    <InlineCode code={option.label} className="text-[13.5px] [overflow-wrap:anywhere] sm:text-sm" />
                  ) : (
                    <RichText text={option.label} />
                  )}
                </span>
                {showCorrect && <span className="sr-only">(correcta)</span>}
                {showWrong && <span className="sr-only">(incorrecta)</span>}
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
