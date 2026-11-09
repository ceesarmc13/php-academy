import { ArrowRight, CircleDashed, type LucideIcon } from "lucide-react";
import { INTEGRATIONS, type IntegrationId } from "@/services/status";
import { ButtonLink } from "./button";
import { PageHeader } from "./page-header";

/**
 * Honest state for a section that is designed but not implemented yet.
 * Explains what it will do and what is missing — no fake controls.
 */
export function PlannedFeature({
  icon: Icon,
  title,
  purpose,
  capabilities,
  dependsOn,
  meanwhile,
}: {
  icon: LucideIcon;
  title: string;
  purpose: string;
  capabilities: string[];
  dependsOn: IntegrationId[];
  meanwhile: { label: string; href: string };
}) {
  const integrations = dependsOn.map((id) => INTEGRATIONS[id]);
  const phase = Math.max(...integrations.map((i) => i.phase));

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        eyebrow={
          <span className="inline-flex items-center gap-2">
            <CircleDashed aria-hidden className="size-4" /> Disponible a partir de la fase {phase}
          </span>
        }
        title={title}
        description={purpose}
      />

      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <section aria-labelledby="planned-capabilities">
          <h2 id="planned-capabilities" className="mb-4 text-sm font-semibold uppercase tracking-wide text-fg-subtle">
            Qué podrás hacer aquí
          </h2>
          <ul className="flex flex-col gap-3">
            {capabilities.map((c) => (
              <li key={c} className="flex gap-3 text-[15px] leading-6 text-fg-muted">
                <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
                {c}
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="planned-requirements"
          className="rounded-xl border border-border bg-surface p-5"
        >
          <div className="mb-4 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-lg bg-surface-2 text-fg-muted">
              <Icon aria-hidden className="size-5" />
            </span>
            <h2 id="planned-requirements" className="font-semibold text-fg">
              Qué falta para activarlo
            </h2>
          </div>
          <ul className="flex flex-col gap-4">
            {integrations.map((i) => (
              <li key={i.id}>
                <p className="text-sm font-semibold text-fg">
                  {i.name} <span className="font-normal text-fg-subtle">· fase {i.phase}</span>
                </p>
                <ul className="mt-1.5 flex flex-col gap-1">
                  {i.requires.map((r) => (
                    <li key={r} className="text-sm leading-6 text-fg-muted">
                      {r}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="flex flex-col items-start gap-3 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[15px] text-fg-muted">Mientras tanto, puedes seguir avanzando en el itinerario.</p>
        <ButtonLink href={meanwhile.href} variant="secondary" iconRight={<ArrowRight aria-hidden className="size-4" />}>
          {meanwhile.label}
        </ButtonLink>
      </div>
    </div>
  );
}
