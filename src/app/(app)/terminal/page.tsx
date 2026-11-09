import { SquareTerminal } from "lucide-react";
import type { Metadata } from "next";
import { PlannedFeature } from "@/components/ui/planned-feature";

export const metadata: Metadata = { title: "Terminal" };

export default function TerminalPage() {
  return (
    <PlannedFeature
      icon={SquareTerminal}
      title="Terminal"
      purpose="Un espacio para escribir PHP y ejecutarlo de verdad, en un entorno aislado y seguro."
      capabilities={[
        "Editor de código con resaltado, numeración de líneas y avisos de errores.",
        "Ejecutar programas de uno o varios archivos (include y require) y ver su salida.",
        "Mensajes de error de PHP explicados en lenguaje sencillo.",
      ]}
      dependsOn={["execution"]}
      meanwhile={{ label: "Ir al itinerario", href: "/aprender" }}
    />
  );
}
