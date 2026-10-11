import { CourseCard } from '@/components/courses/CourseCard';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/hooks/useReveal';
import { courses } from '@/data/courses';

/** Estrutura inicial do catálogo: lista completa de cursos. Busca e filtros ficam para as próximas etapas. */
export function Courses() {
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
          <p className="catalog__count">
            {courses.length} cursos <span>nesta amostra do catálogo</span>
          </p>

          <ul className="catalog__grid">
            {courses.map((course, index) => (
              <li key={course.id}>
                <Reveal className="catalog__item" delay={(index % 3) * 80}>
                  <CourseCard course={course} />
                </Reveal>
              </li>
            ))}
          </ul>

          <p className="demo-note">
            Cursos, instrutores, preços e números são fictícios. Esta é uma amostra: o catálogo completo e a busca chegam
            nas próximas etapas.
          </p>
        </div>
      </section>
    </>
  );
}
