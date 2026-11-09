# PHP Academy

Plataforma educativa para aprender PHP desde cero: microlecciones con 7 fases pedagógicas, corrección inmediata con explicación de errores, pistas graduales y gamificación basada en aprendizaje demostrado.

**Estado: Fase 1 (fundaciones).** Navegación, dashboard, itinerario y reproductor de lección funcionales. El progreso parte de un **estudiante de demostración** y vive en memoria (se pierde al recargar). Cuentas, guardado, ejecución de PHP y profesor IA están diseñados pero **no implementados**; la interfaz lo indica en cada caso.

## Puesta en marcha

Requisitos: Node.js ≥ 20.9 (probado con 24.15).

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo (Turbopack) |
| `npm run build` | Compilación de producción con comprobación de tipos |
| `npm run lint` | ESLint |
| `npm test` | Pruebas unitarias (Vitest) de dominio, contenido y sesión de lección |
| `npm run check` | Lint + pruebas + compilación |

## Documentación

| Documento | Contenido |
|---|---|
| [PRODUCT_SPEC.md](PRODUCT_SPEC.md) | Visión, público, navegación, alcance por fases |
| [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) | Tokens, tipografía, componentes, accesibilidad |
| [LEARNING_SYSTEM.md](LEARNING_SYSTEM.md) | Metodología, desbloqueo, errores típicos, XP y niveles |
| [TECHNICAL_ARCHITECTURE.md](TECHNICAL_ARCHITECTURE.md) | Decisiones, carpetas, persistencia, motor de ejecución, profesor IA |
| [TODO.md](TODO.md) | Tareas pendientes por fase |

## Contenido

El primer módulo sigue el índice del **Tema 3: Funciones y modularización** (Programación, Prof. Alejandro Zazo, CFGM SMR, Centro Didáctico): 5 capítulos y 11 lecciones completas. Las explicaciones y ejercicios son de PHP Academy y se etiquetan como **refuerzo**. Los 20 ejercicios originales del documento están **pendientes de importar**.
