import { AppLink } from '@/app/router';
import { CourseCard, LevelMeter } from '@/components/courses/CourseCard';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { CourseCover } from '@/components/ui/CourseCover';
import { Icon } from '@/components/ui/Icon';
import { Rating } from '@/components/ui/Rating';
import { categoryById } from '@/data/categories';
import { courses } from '@/data/courses';
import { instructorById } from '@/data/instructors';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useAuth } from '@/hooks/useAuth';
import { catalogHref } from '@/utils/catalog';
import { coverPatternFor, formatNumber, formatPrice } from '@/utils/course';
import type { Course } from '@/types';

/** Até três sugestões: primeiro a mesma categoria, depois o mesmo nível, depois o restante. */
function relatedCourses(course: Course): Course[] {
  const others = courses.filter((c) => c.id !== course.id);
  const score = (c: Course) => (c.category === course.category ? 2 : 0) + (c.level === course.level ? 1 : 0);
  return others
    .map((c, index) => ({ c, index }))
    .sort((a, b) => score(b.c) - score(a.c) || a.index - b.index)
    .slice(0, 3)
    .map(({ c }) => c);
}

export function CourseNotFound({ slug }: { slug: string }) {
  return (
    <section className="page-notice surface-light" aria-labelledby="notice-title">
      <div className="container page-notice__inner">
        <span className="page-notice__icon" aria-hidden="true">
          <Icon name="compass" size={28} />
        </span>
        <p className="eyebrow">
          <span className="eyebrow__dot" aria-hidden="true" />
          Curso não encontrado
        </p>
        <h1 id="notice-title" className="display page-notice__title">
          Não existe um curso com esse endereço
        </h1>
        <p className="page-notice__text">
          Não encontramos o curso “{slug}”. Ele pode ter sido renomeado ou o link pode estar incompleto. Veja a lista de
          cursos para encontrar o que procura.
        </p>
        <div className="page-notice__actions">
          <ButtonLink to={catalogHref()} variant="primary" arrow>
            Ver catálogo de cursos
          </ButtonLink>
          <ButtonLink to="/" variant="secondary">
            Voltar ao início
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

/** Página de detalhes de um curso (#/cursos/:slug). */
export function CourseDetail({ params }: { params: Record<string, string> }) {
  const slug = params.slug ?? '';
  const course = courses.find((c) => c.slug === slug);
  useDocumentTitle(course ? course.title : 'Curso não encontrado');
  const { user } = useAuth();

  if (!course) return <CourseNotFound slug={slug} />;

  const category = categoryById(course.category);
  const instructor = instructorById(course.instructorId);
  if (!category) return <CourseNotFound slug={slug} />;

  const isFree = !course.price;
  const enrolled = Boolean(user?.enrollments.some((e) => e.courseId === course.id));
  const related = relatedCourses(course);

  return (
    <>
      <section className="hero catalog-hero course-hero surface-dark" aria-labelledby="curso-title">
        <div className="container catalog-hero__inner">
          <nav className="breadcrumb" aria-label="Você está em">
            <ol>
              <li>
                <AppLink to="/">Início</AppLink>
              </li>
              <li>
                <AppLink to={catalogHref()}>Cursos</AppLink>
              </li>
              <li aria-current="page">{course.title}</li>
            </ol>
          </nav>
          <div className="course-hero__tags">
            <Badge tone={category.tone}>{category.name}</Badge>
            <LevelMeter level={course.level} />
          </div>
          <h1 id="curso-title" className="display catalog-hero__title course-hero__title">
            {course.title}
          </h1>
          <p className="lead">{course.summary}</p>
          <ul className="hero__proof">
            <li>
              <Icon name="clock" size={16} strokeWidth={2.2} />
              {course.hours} horas
            </li>
            <li>
              <Icon name="book" size={16} strokeWidth={2.2} />
              {course.lessons} aulas
            </li>
            <li>
              <Icon name="star" size={16} strokeWidth={2.2} />
              <Rating value={course.rating} />
            </li>
            <li>
              <Icon name="users" size={16} strokeWidth={2.2} />
              {formatNumber(course.students)} alunos
            </li>
          </ul>
        </div>
      </section>

      <section className="section section--tint surface-light course-detail" aria-label="Detalhes do curso">
        <div className="container course-detail__layout">
          <div className="course-detail__main">
            <section aria-labelledby="curso-sobre">
              <h2 id="curso-sobre" className="display course-detail__heading">
                Sobre o curso
              </h2>
              <p className="course-detail__text">{course.summary}</p>
              <p className="course-detail__text">
                São {course.lessons} aulas e cerca de {course.hours} horas de conteúdo, no nível {course.level.toLowerCase()}
                , da área de {category.name}.
              </p>
            </section>

            <section aria-labelledby="curso-temas">
              <h2 id="curso-temas" className="display course-detail__heading">
                Temas e tecnologias
              </h2>
              <ul className="chips">
                {course.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </section>

            {instructor ? (
              <section aria-labelledby="curso-instrutoria">
                <h2 id="curso-instrutoria" className="display course-detail__heading">
                  Quem ensina
                </h2>
                <div className="course-instructor">
                  <span className="course-card__avatar course-instructor__avatar" data-tone={instructor.tone} aria-hidden="true">
                    {instructor.initials}
                  </span>
                  <div>
                    <p className="course-instructor__name">{instructor.name}</p>
                    <p className="course-instructor__role">{instructor.role}</p>
                    <p className="course-detail__text">{instructor.bio}</p>
                    <ul className="chips">
                      {instructor.expertise.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            ) : null}
          </div>

          <aside className="course-detail__aside" aria-label="Matrícula e resumo">
            <div className="card course-buy">
              <CourseCover tone={category.tone} pattern={coverPatternFor(course.category)} className="course-buy__cover" />
              <div className="course-buy__body">
                <p className={`course-card__price ${isFree ? 'course-card__price--free' : ''}`.trim()}>
                  <span>Valor</span>
                  {formatPrice(course.price)}
                </p>
                {enrolled ? (
                  <>
                    <p className="course-buy__status" role="status">
                      <Icon name="check" size={18} /> Você está inscrito neste curso
                    </p>
                    <ButtonLink to="/aluno" variant="primary" fullWidth>
                      Ir para a área do aluno
                    </ButtonLink>
                  </>
                ) : (
                  <>
                    <ButtonLink to={`/cursos/${course.slug}/inscricao`} variant="primary" fullWidth arrow>
                      Inscrever-se (demonstração)
                    </ButtonLink>
                    <p className="field__hint">Inscrição simulada: sem pagamento e sem cobrança. {user ? '' : 'Pede login antes de confirmar.'}</p>
                  </>
                )}
                <ButtonLink to={catalogHref()} variant="secondary" fullWidth>
                  Voltar ao catálogo
                </ButtonLink>
                <dl className="course-facts">
                  <div>
                    <dt>Nível</dt>
                    <dd>{course.level}</dd>
                  </div>
                  <div>
                    <dt>Carga horária</dt>
                    <dd>{course.hours} horas</dd>
                  </div>
                  <div>
                    <dt>Aulas</dt>
                    <dd>{course.lessons}</dd>
                  </div>
                  <div>
                    <dt>Categoria</dt>
                    <dd>{category.name}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="section surface-light course-related" aria-labelledby="curso-relacionados">
          <div className="container">
            <div className="section-top">
              <h2 id="curso-relacionados" className="display course-detail__heading">
                Continue explorando
              </h2>
              <ButtonLink to={catalogHref()} variant="secondary" arrow className="section-top__action">
                Ver todos os cursos
              </ButtonLink>
            </div>
            <ul className="catalog__grid">
              {related.map((item) => (
                <li key={item.id}>
                  <CourseCard course={item} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}
