# PHP Academy — Especificación de producto

> Documento vivo. Última actualización: 9 nov 2026 (Fase 1).

## 1. Visión

PHP Academy enseña PHP desde cero hasta un nivel avanzado a personas que tienen dificultades para aprender a programar. Combina microlecciones, práctica con código real, un profesor de IA y una gamificación basada en aprendizaje demostrado, no en tiempo de uso.

**Objetivo final:** que una persona sin conocimientos previos aprenda PHP de forma progresiva, entienda la lógica de programación y resuelva ejercicios de forma autónoma.

## 2. Público

| Perfil | Necesidad principal |
|---|---|
| Estudiante de FP (CFGM SMR) que sigue el temario de clase | Practicar el temario oficial con ejercicios corregidos y explicaciones pacientes |
| Principiante autodidacta | Un camino claro, sin saltos de dificultad, que no presuponga conocimientos |
| Estudiante bloqueado | Saber exactamente qué falla y por qué, sin que le den la solución hecha |

Principio de diseño derivado: **la interfaz debe ser comprensible para alguien sin conocimientos informáticos.** Nada de jerga sin explicar y siempre una única acción principal por pantalla.

## 3. Diferencias frente a Duolingo y Mimo

| Limitación habitual | Respuesta de PHP Academy |
|---|---|
| Se avanza por tiempo o por rachas, no por dominio | Una lección solo se completa superando su **prueba de dominio** |
| Los errores se olvidan | Cada error se asocia a un **concepto** y a un **error típico**; el sistema los acumula y propone refuerzo |
| Ejercicios de reconocimiento (elegir opción) sin producción real | Progresión reconocimiento → completar → ordenar → escribir y ejecutar código real |
| Pistas que revelan la solución | **Pistas graduales** (concepto → ubicación → casi-respuesta); nunca la solución completa automática |
| Contenido genérico | Contenido alineado con el temario de clase y **procedencia visible** (oficial / refuerzo) |

## 4. Navegación principal

| Sección | Ruta | Función | Estado Fase 1 |
|---|---|---|---|
| Inicio | `/` | Qué hago hoy: continuar lección, objetivo diario, racha, conceptos a reforzar | Funcional con datos de demostración |
| Aprender | `/aprender` | Itinerario Curso → Unidades → Capítulos → Lecciones con bloqueo por requisitos | Funcional |
| Lección | `/leccion/[id]` | Reproductor de lección en modo concentración (7 fases pedagógicas) | Funcional (11 lecciones completas) |
| Práctica | `/practica` | Repaso espaciado, ejercicios del documento oficial, simulacros de examen | Pendiente (requiere persistencia y motor de ejecución) |
| Terminal | `/terminal` | Editor + ejecución de PHP aislada | Pendiente (requiere motor de ejecución) |
| Profesor IA | `/profesor` | Tutor que analiza el código y da pistas graduales | Pendiente (requiere backend + API de Claude) |
| Estadísticas | `/estadisticas` | Actividad, XP, precisión por concepto, historial | Funcional con datos de demostración |
| Perfil | `/perfil` | Cuenta, preferencias (tema), logros | Parcial: tema funcional; cuenta pendiente de autenticación |

Las secciones pendientes muestran **qué harán y qué falta para activarlas**. No contienen botones que no funcionen.

## 5. Alcance por fases

### Fase 1 — Fundaciones (actual)
- Documentación: producto, diseño, sistema de aprendizaje, arquitectura.
- Identidad visual y sistema de diseño (tema oscuro por defecto y tema claro).
- Navegación (barra lateral en escritorio, barra inferior en móvil).
- Dashboard con **datos de demostración identificados**.
- Itinerario del Tema 3 con bloqueo por requisitos.
- Reproductor de lección con las 7 fases, pistas graduales, registro de errores y prueba de dominio. El progreso vive **solo en memoria** y se avisa de ello.

### Fase 2 — Cuentas y persistencia
- Supabase Auth (correo + enlace mágico).
- Esquema PostgreSQL: perfiles, progreso por lección, intentos, errores, XP, actividad diaria.
- Sustituir los datos de demostración por datos reales.

### Fase 3 — Ejecución de PHP
- Motor de ejecución aislado (ver `TECHNICAL_ARCHITECTURE.md` §6).
- Terminal y ejercicios de escritura libre corregidos con casos de prueba.
- Importación de los **20 ejercicios oficiales** del Tema 3.

### Fase 4 — Profesor IA
- Endpoint de servidor con la API de Claude, contexto del temario, del código del estudiante y de su historial de errores.
- Pistas graduales generadas, nunca la solución completa.

### Fase 5 — Práctica y evaluación
- Repaso espaciado de conceptos débiles, simulacros de examen, logros completos.

## 6. Contenido oficial

Fuente del primer módulo: **Tema 3 — Funciones y modularización**. Asignatura Programación, Prof. Alejandro Zazo, CFGM Sistemas Microinformáticos y Redes, Centro Didáctico.

- El **índice de contenidos** del tema se usa como estructura del módulo.
- Las explicaciones, ejemplos y ejercicios escritos por PHP Academy se marcan como **«Refuerzo · PHP Academy»**.
- Los **20 ejercicios originales** (10 en un archivo, 10 modularizados) se importarán **literalmente** (enunciados, nombres de función, requisitos y objetivos) cuando se disponga del documento. **Estado: documento no disponible en el repositorio → pendiente.** Hasta entonces la interfaz muestra sus huecos como «pendientes de importar» y no inventa ningún enunciado.

## 7. Criterios de calidad

- Sin funcionalidades simuladas: lo que no existe se presenta como pendiente.
- Datos de demostración siempre etiquetados.
- Accesibilidad WCAG 2.2 AA como objetivo: contraste, foco visible, navegación por teclado, `prefers-reduced-motion`.
- Responsive real desde 360 px.
- Compilación (`npm run build`), tipos y lint limpios al cerrar cada fase.
