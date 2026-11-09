import type { Lesson } from "@/domain/curriculum";
import { output, php } from "../php-tag";

/**
 * Lección 1.1 — ¿Qué es una función?
 * Explicaciones y ejercicios escritos por PHP Academy, basados en el temario del Tema 3.
 * Todos los ejercicios son de refuerzo (no proceden del documento original).
 */
export const queEsUnaFuncion: Lesson = {
  id: "t3-que-es-una-funcion",
  code: "1.1",
  title: "¿Qué es una función?",
  summary: "Qué es una función y la diferencia entre definirla y llamarla.",
  objectives: [
    "Explicar con tus palabras qué es una función.",
    "Distinguir entre definir una función y llamarla.",
    "Escribir y llamar una función sencilla.",
  ],
  prerequisites: [],
  concepts: ["function-concept", "function-definition", "function-call"],
  estimatedMinutes: 10,
  contentStatus: "ready",
  keyIdeas: [
    "Una función es un bloque de código con nombre que puedes ejecutar cuando quieras.",
    "Definir (`function nombre() { … }`) no ejecuta nada: solo guarda las instrucciones.",
    "Llamar (`nombre();`) ejecuta el cuerpo de la función, una vez por cada llamada.",
  ],
  steps: [
    {
      id: "explicacion-1",
      kind: "explanation",
      phase: "explanation",
      title: "Una función es un bloque de código con nombre",
      body: [
        "Hasta ahora tus programas se ejecutaban de arriba abajo, línea a línea. Si necesitabas repetir algo, lo volvías a escribir.",
        "Una **función** es un bloque de instrucciones al que le pones un nombre. Lo escribes una vez y lo puedes usar tantas veces como quieras con solo decir su nombre.",
        "Piensa en una receta de cocina: la apuntas una vez en tu libreta (eso es **definir** la función) y la preparas cada vez que te apetece (eso es **llamar** a la función).",
        "De hecho, ya existen muchas funciones: PHP trae cientos preparadas. Por ejemplo, `strlen(\"Hola\")` cuenta los caracteres de un texto. Ahora vas a aprender a crear las tuyas.",
      ],
      codeCaption: "Una función que muestra un saludo",
      code: php`
        <?php
        function saludar() {
            echo "Hola\n";
        }
      `,
      keyIdea: "Definir una función no la ejecuta: solo la guarda con un nombre para usarla después.",
    },
    {
      id: "explicacion-2",
      kind: "explanation",
      phase: "explanation",
      title: "Definir y llamar: dos momentos distintos",
      body: [
        "Para **definir** una función escribes la palabra `function`, el nombre que quieras darle, unos paréntesis `()` y, entre llaves `{ }`, las instrucciones que debe ejecutar. Ese bloque entre llaves se llama **cuerpo**.",
        "Para **llamar** a la función, es decir, para ejecutarla, escribes su nombre seguido de paréntesis y punto y coma: `saludar();`.",
        "Los paréntesis son obligatorios en los dos casos, aunque de momento estén vacíos. Más adelante pondrás datos dentro de ellos.",
      ],
      codeCaption: "Definición y llamada",
      code: php`
        <?php
        // Definición: se guarda, no se ejecuta
        function saludar() {
            echo "Hola\n";
        }

        // Llamada: ahora sí se ejecuta
        saludar();
      `,
      keyIdea: "`function saludar() { … }` define. `saludar();` ejecuta.",
    },
    {
      id: "ejemplo",
      kind: "example",
      phase: "example",
      title: "Una función, dos llamadas",
      intro: "Lee el programa línea a línea. Cada explicación indica a qué línea se refiere.",
      code: php`
        <?php
        function saludar() {
            echo "Hola, bienvenido a PHP Academy\n";
        }

        saludar();
        saludar();
      `,
      annotations: [
        { line: 1, text: "`<?php` indica que empieza el código PHP." },
        {
          line: 2,
          text: "`function` avisa a PHP de que vas a definir una función. Después va su nombre, `saludar`, y unos paréntesis vacíos. La llave `{` abre el cuerpo.",
        },
        {
          line: 3,
          text: "El cuerpo: lo que se ejecutará cada vez que llames a la función. `\\n` es un salto de línea.",
        },
        { line: 4, text: "La llave `}` cierra el cuerpo. Hasta aquí, PHP todavía no ha mostrado nada." },
        { line: 6, text: "Primera llamada: PHP ejecuta el cuerpo de `saludar` y muestra el mensaje." },
        {
          line: 7,
          text: "Segunda llamada: el cuerpo se ejecuta otra vez. Has escrito el mensaje una sola vez y lo has usado dos.",
        },
      ],
      expectedOutput: output("Hola, bienvenido a PHP Academy", "Hola, bienvenido a PHP Academy"),
    },
    {
      id: "comprobacion-1",
      kind: "choice",
      phase: "check",
      provenance: "reinforcement",
      concepts: ["function-definition", "function-call"],
      prompt: "¿Qué muestra este programa?",
      code: php`
        <?php
        function despedir() {
            echo "Adiós\n";
        }
      `,
      options: [
        {
          id: "a",
          label: "Adiós",
          isCode: true,
          feedback:
            "No exactamente. La función está definida, pero nadie la llama. Sin una llamada como `despedir();`, su cuerpo no se ejecuta.",
          misconceptionId: "define-runs-function",
        },
        {
          id: "b",
          label: "Nada: la función está definida, pero no se llama",
          correct: true,
          feedback: "¡Exacto!",
        },
        {
          id: "c",
          label: "Un error, porque falta la llamada",
          feedback:
            "Definir una función sin llamarla es válido: PHP no da ningún error, simplemente no ejecuta su cuerpo.",
        },
        {
          id: "d",
          label: "despedir",
          isCode: true,
          feedback:
            "PHP no muestra el nombre de las funciones. Y aquí, además, la función no se llama, así que no se ejecuta nada.",
          misconceptionId: "define-runs-function",
        },
      ],
      hints: [
        "Recuerda la diferencia entre definir y llamar.",
        "Busca una línea, fuera de las llaves, con el nombre de la función seguido de `();`.",
        "Si no hay ninguna llamada, ¿llega a ejecutarse el `echo`?",
      ],
      explanation: "Definir solo guarda las instrucciones. Para que se ejecuten hace falta una llamada.",
    },
    {
      id: "comprobacion-2",
      kind: "choice",
      phase: "check",
      provenance: "reinforcement",
      concepts: ["function-call"],
      prompt: "¿Cuál de estas líneas llama a la función `saludar`?",
      options: [
        {
          id: "a",
          label: "function saludar() {",
          isCode: true,
          feedback: "Esa línea define la función: empieza por `function` y abre el cuerpo con `{`.",
          misconceptionId: "call-vs-definition",
        },
        { id: "b", label: "saludar();", isCode: true, correct: true, feedback: "Correcto." },
        {
          id: "c",
          label: "saludar;",
          isCode: true,
          feedback: "Le faltan los paréntesis. Sin `()` PHP no ejecuta la función y muestra un error.",
          misconceptionId: "call-without-parentheses",
        },
        {
          id: "d",
          label: "echo saludar;",
          isCode: true,
          feedback:
            "`echo` muestra un valor, pero no ejecuta la función. Además, a `saludar` le faltan los paréntesis.",
          misconceptionId: "call-without-parentheses",
        },
      ],
      hints: [
        "Una llamada ejecuta la función. ¿Cómo se ejecutaba `saludar` en el ejemplo?",
        "Mira las líneas 6 y 7 del ejemplo anterior.",
        "La llamada no empieza por `function` y siempre lleva paréntesis.",
      ],
      explanation: "Una llamada es el nombre de la función seguido de `()` y `;`.",
    },
    {
      id: "guiado",
      kind: "fill",
      phase: "guided",
      provenance: "reinforcement",
      concepts: ["function-definition", "function-call"],
      prompt: "Completa el programa para que defina la función `despedirse` y después la llame.",
      template: php`
        <?php
        [[b1]] despedirse() {
            echo "Hasta mañana\n";
        }

        despedirse[[b2]];
      `,
      blanks: [
        {
          id: "b1",
          label: "Hueco 1: palabra con la que empieza la definición",
          accept: ["function"],
          wrong: [
            {
              match: ["def"],
              feedback: "`def` es la palabra que usa Python. En PHP la definición empieza por otra palabra.",
              misconceptionId: "function-keyword",
            },
            {
              match: ["func", "fun", "funcion", "función"],
              feedback: "Casi. PHP necesita la palabra reservada completa y en inglés.",
              misconceptionId: "function-keyword",
            },
          ],
        },
        {
          id: "b2",
          label: "Hueco 2: lo que va tras el nombre para llamarla",
          accept: ["()", "();"],
          wrong: [
            {
              match: ["{}"],
              feedback: "Las llaves se usan para el cuerpo de la definición. Para llamar a una función se usan paréntesis.",
              misconceptionId: "call-vs-definition",
            },
          ],
        },
      ],
      hints: [
        "La definición de una función siempre empieza con la misma palabra reservada.",
        "Para el segundo hueco, fíjate en cómo se llamaba a `saludar` en el ejemplo (líneas 6 y 7).",
        "El primer hueco es la primera palabra de la línea 2 del ejemplo. El segundo son solo dos caracteres.",
      ],
      explanation:
        "`function` inicia la definición y los paréntesis tras el nombre ejecutan la función. El programa muestra «Hasta mañana».",
    },
    {
      id: "autonomo",
      kind: "order",
      phase: "practice",
      provenance: "reinforcement",
      concepts: ["function-definition", "function-call", "execution-flow"],
      prompt:
        "Construye un programa que defina la función `mostrarMenu` y después la llame, para obtener la salida esperada. Escribe primero la definición y después la llamada. Una de las líneas sobra.",
      expectedOutput: output("1. Jugar", "2. Salir", "Elige una opción"),
      lines: [
        { id: "l1", text: "<?php" },
        { id: "l2", text: "function mostrarMenu() {" },
        { id: "l3", text: String.raw`    echo "1. Jugar\n";` },
        { id: "l4", text: String.raw`    echo "2. Salir\n";` },
        { id: "l5", text: "}" },
        { id: "l6", text: "mostrarMenu();" },
        { id: "l7", text: String.raw`echo "Elige una opción\n";` },
        {
          id: "d1",
          text: "mostrarMenu;",
          distractor: true,
          feedback:
            "`mostrarMenu;` no llama a la función: le faltan los paréntesis. La llamada correcta es otra de las líneas.",
          misconceptionId: "call-without-parentheses",
        },
      ],
      solution: ["l1", "l2", "l3", "l4", "l5", "l6", "l7"],
      hints: [
        "Un programa PHP siempre empieza igual.",
        "Primero va la definición completa: la línea con `function`, las instrucciones de su cuerpo y la llave de cierre. Después, la llamada.",
        "Mira la salida esperada: «Elige una opción» aparece al final, así que su `echo` va después de la llamada.",
      ],
      explanation:
        "Definición completa arriba, llamada después y, por último, el `echo` final. La salida coincide con la esperada.",
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
        concepts: ["function-definition", "function-call"],
        prompt: "¿Qué ocurre si defines una función pero nunca la llamas?",
        options: [
          { id: "a", label: "Su código no se ejecuta nunca", correct: true, feedback: "Correcto." },
          {
            id: "b",
            label: "Se ejecuta una vez al final del programa",
            feedback: "PHP no ejecuta una función por su cuenta. Solo se ejecuta cuando la llamas.",
            misconceptionId: "define-runs-function",
          },
          {
            id: "c",
            label: "PHP muestra un error",
            feedback: "No es un error. Puedes definir funciones y no usarlas; simplemente no se ejecutan.",
          },
          {
            id: "d",
            label: "Se ejecuta en el momento de definirla",
            feedback: "Definir solo guarda las instrucciones; no las ejecuta.",
            misconceptionId: "define-runs-function",
          },
        ],
        hints: [],
        explanation: "Una función solo se ejecuta cuando la llamas.",
      },
      {
        id: "dominio-2",
        kind: "choice",
        phase: "mastery",
        provenance: "reinforcement",
        concepts: ["function-call", "execution-flow"],
        prompt: "¿Qué muestra este programa?",
        code: php`
          <?php
          function linea() {
              echo "---\n";
          }

          linea();
          echo "PHP\n";
          linea();
        `,
        options: [
          { id: "a", label: output("---", "PHP", "---"), isCode: true, correct: true, feedback: "Correcto." },
          {
            id: "b",
            label: "PHP",
            isCode: true,
            feedback: "Las dos llamadas a `linea()` también muestran algo: cada una ejecuta su `echo`.",
            misconceptionId: "calls-count",
          },
          {
            id: "c",
            label: output("---", "---", "PHP"),
            isCode: true,
            feedback:
              "PHP ejecuta las instrucciones en orden, de arriba abajo: primero una llamada, luego el `echo` y luego la otra llamada.",
            misconceptionId: "execution-order",
          },
          {
            id: "d",
            label: output("---", "PHP"),
            isCode: true,
            feedback: "Hay dos llamadas a `linea()`, así que la línea de guiones aparece dos veces.",
            misconceptionId: "calls-count",
          },
        ],
        hints: [],
        explanation: "Llamada, `echo`, llamada: en ese orden.",
      },
      {
        id: "dominio-3",
        kind: "fill",
        phase: "mastery",
        provenance: "reinforcement",
        concepts: ["function-call"],
        prompt: "Completa la línea que llama a la función `contar`.",
        template: php`
          <?php
          function contar() {
              echo "1, 2, 3\n";
          }

          [[b1]];
        `,
        blanks: [
          {
            id: "b1",
            label: "Hueco 1: llamada a la función contar",
            accept: ["contar()", "contar();"],
            wrong: [
              {
                match: ["contar"],
                feedback: "Faltan los paréntesis: sin ellos la función no se ejecuta.",
                misconceptionId: "call-without-parentheses",
              },
              {
                match: ["function contar()", "functioncontar()"],
                feedback: "Con `function` delante estarías definiendo, no llamando.",
                misconceptionId: "call-vs-definition",
              },
            ],
          },
        ],
        hints: [],
        explanation: "`contar();` ejecuta el cuerpo de la función.",
      },
      {
        id: "dominio-4",
        kind: "choice",
        phase: "mastery",
        provenance: "reinforcement",
        concepts: ["function-definition"],
        prompt: "¿Cuál es la forma correcta de definir una función llamada `avisar`?",
        options: [
          {
            id: "a",
            label: String.raw`function avisar() { echo "Aviso\n"; }`,
            isCode: true,
            correct: true,
            feedback: "Correcto.",
          },
          {
            id: "b",
            label: String.raw`avisar() function { echo "Aviso\n"; }`,
            isCode: true,
            feedback: "La palabra `function` va al principio, antes del nombre.",
            misconceptionId: "function-keyword",
          },
          {
            id: "c",
            label: String.raw`function avisar { echo "Aviso\n"; }`,
            isCode: true,
            feedback: "Faltan los paréntesis después del nombre. Son obligatorios aunque estén vacíos.",
            misconceptionId: "definition-without-parentheses",
          },
          {
            id: "d",
            label: "avisar();",
            isCode: true,
            feedback: "Esto es una llamada, no una definición.",
            misconceptionId: "call-vs-definition",
          },
        ],
        hints: [],
        explanation: "`function`, nombre, paréntesis y cuerpo entre llaves.",
      },
    ],
  },
};
