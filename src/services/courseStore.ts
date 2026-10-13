import { courses as seedCourses } from '@/data/courses';
import type { Course } from '@/types';
import { isStoredCourse } from '@/utils/courseForm';
import type { CourseInput } from '@/utils/courseForm';

/**
 * Catálogo editável da demonstração. Os dados iniciais (src/data/courses.ts) nunca são alterados:
 * as edições ficam no localStorage e `resetCourses()` volta ao conjunto original.
 * Persistência local não é segurança nem banco de dados: qualquer pessoa com acesso ao navegador pode ler e mudar.
 */
const KEY = 'nexora.courses.v1';

function load(): Course[] {
  try {
    const raw = JSON.parse(window.localStorage.getItem(KEY) ?? 'null') as { courses?: unknown } | null;
    if (raw && Array.isArray(raw.courses)) {
      const seen = new Set<string>();
      const valid: Course[] = [];
      for (const item of raw.courses) {
        if (isStoredCourse(item) && !seen.has(item.id) && !seen.has(`slug:${item.slug}`)) {
          seen.add(item.id);
          seen.add(`slug:${item.slug}`);
          valid.push(item);
        }
      }
      // Lista vazia é uma escolha válida (o admin excluiu tudo). Lista com itens em que nenhum serve é dado corrompido:
      // volta ao catálogo inicial em vez de deixar o site vazio sem explicação.
      if (valid.length > 0 || raw.courses.length === 0) return valid;
    }
  } catch {
    /* armazenamento indisponível ou corrompido: usa os dados iniciais */
  }
  return [...seedCourses];
}

let snapshot: Course[] = load();
const listeners = new Set<() => void>();

function commit(next: Course[]): void {
  snapshot = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ courses: next }));
  } catch {
    /* sem armazenamento: as alterações valem só enquanto a página estiver aberta */
  }
  listeners.forEach((l) => l());
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key !== KEY && event.key !== null) return;
    snapshot = load();
    listeners.forEach((l) => l());
  });
}

export const subscribeCourses = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
export const getCourses = (): Course[] => snapshot;

export function createCourse(input: CourseInput): Course {
  const course: Course = { ...input, id: `c-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}` };
  commit([...snapshot, course]); // novos cursos entram no fim, depois da vitrine da página inicial
  return course;
}

export const updateCourse = (id: string, input: CourseInput): void =>
  commit(snapshot.map((c) => (c.id === id ? { ...input, id } : c)));

export const deleteCourse = (id: string): void => commit(snapshot.filter((c) => c.id !== id));

/** Volta ao catálogo inicial da demonstração. */
export function resetCourses(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* nada a apagar */
  }
  snapshot = [...seedCourses];
  listeners.forEach((l) => l());
}

export const isCatalogEdited = (): boolean => {
  try {
    return window.localStorage.getItem(KEY) !== null;
  } catch {
    return false;
  }
};
