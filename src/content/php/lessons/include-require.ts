import type { Lesson } from "@/domain/curriculum";
import { output, php } from "../php-tag";

/**
 * Lección 5.1 — include y require
 * Contenido de PHP Academy basado en el índice del Tema 3. Ejercicios de refuerzo.
 */

const tienda = {
  name: "tienda.php",
  code: php`
    <?php
    function mostrarCabecera() {
        echo "== TIENDA ==\n";
    }

    function calcularTotal($unidades, $precio) {
        return $unidades * $precio;
    }
  `,
};

export const includeRequire: Lesson = {
  id: "t3-include-require",
  code: "5.1",
  title: "include y require",
  summary: "Usar en un archivo las funciones escritas en otro, y qué pasa si ese archivo no existe.",
  objectives: [
    "Incluir un archivo con `include` y con `require`.",
    "Explicar qué ocurre si el archivo no existe en cada caso.",
    "Incluir los archivos antes de usar sus funciones.",
  ],
  prerequisites: ["t3-funciones-con-retorno"],
  concepts: ["include-require"],
  estimatedMinutes: 12,
  contentStatus: "ready",
  keyIdeas: [
    "`include` y `require` incorporan el código de otro archivo en ese punto del programa.",
    "Si el archivo no existe, `include` avisa y sigue; `require` se detiene con un error fatal.",
    "Las funciones de otro archivo solo se pueden usar después de incluirlo.",
  ],
  steps: [
    {
      id: "explicacion-1",
      kind: "explanation",
      phase: "explanation",
      title: "Funciones en otro archivo",
      body: [
        "Cuando un programa crece, conviene separar las funciones en su propio archivo, por ejemplo `funciones.php`, y dejar el programa principal en `index.php`.",
        "Para usar esas funciones desde `index.php`, se incluye el archivo con `require` (o con `include`) seguido de su nombre entre comillas.",
        "Es como si PHP copiara y pegara el contenido de `funciones.php` justo en esa línea. A partir de ahí, sus funciones existen.",
      ],
      codeCaption: "funciones.php",
      code: php`
        <?php
        function saludar($nombre) {
            return "Hola, " . $nombre;
        }
      `,
      files: [
        {
          name: "index.php",
          code: php`
            <?php
            require "funciones.php";

            echo saludar("Ana") . "\n";
          `,
        },
      ],
      keyIdea: "Los dos archivos están en la misma carpeta, así que basta con escribir el nombre.",
    },
    {
      id: "explicacion-2",
      kind: "explanation",
      phase: "explanation",
      title: "La diferencia: qué pasa si falta el archivo",
      body: [
        "Mientras el archivo exista, `include` y `require` hacen lo mismo. La diferencia aparece cuando **no se encuentra**:",
      ],
      points: [
        "**`include`** muestra un aviso (warning) y el programa **continúa**. Si después usas una función de ese archivo, fallará entonces.",
        "**`require`** produce un error fatal y el programa **se detiene** en esa línea.",
      ],
      codeCaption: "Si config.php no existe",
      code: php`
        <?php
        include "config.php";   // Aviso, y el programa sigue
        echo "Sigo funcionando\n";

        require "config.php";   // Error fatal: el programa se detiene
        echo "Esto ya no se muestra\n";
      `,
      keyIdea:
        "Para archivos imprescindibles, como los de funciones, usa `require`: es mejor detenerse que seguir con el programa roto.",
    },
    {
      id: "ejemplo",
      kind: "example",
      phase: "example",
      title: "Un programa en dos archivos",
      intro: "`tienda.php` solo contiene funciones. `index.php` las incluye y las usa.",
      otherFiles: [tienda],
      fileName: "index.php",
      code: php`
        <?php
        require "tienda.php";

        mostrarCabecera();
        $total = calcularTotal(3, 10);
        echo "Total: " . $total . " euros\n";
      `,
      annotations: [
        { line: 2, text: "Se incluye `tienda.php`. Desde aquí existen `mostrarCabecera` y `calcularTotal`." },
        { line: 4, text: "Llamada a una función definida en el otro archivo." },
        { line: 5, text: "`calcularTotal` devuelve 3 × 10 = 30, que se guarda en `$total`." },
        { line: 6, text: "Se muestra el resultado." },
      ],
      expectedOutput: output("== TIENDA ==", "Total: 30 euros"),
    },
    {
      id: "comprobacion-1",
      kind: "choice",
      phase: "check",
      provenance: "reinforcement",
      concepts: ["include-require"],
      prompt: "Si `config.php` no existe, ¿qué ocurre con `include \"config.php\";`?",
      options: [
        {
          id: "a",
          label: "PHP muestra un aviso y el programa continúa",
          correct: true,
          feedback: "Correcto.",
        },
        {
          id: "b",
          label: "El programa se detiene con un error fatal",
          feedback: "Eso es lo que hace `require`. `include` solo avisa y sigue.",
          misconceptionId: "include-vs-require",
        },
        { id: "c", label: "No pasa nada y no hay ningún aviso", feedback: "PHP sí avisa de que no encuentra el archivo." },
        { id: "d", label: "PHP crea el archivo vacío", feedback: "PHP no crea archivos al incluirlos." },
      ],
      hints: [
        "Repasa la segunda explicación.",
        "Uno de los dos detiene el programa y el otro no.",
        "`include` es el que deja seguir.",
      ],
      explanation: "`include` avisa y continúa.",
    },
    {
      id: "comprobacion-2",
      kind: "choice",
      phase: "check",
      provenance: "reinforcement",
      concepts: ["include-require"],
      prompt: "El archivo `no_existe.php` no existe. ¿Se muestra «Fin»?",
      code: php`
        <?php
        require "no_existe.php";
        echo "Fin\n";
      `,
      options: [
        {
          id: "a",
          label: "No: `require` detiene el programa con un error fatal",
          correct: true,
          feedback: "Correcto.",
        },
        {
          id: "b",
          label: "Sí, después de un aviso",
          feedback: "Eso pasaría con `include`. `require` detiene el programa.",
          misconceptionId: "include-vs-require",
        },
        { id: "c", label: "Sí, sin ningún aviso", feedback: "`require` no puede seguir sin el archivo." },
        { id: "d", label: "Solo si el archivo está vacío", feedback: "El archivo no existe, ni vacío ni lleno." },
      ],
      hints: [
        "¿Es `include` o `require`?",
        "`require` significa «requerir»: sin el archivo no se puede seguir.",
        "Con `require`, el programa no pasa de la línea 2.",
      ],
      explanation: "`require` se detiene: «Fin» nunca se muestra.",
    },
    {
      id: "guiado",
      kind: "fill",
      phase: "guided",
      provenance: "reinforcement",
      concepts: ["include-require"],
      prompt:
        "Completa `index.php` para usar las funciones de `operaciones.php`. Si el archivo faltara, el programa debe detenerse.",
      context: [
        {
          name: "operaciones.php",
          code: php`
            <?php
            function sumar($a, $b) {
                return $a + $b;
            }
          `,
        },
      ],
      template: php`
        <?php
        [[b1]] "[[b2]]";

        echo sumar(2, 3) . "\n";
      `,
      blanks: [
        {
          id: "b1",
          label: "Hueco 1: instrucción para incluir el archivo",
          accept: ["require"],
          wrong: [
            {
              match: ["include"],
              feedback: "`include` incluiría el archivo, pero si faltara el programa seguiría. Se pide que se detenga.",
              misconceptionId: "include-vs-require",
            },
          ],
        },
        {
          id: "b2",
          label: "Hueco 2: nombre del archivo",
          accept: ["operaciones.php"],
          wrong: [
            { match: ["operaciones"], feedback: "Hay que escribir el nombre completo, con la extensión `.php`." },
          ],
        },
      ],
      hints: [
        "Necesitas la instrucción que detiene el programa si falta el archivo.",
        "El nombre del archivo aparece en el título del bloque de arriba.",
        "Primer hueco: `require`. Segundo: el nombre con su extensión.",
      ],
      explanation: "`require \"operaciones.php\";` incorpora `sumar` y detendría el programa si faltara.",
    },
    {
      id: "autonomo",
      kind: "order",
      phase: "practice",
      provenance: "reinforcement",
      concepts: ["include-require"],
      prompt:
        "Construye `index.php` usando las funciones de `tienda.php` para obtener la salida esperada. Una línea sobra.",
      context: [tienda],
      expectedOutput: output("== TIENDA ==", "Total: 30 euros"),
      lines: [
        { id: "l1", text: "<?php" },
        { id: "l2", text: 'require "tienda.php";' },
        { id: "l3", text: "mostrarCabecera();" },
        { id: "l4", text: String.raw`echo "Total: " . calcularTotal(3, 10) . " euros\n";` },
        {
          id: "d1",
          text: "require tienda.php;",
          distractor: true,
          feedback: "El nombre del archivo es un texto y va entre comillas.",
          misconceptionId: "file-name-without-quotes",
        },
      ],
      solution: ["l1", "l2", "l3", "l4"],
      hints: [
        "Antes de usar las funciones, hay que incluir el archivo.",
        "De las dos líneas con `require`, solo una escribe bien el nombre del archivo.",
        "Después, la cabecera y luego el total.",
      ],
      explanation: "Primero se incluye `tienda.php` y después se usan sus funciones.",
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
        concepts: ["include-require"],
        prompt: "¿Qué hace `require \"funciones.php\";`?",
        options: [
          {
            id: "a",
            label: "Incorpora en ese punto el código de funciones.php",
            correct: true,
            feedback: "Correcto.",
          },
          {
            id: "b",
            label: "Ejecuta todas las funciones de funciones.php",
            feedback: "Incluir un archivo de funciones solo las define; no las llama.",
            misconceptionId: "define-runs-function",
          },
          { id: "c", label: "Crea el archivo funciones.php", feedback: "`require` no crea archivos." },
          { id: "d", label: "Muestra el contenido del archivo en pantalla", feedback: "El código se ejecuta, no se muestra." },
        ],
        hints: [],
        explanation: "Es como pegar el contenido del archivo en esa línea.",
      },
      {
        id: "dominio-2",
        kind: "choice",
        phase: "mastery",
        provenance: "reinforcement",
        concepts: ["include-require"],
        prompt: "Si el archivo incluido no existe, ¿cuál de las dos instrucciones detiene el programa?",
        options: [
          { id: "a", label: "require", isCode: true, correct: true, feedback: "Correcto." },
          {
            id: "b",
            label: "include",
            isCode: true,
            feedback: "`include` solo muestra un aviso y sigue.",
            misconceptionId: "include-vs-require",
          },
          { id: "c", label: "Las dos", feedback: "Solo `require` detiene el programa." },
          { id: "d", label: "Ninguna", feedback: "`require` sí lo detiene." },
        ],
        hints: [],
        explanation: "`require` se detiene; `include` avisa y sigue.",
      },
      {
        id: "dominio-3",
        kind: "choice",
        phase: "mastery",
        provenance: "reinforcement",
        concepts: ["include-require"],
        prompt: "`saludos.php` define la función `saludar`. ¿Qué ocurre al ejecutar este `index.php`?",
        context: [
          {
            name: "saludos.php",
            code: php`
              <?php
              function saludar() {
                  echo "Hola\n";
              }
            `,
          },
        ],
        code: php`
          <?php
          saludar();
          require "saludos.php";
        `,
        options: [
          {
            id: "a",
            label: "Error: cuando se llama a `saludar()`, el archivo todavía no se ha incluido",
            correct: true,
            feedback: "Correcto.",
          },
          {
            id: "b",
            label: "Muestra «Hola»",
            feedback:
              "Las funciones de otro archivo solo existen después del `require`. Aquí se llama a `saludar` antes.",
            misconceptionId: "call-before-include",
          },
          { id: "c", label: "No muestra nada y no hay error", feedback: "La llamada a una función que no existe es un error." },
          {
            id: "d",
            label: "Muestra «Hola» dos veces",
            feedback: "Incluir el archivo no llama a la función.",
            misconceptionId: "define-runs-function",
          },
        ],
        hints: [],
        explanation: "Incluye siempre los archivos al principio, antes de usar sus funciones.",
      },
      {
        id: "dominio-4",
        kind: "fill",
        phase: "mastery",
        provenance: "reinforcement",
        concepts: ["include-require"],
        prompt: "Incluye `utilidades.php` de forma que, si faltara, el programa continúe.",
        template: php`
          <?php
          [[b1]] "utilidades.php";
          echo "Programa en marcha\n";
        `,
        blanks: [
          {
            id: "b1",
            label: "Hueco 1: instrucción para incluir",
            accept: ["include"],
            wrong: [
              {
                match: ["require"],
                feedback: "`require` detendría el programa si faltara el archivo.",
                misconceptionId: "include-vs-require",
              },
            ],
          },
        ],
        hints: [],
        explanation: "`include` avisa pero deja continuar.",
      },
    ],
  },
};
