"use client";

import { Ellipsis, Flame, X, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { Logo } from "@/components/brand/logo";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useProgress } from "@/features/progress/progress-provider";
import { cn } from "@/lib/cn";
import { isActive, NAV_ITEMS } from "./nav-items";
import { ThemeSelector, ThemeToggle } from "./theme";

function StreakChip({ className }: { className?: string }) {
  const { derived } = useProgress();
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 text-sm font-semibold tabular-nums", className)}
      title={`Racha de ${derived.streak} días (datos de demostración)`}
    >
      <Flame aria-hidden className={cn("size-[18px]", derived.streak > 0 ? "text-warning" : "text-fg-subtle")} />
      <span className="sr-only">Racha:</span>
      {derived.streak}
      <span className="sr-only">días</span>
    </span>
  );
}

function LevelChip({ className }: { className?: string }) {
  const { derived } = useProgress();
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 text-sm font-semibold tabular-nums", className)}
      title={`${derived.totalXp} XP en total (datos de demostración)`}
    >
      <Zap aria-hidden className="size-[18px] text-accent" />
      <span className="sr-only">Nivel</span>
      Nv. {derived.level.level}
    </span>
  );
}

/** Desktop sidebar (≥ 1024 px). */
export function Sidebar() {
  const pathname = usePathname();
  const { derived } = useProgress();
  const { level } = derived;

  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-border bg-surface/40 px-3 py-5 lg:flex">
      <Link href="/" className="mb-8 rounded-lg px-3 py-1" aria-label="PHP Academy, ir a Inicio">
        <Logo />
      </Link>

      <nav aria-label="Principal" className="flex-1">
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group flex h-11 items-center gap-3 rounded-lg px-3 text-[15px] font-medium transition-colors",
                    active ? "bg-accent-soft text-accent" : "text-fg-muted hover:bg-surface-2 hover:text-fg",
                  )}
                >
                  <Icon aria-hidden className="size-5 shrink-0" strokeWidth={active ? 2.25 : 1.9} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-6 rounded-xl border border-border bg-surface p-4">
        <div className="mb-3 flex items-center justify-between">
          <LevelChip />
          <StreakChip />
        </div>
        <ProgressBar value={level.progress} size="sm" label={`Progreso hacia el nivel ${level.level + 1}`} />
        <p className="mt-2 text-xs text-fg-subtle">
          {level.xpToNext} XP para el nivel {level.level + 1}
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between px-1">
        <span className="text-xs font-medium text-fg-subtle">Fase 1 · demo</span>
        <ThemeToggle />
      </div>
    </aside>
  );
}

/** Mobile top bar (< 1024 px). */
export function MobileTopBar() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-bg/90 px-4 backdrop-blur-md lg:hidden">
      <Link href="/" aria-label="PHP Academy, ir a Inicio" className="rounded-lg">
        <Logo />
      </Link>
      <div className="flex items-center gap-4">
        <StreakChip />
        <LevelChip />
      </div>
    </header>
  );
}

/** Mobile bottom tab bar with a "Más" sheet for secondary sections. */
export function MobileTabBar() {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const primary = NAV_ITEMS.filter((i) => i.primaryMobile);
  const secondary = NAV_ITEMS.filter((i) => !i.primaryMobile);
  const moreActive = secondary.some((i) => isActive(pathname, i.href));

  const close = () => dialogRef.current?.close();

  return (
    <>
      <nav
        aria-label="Principal"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
      >
        <ul className="mx-auto grid max-w-lg grid-cols-5">
          {primary.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors",
                    active ? "text-accent" : "text-fg-subtle hover:text-fg",
                  )}
                >
                  <Icon aria-hidden className="size-[22px]" strokeWidth={active ? 2.25 : 1.9} />
                  {label}
                </Link>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={() => dialogRef.current?.showModal()}
              aria-haspopup="dialog"
              className={cn(
                "flex h-16 w-full flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors",
                moreActive ? "text-accent" : "text-fg-subtle hover:text-fg",
              )}
            >
              <Ellipsis aria-hidden className="size-[22px]" />
              Más
            </button>
          </li>
        </ul>
      </nav>

      <dialog
        ref={dialogRef}
        aria-labelledby="more-sheet-title"
        onClick={(e) => e.target === dialogRef.current && close()}
        className="m-0 mt-auto w-full max-w-none rounded-t-2xl border border-border bg-surface p-0 text-fg backdrop:bg-black/50 open:animate-rise lg:hidden"
      >
        <div className="px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <div className="mb-3 flex items-center justify-between">
            <h2 id="more-sheet-title" className="text-base font-semibold">
              Más secciones
            </h2>
            <button
              type="button"
              onClick={close}
              aria-label="Cerrar"
              className="grid size-10 place-items-center rounded-lg text-fg-muted hover:bg-surface-2"
            >
              <X aria-hidden className="size-5" />
            </button>
          </div>
          <ul className="flex flex-col gap-1">
            {secondary.map(({ href, label, description, icon: Icon }) => {
              const active = isActive(pathname, href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-3 transition-colors",
                      active ? "bg-accent-soft" : "hover:bg-surface-2",
                    )}
                  >
                    <Icon aria-hidden className={cn("size-5", active ? "text-accent" : "text-fg-muted")} />
                    <span>
                      <span className="block text-[15px] font-medium">{label}</span>
                      <span className="block text-sm text-fg-subtle">{description}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <span className="text-sm font-medium text-fg-muted">Tema</span>
            <ThemeSelector />
          </div>
        </div>
      </dialog>
    </>
  );
}
