import { ButtonLink } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { CourseCover } from '@/components/ui/CourseCover';
import { Icon } from '@/components/ui/Icon';
import { Rating } from '@/components/ui/Rating';
import { categoryById } from '@/data/categories';
import { instructorById } from '@/data/instructors';
import { coverPatternFor, formatNumber, formatPrice, levelRank } from '@/utils/course';
import type { Course } from '@/types';

export function LevelMeter({ level }: { level: Course['level'] }) {
  const rank = levelRank[level];
  return (
    <span className="level-meter">
      <span className="level-meter__bars" aria-hidden="true">
        {[1, 2, 3].map((step) => (
          <span key={step} className={step <= rank ? 'is-on' : undefined} />
        ))}
      </span>
      <span className="visually-hidden">Nível </span>
      {level}
    </span>
  );
}

/** Cartão de curso do catálogo. Segue a linguagem visual dos cursos em destaque da página inicial. */
export function CourseCard({ course }: { course: Course }) {
  const category = categoryById(course.category);
  const instructor = instructorById(course.instructorId);
  if (!category) return null;

  const titleId = `curso-${course.id}-titulo`;
  const price = formatPrice(course.price);
  const isFree = !course.price;

  return (
    <Card as="article" interactive className="course-card" aria-labelledby={titleId}>
      <CourseCover tone={category.tone} pattern={coverPatternFor(course.category)} className="course-card__cover" />
      <div className="course-card__body">
        <div className="course-card__tags">
          <Badge tone={category.tone}>{category.name}</Badge>
          <LevelMeter level={course.level} />
        </div>

        <h3 id={titleId} className="display course-card__title">
          {course.title}
        </h3>
        <p className="course-card__summary">{course.summary}</p>

        <ul className="meta-list course-card__meta">
          <li>
            <Icon name="clock" size={16} /> {course.hours} horas
          </li>
          <li>
            <Icon name="book" size={16} /> {course.lessons} aulas
          </li>
          <li>
            <Rating value={course.rating} />
          </li>
          <li>
            <Icon name="users" size={16} /> {formatNumber(course.students)} alunos
          </li>
        </ul>

        {instructor ? (
          <p className="course-card__by">
            <span className="course-card__avatar" data-tone={instructor.tone} aria-hidden="true">
              {instructor.initials}
            </span>
            <span className="course-card__by-text">
              <span>Instrutoria</span>
              {instructor.name}
            </span>
          </p>
        ) : null}

        <div className="course-card__footer">
          <p className={`course-card__price ${isFree ? 'course-card__price--free' : ''}`.trim()}>
            <span>Valor</span>
            {price}
          </p>
          <ButtonLink to={`/cursos/${course.slug}`} variant="secondary" arrow>
            Ver detalhes<span className="visually-hidden"> de {course.title}</span>
          </ButtonLink>
        </div>
      </div>
    </Card>
  );
}
