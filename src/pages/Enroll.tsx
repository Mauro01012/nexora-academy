import { useState } from 'react';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { Badge } from '@/components/ui/Badge';
import { Button, ButtonLink } from '@/components/ui/Button';
import { CourseCover } from '@/components/ui/CourseCover';
import { Icon } from '@/components/ui/Icon';
import { categoryById } from '@/data/categories';
import { useCourses } from '@/hooks/useCourses';
import { useAuth } from '@/hooks/useAuth';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { CourseNotFound } from '@/pages/CourseDetail';
import { coverPatternFor, formatPrice } from '@/utils/course';
import type { Course } from '@/types';

function EnrollFlow({ course }: { course: Course }) {
  const { user, enroll } = useAuth();
  const [justEnrolled, setJustEnrolled] = useState(false);
  const category = categoryById(course.category);
  if (!user || !category) return null;
  const enrolled = user.enrollments.some((e) => e.courseId === course.id);

  const confirm = () => {
    enroll(course.id);
    setJustEnrolled(true);
  };

  return (
    <section className="auth surface-light section--tint" aria-labelledby="enroll-title">
      <div className="container auth__inner auth__inner--wide">
        <div className="card enroll">
          <CourseCover tone={category.tone} pattern={coverPatternFor(course.category)} className="enroll__cover" />
          <div className="enroll__body">
            <Badge tone={category.tone}>{category.name}</Badge>
            <h1 id="enroll-title" className="display enroll__title">
              {justEnrolled ? 'Inscrição confirmada' : enrolled ? 'Você já está inscrito' : 'Confirmar inscrição'}
            </h1>
            <p className="enroll__course">{course.title}</p>

            {justEnrolled || enrolled ? (
              <>
                <p className="auth__intro" role="status">
                  {justEnrolled
                    ? 'O curso foi adicionado à sua área do aluno, com progresso zerado.'
                    : 'Este curso já está na sua área do aluno.'}
                </p>
                <div className="page-notice__actions">
                  <ButtonLink to="/aluno" variant="primary" arrow>
                    Ir para a área do aluno
                  </ButtonLink>
                  <ButtonLink to="/cursos" variant="secondary">
                    Ver mais cursos
                  </ButtonLink>
                </div>
              </>
            ) : (
              <>
                <dl className="course-facts">
                  <div>
                    <dt>Carga horária</dt>
                    <dd>
                      {course.hours} horas, {course.lessons} aulas
                    </dd>
                  </div>
                  <div>
                    <dt>Valor de tabela</dt>
                    <dd>{formatPrice(course.price)}</dd>
                  </div>
                  <div>
                    <dt>Cobrança nesta demonstração</dt>
                    <dd>Nenhuma</dd>
                  </div>
                </dl>
                <div className="demo-callout" role="note">
                  <Icon name="lock" size={18} />
                  <p>
                    <strong>Inscrição simulada.</strong> Não há pagamento, não pedimos dados de cartão e nada é enviado a um servidor.
                    A inscrição fica registrada só neste navegador.
                  </p>
                </div>
                <div className="page-notice__actions">
                  <Button variant="primary" onClick={confirm}>
                    Confirmar inscrição demonstrativa
                  </Button>
                  <ButtonLink to={`/cursos/${course.slug}`} variant="secondary">
                    Voltar ao curso
                  </ButtonLink>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Fluxo demonstrativo de inscrição (#/cursos/:slug/inscricao). Exige sessão. */
export function Enroll({ params }: { params: Record<string, string> }) {
  const slug = params.slug ?? '';
  const courses = useCourses();
  const course = courses.find((c) => c.slug === slug);
  useDocumentTitle(course ? `Inscrição: ${course.title}` : 'Curso não encontrado');
  if (!course) return <CourseNotFound slug={slug} />;
  return (
    <RequireAuth>
      <EnrollFlow course={course} />
    </RequireAuth>
  );
}
