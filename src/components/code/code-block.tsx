import { FileCode, Terminal } from "lucide-react";
import { cn } from "@/lib/cn";
import { tokenizeLines, type Token } from "./highlight-php";

export function CodeTokens({ tokens }: { tokens: Token[] }) {
  return (
    <>
      {tokens.map((t, i) =>
        t.type === "plain" ? (
          <span key={i}>{t.text}</span>
        ) : (
          <span key={i} className={`tok-${t.type}`}>
            {t.text}
          </span>
        ),
      )}
    </>
  );
}

/** Inline highlighted fragment (no block, no line numbers). */
export function InlineCode({ code, className }: { code: string; className?: string }) {
  const lines = tokenizeLines(code);
  return (
    <span className={cn("font-mono whitespace-pre", className)}>
      {lines.map((tokens, i) => (
        <span key={i} className="block">
          <CodeTokens tokens={tokens} />
          {tokens.length === 0 && " "}
        </span>
      ))}
    </span>
  );
}

export function CodeBlock({
  code,
  caption,
  activeLine,
  annotatedLines,
  lineNumbers = true,
  className,
}: {
  code: string;
  caption?: string;
  /** 1-based line to emphasise. */
  activeLine?: number | null;
  /** 1-based lines that have an explanation. */
  annotatedLines?: number[];
  lineNumbers?: boolean;
  className?: string;
}) {
  const lines = tokenizeLines(code);
  return (
    <figure className={cn("overflow-hidden rounded-xl border border-border bg-code-bg", className)}>
      {caption && (
        <figcaption className="flex items-center gap-2 border-b border-border px-4 py-2.5 text-xs font-medium text-fg-subtle">
          <FileCode aria-hidden className="size-3.5" />
          {caption}
        </figcaption>
      )}
      <div className="overflow-x-auto">
        <pre className="min-w-max py-3 font-mono text-[13.5px] leading-6 sm:text-sm">
          <code>
            {lines.map((tokens, index) => {
              const n = index + 1;
              const active = activeLine === n;
              const annotated = annotatedLines?.includes(n);
              return (
                <span
                  key={n}
                  data-line={n}
                  className={cn(
                    "flex border-l-2 pr-6 transition-colors duration-150",
                    active ? "border-accent bg-accent-soft" : "border-transparent",
                  )}
                >
                  {lineNumbers && (
                    <span
                      aria-hidden
                      className={cn(
                        "w-10 shrink-0 select-none pr-3 text-right tabular-nums",
                        active ? "text-accent" : annotated ? "text-fg-muted" : "text-fg-subtle/70",
                      )}
                    >
                      {n}
                    </span>
                  )}
                  <span className={cn("whitespace-pre", !lineNumbers && "pl-4")}>
                    <CodeTokens tokens={tokens} />
                    {tokens.length === 0 && " "}
                  </span>
                </span>
              );
            })}
          </code>
        </pre>
      </div>
    </figure>
  );
}

/** Program output. Always labelled as expected output: nothing is executed in Phase 1. */
export function OutputBlock({ output, label = "Salida esperada" }: { output: string; label?: string }) {
  return (
    <figure className="overflow-hidden rounded-xl border border-border bg-bg">
      <figcaption className="flex items-center gap-2 border-b border-border px-4 py-2.5 text-xs font-medium text-fg-subtle">
        <Terminal aria-hidden className="size-3.5" />
        {label}
      </figcaption>
      <pre className="overflow-x-auto px-4 py-3 font-mono text-[13.5px] leading-6 text-fg sm:text-sm">{output}</pre>
    </figure>
  );
}
