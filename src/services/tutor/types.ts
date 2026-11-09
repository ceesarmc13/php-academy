/**
 * Contract for the AI tutor (Phase 4). NOT IMPLEMENTED.
 * Requests are made server-side only; the API key never reaches the browser.
 */
import type { ConceptId, LessonId, MisconceptionId } from "@/domain/curriculum";

export interface TutorContext {
  lessonId: LessonId;
  concepts: ConceptId[];
  exercisePrompt: string;
  studentCode?: string;
  executionOutput?: string;
  /** Misconceptions recorded for this student, most frequent first. */
  knownMisconceptions: MisconceptionId[];
  /** How many hints the student already received for this exercise. */
  hintsGiven: number;
}

export type TutorRequest =
  | { kind: "explain-concept"; context: TutorContext; question: string }
  | { kind: "next-hint"; context: TutorContext }
  | { kind: "review-code"; context: TutorContext };

export interface TutorReply {
  message: string;
  /** Guardrail result: replies containing the full solution are rejected. */
  revealsSolution: false;
}

export interface TutorService {
  ask(request: TutorRequest): Promise<TutorReply>;
}
