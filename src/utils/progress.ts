import type { Course, DemoEnrollment } from '@/types';

export interface Progress {
  done: number;
  total: number;
  percent: number;
  complete: boolean;
}

/** Progresso fictício: aulas concluídas sobre o total do curso. */
export function progressOf(enrollment: DemoEnrollment, course: Course): Progress {
  const done = Math.min(Math.max(enrollment.completedLessons, 0), course.lessons);
  return { done, total: course.lessons, percent: Math.round((done / course.lessons) * 100), complete: done >= course.lessons };
}
