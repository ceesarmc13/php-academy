import type { Lesson } from "@/domain/curriculum";
import { output, php } from "../php-tag";

/**
 * Lección 3.1 — Parámetros y argumentos
 * Contenido de PHP Academy basado en el índice del Tema 3. Ejercicios de refuerzo.
 */
export const parametrosYArgumentos: Lesson = {
  id: "t3-parametros-y-argumentos",
  code: "3.1",
  title: "Parámetros y argumentos",
  summary: "Cómo enviar datos a una función y la diferencia entre parámetro y argumento.",
  objectives: [
    "Distinguir parámetro de argumento.",
    "Definir funciones con un parámetro y llamarlas con distintos argumentos.",
    "Entender por qué una función no ve las variables de fuera.",
  ],
  prerequisites: ["t3-flujo-de-ejecucion"],
  concepts: ["parameters"],
  estimatedMinutes: 12,
  contentStatus: "ready",
  keyIdeas: [
    "El parámetro es la variable de la definición; el argumento es el valor que envías en la llamada.",
    "Con parámetros, una misma función trabaja con datos distintos en cada llamada.",
    "Una función no ve las variables de fuera: los datos se le pasan como argumentos.",
  ],
  steps: [
    {
      id: "explicacion-1",
      kind: "explanation",
      phase: "explanation",
      title: "Funciones que reciben datos",
      body: [
        "Imagina que quieres saludar a Ana, después a Luis y después a Marta. Con funciones sin parámetros necesitarías una función por persona. Eso no tiene sentido.",
        "La solución es dejar un **hueco** en la función para el dato que cambia. Ese hueco se llama **parámetro** y se escribe como una variable dentro de los paréntesis de la definición.",
        "Al llamar a la función, escribes entre paréntesis el valor concreto. Ese valor se llama **argumento** y PHP lo guarda en el parámetro antes de ejecutar el cuerpo.",
      ],
      codeCaption: "$nombre es el parámetro; \"Ana\" es el argumento",
      code: php`
        <?php
        function saludar($nombre) {
            echo "Hola, " . $nombre . "\n";
        }

        saludar("Ana");
      `,
      keyIdea: "Parámetro: el hueco en la definición. Argumento: lo que pones en el hueco al llamar.",
    },
    {
      id: "explicacion-2",
      kind: "explanation",
      phase: "explanation",
      title: "Una función no ve las variables de fuera",
      body: [
        "Cada función tiene su propio espacio de variables. Dentro solo existen sus parámetros y las variables que cree ella misma.",
        "Por eso este programa **no** muestra «Madrid»: dentro de la función, `$ciudad` no existe. PHP muestra un aviso de variable no definida («Warning: Undefined variable»).",
        "La forma correcta de darle un dato a una función es pasárselo como argumento. Recuerda también que el punto `.` une textos: `\"Hola, \" . $nombre`.",
      ],
      codeCaption: "Incorrecto: la función no ve $ciudad",
      code: php`
        <?php
        $ciudad = "Madrid";

        function mostrarCiudad() {
            echo $ciudad . "\n";
        }

        mostrarCiudad();
      `,
      files: [
        {
          name: "Correcto: el dato llega como argumento",
          code: php`
            <?php
            $ciudad = "Madrid";

            function mostrarCiudad($nombreCiudad) {
                echo $nombreCiudad . "\n";
            }

            mostrarCiudad($ciudad);
          `,
        },
      ],
      keyIdea: "Si la función necesita un dato, pásaselo como argumento.",
    },
    {
      id: "ejemplo",
      kind: "example",
      phase: "example",
      title: "Una función, muchos saludos",
      intro: "La misma función produce saludos distintos según el argumento que recibe.",
      code: php`
        <?php
        function saludar($nombre) {
            echo "Hola, " . $nombre . "\n";
        }

        saludar("Ana");
        saludar("Luis");
        $alumna = "Marta";
        saludar($alumna);
      `,
      annotations: [
        { line: 2, text: "`$nombre` es el parámetro: una variable que recibirá el dato de cada llamada." },
        { line: 3, text: "El cuerpo usa el parámetro. El punto `.` une los textos." },
        { line: 6, text: "Argumento `\"Ana\"`: dentro de la función, `$nombre` vale «Ana»." },
        { line: 7, text: "Nueva llamada, nuevo argumento: ahora `$nombre` vale «Luis»." },
        {
          line: 9,
          text: "El argumento también puede ser una variable. Su nombre (`$alumna`) no tiene por qué coincidir con el del parámetro.",
        },
      ],
      expectedOutput: output("Hola, Ana", "Hola, Luis", "Hola, Marta"),
    },
    {
      id: "comprobacion-1",
      kind: "choice",
      phase: "check",
      provenance: "reinforcement",
      concepts: ["parameters"],
      prompt: "En la llamada `saludar(\"Ana\");`, ¿qué es `\"Ana\"`?",
      options: [
        { id: "a", label: "Un argumento", correct: true, feedback: "Correcto." },
        {
          id: "b",
          label: "Un parámetro",
          feedback: "El parámetro es la variable de la definición (`$nombre`). En la llamada se escriben argumentos.",
          misconceptionId: "param-vs-arg",
        },
        { id: "c", label: "El nombre de la función", feedback: "El nombre de la función es `saludar`." },
        { id: "d", label: "Una variable", feedback: "Es un valor de texto, no una variable: no lleva `$`." },
      ],
      hints: [
        "Fíjate en si está en la definición o en la llamada.",
        "Está dentro de los paréntesis de una llamada.",
        "Lo que se escribe en la llamada es el valor que recibe el parámetro.",
      ],
      explanation: "Lo que va en la llamada es el argumento; se guarda en el parámetro.",
    },
    {
      id: "comprobacion-2",
      kind: "choice",
      phase: "check",
      provenance: "reinforcement",
      concepts: ["parameters"],
      prompt: "¿Qué ocurre al ejecutar este programa?",
      code: php`
        <?php
        $color = "verde";

        function mostrarColor() {
            echo $color . "\n";
        }

        mostrarColor();
      `,
      options: [
        {
          id: "a",
          label: "PHP avisa de que `$color` no está definida dentro de la función",
          correct: true,
          feedback: "Correcto.",
        },
        {
          id: "b",
          label: "Muestra «verde»",
          feedback: "La función no ve las variables de fuera. Dentro de ella, `$color` no existe.",
          misconceptionId: "outer-variable",
        },
        { id: "c", label: "Muestra «$color»", feedback: "PHP intenta usar la variable, no muestra su nombre." },
        {
          id: "d",
          label: "No hace nada porque la función no se llama",
          feedback: "La línea 8 sí llama a la función.",
        },
      ],
      hints: [
        "¿Qué variables existen dentro de una función?",
        "Repasa la segunda explicación: el ejemplo de `$ciudad`.",
        "La función no tiene parámetros, así que no recibe `$color`.",
      ],
      explanation: "Para usar `$color` dentro habría que pasarla como argumento.",
    },
    {
      id: "guiado",
      kind: "fill",
      phase: "guided",
      provenance: "reinforcement",
      concepts: ["parameters"],
      prompt: "Completa el programa para que muestre «Adiós, Pablo».",
      template: php`
        <?php
        function despedir([[b1]]) {
            echo "Adiós, " . $nombre . "\n";
        }

        despedir([[b2]]);
      `,
      blanks: [
        {
          id: "b1",
          label: "Hueco 1: parámetro de la función",
          accept: ["$nombre"],
          wrong: [
            {
              match: ["nombre"],
              feedback: "Los parámetros son variables y llevan `$` delante.",
              misconceptionId: "param-without-dollar",
            },
            {
              match: ['"Pablo"', "'Pablo'"],
              feedback: "En la definición va una variable (el parámetro), no el valor concreto.",
              misconceptionId: "literal-in-definition",
            },
          ],
        },
        {
          id: "b2",
          label: "Hueco 2: argumento de la llamada",
          accept: ['"Pablo"', "'Pablo'"],
          wrong: [
            {
              match: ["Pablo"],
              feedback: "Los textos van entre comillas.",
              misconceptionId: "string-without-quotes",
            },
            {
              match: ["$nombre"],
              feedback: "`$nombre` solo existe dentro de la función. En la llamada va el valor que quieres enviar.",
              misconceptionId: "param-vs-arg",
            },
          ],
        },
      ],
      hints: [
        "El cuerpo usa una variable. ¿Cuál? Esa debe ser el parámetro.",
        "El primer hueco es la variable que aparece en la línea 3.",
        "El segundo hueco es el texto que quieres mostrar, entre comillas.",
      ],
      explanation: "`$nombre` recibe el argumento `\"Pablo\"` y el cuerpo lo muestra.",
    },
    {
      id: "autonomo",
      kind: "order",
      phase: "practice",
      provenance: "reinforcement",
      concepts: ["parameters", "function-call"],
      prompt:
        "Construye un programa con la función `darBienvenida`, que recibe un nombre, para obtener la salida esperada. Una línea sobra.",
      expectedOutput: output("Bienvenida, Ana", "Bienvenida, Leo"),
      lines: [
        { id: "l1", text: "<?php" },
        { id: "l2", text: "function darBienvenida($nombre) {" },
        { id: "l3", text: String.raw`    echo "Bienvenida, " . $nombre . "\n";` },
        { id: "l4", text: "}" },
        { id: "l5", text: 'darBienvenida("Ana");' },
        { id: "l6", text: 'darBienvenida("Leo");' },
        {
          id: "d1",
          text: 'function darBienvenida("Ana") {',
          distractor: true,
          feedback: "En la definición va un parámetro (una variable), no un valor concreto.",
          misconceptionId: "literal-in-definition",
        },
      ],
      solution: ["l1", "l2", "l3", "l4", "l5", "l6"],
      hints: [
        "La definición necesita un parámetro, no un nombre concreto.",
        "Después de la definición completa vienen las llamadas.",
        "Mira la salida: primero Ana y después Leo.",
      ],
      explanation: "Una definición con parámetro y dos llamadas con argumentos distintos.",
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
        concepts: ["parameters"],
        prompt: "¿Cuál es el parámetro en este programa?",
        code: php`
          <?php
          function doble($numero) {
              echo $numero * 2 . "\n";
          }

          doble(4);
        `,
        options: [
          { id: "a", label: "$numero", isCode: true, correct: true, feedback: "Correcto." },
          {
            id: "b",
            label: "4",
            isCode: true,
            feedback: "`4` es el argumento: el valor que se envía en la llamada.",
            misconceptionId: "param-vs-arg",
          },
          { id: "c", label: "doble", isCode: true, feedback: "Ese es el nombre de la función." },
          { id: "d", label: "2", isCode: true, feedback: "Es un número dentro del cálculo." },
        ],
        hints: [],
        explanation: "El parámetro es la variable de la definición.",
      },
      {
        id: "dominio-2",
        kind: "choice",
        phase: "mastery",
        provenance: "reinforcement",
        concepts: ["parameters"],
        prompt: "¿Qué muestra este programa?",
        code: php`
          <?php
          function repetir($texto) {
              echo $texto . "\n";
              echo $texto . "\n";
          }

          repetir("Eco");
        `,
        options: [
          { id: "a", label: output("Eco", "Eco"), isCode: true, correct: true, feedback: "Correcto." },
          {
            id: "b",
            label: output("$texto", "$texto"),
            isCode: true,
            feedback: "`$texto` es una variable: se muestra su valor, «Eco».",
          },
          { id: "c", label: "Eco", isCode: true, feedback: "El cuerpo tiene dos `echo`.", misconceptionId: "calls-count" },
          {
            id: "d",
            label: output("texto", "texto"),
            isCode: true,
            feedback: "Se muestra el valor del parámetro, no su nombre.",
          },
        ],
        hints: [],
        explanation: "`$texto` vale «Eco» y se muestra dos veces.",
      },
      {
        id: "dominio-3",
        kind: "choice",
        phase: "mastery",
        provenance: "reinforcement",
        concepts: ["parameters"],
        prompt: "Tienes un dato en una variable fuera de la función. ¿Cuál es la forma recomendada de usarlo dentro?",
        options: [
          { id: "a", label: "Pasárselo como argumento en la llamada", correct: true, feedback: "Correcto." },
          {
            id: "b",
            label: "Usar la variable directamente: las funciones ven todas las variables",
            feedback: "Las funciones no ven las variables de fuera; PHP avisaría de variable no definida.",
            misconceptionId: "outer-variable",
          },
          {
            id: "c",
            label: "Copiar el valor a mano dentro del cuerpo",
            feedback: "Entonces la función solo serviría para ese valor.",
          },
          {
            id: "d",
            label: "Ponerle a la variable el mismo nombre que la función",
            feedback: "El nombre no hace que la función la vea.",
            misconceptionId: "outer-variable",
          },
        ],
        hints: [],
        explanation: "Los datos entran en una función por sus parámetros.",
      },
      {
        id: "dominio-4",
        kind: "fill",
        phase: "mastery",
        provenance: "reinforcement",
        concepts: ["parameters"],
        prompt: "Completa la llamada para que el programa muestre «Tienes 17 años».",
        template: php`
          <?php
          function mostrarEdad($edad) {
              echo "Tienes " . $edad . " años\n";
          }

          mostrarEdad([[b1]]);
        `,
        blanks: [
          {
            id: "b1",
            label: "Hueco 1: argumento de la llamada",
            accept: ["17", '"17"', "'17'"],
            wrong: [
              {
                match: ["$edad"],
                feedback: "`$edad` solo existe dentro de la función. Aquí va el valor.",
                misconceptionId: "param-vs-arg",
              },
            ],
          },
        ],
        hints: [],
        explanation: "El argumento 17 se guarda en `$edad`.",
      },
    ],
  },
};
