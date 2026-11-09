"use client";

import { DemoNotice } from "@/components/ui/demo-notice";
import { PageHeader, SectionTitle } from "@/components/ui/page-header";
import { conceptName, MISCONCEPTIONS } from "@/content/php/concepts";
import { PHP_COURSE } from "@/content/php/course";
import { formatDayShort, weeklyXp } from "@/domain/activity";
import { allLessons } from "@/domain/progression";
import { useProgress } from "@/features/progress/progress-provider";
import { cn } from "@/lib/cn";
import { ActivityHeatmap, WeeklyXpChart } from "./charts";

function StatTile({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-4">
      <dt className="text-sm text-fg-subtle">{label}</dt>
      <dd className="mt-1">
        <span className="text-2xl font-semibold text-fg">{value}</span>
        {detail && <span className="mt-0.5 block text-xs text-fg-subtle">{detail}</span>}
      </dd>
    </div>
  );
}

export function StatsView() {
  const { state, derived } = useProgress();
  const lessons = allLessons(PHP_COURSE);
  const completed = lessons.filter((l) => state.lessons[l.id]?.status === "completed");
  const stats = Object.entries(state.conceptStats);
  const correct = stats.reduce((s, [, v]) => s + v.correct, 0);
  const attempts = stats.reduce((s, [, v]) => s + v.attempts, 0);
  const concepts = stats
    .map(([id, v]) => ({ id, ...v, ratio: v.attempts ? v.correct / v.attempts : 0 }))
    .sort((a, b) => a.ratio - b.ratio);
  const mistakeCounts = Object.entries(
    state.mistakes.reduce<Record<string, number>>((acc, m) => {
      acc[m.misconceptionId] = (acc[m.misconceptionId] ?? 0) + 1;
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        eyebrow={<DemoNotice compact />}
        title="Estadísticas"
        description="Tu progreso medido por lo que has demostrado aprender, no por el tiempo que pasas en la app."
      />

      <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="Experiencia" value={`${derived.totalXp} XP`} detail={`Nivel ${derived.level.level}`} />
        <StatTile label="Racha actual" value={`${derived.streak} ${derived.streak === 1 ? "día" : "días"}`} />
        <StatTile label="Lecciones dominadas" value={`${completed.length}`} detail={`de ${lessons.length} del módulo`} />
        <StatTile
          label="Precisión"
          value={attempts ? `${Math.round((correct / attempts) * 100)} %` : "—"}
          detail={`${correct} de ${attempts} intentos correctos`}
        />
      </dl>

      <div className="grid gap-10 lg:grid-cols-2">
        <section aria-labelledby="activity-title" className="min-w-0">
          <SectionTitle>
            <span id="activity-title">Actividad diaria</span>
          </SectionTitle>
          <ActivityHeatmap activity={state.activity} today={derived.today} />
        </section>

        <section aria-labelledby="weekly-title" className="min-w-0">
          <SectionTitle>
            <span id="weekly-title">XP por semana</span>
          </SectionTitle>
          <WeeklyXpChart data={weeklyXp(state.activity, derived.today, 8)} />
        </section>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        <section aria-labelledby="concepts-title">
          <SectionTitle>
            <span id="concepts-title">Precisión por concepto</span>
          </SectionTitle>
          <table className="w-full text-sm">
            <caption className="sr-only">Porcentaje de intentos correctos por concepto, de menor a mayor</caption>
            <thead className="sr-only">
              <tr>
                <th scope="col">Concepto</th>
                <th scope="col">Precisión</th>
                <th scope="col">Correctos / intentos</th>
              </tr>
            </thead>
            <tbody>
              {concepts.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0">
                  <th scope="row" className="py-3 pr-4 text-left font-normal text-fg">
                    {conceptName(c.id)}
                  </th>
                  <td className="w-2/5 py-3">
                    <span className="flex items-center gap-3">
                      <span className="h-2 flex-1 overflow-hidden rounded-full bg-surface-3" aria-hidden>
                        <span
                          className={cn("block h-full rounded-full", c.ratio < 0.75 ? "bg-warning" : "bg-accent")}
                          style={{ width: `${c.ratio * 100}%` }}
                        />
                      </span>
                      <span className="w-10 text-right tabular-nums text-fg">{Math.round(c.ratio * 100)} %</span>
                    </span>
                  </td>
                  <td className="py-3 pl-3 text-right tabular-nums text-fg-subtle">
                    {c.correct}/{c.attempts}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-xs leading-5 text-fg-subtle">
            En ámbar, los conceptos por debajo del 75 % de aciertos.
          </p>
        </section>

        <section aria-labelledby="mistakes-title">
          <SectionTitle>
            <span id="mistakes-title">Errores más frecuentes</span>
          </SectionTitle>
          {mistakeCounts.length === 0 ? (
            <p className="text-[15px] text-fg-muted">Todavía no hay errores registrados.</p>
          ) : (
            <ol className="flex flex-col gap-1">
              {mistakeCounts.map(([id, count]) => (
                <li key={id} className="flex items-baseline justify-between gap-4 border-b border-border py-3 last:border-0">
                  <span className="text-[15px] text-fg">{MISCONCEPTIONS[id]?.title ?? id}</span>
                  <span className="shrink-0 text-sm tabular-nums text-fg-subtle">
                    {count} {count === 1 ? "vez" : "veces"}
                  </span>
                </li>
              ))}
            </ol>
          )}

          <h3 className="mt-8 mb-3 text-base font-semibold text-fg">Historial de lecciones</h3>
          {completed.length === 0 ? (
            <p className="text-[15px] text-fg-muted">Aún no has superado ninguna prueba de dominio.</p>
          ) : (
            <ol className="flex flex-col gap-1">
              {completed.map((l) => {
                const p = state.lessons[l.id];
                return (
                  <li key={l.id} className="flex items-baseline justify-between gap-4 border-b border-border py-3 last:border-0">
                    <span className="text-[15px] text-fg">
                      <span className="mr-2 font-mono text-sm text-fg-subtle">{l.code}</span>
                      {l.title}
                    </span>
                    <span className="shrink-0 text-sm tabular-nums text-fg-subtle">
                      {p?.completedOn ? formatDayShort(p.completedOn) : ""} ·{" "}
                      {Math.round((p?.bestMasteryScore ?? 0) * 100)} %
                    </span>
                  </li>
                );
              })}
            </ol>
          )}
        </section>
      </div>
    </div>
  );
}
