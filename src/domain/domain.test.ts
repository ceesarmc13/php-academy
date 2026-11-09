import { describe, expect, it } from "vitest";
import { PHP_COURSE, LESSONS } from "@/content/php/course";
import { MISCONCEPTIONS } from "@/content/php/concepts";
import { DEMO_STUDENT, DEMO_TODAY } from "@/data/demo/student";
import { computeStreak, totalXp, weekdayIndex, calendarWeeks } from "./activity";
import { evaluate, normalizeCode } from "./answers";
import type { ChoiceExercise, FillExercise, OrderExercise } from "./curriculum";
import { isExercise } from "./curriculum";
import { recurringMisconceptions } from "./mistakes";
import { getLessonStatus, getNextLesson } from "./progression";
import { applyRepeatFactor, exerciseXp, levelFromXp, masteryXp } from "./xp";

describe("xp", () => {
  it("rewards first-try answers fully and penalises hints and failures", () => {
    expect(exerciseXp({ solved: true, hintsUsed: 0, failedAttempts: 0 })).toBe(10);
    expect(exerciseXp({ solved: true, hintsUsed: 1, failedAttempts: 1 })).toBe(6);
    expect(exerciseXp({ solved: true, hintsUsed: 3, failedAttempts: 5 })).toBe(2);
    expect(exerciseXp({ solved: false, hintsUsed: 0, failedAttempts: 0 })).toBe(0);
  });

  it("only grants mastery XP when passed", () => {
    expect(masteryXp(4, true)).toBe(40);
    expect(masteryXp(2, false)).toBe(0);
    expect(applyRepeatFactor(40, true)).toBe(10);
  });

  it("computes levels from 50·n·(n−1)", () => {
    expect(levelFromXp(0).level).toBe(1);
    expect(levelFromXp(99).level).toBe(1);
    expect(levelFromXp(100).level).toBe(2);
    expect(levelFromXp(300).level).toBe(3);
    expect(levelFromXp(92).xpToNext).toBe(8);
  });
});

describe("activity", () => {
  it("counts consecutive active days, tolerating an inactive today", () => {
    const a = [
      { day: "2026-11-06", xp: 5, correctAnswers: 1 },
      { day: "2026-11-07", xp: 5, correctAnswers: 1 },
      { day: "2026-11-08", xp: 5, correctAnswers: 1 },
    ];
    expect(computeStreak(a, "2026-11-08")).toBe(3);
    expect(computeStreak(a, "2026-11-09")).toBe(3);
    expect(computeStreak(a, "2026-11-10")).toBe(0);
  });

  it("does not count days without correct answers", () => {
    expect(computeStreak([{ day: "2026-11-09", xp: 0, correctAnswers: 0 }], "2026-11-09")).toBe(0);
  });

  it("builds Monday-aligned weeks", () => {
    expect(weekdayIndex("2026-11-09")).toBe(0); // Monday
    const weeks = calendarWeeks("2026-11-11", 2);
    expect(weeks[1][0]).toBe("2026-11-09");
    expect(weeks[0][0]).toBe("2026-11-02");
  });
});

describe("demo dataset", () => {
  it("is consistent with the rules", () => {
    expect(totalXp(DEMO_STUDENT.activity)).toBe(92);
    expect(computeStreak(DEMO_STUDENT.activity, DEMO_TODAY)).toBe(4);
    const recurring = recurringMisconceptions(DEMO_STUDENT.mistakes, DEMO_TODAY);
    expect(recurring.map((r) => r.misconceptionId)).toEqual(["call-without-parentheses"]);
  });
});

describe("progression", () => {
  const [lesson1, lesson2] = PHP_COURSE.units[0].chapters[0].lessons;
  const chapter2First = PHP_COURSE.units[0].chapters[1].lessons[0];

  it("locks lessons until prerequisites are mastered", () => {
    expect(getLessonStatus(lesson1, {}).status).toBe("available");
    expect(getLessonStatus(lesson2, {}).status).toBe("locked");
    expect(getLessonStatus(lesson2, { [lesson1.id]: { status: "in-progress" } }).status).toBe("locked");
    expect(getLessonStatus(lesson2, { [lesson1.id]: { status: "completed" } }).status).toBe("available");
  });

  it("marks unlocked lessons without content as in preparation", () => {
    const progress = { [lesson1.id]: { status: "completed" as const }, [lesson2.id]: { status: "completed" as const } };
    expect(getLessonStatus(chapter2First, progress).status).toBe("available");
    const draft = { ...chapter2First, contentStatus: "in-preparation" as const };
    expect(getLessonStatus(draft, progress).status).toBe("in-preparation");
  });

  it("chains every lesson to the previous one and all prerequisites exist", () => {
    const lessons = PHP_COURSE.units.flatMap((u) => u.chapters.flatMap((c) => c.lessons));
    const ids = new Set(lessons.map((l) => l.id));
    lessons.forEach((l, i) => {
      expect(l.prerequisites.every((p) => ids.has(p))).toBe(true);
      if (i > 0) expect(l.prerequisites).toContain(lessons[i - 1].id);
    });
    expect(lessons.every((l) => LESSONS[l.id])).toBe(true);
  });

  it("suggests the in-progress lesson first", () => {
    expect(getNextLesson(PHP_COURSE, DEMO_STUDENT.lessons)?.id).toBe(lesson2.id);
  });
});

describe("answers", () => {
  const lesson = LESSONS["t3-que-es-una-funcion"];
  const choice = lesson.steps.find((s) => s.id === "comprobacion-1") as ChoiceExercise;
  const fill = lesson.steps.find((s) => s.id === "guiado") as FillExercise;
  const order = lesson.steps.find((s) => s.id === "autonomo") as OrderExercise;

  it("normalises whitespace", () => {
    expect(normalizeCode(" despedirse ( ) ; ")).toBe("despedirse();");
  });

  it("evaluates choices and reports misconceptions", () => {
    expect(evaluate(choice, { kind: "choice", optionId: "b" }).correct).toBe(true);
    const wrong = evaluate(choice, { kind: "choice", optionId: "a" });
    expect(wrong.correct).toBe(false);
    expect(wrong.misconceptionId).toBe("define-runs-function");
  });

  it("evaluates blanks, accepting case differences with a note", () => {
    expect(evaluate(fill, { kind: "fill", values: { b1: "function", b2: "( )" } }).correct).toBe(true);
    const upper = evaluate(fill, { kind: "fill", values: { b1: "FUNCTION", b2: "()" } });
    expect(upper.correct).toBe(true);
    expect(upper.note).toBeDefined();
    const known = evaluate(fill, { kind: "fill", values: { b1: "def", b2: "()" } });
    expect(known.misconceptionId).toBe("function-keyword");
    expect(known.blankResults).toEqual({ b1: false, b2: true });
  });

  it("evaluates line ordering, distractors and interchangeable duplicates", () => {
    expect(evaluate(order, { kind: "order", lineIds: order.solution }).correct).toBe(true);
    const withDistractor = [...order.solution.slice(0, 5), "d1", order.solution[6]];
    expect(evaluate(order, { kind: "order", lineIds: withDistractor }).misconceptionId).toBe(
      "call-without-parentheses",
    );
    const swapped = [order.solution[1], order.solution[0], ...order.solution.slice(2)];
    expect(evaluate(order, { kind: "order", lineIds: swapped }).firstWrongIndex).toBe(0);

    const lesson2 = LESSONS["t3-beneficios-modularizar"];
    const order2 = lesson2.steps.find((s) => s.id === "autonomo") as OrderExercise;
    // l5, l7 and l9 are identical calls: any permutation of them is the same program.
    const permuted = order2.solution.map((id) => (id === "l5" ? "l9" : id === "l9" ? "l5" : id));
    expect(evaluate(order2, { kind: "order", lineIds: permuted }).correct).toBe(true);
  });
});

describe("content integrity", () => {
  const lessons = Object.values(LESSONS);

  it("every misconception referenced exists in the catalogue", () => {
    for (const lesson of lessons) {
      const exercises = [...lesson.steps.filter(isExercise), ...lesson.mastery.questions];
      for (const e of exercises) {
        const ids =
          e.kind === "choice"
            ? e.options.map((o) => o.misconceptionId)
            : e.kind === "fill"
              ? e.blanks.flatMap((b) => b.wrong?.map((w) => w.misconceptionId) ?? [])
              : e.lines.map((l) => l.misconceptionId);
        for (const id of ids.filter(Boolean)) expect(MISCONCEPTIONS[id!], `${lesson.id}/${e.id}: ${id}`).toBeDefined();
      }
    }
  });

  it("each choice exercise has exactly one correct option and each solution is reachable", () => {
    for (const lesson of lessons) {
      for (const e of [...lesson.steps.filter(isExercise), ...lesson.mastery.questions]) {
        if (e.kind === "choice") expect(e.options.filter((o) => o.correct)).toHaveLength(1);
        if (e.kind === "order") {
          expect(evaluate(e, { kind: "order", lineIds: e.solution }).correct).toBe(true);
          expect(e.lines.filter((l) => l.distractor).every((l) => !e.solution.includes(l.id))).toBe(true);
        }
        if (e.kind === "fill") {
          const values = Object.fromEntries(e.blanks.map((b) => [b.id, b.accept[0]]));
          expect(evaluate(e, { kind: "fill", values }).correct).toBe(true);
          expect(e.template.match(/\[\[\w+\]\]/g)).toHaveLength(e.blanks.length);
        }
      }
    }
  });

  it("covers all seven phases and has graduated hints outside the mastery test", () => {
    for (const lesson of lessons) {
      const phases = new Set(lesson.steps.map((s) => s.phase));
      for (const p of ["explanation", "example", "check", "guided", "practice"]) expect(phases.has(p as never)).toBe(true);
      for (const e of lesson.steps.filter(isExercise)) expect(e.hints.length).toBeGreaterThanOrEqual(2);
      for (const q of lesson.mastery.questions) expect(q.hints).toHaveLength(0);
      expect(lesson.steps.filter(isExercise).every((e) => e.provenance === "reinforcement")).toBe(true);
    }
  });
});
