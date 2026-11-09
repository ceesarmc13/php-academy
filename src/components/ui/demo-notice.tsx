import { FlaskConical } from "lucide-react";
import { cn } from "@/lib/cn";

/** Mandatory marker for any fictional data shown in the UI. */
export function DemoNotice({ compact = false, className }: { compact?: boolean; className?: string }) {
  if (compact) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full bg-info-soft px-2.5 py-0.5 text-xs font-semibold text-info",
          className,
        )}
      >
        <FlaskConical aria-hidden className="size-3.5" />
        Datos de demostración
      </span>
    );
  }
  return (
    <div
      role="note"
      className={cn(
        "flex items-start gap-3 rounded-xl border border-info/25 bg-info-soft px-4 py-3 text-sm text-fg-muted",
        className,
      )}
    >
      <FlaskConical aria-hidden className="mt-0.5 size-4 shrink-0 text-info" />
      <p>
        <strong className="font-semibold text-fg">Modo demostración.</strong> El progreso, la XP y la racha
        parten de un estudiante ficticio. Lo que hagas se guarda solo mientras no recargues la página: las
        cuentas y el guardado llegarán en la fase 2.
      </p>
    </div>
  );
}
