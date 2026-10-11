import { useSyncExternalStore } from 'react';
import { AppLink } from '@/app/router';
import { AdminShell } from '@/components/admin/AdminShell';
import { ButtonLink } from '@/components/ui/Button';
import { categories } from '@/data/categories';
import { useBrand } from '@/hooks/useBrand';
import { useCourses } from '@/hooks/useCourses';
import { isCatalogEdited } from '@/services/courseStore';
import { isBrandCustomized } from '@/services/brandStore';
import { getDemoSnapshot, subscribeDemo } from '@/services/demoStore';
import { levels } from '@/utils/catalog';
import { formatNumber, formatPrice } from '@/utils/course';

function Metric({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <li className="metric">
      <span className="tag-demo">demo</span>
      <strong className="metric__value">{value}</strong>
      <span className="metric__label">{label}</span>
      <span className="metric__note">{note}</span>
    </li>
  );
}

function Bars({ rows }: { rows: { label: string; value: number }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <ul className="bars">
      {rows.map((row) => (
        <li key={row.label}>
          <span className="bars__label">{row.label}</span>
          <span className="bars__track" aria-hidden="true">
            <span className="bars__fill" style={{ width: `${(row.value / max) * 100}%` }} />
          </span>
          <span className="bars__value">{row.value}</span>
        </li>
      ))}
    </ul>
  );
}

export function AdminOverview() {
  const courses = useCourses();
  useBrand(); // atualiza o estado da marca abaixo quando ela for alterada
  const demo = useSyncExternalStore(subscribeDemo, getDemoSnapshot, getDemoSnapshot);

  const students = courses.reduce((sum, c) => sum + c.students, 0);
  const rating = courses.length ? courses.reduce((sum, c) => sum + c.rating, 0) / courses.length : 0;
  const revenue = courses.reduce((sum, c) => sum + (c.price ?? 0) * c.students, 0);
  const free = courses.filter((c) => !c.price).length;
  const top = [...courses].sort((a, b) => b.students - a.students).slice(0, 5);
  const localEnrollments = demo.accounts.reduce((sum, a) => sum + a.enrollments.length, 0);

  return (
    <AdminShell title="Visão geral">
      <h1 className="display admin__title">Visão geral</h1>
      <p className="admin__lead">
        <strong>Dados demonstrativos.</strong> Os números abaixo são fictícios e calculados a partir dos cursos cadastrados. Não representam alunos
        nem vendas reais.
      </p>

      <ul className="metrics" aria-label="Métricas demonstrativas">
        <Metric label="Cursos no catálogo" value={String(courses.length)} note={`${free} gratuito${free === 1 ? '' : 's'}, atualiza ao editar os cursos`} />
        <Metric label="Alunos somados" value={formatNumber(students)} note="Soma dos números fictícios de cada curso" />
        <Metric label="Avaliação média" value={rating.toFixed(1).replace('.', ',')} note="Média das notas fictícias dos cursos" />
        <Metric label="Receita simulada" value={formatPrice(revenue)} note="Preço de tabela × alunos fictícios; nada foi cobrado" />
      </ul>

      <div className="admin__grid">
        <section className="card admin-card" aria-labelledby="ov-cat">
          <h2 id="ov-cat" className="display admin-card__title">
            Cursos por categoria
          </h2>
          <Bars rows={categories.map((c) => ({ label: c.name, value: courses.filter((x) => x.category === c.id).length }))} />
        </section>
        <section className="card admin-card" aria-labelledby="ov-level">
          <h2 id="ov-level" className="display admin-card__title">
            Cursos por nível
          </h2>
          <Bars rows={levels.map((l) => ({ label: l, value: courses.filter((x) => x.level === l).length }))} />
        </section>
      </div>

      <section className="card admin-card" aria-labelledby="ov-top">
        <h2 id="ov-top" className="display admin-card__title">
          Cursos com mais alunos (fictício)
        </h2>
        {top.length === 0 ? (
          <p className="admin__muted">Nenhum curso cadastrado.</p>
        ) : (
          <ol className="top-list">
            {top.map((c) => (
              <li key={c.id}>
                <AppLink to={`/admin/cursos/${c.id}`}>{c.title}</AppLink>
                <span>{formatNumber(c.students)} alunos</span>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="card admin-card" aria-labelledby="ov-local">
        <h2 id="ov-local" className="display admin-card__title">
          Neste navegador
        </h2>
        <p className="admin__muted">Estes dados são locais, não fictícios: vêm do que foi feito neste navegador.</p>
        <dl className="course-facts">
          <div>
            <dt>Catálogo</dt>
            <dd>{isCatalogEdited() ? 'Editado' : 'Dados iniciais'}</dd>
          </div>
          <div>
            <dt>Marca</dt>
            <dd>{isBrandCustomized() ? 'Personalizada' : 'Padrão'}</dd>
          </div>
          <div>
            <dt>Contas de demonstração</dt>
            <dd>{demo.accounts.length}</dd>
          </div>
          <div>
            <dt>Inscrições de alunos</dt>
            <dd>{localEnrollments}</dd>
          </div>
        </dl>
      </section>

      <div className="admin__actions">
        <ButtonLink to="/admin/cursos/novo" variant="primary" icon="book">
          Cadastrar curso
        </ButtonLink>
        <ButtonLink to="/admin/cursos" variant="secondary">
          Gerir cursos
        </ButtonLink>
        <ButtonLink to="/admin/marca" variant="secondary">
          Personalizar a marca
        </ButtonLink>
      </div>
    </AdminShell>
  );
}
