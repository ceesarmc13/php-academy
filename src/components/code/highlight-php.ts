/**
 * Minimal PHP tokenizer for read-only lesson snippets.
 * Covers what beginner lessons use: tags, comments, strings, variables,
 * numbers, keywords, function names and punctuation.
 */

export type TokenType =
  | "keyword"
  | "string"
  | "variable"
  | "function"
  | "comment"
  | "number"
  | "tag"
  | "punct"
  | "plain";

export interface Token {
  type: TokenType;
  text: string;
}

const KEYWORDS = new Set([
  "function", "return", "echo", "print", "if", "else", "elseif", "for", "foreach", "while", "do",
  "as", "switch", "case", "break", "continue", "default", "include", "include_once", "require",
  "require_once", "true", "false", "null", "new", "class", "public", "private", "static", "const",
  "and", "or", "not", "fn", "match", "global", "array",
]);

const RULES: [TokenType, RegExp][] = [
  ["tag", /^(<\?php|\?>)/],
  ["comment", /^(\/\/|#)[^\n]*/],
  ["comment", /^\/\*[\s\S]*?(\*\/|$)/],
  ["string", /^"(?:[^"\\\n]|\\.)*"?/],
  ["string", /^'(?:[^'\\\n]|\\.)*'?/],
  ["variable", /^\$[A-Za-z_][A-Za-z0-9_]*/],
  ["number", /^\d+(?:\.\d+)?/],
];

export function tokenizePhp(code: string): Token[] {
  const tokens: Token[] = [];
  let previousWord = "";
  let i = 0;

  const push = (type: TokenType, text: string) => {
    const last = tokens.at(-1);
    if (last && last.type === type && (type === "plain" || type === "punct")) last.text += text;
    else tokens.push({ type, text });
  };

  while (i < code.length) {
    const rest = code.slice(i);
    const rule = RULES.find(([, re]) => re.test(rest));
    if (rule) {
      const text = rest.match(rule[1])![0];
      push(rule[0], text);
      i += text.length;
      continue;
    }

    const word = rest.match(/^[A-Za-z_][A-Za-z0-9_]*/);
    if (word) {
      const text = word[0];
      const lower = text.toLowerCase();
      const nextChar = rest.slice(text.length).trimStart()[0];
      let type: TokenType = "plain";
      if (KEYWORDS.has(lower)) type = "keyword";
      else if (previousWord === "function" || nextChar === "(") type = "function";
      push(type, text);
      previousWord = lower;
      i += text.length;
      continue;
    }

    const char = rest[0];
    if (/[{}()[\];,.=+\-*/<>!&|?:%]/.test(char)) push("punct", char);
    else push("plain", char);
    if (!/\s/.test(char)) previousWord = "";
    i += 1;
  }
  return tokens;
}

/** Splits tokens into lines, cutting tokens that contain line breaks. */
export function tokenizeLines(code: string): Token[][] {
  const lines: Token[][] = [[]];
  for (const token of tokenizePhp(code)) {
    const parts = token.text.split("\n");
    parts.forEach((part, index) => {
      if (index > 0) lines.push([]);
      if (part) lines[lines.length - 1].push({ type: token.type, text: part });
    });
  }
  return lines;
}
