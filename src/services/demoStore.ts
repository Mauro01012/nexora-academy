import { courses } from '@/data/courses';
import type { DemoAccount, DemoEnrollment } from '@/types';

/**
 * Armazenamento da demonstração (SIMULADO). Guarda no localStorage apenas nome, e-mail digitado e progresso fictício.
 * Não existe senha neste modelo: o formulário valida o formato e descarta o valor. Não há servidor nem token.
 */
const KEY = 'nexora.demo.v1';
export const DEMO_EMAIL = 'demo@nexora.example';

interface Snapshot {
  accounts: DemoAccount[];
  session: string | null;
}

export type ActionResult = { ok: true } | { ok: false; message: string };

const seedAccount = (): DemoAccount => ({
  name: 'Aluno Demo',
  email: DEMO_EMAIL,
  createdAt: '2026-01-15T12:00:00.000Z',
  enrollments: [
    { courseId: 'c1', enrolledAt: '2026-02-03T12:00:00.000Z', completedLessons: 92 },
    { courseId: 'c2', enrolledAt: '2026-03-10T12:00:00.000Z', completedLessons: 120 },
    { courseId: 'c3', enrolledAt: '2026-09-20T12:00:00.000Z', completedLessons: 10 },
  ],
});

const isText = (value: unknown, max: number): value is string =>
  typeof value === 'string' && value.trim().length > 0 && value.length <= max;

/** Lê e valida o que veio do navegador: qualquer valor fora do formato esperado é descartado. */
function sanitize(raw: unknown): Snapshot {
  const accounts: DemoAccount[] = [];
  const source = raw && typeof raw === 'object' ? (raw as Partial<Snapshot>) : {};
  for (const item of Array.isArray(source.accounts) ? source.accounts : []) {
    if (!item || !isText(item.name, 60) || !isText(item.email, 120) || !isText(item.createdAt, 40)) continue;
    if (accounts.some((a) => a.email === item.email)) continue;
    const enrollments: DemoEnrollment[] = [];
    for (const e of Array.isArray(item.enrollments) ? item.enrollments : []) {
      const course = courses.find((c) => c.id === e?.courseId);
      if (!course || !isText(e.enrolledAt, 40) || enrollments.some((x) => x.courseId === course.id)) continue;
      const done = Number.isFinite(e.completedLessons) ? Math.floor(e.completedLessons) : 0;
      enrollments.push({ courseId: course.id, enrolledAt: e.enrolledAt, completedLessons: Math.min(Math.max(done, 0), course.lessons) });
    }
    accounts.push({ name: item.name, email: item.email, createdAt: item.createdAt, enrollments });
  }
  if (!accounts.some((a) => a.email === DEMO_EMAIL)) accounts.unshift(seedAccount());
  const session = typeof source.session === 'string' && accounts.some((a) => a.email === source.session) ? source.session : null;
  return { accounts, session };
}

function load(): Snapshot {
  try {
    const text = window.localStorage.getItem(KEY);
    return sanitize(text ? JSON.parse(text) : null);
  } catch {
    return sanitize(null); // armazenamento indisponível ou corrompido: começa do zero, só em memória
  }
}

let snapshot: Snapshot = load();
const listeners = new Set<() => void>();

function commit(next: Snapshot): void {
  snapshot = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* sem armazenamento (ex.: modo privado): a demonstração continua funcionando em memória */
  }
  listeners.forEach((listener) => listener());
}

if (typeof window !== 'undefined') {
  // Mantém abas abertas em sincronia.
  window.addEventListener('storage', (event) => {
    if (event.key !== KEY && event.key !== null) return;
    snapshot = load();
    listeners.forEach((listener) => listener());
  });
}

export const subscribeDemo = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
export const getDemoSnapshot = (): Snapshot => snapshot;

export const normalizeEmail = (email: string): string => email.trim().toLowerCase();

export function signUp(name: string, email: string): ActionResult {
  const clean = normalizeEmail(email);
  if (snapshot.accounts.some((a) => a.email === clean)) {
    return { ok: false, message: 'Já existe uma conta de demonstração com este e-mail. Entre ou use outro e-mail.' };
  }
  const account: DemoAccount = { name: name.trim(), email: clean, createdAt: new Date().toISOString(), enrollments: [] };
  commit({ accounts: [...snapshot.accounts, account], session: clean });
  return { ok: true };
}

export function logIn(email: string): ActionResult {
  const clean = normalizeEmail(email);
  if (!snapshot.accounts.some((a) => a.email === clean)) {
    return { ok: false, message: 'Não há conta de demonstração com este e-mail. Crie uma conta ou use a conta de exemplo.' };
  }
  commit({ ...snapshot, session: clean });
  return { ok: true };
}

export const logOut = (): void => commit({ ...snapshot, session: null });

/** Apaga tudo o que a demonstração guardou neste navegador (contas, sessão e progresso). */
export function resetDemo(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* nada a apagar */
  }
  snapshot = sanitize(null);
  listeners.forEach((listener) => listener());
}

function updateSessionAccount(change: (account: DemoAccount) => DemoAccount): void {
  if (!snapshot.session) return;
  commit({ ...snapshot, accounts: snapshot.accounts.map((a) => (a.email === snapshot.session ? change(a) : a)) });
}

export const enroll = (courseId: string): void =>
  updateSessionAccount((a) =>
    a.enrollments.some((e) => e.courseId === courseId) || !courses.some((c) => c.id === courseId)
      ? a
      : { ...a, enrollments: [...a.enrollments, { courseId, enrolledAt: new Date().toISOString(), completedLessons: 0 }] },
  );

export const unenroll = (courseId: string): void =>
  updateSessionAccount((a) => ({ ...a, enrollments: a.enrollments.filter((e) => e.courseId !== courseId) }));

export const advanceLesson = (courseId: string): void =>
  updateSessionAccount((a) => ({
    ...a,
    enrollments: a.enrollments.map((e) => {
      const lessons = courses.find((c) => c.id === courseId)?.lessons ?? 0;
      return e.courseId === courseId ? { ...e, completedLessons: Math.min(e.completedLessons + 1, lessons) } : e;
    }),
  }));
