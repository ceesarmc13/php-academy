import { cn } from "@/lib/cn";

export function ProgressBar({
  value,
  label,
  size = "md",
  tone = "accent",
  className,
}: {
  /** 0–1 */
  value: number;
  /** Accessible name. */
  label: string;
  size?: "sm" | "md" | "lg";
  tone?: "accent" | "warning";
  className?: string;
}) {
  const clamped = Math.min(1, Math.max(0, value));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped * 100)}
      className={cn(
        "w-full overflow-hidden rounded-full bg-surface-3",
        size === "sm" && "h-1.5",
        size === "md" && "h-2",
        size === "lg" && "h-3",
        className,
      )}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-500 ease-out",
          tone === "accent" ? "bg-accent" : "bg-warning",
        )}
        style={{ width: `${clamped * 100}%` }}
      />
    </div>
  );
}
