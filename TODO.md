# PHP Academy — Tareas pendientes

> Actualizado: 9 nov 2026, cierre de la Fase 1.

## Bloqueantes que dependen del usuario

- [ ] **Documento del Tema 3** (Prof. Alejandro Zazo). No está publicado en internet (búsqueda hecha el 9 nov 2026). Sin él no se pueden importar los 20 ejercicios oficiales ni contrastar las explicaciones con el texto original.
- [ ] **Editor de código:** decidir Monaco (propuesto) o CodeMirror 6 (mejor en móvil). Ver `TECHNICAL_ARCHITECTURE.md` §3.6.
- [ ] **Motor de ejecución:** confirmar la propuesta (PHP-WASM en el navegador para práctica + Docker para corrección con XP). Ver §6.
- [ ] **Infraestructura:** crear el proyecto de Supabase y facilitar la clave de la API de Claude cuando toque.
- [x] Instalar **git** e inicializar el repositorio (git y GitHub CLI instalados con winget a nivel de usuario).

## Fase 1 — hecho

- [x] Inspección del entorno y verificación de versiones (Next 16.4.5, React 19.3, Tailwind 4, TS 5).
- [x] Documentación: producto, diseño, aprendizaje, arquitectura.
- [x] Identidad visual (logo `<?`, tokens oscuro/claro con contraste AA calculado).
- [x] Navegación: barra lateral (escritorio), barra inferior + hoja «Más» (móvil).
- [x] Dashboard con datos de demostración etiquetados.
- [x] Itinerario del Tema 3 con desbloqueo por prueba de dominio.
- [x] Reproductor de lección: 7 fases, test, completar huecos, ordenar líneas, pistas graduales, registro de errores, corrección, prueba de dominio, XP y logros.
- [x] Las 11 lecciones del Tema 3 completas (contenido de PHP Academy, ejercicios de refuerzo), con soporte para lecciones de varios archivos.
- [x] Estadísticas (calendario de actividad, XP semanal, precisión por concepto) y Perfil (tema y objetivo diario).
- [x] Pruebas unitarias (Vitest) e integridad del contenido; recorrido end-to-end de una lección verificado manualmente con Chrome headless.

## Fase 1 — pendiente menor

- [ ] Prueba end-to-end automatizada en el repositorio (Playwright) del flujo de lección.
- [ ] Auditoría con lector de pantalla real (NVDA / VoiceOver).
- [ ] Revisar con el docente las explicaciones de las 11 lecciones.

## Fase 2 — Cuentas y persistencia
- [ ] Supabase Auth (enlace mágico) con `proxy.ts` de Next 16.
- [ ] Esquema y RLS (ver `TECHNICAL_ARCHITECTURE.md` §5).
- [ ] `src/services/progress/` y migrar `ProgressProvider` a datos reales. Fecha real en lugar de `DEMO_TODAY`.
- [ ] Cálculo de XP en el servidor.
- [ ] Retirar los avisos de demostración solo de los datos que pasen a ser reales.

## Fase 3 — Ejecución
- [ ] Motor aislado e interfaz `CodeExecutionService`.
- [ ] Terminal con editor.
- [ ] Ejercicios de escritura libre con casos de prueba (tipo `code`).
- [ ] Importación literal de los 20 ejercicios oficiales.

## Fase 4 — Profesor IA
- [ ] Ruta de servidor con la API de Claude, contexto de lección y errores, límites de uso.
- [ ] Filtro que impida revelar la solución completa.

## Fase 5 — Práctica y evaluación
- [ ] Repaso espaciado de errores recurrentes.
- [ ] Simulacros de examen.
- [ ] Prueba diagnóstica de requisitos externos del módulo.
