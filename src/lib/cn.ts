/** Joins class names, skipping falsy values. */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function percent(ratio: number): string {
  return `${Math.round(ratio * 100)} %`;
}
