"use client";

import { ArrowRight, CircleCheck, CircleX, X, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useReducer, useRef, useState, type FormEvent, type RefObject } from "react";
import { CodeBlock } from "@/components/code/code-block";
import { Button, ButtonLink } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ProvenanceBadge } from "@/components/ui/provenance-badge";
import { RichText } from "@/components/ui/rich-text";
import { PHP_COURSE } from "@/content/php/course";
import { isAnswerReady, type Answer } from "@/domain/answers";
import { PHASE_LABELS, PHASE_ORDER, type Exercise, type Lesson, type LessonSummary } from "@/domain/curriculum";
import { findLessonSummary, getLessonStatus } from "@/domain/progression";
import { applyRepeatFactor, masteryXp } from "@/domain/xp";
import { useProgress } from "@/features/progress/progress-provider";
import { cn } from "@/lib/cn";
import { ChoiceExercise } from "./exercises/choice-exercise";
import { FillExercise } from "./exercises/fill-exercise";
import { OrderExercise } from "./exercises/order-exercise";
import { Hints } from "./hints";
import {
  buildScreens,
  getAnswer,
  initialSession,
  masteryScore,
  screenExercise,
  screenPhase,
  sessionReducer,
  summarizeSession,
  type Screen,
} from "./lesson-state";
import {
  IntroScreen,
  LockedScreen,
  MasteryIntroScreen,
  ResultScreen,
  ReviewScreen,
  type CommitResult,
} from "./session-screens";
import { ExampleScreen, ExplanationScreen } from "./teaching-screens";

const SKIP_AFTER_FAILURES = 2;

export function LessonPlayer({
  lesson,
  chapterTitle,
  nextLesson,
}: {
  lesson: Lesson;
  chapterTitle: string;
  nextLesson: LessonSummary | null;
}) {
  const { state: student, derived, startLesson, recordLessonResult } = useProgress();
  // Gate once, on entry: finishing the lesson must not lock the screen mid-session.
  const [gate] = useState(() => getLessonStatus(lesson, student.lessons));
  const [alreadyCompletedAtStart] = useState(() => student.lessons[lesson.id]?.status === "completed");
  const [screens] = useState(() => buildScreens(lesson));
  const [session, dispatch] = useReducer(sessionReducer, undefined, initialSession);
  const [result, setResult] = useState<CommitResult | null>(null);
  const [masteryAttempt, setMasteryAttempt] = useState(1);
  /** XP already sent to the progress store during this visit. */
  const [committedXp, setCommittedXp] = useState(0);

  const contentRef = useRef<HTMLDivElement>(null);
  const primaryRef = useRef<HTMLButtonElement>(null);
  const exitRef = useRef<HTMLDialogElement>(null);

  const screen = screens[session.index];
  const exercise = screenExercise(screen);
  const phase = screenPhase(screen);
  const record = session.records[screen.key];
  const evaluation = session.evaluation;
  const inMastery = screen.type === "mastery";
  const masteryIntroIndex = screens.findIndex((s) => s.type === "mastery-intro");
  const isLastQuestion = inMastery && screens[session.index + 1]?.type === "result";

  // New screen: back to top and move focus to the content for screen readers.
  useEffect(() => {
    window.scrollTo({ top: 0 });
    contentRef.current?.focus({ preventScroll: true });
  }, [session.index]);

  // After checking, focus the next action so keyboard users can continue with Enter.
  useEffect(() => {
    if (evaluation) primaryRef.current?.focus();
  }, [evaluation]);

  if (gate.status === "locked") {
    const missing = gate.missingPrerequisites
      .map((id) => findLessonSummary(PHP_COURSE, id))
      .filter((l): l is LessonSummary => !!l);
    return <LockedScreen missing={missing} />;
  }

  const answer = exercise ? getAnswer(session, screen.key, exercise) : null;
  const locked = !!evaluation && (evaluation.correct || inMastery);
  const ready = exercise && answer ? isAnswerReady(exercise, answer) : false;

  const setAnswer = (a: Answer) => dispatch({ type: "answer", key: screen.key, answer: a });

  const finishMastery = () => {
    const score = masteryScore(lesson, session);
    const alreadyMastered = student.lessons[lesson.id]?.status === "completed";
    const exerciseXpEarned = applyRepeatFactor(session.pending.exerciseXp, alreadyMastered);
    const masteryXpEarned = applyRepeatFactor(masteryXp(score.correct, score.passed), alreadyMastered);
    setResult({
      ...score,
      exerciseXp: exerciseXpEarned,
      masteryXp: masteryXpEarned,
      alreadyMastered,
      achievementsBefore: derived.achievements,
      levelBefore: derived.level.level,
    });
    recordLessonResult({
      lessonId: lesson.id,
      passed: score.passed,
      masteryScore: score.score,
      xpEarned: exerciseXpEarned + masteryXpEarned,
      correctAnswers: session.pending.correctAnswers,
      mistakes: session.pending.mistakes,
      conceptStats: session.pending.conceptStats,
    });
    setCommittedXp((xp) => xp + exerciseXpEarned + masteryXpEarned);
    dispatch({ type: "committed" });
    dispatch({ type: "next" });
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (exercise && !evaluation && ready) dispatch({ type: "check", screen });
  };

  const requestExit = () => {
    if (session.index === 0 || screen.type === "result") return;
    exitRef.current?.showModal();
  };

  const progress = session.index / (screens.length - 1);
  const phaseNumber = phase ? PHASE_ORDER.indexOf(phase) + 1 : 0;
  const sessionXp = committedXp + session.pending.exerciseXp;
  const wide = screen.type === "step" && screen.step.kind === "example";

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-border bg-bg/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-4 px-4 sm:px-6">
          {session.index === 0 || screen.type === "result" ? (
            <Link
              href="/aprender"
              aria-label="Salir de la lección"
              className="grid size-10 shrink-0 place-items-center rounded-lg text-fg-muted hover:bg-surface-2 hover:text-fg"
            >
              <X aria-hidden className="size-5" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={requestExit}
              aria-label="Salir de la lección"
              className="grid size-10 shrink-0 place-items-center rounded-lg text-fg-muted hover:bg-surface-2 hover:text-fg"
            >
              <X aria-hidden className="size-5" />
            </button>
          )}
          <div className="min-w-0 flex-1">
            <ProgressBar value={progress} size="lg" label={`Progreso de la lección ${lesson.code}`} />
            <p className="mt-1.5 truncate text-xs font-medium text-fg-subtle" aria-live="polite">
              {phase ? `Fase ${phaseNumber} de 7 · ${PHASE_LABELS[phase]}` : `Lección ${lesson.code} · ${lesson.title}`}
            </p>
          </div>
          <span
            className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold tabular-nums text-fg"
            title="XP ganada en esta sesión"
          >
            <Zap aria-hidden className="size-4 text-accent" />
            <span className="sr-only">XP en esta sesión:</span>
            {sessionXp}
          </span>
        </div>
      </header>

      {/* Content */}
      <form onSubmit={onSubmit} className="flex flex-1 flex-col" noValidate>
        <div
          ref={contentRef}
          tabIndex={-1}
          key={screen.key}
          className={cn(
            "mx-auto w-full flex-1 animate-fade px-4 pt-8 pb-48 outline-none sm:px-6 sm:pt-12",
            wide ? "max-w-5xl" : "max-w-3xl",
          )}
        >
          {screen.type === "intro" && (
            <IntroScreen lesson={lesson} chapterTitle={chapterTitle} alreadyCompleted={alreadyCompletedAtStart} />
          )}
          {screen.type === "step" && screen.step.kind === "explanation" && <ExplanationScreen step={screen.step} />}
          {screen.type === "step" && screen.step.kind === "example" && <ExampleScreen step={screen.step} />}
          {exercise && answer && (
            <ExerciseScreen
              screen={screen}
              exercise={exercise}
              answer={answer}
              onChange={setAnswer}
              evaluation={evaluation}
              locked={locked}
              hintsUsed={record?.hints ?? 0}
              onHint={() => dispatch({ type: "hint", key: screen.key })}
            />
          )}
          {screen.type === "review" && (
            <ReviewScreen
              lesson={lesson}
              summary={summarizeSession(lesson, session)}
              mistakes={session.mistakes.filter((m) => !m.inMastery)}
            />
          )}
          {screen.type === "mastery-intro" && <MasteryIntroScreen lesson={lesson} attempt={masteryAttempt} />}
          {screen.type === "result" && result && (
            <ResultScreen
              result={result}
              level={derived.level}
              achievements={derived.achievements}
              masteryMistakes={session.mistakes.filter((m) => m.inMastery)}
              nextLesson={nextLesson}
            />
          )}
        </div>

        {/* Action / feedback bar */}
        <div className="fixed inset-x-0 bottom-0 z-20 bg-bg pb-[env(safe-area-inset-bottom)]">
          <div
            className={cn(
              "border-t transition-colors duration-200",
              evaluation
                ? evaluation.correct
                  ? "border-accent/40 bg-accent-soft"
                  : "border-danger/40 bg-danger-soft"
                : "border-border",
            )}
          >
            <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:px-6 sm:py-5">
              <div aria-live="polite" className="min-w-0 flex-1">
                {evaluation && (
                  <div className="flex animate-rise gap-3">
                    {evaluation.correct ? (
                      <CircleCheck aria-hidden className="mt-0.5 size-6 shrink-0 text-accent" />
                    ) : (
                      <CircleX aria-hidden className="mt-0.5 size-6 shrink-0 text-danger" />
                    )}
                    <div className="min-w-0">
                      <p className={cn("font-semibold", evaluation.correct ? "text-accent" : "text-danger")}>
                        {evaluation.correct ? "¡Correcto!" : inMastery ? "No es correcto" : "Todavía no"}
                      </p>
                      <p className="mt-1 text-[15px] leading-6 text-fg">
                        <RichText text={evaluation.feedback} />
                      </p>
                      {evaluation.note && (
                        <p className="mt-1 text-sm leading-6 text-fg-muted">
                          <RichText text={evaluation.note} />
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex shrink-0 flex-col-reverse gap-2 sm:flex-row sm:items-center">
                <ActionButtons
                  screen={screen}
                  exerciseReady={ready}
                  evaluationState={evaluation ? (evaluation.correct ? "correct" : "incorrect") : null}
                  canSkip={!inMastery && (record?.failed ?? 0) >= SKIP_AFTER_FAILURES}
                  isLastQuestion={isLastQuestion}
                  result={result}
                  nextLesson={nextLesson}
                  primaryRef={primaryRef}
                  onStart={() => {
                    startLesson(lesson.id);
                    dispatch({ type: "next" });
                  }}
                  onNext={() => dispatch({ type: "next" })}
                  onRetry={() => dispatch({ type: "retry" })}
                  onSkip={() => dispatch({ type: "skip", screen })}
                  onFinish={finishMastery}
                  onRestartMastery={() => {
                    setMasteryAttempt((n) => n + 1);
                    setResult(null);
                    dispatch({ type: "restart-mastery", masteryIntroIndex });
                  }}
                  onRestartLesson={() => {
                    setMasteryAttempt(1);
                    setResult(null);
                    dispatch({ type: "restart" });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </form>

      <dialog
        ref={exitRef}
        aria-labelledby="exit-title"
        className="m-auto w-[min(26rem,calc(100%-2rem))] rounded-2xl border border-border bg-surface p-6 text-fg backdrop:bg-black/60 open:animate-pop"
      >
        <h2 id="exit-title" className="text-lg font-semibold">
          ¿Salir de la lección?
        </h2>
        <p className="mt-2 text-[15px] leading-6 text-fg-muted">
          Perderás el avance de esta sesión. La XP se registra al terminar la prueba de dominio.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <ButtonLink href="/aprender" variant="ghost">
            Salir
          </ButtonLink>
          <Button onClick={() => exitRef.current?.close()} autoFocus>
            Seguir con la lección
          </Button>
        </div>
      </dialog>
    </div>
  );
}

function ExerciseScreen({
  screen,
  exercise,
  answer,
  onChange,
  evaluation,
  locked,
  hintsUsed,
  onHint,
}: {
  screen: Screen;
  exercise: Exercise;
  answer: Answer;
  onChange: (a: Answer) => void;
  evaluation: ReturnType<typeof sessionReducer>["evaluation"];
  locked: boolean;
  hintsUsed: number;
  onHint: () => void;
}) {
  const inMastery = screen.type === "mastery";
  const eyebrow =
    screen.type === "mastery"
      ? `Pregunta ${screen.number}`
      : PHASE_LABELS[exercise.phase];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-fg-subtle">{eyebrow}</span>
          <ProvenanceBadge provenance={exercise.provenance} />
        </div>
        <h1 className="text-xl font-semibold leading-8 tracking-tight text-fg sm:text-2xl sm:leading-9">
          <RichText text={exercise.prompt} />
        </h1>
      </div>

      {exercise.context?.map((f) => (
        <CodeBlock key={f.name} code={f.code} caption={`${f.name} (ya escrito)`} />
      ))}

      {exercise.kind === "choice" && answer.kind === "choice" && (
        <ChoiceExercise
          exercise={exercise}
          answer={answer}
          onChange={onChange}
          evaluation={evaluation}
          locked={locked}
          revealCorrect={inMastery && !!evaluation}
        />
      )}
      {exercise.kind === "fill" && answer.kind === "fill" && (
        <FillExercise exercise={exercise} answer={answer} onChange={onChange} evaluation={evaluation} locked={locked} />
      )}
      {exercise.kind === "order" && answer.kind === "order" && (
        <OrderExercise exercise={exercise} answer={answer} onChange={onChange} evaluation={evaluation} locked={locked} />
      )}

      {!inMastery && (
        <Hints hints={exercise.hints} used={hintsUsed} onReveal={onHint} disabled={!!evaluation?.correct} />
      )}
    </div>
  );
}

function ActionButtons({
  screen,
  exerciseReady,
  evaluationState,
  canSkip,
  isLastQuestion,
  result,
  nextLesson,
  primaryRef,
  onStart,
  onNext,
  onRetry,
  onSkip,
  onFinish,
  onRestartMastery,
  onRestartLesson,
}: {
  screen: Screen;
  exerciseReady: boolean;
  evaluationState: "correct" | "incorrect" | null;
  canSkip: boolean;
  isLastQuestion: boolean;
  result: CommitResult | null;
  nextLesson: LessonSummary | null;
  primaryRef: RefObject<HTMLButtonElement | null>;
  onStart: () => void;
  onNext: () => void;
  onRetry: () => void;
  onSkip: () => void;
  onFinish: () => void;
  onRestartMastery: () => void;
  onRestartLesson: () => void;
}) {
  const { state: student } = useProgress();
  const arrow = <ArrowRight aria-hidden className="size-4" />;

  switch (screen.type) {
    case "intro":
      return (
        <Button size="lg" onClick={onStart} iconRight={arrow}>
          Empezar
        </Button>
      );
    case "review":
      return (
        <Button size="lg" onClick={onNext} iconRight={arrow}>
          Ir a la prueba
        </Button>
      );
    case "mastery-intro":
      return (
        <Button size="lg" onClick={onNext} iconRight={arrow}>
          Empezar la prueba
        </Button>
      );
    case "result": {
      if (!result) return null;
      if (!result.passed) {
        return (
          <>
            <Button variant="secondary" size="lg" onClick={onRestartLesson}>
              Repasar la lección
            </Button>
            <Button size="lg" onClick={onRestartMastery}>
              Repetir la prueba
            </Button>
          </>
        );
      }
      const nextAvailable =
        nextLesson &&
        nextLesson.contentStatus === "ready" &&
        getLessonStatus(nextLesson, student.lessons).status !== "locked";
      return nextAvailable ? (
        <>
          <ButtonLink href="/aprender" variant="secondary" size="lg">
            Ver itinerario
          </ButtonLink>
          <ButtonLink href={`/leccion/${nextLesson.id}`} size="lg" iconRight={arrow}>
            Siguiente lección
          </ButtonLink>
        </>
      ) : (
        <ButtonLink href="/aprender" size="lg" iconRight={arrow}>
          Volver al itinerario
        </ButtonLink>
      );
    }
    case "step":
    case "mastery": {
      const isExerciseScreen = screen.type === "mastery" || screenExercise(screen) !== null;
      if (!isExerciseScreen) {
        return (
          <Button size="lg" onClick={onNext} iconRight={arrow}>
            Continuar
          </Button>
        );
      }
      if (evaluationState === null) {
        return (
          <Button type="submit" size="lg" disabled={!exerciseReady}>
            Comprobar
          </Button>
        );
      }
      if (evaluationState === "correct" || screen.type === "mastery") {
        return (
          <Button ref={primaryRef} size="lg" onClick={isLastQuestion ? onFinish : onNext} iconRight={arrow}>
            {isLastQuestion ? "Ver resultado" : "Continuar"}
          </Button>
        );
      }
      return (
        <>
          {canSkip && (
            <Button variant="ghost" size="lg" onClick={onSkip}>
              Seguir sin resolver
            </Button>
          )}
          <Button ref={primaryRef} variant="secondary" size="lg" onClick={onRetry}>
            Intentar de nuevo
          </Button>
        </>
      );
    }
  }
}
