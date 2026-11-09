import type { Course, Lesson, LessonSummary } from "@/domain/curriculum";
import { beneficiosModularizar } from "./lessons/beneficios-modularizar";
import { flujoDeEjecucion } from "./lessons/flujo-de-ejecucion";
import { funcionesConRetorno } from "./lessons/funciones-con-retorno";
import { funcionesSinParametros } from "./lessons/funciones-sin-parametros";
import { includeOnceRequireOnce } from "./lessons/include-once-require-once";
import { includeRequire } from "./lessons/include-require";
import { organizarProyecto } from "./lessons/organizar-proyecto";
import { parametrosYArgumentos } from "./lessons/parametros-y-argumentos";
import { queEsUnaFuncion } from "./lessons/que-es-una-funcion";
import { returnFrenteAEcho } from "./lessons/return-frente-a-echo";
import { variosParametros } from "./lessons/varios-parametros";

const ALL_LESSONS: Lesson[] = [
  queEsUnaFuncion,
  beneficiosModularizar,
  funcionesSinParametros,
  flujoDeEjecucion,
  parametrosYArgumentos,
  variosParametros,
  returnFrenteAEcho,
  funcionesConRetorno,
  includeRequire,
  includeOnceRequireOnce,
  organizarProyecto,
];

/** Lessons with full content, by id. */
export const LESSONS: Record<string, Lesson> = Object.fromEntries(ALL_LESSONS.map((l) => [l.id, l]));

function summary(lesson: Lesson): LessonSummary {
  const { id, code, title, summary, objectives, prerequisites, concepts, estimatedMinutes, contentStatus } =
    lesson;
  return { id, code, title, summary, objectives, prerequisites, concepts, estimatedMinutes, contentStatus };
}

export const PHP_COURSE: Course = {
  id: "php",
  title: "PHP desde cero",
  description: "De tu primera línea de código a programas organizados en varios archivos.",
  units: [
    {
      id: "t3",
      number: 1,
      title: "Funciones y modularización",
      description:
        "Aprende a agrupar instrucciones en funciones, pasarles datos, devolver resultados y repartir un programa en varios archivos.",
      source: {
        subject: "Programación",
        teacher: "Alejandro Zazo",
        program: "CFGM Sistemas Microinformáticos y Redes",
        center: "Centro Didáctico",
        topic: "Tema 3: Funciones y modularización",
      },
      externalPrerequisites: [
        "Mostrar texto con `echo`",
        "Variables y tipos básicos",
        "Operadores aritméticos",
        "Condicionales `if` / `else`",
      ],
      chapters: [
        {
          id: "t3-c1",
          number: 1,
          title: "El concepto de función",
          lessons: [summary(queEsUnaFuncion), summary(beneficiosModularizar)],
        },
        {
          id: "t3-c2",
          number: 2,
          title: "Definir y ejecutar funciones",
          lessons: [summary(funcionesSinParametros), summary(flujoDeEjecucion)],
        },
        {
          id: "t3-c3",
          number: 3,
          title: "Parámetros y argumentos",
          lessons: [summary(parametrosYArgumentos), summary(variosParametros)],
        },
        {
          id: "t3-c4",
          number: 4,
          title: "Devolver resultados",
          lessons: [summary(returnFrenteAEcho), summary(funcionesConRetorno)],
        },
        {
          id: "t3-c5",
          number: 5,
          title: "Programas en varios archivos",
          lessons: [summary(includeRequire), summary(includeOnceRequireOnce), summary(organizarProyecto)],
        },
      ],
      officialExercises: [
        {
          id: "t3-oficiales-un-archivo",
          title: "Ejercicios en un único archivo",
          description: "Los 10 ejercicios del documento que se resuelven en un solo archivo PHP.",
          expectedCount: 10,
          exercises: [],
          importStatus: "pending-source",
        },
        {
          id: "t3-oficiales-modularizados",
          title: "Ejercicios modularizados",
          description: "Los 10 ejercicios del documento que reparten el código en varios archivos.",
          expectedCount: 10,
          exercises: [],
          importStatus: "pending-source",
        },
      ],
    },
  ],
};

export function getLesson(id: string): Lesson | undefined {
  return LESSONS[id];
}

export function chapterLessonIds(course: Course = PHP_COURSE): Record<string, string[]> {
  return Object.fromEntries(
    course.units.flatMap((u) => u.chapters.map((c) => [c.id, c.lessons.map((l) => l.id)])),
  );
}
