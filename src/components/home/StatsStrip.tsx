import { brand } from '@/config/brand';
import { Reveal } from '@/hooks/useReveal';

export function StatsStrip() {
  return (
    <section className="stats surface-light" aria-label="Números da plataforma (dados demonstrativos)">
      <div className="container">
        <Reveal>
          <dl className="stats__grid">
            {brand.demo.stats.map((stat) => (
              <div key={stat.label} className="stats__item">
                <dt className="visually-hidden">{stat.label}</dt>
                <dd className="stats__value display">{stat.value}</dd>
                <dd className="stats__label" aria-hidden="true">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
          <p className="demo-note">Números ilustrativos, criados para a demonstração.</p>
        </Reveal>
      </div>
    </section>
  );
}
