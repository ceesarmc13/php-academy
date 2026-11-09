/**
 * Template tag for authoring PHP snippets in content files.
 * - Raw: `\n` stays as the two characters PHP students write.
 * - Dedented: the common leading indentation and the first/last empty lines are removed.
 */
export function php(strings: TemplateStringsArray, ...values: unknown[]): string {
  const raw = String.raw({ raw: strings.raw }, ...values);
  const lines = raw.replace(/^\n/, "").replace(/\n\s*$/, "").split("\n");
  const indent = Math.min(
    ...lines.filter((l) => l.trim() !== "").map((l) => l.match(/^ */)![0].length),
  );
  return lines.map((l) => l.slice(indent)).join("\n");
}

/** Program output as shown in a terminal: real line breaks. */
export function output(...lines: string[]): string {
  return lines.join("\n");
}
