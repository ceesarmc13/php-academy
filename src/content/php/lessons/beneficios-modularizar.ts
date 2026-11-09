import type { Lesson } from "@/domain/curriculum";
import { output, php } from "../php-tag";

/**
 * Lección 1.2 — Beneficios de modularizar
 * Explicaciones y ejercicios escritos por PHP Academy, basados en el temario del Tema 3.
 * Todos los ejercicios son de refuerzo (no proceden del documento original).
 */

const tiendaSinFuncion = php`
  <?php
  echo "====================\n";
  echo "   TIENDA ONLINE\n";
  echo "====================\n";
  echo "Productos en el carrito: 3\n";
  echo "====================\n";
  echo "   TIENDA ONLINE\n";
  echo "====================\n";
  echo "Total: 45 euros\n";
`;

export const beneficiosModularizar: Lesson = {
  id: "t3-beneficios-modularizar",
  code: "1.2",
  title: "Beneficios de modularizar",
  summary: "Por qué conviene dividir un programa en funciones y cómo eliminar código repetido.",
  objectives: [
    "Reconocer código repetido que conviene convertir en función.",
    "Explicar los beneficios de modularizar: reutilizar, leer, mantener y corregir.",
    "Transformar un bloque repetido en una función y sus llamadas.",
  ],
  prerequisites: ["t3-que-es-una-funcion"],
  concepts: ["modularity", "reuse", "function-call"],
  estimatedMinutes: 10,
  contentStatus: "ready",
  keyIdeas: [
    "Modularizar es dividir un programa en partes pequeñas, cada una con una tarea concreta.",
    "Si un bloque se repite, conviértelo en una función: se escribe una vez y se llama donde haga falta.",
    "Un cambio en el cuerpo de la función se aplica en todas las llamadas.",
  ],
  steps: [
    {
      id: "explicacion-1",
      kind: "explanation",
      phase: "explanation",
      title: "El problema del código repetido",
      body: [
        "Mira este programa: muestra una cabecera, un dato, otra vez la cabecera y otro dato.",
        "Funciona, pero tiene un problema: las tres líneas de la cabecera están escritas **dos veces**. Si mañana quieres cambiar «TIENDA ONLINE» por otro nombre, tendrás que encontrar y cambiar cada copia. Si se te olvida una, el programa mostrará cosas distintas sin que te des cuenta.",
        "Y esto es un ejemplo pequeño: en un programa real, el mismo bloque puede repetirse decenas de veces.",
      ],
      codeCaption: "Versión sin funciones",
      code: tiendaSinFuncion,
      keyIdea: "Copiar y pegar código multiplica el trabajo y los errores cuando hay que cambiarlo.",
    },
    {
      id: "explicacion-2",
      kind: "explanation",
      phase: "explanation",
      title: "Modularizar: dividir en piezas con nombre",
      body: [
        "**Modularizar** es dividir un programa en partes más pequeñas, cada una con una tarea concreta. En PHP, la forma más sencilla de hacerlo es con funciones.",
        "Estas son sus ventajas:",
      ],
      points: [
        "**Reutilizar:** escribes el código una vez y lo usas todas las veces que quieras.",
        "**Leer mejor:** un nombre como `mostrarCabecera()` explica qué hace el código sin tener que leerlo entero.",
        "**Mantener:** si hay que cambiar algo, se cambia en un solo sitio.",
        "**Corregir errores:** si algo falla, sabes en qué pieza buscar.",
        "**Repartir el trabajo:** en un equipo, cada persona puede encargarse de unas funciones.",
      ],
      keyIdea:
        "Modularizar hace el código más fácil de leer, reutilizar y mantener. Es una mejora para las personas que lo escriben, no para la velocidad del programa.",
    },
    {
      id: "ejemplo",
      kind: "example",
      phase: "example",
      title: "El mismo programa, modularizado",
      intro:
        "La cabecera repetida se ha convertido en la función `mostrarCabecera`. Compara la salida con la del programa original: es idéntica.",
      code: php`
        <?php
        function mostrarCabecera() {
            echo "====================\n";
            echo "   TIENDA ONLINE\n";
            echo "====================\n";
        }

        mostrarCabecera();
        echo "Productos en el carrito: 3\n";
        mostrarCabecera();
        echo "Total: 45 euros\n";
      `,
      annotations: [
        { line: 2, text: "Se define la función con un nombre que describe lo que hace: mostrar la cabecera." },
        { line: 3, text: "Las tres líneas que antes estaban repetidas ahora están solo aquí, en el cuerpo." },
        { line: 6, text: "Fin de la definición. Para cambiar el nombre de la tienda bastaría con tocar la línea 4." },
        { line: 8, text: "Primera llamada: se muestra la cabecera." },
        { line: 9, text: "El resto del programa no cambia." },
        { line: 10, text: "Segunda llamada: se reutiliza la cabecera sin copiar código." },
      ],
      expectedOutput: output(
        "====================",
        "   TIENDA ONLINE",
        "====================",
        "Productos en el carrito: 3",
        "====================",
        "   TIENDA ONLINE",
        "====================",
        "Total: 45 euros",
      ),
    },
    {
      id: "comprobacion-1",
      kind: "choice",
      phase: "check",
      provenance: "reinforcement",
      concepts: ["modularity", "reuse"],
      prompt:
        "En la versión con función quieres cambiar «TIENDA ONLINE» por «MI TIENDA». ¿Cuántas líneas tienes que modificar?",
      options: [
        { id: "a", label: "Una: la del cuerpo de la función", correct: true, feedback: "Exacto." },
        {
          id: "b",
          label: "Dos: una por cada llamada",
          feedback:
            "Las llamadas solo dicen «ejecuta la función». El texto está en el cuerpo, así que basta con cambiarlo allí.",
          misconceptionId: "refactor-change-everywhere",
        },
        {
          id: "c",
          label: "Seis: todas las líneas de la cabecera",
          feedback: "Eso pasaba en la versión sin función. Ahora la cabecera solo está escrita una vez.",
          misconceptionId: "refactor-change-everywhere",
        },
        {
          id: "d",
          label: "Hay que reescribir la función entera",
          feedback: "No hace falta: solo cambia una línea de su cuerpo.",
        },
      ],
      hints: [
        "¿Dónde está escrito el texto «TIENDA ONLINE» en la versión con función?",
        "Búscalo en el ejemplo: aparece en la línea 4, dentro del cuerpo.",
        "Las llamadas no contienen el texto; solo ejecutan el cuerpo.",
      ],
      explanation: "El texto vive en un solo sitio y el cambio llega a todas las llamadas.",
    },
    {
      id: "comprobacion-2",
      kind: "choice",
      phase: "check",
      provenance: "reinforcement",
      concepts: ["modularity"],
      prompt: "¿Cuál de estas afirmaciones NO es un beneficio de modularizar?",
      options: [
        {
          id: "a",
          label: "Reutilizar el mismo código en varios sitios",
          feedback: "Sí es un beneficio: es justo lo que hace `mostrarCabecera()`.",
        },
        {
          id: "b",
          label: "Que el código sea más fácil de leer",
          feedback: "Sí es un beneficio: un buen nombre de función explica qué hace el bloque.",
        },
        {
          id: "c",
          label: "Que el programa se ejecute siempre más rápido",
          correct: true,
          feedback: "Correcto: esa no es una ventaja de modularizar.",
        },
        {
          id: "d",
          label: "Localizar y corregir errores con más facilidad",
          feedback: "Sí es un beneficio: si la cabecera sale mal, sabes que el problema está en una sola función.",
        },
      ],
      hints: [
        "Repasa la lista de ventajas de la explicación.",
        "Tres de las opciones aparecen en esa lista. Una no.",
        "Piensa: ¿las ventajas son para el ordenador o para las personas que escriben el código?",
      ],
      explanation:
        "Modularizar no acelera el programa: mejora cómo se escribe, se lee y se mantiene.",
    },
    {
      id: "guiado",
      kind: "fill",
      phase: "guided",
      provenance: "reinforcement",
      concepts: ["function-definition", "function-call", "reuse"],
      prompt:
        "Este programa repetía un aviso dos veces. Completa la versión modularizada: escribe el nombre de la función en su definición y la segunda llamada.",
      template: php`
        <?php
        function [[b1]]() {
            echo "*** Aviso importante ***\n";
        }

        mostrarAviso();
        echo "El aula cierra a las 21:00\n";
        [[b2]];
      `,
      blanks: [
        {
          id: "b1",
          label: "Hueco 1: nombre de la función",
          accept: ["mostrarAviso"],
          wrong: [
            {
              match: ["mostrarAviso()"],
              feedback: "Los paréntesis ya están escritos después del hueco. Escribe solo el nombre.",
            },
          ],
        },
        {
          id: "b2",
          label: "Hueco 2: segunda llamada a la función",
          accept: ["mostrarAviso()", "mostrarAviso();"],
          wrong: [
            {
              match: ["mostrarAviso"],
              feedback: "Para llamar a la función hacen falta los paréntesis: nombre seguido de `()`.",
              misconceptionId: "call-without-parentheses",
            },
          ],
        },
      ],
      hints: [
        "La definición tiene que usar el mismo nombre que las llamadas.",
        "Mira la línea 6: ahí ya hay una llamada escrita. ¿Qué nombre usa?",
        "El segundo hueco es igual que la línea 6, sin el punto y coma final.",
      ],
      explanation:
        "La definición usa el nombre `mostrarAviso` y la segunda llamada reutiliza el aviso sin repetir el `echo`.",
    },
    {
      id: "autonomo",
      kind: "order",
      phase: "practice",
      provenance: "reinforcement",
      concepts: ["reuse", "function-definition", "function-call", "execution-flow"],
      prompt:
        "Este programa repetía la misma línea de guiones tres veces. Ordena las líneas para obtener la salida esperada usando la función `separador`. Escribe primero la definición. Una de las líneas sobra.",
      expectedOutput: output("----------", "Nombre: Ana", "----------", "Nota: 8", "----------"),
      lines: [
        { id: "l1", text: "<?php" },
        { id: "l2", text: "function separador() {" },
        { id: "l3", text: String.raw`    echo "----------\n";` },
        { id: "l4", text: "}" },
        { id: "l5", text: "separador();" },
        { id: "l6", text: String.raw`echo "Nombre: Ana\n";` },
        { id: "l7", text: "separador();" },
        { id: "l8", text: String.raw`echo "Nota: 8\n";` },
        { id: "l9", text: "separador();" },
        {
          id: "d1",
          text: "function separador {",
          distractor: true,
          feedback:
            "`function separador {` no es válida: en la definición los paréntesis son obligatorios aunque estén vacíos.",
          misconceptionId: "definition-without-parentheses",
        },
      ],
      solution: ["l1", "l2", "l3", "l4", "l5", "l6", "l7", "l8", "l9"],
      hints: [
        "Empieza por `<?php` y la definición completa de la función.",
        "Mira la salida esperada: hay una línea de guiones antes, entre y después de los datos. Cada una es una llamada.",
        "Después de la definición, el programa alterna: llamada, dato, llamada, dato, llamada.",
      ],
      explanation:
        "Una definición y tres llamadas: la línea de guiones está escrita una sola vez y aparece tres veces.",
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
        concepts: ["modularity"],
        prompt: "¿Qué significa modularizar un programa?",
        options: [
          {
            id: "a",
            label: "Dividirlo en partes pequeñas, cada una con una tarea concreta",
            correct: true,
            feedback: "Correcto.",
          },
          {
            id: "b",
            label: "Escribirlo todo en el menor número de líneas posible",
            feedback: "Modularizar es organizar el código en piezas, no compactarlo.",
          },
          {
            id: "c",
            label: "Copiar el código repetido en varios archivos",
            feedback: "Copiar código es justo lo que se quiere evitar. Modularizar es crear piezas reutilizables.",
          },
          {
            id: "d",
            label: "Conseguir que se ejecute más rápido",
            feedback: "El objetivo de modularizar es que el código sea más fácil de leer y mantener, no más rápido.",
            misconceptionId: "modularity-speed",
          },
        ],
        hints: [],
        explanation: "Modularizar es dividir en piezas con una tarea concreta.",
      },
      {
        id: "dominio-2",
        kind: "choice",
        phase: "mastery",
        provenance: "reinforcement",
        concepts: ["function-call"],
        prompt: "¿Qué muestra este programa?",
        code: php`
          <?php
          function titulo() {
              echo "== Notas ==\n";
          }

          titulo();
          titulo();
        `,
        options: [
          {
            id: "a",
            label: output("== Notas ==", "== Notas =="),
            isCode: true,
            correct: true,
            feedback: "Correcto.",
          },
          {
            id: "b",
            label: "== Notas ==",
            isCode: true,
            feedback: "Hay dos llamadas, así que el cuerpo se ejecuta dos veces.",
            misconceptionId: "calls-count",
          },
          {
            id: "c",
            label: "No muestra nada",
            feedback: "Las líneas `titulo();` son llamadas: cada una ejecuta el cuerpo de la función.",
            misconceptionId: "calls-count",
          },
          {
            id: "d",
            label: output("titulo", "titulo"),
            isCode: true,
            feedback: "Una llamada ejecuta el cuerpo de la función; no muestra su nombre.",
          },
        ],
        hints: [],
        explanation: "Dos llamadas, dos ejecuciones del cuerpo.",
      },
      {
        id: "dominio-3",
        kind: "choice",
        phase: "mastery",
        provenance: "reinforcement",
        concepts: ["modularity", "reuse"],
        prompt:
          "Tienes el mismo bloque de 5 líneas repetido en 4 partes del programa. ¿Qué es lo más recomendable?",
        options: [
          {
            id: "a",
            label: "Crear una función con ese bloque y llamarla en las 4 partes",
            correct: true,
            feedback: "Correcto.",
          },
          {
            id: "b",
            label: "Dejarlo así: si funciona, no hay que tocarlo",
            feedback:
              "Funciona, pero cada cambio futuro habrá que hacerlo 4 veces, con el riesgo de olvidar alguna copia.",
          },
          {
            id: "c",
            label: "Crear 4 funciones distintas, una para cada parte",
            feedback: "Si el bloque es idéntico, basta con una función. Cuatro funciones iguales mantienen la repetición.",
          },
          {
            id: "d",
            label: "Borrar tres de las copias",
            feedback: "El programa dejaría de mostrar ese bloque en tres sitios. Se trata de no repetir código, no de perder funcionalidad.",
          },
        ],
        hints: [],
        explanation: "Una función con el bloque y una llamada en cada sitio donde se necesita.",
      },
      {
        id: "dominio-4",
        kind: "fill",
        phase: "mastery",
        provenance: "reinforcement",
        concepts: ["function-definition", "function-call"],
        prompt: "Completa el programa para que muestre «Bienvenida» dos veces.",
        template: php`
          <?php
          [[b1]] bienvenida() {
              echo "Bienvenida\n";
          }

          bienvenida();
          [[b2]];
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
            label: "Hueco 2: segunda llamada",
            accept: ["bienvenida()", "bienvenida();"],
            wrong: [
              {
                match: ["bienvenida"],
                feedback: "Faltan los paréntesis para que la función se ejecute.",
                misconceptionId: "call-without-parentheses",
              },
            ],
          },
        ],
        hints: [],
        explanation: "`function` define y `bienvenida();` vuelve a ejecutarla.",
      },
    ],
  },
};
