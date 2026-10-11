import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { HeroVisual } from '@/components/home/HeroVisual';

const proof = ['Trilhas com projetos reais', 'Mentoria e aulas ao vivo', 'Certificados de conclusão'];

export function Hero() {
  return (
    <section id="inicio" className="hero surface-dark" aria-labelledby="hero-title" tabIndex={-1}>
      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="eyebrow eyebrow--on-dark hero__eyebrow">
            <span className="eyebrow__dot" aria-hidden="true" />
            Plataforma de ensino online de tecnologia
          </p>
          <h1 id="hero-title" className="display hero__title">
            Tecnologia se aprende praticando. <em>Carreira se constrói com método.</em>
          </h1>
          <p className="lead hero__lead">
            Trilhas guiadas, projetos revisados por especialistas e acompanhamento de progresso para você sair do
            “por onde começar?” e chegar ao próximo nível profissional.
          </p>
          <div className="hero__actions">
            <ButtonLink route="courses" variant="accent" size="lg" arrow>
              Explorar cursos
            </ButtonLink>
            <ButtonLink to="/" section="sobre" variant="secondary" size="lg" icon="play">
              Conhecer a plataforma
            </ButtonLink>
          </div>
          <ul className="hero__proof">
            {proof.map((item) => (
              <li key={item}>
                <Icon name="check" size={16} strokeWidth={2.4} />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <HeroVisual />
      </div>
    </section>
  );
}
