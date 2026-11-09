import type { Concept, Misconception } from "@/domain/curriculum";

export const CONCEPTS = {
  "function-concept": { id: "function-concept", name: "Concepto de función" },
  "function-definition": { id: "function-definition", name: "Definir una función" },
  "function-call": { id: "function-call", name: "Llamar a una función" },
  "execution-flow": { id: "execution-flow", name: "Flujo de ejecución" },
  modularity: { id: "modularity", name: "Modularizar" },
  reuse: { id: "reuse", name: "Reutilizar código" },
  parameters: { id: "parameters", name: "Parámetros y argumentos" },
  "return-vs-echo": { id: "return-vs-echo", name: "return frente a echo" },
  "return-value": { id: "return-value", name: "Funciones con retorno" },
  "include-require": { id: "include-require", name: "include y require" },
  "include-once": { id: "include-once", name: "include_once y require_once" },
  "multi-file": { id: "multi-file", name: "Proyectos en varios archivos" },
} satisfies Record<string, Concept>;

export type KnownConceptId = keyof typeof CONCEPTS;

export function conceptName(id: string): string {
  return (CONCEPTS as Record<string, Concept>)[id]?.name ?? id;
}

/** Catalogue of typical mistakes. Wrong answers point here; the review phase explains them. */
export const MISCONCEPTIONS: Record<string, Misconception> = {
  "define-runs-function": {
    id: "define-runs-function",
    title: "Pensar que definir una función la ejecuta",
    explanation:
      "Escribir `function saludar() { … }` solo guarda las instrucciones con un nombre. No se ejecuta nada hasta que escribes la llamada `saludar();`. Es como apuntar una receta: no cocinas hasta que decides prepararla.",
    concepts: ["function-definition", "function-call"],
  },
  "call-without-parentheses": {
    id: "call-without-parentheses",
    title: "Llamar a la función sin paréntesis",
    explanation:
      "Para ejecutar una función escribe su nombre seguido de `()`: `saludar();`. Sin paréntesis PHP no entiende que quieres ejecutarla: busca una constante llamada `saludar` y, como no existe, el programa se detiene con un error.",
    concepts: ["function-call"],
  },
  "function-keyword": {
    id: "function-keyword",
    title: "Olvidar o cambiar la palabra function",
    explanation:
      "Toda definición empieza por la palabra reservada `function`, seguida del nombre y de `()`. Si falta o se escribe otra palabra, PHP no sabe que estás creando una función y muestra un error de sintaxis.",
    concepts: ["function-definition"],
  },
  "definition-without-parentheses": {
    id: "definition-without-parentheses",
    title: "Definir la función sin paréntesis",
    explanation:
      "Los paréntesis forman parte de la definición aunque estén vacíos: `function separador() {`. Escribir `function separador {` produce un error de sintaxis.",
    concepts: ["function-definition"],
  },
  "call-vs-definition": {
    id: "call-vs-definition",
    title: "Confundir la definición con la llamada",
    explanation:
      "La definición empieza por `function` y tiene un cuerpo entre llaves `{ }`. La llamada es solo el nombre con paréntesis y punto y coma: `saludar();`.",
    concepts: ["function-definition", "function-call"],
  },
  "calls-count": {
    id: "calls-count",
    title: "Contar mal cuántas veces se ejecuta una función",
    explanation:
      "Una función se ejecuta exactamente una vez por cada llamada. Si la llamas dos veces, su cuerpo se ejecuta dos veces.",
    concepts: ["function-call", "execution-flow"],
  },
  "execution-order": {
    id: "execution-order",
    title: "Confundir el orden de ejecución",
    explanation:
      "PHP ejecuta las instrucciones de arriba abajo. Cuando encuentra una llamada, ejecuta el cuerpo de la función entero y continúa con la línea siguiente a la llamada.",
    concepts: ["execution-flow"],
  },
  "refactor-change-everywhere": {
    id: "refactor-change-everywhere",
    title: "Creer que hay que cambiar cada llamada",
    explanation:
      "Con una función, el código repetido vive en un único sitio: su cuerpo. Si cambias el cuerpo, el cambio se aplica en todas las llamadas.",
    concepts: ["modularity", "reuse"],
  },
  "modularity-speed": {
    id: "modularity-speed",
    title: "Pensar que modularizar hace el programa más rápido",
    explanation:
      "Modularizar sirve para que el código sea más fácil de leer, reutilizar, corregir y mantener. No hace que el programa se ejecute más rápido: la mejora es para quien lo escribe.",
    concepts: ["modularity"],
  },

  // ─── Capítulo 2 ───
  "invalid-function-name": {
    id: "invalid-function-name",
    title: "Usar un nombre de función no válido",
    explanation:
      "El nombre de una función solo puede tener letras, números y guiones bajos, y no puede empezar por un número. Los espacios y los guiones no valen: PHP leería `mostrar-menu` como una resta. Por convención se escribe en camelCase y con un verbo: `mostrarMenu`.",
    concepts: ["function-definition"],
  },
  "return-point": {
    id: "return-point",
    title: "Pensar que, al terminar la función, se sigue tras su definición",
    explanation:
      "Cuando el cuerpo de una función termina, PHP vuelve al sitio desde el que se llamó y continúa con la instrucción siguiente a la llamada. El lugar donde está escrita la definición no importa.",
    concepts: ["execution-flow"],
  },
  "call-before-definition": {
    id: "call-before-definition",
    title: "Creer que no se puede llamar a una función escrita más abajo",
    explanation:
      "En un mismo archivo, PHP conoce todas las funciones definidas a nivel principal antes de empezar a ejecutar. Por eso puedes llamar a una función que está escrita más abajo. Aun así, definirlas arriba hace el código más fácil de leer.",
    concepts: ["execution-flow"],
  },

  // ─── Capítulo 3 ───
  "outer-variable": {
    id: "outer-variable",
    title: "Usar dentro de la función una variable de fuera",
    explanation:
      "Una función solo ve sus propias variables: sus parámetros y las que crea dentro. Si usas `$ciudad` dentro y solo existe fuera, PHP avisa de que la variable no está definida. Para darle un dato a una función, pásaselo como argumento.",
    concepts: ["parameters"],
  },
  "param-vs-arg": {
    id: "param-vs-arg",
    title: "Confundir parámetro y argumento",
    explanation:
      "El **parámetro** es la variable que escribes en la definición: `function saludar($nombre)`. El **argumento** es el valor concreto que envías en la llamada: `saludar(\"Ana\")`. El argumento se guarda en el parámetro.",
    concepts: ["parameters"],
  },
  "param-without-dollar": {
    id: "param-without-dollar",
    title: "Escribir una variable sin el símbolo $",
    explanation:
      "Los parámetros son variables y en PHP todas las variables empiezan por `$`: `function saludar($nombre)`, no `function saludar(nombre)`.",
    concepts: ["parameters"],
  },
  "string-without-quotes": {
    id: "string-without-quotes",
    title: "Escribir un texto sin comillas",
    explanation:
      "Los textos van entre comillas: `saludar(\"Pablo\")`. Sin comillas, PHP busca una constante llamada `Pablo`, no la encuentra y el programa se detiene con un error.",
    concepts: ["parameters"],
  },
  "literal-in-definition": {
    id: "literal-in-definition",
    title: "Poner un valor en la definición en lugar de un parámetro",
    explanation:
      "En la definición van variables (parámetros): `function darBienvenida($nombre)`. Los valores concretos como `\"Ana\"` van en la llamada. `function darBienvenida(\"Ana\")` es un error de sintaxis.",
    concepts: ["parameters"],
  },
  "argument-order": {
    id: "argument-order",
    title: "Pasar los argumentos en otro orden",
    explanation:
      "Los argumentos se asignan por posición: el primero va al primer parámetro, el segundo al segundo… Si los cambias de orden, PHP no da error, pero cada dato acaba en el parámetro equivocado.",
    concepts: ["parameters"],
  },
  "missing-argument": {
    id: "missing-argument",
    title: "Llamar a una función con menos argumentos de los que necesita",
    explanation:
      "Si una función tiene dos parámetros sin valor por defecto, hay que pasarle dos argumentos. Con menos, PHP se detiene con un error que dice que faltan argumentos («Too few arguments»).",
    concepts: ["parameters"],
  },

  // ─── Capítulo 4 ───
  "return-prints": {
    id: "return-prints",
    title: "Pensar que return muestra el valor",
    explanation:
      "`return` no muestra nada: entrega el valor a quien llamó a la función. Si quieres verlo en pantalla, tienes que hacer `echo` del resultado: `echo cuadrado(4);`.",
    concepts: ["return-vs-echo"],
  },
  "echo-returns": {
    id: "echo-returns",
    title: "Pensar que echo devuelve el valor",
    explanation:
      "`echo` solo muestra en pantalla. Una función que hace `echo` y no tiene `return` devuelve `null` (nada), así que `$x = triple(2);` muestra 6 pero `$x` queda vacía.",
    concepts: ["return-vs-echo"],
  },
  "code-after-return": {
    id: "code-after-return",
    title: "Pensar que se ejecuta el código que hay después de return",
    explanation:
      "`return` termina la función en ese mismo instante. Las instrucciones que haya debajo, dentro de la misma función, no se ejecutan en esa llamada.",
    concepts: ["return-value"],
  },
  "lost-return": {
    id: "lost-return",
    title: "Llamar a una función con retorno sin usar el valor",
    explanation:
      "Si escribes `incrementar($a);` sin guardar ni mostrar el resultado, el valor devuelto se pierde y `$a` no cambia. Guárdalo: `$a = incrementar($a);`, o úsalo directamente en un `echo`.",
    concepts: ["return-value"],
  },

  // ─── Capítulo 5 ───
  "include-vs-require": {
    id: "include-vs-require",
    title: "Confundir include y require cuando falta el archivo",
    explanation:
      "Si el archivo no existe, `include` muestra un aviso (warning) y el programa **sigue**; `require` produce un error fatal y el programa **se detiene**. Para archivos imprescindibles, como los de funciones, usa `require`.",
    concepts: ["include-require"],
  },
  "file-name-without-quotes": {
    id: "file-name-without-quotes",
    title: "Escribir el nombre del archivo sin comillas",
    explanation:
      "El nombre del archivo es un texto, así que va entre comillas: `require \"tienda.php\";`. Sin comillas PHP lo interpreta como una constante y falla.",
    concepts: ["include-require"],
  },
  "call-before-include": {
    id: "call-before-include",
    title: "Llamar a una función antes de incluir su archivo",
    explanation:
      "Las funciones de otro archivo solo existen después de que el `require` o `include` se ha ejecutado. Pon siempre los `require` al principio, antes de usar sus funciones.",
    concepts: ["include-require"],
  },
  "double-include": {
    id: "double-include",
    title: "Incluir dos veces un archivo de funciones",
    explanation:
      "Si un archivo que define funciones se incluye dos veces con `include` o `require`, PHP intenta declarar las mismas funciones otra vez y se detiene con un error fatal. Las variantes `include_once` y `require_once` recuerdan qué archivos ya se incluyeron y no los repiten.",
    concepts: ["include-once"],
  },
  "library-side-effects": {
    id: "library-side-effects",
    title: "Ejecutar código suelto en un archivo de funciones",
    explanation:
      "Un archivo de funciones solo debería definir funciones. Si además contiene un `echo` suelto, ese texto aparecerá en cada programa que lo incluya, aunque no lo esperes.",
    concepts: ["multi-file"],
  },
  "path-slash": {
    id: "path-slash",
    title: "Olvidar la barra después de __DIR__",
    explanation:
      "`__DIR__` es la carpeta del archivo actual y no termina en barra. Para formar la ruta hay que añadirla: `__DIR__ . \"/lib/textos.php\"`. Sin la barra, el nombre de la carpeta y el de `lib` se pegan y el archivo no se encuentra.",
    concepts: ["multi-file"],
  },
};
