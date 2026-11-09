import type { Lesson } from "@/domain/curriculum";
import { output, php } from "../php-tag";

/**
 * Lección 5.2 — include_once y require_once
 * Contenido de PHP Academy basado en el índice del Tema 3. Ejercicios de refuerzo.
 */

const funciones = {
  name: "funciones.php",
  code: php`
    <?php
    function separador() {
        echo "----------\n";
    }
  `,
};

const menu = {
  name: "menu.php",
  code: php`
    <?php
    require_once "funciones.php";

    function mostrarMenu() {
        separador();
        echo "1. Jugar\n";
        separador();
    }
  `,
};

export const includeOnceRequireOnce: Lesson = {
  id: "t3-include-once-require-once",
  code: "5.2",
  title: "include_once y require_once",
  summary: "Por qué incluir dos veces un archivo de funciones da error y cómo evitarlo.",
  objectives: [
    "Explicar por qué incluir dos veces un archivo de funciones produce un error.",
    "Usar `include_once` y `require_once`.",
    "Elegir la variante adecuada en cada caso.",
  ],
  prerequisites: ["t3-include-require"],
  concepts: ["include-once"],
  estimatedMinutes: 10,
  contentStatus: "ready",
  keyIdeas: [
    "Una función no se puede declarar dos veces: incluir dos veces su archivo es un error fatal.",
    "`include_once` y `require_once` recuerdan qué archivos ya se incluyeron y no los repiten.",
    "Para archivos de funciones, lo más seguro es `require_once`.",
  ],
  steps: [
    {
      id: "explicacion-1",
      kind: "explanation",
      phase: "explanation",
      title: "El problema de incluir dos veces",
      body: [
        "En proyectos con varios archivos es fácil que un mismo archivo de funciones se incluya dos veces: por ejemplo, `index.php` lo incluye y también lo incluye otro archivo que `index.php` usa.",
        "Si eso pasa con `include` o `require`, PHP intenta declarar otra vez las mismas funciones. Como una función no puede existir dos veces, el programa se detiene con un error fatal que dice que la función ya estaba declarada.",
      ],
      codeCaption: "index.php — error: separador() se declararía dos veces",
      code: php`
        <?php
        require "funciones.php";
        require "funciones.php";
      `,
      keyIdea: "Dos inclusiones del mismo archivo de funciones = la misma función declarada dos veces = error.",
    },
    {
      id: "explicacion-2",
      kind: "explanation",
      phase: "explanation",
      title: "Las variantes _once",
      body: [
        "`include_once` y `require_once` funcionan igual que `include` y `require`, con una diferencia: **recuerdan** qué archivos se han incluido ya. Si les pides uno que ya está incluido, no hacen nada.",
        "Mantienen la diferencia que ya conoces:",
      ],
      points: [
        "**`include_once`:** si falta el archivo, avisa y sigue.",
        "**`require_once`:** si falta el archivo, error fatal y se detiene.",
      ],
      keyIdea: "Para archivos de funciones, usa `require_once`: imprescindible y sin riesgo de duplicarse.",
    },
    {
      id: "ejemplo",
      kind: "example",
      phase: "example",
      title: "Dos archivos que necesitan el mismo",
      intro:
        "`menu.php` necesita las funciones de `funciones.php`, y `index.php` también. Gracias a `require_once`, `funciones.php` solo se incluye una vez.",
      otherFiles: [funciones, menu],
      fileName: "index.php",
      code: php`
        <?php
        require_once "funciones.php";
        require_once "menu.php";

        mostrarMenu();
        separador();
      `,
      annotations: [
        { line: 2, text: "Primera inclusión de `funciones.php`: se declara `separador`." },
        {
          line: 3,
          text: "`menu.php` pide otra vez `funciones.php` con `require_once`. Como ya está incluido, se omite y no hay error.",
        },
        { line: 5, text: "`mostrarMenu` (de `menu.php`) usa `separador` (de `funciones.php`)." },
        { line: 6, text: "`index.php` también puede usar `separador` directamente." },
      ],
      expectedOutput: output("----------", "1. Jugar", "----------", "----------"),
    },
    {
      id: "comprobacion-1",
      kind: "choice",
      phase: "check",
      provenance: "reinforcement",
      concepts: ["include-once"],
      prompt: "¿Qué ocurre si incluyes dos veces con `require` un archivo que define una función?",
      options: [
        {
          id: "a",
          label: "Error fatal: la función ya estaba declarada",
          correct: true,
          feedback: "Correcto.",
        },
        {
          id: "b",
          label: "Nada: PHP ignora la segunda inclusión",
          feedback: "Eso solo lo hacen las variantes `_once`. Con `require` se intenta declarar la función otra vez.",
          misconceptionId: "double-include",
        },
        {
          id: "c",
          label: "La función se ejecuta dos veces",
          feedback: "Incluir un archivo define sus funciones; no las ejecuta.",
          misconceptionId: "define-runs-function",
        },
        {
          id: "d",
          label: "La segunda versión sustituye a la primera",
          feedback: "PHP no permite redefinir funciones: produce un error.",
          misconceptionId: "double-include",
        },
      ],
      hints: [
        "¿Puede existir dos veces una función con el mismo nombre?",
        "Repasa la primera explicación.",
        "`require` no recuerda lo que ya incluyó.",
      ],
      explanation: "Declarar dos veces la misma función es un error fatal.",
    },
    {
      id: "comprobacion-2",
      kind: "choice",
      phase: "check",
      provenance: "reinforcement",
      concepts: ["include-once", "include-require"],
      prompt: "¿Qué instrucción detiene el programa si el archivo no existe y además evita incluirlo dos veces?",
      options: [
        { id: "a", label: "require_once", isCode: true, correct: true, feedback: "Correcto." },
        {
          id: "b",
          label: "include_once",
          isCode: true,
          feedback: "Evita duplicados, pero si falta el archivo solo avisa y sigue.",
          misconceptionId: "include-vs-require",
        },
        {
          id: "c",
          label: "require",
          isCode: true,
          feedback: "Se detiene si falta, pero no evita incluirlo dos veces.",
          misconceptionId: "double-include",
        },
        {
          id: "d",
          label: "include",
          isCode: true,
          feedback: "No cumple ninguna de las dos condiciones.",
        },
      ],
      hints: [
        "Necesitas las dos propiedades a la vez.",
        "«Detenerse si falta» es cosa de `require`. «No repetir» es cosa de `_once`.",
        "Junta las dos.",
      ],
      explanation: "`require_once` = se detiene si falta + no repite.",
    },
    {
      id: "guiado",
      kind: "fill",
      phase: "guided",
      provenance: "reinforcement",
      concepts: ["include-once"],
      prompt:
        "Completa `index.php` con la forma recomendada para archivos de funciones: que el programa se detenga si falta alguno y que nunca se incluyan dos veces.",
      context: [funciones, menu],
      template: php`
        <?php
        [[b1]] "funciones.php";
        [[b2]] "menu.php";

        mostrarMenu();
      `,
      blanks: [
        {
          id: "b1",
          label: "Hueco 1: inclusión de funciones.php",
          accept: ["require_once"],
          wrong: [
            {
              match: ["require", "include"],
              feedback:
                "Aquí funcionaría, porque `menu.php` usa `require_once` y PHP recuerda que ya se incluyó. Pero si otro archivo lo pidiera después con `require`, se declararía dos veces. La forma segura lleva `_once`.",
              misconceptionId: "double-include",
            },
            {
              match: ["include_once"],
              feedback: "Evitaría el duplicado, pero si faltara el archivo el programa seguiría sin funciones.",
              misconceptionId: "include-vs-require",
            },
          ],
        },
        {
          id: "b2",
          label: "Hueco 2: inclusión de menu.php",
          accept: ["require_once"],
          wrong: [
            {
              match: ["include_once", "include"],
              feedback: "El archivo es imprescindible: si falta, el programa debe detenerse.",
              misconceptionId: "include-vs-require",
            },
          ],
        },
      ],
      hints: [
        "Los dos archivos son imprescindibles: eso descarta `include`.",
        "`funciones.php` se pediría dos veces: hace falta la variante que no repite.",
        "Los dos huecos son la misma instrucción.",
      ],
      explanation: "Con `require_once` en los dos, nada falta y nada se duplica.",
    },
    {
      id: "autonomo",
      kind: "order",
      phase: "practice",
      provenance: "reinforcement",
      concepts: ["include-once"],
      prompt:
        "Construye `index.php` para obtener la salida esperada. Incluye primero `funciones.php` y después `menu.php`. Una línea sobra.",
      context: [funciones, menu],
      expectedOutput: output("----------", "1. Jugar", "----------"),
      lines: [
        { id: "l1", text: "<?php" },
        { id: "l2", text: 'require_once "funciones.php";' },
        { id: "l3", text: 'require_once "menu.php";' },
        { id: "l4", text: "mostrarMenu();" },
        {
          id: "d1",
          text: "require_once funciones.php;",
          distractor: true,
          feedback: "El nombre del archivo es un texto y va entre comillas.",
          misconceptionId: "file-name-without-quotes",
        },
      ],
      solution: ["l1", "l2", "l3", "l4"],
      hints: [
        "Las inclusiones van antes de usar las funciones.",
        "Usa siempre la variante `_once` para los archivos de funciones.",
        "Orden: `<?php`, los dos `require_once` y la llamada.",
      ],
      explanation: "Inclusiones seguras primero y la llamada al final.",
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
        concepts: ["include-once"],
        prompt: "¿Qué hace `require_once` si el archivo ya se incluyó antes?",
        options: [
          { id: "a", label: "No lo vuelve a incluir", correct: true, feedback: "Correcto." },
          {
            id: "b",
            label: "Lo incluye otra vez",
            feedback: "Eso haría `require`. La variante `_once` no repite.",
            misconceptionId: "double-include",
          },
          { id: "c", label: "Detiene el programa", feedback: "Solo se detiene si el archivo no existe." },
          { id: "d", label: "Muestra un aviso", feedback: "Simplemente lo omite, sin avisar." },
        ],
        hints: [],
        explanation: "`_once` = una sola vez.",
      },
      {
        id: "dominio-2",
        kind: "choice",
        phase: "mastery",
        provenance: "reinforcement",
        concepts: ["include-once"],
        prompt: "`saludo.php` define `saludo()`, que muestra «Hola». ¿Qué muestra este programa?",
        context: [
          {
            name: "saludo.php",
            code: php`
              <?php
              function saludo() {
                  echo "Hola\n";
              }
            `,
          },
        ],
        code: php`
          <?php
          include_once "saludo.php";
          include_once "saludo.php";
          saludo();
        `,
        options: [
          { id: "a", label: "Hola", isCode: true, correct: true, feedback: "Correcto." },
          {
            id: "b",
            label: "Un error porque la función se declara dos veces",
            feedback: "Con `include_once`, la segunda inclusión se omite.",
            misconceptionId: "double-include",
          },
          {
            id: "c",
            label: output("Hola", "Hola"),
            isCode: true,
            feedback: "Incluir no llama a la función; solo hay una llamada.",
            misconceptionId: "define-runs-function",
          },
          { id: "d", label: "Nada", feedback: "La línea 4 llama a `saludo()`." },
        ],
        hints: [],
        explanation: "Se incluye una vez y se llama una vez.",
      },
      {
        id: "dominio-3",
        kind: "choice",
        phase: "mastery",
        provenance: "reinforcement",
        concepts: ["include-once"],
        prompt: "Varios archivos de un proyecto necesitan `funciones.php`. ¿Qué es lo más seguro?",
        options: [
          {
            id: "a",
            label: "Usar `require_once \"funciones.php\";` en todos ellos",
            correct: true,
            feedback: "Correcto.",
          },
          {
            id: "b",
            label: "Usar `require \"funciones.php\";` en todos ellos",
            feedback: "Se acabaría incluyendo dos veces y daría error.",
            misconceptionId: "double-include",
          },
          {
            id: "c",
            label: "Copiar las funciones en cada archivo",
            feedback: "Volverías a tener código repetido, y además las funciones se declararían varias veces.",
          },
          {
            id: "d",
            label: "Incluirlo solo en uno y no usarlo en los demás",
            feedback: "Los demás también necesitan las funciones.",
          },
        ],
        hints: [],
        explanation: "`require_once` en cada archivo que lo necesite.",
      },
      {
        id: "dominio-4",
        kind: "fill",
        phase: "mastery",
        provenance: "reinforcement",
        concepts: ["include-once"],
        prompt: "Incluye `datos.php` de forma que, si falta, el programa siga, y que nunca se incluya dos veces.",
        template: php`
          <?php
          [[b1]] "datos.php";
        `,
        blanks: [
          {
            id: "b1",
            label: "Hueco 1: instrucción para incluir",
            accept: ["include_once"],
            wrong: [
              {
                match: ["require_once"],
                feedback: "`require_once` detendría el programa si faltara el archivo.",
                misconceptionId: "include-vs-require",
              },
              {
                match: ["include"],
                feedback: "`include` no evita incluirlo dos veces.",
                misconceptionId: "double-include",
              },
            ],
          },
        ],
        hints: [],
        explanation: "`include_once`: sigue si falta y no repite.",
      },
    ],
  },
};
