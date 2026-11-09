import type { Lesson } from "@/domain/curriculum";
import { output, php } from "../php-tag";

/**
 * Lección 2.1 — Funciones sin parámetros
 * Contenido de PHP Academy basado en el índice del Tema 3. Ejercicios de refuerzo.
 */
export const funcionesSinParametros: Lesson = {
  id: "t3-funciones-sin-parametros",
  code: "2.1",
  title: "Funciones sin parámetros",
  summary: "Funciones que siempre hacen lo mismo, cómo elegir buenos nombres y funciones que llaman a otras.",
  objectives: [
    "Definir funciones sin parámetros con varias instrucciones.",
    "Elegir nombres de función válidos y descriptivos.",
    "Llamar a una función desde dentro de otra.",
  ],
  prerequisites: ["t3-beneficios-modularizar"],
  concepts: ["function-definition", "function-call"],
  estimatedMinutes: 10,
  contentStatus: "ready",
  keyIdeas: [
    "Una función sin parámetros hace exactamente lo mismo cada vez que la llamas.",
    "Los nombres de función usan letras, números y `_`, no empiezan por número y no llevan espacios ni guiones.",
    "Una función puede llamar a otra: así se construyen piezas grandes con piezas pequeñas.",
  ],
  steps: [
    {
      id: "explicacion-1",
      kind: "explanation",
      phase: "explanation",
      title: "Funciones que siempre hacen lo mismo",
      body: [
        "Las funciones que has visto hasta ahora tienen los paréntesis vacíos: son **funciones sin parámetros**. No reciben ningún dato, así que cada llamada hace exactamente lo mismo.",
        "Son perfectas para tareas fijas: mostrar un menú, una cabecera, una línea separadora o unas instrucciones.",
        "Su cuerpo puede tener tantas instrucciones como necesites. Todas se ejecutan, en orden, cada vez que llamas a la función.",
      ],
      codeCaption: "Una función con varias instrucciones",
      code: php`
        <?php
        function mostrarInstrucciones() {
            echo "Bienvenido al juego\n";
            echo "Adivina el número del 1 al 10\n";
            echo "Tienes 3 intentos\n";
        }

        mostrarInstrucciones();
      `,
      keyIdea: "Sin parámetros, la función no recibe datos: siempre hace lo mismo.",
    },
    {
      id: "explicacion-2",
      kind: "explanation",
      phase: "explanation",
      title: "Cómo elegir un buen nombre",
      body: [
        "El nombre de una función tiene que cumplir unas reglas y, además, conviene que explique lo que hace.",
      ],
      points: [
        "**Caracteres permitidos:** letras, números y guion bajo `_`.",
        "**No puede empezar por un número:** `2menu` no es válido.",
        "**Sin espacios ni guiones:** `mostrar menu` y `mostrar-menu` dan error. PHP leería el guion como una resta.",
        "**Convención:** empieza por un verbo y une las palabras con mayúsculas (camelCase): `mostrarMenu`, `imprimirLinea`.",
        "**Mejor sin tildes ni ñ:** PHP las admite, pero pueden dar problemas al compartir código.",
      ],
      keyIdea: "Un buen nombre es válido y dice qué hace la función: `mostrarMenu()` se entiende sin leer su cuerpo.",
    },
    {
      id: "ejemplo",
      kind: "example",
      phase: "example",
      title: "Una función que llama a otra",
      intro:
        "Dentro del cuerpo de una función puedes llamar a otra función. Aquí `mostrarTitulo` usa `mostrarLinea` dos veces.",
      code: php`
        <?php
        function mostrarLinea() {
            echo "----------------\n";
        }

        function mostrarTitulo() {
            mostrarLinea();
            echo "  MENÚ PRINCIPAL\n";
            mostrarLinea();
        }

        mostrarTitulo();
        echo "1. Nueva partida\n";
        echo "2. Salir\n";
      `,
      annotations: [
        { line: 2, text: "Primera función: solo dibuja una línea." },
        { line: 6, text: "Segunda función: construye un título usando la primera." },
        { line: 7, text: "Llamada a `mostrarLinea` desde dentro de `mostrarTitulo`." },
        { line: 9, text: "Otra llamada a la misma función: se reutiliza la línea." },
        {
          line: 12,
          text: "El programa empieza a ejecutarse aquí. Al llamar a `mostrarTitulo` se ejecutan sus tres instrucciones, incluidas las dos llamadas a `mostrarLinea`.",
        },
        { line: 13, text: "Cuando `mostrarTitulo` termina, el programa sigue con las opciones del menú." },
      ],
      expectedOutput: output(
        "----------------",
        "  MENÚ PRINCIPAL",
        "----------------",
        "1. Nueva partida",
        "2. Salir",
      ),
    },
    {
      id: "comprobacion-1",
      kind: "choice",
      phase: "check",
      provenance: "reinforcement",
      concepts: ["function-definition"],
      prompt: "¿Cuál de estos nombres es válido para una función?",
      options: [
        {
          id: "a",
          label: "mostrar-menu",
          isCode: true,
          feedback: "El guion no está permitido: PHP lo leería como una resta entre `mostrar` y `menu`.",
          misconceptionId: "invalid-function-name",
        },
        {
          id: "b",
          label: "2menu",
          isCode: true,
          feedback: "Un nombre de función no puede empezar por un número.",
          misconceptionId: "invalid-function-name",
        },
        { id: "c", label: "mostrarMenu", isCode: true, correct: true, feedback: "Correcto: es válido y descriptivo." },
        {
          id: "d",
          label: "mostrar menu",
          isCode: true,
          feedback: "Los espacios no están permitidos en los nombres.",
          misconceptionId: "invalid-function-name",
        },
      ],
      hints: [
        "Repasa las reglas de los nombres: qué caracteres se permiten y cómo pueden empezar.",
        "Descarta los que tienen espacios, guiones o empiezan por un número.",
        "Solo uno usa únicamente letras y empieza por una letra.",
      ],
      explanation: "Solo letras, números y `_`, sin empezar por número.",
    },
    {
      id: "comprobacion-2",
      kind: "choice",
      phase: "check",
      provenance: "reinforcement",
      concepts: ["function-call", "execution-flow"],
      prompt: "¿Qué muestra este programa?",
      code: php`
        <?php
        function a() {
            echo "A\n";
        }

        function b() {
            a();
            echo "B\n";
        }

        b();
      `,
      options: [
        { id: "a", label: output("A", "B"), isCode: true, correct: true, feedback: "Correcto." },
        {
          id: "b",
          label: output("B", "A"),
          isCode: true,
          feedback: "Dentro de `b`, la primera instrucción es la llamada a `a()`, así que «A» se muestra antes que «B».",
          misconceptionId: "execution-order",
        },
        {
          id: "c",
          label: "B",
          isCode: true,
          feedback: "La llamada `a();` dentro de `b` también se ejecuta y muestra «A».",
          misconceptionId: "calls-count",
        },
        {
          id: "d",
          label: output("A", "B", "A"),
          isCode: true,
          feedback: "`a` se llama una sola vez: desde dentro de `b`. Definirla no la ejecuta.",
          misconceptionId: "define-runs-function",
        },
      ],
      hints: [
        "Solo hay una llamada fuera de las funciones. Empieza por ella.",
        "Entra en el cuerpo de `b` y ejecuta sus instrucciones en orden.",
        "La primera instrucción de `b` es `a();`.",
      ],
      explanation: "`b()` llama primero a `a()` (muestra A) y después muestra B.",
    },
    {
      id: "guiado",
      kind: "fill",
      phase: "guided",
      provenance: "reinforcement",
      concepts: ["function-definition"],
      prompt: "Completa la definición de `mostrarAyuda`, que muestra dos líneas de ayuda.",
      template: php`
        <?php
        [[b1]] mostrarAyuda() {
            echo "Escribe un número del 1 al 3\n";
            echo "Pulsa 0 para salir\n";
        [[b2]]

        mostrarAyuda();
      `,
      blanks: [
        {
          id: "b1",
          label: "Hueco 1: palabra con la que empieza la definición",
          accept: ["function"],
          wrong: [
            {
              match: ["def", "func", "fun", "funcion", "función"],
              feedback: "La definición empieza por la palabra reservada completa en inglés.",
              misconceptionId: "function-keyword",
            },
          ],
        },
        {
          id: "b2",
          label: "Hueco 2: símbolo que cierra el cuerpo",
          accept: ["}"],
          wrong: [
            { match: ["{"], feedback: "La llave de apertura ya está en la línea 2. Aquí hay que cerrar el cuerpo." },
            { match: [")", "]"], feedback: "El cuerpo de una función se encierra entre llaves." },
          ],
        },
      ],
      hints: [
        "Una definición tiene palabra reservada, nombre, paréntesis y un cuerpo entre llaves.",
        "El cuerpo se abrió en la línea 2. ¿Qué falta en la línea 5?",
        "El primer hueco es la palabra reservada de siempre; el segundo, la pareja de `{`.",
      ],
      explanation: "`function` abre la definición y `}` cierra el cuerpo después de las dos instrucciones.",
    },
    {
      id: "autonomo",
      kind: "order",
      phase: "practice",
      provenance: "reinforcement",
      concepts: ["function-definition", "function-call"],
      prompt:
        "Construye un programa con dos funciones: `mostrarLinea` dibuja la línea y `mostrarCabecera` la usa. Define primero `mostrarLinea`, después `mostrarCabecera` y al final llama a `mostrarCabecera`. Una línea sobra.",
      expectedOutput: output("==========", "  NOTAS"),
      lines: [
        { id: "l1", text: "<?php" },
        { id: "l2", text: "function mostrarLinea() {" },
        { id: "l3", text: String.raw`    echo "==========\n";` },
        { id: "l4", text: "}" },
        { id: "l5", text: "function mostrarCabecera() {" },
        { id: "l6", text: "    mostrarLinea();" },
        { id: "l7", text: String.raw`    echo "  NOTAS\n";` },
        { id: "l8", text: "}" },
        { id: "l9", text: "mostrarCabecera();" },
        {
          id: "d1",
          text: "function mostrar Cabecera() {",
          distractor: true,
          feedback: "Ese nombre tiene un espacio, y los nombres de función no pueden llevar espacios.",
          misconceptionId: "invalid-function-name",
        },
      ],
      solution: ["l1", "l2", "l3", "l4", "l5", "l6", "l7", "l8", "l9"],
      hints: [
        "Empieza por `<?php` y la definición completa de `mostrarLinea`.",
        "Mira la salida: primero la línea y luego «NOTAS». Ese es el orden dentro de `mostrarCabecera`.",
        "La única línea sin sangría que no es definición es la llamada final.",
      ],
      explanation:
        "`mostrarCabecera` llama a `mostrarLinea` y después muestra el texto: la salida coincide con la esperada.",
    },
  ],
  mastery: {
    passingScore: 0.75,
    questions: [
      {
        id: "dominio-1",
        kind: "choice",
        phase: "mastery",
        provenance: "reinforcement",
        concepts: ["function-call"],
        prompt: "¿Qué tienen en común todas las llamadas a una misma función sin parámetros?",
        options: [
          { id: "a", label: "Hacen siempre exactamente lo mismo", correct: true, feedback: "Correcto." },
          {
            id: "b",
            label: "Cada llamada muestra un resultado distinto al azar",
            feedback: "Sin parámetros no recibe datos distintos, así que su comportamiento no cambia.",
          },
          {
            id: "c",
            label: "Solo la primera llamada hace algo",
            feedback: "Cada llamada ejecuta el cuerpo entero.",
            misconceptionId: "calls-count",
          },
          {
            id: "d",
            label: "Tienen que estar en líneas seguidas",
            feedback: "Puedes llamar a la función en cualquier parte del programa.",
          },
        ],
        hints: [],
        explanation: "Sin datos de entrada, el resultado es siempre el mismo.",
      },
      {
        id: "dominio-2",
        kind: "choice",
        phase: "mastery",
        provenance: "reinforcement",
        concepts: ["function-definition"],
        prompt: "¿Qué nombre de función es válido y sigue la convención?",
        options: [
          {
            id: "a",
            label: "calcular media",
            isCode: true,
            feedback: "Los espacios no están permitidos.",
            misconceptionId: "invalid-function-name",
          },
          { id: "b", label: "calcularMedia", isCode: true, correct: true, feedback: "Correcto." },
          {
            id: "c",
            label: "calcular-media",
            isCode: true,
            feedback: "El guion no está permitido: PHP lo leería como una resta.",
            misconceptionId: "invalid-function-name",
          },
          {
            id: "d",
            label: "1calcular",
            isCode: true,
            feedback: "No puede empezar por un número.",
            misconceptionId: "invalid-function-name",
          },
        ],
        hints: [],
        explanation: "Verbo, camelCase y solo letras.",
      },
      {
        id: "dominio-3",
        kind: "choice",
        phase: "mastery",
        provenance: "reinforcement",
        concepts: ["function-call", "execution-flow"],
        prompt: "¿Qué muestra este programa?",
        code: php`
          <?php
          function x() {
              echo "1\n";
          }

          function y() {
              echo "2\n";
              x();
          }

          y();
          x();
        `,
        options: [
          { id: "a", label: output("2", "1", "1"), isCode: true, correct: true, feedback: "Correcto." },
          {
            id: "b",
            label: output("1", "2", "1"),
            isCode: true,
            feedback: "Lo primero que se ejecuta es `y()`, que muestra «2» antes de llamar a `x()`.",
            misconceptionId: "execution-order",
          },
          {
            id: "c",
            label: output("2", "1"),
            isCode: true,
            feedback: "Falta la última llamada: `x();` en la línea 12 muestra otro «1».",
            misconceptionId: "calls-count",
          },
          {
            id: "d",
            label: output("2", "1", "2"),
            isCode: true,
            feedback: "La última llamada es a `x()`, que muestra «1», no «2».",
            misconceptionId: "calls-count",
          },
        ],
        hints: [],
        explanation: "`y()` muestra 2 y llama a `x()` (1); después `x()` muestra otro 1.",
      },
      {
        id: "dominio-4",
        kind: "fill",
        phase: "mastery",
        provenance: "reinforcement",
        concepts: ["function-call"],
        prompt: "Completa `bienvenida` para que primero llame a `saludo` y luego muestre su mensaje.",
        template: php`
          <?php
          function saludo() {
              echo "Hola\n";
          }

          function bienvenida() {
              [[b1]];
              echo "Bienvenido al curso\n";
          }

          bienvenida();
        `,
        blanks: [
          {
            id: "b1",
            label: "Hueco 1: llamada a la función saludo",
            accept: ["saludo()", "saludo();"],
            wrong: [
              {
                match: ["saludo"],
                feedback: "Faltan los paréntesis para que la función se ejecute.",
                misconceptionId: "call-without-parentheses",
              },
            ],
          },
        ],
        hints: [],
        explanation: "`saludo();` dentro de `bienvenida` ejecuta el saludo primero.",
      },
    ],
  },
};
