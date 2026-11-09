"use client";

import { useRef, useState, type ReactNode, type RefObject } from "react";
import {
  activityOn,
  calendarWeeks,
  formatDayLong,
  formatDayShort,
  intensity,
  type DailyActivity,
} from "@/domain/activity";
import { cn } from "@/lib/cn";

interface TooltipState {
  x: number;
  y: number;
  content: ReactNode;
}

/** Position of an element's top-centre relative to a container. */
function anchor(el: Element, container: RefObject<HTMLDivElement | null>, offsetTop = 0) {
  const box = el.getBoundingClientRect();
  const parent = container.current?.getBoundingClientRect() ?? box;
  return { x: box.left - parent.left + box.width / 2, y: box.top - parent.top + offsetTop };
}

function Tooltip({ tip }: { tip: TooltipState | null }) {
  if (!tip) return null;
  return (
    <div
      role="presentation"
      className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-border bg-surface px-3 py-2 text-xs whitespace-nowrap text-fg shadow-lg"
      style={{ left: tip.x, top: tip.y - 8 }}
    >
      {tip.content}
    </div>
  );
}

function TableView({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <details className="mt-4 group">
      <summary className="inline-flex cursor-pointer items-center rounded-md text-sm font-medium text-fg-muted hover:text-fg">
        Ver como tabla
      </summary>
      <div className="mt-3 max-h-72 overflow-auto rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">{caption}</caption>
          {children}
        </table>
      </div>
    </details>
  );
}

/** Month label on the first column of each month, unless the previous label is too close to fit. */
function monthColumnLabels(columns: string[][]): string[] {
  const labels: string[] = [];
  let lastLabelColumn = -3;
  columns.forEach((days, w) => {
    const startsMonth = w === 0 || days[0].slice(5, 7) !== columns[w - 1][0].slice(5, 7);
    if (startsMonth && w - lastLabelColumn >= 3) {
      lastLabelColumn = w;
      labels.push(formatDayShort(days[0]).split(" ")[1]);
    } else {
      labels.push("");
    }
  });
  return labels;
}

const HEAT_CLASSES =["bg-heat-0", "bg-heat-1", "bg-heat-2", "bg-heat-3", "bg-heat-4"] as const;

/** Sequential single-hue calendar heatmap (one cell per day, weeks as columns). */
export function ActivityHeatmap({
  activity,
  today,
  weeks = 20,
}: {
  activity: DailyActivity[];
  today: string;
  weeks?: number;
}) {
  const [tip, setTip] = useState<TooltipState | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const columns = calendarWeeks(today, weeks);
  const rowLabels = ["L", "", "X", "", "V", "", "D"];
  const activeDays = columns.flat().filter((d) => d <= today && activityOn(activity, d).xp > 0);
  const monthLabels = monthColumnLabels(columns);

  return (
    <div>
      <div ref={wrapRef} className="relative" onMouseLeave={() => setTip(null)}>
        <div className="overflow-x-auto pb-1">
        <div className="flex min-w-max gap-[3px]">
          <div className="mr-1 grid grid-rows-7 gap-[3px] pt-5" aria-hidden>
            {rowLabels.map((l, i) => (
              <span key={i} className="h-3.5 text-[10px] leading-3.5 text-fg-subtle">
                {l}
              </span>
            ))}
          </div>
          {columns.map((days, w) => {
            const first = days[0];
            return (
              <div key={first} className="flex flex-col gap-[3px]">
                <span className="h-4.5 overflow-visible text-[10px] leading-4 whitespace-nowrap text-fg-subtle" aria-hidden>
                  {monthLabels[w]}
                </span>
                {days.map((day) => {
                  const future = day > today;
                  const a = activityOn(activity, day);
                  return (
                    <span
                      key={day}
                      onMouseEnter={(e) => {
                        if (future) return;
                        setTip({
                          ...anchor(e.currentTarget, wrapRef),
                          content: (
                            <>
                              <span className="font-semibold">{formatDayLong(day)}</span>
                              <span className="ml-2 text-fg-muted">
                                {a.xp} XP · {a.correctAnswers} {a.correctAnswers === 1 ? "acierto" : "aciertos"}
                              </span>
                            </>
                          ),
                        });
                      }}
                      className={cn(
                        "size-3.5 rounded-[3px]",
                        future ? "bg-transparent" : HEAT_CLASSES[intensity(a.xp)],
                        day === today && "ring-1 ring-fg-muted",
                      )}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
        </div>
        <Tooltip tip={tip} />
      </div>

      <div className="mt-3 flex items-center justify-end gap-1.5 text-xs text-fg-subtle" aria-hidden>
        Menos
        {HEAT_CLASSES.map((c) => (
          <span key={c} className={cn("size-3 rounded-[3px]", c)} />
        ))}
        Más
      </div>

      <TableView caption="Días con actividad">
        <thead className="sticky top-0 bg-surface-2 text-fg-muted">
          <tr>
            <th scope="col" className="px-3 py-2 font-medium">Día</th>
            <th scope="col" className="px-3 py-2 text-right font-medium">XP</th>
            <th scope="col" className="px-3 py-2 text-right font-medium">Aciertos</th>
          </tr>
        </thead>
        <tbody className="tabular-nums">
          {activeDays.length === 0 && (
            <tr>
              <td colSpan={3} className="px-3 py-3 text-fg-subtle">Sin actividad en este periodo.</td>
            </tr>
          )}
          {[...activeDays].reverse().map((d) => {
            const a = activityOn(activity, d);
            return (
              <tr key={d} className="border-t border-border">
                <td className="px-3 py-2 text-fg first-letter:uppercase">{formatDayLong(d)}</td>
                <td className="px-3 py-2 text-right text-fg">{a.xp}</td>
                <td className="px-3 py-2 text-right text-fg">{a.correctAnswers}</td>
              </tr>
            );
          })}
        </tbody>
      </TableView>
    </div>
  );
}

/** Single-series column chart: weekly XP. */
export function WeeklyXpChart({ data }: { data: { weekStart: string; xp: number }[] }) {
  const [tip, setTip] = useState<TooltipState | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const max = Math.max(...data.map((d) => d.xp), 1);
  const step = max <= 50 ? 10 : max <= 200 ? 50 : 100;
  const top = Math.ceil(max / step) * step;
  const ticks = [0, top / 2, top];
  const height = 160;

  return (
    <div>
      <div ref={wrapRef} className="relative" onMouseLeave={() => setTip(null)}>
        <div className="flex gap-3">
          {/* Y axis */}
          <div className="relative w-7 shrink-0 text-right text-[11px] tabular-nums text-fg-subtle" style={{ height }} aria-hidden>
            {ticks.map((t) => (
              <span key={t} className="absolute right-0 -translate-y-1/2" style={{ top: height - (t / top) * height }}>
                {t}
              </span>
            ))}
          </div>
          {/* Plot */}
          <div className="relative flex-1" style={{ height }}>
            {ticks.map((t) => (
              <span
                key={t}
                aria-hidden
                className="absolute inset-x-0 h-px bg-border"
                style={{ top: height - (t / top) * height }}
              />
            ))}
            <ol className="absolute inset-0 flex items-end justify-around" aria-label="XP por semana">
              {data.map((d, i) => {
                const h = (d.xp / top) * height;
                const isLast = i === data.length - 1;
                return (
                  <li
                    key={d.weekStart}
                    className="relative flex h-full w-full items-end justify-center"
                    onMouseEnter={(e) => {
                      setTip({
                        // Anchor to the top of the bar, not of the full-height hit area.
                        ...anchor(e.currentTarget, wrapRef, height - h),
                        content: (
                          <>
                            <span className="font-semibold">Semana del {formatDayShort(d.weekStart)}</span>
                            <span className="ml-2 text-fg-muted">{d.xp} XP</span>
                          </>
                        ),
                      });
                    }}
                  >
                    <span className="sr-only">
                      Semana del {formatDayShort(d.weekStart)}: {d.xp} XP
                    </span>
                    {isLast && d.xp > 0 && (
                      <span
                        aria-hidden
                        className="absolute text-xs font-semibold tabular-nums text-fg"
                        style={{ bottom: h + 4 }}
                      >
                        {d.xp}
                      </span>
                    )}
                    <span
                      aria-hidden
                      className={cn("w-full max-w-6 rounded-t-[4px] bg-accent", d.xp === 0 && "hidden")}
                      style={{ height: Math.max(h, 2) }}
                    />
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
        <div className="mt-2 flex gap-3" aria-hidden>
          <span className="w-7 shrink-0" />
          <div className="flex flex-1 justify-around">
            {data.map((d, i) => (
              <span
                key={d.weekStart}
                className={cn(
                  "w-full text-center text-[11px] whitespace-nowrap text-fg-subtle",
                  // On narrow screens keep every other label, always including the latest week.
                  (data.length - 1 - i) % 2 === 1 && "max-sm:invisible",
                )}
              >
                {formatDayShort(d.weekStart)}
              </span>
            ))}
          </div>
        </div>
        <Tooltip tip={tip} />
      </div>

      <TableView caption="XP por semana">
        <thead className="bg-surface-2 text-fg-muted">
          <tr>
            <th scope="col" className="px-3 py-2 font-medium">Semana del</th>
            <th scope="col" className="px-3 py-2 text-right font-medium">XP</th>
          </tr>
        </thead>
        <tbody className="tabular-nums">
          {data.map((d) => (
            <tr key={d.weekStart} className="border-t border-border">
              <td className="px-3 py-2 text-fg">{formatDayShort(d.weekStart)}</td>
              <td className="px-3 py-2 text-right text-fg">{d.xp}</td>
            </tr>
          ))}
        </tbody>
      </TableView>
    </div>
  );
}
