# PHP Academy — Sistema de diseño

> Fuente de verdad de los tokens: `src/app/globals.css`. Este documento explica su intención.

## 1. Principios

1. **Una acción principal por pantalla.** Botón primario verde; todo lo demás es secundario o texto.
2. **El verde significa progreso.** Se reserva para avance, aciertos y la acción principal. No se usa como decoración.
3. **Superficies planas, bordes finos.** Sin gradientes, sin sombras grandes, sin brillos. La jerarquía sale del espaciado, el tamaño y el contraste.
4. **Menos tarjetas.** Se agrupa con espacio y títulos de sección; una tarjeta solo cuando el bloque es una unidad de acción.
5. **Movimiento con propósito.** Las animaciones confirman (feedback, progreso), nunca entretienen. Duración 120–240 ms. Se desactivan con `prefers-reduced-motion`.
6. **Nunca solo color.** Acierto/error se comunican con icono + texto + color.

## 2. Color

Tema **oscuro por defecto**; tema claro alternativo (`<html data-theme="light">`). Todos los componentes usan tokens semánticos, nunca hex directos.

| Token | Oscuro | Claro | Uso |
|---|---|---|---|
| `bg` | `#101318` | `#F5F6F8` | Fondo de la app |
| `surface` | `#1C222B` | `#FFFFFF` | Paneles, tarjetas, barra lateral |
| `surface-2` | `#232A35` | `#EEF0F3` | Hover, campos, pistas de progreso |
| `surface-3` | `#2C3542` | `#E2E6EB` | Elementos pulsados, celdas vacías |
| `border` | `#2A313C` | `#E1E4E9` | Bordes de 1 px |
| `border-strong` | `#3A4351` | `#C9CED6` | Bordes de campos y foco suave |
| `fg` | `#FFFFFF` | `#0E1116` | Texto principal |
| `fg-muted` | `#A7B0BD` | `#4B5563` | Texto secundario |
| `fg-subtle` | `#8A94A3` | `#636B78` | Metadatos, ayudas |
| `accent` | `#58CC80` | `#1A7F45` | Progreso, acción principal, aciertos |
| `accent-hover` | `#6FD893` | `#156B3A` | Hover del primario |
| `accent-fg` | `#06180D` | `#FFFFFF` | Texto sobre verde |
| `accent-soft` | `#58CC80` al 14 % | `#1A7F45` al 10 % | Fondos de estado correcto |
| `danger` | `#F27474` | `#C93C3C` | Errores |
| `warning` | `#F2B84B` | `#965F00` | Racha, avisos |
| `info` | `#6CB4F5` | `#2F6FB5` | Información, datos de demostración |

Contraste calculado (WCAG 2.x), todo texto ≥ 4,5:1:

| Par | Oscuro | Claro |
|---|---|---|
| `fg` / `bg` | 18,6 | 17,5 |
| `fg-muted` / `surface` | 7,3 | 7,6 |
| `fg-subtle` / `surface` | 5,2 | 5,3 |
| `accent` / `bg` (texto verde) | 9,2 | 4,7 |
| `accent-fg` / `accent` (botón primario) | 9,1 | 5,0 |
| `danger` / `surface` | 5,7 | 5,0 |
| `warning` / `surface` | 8,9 | 5,3 |

En el tema oscuro **el texto blanco nunca va sobre el verde** (2:1); el botón primario usa `accent-fg` casi negro. En el tema claro el verde se oscurece a `#1A7F45` para que el texto blanco sobre él y el texto verde sobre fondo claro cumplan AA.

### Datos (gráficos)
- **Secuencial** (calendario de actividad): una sola tonalidad verde en 5 pasos, de `surface-3` (sin actividad) a `accent`.
- **Una sola serie** (XP semanal): barras en `accent`, máx. 24 px, extremo superior redondeado 4 px, base recta, rejilla de 1 px en `border`.
- El texto de los gráficos usa tokens de texto, nunca el color de la serie. Cada gráfico tiene tooltip y vista de tabla accesible.

## 3. Tipografía

- **Geist Sans** para la interfaz: alta legibilidad, cifras claras, neutral.
- **Geist Mono** para código: distingue `0/O`, `1/l/I` y los signos `;` `{}` `()` que confunden a principiantes.

| Estilo | Tamaño / interlineado | Peso | Uso |
|---|---|---|---|
| Display | 32/40 (24/32 móvil) | 600 | Título de página |
| Title | 20/28 | 600 | Título de sección |
| Body-lg | 17/28 | 400 | Explicaciones de lección |
| Body | 15/24 | 400 | Texto general |
| Small | 13/20 | 500 | Metadatos, etiquetas |
| Code | 14/24 mono | 400 | Bloques de código |

Las explicaciones de lección usan 17 px y un ancho máximo de ~68 caracteres para facilitar la lectura.

## 4. Espaciado, radios y elevación

- Escala de 4 px (`1 = 4px`). Separación entre secciones: 40–48 px. Dentro de un bloque: 12–16 px.
- Radios: 8 px (controles), 12 px (paneles), 999 px (insignias y barras de progreso).
- Elevación: un solo nivel de sombra para elementos superpuestos (hojas inferiores). El resto, plano con borde.

## 5. Iconografía

- **Lucide** (trazo 1.75–2 px, rejilla de 24). Un único set en toda la app.
- Tamaños: 16 (en línea), 20 (navegación), 24 (estados destacados).
- Prohibido usar emojis como iconos.

## 6. Componentes

| Componente | Ubicación | Notas |
|---|---|---|
| `Button` | `components/ui/button.tsx` | Variantes `primary`, `secondary`, `ghost`; tamaños `sm`, `md`, `lg`. Puede renderizarse como enlace. |
| `ProgressBar` | `components/ui/progress-bar.tsx` | Accesible (`role="progressbar"`). |
| `Badge` | `components/ui/badge.tsx` | Tonos `neutral`, `accent`, `info`, `warning`, `danger`. |
| `ProvenanceBadge` | `components/ui/provenance-badge.tsx` | «Temario oficial» / «Refuerzo · PHP Academy». |
| `DemoNotice` | `components/ui/demo-notice.tsx` | Marca obligatoria en cualquier dato ficticio. |
| `CodeBlock` | `components/code/code-block.tsx` | Resaltado PHP propio sin dependencias, números de línea, anotaciones por línea. |
| `PlannedFeature` | `components/ui/planned-feature.tsx` | Estado honesto de secciones no implementadas. |
| `AppShell` | `components/layout/` | Barra lateral ≥ 1024 px; barra inferior + hoja «Más» en móvil. |

## 7. Patrones de lección

- **Modo concentración:** sin navegación global. Barra superior con cerrar, progreso y fase actual.
- **Barra de acción inferior fija:** «Comprobar» → panel de feedback (verde/rojo con icono y explicación) → «Continuar».
- **Pistas:** botón «Pedir pista» que revela de una en una; cada pista usada reduce la XP del ejercicio.
- **Procedencia** visible en cada ejercicio.

## 8. Accesibilidad

- Foco visible: anillo de 2 px en `accent` con separación de 2 px.
- Enlace «Saltar al contenido».
- Objetivos táctiles ≥ 44 px en móvil.
- `aria-live` para el feedback de ejercicios.
- Opciones de test como radios nativos; huecos de código como `<input>` con etiqueta.
- `prefers-reduced-motion`: se eliminan transiciones de desplazamiento y escala.
