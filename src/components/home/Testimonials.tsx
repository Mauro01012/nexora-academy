import { Badge } from '@/components/ui/Badge';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/hooks/useReveal';
import { testimonials } from '@/data/testimonials';

export function Testimonials() {
  const [main, ...others] = testimonials;
  return (
    <section id="depoimentos" className="section section--tint surface-light" aria-labelledby="depoimentos-title" tabIndex={-1}>
      <div className="container">
        <SectionHeading eyebrow="Depoimentos" title="O que alunos contam sobre a experiência." id="depoimentos-title">
          Exemplos de como o depoimento de um aluno apareceria na plataforma.
        </SectionHeading>

        <div className="testimonials">
          <Reveal className="testimonials__main">
            <figure className="quote quote--main">
              <Badge tone="amber">Depoimento demonstrativo</Badge>
              <blockquote className="display quote__text">“{main.quote}”</blockquote>
              <figcaption className="quote__by">
                <strong>{main.name}</strong>
                <span>{main.role}</span>
              </figcaption>
            </figure>
          </Reveal>
          <div className="testimonials__side">
            {others.map((item, index) => (
              <Reveal key={item.id} delay={(index + 1) * 100}>
                <figure className="quote">
                  <Badge tone="amber">Depoimento demonstrativo</Badge>
                  <blockquote className="quote__text quote__text--small">“{item.quote}”</blockquote>
                  <figcaption className="quote__by">
                    <strong>{item.name}</strong>
                    <span>{item.role}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
