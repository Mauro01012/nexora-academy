import { AppLink } from '@/app/router';
import { Icon } from '@/components/ui/Icon';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/hooks/useReveal';
import { categories } from '@/data/categories';

export function Categories() {
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
            {categories.map((category, index) => (
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
                  <span className="category-row__count">{category.courseCount} cursos</span>
                  <Icon name="arrowRight" size={20} className="category-row__arrow" />
                </AppLink>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
