"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="contenido" className="mx-auto flex min-h-dvh max-w-md flex-col items-start justify-center gap-5 px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-fg">Algo ha fallado</h1>
      <p className="text-[17px] leading-7 text-fg-muted">
        No es culpa tuya. Vuelve a intentarlo; si el problema continúa, recarga la página.
      </p>
      {error.digest && <p className="font-mono text-xs text-fg-subtle">Código: {error.digest}</p>}
      <Button onClick={reset} icon={<RotateCcw aria-hidden className="size-4" />}>
        Reintentar
      </Button>
    </main>
  );
}
