import { Dumbbell } from "lucide-react";
import type { Metadata } from "next";
import { PlannedFeature } from "@/components/ui/planned-feature";

export const metadata: Metadata = { title: "Práctica" };

export default function PracticePage() {
  return (
    <PlannedFeature
      icon={Dumbbell}
      title="Práctica"
      purpose="Entrena lo que ya has aprendido: repaso de tus errores recurrentes, los ejercicios oficiales del Tema 3 y simulacros de examen."
      capabilities={[
        "Repaso espaciado: ejercicios de refuerzo sobre los conceptos que más fallas, cuando toca repasarlos.",
        "Los 20 ejercicios originales del Tema 3, con su enunciado literal, corregidos con casos de prueba.",
        "Simulacros de examen cronometrados, sin pistas, con informe de conceptos a reforzar.",
      ]}
      dependsOn={["persistence", "execution"]}
      meanwhile={{ label: "Ir al itinerario", href: "/aprender" }}
    />
  );
}
