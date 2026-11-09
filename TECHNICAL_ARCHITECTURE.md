# PHP Academy — Arquitectura técnica

> Última actualización: 9 nov 2026 (Fase 1).

## 1. Entorno verificado

| Herramienta | Versión | Notas |
|---|---|---|
| Node.js | 24.15.0 | Next 16 exige ≥ 20.9 |
| npm | 11.12.1 | |
| git | **no instalado** | Recomendado instalarlo antes de la Fase 2 para versionar |
| Docker | **no instalado** | Solo necesario si se elige la opción B del motor de ejecución (§6) |
| PHP | **no instalado** | No es necesario para la app; sí para validar ejercicios localmente |

## 2. Dependencias (fijadas)

| Paquete | Versión | Motivo |
|---|---|---|
| `next` | 16.4.5 | Último parche de la línea 16.4 (publicada el 6 oct 2026). Turbopack por defecto, `cacheComponents` activo. |
| `react` / `react-dom` | 19.3.0 | Versión que instala la plantilla oficial de `create-next-app@16.4.5` |
| `typescript` | ^5 | La plantilla oficial sigue en TS 5. TS 7.0 (compilador nativo) ya existe, pero Next 16.4 no lo usa todavía en su plantilla; se reevaluará. |
| `tailwindcss` | ^4 + `@tailwindcss/turbopack` | Tokens en CSS (`@theme`), sin archivo de configuración JS |
| `lucide-react` | 1.70.0 | Set de iconos único (ojo: la v1 renombró iconos, p. ej. `CircleAlert` → `CircleExclamationPoint`) |
| `vitest` (dev) | 5.0.5 | Pruebas unitarias. Se descartó 5.1.0 por tener menos de dos semanas |
| `@types/node` (dev) | ^24 | Coincide con el Node instalado y con el peer de Vitest 5 |

Auditoría: `npm audit --omit=dev` → 0 vulnerabilidades. Las 8 moderadas que aparecen corresponden a dependencias de desarrollo (ESLint 9).

**Aún no instaladas** (se añaden en su fase, verificando versión y compatibilidad en ese momento): `@supabase/supabase-js`, `@supabase/ssr`, editor de código, SDK de Anthropic.

## 3. Decisiones principales

### 3.1 Next.js App Router
- **Alternativas:** SPA con Vite + React Router; Remix/React Router 7.
- **Elección:** Next.js (propuesto en el brief). Aporta rutas de servidor para el profesor IA y el motor de ejecución sin otro backend, renderizado en servidor y buena integración con Supabase.
- **Implicaciones de Next 16:** `params` es una Promise; con `cacheComponents` las rutas dinámicas usan `generateStaticParams` o `<Suspense>`; `middleware` pasa a llamarse `proxy` (relevante para Supabase Auth en Fase 2). Documentación de la versión instalada en `node_modules/next/dist/docs/`.

### 3.2 Contenido educativo como código tipado
- **Alternativas:** MDX; tablas en PostgreSQL; CMS externo.
- **Elección:** módulos TypeScript en `src/content/` validados por los tipos de `src/domain/curriculum.ts`.
- **Motivo:** los ejercicios son datos estructurados (respuestas válidas, pistas, errores típicos) que el compilador puede validar; se revisan en código y se versionan. Si más adelante editan docentes no técnicos, se migrará a base de datos manteniendo los mismos tipos.

### 3.3 Estado en Fase 1
- `ProgressProvider` (contexto React en el cliente) guarda el progreso **en memoria**, inicializado con el conjunto de demostración (`src/data/demo/`). Se pierde al recargar y la interfaz lo dice.
- No se usa `localStorage` para el progreso: sería persistencia a medias. Solo se guarda la preferencia de tema.
- En Fase 2 el proveedor leerá y escribirá en Supabase a través de `src/services/progress/`; la interfaz no cambia.

### 3.4 Estilos
Tailwind v4 con tokens semánticos como variables CSS (`--bg`, `--surface`, `--accent`…) que cambian con `data-theme`. Los componentes solo usan clases semánticas (`bg-surface`, `text-fg-muted`), de modo que el tema claro no necesita variantes `dark:`.

### 3.5 Resaltado de código
Resaltador PHP propio y mínimo (`src/components/code/highlight-php.ts`) en lugar de Shiki o Prism: el contenido de las lecciones es PHP básico, cuesta 0 KB de dependencias y permite anotar líneas concretas. Cuando llegue el editor, el editor tendrá su propio resaltado.

### 3.6 Editor de código (decisión abierta para Fase 3)
| Opción | A favor | En contra |
|---|---|---|
| Monaco (propuesto) | Experiencia VS Code, autocompletado, marcadores de error | ~2–4 MB; **soporte móvil oficial inexistente**; workers que configurar con Turbopack |
| CodeMirror 6 | Ligero y modular; buen soporte táctil y móvil; accesible | Menos «IDE» por defecto |

Recomendación provisional: CodeMirror 6 en móvil y en ejercicios, o en toda la app, porque gran parte del público estudia desde el móvil. Se decidirá con el usuario antes de la Fase 3. La Fase 1 no necesita editor: los ejercicios son de completar huecos y ordenar líneas, que se corrigen de forma determinista.

## 4. Estructura de carpetas

```
src/
├── app/                      # Rutas (solo composición, sin lógica de negocio)
│   ├── (app)/                # Rutas con barra de navegación
│   │   ├── page.tsx          # Inicio
│   │   ├── aprender/  practica/  terminal/  profesor/  estadisticas/  perfil/
│   │   └── layout.tsx        # AppShell
│   ├── (focus)/leccion/[lessonId]/   # Reproductor de lección (modo concentración)
│   ├── layout.tsx            # Raíz: fuentes, tema, ProgressProvider
│   └── globals.css           # Tokens del sistema de diseño
├── components/
│   ├── ui/                   # Primitivas (Button, Badge, ProgressBar…)
│   ├── layout/               # AppShell, navegación, tema
│   └── code/                 # CodeBlock y resaltador PHP
├── features/                 # Interfaz por dominio funcional
│   ├── dashboard/  curriculum/  lesson/  stats/
├── domain/                   # Lógica de negocio pura y tipada (sin React)
│   ├── curriculum.ts         # Tipos del contenido
│   ├── progression.ts        # Desbloqueo y estado de lecciones
│   ├── xp.ts                 # XP, niveles
│   └── answers.ts            # Corrección determinista
├── content/php/              # Contenido educativo (curso, unidades, lecciones)
├── data/demo/                # Datos de demostración (aislados y etiquetados)
├── services/                 # Integraciones externas: interfaces + estado
│   ├── execution/  tutor/  auth/  progress/
└── lib/                      # Utilidades genéricas
```

Reglas de dependencia: `domain` no importa nada de React, de `app` ni de `services`. `content` solo importa tipos de `domain`. `features` puede importar todo lo anterior. `app` solo compone.

## 5. Persistencia (Fase 2) — borrador de esquema

```sql
profiles(id uuid pk → auth.users, display_name, daily_goal_xp int default 30, created_at)
lesson_progress(user_id, lesson_id text, status text, mastery_score numeric, completed_at, primary key(user_id, lesson_id))
attempts(id, user_id, lesson_id, step_id, correct bool, hints_used int, misconception_id text null, created_at)
xp_events(id, user_id, amount int, reason text, source_id text, created_at)
daily_activity(user_id, day date, xp int, correct_answers int, primary key(user_id, day))
achievements(user_id, achievement_id text, unlocked_at, primary key(user_id, achievement_id))
```
Row Level Security en todas las tablas (`user_id = auth.uid()`). El XP se calcula en el servidor (función SQL o ruta de servidor), nunca se confía en el cliente.

## 6. Motor de ejecución de PHP (Fase 3)

Requisitos: aislamiento total del anfitrión, límites de CPU, memoria, tiempo y salida, sin red, soporte de varios archivos (`include`/`require`).

| Opción | Cómo | Ventajas | Inconvenientes |
|---|---|---|---|
| **A. PHP en WebAssembly en el navegador** (`@php-wasm/web`, el runtime de WordPress Playground) | El intérprete corre en un Web Worker con sistema de archivos virtual | Aislado por el propio navegador; coste de servidor 0; respuesta inmediata; multiarchivo nativo | Descarga inicial (~10–20 MB, cacheable); no sirve para corregir con garantías en servidor (el cliente puede manipularse) |
| **B. Contenedor Docker efímero** (`php:8.x-cli`) | Servicio aparte que recibe el código y lo ejecuta | Corrección fiable en servidor; mismo PHP que en clase | Infraestructura y coste; hay que endurecerlo |
| C. Servicio de terceros (Judge0 o similar) | API externa | Rápido de integrar | Dependencia externa; privacidad; coste |

**Propuesta:** A para la Terminal y la práctica libre; B para la corrección que otorga XP y para los simulacros. La decisión final se tomará al empezar la Fase 3.

Endurecimiento obligatorio de la opción B: usuario no root, `--network none`, `--read-only` con `tmpfs` de trabajo, `--memory 128m`, `--cpus 0.5`, `--pids-limit 64`, timeout de pared de 3 s, límite de salida de 64 KB, `disable_functions` (`exec`, `shell_exec`, `system`, `passthru`, `proc_open`, `popen`, `curl_*`, `fsockopen`…), `open_basedir` al directorio del ejercicio, perfil seccomp por defecto, contenedor destruido tras cada ejecución y cola con límite por usuario. **Nunca** se ejecuta PHP en el proceso de Next.js.

Interfaz ya definida: `src/services/execution/types.ts`. Estado actual: `unavailable`.

## 7. Profesor IA (Fase 4)

- Ruta de servidor que llama a la API de Claude; la clave solo existe en el servidor (`ANTHROPIC_API_KEY`).
- Contexto que se envía: lección actual y sus conceptos, enunciado, código del estudiante, salida/errores del motor, errores típicos registrados y número de pistas ya dadas.
- Reglas en el prompt de sistema: lenguaje sencillo, pistas graduales y **no escribir la solución completa**. Se añadirá un filtro posterior que detecte respuestas que contengan la solución.
- Límite de uso por usuario y registro de conversaciones para revisión docente.
- Modelo e identificadores se fijarán al implementar, comprobando los vigentes en ese momento.

Interfaz ya definida: `src/services/tutor/types.ts`. Estado actual: `unavailable`.

## 8. Calidad y verificación

- `npm run check` = lint + pruebas + compilación (con comprobación de tipos). Obligatorio al cerrar cada fase.
- **Pruebas unitarias** (Vitest 5.0.5, `vitest.config.mts`): reglas de XP, niveles, racha, desbloqueo, errores recurrentes, corrección de respuestas, coherencia del conjunto de demostración, integridad del contenido (una sola opción correcta, soluciones alcanzables, errores típicos existentes, 7 fases) y máquina de estados de la lección.
- **Verificación end-to-end (Fase 1):** recorrido completo de la lección 1.2 con Chrome headless por el protocolo DevTools (fallo, pista, huecos, ordenar, prueba de dominio, resultado, navegación posterior, móvil a 390 px y tema claro), sin errores de consola. No está aún en el repositorio; pendiente convertirlo en Playwright.

## 9. Notas de implementación

- Los estilos base de `globals.css` están en `@layer base`: en Tailwind v4 los estilos sin capa ganan a las utilidades, y `outline-none` no funcionaría sobre `:focus-visible`.
- La preferencia de tema se aplica antes del primer pintado con un script en `<head>` (`theme-script.ts`); ese archivo no puede llevar `"use client"` porque lo importa el layout del servidor.
- Las rutas de lección se generan con `generateStaticParams` solo para lecciones con contenido; el bloqueo por requisitos se decide en el cliente con el progreso actual.
