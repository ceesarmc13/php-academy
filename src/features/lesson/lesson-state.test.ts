import { describe, expect, it } from "vitest";
import { LESSONS } from "@/content/php/course";
import {
  buildScreens,
  initialSession,
  masteryScore,
  sessionReducer,
  summarizeSession,
  type SessionAction,
  type SessionState,
} from "./lesson-state";

const lesson = LESSONS["t3-que-es-una-funcion"];
const screens = buildScreens(lesson);
const at = (key: string) => screens.find((s) => s.key === key)!;
const run = (actions: SessionAction[], from: SessionState = initialSession()) => actions.reduce(sessionReducer, from);

describe("lesson session", () => {
  it("builds intro → steps → review → mastery → result", () => {
    expect(screens[0].type).toBe("intro");
    expect(screens.at(-1)!.type).toBe("result");
    expect(screens.filter((s) => s.type === "mastery")).toHaveLength(lesson.mastery.questions.length);
  });

  it("awards full XP on a first-try answer", () => {
    const s = run([
      { type: "answer", key: "comprobacion-1", answer: { kind: "choice", optionId: "b" } },
      { type: "check", screen: at("comprobacion-1") },
    ]);
    expect(s.evaluation?.correct).toBe(true);
    expect(s.pending.exerciseXp).toBe(10);
    expect(s.pending.correctAnswers).toBe(1);
  });

  it("reduces XP after hints and failures and records the misconception", () => {
    const s = run([
      { type: "hint", key: "comprobacion-1" },
      { type: "answer", key: "comprobacion-1", answer: { kind: "choice", optionId: "a" } },
      { type: "check", screen: at("comprobacion-1") },
      { type: "answer", key: "comprobacion-1", answer: { kind: "choice", optionId: "b" } },
      { type: "check", screen: at("comprobacion-1") },
    ]);
    expect(s.pending.exerciseXp).toBe(6);
    expect(s.pending.mistakes).toEqual(["define-runs-function"]);
    expect(summarizeSession(lesson, s)).toMatchObject({ solved: 1, firstTry: 0, hintsUsed: 1 });
  });

  it("skipping gives no XP", () => {
    const s = run([{ type: "skip", screen: at("guiado") }]);
    expect(s.records["guiado"]).toMatchObject({ skipped: true, xp: 0 });
    expect(s.pending.exerciseXp).toBe(0);
  });

  it("scores the mastery test and can restart it", () => {
    const answers: Record<string, string> = { "dominio-1": "a", "dominio-2": "c", "dominio-4": "a" };
    let s = initialSession();
    for (const q of lesson.mastery.questions) {
      const key = `mastery:${q.id}`;
      const answer =
        q.kind === "fill"
          ? { kind: "fill" as const, values: { b1: "contar()" } }
          : { kind: "choice" as const, optionId: answers[q.id] };
      s = run([{ type: "answer", key, answer }, { type: "check", screen: at(key) }], s);
    }
    expect(masteryScore(lesson, s)).toMatchObject({ correct: 3, total: 4, passed: true });
    expect(s.pending.exerciseXp).toBe(0); // mastery XP is computed separately

    const restarted = sessionReducer(s, { type: "restart-mastery", masteryIntroIndex: 5 });
    expect(restarted.masteryResults).toEqual({});
    expect(restarted.mistakes.some((m) => m.inMastery)).toBe(false);
  });
});
