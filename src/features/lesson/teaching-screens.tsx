"use client";

import { Lightbulb } from "lucide-react";
import { useState } from "react";
import { CodeBlock, OutputBlock } from "@/components/code/code-block";
import { RichText } from "@/components/ui/rich-text";
import type { ExampleStep, ExplanationStep } from "@/domain/curriculum";
import { cn } from "@/lib/cn";

export function KeyIdea({ text }: { text: string }) {
  return (
    <aside className="flex gap-3 rounded-xl border border-accent/30 bg-accent-soft px-4 py-3.5">
      <Lightbulb aria-hidden className="mt-0.5 size-5 shrink-0 text-accent" />
      <p className="text-[15px] leading-6 text-fg">
        <span className="sr-only">Idea clave: </span>
        <RichText text={text} />
      </p>
    </aside>
  );
}

export function ExplanationScreen({ step }: { step: ExplanationStep }) {
  return (
    <article className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight text-fg sm:text-[1.75rem] sm:leading-9">{step.title}</h1>
      <div className="flex flex-col gap-4 text-[17px] leading-7 text-fg-muted">
        {step.body.map((p, i) => (
          <p key={i}>
            <RichText text={p} />
          </p>
        ))}
        {step.points && (
          <ul className="flex flex-col gap-2.5">
            {step.points.map((p, i) => (
              <li key={i} className="flex gap-3">
                <span aria-hidden className="mt-3 size-1.5 shrink-0 rounded-full bg-accent" />
                <span>
                  <RichText text={p} />
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {step.code && <CodeBlock code={step.code} caption={step.codeCaption} />}
      {step.files?.map((f) => <CodeBlock key={f.name} code={f.code} caption={f.name} />)}
      {step.keyIdea && <KeyIdea text={step.keyIdea} />}
    </article>
  );
}

export function ExampleScreen({ step }: { step: ExampleStep }) {
  const [activeLine, setActiveLine] = useState<number | null>(null);
  return (
    <article className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-fg sm:text-[1.75rem] sm:leading-9">{step.title}</h1>
        <p className="mt-3 text-[17px] leading-7 text-fg-muted">
          <RichText text={step.intro} />
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start">
        <div className="flex flex-col gap-4 lg:sticky lg:top-20">
          {step.otherFiles?.map((f) => <CodeBlock key={f.name} code={f.code} caption={f.name} />)}
          <CodeBlock
            code={step.code}
            caption={step.fileName}
            activeLine={activeLine}
            annotatedLines={step.annotations.map((a) => a.line)}
          />
          <OutputBlock output={step.expectedOutput} />
        </div>

        <ol className="flex flex-col gap-1" aria-label="Explicación línea a línea">
          {step.annotations.map((a) => (
            <li key={a.line}>
              <button
                type="button"
                onMouseEnter={() => setActiveLine(a.line)}
                onMouseLeave={() => setActiveLine(null)}
                onFocus={() => setActiveLine(a.line)}
                onBlur={() => setActiveLine(null)}
                onClick={() => setActiveLine((l) => (l === a.line ? null : a.line))}
                aria-pressed={activeLine === a.line}
                className={cn(
                  "flex w-full gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                  activeLine === a.line ? "bg-surface-2" : "hover:bg-surface",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 grid h-6 min-w-6 shrink-0 place-items-center rounded-md px-1 font-mono text-xs font-semibold tabular-nums",
                    activeLine === a.line ? "bg-accent text-accent-fg" : "bg-surface-2 text-fg-muted",
                  )}
                >
                  <span className="sr-only">Línea </span>
                  {a.line}
                </span>
                <span className="text-[15px] leading-6 text-fg-muted">
                  <RichText text={a.text} />
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      {step.note && (
        <p className="text-sm text-fg-subtle">
          <RichText text={step.note} />
        </p>
      )}
    </article>
  );
}
