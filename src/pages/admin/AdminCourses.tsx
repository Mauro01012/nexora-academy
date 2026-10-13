import { useState } from 'react';
import { AppLink } from '@/app/router';
import { AdminShell } from '@/components/admin/AdminShell';
import { Button, ButtonLink } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Flash } from '@/components/ui/Flash';
import { categoryById } from '@/data/categories';
import { useCourses } from '@/hooks/useCourses';
import { deleteCourse, resetCourses } from '@/services/courseStore';
import { takeFlash } from '@/services/flash';
import { normalize } from '@/utils/catalog';
import { formatNumber, formatPrice } from '@/utils/course';
import type { Course } from '@/types';

export function AdminCourses() {
  const courses = useCourses();
  const [flash, setFlash] = useState<string | null>(takeFlash);
  const [query, setQuery] = useState('');
  const [toDelete, setToDelete] = useState<Course | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const shown = courses.filter((c) => normalize(`${c.title} ${c.slug}`).includes(normalize(query)));

  return (
    <AdminShell title="Cursos">
      <div className="admin__head">
        <h1 className="display admin__title">Cursos</h1>
        <ButtonLink to="/admin/cursos/novo" variant="primary">
          Novo curso
        </ButtonLink>
      </div>
      <p className="admin__lead">Cursos de demonstração. As alterações aparecem no catálogo e nas páginas de detalhe e ficam só neste navegador.</p>

      {flash ? <Flash>{flash}</Flash> : null}

      <div className="admin-tools">
        <div className="field">
          <label className="field__label" htmlFor="admin-busca">
            Filtrar por título ou endereço
          </label>
          <input id="admin-busca" type="search" className="input" value={query} onChange={(e) => setQuery(e.target.value)} autoComplete="off" />
        </div>
        <Button variant="secondary" onClick={() => setConfirmReset(true)}>
          Restaurar cursos iniciais
        </Button>
      </div>

      <p className="catalog__count" role="status">
        {shown.length === courses.length ? `${courses.length} cursos` : `${shown.length} de ${courses.length} cursos`}
      </p>

      {shown.length === 0 ? (
        <p className="admin__muted">{courses.length === 0 ? 'O catálogo está vazio. Cadastre um curso ou restaure os iniciais.' : 'Nenhum curso corresponde ao filtro.'}</p>
      ) : (
        <div className="admin-table-wrap" role="region" aria-label="Tabela de cursos (role para o lado se necessário)" tabIndex={0}>
          <table className="admin-table">
            <caption className="visually-hidden">Cursos de demonstração</caption>
            <thead>
              <tr>
                <th scope="col">Curso</th>
                <th scope="col">Categoria</th>
                <th scope="col">Nível</th>
                <th scope="col">Valor</th>
                <th scope="col">Alunos</th>
                <th scope="col">
                  <span className="visually-hidden">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {shown.map((c) => (
                <tr key={c.id}>
                  <th scope="row">
                    <AppLink to={`/admin/cursos/${c.id}`}>{c.title}</AppLink>
                    <span className="admin-table__slug">/{c.slug}</span>
                  </th>
                  <td>{categoryById(c.category)?.name}</td>
                  <td>{c.level}</td>
                  <td>{formatPrice(c.price)}</td>
                  <td>{formatNumber(c.students)}</td>
                  <td>
                    <div className="admin-table__actions">
                      <ButtonLink to={`/admin/cursos/${c.id}`} variant="secondary">
                        Editar<span className="visually-hidden"> {c.title}</span>
                      </ButtonLink>
                      <ButtonLink to={`/cursos/${c.slug}`} variant="ghost">
                        Ver<span className="visually-hidden"> {c.title} no site</span>
                      </ButtonLink>
                      <Button variant="ghost" className="btn--text-danger" onClick={() => setToDelete(c)} aria-label={`Excluir ${c.title}`}>
                        Excluir
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={toDelete !== null}
        title="Excluir este curso?"
        confirmLabel="Excluir curso"
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) {
            deleteCourse(toDelete.id);
            setFlash(`Curso “${toDelete.title}” excluído. Para trazê-lo de volta, restaure os cursos iniciais.`);
          }
          setToDelete(null);
        }}
      >
        <p>
          “{toDelete?.title}” deixará de aparecer no catálogo e na página inicial, e a página do curso passará a mostrar “Curso não encontrado”.
          Inscrições de alunos neste curso ficam ocultas.
        </p>
      </ConfirmDialog>

      <ConfirmDialog
        open={confirmReset}
        title="Restaurar os cursos iniciais?"
        confirmLabel="Restaurar cursos"
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          resetCourses();
          setFlash('Cursos iniciais restaurados.');
          setConfirmReset(false);
        }}
      >
        <p>Todos os cursos cadastrados, editados ou excluídos neste navegador serão descartados e a lista original da demonstração volta.</p>
      </ConfirmDialog>
    </AdminShell>
  );
}
