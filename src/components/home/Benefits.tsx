import { SectionHeading } from '@/components/ui/SectionHeading';
import { Icon } from '@/components/ui/Icon';
import type { IconName } from '@/components/ui/Icon';
import { Reveal } from '@/hooks/useReveal';

const benefits: { icon: IconName; title: string; text: string }[] = [
  {
    icon: 'layers',
    title: 'Trilhas com projetos reais',
    text: 'Cada módulo termina em uma entrega prática, que vira portfólio e prova de competência.',
  },
  {
    icon: 'target',
    title: 'Progresso visível',
    text: 'Metas semanais e indicadores claros mostram o que já foi feito e o que vem a seguir.',
  },
  {
    icon: 'users',
    title: 'Mentoria e comunidade',
    text: 'Aulas ao vivo, revisão de projetos e um espaço para tirar dúvidas com quem já está na prática.',
  },
  {
    icon: 'award',
    title: 'Certificados verificáveis',
    text: 'Comprovantes de conclusão com código de validação, prontos para compartilhar.',
  },
];

export function Benefits() {
  return (
    <section id="sobre" className="section benefits surface-dark" aria-labelledby="sobre-title" tabIndex={-1}>
      <div className="container benefits__grid">
        <div className="benefits__intro">
          <SectionHeading
            eyebrow="Sobre a plataforma"
            title="Desenhada para quem precisa terminar o que começa."
            id="sobre-title"
            className="section-heading--on-dark"
          >
            A NEXORA ACADEMY combina conteúdo enxuto, prática guiada e acompanhamento constante. O objetivo não é
            acumular aulas assistidas, e sim construir habilidades que apareçam no trabalho.
          </SectionHeading>
          <p className="benefits__quote">
            <Icon name="video" size={18} /> Conteúdo em vídeo, leituras curtas e exercícios no mesmo lugar.
          </p>
        </div>

        <ol className="benefits__list">
          {benefits.map((benefit, index) => (
            <li key={benefit.title}>
              <Reveal delay={index * 80} className="benefit">
                <span className="benefit__num" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="benefit__icon" aria-hidden="true">
                  <Icon name={benefit.icon} size={22} />
                </span>
                <div>
                  <h3 className="benefit__title">{benefit.title}</h3>
                  <p className="benefit__text">{benefit.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
