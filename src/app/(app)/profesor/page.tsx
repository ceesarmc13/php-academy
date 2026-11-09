import { GraduationCap } from "lucide-react";
import type { Metadata } from "next";
import { PlannedFeature } from "@/components/ui/planned-feature";

export const metadata: Metadata = { title: "Profesor IA" };

export default function TutorPage() {
  return (
    <PlannedFeature
      icon={GraduationCap}
      title="Profesor IA"
      purpose="Un tutor particular que conoce el temario y tu historial, y te ayuda a razonar sin darte la solución hecha."
      capabilities={[
        "Explicaciones desde cero, con lenguaje sencillo y ejemplos que avanzan poco a poco.",
        "Análisis de tu código: errores de sintaxis y de lógica, señalados con su porqué.",
        "Pistas graduales. Nunca te escribirá la solución completa.",
        "Seguimiento de tus dificultades para adaptar las explicaciones a tu nivel.",
      ]}
      dependsOn={["tutor", "execution"]}
      meanwhile={{ label: "Ir al itinerario", href: "/aprender" }}
    />
  );
}
