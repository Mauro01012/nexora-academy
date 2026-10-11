import { useEffect, useMemo, useState } from 'react';
import { readPath, readQuery, replaceQuery } from '@/app/router';
import { CatalogFilters } from '@/components/courses/CatalogFilters';
import { CourseCard } from '@/components/courses/CourseCard';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/hooks/useReveal';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { categories } from '@/data/categories';
import { useCourses } from '@/hooks/useCourses';
import {
  defaultFilters,
  filtersFromParams,
  filtersToParams,
  hasActiveFilters,
  queryCourses,
  rememberCatalogQuery,
  sameFilters,
} from '@/utils/catalog';
import type { CatalogFilters as Filters } from '@/utils/catalog';

const categoryIds = categories.map((c) => c.id as string);
const readFilters = (): Filters => filtersFromParams(readQuery(), categoryIds);

/** Catálogo: busca, filtros e ordenação combinados. O estado fica no endereço (#/cursos?q=...) e pode ser compartilhado. */
export function Courses() {
  useDocumentTitle('Catálogo de cursos');
  const courses = useCourses();
  const [filters, setFilters] = useState<Filters>(readFilters);

  // Links com filtros e os botões voltar/avançar do navegador alteram o endereço sem remontar a página.
  useEffect(() => {
    const onHashChange = () => {
      if (readPath() !== '/cursos') return;
      const next = readFilters();
      setFilters((current) => (sameFilters(current, next) ? current : next));
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Estado -> endereço. A gravação espera a pessoa parar de digitar para não encher o histórico de chamadas.
  useEffect(() => {
    const params = filtersToParams(filters);
    rememberCatalogQuery(params.toString());
    const timer = window.setTimeout(() => replaceQuery(params), 200);
    return () => window.clearTimeout(timer);
  }, [filters]);

  const change = (patch: Partial<Filters>) => setFilters((current) => ({ ...current, ...patch }));
  const clear = () => setFilters((current) => ({ ...defaultFilters, sort: current.sort }));

  const results = useMemo(() => queryCourses(courses, filters), [courses, filters]);
  const filtered = hasActiveFilters(filters);

  const areas = new Set(courses.map((c) => c.category)).size;
  const levels = new Set(courses.map((c) => c.level)).size;

  return (
    <>
      <section className="hero catalog-hero surface-dark" aria-labelledby="catalogo-title">
        <div className="container catalog-hero__inner">
          <p className="eyebrow eyebrow--on-dark">
            <span className="eyebrow__dot" aria-hidden="true" />
            Catálogo de cursos
          </p>
          <h1 id="catalogo-title" className="display catalog-hero__title">
            Um curso para cada etapa da sua carreira.
          </h1>
          <p className="lead">
            Programas práticos em tecnologia, com projetos revisados por especialistas e carga horária realista. Veja o
            que cada curso entrega e escolha por onde começar.
          </p>
          <ul className="hero__proof">
            <li>
              <Icon name="layers" size={16} strokeWidth={2.2} />
              {courses.length} cursos
            </li>
            <li>
              <Icon name="compass" size={16} strokeWidth={2.2} />
              {areas} áreas
            </li>
            <li>
              <Icon name="award" size={16} strokeWidth={2.2} />
              {levels} níveis
            </li>
          </ul>
        </div>
      </section>

      <section id="catalogo" className="section section--tint surface-light" aria-labelledby="catalogo-lista-title" tabIndex={-1}>
        <div className="container">
          <h2 id="catalogo-lista-title" className="visually-hidden">
            Lista de cursos
          </h2>

          <CatalogFilters filters={filters} onChange={change} onClear={clear} />

          <p className="catalog__count" role="status">
            {filtered ? `${results.length} de ${courses.length} cursos` : `${courses.length} cursos`}
            <span> {filtered ? 'encontrados' : 'nesta amostra do catálogo'}</span>
          </p>

          {results.length > 0 ? (
            <ul className="catalog__grid">
              {results.map((course, index) => (
                <li key={course.id}>
                  <Reveal className="catalog__item" delay={(index % 3) * 80}>
                    <CourseCard course={course} />
                  </Reveal>
                </li>
              ))}
            </ul>
          ) : (
            <div className="catalog-empty">
              <span className="catalog-empty__icon" aria-hidden="true">
                <Icon name="compass" size={28} />
              </span>
              <h3 className="display catalog-empty__title">{courses.length === 0 ? 'O catálogo está vazio' : 'Nenhum curso encontrado'}</h3>
              <p className="catalog-empty__text">
                {courses.length === 0
                  ? 'Ainda não há cursos publicados. Volte em breve.'
                  : filters.q.trim()
                  ? `Não há cursos para “${filters.q.trim()}” com os filtros escolhidos.`
                  : 'Nenhum curso combina com os filtros escolhidos.'}{' '}
                {courses.length === 0 ? '' : 'Tente outro termo, remova um filtro ou volte à lista completa.'}
              </p>
              {courses.length === 0 ? null : (
                <Button variant="primary" onClick={clear}>
                  Limpar busca e filtros
                </Button>
              )}
            </div>
          )}

          <p className="demo-note">
            Cursos, instrutores, preços e números são fictícios. Esta é uma amostra do catálogo, criada apenas para a
            demonstração.
          </p>
        </div>
      </section>
    </>
  );
}
