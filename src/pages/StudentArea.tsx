import { RequireAuth } from '@/components/auth/RequireAuth';
import { CourseCard } from '@/components/courses/CourseCard';
import { Badge } from '@/components/ui/Badge';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CourseCover } from '@/components/ui/CourseCover';
import { Icon } from '@/components/ui/Icon';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { AppLink } from '@/app/router';
import { categoryById } from '@/data/categories';
import { courses } from '@/data/courses';
import { useAuth } from '@/hooks/useAuth';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { coverPatternFor, formatNumber } from '@/utils/course';
import { progressOf } from '@/utils/progress';

const dateFormat = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' });

function StudentContent() {
  const { user, unenroll, advanceLesson } = useAuth();
  if (!user) return null;

  const items = user.enrollments.flatMap((enrollment) => {
    const course = courses.find((c) => c.id === enrollment.courseId);
    return course ? [{ course, progress: progressOf(enrollment, course) }] : [];
  });
  const lessonsDone = items.reduce((sum, i) => sum + i.progress.done, 0);
  const hoursStudied = Math.round(items.reduce((sum, i) => sum + (i.course.hours * i.progress.done) / i.course.lessons, 0));
  const completed = items.filter((i) => i.progress.complete).length;
  const suggestions = courses.filter((c) => !user.enrollments.some((e) => e.courseId === c.id)).slice(0, 3);
  const firstName = user.name.split(' ')[0];

  return (
    <>
      <section className="hero catalog-hero surface-dark" aria-labelledby="aluno-title">
        <div className="container catalog-hero__inner">
          <p className="eyebrow eyebrow--on-dark">
            <span className="eyebrow__dot" aria-hidden="true" />
            Área do aluno (demonstração)
          </p>
          <h1 id="aluno-title" className="display catalog-hero__title">
            Olá, {firstName}.
          </h1>
          <p className="lead">Acompanhe seus cursos e o progresso. Tudo aqui é fictício e fica só neste navegador.</p>
        </div>
      </section>

      <section className="section section--tint surface-light student" aria-labelledby="aluno-resumo">
        <div className="container student__layout">
          <div className="card student__summary">
            <h2 id="aluno-resumo" className="display student__heading">
              Resumo da conta
            </h2>
            <dl className="course-facts">
              <div>
                <dt>Nome</dt>
                <dd>{user.name}</dd>
              </div>
              <div>
                <dt>E-mail</dt>
                <dd className="student__email">{user.email}</dd>
              </div>
              <div>
                <dt>Conta criada em</dt>
                <dd>{dateFormat.format(new Date(user.createdAt))}</dd>
              </div>
              <div>
                <dt>Tipo</dt>
                <dd>Conta de demonstração</dd>
              </div>
            </dl>
            <ButtonLink to="/sair" variant="secondary" fullWidth>
              Sair da conta
            </ButtonLink>
          </div>

          <div className="student__main">
            <ul className="student__stats" aria-label="Resumo do aprendizado">
              <li>
                <strong>{items.length}</strong>
                <span>{items.length === 1 ? 'curso inscrito' : 'cursos inscritos'}</span>
              </li>
              <li>
                <strong>{formatNumber(lessonsDone)}</strong>
                <span>aulas concluídas</span>
              </li>
              <li>
                <strong>{hoursStudied} h</strong>
                <span>estudadas</span>
              </li>
              <li>
                <strong>{completed}</strong>
                <span>{completed === 1 ? 'curso concluído' : 'cursos concluídos'}</span>
              </li>
            </ul>

            <h2 className="display student__heading">Meus cursos</h2>
            {items.length === 0 ? (
              <div className="catalog-empty">
                <span className="catalog-empty__icon" aria-hidden="true">
                  <Icon name="book" size={28} />
                </span>
                <h3 className="display catalog-empty__title">Você ainda não está inscrito em nenhum curso</h3>
                <p className="catalog-empty__text">Escolha um curso no catálogo e faça a inscrição demonstrativa para acompanhá-lo aqui.</p>
                <ButtonLink to="/cursos" variant="primary" arrow>
                  Explorar o catálogo
                </ButtonLink>
              </div>
            ) : (
              <ul className="student__courses">
                {items.map(({ course, progress }) => {
                  const category = categoryById(course.category);
                  if (!category) return null;
                  return (
                    <li key={course.id}>
                      <Card as="article" className="enrolled" aria-labelledby={`aluno-${course.id}`}>
                        <CourseCover tone={category.tone} pattern={coverPatternFor(course.category)} className="enrolled__cover" />
                        <div className="enrolled__body">
                          <Badge tone={category.tone}>{category.name}</Badge>
                          <h3 id={`aluno-${course.id}`} className="display enrolled__title">
                            <AppLink to={`/cursos/${course.slug}`}>{course.title}</AppLink>
                          </h3>
                          <ProgressBar value={progress.percent} complete={progress.complete} label={`Progresso em ${course.title}`} />
                          <p className="enrolled__progress" aria-live="polite">
                            {progress.complete
                              ? `Curso concluído: ${progress.total} de ${progress.total} aulas`
                              : `${progress.done} de ${progress.total} aulas, ${progress.percent}%`}
                          </p>
                          <div className="enrolled__actions">
                            <ButtonLink to={`/cursos/${course.slug}`} variant="secondary">
                              Ver curso
                            </ButtonLink>
                            <Button variant="ghost" disabled={progress.complete} onClick={() => advanceLesson(course.id)}>
                              Simular aula concluída
                            </Button>
                            <Button variant="ghost" onClick={() => unenroll(course.id)}>
                              Cancelar inscrição
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {suggestions.length > 0 ? (
          <div className="container student__more">
            <h2 className="display student__heading">Continue explorando</h2>
            <ul className="catalog__grid">
              {suggestions.map((course) => (
                <li key={course.id}>
                  <CourseCard course={course} />
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="container">
          <p className="demo-note">
            Demonstração: o progresso é fictício e os dados ficam só neste navegador. Para apagá-los,{' '}
            <AppLink to="/sair">saia da conta</AppLink> e marque a opção de apagar os dados.
          </p>
        </div>
      </section>
    </>
  );
}

export function StudentArea() {
  useDocumentTitle('Área do aluno');
  return (
    <RequireAuth>
      <StudentContent />
    </RequireAuth>
  );
}
