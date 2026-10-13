import { categories } from '@/data/categories';
import { instructors } from '@/data/instructors';
import type { Course, Level } from '@/types';
import { levels } from '@/utils/catalog';

/** Valores do formulário de curso (tudo texto, como nos campos) e suas validações. */
export interface CourseFormValues {
  title: string;
  slug: string;
  summary: string;
  category: string;
  level: string;
  hours: string;
  lessons: string;
  rating: string;
  students: string;
  price: string;
  instructorId: string;
  tags: string;
  featured: boolean;
}
export type CourseFormErrors = Partial<Record<keyof CourseFormValues, string>>;
export type CourseInput = Omit<Course, 'id'>;

export const emptyForm = (): CourseFormValues => ({
  title: '', slug: '', summary: '', category: categories[0].id, level: levels[0], hours: '', lessons: '',
  rating: '4.5', students: '0', price: '', instructorId: instructors[0].id, tags: '', featured: false,
});

export function slugify(text: string): string {
  return text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60).replace(/-+$/g, '');
}

export const parseTags = (text: string): string[] =>
  [...new Set(text.split(',').map((t) => t.trim()).filter(Boolean))];

const num = (text: string): number => (text.trim() === '' ? NaN : Number(text.trim().replace(',', '.')));

/**
 * Número inteiro digitado em português: aceita ponto como separador de milhar ("2.000" = 2000).
 * Sem isso, "2.000" seria lido como 2 em silêncio. Vale só para campos inteiros; a nota usa `num` (4,5 ou 4.5).
 */
const int = (text: string): number => {
  const t = text.trim();
  return /^\d{1,3}(\.\d{3})+$/.test(t) ? Number(t.replace(/\./g, '')) : num(t);
};

export function validateCourseForm(v: CourseFormValues, others: Course[]): CourseFormErrors {
  const e: CourseFormErrors = {};
  const title = v.title.trim();
  if (!title) e.title = 'Informe o título do curso.';
  else if (title.length < 3 || title.length > 80) e.title = 'Use entre 3 e 80 caracteres.';
  const slug = v.slug.trim();
  if (!slug) e.slug = 'Informe o endereço do curso (slug).';
  else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) || slug.length > 60) e.slug = 'Use só letras minúsculas, números e hifens (até 60 caracteres).';
  else if (others.some((c) => c.slug === slug)) e.slug = 'Já existe um curso com este endereço. Escolha outro.';
  const summary = v.summary.trim();
  if (summary.length < 20 || summary.length > 300) e.summary = 'Descreva o curso em 20 a 300 caracteres.';
  if (!categories.some((c) => c.id === v.category)) e.category = 'Escolha uma categoria.';
  if (!levels.includes(v.level as Level)) e.level = 'Escolha um nível.';
  const hours = int(v.hours);
  if (!Number.isInteger(hours) || hours < 1 || hours > 500) e.hours = 'Informe um número inteiro de 1 a 500.';
  const lessons = int(v.lessons);
  if (!Number.isInteger(lessons) || lessons < 1 || lessons > 1000) e.lessons = 'Informe um número inteiro de 1 a 1000.';
  const rating = num(v.rating);
  if (!Number.isFinite(rating) || rating < 0 || rating > 5) e.rating = 'Informe uma nota de 0 a 5.';
  const students = int(v.students);
  if (!Number.isInteger(students) || students < 0 || students > 10_000_000) e.students = 'Informe um número inteiro de 0 a 10.000.000.';
  if (v.price.trim() !== '') {
    const price = int(v.price);
    if (!Number.isInteger(price) || price < 0 || price > 99_999) e.price = 'Informe um valor inteiro em reais (0 a 99.999) ou deixe em branco para gratuito.';
  }
  if (!instructors.some((i) => i.id === v.instructorId)) e.instructorId = 'Escolha uma instrutoria.';
  const tags = parseTags(v.tags);
  if (tags.length > 6 || tags.some((t) => t.length > 24)) e.tags = 'Use até 6 temas, separados por vírgula, com até 24 caracteres cada.';
  return e;
}

export function toCourseInput(v: CourseFormValues): CourseInput {
  const price = v.price.trim() === '' ? 0 : int(v.price);
  return {
    slug: v.slug.trim(), title: v.title.trim(), summary: v.summary.trim(), category: v.category as Course['category'],
    level: v.level as Level, hours: int(v.hours), lessons: int(v.lessons), rating: Math.round(num(v.rating) * 10) / 10,
    students: int(v.students), ...(price > 0 ? { price } : {}), instructorId: v.instructorId, tags: parseTags(v.tags),
    ...(v.featured ? { featured: true } : {}),
  };
}

export const fromCourse = (c: Course): CourseFormValues => ({
  title: c.title, slug: c.slug, summary: c.summary, category: c.category, level: c.level, hours: String(c.hours),
  lessons: String(c.lessons), rating: String(c.rating), students: String(c.students), price: c.price ? String(c.price) : '',
  instructorId: c.instructorId, tags: c.tags.join(', '), featured: Boolean(c.featured),
});

/** Confere um curso lido do armazenamento local (descarta o que estiver fora do formato esperado). */
export function isStoredCourse(c: unknown): c is Course {
  const x = c as Partial<Course> | null;
  if (!x || typeof x !== 'object' || typeof x.id !== 'string' || !x.id || x.id.length > 60) return false;
  if (typeof x.title !== 'string' || typeof x.summary !== 'string' || typeof x.slug !== 'string') return false;
  if (!Array.isArray(x.tags) || !x.tags.every((t) => typeof t === 'string')) return false;
  if (![x.hours, x.lessons, x.rating, x.students].every((n) => typeof n === 'number') || (x.price !== undefined && typeof x.price !== 'number')) return false;
  return Object.keys(validateCourseForm({ ...fromCourse(x as Course), tags: x.tags.join(', ') }, [])).length === 0;
}
