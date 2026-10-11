import { categoryById } from '@/data/categories';
import { instructorById } from '@/data/instructors';
import type { CategoryId, Course, Level } from '@/types';

/** Regras de busca, filtro e ordenação do catálogo. Funções puras: a mesma entrada gera sempre o mesmo resultado. */

export const levels: Level[] = ['Iniciante', 'Intermediário', 'Avançado'];

export type SortKey = 'destaque' | 'nome' | 'menor-preco' | 'maior-preco' | 'avaliacao' | 'alunos';

export const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'destaque', label: 'Destaques' },
  { value: 'nome', label: 'Nome (A–Z)' },
  { value: 'menor-preco', label: 'Menor preço' },
  { value: 'maior-preco', label: 'Maior preço' },
  { value: 'avaliacao', label: 'Melhor avaliação' },
  { value: 'alunos', label: 'Mais alunos' },
];

export interface CatalogFilters {
  q: string;
  category: CategoryId | '';
  level: Level | '';
  sort: SortKey;
}

export const defaultFilters: CatalogFilters = { q: '', category: '', level: '', sort: 'destaque' };

/** Minúsculas e sem acentos: "Segurança" casa com "seguranca". */
export const normalize = (text: string): string =>
  text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/\s+/g, ' ').trim();

const searchIndex = new WeakMap<Course, string>();

/** Campos pesquisáveis: título, resumo, tags, categoria, nível, nome da instrutoria e "gratuito". */
function haystack(course: Course): string {
  let text = searchIndex.get(course);
  if (text === undefined) {
    const instructor = instructorById(course.instructorId);
    text = normalize(
      [
        course.title,
        course.summary,
        course.tags.join(' '),
        categoryById(course.category)?.name ?? '',
        course.level,
        instructor?.name ?? '',
        course.price ? '' : 'gratuito',
      ].join(' '),
    );
    searchIndex.set(course, text);
  }
  return text;
}

/** Todos os termos digitados precisam aparecer (em qualquer campo). Busca vazia aceita tudo. */
export function matchesQuery(course: Course, query: string): boolean {
  const terms = normalize(query).split(' ').filter(Boolean);
  if (terms.length === 0) return true;
  const text = haystack(course);
  return terms.every((term) => text.includes(term));
}

/** Busca + categoria + nível, sempre em conjunto (E). `ignore` serve para calcular a contagem de cada opção. */
export function applyFilters(list: Course[], filters: CatalogFilters, ignore?: 'category' | 'level'): Course[] {
  return list.filter(
    (course) =>
      matchesQuery(course, filters.q) &&
      (ignore === 'category' || !filters.category || course.category === filters.category) &&
      (ignore === 'level' || !filters.level || course.level === filters.level),
  );
}

const byTitle = (a: Course, b: Course) => a.title.localeCompare(b.title, 'pt-BR', { sensitivity: 'base' });
/** Curso sem preço é gratuito e vale 0: vem primeiro no menor preço e por último no maior. */
const priceOf = (course: Course) => course.price ?? 0;

export function sortCourses(list: Course[], sort: SortKey): Course[] {
  const items = [...list]; // não altera a ordem original dos dados (a página inicial depende dela)
  switch (sort) {
    case 'nome':
      return items.sort(byTitle);
    case 'menor-preco':
      return items.sort((a, b) => priceOf(a) - priceOf(b) || byTitle(a, b));
    case 'maior-preco':
      return items.sort((a, b) => priceOf(b) - priceOf(a) || byTitle(a, b));
    case 'avaliacao':
      return items.sort((a, b) => b.rating - a.rating || b.students - a.students || byTitle(a, b));
    case 'alunos':
      return items.sort((a, b) => b.students - a.students || byTitle(a, b));
    default:
      return items;
  }
}

export function queryCourses(list: Course[], filters: CatalogFilters): Course[] {
  return sortCourses(applyFilters(list, filters), filters.sort);
}

/** Quantos cursos cada categoria/nível teria com a busca e o outro filtro atuais. */
export function facetCounts(list: Course[], filters: CatalogFilters) {
  const category: Record<string, number> = {};
  const level: Record<string, number> = {};
  for (const course of applyFilters(list, filters, 'category')) category[course.category] = (category[course.category] ?? 0) + 1;
  for (const course of applyFilters(list, filters, 'level')) level[course.level] = (level[course.level] ?? 0) + 1;
  return { category, level };
}

export const hasActiveFilters = (f: CatalogFilters): boolean => Boolean(f.q.trim() || f.category || f.level);

export const sameFilters = (a: CatalogFilters, b: CatalogFilters): boolean =>
  a.q === b.q && a.category === b.category && a.level === b.level && a.sort === b.sort;

/* ---------- Endereço (#/cursos?q=...&categoria=...&nivel=...&ordem=...) ---------- */

export function filtersFromParams(params: URLSearchParams, validCategories: string[]): CatalogFilters {
  const category = params.get('categoria') ?? '';
  const level = levels.find((l) => normalize(l) === normalize(params.get('nivel') ?? ''));
  const sort = sortOptions.find((o) => o.value === params.get('ordem'));
  return {
    q: (params.get('q') ?? '').slice(0, 80),
    category: validCategories.includes(category) ? (category as CategoryId) : '',
    level: level ?? '',
    sort: sort?.value ?? 'destaque',
  };
}

export function filtersToParams(filters: CatalogFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.q.trim()) params.set('q', filters.q.trim());
  if (filters.category) params.set('categoria', filters.category);
  if (filters.level) params.set('nivel', normalize(filters.level));
  if (filters.sort !== 'destaque') params.set('ordem', filters.sort);
  return params;
}

/** Última busca do catálogo, para o botão "Voltar ao catálogo" da página do curso manter os filtros. */
let lastCatalogQuery = '';
export const rememberCatalogQuery = (query: string): void => {
  lastCatalogQuery = query;
};
export const catalogHref = (): string => (lastCatalogQuery ? `/cursos?${lastCatalogQuery}` : '/cursos');
