import { useState } from 'react';
import type { FormEvent } from 'react';
import { navigate } from '@/app/router';
import { AdminShell } from '@/components/admin/AdminShell';
import { SelectField, TextAreaField } from '@/components/admin/FormFields';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { categories } from '@/data/categories';
import { instructors } from '@/data/instructors';
import { useCourses } from '@/hooks/useCourses';
import { createCourse, updateCourse } from '@/services/courseStore';
import { setFlash } from '@/services/flash';
import { levels } from '@/utils/catalog';
import { emptyForm, fromCourse, slugify, toCourseInput, validateCourseForm } from '@/utils/courseForm';
import type { CourseFormErrors, CourseFormValues } from '@/utils/courseForm';
import type { Course } from '@/types';

const order: (keyof CourseFormValues)[] = ['title', 'slug', 'summary', 'category', 'level', 'hours', 'lessons', 'price', 'instructorId', 'tags', 'rating', 'students'];

function CourseForm({ course }: { course: Course | null }) {
  const courses = useCourses();
  const [values, setValues] = useState<CourseFormValues>(() => (course ? fromCourse(course) : emptyForm()));
  const [errors, setErrors] = useState<CourseFormErrors>({});
  const [slugTouched, setSlugTouched] = useState(Boolean(course));

  const set = <K extends keyof CourseFormValues>(key: K, value: CourseFormValues[K]) => {
    setValues((current) => {
      const next = { ...current, [key]: value };
      if (key === 'title' && !slugTouched) next.slug = slugify(String(value));
      return next;
    });
    setErrors((current) => ({ ...current, [key]: undefined, ...(key === 'title' && !slugTouched ? { slug: undefined } : {}) }));
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const found = validateCourseForm(values, courses.filter((c) => c.id !== course?.id));
    if (Object.keys(found).length > 0) {
      setErrors(found);
      const first = order.find((key) => found[key]);
      if (first) document.getElementById(`curso-${first}`)?.focus();
      return;
    }
    const input = toCourseInput(values);
    if (course) updateCourse(course.id, input);
    else createCourse(input);
    setFlash(course ? `Curso “${input.title}” atualizado.` : `Curso “${input.title}” criado. Ele já aparece no catálogo.`);
    navigate('/admin/cursos');
  };

  const text = (key: keyof CourseFormValues, label: string, extra: { hint?: string; inputMode?: 'numeric' | 'decimal'; placeholder?: string } = {}) => (
    <Input id={`curso-${key}`} label={label} value={String(values[key])} error={errors[key]} onChange={(e) => set(key, e.target.value as never)} {...extra} />
  );

  return (
    <form className="admin-form" noValidate onSubmit={submit}>
      {Object.values(errors).some(Boolean) ? (
        <p className="form-summary" role="alert">
          Revise os campos destacados.
        </p>
      ) : null}
      {text('title', 'Título')}
      <Input
        id="curso-slug"
        label="Endereço do curso (slug)"
        hint={`Aparece na URL: #/cursos/${values.slug || 'endereco-do-curso'}`}
        value={values.slug}
        error={errors.slug}
        onChange={(e) => {
          setSlugTouched(true);
          set('slug', e.target.value);
        }}
      />
      <TextAreaField id="curso-summary" label="Resumo" hint="De 20 a 300 caracteres." value={values.summary} error={errors.summary} onChange={(e) => set('summary', e.target.value)} />
      <div className="admin-form__row">
        <SelectField id="curso-category" label="Categoria" value={values.category} error={errors.category} onChange={(e) => set('category', e.target.value)}>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </SelectField>
        <SelectField id="curso-level" label="Nível" value={values.level} error={errors.level} onChange={(e) => set('level', e.target.value)}>
          {levels.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </SelectField>
      </div>
      <div className="admin-form__row">
        {text('hours', 'Carga horária (horas)', { inputMode: 'numeric' })}
        {text('lessons', 'Número de aulas', { inputMode: 'numeric' })}
        {text('price', 'Valor (R$)', { inputMode: 'numeric', hint: 'Em branco = gratuito.' })}
      </div>
      <SelectField id="curso-instructorId" label="Instrutoria" value={values.instructorId} error={errors.instructorId} onChange={(e) => set('instructorId', e.target.value)}>
        {instructors.map((i) => (
          <option key={i.id} value={i.id}>
            {i.name}, {i.role}
          </option>
        ))}
      </SelectField>
      {text('tags', 'Temas', { hint: 'Separados por vírgula. Até 6.', placeholder: 'React, TypeScript' })}
      <fieldset className="admin-form__fieldset">
        <legend>Indicadores fictícios</legend>
        <div className="admin-form__row">
          {text('rating', 'Avaliação (0 a 5)', { inputMode: 'decimal' })}
          {text('students', 'Alunos', { inputMode: 'numeric' })}
        </div>
      </fieldset>
      <div className="admin-form__actions">
        <Button type="submit" variant="primary">
          {course ? 'Salvar alterações' : 'Criar curso'}
        </Button>
        <ButtonLink to="/admin/cursos" variant="secondary">
          Cancelar
        </ButtonLink>
      </div>
    </form>
  );
}

/** Cadastro (#/admin/cursos/novo) e edição (#/admin/cursos/:id) de cursos de demonstração. */
export function AdminCourseForm({ params }: { params: Record<string, string> }) {
  const courses = useCourses();
  const id = params.id;
  const course = id ? courses.find((c) => c.id === id) ?? null : null;
  const missing = Boolean(id) && !course;

  return (
    <AdminShell title={id ? 'Editar curso' : 'Novo curso'}>
      <h1 className="display admin__title">{missing ? 'Curso não encontrado' : id ? 'Editar curso' : 'Novo curso'}</h1>
      {missing ? (
        <>
          <p className="admin__lead">Não há curso com este identificador. Ele pode ter sido excluído.</p>
          <ButtonLink to="/admin/cursos" variant="primary">
            Voltar para a lista de cursos
          </ButtonLink>
        </>
      ) : (
        <>
          <p className="admin__lead">Preencha os dados do curso de demonstração. Ao salvar, ele é refletido no catálogo e na página de detalhes.</p>
          <CourseForm key={course?.id ?? 'novo'} course={course} />
        </>
      )}
    </AdminShell>
  );
}
