import type { Lesson } from "@/domain/curriculum";
import { output, php } from "../php-tag";

/**
 * Lección 4.2 — Funciones con retorno
 * Contenido de PHP Academy basado en el índice del Tema 3. Ejercicios de refuerzo.
 */
export const funcionesConRetorno: Lesson = {
  id: "t3-funciones-con-retorno",
  code: "4.2",
  title: "Funciones con retorno",
  summary: "Funciones que calculan un valor, lo devuelven y se usan en operaciones y condiciones.",
  objectives: [
    "Escribir funciones que devuelven un valor.",
    "Usar el valor devuelto en operaciones y condiciones.",
    "Escribir funciones con varios `return` según una condición.",
  ],
  prerequisites: ["t3-return-frente-a-echo"],
  concepts: ["return-value"],
  estimatedMinutes: 12,
  contentStatus: "ready",
  keyIdeas: [
    "Una llamada a una función con `return` se puede usar donde usarías un valor: en una operación, en un `echo` o en un `if`.",
    "Una función puede tener varios `return`, pero en cada llamada solo se ejecuta uno: el primero al que llega.",
    "Si no guardas ni usas el valor devuelto, se pierde.",
  ],
  steps: [
    {
      id: "explicacion-1",
      kind: "explanation",
      phase: "explanation",
      title: "La llamada vale lo que devuelve",
      body: [
        "Cuando una función devuelve un valor, puedes usar la llamada como si fuera ese valor:",
      ],
      points: [
        "**Guardarlo:** `$media = calcularMedia(6, 8);`",
        "**Operar con él:** `$total = sumar(2, 3) * 2;` (primero se resuelve la llamada: 5 × 2 = 10).",
        "**Mostrarlo:** `echo calcularMedia(6, 8);`",
        "**Usarlo en una condición:** `if (esPar(4)) { … }` si la función devuelve `true` o `false`.",
      ],
      keyIdea: "Escribe la llamada allí donde necesites el valor.",
    },
    {
      id: "explicacion-2",
      kind: "explanation",
      phase: "explanation",
      title: "Varios return y una sola salida",
      body: [
        "Una función puede tener un `return` dentro de un `if` y otro al final. Como `return` termina la función, en cada llamada solo se ejecuta **uno**: el primero al que llega.",
        "Las funciones que devuelven `true` o `false` se suelen nombrar como una pregunta: `esPar`, `esMayorDeEdad`, `estaAprobado`. Así el `if` se lee casi como una frase.",
      ],
      codeCaption: "Dos caminos, un solo return por llamada",
      code: php`
        <?php
        function esPar($numero) {
            if ($numero % 2 == 0) {
                return true;
            }
            return false;
        }
      `,
      keyIdea: "El operador `%` da el resto de una división: si el resto entre 2 es 0, el número es par.",
    },
    {
      id: "ejemplo",
      kind: "example",
      phase: "example",
      title: "Una función que decide",
      intro: "`esMayorDeEdad` devuelve `true` o `false`, y el programa usa ese valor en un `if`.",
      code: php`
        <?php
        function esMayorDeEdad($edad) {
            if ($edad >= 18) {
                return true;
            }
            return false;
        }

        $edad = 16;
        if (esMayorDeEdad($edad)) {
            echo "Puede votar\n";
        } else {
            echo "Todavía no puede votar\n";
        }
      `,
      annotations: [
        { line: 3, text: "Si la edad es 18 o más, la función devuelve `true` y termina aquí." },
        { line: 6, text: "Solo se llega a esta línea si la condición era falsa: devuelve `false`." },
        { line: 9, text: "Esta `$edad` está fuera de la función; se le pasa como argumento en la línea 10." },
        { line: 10, text: "La llamada vale `false` (16 < 18), así que el `if` va al `else`." },
        { line: 13, text: "Se muestra este mensaje." },
      ],
      expectedOutput: output("Todavía no puede votar"),
    },
    {
      id: "comprobacion-1",
      kind: "choice",
      phase: "check",
      provenance: "reinforcement",
      concepts: ["return-value"],
      prompt: "¿Qué muestra este programa?",
      code: php`
        <?php
        function maximo($a, $b) {
            if ($a > $b) {
                return $a;
            }
            return $b;
        }

        echo maximo(3, 9) . "\n";
      `,
      options: [
        { id: "a", label: "9", isCode: true, correct: true, feedback: "Correcto." },
        {
          id: "b",
          label: "3",
          isCode: true,
          feedback: "3 > 9 es falso, así que no se ejecuta el primer `return`: se devuelve `$b`, que vale 9.",
        },
        {
          id: "c",
          label: "39",
          isCode: true,
          feedback: "Solo se ejecuta un `return` por llamada.",
          misconceptionId: "code-after-return",
        },
        { id: "d", label: "true", isCode: true, feedback: "La función devuelve uno de los números, no `true`." },
      ],
      hints: [
        "`$a` vale 3 y `$b` vale 9. ¿Se cumple `$a > $b`?",
        "Si la condición es falsa, se salta el primer `return`.",
        "El segundo `return` devuelve `$b`.",
      ],
      explanation: "Devuelve el mayor de los dos: 9.",
    },
    {
      id: "comprobacion-2",
      kind: "choice",
      phase: "check",
      provenance: "reinforcement",
      concepts: ["return-value"],
      prompt: "Si `sumar($a, $b)` devuelve `$a + $b`, ¿qué muestra `echo sumar(2, 3) * 2;`?",
      options: [
        { id: "a", label: "10", isCode: true, correct: true, feedback: "Correcto." },
        {
          id: "b",
          label: "7",
          isCode: true,
          feedback: "La llamada se resuelve primero: `sumar(2, 3)` vale 5, y 5 × 2 = 10.",
        },
        { id: "c", label: "5", isCode: true, feedback: "Falta multiplicar el valor devuelto por 2." },
        { id: "d", label: "Un error", feedback: "Puedes operar con el valor devuelto." },
      ],
      hints: [
        "Sustituye la llamada por el valor que devuelve.",
        "`sumar(2, 3)` vale 5.",
        "Ahora calcula 5 * 2.",
      ],
      explanation: "La llamada vale 5 y 5 × 2 = 10.",
    },
    {
      id: "guiado",
      kind: "fill",
      phase: "guided",
      provenance: "reinforcement",
      concepts: ["return-value"],
      prompt: "Completa la función `esPar` y el `if` para que el programa muestre «8 es par».",
      template: php`
        <?php
        function esPar($numero) {
            if ($numero % 2 == 0) {
                return [[b1]];
            }
            return false;
        }

        if ([[b2]]) {
            echo "8 es par\n";
        }
      `,
      blanks: [
        {
          id: "b1",
          label: "Hueco 1: valor que se devuelve si es par",
          accept: ["true"],
          wrong: [
            { match: ["false"], feedback: "Si el resto es 0, el número es par: la respuesta a «¿es par?» es sí." },
            { match: ['"true"', "'true'"], feedback: "`true` es un valor lógico, sin comillas." },
          ],
        },
        {
          id: "b2",
          label: "Hueco 2: condición del if",
          accept: ["esPar(8)", "esPar(8) == true", "esPar(8) === true"],
          wrong: [
            {
              match: ["esPar"],
              feedback: "Hay que llamar a la función con el número: nombre, paréntesis y argumento.",
              misconceptionId: "call-without-parentheses",
            },
          ],
        },
      ],
      hints: [
        "La función responde a la pregunta «¿es par?» con `true` o `false`.",
        "En el `if` va la llamada a la función con el número que quieres comprobar.",
        "Primer hueco: el valor lógico que significa «sí». Segundo: `esPar` con el 8.",
      ],
      explanation: "`esPar(8)` devuelve `true` y el `if` muestra el mensaje.",
    },
    {
      id: "autonomo",
      kind: "order",
      phase: "practice",
      provenance: "reinforcement",
      concepts: ["return-value"],
      prompt:
        "Construye un programa en el que `aplicarDescuento` devuelva el precio con un 10 % de descuento, se guarde en `$final` y se muestre. Una línea sobra.",
      expectedOutput: output("Precio final: 90"),
      lines: [
        { id: "l1", text: "<?php" },
        { id: "l2", text: "function aplicarDescuento($precio) {" },
        { id: "l3", text: "    return $precio * 0.9;" },
        { id: "l4", text: "}" },
        { id: "l5", text: "$final = aplicarDescuento(100);" },
        { id: "l6", text: String.raw`echo "Precio final: " . $final . "\n";` },
        {
          id: "d1",
          text: "aplicarDescuento(100);",
          distractor: true,
          feedback: "Esa llamada no guarda ni muestra el resultado: el valor devuelto se perdería.",
          misconceptionId: "lost-return",
        },
      ],
      solution: ["l1", "l2", "l3", "l4", "l5", "l6"],
      hints: [
        "Primero la definición completa.",
        "El resultado tiene que quedar guardado en `$final` antes de mostrarlo.",
        "La llamada que sirve es la que asigna el resultado a una variable.",
      ],
      explanation: "La función devuelve 90, se guarda en `$final` y se muestra.",
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
        concepts: ["return-value"],
        prompt: "¿Qué muestra este programa?",
        code: php`
          <?php
          function nota($n) {
              if ($n >= 5) {
                  return "Aprobado";
              }
              return "Suspenso";
          }

          echo nota(7) . "\n";
          echo nota(3) . "\n";
        `,
        options: [
          {
            id: "a",
            label: output("Aprobado", "Suspenso"),
            isCode: true,
            correct: true,
            feedback: "Correcto.",
          },
          {
            id: "b",
            label: output("Aprobado", "Aprobado"),
            isCode: true,
            feedback: "Con 3 la condición es falsa y se devuelve «Suspenso».",
          },
          {
            id: "c",
            label: output("Aprobado", "Suspenso", "Suspenso"),
            isCode: true,
            feedback: "En cada llamada solo se ejecuta un `return`.",
            misconceptionId: "code-after-return",
          },
          {
            id: "d",
            label: output("Suspenso", "Suspenso"),
            isCode: true,
            feedback: "Con 7 se cumple `$n >= 5` y se devuelve «Aprobado».",
          },
        ],
        hints: [],
        explanation: "7 → Aprobado; 3 → Suspenso.",
      },
      {
        id: "dominio-2",
        kind: "choice",
        phase: "mastery",
        provenance: "reinforcement",
        concepts: ["return-value"],
        prompt: "Una función tiene tres `return`. ¿Cuántos se ejecutan, como máximo, en una llamada?",
        options: [
          { id: "a", label: "Uno", correct: true, feedback: "Correcto: el primer `return` termina la función." },
          {
            id: "b",
            label: "Tres",
            feedback: "El primero que se ejecuta termina la función.",
            misconceptionId: "code-after-return",
          },
          {
            id: "c",
            label: "Depende del número de parámetros",
            feedback: "No depende de los parámetros: `return` siempre termina la función.",
          },
          { id: "d", label: "Ninguno", feedback: "Se ejecuta el primero al que llegue la función." },
        ],
        hints: [],
        explanation: "`return` termina la función, así que solo se ejecuta uno.",
      },
      {
        id: "dominio-3",
        kind: "choice",
        phase: "mastery",
        provenance: "reinforcement",
        concepts: ["return-value"],
        prompt: "¿Qué muestra este programa?",
        code: php`
          <?php
          function incrementar($n) {
              return $n + 1;
          }

          $a = 5;
          incrementar($a);
          echo $a . "\n";
        `,
        options: [
          {
            id: "a",
            label: "5",
            isCode: true,
            correct: true,
            feedback: "Correcto: el valor devuelto no se guardó, así que `$a` no cambia.",
          },
          {
            id: "b",
            label: "6",
            isCode: true,
            feedback: "La línea 7 no guarda el resultado. Haría falta `$a = incrementar($a);`.",
            misconceptionId: "lost-return",
          },
          { id: "c", label: "Nada", feedback: "La línea 8 muestra `$a`." },
          { id: "d", label: "Un error", feedback: "Es válido llamar a una función sin usar su valor." },
        ],
        hints: [],
        explanation: "El 6 devuelto se pierde; `$a` sigue valiendo 5.",
      },
      {
        id: "dominio-4",
        kind: "fill",
        phase: "mastery",
        provenance: "reinforcement",
        concepts: ["return-value"],
        prompt: "Guarda en `$area` el área de un cuadrado de lado 3.",
        template: php`
          <?php
          function areaCuadrado($lado) {
              return $lado * $lado;
          }

          $area = [[b1]];
          echo $area . "\n";
        `,
        blanks: [
          {
            id: "b1",
            label: "Hueco 1: llamada que calcula el área",
            accept: ["areaCuadrado(3)"],
            wrong: [
              {
                match: ["areaCuadrado"],
                feedback: "Hay que llamar a la función con el lado entre paréntesis.",
                misconceptionId: "call-without-parentheses",
              },
              { match: ["9"], feedback: "Correcto como número, pero se trata de usar la función para calcularlo." },
            ],
          },
        ],
        hints: [],
        explanation: "`areaCuadrado(3)` devuelve 9 y se guarda en `$area`.",
      },
    ],
  },
};
