"use client";

import { CircleUser, KeyRound } from "lucide-react";
import { ThemeSelector } from "@/components/layout/theme";
import { DemoNotice } from "@/components/ui/demo-notice";
import { PageHeader, SectionTitle } from "@/components/ui/page-header";
import { INTEGRATIONS } from "@/services/status";
import { useProgress } from "@/features/progress/progress-provider";
import { cn } from "@/lib/cn";

const GOALS = [
  { xp: 10, label: "Suave", detail: "Un par de ejercicios" },
  { xp: 30, label: "Normal", detail: "Una lección" },
  { xp: 50, label: "Intenso", detail: "Lección y repaso" },
];

export function ProfileView() {
  const { state, derived, setDailyGoal } = useProgress();
  const auth = INTEGRATIONS.auth;

  return (
    <div className="flex flex-col gap-10">
      <PageHeader eyebrow={<DemoNotice compact />} title="Perfil" />

      <section className="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-5 sm:flex-row sm:items-center sm:p-6">
        <span className="grid size-16 shrink-0 place-items-center rounded-full bg-surface-2 text-fg-muted">
          <CircleUser aria-hidden className="size-8" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-semibold text-fg">{state.displayName}</p>
          <p className="text-[15px] text-fg-muted">
            Nivel {derived.level.level} · {derived.totalXp} XP · {derived.achievements.size} logros
          </p>
        </div>
      </section>

      <section aria-labelledby="account-title">
        <SectionTitle>
          <span id="account-title">Cuenta</span>
        </SectionTitle>
        <div className="flex gap-3 rounded-xl border border-dashed border-border-strong p-4">
          <KeyRound aria-hidden className="mt-0.5 size-5 shrink-0 text-fg-subtle" />
          <div className="text-[15px] leading-6">
            <p className="font-medium text-fg">El registro y el inicio de sesión aún no están disponibles</p>
            <p className="mt-1 text-fg-muted">
              Llegarán en la fase {auth.phase}. Hace falta: {auth.requires.join("; ").toLowerCase()}. Hasta entonces
              trabajas con un perfil de demostración que no se guarda.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="prefs-title" className="flex flex-col gap-6">
        <SectionTitle>
          <span id="prefs-title">Preferencias</span>
        </SectionTitle>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-fg">Tema</p>
            <p className="text-sm text-fg-subtle">Se recuerda en este navegador.</p>
          </div>
          <ThemeSelector />
        </div>

        <fieldset className="border-t border-border pt-6" aria-describedby="goal-help">
          <legend className="float-left w-full font-medium text-fg">Objetivo diario</legend>
          <p id="goal-help" className="clear-both text-sm text-fg-subtle">
            XP que quieres conseguir cada día. Se guarda solo durante esta visita.
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {GOALS.map((g) => {
              const active = state.dailyGoalXp === g.xp;
              return (
                <label
                  key={g.xp}
                  className={cn(
                    "flex cursor-pointer flex-col rounded-xl border-2 px-4 py-3 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent",
                    active ? "border-accent bg-accent-soft" : "border-border hover:border-border-strong",
                  )}
                >
                  <input
                    type="radio"
                    name="daily-goal"
                    value={g.xp}
                    checked={active}
                    onChange={() => setDailyGoal(g.xp)}
                    className="sr-only"
                  />
                  <span className="font-semibold text-fg">
                    {g.label} · {g.xp} XP
                  </span>
                  <span className="text-sm text-fg-muted">{g.detail}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      </section>
    </div>
  );
}
