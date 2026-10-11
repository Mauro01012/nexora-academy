import { InstructorMonogram } from '@/components/ui/InstructorMonogram';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/hooks/useReveal';
import { instructors } from '@/data/instructors';

export function Instructors() {
  return (
    <section id="instrutores" className="section surface-light" aria-labelledby="instrutores-title" tabIndex={-1}>
      <div className="container">
        <SectionHeading eyebrow="Instrutores" title="Quem ensina também pratica." id="instrutores-title">
          Profissionais com atuação no mercado conduzem as trilhas e revisam os projetos dos alunos.
        </SectionHeading>

        <ul className="instructors">
          {instructors.map((person, index) => (
            <li key={person.id} className="instructors__item">
              <Reveal delay={index * 90}>
                <article className="instructor">
                  <InstructorMonogram name={person.name} initials={person.initials} tone={person.tone} />
                  <h3 className="instructor__name">{person.name}</h3>
                  <p className="instructor__role">{person.role}</p>
                  <p className="instructor__bio">{person.bio}</p>
                  <ul className="chips" aria-label={`Especialidades de ${person.name}`}>
                    {person.expertise.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
        <p className="demo-note">Perfis fictícios, criados para a demonstração.</p>
      </div>
    </section>
  );
}
