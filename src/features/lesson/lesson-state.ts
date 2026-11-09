/**
 * Lesson session state machine. Pure (no React) so it can be unit-tested.
 * Screens: intro → steps (7 phases) → review → mastery intro → mastery questions → result.
 */
import {
  isExercise,
  type ConceptId,
  type Exercise,
  type Lesson,
  type LessonPhase,
  type LessonStep,
  type MisconceptionId,
} from "@/domain/curriculum";
import { emptyAnswer, evaluate, type Answer, type Evaluation } from "@/domain/answers";
import type { ConceptStat } from "@/domain/mistakes";
import { exerciseXp } from "@/domain/xp";

export type Screen =
  | { type: "intro"; key: string }
  | { type: "step"; key: string; step: LessonStep }
  | { type: "review"; key: string }
  | { type: "mastery-intro"; key: string }
  | { type: "mastery"; key: string; question: Exercise; number: number }
  | { type: "result"; key: string };

export function buildScreens(lesson: Lesson): Screen[] {
  return [
    { type: "intro", key: "intro" },
    ...lesson.steps.map((step) => ({ type: "step" as const, key: step.id, step })),
    { type: "review", key: "review" },
    { type: "mastery-intro", key: "mastery-intro" },
    ...lesson.mastery.questions.map((question, i) => ({
      type: "mastery" as const,
      key: `mastery:${question.id}`,
      question,
      number: i + 1,
    })),
    { type: "result", key: "result" },
  ];
}

export function screenPhase(screen: Screen): LessonPhase | null {
  switch (screen.type) {
    case "intro":
      return null;
    case "step":
      return screen.step.phase;
    case "review":
      return "review";
    default:
      return "mastery";
  }
}

export function screenExercise(screen: Screen): Exercise | null {
  if (screen.type === "mastery") return screen.question;
  if (screen.type === "step" && isExercise(screen.step)) return screen.step;
  return null;
}

export interface ExerciseRecord {
  failed: number;
  hints: number;
  solved: boolean;
  skipped: boolean;
  xp: number;
}

export interface SessionMistake {
  screenKey: string;
  misconceptionId?: MisconceptionId;
  concepts: ConceptId[];
  inMastery: boolean;
}

export interface SessionState {
  index: number;
  answers: Record<string, Answer>;
  evaluation: Evaluation | null;
  records: Record<string, ExerciseRecord>;
  mistakes: SessionMistake[];
  masteryResults: Record<string, boolean>;
  /** Not yet sent to the progress store. */
  pending: {
    exerciseXp: number;
    correctAnswers: number;
    mistakes: MisconceptionId[];
    conceptStats: Record<ConceptId, ConceptStat>;
  };
}

export const emptyPending = (): SessionState["pending"] => ({
  exerciseXp: 0,
  correctAnswers: 0,
  mistakes: [],
  conceptStats: {},
});

export function initialSession(): SessionState {
  return {
    index: 0,
    answers: {},
    evaluation: null,
    records: {},
    mistakes: [],
    masteryResults: {},
    pending: emptyPending(),
  };
}

export type SessionAction =
  | { type: "answer"; key: string; answer: Answer }
  | { type: "check"; screen: Screen }
  | { type: "retry" }
  | { type: "hint"; key: string }
  | { type: "skip"; screen: Screen }
  | { type: "next" }
  | { type: "goto"; index: number }
  | { type: "restart-mastery"; masteryIntroIndex: number }
  | { type: "committed" }
  | { type: "restart" };

const emptyRecord = (): ExerciseRecord => ({ failed: 0, hints: 0, solved: false, skipped: false, xp: 0 });

function addConceptStats(
  stats: Record<ConceptId, ConceptStat>,
  concepts: ConceptId[],
  correct: boolean,
): Record<ConceptId, ConceptStat> {
  const next = { ...stats };
  for (const c of concepts) {
    const prev = next[c] ?? { correct: 0, attempts: 0 };
    next[c] = { correct: prev.correct + (correct ? 1 : 0), attempts: prev.attempts + 1 };
  }
  return next;
}

export function getAnswer(state: SessionState, key: string, exercise: Exercise): Answer {
  return state.answers[key] ?? emptyAnswer(exercise);
}

export function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case "answer":
      return { ...state, answers: { ...state.answers, [action.key]: action.answer }, evaluation: null };

    case "check": {
      const { screen } = action;
      const exercise = screenExercise(screen);
      if (!exercise) return state;
      const inMastery = screen.type === "mastery";
      const evaluation = evaluate(exercise, getAnswer(state, screen.key, exercise));
      const record = state.records[screen.key] ?? emptyRecord();
      const pending = { ...state.pending };
      pending.conceptStats = addConceptStats(pending.conceptStats, exercise.concepts, evaluation.correct);

      let nextRecord: ExerciseRecord;
      let mistakes = state.mistakes;
      if (evaluation.correct) {
        const xp = inMastery
          ? 0
          : exerciseXp({ solved: true, hintsUsed: record.hints, failedAttempts: record.failed });
        nextRecord = { ...record, solved: true, xp };
        pending.exerciseXp += xp;
        pending.correctAnswers += 1;
      } else {
        nextRecord = { ...record, failed: record.failed + 1 };
        mistakes = [
          ...mistakes,
          {
            screenKey: screen.key,
            misconceptionId: evaluation.misconceptionId,
            concepts: exercise.concepts,
            inMastery,
          },
        ];
        if (evaluation.misconceptionId) pending.mistakes = [...pending.mistakes, evaluation.misconceptionId];
      }

      return {
        ...state,
        evaluation,
        records: { ...state.records, [screen.key]: nextRecord },
        mistakes,
        masteryResults: inMastery
          ? { ...state.masteryResults, [exercise.id]: evaluation.correct }
          : state.masteryResults,
        pending,
      };
    }

    case "retry":
      return { ...state, evaluation: null };

    case "hint": {
      const record = state.records[action.key] ?? emptyRecord();
      return { ...state, records: { ...state.records, [action.key]: { ...record, hints: record.hints + 1 } } };
    }

    case "skip": {
      const exercise = screenExercise(action.screen);
      if (!exercise) return state;
      const record = state.records[action.screen.key] ?? emptyRecord();
      return {
        ...state,
        index: state.index + 1,
        evaluation: null,
        records: { ...state.records, [action.screen.key]: { ...record, skipped: true, xp: 0 } },
      };
    }

    case "next":
      return { ...state, index: state.index + 1, evaluation: null };

    case "goto":
      return { ...state, index: action.index, evaluation: null };

    case "restart-mastery": {
      const answers = Object.fromEntries(
        Object.entries(state.answers).filter(([key]) => !key.startsWith("mastery:")),
      );
      const records = Object.fromEntries(
        Object.entries(state.records).filter(([key]) => !key.startsWith("mastery:")),
      );
      return {
        ...state,
        index: action.masteryIntroIndex,
        answers,
        records,
        evaluation: null,
        masteryResults: {},
        mistakes: state.mistakes.filter((m) => !m.inMastery),
      };
    }

    case "committed":
      return { ...state, pending: emptyPending() };

    case "restart":
      // Learning signals survive a restart; uncommitted exercise XP does not (it would be earned twice).
      return { ...initialSession(), pending: { ...state.pending, exerciseXp: 0 } };
  }
}

export interface SessionSummary {
  exercises: number;
  firstTry: number;
  solved: number;
  skipped: number;
  hintsUsed: number;
}

export function summarizeSession(lesson: Lesson, state: SessionState): SessionSummary {
  const exercises = lesson.steps.filter(isExercise);
  const records = exercises.map((e) => state.records[e.id] ?? emptyRecord());
  return {
    exercises: exercises.length,
    firstTry: records.filter((r) => r.solved && r.failed === 0 && r.hints === 0).length,
    solved: records.filter((r) => r.solved).length,
    skipped: records.filter((r) => r.skipped).length,
    hintsUsed: records.reduce((sum, r) => sum + r.hints, 0),
  };
}

export function masteryScore(lesson: Lesson, state: SessionState) {
  const total = lesson.mastery.questions.length;
  const correct = lesson.mastery.questions.filter((q) => state.masteryResults[q.id]).length;
  const score = total ? correct / total : 0;
  return { correct, total, score, passed: score >= lesson.mastery.passingScore };
}
