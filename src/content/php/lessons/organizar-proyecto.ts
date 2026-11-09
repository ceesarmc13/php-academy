import type { Lesson } from "@/domain/curriculum";
import { output, php } from "../php-tag";

/**
 * Lección 5.3 — Organizar un proyecto en varios archivos
 * Contenido de PHP Academy basado en el índice del Tema 3. Ejercicios de refuerzo.
 */

const matematicas = {
  name: "lib/matematicas.php",
  code: php`
    <?php
    function media($a, $b, $c) {
        return ($a + $b + $c) / 3;
    }
  `,
};

const textos = {
  name: "lib/textos.php",
  code: php`
    <?php
    function titulo($texto) {
        return "== " . $texto . " ==";
    }
  `,
};

const precios = {
  name: "lib/precios.php",
  code: php`
    <?php
    function conIva($precio) {
        return $precio * 1.21;
    }
  `,
};

export const organizarProyecto: Lesson = {
  id: "t3-organizar-proyecto",
  code: "5.3",
  title: "Organizar un proyecto en varios archivos",
  summary: "Repartir un programa en archivos con una responsabilidad clara y escribir rutas que no fallen.",
  objectives: [
    "Separar funciones y programa principal en archivos distintos.",
    "Elegir una estructura de carpetas sencilla.",
    "Escribir rutas de inclusión con `__DIR__`.",
  ],
  prerequisites: ["t3-include-once-require-once"],
  concepts: ["multi-file"],
  estimatedMinutes: 12,
  contentStatus: "ready",
  keyIdeas: [
    "`index.php` contiene el programa principal; las funciones se agrupan por tema en archivos de una carpeta como `lib/`.",
    "Un archivo de funciones solo define funciones: nada de `echo` sueltos.",
    "`__DIR__ . \"/lib/archivo.php\"` construye la ruta desde la carpeta del archivo actual.",
  ],
  steps: [
    {
      id: "explicacion-1",
      kind: "explanation",
      phase: "explanation",
      title: "Cada archivo, una responsabilidad",
      body: [
        "Un proyecto ordenado se entiende de un vistazo. Una organización sencilla y muy habitual es esta:",
      ],
      points: [
        "**`index.php`:** el programa principal. Incluye lo que necesita y llama a las funciones.",
        "**Carpeta `lib/`:** los archivos de funciones, agrupados por tema: `matematicas.php`, `textos.php`…",
        "**Nombres en minúsculas y descriptivos:** al ver `textos.php` ya sabes qué hay dentro.",
        "**Los archivos de funciones solo definen funciones:** si tienen un `echo` suelto, ese texto aparecerá en todos los programas que los incluyan.",
      ],
      codeCaption: "Estructura del proyecto",
      code: php`
        mi-proyecto/
        ├── index.php
        └── lib/
            ├── matematicas.php
            └── textos.php
      `,
      keyIdea: "Programa principal en `index.php`; funciones agrupadas por tema en `lib/`.",
    },
    {
      id: "explicacion-2",
      kind: "explanation",
      phase: "explanation",
      title: "Rutas que no fallan: __DIR__",
      body: [
        "Para incluir un archivo de otra carpeta escribes su ruta: `require_once \"lib/textos.php\";`. Con una ruta relativa, PHP busca el archivo en varios sitios (la configuración `include_path`, la carpeta desde la que se ejecuta…), y en proyectos con subcarpetas puede acabar encontrando otro archivo o ninguno.",
        "`__DIR__` es una constante especial que contiene **la carpeta del archivo en el que está escrita**. Si la usas para construir la ruta, siempre apuntará al sitio correcto.",
        "`__DIR__` no termina en barra, así que la ruta que le unes con el punto debe empezar por `/`.",
      ],
      codeCaption: "index.php",
      code: php`
        <?php
        require_once __DIR__ . "/lib/textos.php";
      `,
      keyIdea: "`__DIR__ . \"/lib/textos.php\"`: carpeta actual + barra + ruta del archivo.",
    },
    {
      id: "ejemplo",
      kind: "example",
      phase: "example",
      title: "Un proyecto pequeño, bien organizado",
      intro: "Dos archivos de funciones en `lib/` y un `index.php` que los usa.",
      otherFiles: [matematicas, textos],
      fileName: "index.php",
      code: php`
        <?php
        require_once __DIR__ . "/lib/matematicas.php";
        require_once __DIR__ . "/lib/textos.php";

        echo titulo("Notas de Ana") . "\n";
        echo "Media: " . media(6, 7, 8) . "\n";
      `,
      annotations: [
        { line: 2, text: "Ruta construida desde la carpeta de `index.php`. Las funciones son imprescindibles: `require_once`." },
        { line: 3, text: "Segundo archivo de funciones, del mismo modo." },
        { line: 5, text: "`titulo` (de `textos.php`) devuelve el texto decorado, y aquí se muestra." },
        { line: 6, text: "`media` (de `matematicas.php`) devuelve (6 + 7 + 8) / 3 = 7." },
      ],
      expectedOutput: output("== Notas de Ana ==", "Media: 7"),
    },
    {
      id: "comprobacion-1",
      kind: "choice",
      phase: "check",
      provenance: "reinforcement",
      concepts: ["multi-file"],
      prompt: "¿Qué debería contener un archivo de funciones como `lib/matematicas.php`?",
      options: [
        { id: "a", label: "Solo definiciones de funciones", correct: true, feedback: "Correcto." },
        {
          id: "b",
          label: "Definiciones de funciones y algunos `echo` para comprobar que funcionan",
          feedback: "Esos `echo` aparecerían en todos los programas que incluyan el archivo.",
          misconceptionId: "library-side-effects",
        },
        { id: "c", label: "El programa principal", feedback: "El programa principal va en `index.php`." },
        { id: "d", label: "Copias de las funciones de los demás archivos", feedback: "Eso duplicaría código y funciones." },
      ],
      hints: [
        "Piensa en qué pasa cuando otro archivo lo incluye.",
        "Repasa la lista de la primera explicación.",
        "Un archivo de funciones no debería mostrar nada por sí solo.",
      ],
      explanation: "Las bibliotecas de funciones solo definen; el programa principal decide qué ejecutar.",
    },
    {
      id: "comprobacion-2",
      kind: "choice",
      phase: "check",
      provenance: "reinforcement",
      concepts: ["multi-file"],
      prompt: "¿Qué contiene `__DIR__`?",
      options: [
        {
          id: "a",
          label: "La carpeta del archivo en el que está escrito",
          correct: true,
          feedback: "Correcto.",
        },
        { id: "b", label: "La carpeta raíz del disco", feedback: "Contiene la carpeta del archivo actual." },
        {
          id: "c",
          label: "La carpeta desde la que se ejecuta PHP",
          feedback: "Esa puede ser otra. Precisamente por eso `__DIR__` es más fiable.",
        },
        { id: "d", label: "El nombre de una función", feedback: "Es una constante especial de PHP." },
      ],
      hints: [
        "Repasa la segunda explicación.",
        "La ventaja de `__DIR__` es que no depende de dónde ejecutes PHP.",
        "Depende del archivo en el que aparece.",
      ],
      explanation: "`__DIR__` es la carpeta del archivo actual, sin barra final.",
    },
    {
      id: "guiado",
      kind: "fill",
      phase: "guided",
      provenance: "reinforcement",
      concepts: ["multi-file"],
      prompt:
        "Completa `index.php` para incluir `lib/textos.php` con `__DIR__` y usar su función, de modo que muestre «== Bienvenida ==».",
      context: [textos],
      template: php`
        <?php
        require_once __DIR__ . [[b1]];

        echo [[b2]]("Bienvenida") . "\n";
      `,
      blanks: [
        {
          id: "b1",
          label: "Hueco 1: ruta del archivo, entre comillas",
          accept: ['"/lib/textos.php"', "'/lib/textos.php'"],
          wrong: [
            {
              match: ['"lib/textos.php"', "'lib/textos.php'"],
              feedback: "Falta la barra inicial: `__DIR__` no termina en `/`.",
              misconceptionId: "path-slash",
            },
            {
              match: ["/lib/textos.php"],
              feedback: "La ruta es un texto: va entre comillas.",
              misconceptionId: "file-name-without-quotes",
            },
          ],
        },
        {
          id: "b2",
          label: "Hueco 2: nombre de la función",
          accept: ["titulo"],
          wrong: [{ match: ["textos"], feedback: "`textos` es el nombre del archivo, no de la función." }],
        },
      ],
      hints: [
        "La ruta va entre comillas y empieza por una barra.",
        "Mira el archivo `lib/textos.php`: ¿cómo se llama su función?",
        "Primer hueco: comillas, barra, `lib/textos.php`. Segundo: el nombre de la función.",
      ],
      explanation: "`__DIR__ . \"/lib/textos.php\"` encuentra el archivo y `titulo` decora el texto.",
    },
    {
      id: "autonomo",
      kind: "order",
      phase: "practice",
      provenance: "reinforcement",
      concepts: ["multi-file", "include-once"],
      prompt:
        "Construye `index.php` para obtener la salida esperada usando `lib/precios.php` y `lib/textos.php`. Incluye primero `precios.php`. Una línea sobra.",
      context: [precios, textos],
      expectedOutput: output("== Factura ==", "Total: 121 euros"),
      lines: [
        { id: "l1", text: "<?php" },
        { id: "l2", text: 'require_once __DIR__ . "/lib/precios.php";' },
        { id: "l3", text: 'require_once __DIR__ . "/lib/textos.php";' },
        { id: "l4", text: String.raw`echo titulo("Factura") . "\n";` },
        { id: "l5", text: String.raw`echo "Total: " . conIva(100) . " euros\n";` },
        {
          id: "d1",
          text: 'require_once __DIR__ . "lib/textos.php";',
          distractor: true,
          feedback: "A esta ruta le falta la barra inicial: `__DIR__` no termina en `/`.",
          misconceptionId: "path-slash",
        },
      ],
      solution: ["l1", "l2", "l3", "l4", "l5"],
      hints: [
        "Primero `<?php` y las inclusiones.",
        "Compara las dos líneas que incluyen `textos.php`: una tiene un fallo en la ruta.",
        "Mira la salida: primero el título y después el total.",
      ],
      explanation: "Inclusiones con rutas correctas y después el programa principal.",
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
        concepts: ["multi-file"],
        prompt: "En la organización que has visto, ¿dónde va el programa principal?",
        options: [
          { id: "a", label: "En index.php", correct: true, feedback: "Correcto." },
          { id: "b", label: "En lib/matematicas.php", feedback: "En `lib/` van los archivos de funciones." },
          {
            id: "c",
            label: "Repartido entre todos los archivos",
            feedback: "Cada archivo tiene una responsabilidad; el programa principal está en uno solo.",
            misconceptionId: "library-side-effects",
          },
          { id: "d", label: "En un archivo llamado lib.php", feedback: "`lib/` es una carpeta para las funciones." },
        ],
        hints: [],
        explanation: "`index.php` es el punto de entrada.",
      },
      {
        id: "dominio-2",
        kind: "choice",
        phase: "mastery",
        provenance: "reinforcement",
        concepts: ["multi-file"],
        prompt: "¿Por qué es mejor `require_once __DIR__ . \"/lib/a.php\";` que `require_once \"lib/a.php\";`?",
        options: [
          {
            id: "a",
            label: "Porque la ruta se construye desde la carpeta del archivo y siempre apunta al mismo sitio",
            correct: true,
            feedback: "Correcto.",
          },
          { id: "b", label: "Porque es más rápida", feedback: "La ventaja es la fiabilidad, no la velocidad." },
          { id: "c", label: "Porque incluye el archivo dos veces", feedback: "`require_once` nunca lo incluye dos veces." },
          {
            id: "d",
            label: "No hay ninguna diferencia",
            feedback: "Una ruta relativa depende de cómo la resuelva PHP; con `__DIR__` no hay dudas sobre qué archivo se incluye.",
          },
        ],
        hints: [],
        explanation: "`__DIR__` hace la ruta independiente de la carpeta de ejecución.",
      },
      {
        id: "dominio-3",
        kind: "choice",
        phase: "mastery",
        provenance: "reinforcement",
        concepts: ["multi-file"],
        prompt: "¿Qué muestra este `index.php`?",
        context: [
          {
            name: "lib/saludos.php",
            code: php`
              <?php
              echo "Cargando saludos\n";

              function hola() {
                  return "Hola";
              }
            `,
          },
        ],
        code: php`
          <?php
          require_once __DIR__ . "/lib/saludos.php";
          echo hola() . "\n";
        `,
        options: [
          {
            id: "a",
            label: output("Cargando saludos", "Hola"),
            isCode: true,
            correct: true,
            feedback: "Correcto: el `echo` suelto del archivo se ejecuta al incluirlo.",
          },
          {
            id: "b",
            label: "Hola",
            isCode: true,
            feedback: "Al incluir el archivo se ejecuta su `echo` suelto. Por eso no conviene ponerlos.",
            misconceptionId: "library-side-effects",
          },
          {
            id: "c",
            label: output("Hola", "Cargando saludos"),
            isCode: true,
            feedback: "El archivo se incluye en la línea 2, antes de llamar a `hola()`.",
            misconceptionId: "execution-order",
          },
          { id: "d", label: "Un error", feedback: "La ruta es correcta y la función existe." },
        ],
        hints: [],
        explanation: "Incluir ejecuta el código suelto del archivo: por eso las bibliotecas solo definen funciones.",
      },
      {
        id: "dominio-4",
        kind: "fill",
        phase: "mastery",
        provenance: "reinforcement",
        concepts: ["multi-file"],
        prompt: "Incluye `matematicas.php`, que está en la carpeta `lib`, usando `__DIR__`.",
        template: php`
          <?php
          require_once __DIR__ . [[b1]];
        `,
        blanks: [
          {
            id: "b1",
            label: "Hueco 1: ruta del archivo, entre comillas",
            accept: ['"/lib/matematicas.php"', "'/lib/matematicas.php'"],
            wrong: [
              {
                match: ['"lib/matematicas.php"', "'lib/matematicas.php'"],
                feedback: "Falta la barra inicial.",
                misconceptionId: "path-slash",
              },
            ],
          },
        ],
        hints: [],
        explanation: "`__DIR__ . \"/lib/matematicas.php\"`.",
      },
    ],
  },
};
