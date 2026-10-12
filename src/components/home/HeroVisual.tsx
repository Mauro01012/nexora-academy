import { Icon } from '@/components/ui/Icon';

const modules = [
  { title: 'HTML e CSS modernos', state: 'done' },
  { title: 'TypeScript na prática', state: 'done' },
  { title: 'React e componentes', state: 'active' },
  { title: 'Projeto final com revisão', state: 'locked' },
] as const;

const RING_LENGTH = 2 * Math.PI * 26;

/** Composição ilustrativa: trilha de aprendizagem, aula ao vivo, progresso e código. Todos os dados são de exemplo. */
export function HeroVisual() {
  return (
    <div
      className="hero-visual"
      role="img"
      aria-label="Ilustração de exemplo: trilha de front-end com dois módulos concluídos, uma aula ao vivo agendada, indicador de progresso de 78 por cento e um trecho de código."
    >
      <div className="hv-stage" aria-hidden="true">
        <svg className="hv-path" viewBox="0 0 520 560" preserveAspectRatio="none" focusable="false">
          <path d="M44 520C44 430 150 460 190 380S330 330 360 250S440 190 466 150" />
          <circle cx="44" cy="520" r="6" />
          <circle cx="190" cy="380" r="6" />
          <circle cx="360" cy="250" r="6" />
          <circle className="hv-path__end" cx="466" cy="150" r="9" />
        </svg>

        <article className="hv-card hv-card--track">
          <header className="hv-card__head">
            <span className="hv-chip">
              <Icon name="layers" size={14} /> Trilha
            </span>
            <span className="hv-muted">12 semanas</span>
          </header>
          <p className="hv-card__title">Desenvolvimento Front-end</p>
          <ul className="hv-modules">
            {modules.map((m) => (
              <li key={m.title} className={`hv-module hv-module--${m.state}`}>
                <span className="hv-module__mark">
                  {m.state === 'done' ? <Icon name="check" size={12} strokeWidth={2.6} /> : null}
                  {m.state === 'locked' ? <Icon name="lock" size={11} strokeWidth={2.2} /> : null}
                </span>
                <span className="hv-module__name">{m.title}</span>
                {m.state === 'active' ? <span className="hv-module__pct">64%</span> : null}
              </li>
            ))}
          </ul>
          <div className="hv-bar">
            <span style={{ width: '58%' }} />
          </div>
        </article>

        <div className="hv-card hv-card--live">
          <span className="hv-live__icon">
            <Icon name="play" size={16} filled strokeWidth={1} />
          </span>
          <div>
            <p className="hv-live__label">
              <span className="hv-live__dot" /> Aula ao vivo
            </p>
            <p className="hv-live__title">Hoje, 19h · Arquitetura de componentes</p>
          </div>
        </div>

        <div className="hv-card hv-card--ring">
          <svg viewBox="0 0 64 64" className="hv-ring" focusable="false">
            <circle className="hv-ring__track" cx="32" cy="32" r="26" />
            <circle
              className="hv-ring__value"
              cx="32"
              cy="32"
              r="26"
              strokeDasharray={`${RING_LENGTH * 0.78} ${RING_LENGTH}`}
              transform="rotate(-90 32 32)"
            />
            <text x="32" y="37" textAnchor="middle" className="hv-ring__text">
              78%
            </text>
          </svg>
          <p className="hv-muted">Conclusão média da turma (exemplo)</p>
        </div>

        <div className="hv-card hv-card--code">
          <p>
            <span className="tk-k">const</span> trilha = <span className="tk-f">montar</span>({'{'}
          </p>
          <p className="hv-indent">
            objetivo: <span className="tk-s">'carreira em tecnologia'</span>,
          </p>
          <p className="hv-indent">
            ritmo: <span className="tk-s">'no seu tempo'</span>,
          </p>
          <p>{'}'});</p>
        </div>
      </div>
    </div>
  );
}
