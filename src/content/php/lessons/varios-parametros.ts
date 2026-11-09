import type { Lesson } from "@/domain/curriculum";
import { output, php } from "../php-tag";

/**
 * Lección 3.2 — Funciones con varios parámetros
 * Contenido de PHP Academy basado en el índice del Tema 3. Ejercicios de refuerzo.
 */
export const variosParametros: Lesson = {
  id: "t3-varios-parametros",
  code: "3.2",
  title: "Funciones con varios parámetros",
  summary: "Funciones que reciben varios datos, la importancia de su orden y los valores por defecto.",
  objectives: [
    "Definir funciones con varios parámetros.",
    "Pasar los argumentos en el orden correcto.",
    "Saber qué ocurre si faltan argumentos y usar valores por defecto.",
  ],
  prerequisites: ["t3-parametros-y-argumentos"],
  concepts: ["parameters"],
  estimatedMinutes: 12,
  contentStatus: "ready",
  keyIdeas: [
    "Los parámetros se separan con comas, igual que los argumentos.",
    "Los argumentos se asignan por posición: el primero al primer parámetro, el segundo al segundo.",
    "Si faltan argumentos obligatorios, PHP se detiene con un error. Un valor por defecto hace opcional un parámetro.",
  ],
  steps: [
    {
      id: "explicacion-1",
      kind: "explanation",
      phase: "explanation",
      title: "Varios datos, separados por comas",
      body: [
        "Una función puede necesitar más de un dato. Se escriben todos los parámetros entre los paréntesis, **separados por comas**. En la llamada, los argumentos también se separan con comas.",
        "PHP los empareja **por posición**: el primer argumento va al primer parámetro, el segundo al segundo, y así sucesivamente. Los nombres no influyen.",
        "Por eso el orden importa. Si lo cambias, PHP no da error, pero cada dato termina en el sitio equivocado.",
      ],
      codeCaption: "Dos parámetros",
      code: php`
        <?php
        function presentar($nombre, $edad) {
            echo $nombre . " tiene " . $edad . " años\n";
        }

        presentar("Ana", 17);
      `,
      keyIdea: "Primer argumento → primer parámetro. Segundo argumento → segundo parámetro.",
    },
    {
      id: "explicacion-2",
      kind: "explanation",
      phase: "explanation",
      title: "¿Y si falta un argumento?",
      body: [
        "Si una función tiene dos parámetros y la llamas con uno, PHP se detiene con un error que indica que faltan argumentos («Too few arguments»).",
        "Puedes hacer opcional un parámetro dándole un **valor por defecto** con `=`. Si en la llamada no se envía ese argumento, se usa el valor por defecto.",
        "Los parámetros con valor por defecto se colocan **al final**, después de los obligatorios.",
      ],
      codeCaption: "$saludo es opcional",
      code: php`
        <?php
        function saludar($nombre, $saludo = "Hola") {
            echo $saludo . ", " . $nombre . "\n";
        }

        saludar("Ana");           // Hola, Ana
        saludar("Leo", "Buenas"); // Buenas, Leo
      `,
      keyIdea: "Sin valor por defecto, cada parámetro necesita su argumento.",
    },
    {
      id: "ejemplo",
      kind: "example",
      phase: "example",
      title: "El orden importa",
      intro: "Las dos primeras llamadas son correctas. La tercera no da error, pero el resultado no tiene sentido.",
      code: php`
        <?php
        function presentar($nombre, $edad) {
            echo $nombre . " tiene " . $edad . " años\n";
        }

        presentar("Ana", 17);
        presentar("Luis", 19);
        presentar(20, "Marta");
      `,
      annotations: [
        { line: 2, text: "Dos parámetros separados por coma: primero el nombre y después la edad." },
        { line: 6, text: "«Ana» va a `$nombre` y 17 va a `$edad`." },
        { line: 7, text: "Mismo orden, otros datos." },
        {
          line: 8,
          text: "Orden cambiado: 20 acaba en `$nombre` y «Marta» en `$edad`. PHP no se queja, pero el mensaje sale mal.",
        },
      ],
      expectedOutput: output("Ana tiene 17 años", "Luis tiene 19 años", "20 tiene Marta años"),
    },
    {
      id: "comprobacion-1",
      kind: "choice",
      phase: "check",
      provenance: "reinforcement",
      concepts: ["parameters"],
      prompt: "¿Qué muestra este programa?",
      code: php`
        <?php
        function restar($a, $b) {
            echo ($a - $b) . "\n";
        }

        restar(10, 3);
      `,
      options: [
        { id: "a", label: "7", isCode: true, correct: true, feedback: "Correcto." },
        {
          id: "b",
          label: "-7",
          isCode: true,
          feedback: "10 va a `$a` y 3 va a `$b`: 10 − 3 = 7.",
          misconceptionId: "argument-order",
        },
        { id: "c", label: "13", isCode: true, feedback: "La función resta, no suma." },
        { id: "d", label: "10 - 3", isCode: true, feedback: "PHP calcula la operación y muestra el resultado." },
      ],
      hints: [
        "Empareja cada argumento con su parámetro por posición.",
        "`$a` vale 10. ¿Cuánto vale `$b`?",
        "Calcula `$a - $b` con esos valores.",
      ],
      explanation: "`$a` = 10, `$b` = 3, y 10 − 3 = 7.",
    },
    {
      id: "comprobacion-2",
      kind: "choice",
      phase: "check",
      provenance: "reinforcement",
      concepts: ["parameters"],
      prompt: "La función es `function rectangulo($base, $altura)`. ¿Qué ocurre con la llamada `rectangulo(5);`?",
      options: [
        {
          id: "a",
          label: "PHP se detiene con un error porque falta un argumento",
          correct: true,
          feedback: "Correcto.",
        },
        {
          id: "b",
          label: "`$altura` vale 0",
          feedback: "PHP no rellena con 0: si no hay valor por defecto, falta un argumento y se produce un error.",
          misconceptionId: "missing-argument",
        },
        {
          id: "c",
          label: "Se usa 5 para la base y para la altura",
          feedback: "Cada argumento va a un solo parámetro.",
          misconceptionId: "missing-argument",
        },
        {
          id: "d",
          label: "No pasa nada: se ignora la función",
          feedback: "La llamada se intenta ejecutar y falla.",
        },
      ],
      hints: [
        "¿Cuántos parámetros tiene la función? ¿Cuántos argumentos recibe?",
        "Ninguno de los dos parámetros tiene valor por defecto.",
        "Repasa la segunda explicación: «¿Y si falta un argumento?».",
      ],
      explanation: "Sin valor por defecto, cada parámetro necesita su argumento.",
    },
    {
      id: "guiado",
      kind: "fill",
      phase: "guided",
      provenance: "reinforcement",
      concepts: ["parameters"],
      prompt: "Completa el programa para que muestre «Ana: 8». Añade el segundo parámetro y escribe los argumentos.",
      template: php`
        <?php
        function mostrarNota($alumno[[b1]]) {
            echo $alumno . ": " . $nota . "\n";
        }

        mostrarNota([[b2]]);
      `,
      blanks: [
        {
          id: "b1",
          label: "Hueco 1: segundo parámetro, con su separador",
          accept: [", $nota"],
          wrong: [
            {
              match: ["$nota"],
              feedback: "Los parámetros se separan con una coma.",
            },
            {
              match: [", nota", ",nota"],
              feedback: "Los parámetros son variables: llevan `$`.",
              misconceptionId: "param-without-dollar",
            },
          ],
        },
        {
          id: "b2",
          label: "Hueco 2: los dos argumentos",
          accept: ['"Ana", 8', "'Ana', 8", '"Ana", "8"', "'Ana', '8'"],
          wrong: [
            {
              match: ['8, "Ana"', "8, 'Ana'"],
              feedback: "El orden importa: el primer argumento va a `$alumno`.",
              misconceptionId: "argument-order",
            },
            {
              match: ["Ana, 8"],
              feedback: "El texto «Ana» va entre comillas.",
              misconceptionId: "string-without-quotes",
            },
          ],
        },
      ],
      hints: [
        "El cuerpo usa `$nota`, pero no está en la definición.",
        "El primer hueco empieza por una coma. El segundo lleva dos valores separados por coma.",
        "Primero el alumno (texto, con comillas) y después la nota.",
      ],
      explanation: "Con `$alumno, $nota` en la definición y `\"Ana\", 8` en la llamada, cada dato va a su sitio.",
    },
    {
      id: "autonomo",
      kind: "order",
      phase: "practice",
      provenance: "reinforcement",
      concepts: ["parameters"],
      prompt:
        "Construye el programa con la función `mostrarProducto($nombre, $precio)` para obtener la salida esperada. Una línea sobra.",
      expectedOutput: output("Producto: Libro | Precio: 12 euros", "Producto: Lápiz | Precio: 2 euros"),
      lines: [
        { id: "l1", text: "<?php" },
        { id: "l2", text: "function mostrarProducto($nombre, $precio) {" },
        { id: "l3", text: String.raw`    echo "Producto: " . $nombre . " | Precio: " . $precio . " euros\n";` },
        { id: "l4", text: "}" },
        { id: "l5", text: 'mostrarProducto("Libro", 12);' },
        { id: "l6", text: 'mostrarProducto("Lápiz", 2);' },
        {
          id: "d1",
          text: 'mostrarProducto(12, "Libro");',
          distractor: true,
          feedback: "Esa llamada tiene los argumentos al revés: 12 acabaría en `$nombre`.",
          misconceptionId: "argument-order",
        },
      ],
      solution: ["l1", "l2", "l3", "l4", "l5", "l6"],
      hints: [
        "La definición completa va primero.",
        "Compara el orden de los parámetros con el de los argumentos de cada llamada.",
        "Mira la salida esperada: primero el libro y después el lápiz.",
      ],
      explanation: "Las llamadas respetan el orden: primero el nombre y después el precio.",
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
        prompt: "¿Qué muestra este programa?",
        code: php`
          <?php
          function dividir($a, $b) {
              echo ($a / $b) . "\n";
          }

          dividir(8, 2);
        `,
        options: [
          { id: "a", label: "4", isCode: true, correct: true, feedback: "Correcto." },
          {
            id: "b",
            label: "0.25",
            isCode: true,
            feedback: "8 va a `$a` y 2 va a `$b`: 8 / 2 = 4.",
            misconceptionId: "argument-order",
          },
          { id: "c", label: "82", isCode: true, feedback: "La función divide, no une los números." },
          { id: "d", label: "Un error", feedback: "La llamada tiene los dos argumentos que necesita." },
        ],
        hints: [],
        explanation: "8 / 2 = 4.",
      },
      {
        id: "dominio-2",
        kind: "choice",
        phase: "mastery",
        provenance: "reinforcement",
        concepts: ["parameters"],
        prompt: "¿Cómo se separan varios parámetros en la definición de una función?",
        options: [
          { id: "a", label: "Con comas", correct: true, feedback: "Correcto." },
          { id: "b", label: "Con punto y coma", feedback: "El punto y coma termina instrucciones." },
          { id: "c", label: "Con espacios", feedback: "Sin coma, PHP da un error de sintaxis." },
          { id: "d", label: "Con puntos", feedback: "El punto une textos; no separa parámetros." },
        ],
        hints: [],
        explanation: "`function f($a, $b)`.",
      },
      {
        id: "dominio-3",
        kind: "choice",
        phase: "mastery",
        provenance: "reinforcement",
        concepts: ["parameters"],
        prompt: "¿Qué muestra este programa?",
        code: php`
          <?php
          function saludar($nombre, $saludo = "Hola") {
              echo $saludo . ", " . $nombre . "\n";
          }

          saludar("Ana");
          saludar("Leo", "Buenas");
        `,
        options: [
          {
            id: "a",
            label: output("Hola, Ana", "Buenas, Leo"),
            isCode: true,
            correct: true,
            feedback: "Correcto.",
          },
          {
            id: "b",
            label: output("Hola, Ana", "Hola, Leo"),
            isCode: true,
            feedback: "En la segunda llamada se envía «Buenas», que sustituye al valor por defecto.",
          },
          {
            id: "c",
            label: "Un error en la primera llamada",
            feedback: "`$saludo` tiene valor por defecto, así que puede omitirse.",
            misconceptionId: "missing-argument",
          },
          {
            id: "d",
            label: output("Ana, Hola", "Leo, Buenas"),
            isCode: true,
            feedback: "Mira el orden en el `echo`: primero `$saludo` y después `$nombre`.",
          },
        ],
        hints: [],
        explanation: "Sin segundo argumento se usa «Hola»; con él, «Buenas».",
      },
      {
        id: "dominio-4",
        kind: "fill",
        phase: "mastery",
        provenance: "reinforcement",
        concepts: ["parameters"],
        prompt: "Escribe la llamada que hace que el programa muestre 6, restando 10 menos 4.",
        template: php`
          <?php
          function mostrarResta($a, $b) {
              echo ($a - $b) . "\n";
          }

          [[b1]];
        `,
        blanks: [
          {
            id: "b1",
            label: "Hueco 1: llamada a mostrarResta",
            accept: ["mostrarResta(10, 4)", "mostrarResta(10, 4);"],
            wrong: [
              {
                match: ["mostrarResta(4, 10)", "mostrarResta(4, 10);"],
                feedback: "Así `$a` valdría 4 y se mostraría −6. El orden importa.",
                misconceptionId: "argument-order",
              },
            ],
          },
        ],
        hints: [],
        explanation: "`$a` = 10 y `$b` = 4: se muestra 6.",
      },
    ],
  },
};
