import type { Lesson } from "@/domain/curriculum";
import { output, php } from "../php-tag";

/**
 * Lección 4.1 — return frente a echo
 * Contenido de PHP Academy basado en el índice del Tema 3. Ejercicios de refuerzo.
 */
export const returnFrenteAEcho: Lesson = {
  id: "t3-return-frente-a-echo",
  code: "4.1",
  title: "return frente a echo",
  summary: "Mostrar un resultado no es lo mismo que devolverlo para poder usarlo después.",
  objectives: [
    "Explicar la diferencia entre `return` y `echo`.",
    "Guardar en una variable el valor que devuelve una función.",
    "Decidir cuál usar en cada situación.",
  ],
  prerequisites: ["t3-varios-parametros"],
  concepts: ["return-vs-echo"],
  estimatedMinutes: 12,
  contentStatus: "ready",
  keyIdeas: [
    "`echo` muestra en pantalla; `return` entrega el valor a quien llamó a la función.",
    "Un valor devuelto se puede guardar, operar, pasar a otra función o mostrar cuando quieras.",
    "Una función que solo hace `echo` devuelve `null`: su resultado no se puede reutilizar.",
  ],
  steps: [
    {
      id: "explicacion-1",
      kind: "explanation",
      phase: "explanation",
      title: "Mostrar o devolver",
      body: [
        "Hasta ahora tus funciones **mostraban** resultados con `echo`. Pero muchas veces no quieres mostrar el resultado todavía: quieres **usarlo** para otra cosa, como sumarlo a un total o compararlo.",
        "Para eso existe `return`: la función **devuelve** el valor a la línea que la llamó. Es como una calculadora que te da el resultado en la mano: tú decides qué hacer con él.",
        "Con `echo`, en cambio, la función lo dice en voz alta y se lo queda. Nadie más puede usar ese resultado.",
      ],
      codeCaption: "La misma suma, de dos formas",
      code: php`
        <?php
        // Muestra el resultado, pero no lo devuelve
        function sumarYMostrar($a, $b) {
            echo $a + $b;
        }

        // Devuelve el resultado para usarlo después
        function sumar($a, $b) {
            return $a + $b;
        }
      `,
      keyIdea: "`return` entrega el valor; `echo` solo lo enseña.",
    },
    {
      id: "explicacion-2",
      kind: "explanation",
      phase: "explanation",
      title: "Qué pasa con el valor",
      body: [
        "Cuando una función usa `return`, la llamada «se convierte» en el valor devuelto. Por eso puedes escribir `$total = sumar(2, 3);` y `$total` valdrá 5. O directamente `echo sumar(2, 3);`.",
        "Si la función solo hace `echo` y no tiene `return`, devuelve `null` (nada). `$total = sumarYMostrar(2, 3);` mostraría 5 en pantalla, pero `$total` quedaría vacía.",
        "Además, `return` **termina la función** en ese momento: lo que haya debajo, dentro de la función, no se ejecuta.",
      ],
      keyIdea: "Si vas a usar el resultado para algo más, la función debe devolverlo con `return`.",
    },
    {
      id: "ejemplo",
      kind: "example",
      phase: "example",
      title: "Usar el valor devuelto",
      intro: "La función `doble` no muestra nada: devuelve el resultado y el programa decide qué hacer con él.",
      code: php`
        <?php
        function doble($numero) {
            return $numero * 2;
        }

        $resultado = doble(5);
        echo "El doble de 5 es " . $resultado . "\n";
        echo "Y el doble de eso: " . doble($resultado) . "\n";
      `,
      annotations: [
        { line: 3, text: "`return` calcula `$numero * 2` y entrega el resultado a quien llamó." },
        { line: 6, text: "La llamada `doble(5)` vale 10, y ese 10 se guarda en `$resultado`." },
        { line: 7, text: "Ahora es el programa quien decide mostrar el valor." },
        {
          line: 8,
          text: "El valor devuelto se puede usar directamente: `doble($resultado)` vale 20 y se une al texto.",
        },
      ],
      expectedOutput: output("El doble de 5 es 10", "Y el doble de eso: 20"),
    },
    {
      id: "comprobacion-1",
      kind: "choice",
      phase: "check",
      provenance: "reinforcement",
      concepts: ["return-vs-echo"],
      prompt: "¿Qué muestra este programa?",
      code: php`
        <?php
        function cuadrado($n) {
            return $n * $n;
        }

        cuadrado(4);
      `,
      options: [
        {
          id: "a",
          label: "Nada: el valor se devuelve, pero nadie lo muestra",
          correct: true,
          feedback: "Correcto.",
        },
        {
          id: "b",
          label: "16",
          isCode: true,
          feedback: "`return` no muestra nada. Para verlo haría falta `echo cuadrado(4);`.",
          misconceptionId: "return-prints",
        },
        { id: "c", label: "4", isCode: true, feedback: "No hay ningún `echo` en el programa." },
        { id: "d", label: "Un error", feedback: "Llamar a una función sin usar su valor es válido." },
      ],
      hints: [
        "¿Hay algún `echo` en el programa?",
        "`return` entrega el valor a la línea 6. ¿Qué hace la línea 6 con él?",
        "La línea 6 no guarda ni muestra el valor.",
      ],
      explanation: "El 16 se devuelve, pero se pierde porque nadie lo muestra ni lo guarda.",
    },
    {
      id: "comprobacion-2",
      kind: "choice",
      phase: "check",
      provenance: "reinforcement",
      concepts: ["return-vs-echo"],
      prompt: "Después de ejecutar este programa, ¿qué valor tiene `$x`?",
      code: php`
        <?php
        function triple($n) {
            echo $n * 3;
        }

        $x = triple(2);
      `,
      options: [
        {
          id: "a",
          label: "Ninguno (null): la función muestra 6, pero no devuelve nada",
          correct: true,
          feedback: "Correcto.",
        },
        {
          id: "b",
          label: "6",
          isCode: true,
          feedback: "La función muestra 6 con `echo`, pero no lo devuelve: no tiene `return`.",
          misconceptionId: "echo-returns",
        },
        { id: "c", label: "2", isCode: true, feedback: "`$x` recibe lo que devuelve la función, no el argumento." },
        { id: "d", label: "triple", isCode: true, feedback: "`$x` recibe el valor devuelto, no el nombre." },
      ],
      hints: [
        "¿La función tiene `return`?",
        "Repasa la segunda explicación: ¿qué devuelve una función que solo hace `echo`?",
        "Sin `return`, la función devuelve `null`.",
      ],
      explanation: "Para que `$x` valga 6, la función tendría que hacer `return $n * 3;`.",
    },
    {
      id: "guiado",
      kind: "fill",
      phase: "guided",
      provenance: "reinforcement",
      concepts: ["return-vs-echo"],
      prompt: "Completa el programa para que la función devuelva la mitad y el programa muestre «La mitad es 5».",
      template: php`
        <?php
        function mitad($numero) {
            [[b1]] $numero / 2;
        }

        $m = mitad(10);
        echo "La mitad es " . [[b2]] . "\n";
      `,
      blanks: [
        {
          id: "b1",
          label: "Hueco 1: palabra para devolver el valor",
          accept: ["return"],
          wrong: [
            {
              match: ["echo", "print"],
              feedback: "Con `echo` la función mostraría el 5, pero `$m` quedaría vacía. Hay que devolverlo.",
              misconceptionId: "echo-returns",
            },
          ],
        },
        {
          id: "b2",
          label: "Hueco 2: valor que se muestra",
          accept: ["$m", "mitad(10)"],
          wrong: [
            { match: ["m"], feedback: "Las variables llevan `$`.", misconceptionId: "param-without-dollar" },
            {
              match: ["$numero"],
              feedback: "`$numero` solo existe dentro de la función. Fuera, el resultado está guardado en otra variable.",
              misconceptionId: "outer-variable",
            },
          ],
        },
      ],
      hints: [
        "La línea 6 guarda el resultado de `mitad(10)`. ¿Qué tiene que hacer la función para que haya algo que guardar?",
        "El primer hueco es la palabra que entrega el valor. El segundo, la variable donde se guardó.",
        "Mira la línea 6: el resultado está en `$m`.",
      ],
      explanation: "`return` entrega 5, que se guarda en `$m` y después se muestra.",
    },
    {
      id: "autonomo",
      kind: "order",
      phase: "practice",
      provenance: "reinforcement",
      concepts: ["return-vs-echo", "return-value"],
      prompt:
        "Construye un programa en el que `sumar` devuelva el resultado, se guarde en `$total` y después se muestre. Una línea sobra.",
      expectedOutput: output("Total: 15"),
      lines: [
        { id: "l1", text: "<?php" },
        { id: "l2", text: "function sumar($a, $b) {" },
        { id: "l3", text: "    return $a + $b;" },
        { id: "l4", text: "}" },
        { id: "l5", text: "$total = sumar(7, 8);" },
        { id: "l6", text: String.raw`echo "Total: " . $total . "\n";` },
        {
          id: "d1",
          text: "    echo $a + $b;",
          distractor: true,
          feedback: "Si la función hace `echo` en lugar de `return`, `$total` quedaría vacía y se mostraría 15 suelto.",
          misconceptionId: "echo-returns",
        },
      ],
      solution: ["l1", "l2", "l3", "l4", "l5", "l6"],
      hints: [
        "La función tiene que devolver la suma, no mostrarla.",
        "Después de la definición, primero se guarda el resultado y luego se muestra.",
        "El cuerpo de la función es una sola línea con `return`.",
      ],
      explanation: "`sumar` devuelve 15, se guarda en `$total` y el `echo` final lo muestra con su texto.",
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
        concepts: ["return-vs-echo"],
        prompt: "¿Qué hace `return` dentro de una función?",
        options: [
          {
            id: "a",
            label: "Entrega un valor a quien llamó a la función y la termina",
            correct: true,
            feedback: "Correcto.",
          },
          {
            id: "b",
            label: "Muestra un valor en pantalla",
            feedback: "Eso lo hace `echo`. `return` no muestra nada.",
            misconceptionId: "return-prints",
          },
          { id: "c", label: "Vuelve a ejecutar la función desde el principio", feedback: "`return` termina la función." },
          {
            id: "d",
            label: "Guarda el valor en una variable con el mismo nombre que la función",
            feedback: "El valor se entrega a la llamada; tú decides dónde guardarlo.",
          },
        ],
        hints: [],
        explanation: "`return` devuelve el valor y termina la función.",
      },
      {
        id: "dominio-2",
        kind: "choice",
        phase: "mastery",
        provenance: "reinforcement",
        concepts: ["return-vs-echo", "return-value"],
        prompt: "¿Qué muestra este programa?",
        code: php`
          <?php
          function prueba() {
              return "uno";
              echo "dos";
          }

          echo prueba() . "\n";
        `,
        options: [
          { id: "a", label: "uno", isCode: true, correct: true, feedback: "Correcto." },
          {
            id: "b",
            label: "unodos",
            isCode: true,
            feedback: "`return` termina la función: el `echo \"dos\"` nunca se ejecuta.",
            misconceptionId: "code-after-return",
          },
          {
            id: "c",
            label: "dos",
            isCode: true,
            feedback: "La función devuelve «uno» y termina antes de llegar al `echo`.",
            misconceptionId: "code-after-return",
          },
          {
            id: "d",
            label: "Nada",
            feedback: "La línea 7 hace `echo` del valor devuelto.",
            misconceptionId: "return-prints",
          },
        ],
        hints: [],
        explanation: "Devuelve «uno» y termina; el programa lo muestra.",
      },
      {
        id: "dominio-3",
        kind: "choice",
        phase: "mastery",
        provenance: "reinforcement",
        concepts: ["return-vs-echo"],
        prompt:
          "Quieres una función que calcule el IVA de un precio para después sumarlo al total de una factura. ¿Qué debe usar?",
        options: [
          { id: "a", label: "`return`, para poder usar el resultado en la suma", correct: true, feedback: "Correcto." },
          {
            id: "b",
            label: "`echo`, porque así el resultado se guarda",
            feedback: "`echo` solo muestra; el valor no podría usarse en la suma.",
            misconceptionId: "echo-returns",
          },
          { id: "c", label: "Da igual, hacen lo mismo", feedback: "No hacen lo mismo: solo `return` entrega el valor." },
          { id: "d", label: "Ninguna de las dos", feedback: "Necesitas que la función entregue el resultado." },
        ],
        hints: [],
        explanation: "Si vas a operar con el resultado, devuélvelo.",
      },
      {
        id: "dominio-4",
        kind: "fill",
        phase: "mastery",
        provenance: "reinforcement",
        concepts: ["return-vs-echo"],
        prompt: "Completa la última línea para que el programa muestre 8.",
        template: php`
          <?php
          function cubo($n) {
              return $n * $n * $n;
          }

          [[b1]] cubo(2) . "\n";
        `,
        blanks: [
          {
            id: "b1",
            label: "Hueco 1: instrucción para mostrar",
            accept: ["echo", "print"],
            wrong: [
              {
                match: ["return"],
                feedback: "`return` fuera de una función no muestra nada: termina el programa.",
                misconceptionId: "return-prints",
              },
            ],
          },
        ],
        hints: [],
        explanation: "La función devuelve 8 y `echo` lo muestra.",
      },
    ],
  },
};
