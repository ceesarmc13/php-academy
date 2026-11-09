/**
 * Real availability of external integrations. The UI reads this to decide
 * whether to show a feature or an honest "pending" state. Update it when an
 * integration actually ships — never flip a flag to fake a feature.
 */

export type IntegrationId = "auth" | "persistence" | "execution" | "tutor";

export interface IntegrationStatus {
  id: IntegrationId;
  name: string;
  available: boolean;
  /** What is needed to enable it. */
  requires: string[];
  phase: number;
}

export const INTEGRATIONS: Record<IntegrationId, IntegrationStatus> = {
  auth: {
    id: "auth",
    name: "Cuentas de usuario",
    available: false,
    requires: ["Proyecto de Supabase", "Supabase Auth configurado (correo y enlace mágico)"],
    phase: 2,
  },
  persistence: {
    id: "persistence",
    name: "Guardado del progreso",
    available: false,
    requires: ["Base de datos PostgreSQL en Supabase", "Tablas de progreso con seguridad por fila"],
    phase: 2,
  },
  execution: {
    id: "execution",
    name: "Ejecución de PHP",
    available: false,
    requires: [
      "Motor aislado: PHP en WebAssembly en el navegador o contenedor Docker efímero",
      "Límites de tiempo, memoria y salida; sin acceso a red ni al sistema",
    ],
    phase: 3,
  },
  tutor: {
    id: "tutor",
    name: "Profesor IA",
    available: false,
    requires: ["Clave de la API de Claude en el servidor", "Ruta de servidor con límites de uso"],
    phase: 4,
  },
};
