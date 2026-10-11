import { brand } from '@/config/brand';
import { ButtonAnchor, ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/hooks/useReveal';

export function CallToAction() {
  return (
    <section className="cta-section surface-light" aria-labelledby="cta-title">
      <div className="container">
        <Reveal>
          <div className="cta surface-brand">
            <svg className="cta__art" viewBox="0 0 300 300" aria-hidden="true" focusable="false">
              <path d="M30 270C30 200 110 220 140 160S220 120 270 30" />
              <circle cx="30" cy="270" r="7" />
              <circle cx="140" cy="160" r="7" />
              <circle cx="270" cy="30" r="11" className="cta__art-end" />
            </svg>
            <div className="cta__copy">
              <h2 id="cta-title" className="display cta__title">
                O próximo passo da sua carreira começa com uma trilha.
              </h2>
              <p className="cta__text">
                Crie sua conta demonstrativa e conheça a experiência do aluno, ou fale com a equipe para adaptar a
                plataforma ao seu projeto.
              </p>
            </div>
            <div className="cta__actions">
              <ButtonLink route="signup" variant="accent" size="lg" arrow>
                Criar conta
              </ButtonLink>
              <ButtonAnchor href={`mailto:${brand.contact.email}`} variant="secondary" size="lg" icon="mail">
                Falar com a equipe
              </ButtonAnchor>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
