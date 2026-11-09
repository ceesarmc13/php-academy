import { ArrowLeft } from "lucide-react";
import { LogoMark } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main id="contenido" className="mx-auto flex min-h-dvh max-w-md flex-col items-start justify-center gap-5 px-6">
      <LogoMark className="size-12" />
      <h1 className="text-2xl font-semibold tracking-tight text-fg">Esta página no existe</h1>
      <p className="text-[17px] leading-7 text-fg-muted">
        Puede que el enlace esté mal escrito o que la lección todavía esté en preparación.
      </p>
      <ButtonLink href="/aprender" variant="secondary" icon={<ArrowLeft aria-hidden className="size-4" />}>
        Ir al itinerario
      </ButtonLink>
    </main>
  );
}
