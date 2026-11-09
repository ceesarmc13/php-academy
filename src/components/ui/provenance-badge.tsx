import { BookCheck, Sparkle } from "lucide-react";
import type { Provenance } from "@/domain/curriculum";
import { Badge } from "./badge";

export function ProvenanceBadge({ provenance }: { provenance: Provenance }) {
  if (provenance === "official") {
    return (
      <Badge tone="accent" icon={<BookCheck aria-hidden className="size-3.5" />}>
        Temario oficial
      </Badge>
    );
  }
  return (
    <Badge tone="neutral" icon={<Sparkle aria-hidden className="size-3.5" />}>
      Refuerzo · PHP Academy
    </Badge>
  );
}
