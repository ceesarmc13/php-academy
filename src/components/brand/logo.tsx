import { cn } from "@/lib/cn";

/**
 * PHP Academy mark: the PHP opening tag "<?" drawn as strokes on the progress green.
 * The tag is the first thing every PHP program writes — the first step of the course.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn("size-8 shrink-0", className)}>
      <rect width="32" height="32" rx="9" className="fill-accent" />
      <g
        fill="none"
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-accent-fg"
      >
        <path d="M13 10.5 7.5 16l5.5 5.5" />
        <path d="M17.5 11.75a3.6 3.6 0 1 1 5 3.3c-1.1.45-1.75 1.3-1.75 2.45v.5" />
      </g>
      <circle cx="20.75" cy="22.6" r="1.6" className="fill-accent-fg" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="text-[17px] font-semibold tracking-tight text-fg">
        PHP <span className="font-normal text-fg-muted">Academy</span>
      </span>
    </span>
  );
}
