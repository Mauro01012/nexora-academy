import { useSyncExternalStore } from 'react';
import { getCourses, subscribeCourses } from '@/services/courseStore';
import type { Course } from '@/types';

/** Cursos atuais do catálogo (iniciais + alterações feitas no painel administrativo). */
export function useCourses(): Course[] {
  return useSyncExternalStore(subscribeCourses, getCourses, getCourses);
}
