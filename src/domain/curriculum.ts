/**
 * Content model for PHP Academy.
 * Course → Unit → Chapter → Lesson → Steps (teaching + exercises) → Mastery test.
 * Pure types: no React, no I/O. See LEARNING_SYSTEM.md.
 */

export type ConceptId = string;
export type MisconceptionId = string;
export type LessonId = string;

/** Where a piece of content comes from. Never label generated content as official. */
export type Provenance = "official" | "reinforcement";

/** The seven pedagogical phases every lesson follows. */
export type LessonPhase =
  | "explanation"
  | "example"
  | "check"
  | "guided"
  | "practice"
  | "review"
  | "mastery";

export interface SourceDocument {
  subject: string;
  teacher: string;
  program: string;
  center: string;
  topic: string;
}

export interface Concept {
  id: ConceptId;
  name: string;
}

export interface Misconception {
  id: MisconceptionId;
  /** Short name of the mistake, written for the student. */
  title: string;
  /** Explanation shown in the review phase. Inline `code` uses backticks. */
  explanation: string;
  concepts: ConceptId[];
}

/** A named source file, for lessons that span several files (include/require). */
export interface CodeFile {
  name: string;
  code: string;
}

// ─── Steps ────────────────────────────────────────────────────────────────

interface StepBase {
  id: string;
  phase: LessonPhase;
}

export interface ExplanationStep extends StepBase {
  kind: "explanation";
  title: string;
  /** Paragraphs. Inline `code` uses backticks, **bold** uses double asterisks. */
  body: string[];
  /** Optional bullet list rendered after the paragraphs. */
  points?: string[];
  code?: string;
  /** Caption above `code`. */
  codeCaption?: string;
  /** Additional files shown after `code`. */
  files?: CodeFile[];
  keyIdea?: string;
}

export interface ExampleStep extends StepBase {
  kind: "example";
  title: string;
  intro: string;
  /** Other files of the project, shown before the annotated one. */
  otherFiles?: CodeFile[];
  /** Name of the annotated file, e.g. "index.php". */
  fileName?: string;
  code: string;
  /** 1-based line numbers of `code`. */
  annotations: { line: number; text: string }[];
  /** Authored, verified output of `code`. Shown as "expected output", not as an execution. */
  expectedOutput: string;
  note?: string;
}

interface ExerciseBase extends StepBase {
  provenance: Provenance;
  concepts: ConceptId[];
  prompt: string;
  /** Read-only files the exercise depends on (e.g. the file being included). */
  context?: CodeFile[];
  /** Graduated hints: concept → location → near-answer. Never the full solution. */
  hints: string[];
  /** Shown when the answer is correct: why it works. */
  explanation: string;
}

export interface ChoiceOption {
  id: string;
  label: string;
  /** Render the label as code. */
  isCode?: boolean;
  correct?: boolean;
  /** Why this option is right or wrong. */
  feedback: string;
  misconceptionId?: MisconceptionId;
}

export interface ChoiceExercise extends ExerciseBase {
  kind: "choice";
  code?: string;
  options: ChoiceOption[];
}

export interface FillBlank {
  id: string;
  /** Accessible name, e.g. "Hueco 1: palabra para definir una función". */
  label: string;
  /** Valid answers. Compared after removing whitespace. */
  accept: string[];
  /** Known wrong answers mapped to a specific explanation. */
  wrong?: { match: string[]; feedback: string; misconceptionId?: MisconceptionId }[];
}

export interface FillExercise extends ExerciseBase {
  kind: "fill";
  /** Code with blanks written as [[blankId]]. */
  template: string;
  blanks: FillBlank[];
}

export interface OrderLine {
  id: string;
  /** Code line including its indentation. */
  text: string;
  /** A line that must not be used. */
  distractor?: boolean;
  feedback?: string;
  misconceptionId?: MisconceptionId;
}

export interface OrderExercise extends ExerciseBase {
  kind: "order";
  expectedOutput?: string;
  lines: OrderLine[];
  /** Line ids in the correct order. Lines with identical text are interchangeable. */
  solution: string[];
}

export type Exercise = ChoiceExercise | FillExercise | OrderExercise;
export type TeachingStep = ExplanationStep | ExampleStep;
export type LessonStep = TeachingStep | Exercise;

export interface MasteryTest {
  /** Fraction of correct answers required, e.g. 0.75. */
  passingScore: number;
  questions: Exercise[];
}

// ─── Structure ────────────────────────────────────────────────────────────

export interface LessonSummary {
  id: LessonId;
  /** Display code, e.g. "1.2". */
  code: string;
  title: string;
  summary: string;
  objectives: string[];
  /** Lessons whose mastery test must be passed first. */
  prerequisites: LessonId[];
  concepts: ConceptId[];
  estimatedMinutes: number;
  contentStatus: "ready" | "in-preparation";
}

export interface Lesson extends LessonSummary {
  steps: LessonStep[];
  mastery: MasteryTest;
  keyIdeas: string[];
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  lessons: LessonSummary[];
}

/** Placeholder for the exercises of the original class document. */
export interface OfficialExerciseSet {
  id: string;
  title: string;
  description: string;
  expectedCount: number;
  /** Imported verbatim from the source document. Empty until imported. */
  exercises: { number: number; title: string; statement: string }[];
  importStatus: "pending-source" | "imported";
}

export interface Unit {
  id: string;
  number: number;
  title: string;
  description: string;
  source?: SourceDocument;
  /** Knowledge assumed before starting (not yet verified by a diagnostic). */
  externalPrerequisites: string[];
  chapters: Chapter[];
  officialExercises: OfficialExerciseSet[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  units: Unit[];
}

export const PHASE_LABELS: Record<LessonPhase, string> = {
  explanation: "Explicación",
  example: "Ejemplo comentado",
  check: "Comprobación",
  guided: "Ejercicio guiado",
  practice: "Ejercicio autónomo",
  review: "Corrección",
  mastery: "Prueba de dominio",
};

export const PHASE_ORDER: LessonPhase[] = [
  "explanation",
  "example",
  "check",
  "guided",
  "practice",
  "review",
  "mastery",
];

export function isExercise(step: LessonStep): step is Exercise {
  return step.kind === "choice" || step.kind === "fill" || step.kind === "order";
}
