# PHP Academy — Sistema de aprendizaje

> Las reglas de este documento están implementadas como funciones puras en `src/domain/`. Si cambias una regla, cambia ambos.

## 1. Jerarquía del contenido

```
Curso (PHP)
└── Unidad (p. ej. Tema 3 · Funciones y modularización)
    ├── Capítulo (p. ej. Parámetros y argumentos)
    │   └── Lección (microlección de 8–12 min)
    │       ├── Pasos de enseñanza (explicación, ejemplo)
    │       ├── Ejercicios (comprobación, guiado, autónomo)
    │       └── Prueba de dominio
    └── Evaluación de unidad (simulacro)
```

Tipos en `src/domain/curriculum.ts`. Contenido en `src/content/`.

## 2. Metodología de cada lección (7 fases)

| # | Fase | Objetivo | Tipo de paso en código |
|---|---|---|---|
| 1 | Explicación sencilla | Introducir **un** concepto con lenguaje cotidiano y una analogía | `explanation` |
| 2 | Ejemplo comentado | Ver el concepto funcionando; cada línea explicada | `example` |
| 3 | Comprobación de comprensión | Detectar malentendidos antes de practicar | `choice` (fase `check`) |
| 4 | Ejercicio guiado | Producir código con andamiaje (completar huecos) | `fill` (fase `guided`) |
| 5 | Ejercicio autónomo | Construir un programa sin andamiaje directo | `order` (Fase 1) → `code` (Fase 3, con ejecución) |
| 6 | Corrección y explicación | Repasar cada error de la sesión con su explicación | `review` (generado a partir de la sesión) |
| 7 | Prueba de dominio | Demostrar dominio sin pistas | `mastery` |

Además, **cada ejercicio** da corrección inmediata: qué ha fallado, por qué y qué concepto repasar.

## 3. Requisitos y desbloqueo

- Cada lección declara `prerequisites` (ids de lecciones) y `concepts` (ids de conceptos que enseña).
- **Una lección está disponible solo si todas sus lecciones previas tienen la prueba de dominio superada.** No hay desbloqueo por tiempo, por XP ni por racha.
- El paso a la siguiente lección nunca es automático: si la prueba de dominio no se supera, la lección queda «en curso» y se ofrece repaso de los conceptos fallados.
- Una unidad declara requisitos externos (p. ej. el Tema 3 presupone variables, `echo` y condicionales). Hasta que exista la prueba diagnóstica (Fase 5), se **muestran** como aviso; no se comprueban.

Implementación: `getLessonStatus()` en `src/domain/progression.ts`.

## 4. Errores y refuerzo

Cada opción incorrecta, hueco o línea distractora puede llevar un `misconceptionId` del catálogo `src/content/php/misconceptions.ts`. Por ejemplo:

| Id | Error típico |
|---|---|
| `define-runs-function` | Cree que definir una función la ejecuta |
| `call-without-parentheses` | Llama a la función sin `()` |
| `function-keyword` | Olvida o escribe mal la palabra `function` |
| `definition-without-parentheses` | Define la función sin `()` |
| `call-vs-definition` | Confunde la definición con la llamada |
| `calls-count` | Cuenta mal cuántas veces se ejecuta una función |
| `execution-order` | Confunde el orden de ejecución |
| `refactor-change-everywhere` | Cree que con una función hay que cambiar el código en cada llamada |
| `modularity-speed` | Cree que modularizar sirve para que el programa vaya más rápido |

Las pruebas de `src/domain/domain.test.ts` comprueban que todo error referenciado en el contenido existe en el catálogo.

Durante la lección se registra cada error (`SessionMistake`). La fase 6 los agrupa por error típico y muestra su explicación. En Fase 2 se persistirán y se considerará **error recurrente** el que aparece en ≥ 2 sesiones distintas o ≥ 3 veces en 7 días; esos conceptos aparecerán en «Conceptos a reforzar» y en la cola de repaso.

## 5. Pistas graduales

Cada ejercicio tiene hasta 3 pistas, en este orden:
1. **Concepto:** qué idea hay que aplicar.
2. **Ubicación:** dónde mirar (línea, parte del ejemplo).
3. **Casi-respuesta:** reduce el problema al mínimo **sin escribir la solución completa**.

No existe el botón «ver solución». Si el estudiante se atasca puede **seguir sin resolver**: el ejercicio da 0 XP y su concepto queda marcado para reforzar. La prueba de dominio sigue siendo obligatoria.

## 6. Experiencia (XP), niveles y racha

**Principio: se recompensa el aprendizaje demostrado, no el tiempo.**

| Evento | XP |
|---|---|
| Ejercicio correcto al primer intento sin pistas | 10 |
| Correcto tras fallar o con pistas | `max(2, 10 − 2·pistas − 2·fallos)` |
| Seguir sin resolver | 0 |
| Prueba de dominio superada | 20 + 5 por cada pregunta acertada |
| Prueba de dominio no superada | 0 (la XP de los ejercicios sí se conserva) |
| Repetir una lección ya dominada | 25 % de lo anterior (repaso) |

- No hay XP por minutos, por abrir la app ni por leer pantallas de explicación.
- La XP se registra al terminar la prueba de dominio. Si el estudiante abandona la lección antes, no se registra nada (se le avisa al salir).
- **Nivel:** el nivel *n* requiere `50·n·(n−1)` XP acumulada (2 → 100, 3 → 300, 4 → 600, 5 → 1000…). Función `levelFromXp()`.
- **Racha:** días consecutivos con **al menos un ejercicio correcto** (no basta con entrar).
- **Objetivo diario:** XP diaria elegida por el estudiante (por defecto 30 XP ≈ una lección).

Implementación: `src/domain/xp.ts`.

## 7. Prueba de dominio

- 3–5 preguntas que mezclan tipos, **sin pistas**.
- Umbral de superación por lección (`passingScore`, por defecto 0,75).
- Si no se supera: se muestran los conceptos fallados y se puede repetir. No se desbloquea nada.

## 8. Procedencia del contenido

Cada paso evaluable lleva `provenance`:
- `official`: copia literal del documento de clase (enunciado, nombres de función, requisitos).
- `reinforcement`: creado por PHP Academy. Se etiqueta «Refuerzo · PHP Academy».

Las explicaciones y ejemplos de PHP Academy indican que **se basan en** el temario del Tema 3, no que lo reproducen.

## 9. Módulo 1 — Tema 3: Funciones y modularización

| Capítulo | Lecciones | Contenido |
|---|---|---|
| 1. El concepto de función | 1.1 ¿Qué es una función? · 1.2 Beneficios de modularizar | Completo |
| 2. Definir y ejecutar funciones | 2.1 Funciones sin parámetros · 2.2 El flujo de ejecución | Completo |
| 3. Parámetros y argumentos | 3.1 Parámetros y argumentos · 3.2 Funciones con varios parámetros | Completo |
| 4. Devolver resultados | 4.1 `return` frente a `echo` · 4.2 Funciones con retorno | Completo |
| 5. Programas en varios archivos | 5.1 `include` y `require` · 5.2 `include_once` y `require_once` · 5.3 Organizar un proyecto | Completo |
| 6. Ejercicios oficiales | 10 en un archivo · 10 modularizados | **Pendiente del documento original** |

Las 11 lecciones están escritas por PHP Academy siguiendo el índice del Tema 3 (el documento original no está publicado ni disponible en el repositorio). Todos sus ejercicios son de refuerzo. Cuando se disponga del documento conviene que el docente revise las explicaciones y se importen los 20 ejercicios oficiales.

Contenido destacado por capítulo: nombres válidos de funciones y funciones que llaman a otras (2.1); seguimiento del flujo y llamadas antes de la definición en el mismo archivo (2.2); ámbito de las variables y parámetro frente a argumento (3.1); orden de los argumentos, argumentos que faltan y valores por defecto (3.2); `return` frente a `echo` y código tras `return` (4.1); funciones booleanas y varios `return` (4.2); `include` frente a `require` cuando falta el archivo (5.1); redeclaración y variantes `_once` (5.2); estructura `lib/`, archivos sin efectos secundarios y rutas con `__DIR__` (5.3).
