import { AppLink } from '@/app/router';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { CourseCover } from '@/components/ui/CourseCover';
import { Icon } from '@/components/ui/Icon';
import { Rating } from '@/components/ui/Rating';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/hooks/useReveal';
import { categoryById } from '@/data/categories';
import { useCourses } from '@/hooks/useCourses';
import { instructorById } from '@/data/instructors';
import { coverPatternFor as patternFor, formatNumber } from '@/utils/course';
import type { Course } from '@/types';

function FeatureCard({ course }: { course: Course }) {
  const category = categoryById(course.category)!;
  const instructor = instructorById(course.instructorId);
  return (
    <article className="feature-course surface-dark">
      <CourseCover tone={category.tone} pattern={patternFor(course.category)} className="feature-course__cover" />
      <div className="feature-course__body">
        <div className="feature-course__tags">
          <Badge tone={category.tone}>{category.name}</Badge>
          <span className="feature-course__flag">Mais procurado</span>
        </div>
        <h3 className="display feature-course__title">{course.title}</h3>
        <p className="feature-course__summary">{course.summary}</p>
        <ul className="meta-list">
          <li>
            <Icon name="clock" size={16} /> {course.hours} horas
          </li>
          <li>
            <Icon name="book" size={16} /> {course.lessons} aulas
          </li>
          <li>
            <Icon name="users" size={16} /> {formatNumber(course.students)} alunos (exemplo)
          </li>
          <li>
            <Rating value={course.rating} />
          </li>
        </ul>
        <div className="feature-course__footer">
          <p className="feature-course__by">
            <span>Instrutora</span> {instructor?.name}
          </p>
          <ButtonLink to={`/cursos/${course.slug}`} variant="accent" arrow>
            Ver detalhes
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}

function CourseRow({ course }: { course: Course }) {
  const category = categoryById(course.category)!;
  return (
    <li>
      <AppLink to={`/cursos/${course.slug}`} className="course-row">
        <CourseCover tone={category.tone} pattern={patternFor(course.category)} className="course-row__cover" />
        <span className="course-row__main">
          <span className="course-row__cat">{category.name}</span>
          <span className="course-row__title">{course.title}</span>
          <span className="course-row__meta">
            {course.level} · {course.hours} h · <Rating value={course.rating} />
          </span>
        </span>
        <Icon name="arrowRight" size={20} className="course-row__arrow" />
      </AppLink>
    </li>
  );
}

export function FeaturedCourses() {
  // Vitrine: as seis primeiras posições do catálogo (cursos novos entram no fim, sem mudar a página inicial).
  const [main, ...others] = useCourses().slice(0, 6);
  if (!main) return null;
  return (
    <section id="cursos" className="section surface-light" aria-labelledby="cursos-title" tabIndex={-1}>
      <div className="container">
        <div className="section-top">
          <SectionHeading eyebrow="Cursos em destaque" title="Comece por onde a carreira pede." id="cursos-title">
            Programas organizados em trilhas, com projetos práticos e carga horária realista.
          </SectionHeading>
          <ButtonLink to="/cursos" variant="secondary" arrow className="section-top__action">
            Ver catálogo completo
          </ButtonLink>
        </div>

        <div className="featured">
          <Reveal className="featured__main">
            <FeatureCard course={main} />
          </Reveal>
          <Reveal className="featured__list" delay={120}>
            <ul>
              {others.map((course) => (
                <CourseRow key={course.id} course={course} />
              ))}
            </ul>
          </Reveal>
        </div>
        <p className="demo-note">Cursos, instrutores e números são fictícios.</p>
      </div>
    </section>
  );
}
