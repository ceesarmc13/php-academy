import type { Lesson } from "@/domain/curriculum";
import { output, php } from "../php-tag";

/**
 * Lección 2.2 — El flujo de ejecución
 * Contenido de PHP Academy basado en el índice del Tema 3. Ejercicios de refuerzo.
 */
export const flujoDeEjecucion: Lesson = {
  id: "t3-flujo-de-ejecucion",
  code: "2.2",
  title: "El flujo de ejecución",
  summary: "Qué ocurre, paso a paso, cuando el programa llama a una función y adónde vuelve después.",
  objectives: [
    "Seguir el orden en que se ejecuta un programa con funciones.",
    "Saber en qué punto continúa el programa cuando una función termina.",
    "Predecir la salida de un programa con varias llamadas.",
  ],
  prerequisites: ["t3-funciones-sin-parametros"],
  concepts: ["execution-flow"],
  estimatedMinutes: 10,
  contentStatus: "ready",
  keyIdeas: [
    "PHP ejecuta de arriba abajo, pero salta las definiciones de funciones.",
    "En una llamada, PHP salta al cuerpo de la función, lo ejecuta entero y vuelve a la instrucción siguiente a la llamada.",
    "En un mismo archivo puedes llamar a una función escrita más abajo, aunque es más claro definirla antes.",
  ],
  steps: [
    {
      id: "explicacion-1",
      kind: "explanation",
      phase: "explanation",
      title: "Ir y volver",
      body: [
        "PHP lee tu programa de arriba abajo, instrucción por instrucción. Cuando encuentra una **definición** de función, no la ejecuta: la guarda y sigue.",
        "Cuando encuentra una **llamada**, hace tres cosas: salta al cuerpo de la función, ejecuta todas sus instrucciones y **vuelve** justo a la instrucción siguiente a la llamada.",
        "Es como leer un libro con una nota «ver página 80»: vas a la página 80, la lees y regresas a la línea donde te habías quedado.",
      ],
      keyIdea: "Después de una llamada, el programa continúa en la instrucción que hay justo debajo de esa llamada.",
    },
    {
      id: "explicacion-2",
      kind: "explanation",
      phase: "explanation",
      title: "¿Y si llamo a una función antes de definirla?",
      body: [
        "Antes de ejecutar nada, PHP repasa el archivo y registra todas las funciones definidas a nivel principal. Por eso, **en un mismo archivo**, puedes llamar a una función que está escrita más abajo.",
        "Aun así, lo habitual es escribir primero las definiciones y después el programa principal: el código se lee mejor.",
        "Ojo: esto solo vale dentro del mismo archivo. Cuando las funciones estén en otro archivo (lo verás en el capítulo 5), habrá que incluirlo antes de usarlas.",
      ],
      codeCaption: "Funciona, aunque la definición esté debajo",
      code: php`
        <?php
        saludar();

        function saludar() {
            echo "Hola\n";
        }
      `,
      keyIdea: "Funciona, pero define primero y llama después: es más fácil de leer.",
    },
    {
      id: "ejemplo",
      kind: "example",
      phase: "example",
      title: "Siguiendo el programa paso a paso",
      intro: "Los números de los mensajes indican el orden en que PHP los muestra. Sigue cada salto.",
      code: php`
        <?php
        echo "1. Empieza el programa\n";

        function preparar() {
            echo "2. Dentro de preparar\n";
        }

        preparar();
        echo "3. De vuelta en el programa\n";
        preparar();
        echo "4. Fin\n";
      `,
      annotations: [
        { line: 2, text: "Lo primero que se ejecuta: muestra el mensaje 1." },
        { line: 4, text: "Definición: PHP la registra pero no la ejecuta ahora. Salta a la línea 8." },
        { line: 8, text: "Llamada: salta a la línea 5, muestra el mensaje 2 y vuelve aquí." },
        { line: 9, text: "Instrucción siguiente a la llamada: muestra el mensaje 3." },
        { line: 10, text: "Segunda llamada: otra vez a la línea 5, y de vuelta." },
        { line: 11, text: "Muestra el mensaje 4 y el programa termina." },
      ],
      expectedOutput: output(
        "1. Empieza el programa",
        "2. Dentro de preparar",
        "3. De vuelta en el programa",
        "2. Dentro de preparar",
        "4. Fin",
      ),
    },
    {
      id: "comprobacion-1",
      kind: "choice",
      phase: "check",
      provenance: "reinforcement",
      concepts: ["execution-flow"],
      prompt: "¿Qué muestra este programa?",
      code: php`
        <?php
        function b() {
            echo "B\n";
        }

        echo "A\n";
        b();
        echo "C\n";
      `,
      options: [
        { id: "a", label: output("A", "B", "C"), isCode: true, correct: true, feedback: "Correcto." },
        {
          id: "b",
          label: output("B", "A", "C"),
          isCode: true,
          feedback: "La definición está arriba, pero no se ejecuta ahí. Lo primero que se ejecuta es `echo \"A\\n\";`.",
          misconceptionId: "define-runs-function",
        },
        {
          id: "c",
          label: output("A", "C", "B"),
          isCode: true,
          feedback: "La llamada `b();` está entre los dos `echo`, así que «B» aparece entre «A» y «C».",
          misconceptionId: "execution-order",
        },
        {
          id: "d",
          label: output("A", "C"),
          isCode: true,
          feedback: "La línea 7 llama a `b()`, que sí muestra «B».",
          misconceptionId: "calls-count",
        },
      ],
      hints: [
        "La definición de las líneas 2 a 4 no se ejecuta por sí sola.",
        "Empieza a leer en la línea 6 y sigue hacia abajo.",
        "Cuando llegues a `b();`, entra en la función y vuelve.",
      ],
      explanation: "A, luego la llamada (B) y al volver, C.",
    },
    {
      id: "comprobacion-2",
      kind: "choice",
      phase: "check",
      provenance: "reinforcement",
      concepts: ["execution-flow"],
      prompt: "Cuando una función termina, ¿dónde continúa el programa?",
      options: [
        {
          id: "a",
          label: "En la instrucción siguiente a la llamada",
          correct: true,
          feedback: "Exacto.",
        },
        {
          id: "b",
          label: "En la línea siguiente a la definición de la función",
          feedback: "El lugar de la definición no importa: PHP vuelve al sitio desde el que se llamó.",
          misconceptionId: "return-point",
        },
        {
          id: "c",
          label: "Al principio del programa",
          feedback: "El programa no vuelve a empezar: continúa justo después de la llamada.",
          misconceptionId: "return-point",
        },
        {
          id: "d",
          label: "En ningún sitio: el programa termina",
          feedback: "El programa sigue con las instrucciones que haya después de la llamada.",
        },
      ],
      hints: [
        "Recuerda la analogía del libro: ¿adónde vuelves después de leer la página 80?",
        "En el ejemplo, tras la primera llamada (línea 8), ¿qué mensaje se mostró?",
        "El mensaje 3 está en la línea 9, justo debajo de la llamada.",
      ],
      explanation: "La función vuelve al punto de la llamada y el programa sigue desde ahí.",
    },
    {
      id: "guiado",
      kind: "fill",
      phase: "guided",
      provenance: "reinforcement",
      concepts: ["execution-flow", "function-call"],
      prompt: "Completa el programa para que muestre: Hola, Adiós, Hasta pronto, Adiós (en ese orden).",
      template: php`
        <?php
        function despedida() {
            echo "Adiós\n";
        }

        echo "Hola\n";
        [[b1]];
        echo "Hasta pronto\n";
        [[b2]];
      `,
      blanks: [
        {
          id: "b1",
          label: "Hueco 1: instrucción tras el saludo",
          accept: ["despedida()", "despedida();"],
          wrong: [
            {
              match: ["despedida"],
              feedback: "Faltan los paréntesis para llamar a la función.",
              misconceptionId: "call-without-parentheses",
            },
          ],
        },
        {
          id: "b2",
          label: "Hueco 2: última instrucción",
          accept: ["despedida()", "despedida();"],
          wrong: [
            {
              match: ["despedida"],
              feedback: "Faltan los paréntesis para llamar a la función.",
              misconceptionId: "call-without-parentheses",
            },
          ],
        },
      ],
      hints: [
        "«Adiós» solo lo muestra la función `despedida`.",
        "Mira dónde tiene que aparecer «Adiós» en la salida: después de «Hola» y al final.",
        "Los dos huecos son la misma llamada.",
      ],
      explanation: "Cada llamada a `despedida()` muestra «Adiós» justo en ese punto del programa.",
    },
    {
      id: "autonomo",
      kind: "order",
      phase: "practice",
      provenance: "reinforcement",
      concepts: ["execution-flow", "function-call"],
      prompt:
        "Ordena las líneas para obtener la salida esperada. Escribe primero la definición de `cargar`. Una línea sobra.",
      expectedOutput: output("Inicio", "Cargando...", "Listo", "Fin"),
      lines: [
        { id: "l1", text: "<?php" },
        { id: "l2", text: "function cargar() {" },
        { id: "l3", text: String.raw`    echo "Cargando...\n";` },
        { id: "l4", text: String.raw`    echo "Listo\n";` },
        { id: "l5", text: "}" },
        { id: "l6", text: String.raw`echo "Inicio\n";` },
        { id: "l7", text: "cargar();" },
        { id: "l8", text: String.raw`echo "Fin\n";` },
        {
          id: "d1",
          text: "cargar;",
          distractor: true,
          feedback: "`cargar;` no es una llamada: faltan los paréntesis.",
          misconceptionId: "call-without-parentheses",
        },
      ],
      solution: ["l1", "l2", "l3", "l4", "l5", "l6", "l7", "l8"],
      hints: [
        "Primero `<?php` y la definición completa de `cargar`.",
        "Después viene el programa principal. ¿Qué se muestra antes de «Cargando...»?",
        "Programa principal: «Inicio», la llamada y «Fin».",
      ],
      explanation: "Definición arriba; el programa principal muestra Inicio, llama a `cargar` y, al volver, muestra Fin.",
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
        concepts: ["execution-flow"],
        prompt: "¿Qué muestra este programa?",
        code: php`
          <?php
          saludar();

          function saludar() {
              echo "Hola\n";
          }
        `,
        options: [
          {
            id: "a",
            label: "Hola",
            isCode: true,
            correct: true,
            feedback: "Correcto: en un mismo archivo, PHP conoce la función antes de ejecutar.",
          },
          {
            id: "b",
            label: "Un error, porque la función todavía no existe",
            feedback: "En un mismo archivo, PHP registra todas las funciones antes de empezar, así que la llamada funciona.",
            misconceptionId: "call-before-definition",
          },
          { id: "c", label: "Nada", feedback: "La línea 2 es una llamada y se ejecuta." },
          {
            id: "d",
            label: output("Hola", "Hola"),
            isCode: true,
            feedback: "Hay una sola llamada. La definición no ejecuta nada.",
            misconceptionId: "define-runs-function",
          },
        ],
        hints: [],
        explanation: "La función se registra antes de ejecutar, así que se puede llamar desde arriba.",
      },
      {
        id: "dominio-2",
        kind: "choice",
        phase: "mastery",
        provenance: "reinforcement",
        concepts: ["execution-flow"],
        prompt:
          "Un programa llama a la función `f()` en la línea 10. Cuando `f` termina, ¿qué línea se ejecuta a continuación?",
        options: [
          { id: "a", label: "La línea 11", correct: true, feedback: "Correcto." },
          {
            id: "b",
            label: "La línea siguiente al final de la definición de `f`",
            feedback: "Se vuelve al punto de la llamada, no al de la definición.",
            misconceptionId: "return-point",
          },
          {
            id: "c",
            label: "La línea 1",
            feedback: "El programa no se reinicia.",
            misconceptionId: "return-point",
          },
          { id: "d", label: "Ninguna: el programa termina", feedback: "El programa sigue tras la llamada." },
        ],
        hints: [],
        explanation: "Se continúa justo después de la llamada.",
      },
      {
        id: "dominio-3",
        kind: "choice",
        phase: "mastery",
        provenance: "reinforcement",
        concepts: ["execution-flow", "function-call"],
        prompt: "¿Qué muestra este programa?",
        code: php`
          <?php
          function x() {
              echo "x\n";
          }

          echo "1\n";
          x();
          x();
          echo "2\n";
        `,
        options: [
          { id: "a", label: output("1", "x", "x", "2"), isCode: true, correct: true, feedback: "Correcto." },
          {
            id: "b",
            label: output("x", "1", "x", "2"),
            isCode: true,
            feedback: "La definición no se ejecuta en su sitio: lo primero es «1».",
            misconceptionId: "define-runs-function",
          },
          {
            id: "c",
            label: output("1", "x", "2"),
            isCode: true,
            feedback: "Hay dos llamadas seguidas, así que «x» aparece dos veces.",
            misconceptionId: "calls-count",
          },
          {
            id: "d",
            label: output("1", "2", "x", "x"),
            isCode: true,
            feedback: "Las llamadas están entre los dos `echo`.",
            misconceptionId: "execution-order",
          },
        ],
        hints: [],
        explanation: "1, dos llamadas (x, x) y 2.",
      },
      {
        id: "dominio-4",
        kind: "fill",
        phase: "mastery",
        provenance: "reinforcement",
        concepts: ["execution-flow", "function-call"],
        prompt: "Completa el programa para que muestre A, B, A.",
        template: php`
          <?php
          function mostrarA() {
              echo "A\n";
          }

          [[b1]];
          echo "B\n";
          [[b2]];
        `,
        blanks: [
          {
            id: "b1",
            label: "Hueco 1: primera instrucción del programa principal",
            accept: ["mostrarA()", "mostrarA();"],
            wrong: [
              {
                match: ["mostrarA"],
                feedback: "Faltan los paréntesis.",
                misconceptionId: "call-without-parentheses",
              },
            ],
          },
          {
            id: "b2",
            label: "Hueco 2: última instrucción",
            accept: ["mostrarA()", "mostrarA();"],
            wrong: [
              {
                match: ["mostrarA"],
                feedback: "Faltan los paréntesis.",
                misconceptionId: "call-without-parentheses",
              },
            ],
          },
        ],
        hints: [],
        explanation: "Una llamada antes y otra después del `echo` de B.",
      },
    ],
  },
};
