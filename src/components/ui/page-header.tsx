import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  aside,
}: {
  eyebrow?: ReactNode;
  title: string;
  description?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <div className="mb-2 text-sm font-medium text-fg-subtle">{eyebrow}</div>}
        <h1 className="text-2xl font-semibold tracking-tight text-fg sm:text-[2rem] sm:leading-10">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-[15px] leading-6 text-fg-muted">{description}</p>}
      </div>
      {aside && <div className="shrink-0">{aside}</div>}
    </header>
  );
}

export function SectionTitle({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-lg font-semibold tracking-tight text-fg">{children}</h2>
      {aside}
    </div>
  );
}
