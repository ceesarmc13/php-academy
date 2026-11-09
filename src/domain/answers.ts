/**
 * Deterministic answer checking for exercises that do not need code execution.
 */
import type {
  ChoiceExercise,
  Exercise,
  FillExercise,
  MisconceptionId,
  OrderExercise,
} from "./curriculum";

export type ChoiceAnswer = { kind: "choice"; optionId: string | null };
export type FillAnswer = { kind: "fill"; values: Record<string, string> };
export type OrderAnswer = { kind: "order"; lineIds: string[] };
export type Answer = ChoiceAnswer | FillAnswer | OrderAnswer;

export interface Evaluation {
  correct: boolean;
  feedback: string;
  /** Extra non-blocking advice (e.g. naming conventions). */
  note?: string;
  misconceptionId?: MisconceptionId;
  /** fill: per-blank correctness. */
  blankResults?: Record<string, boolean>;
  /** order: index of the first misplaced line in the student's program. */
  firstWrongIndex?: number;
}

/** Whitespace is not significant in the short code fragments students type into blanks. */
export function normalizeCode(value: string): string {
  return value.replace(/\s+/g, "");
}

export function emptyAnswer(exercise: Exercise): Answer {
  switch (exercise.kind) {
    case "choice":
      return { kind: "choice", optionId: null };
    case "fill":
      return { kind: "fill", values: Object.fromEntries(exercise.blanks.map((b) => [b.id, ""])) };
    case "order":
      return { kind: "order", lineIds: [] };
  }
}

export function isAnswerReady(exercise: Exercise, answer: Answer): boolean {
  if (answer.kind === "choice") return answer.optionId !== null;
  if (answer.kind === "fill") return Object.values(answer.values).every((v) => v.trim() !== "");
  return exercise.kind === "order" && answer.lineIds.length === exercise.solution.length;
}

function evaluateChoice(exercise: ChoiceExercise, answer: ChoiceAnswer): Evaluation {
  const option = exercise.options.find((o) => o.id === answer.optionId);
  if (!option) return { correct: false, feedback: "Elige una opción." };
  if (option.correct) {
    return { correct: true, feedback: `${option.feedback} ${exercise.explanation}`.trim() };
  }
  return { correct: false, feedback: option.feedback, misconceptionId: option.misconceptionId };
}

function evaluateFill(exercise: FillExercise, answer: FillAnswer): Evaluation {
  const blankResults: Record<string, boolean> = {};
  let firstError: Evaluation | undefined;
  let caseNote: string | undefined;

  exercise.blanks.forEach((blank, index) => {
    const value = normalizeCode(answer.values[blank.id] ?? "");
    const accepted = blank.accept.map(normalizeCode);
    if (accepted.includes(value)) {
      blankResults[blank.id] = true;
      return;
    }
    // PHP keywords and function names are case-insensitive: accept, but teach the convention.
    const caseMatch = accepted.find((a) => a.toLowerCase() === value.toLowerCase());
    if (caseMatch) {
      blankResults[blank.id] = true;
      caseNote = `PHP aceptaría «${value}», pero lo habitual es escribirlo exactamente así: \`${caseMatch}\`.`;
      return;
    }
    blankResults[blank.id] = false;
    if (firstError) return;
    const known = blank.wrong?.find((w) => w.match.map(normalizeCode).includes(value));
    firstError = known
      ? { correct: false, feedback: known.feedback, misconceptionId: known.misconceptionId }
      : {
          correct: false,
          feedback: `El hueco ${index + 1} no es correcto. Revisa qué tiene que ir ahí y vuelve a intentarlo.`,
        };
  });

  if (firstError) return { ...firstError, blankResults };
  return { correct: true, feedback: exercise.explanation, note: caseNote, blankResults };
}

function evaluateOrder(exercise: OrderExercise, answer: OrderAnswer): Evaluation {
  const lineById = new Map(exercise.lines.map((l) => [l.id, l]));
  const chosen = answer.lineIds.map((id) => lineById.get(id)).filter((l) => l !== undefined);

  const distractorIndex = chosen.findIndex((l) => l.distractor);
  if (distractorIndex >= 0) {
    const line = chosen[distractorIndex];
    return {
      correct: false,
      feedback: line.feedback ?? "Has usado una línea que sobra en este programa.",
      misconceptionId: line.misconceptionId,
      firstWrongIndex: distractorIndex,
    };
  }

  const expected = exercise.solution.map((id) => lineById.get(id)?.text.trim());
  const firstWrongIndex = expected.findIndex((text, i) => chosen[i]?.text.trim() !== text);
  if (firstWrongIndex === -1 && chosen.length === expected.length) {
    return { correct: true, feedback: exercise.explanation };
  }
  return {
    correct: false,
    feedback: `La línea ${firstWrongIndex + 1} de tu programa no está en su sitio. Piensa en qué tiene que ocurrir primero.`,
    firstWrongIndex,
  };
}

export function evaluate(exercise: Exercise, answer: Answer): Evaluation {
  if (exercise.kind === "choice" && answer.kind === "choice") return evaluateChoice(exercise, answer);
  if (exercise.kind === "fill" && answer.kind === "fill") return evaluateFill(exercise, answer);
  if (exercise.kind === "order" && answer.kind === "order") return evaluateOrder(exercise, answer);
  throw new Error(`Answer of kind "${answer.kind}" does not match exercise "${exercise.kind}"`);
}
