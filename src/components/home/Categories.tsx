import { AppLink } from '@/app/router';
import { Icon } from '@/components/ui/Icon';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/hooks/useReveal';
import { categories } from '@/data/categories';
import { useCourses } from '@/hooks/useCourses';

export function Categories() {
  // A contagem vem do catálogo atual: o mesmo número que a pessoa encontra ao abrir a categoria.
  const courses = useCourses();
  const countOf = (id: string) => courses.filter((c) => c.category === id).length;

  return (
    <section id="categorias" className="section section--tint surface-light" aria-labelledby="categorias-title" tabIndex={-1}>
      <div className="container categories">
        <div className="categories__intro">
          <SectionHeading eyebrow="Categorias" title="Seis áreas, um caminho de aprendizagem." id="categorias-title">
            Escolha uma área e siga uma sequência pensada por especialistas, sem precisar montar o currículo sozinho.
          </SectionHeading>
        </div>

        <Reveal className="categories__list">
          <ul>
            {categories.map((category, index) => {
              const count = countOf(category.id);
              return (
                <li key={category.id}>
                  <AppLink to={`/cursos?categoria=${category.id}`} className="category-row" data-tone={category.tone}>
                    <span className="category-row__index" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="category-row__icon" aria-hidden="true">
                      <Icon name={category.icon} size={22} />
                    </span>
                    <span className="category-row__text">
                      <span className="category-row__name">{category.name}</span>
                      <span className="category-row__desc">{category.description}</span>
                    </span>
                    <span className="category-row__count">{count === 0 ? 'Sem cursos' : `${count} ${count === 1 ? 'curso' : 'cursos'}`}</span>
                    <Icon name="arrowRight" size={20} className="category-row__arrow" />
                  </AppLink>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
