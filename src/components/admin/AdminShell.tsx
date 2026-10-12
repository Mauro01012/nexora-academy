import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { focusPageHeading } from '@/app/focus';
import { AppLink, navigate, usePath } from '@/app/router';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Logo } from '@/components/ui/Logo';
import { useAdmin } from '@/hooks/useAdmin';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const nav = [
  { to: '/admin', label: 'Visão geral', icon: 'chart', exact: true },
  { to: '/admin/cursos', label: 'Cursos', icon: 'book', exact: false },
  { to: '/admin/marca', label: 'Marca', icon: 'palette', exact: false },
] as const;

/** Aviso do modo administrador de demonstração (sem autorização real). */
function GateNotice() {
  return (
    <div className="demo-callout" role="note">
      <Icon name="lock" size={18} />
      <p>
        <strong>Sem autorização real.</strong> Este painel é uma demonstração: qualquer pessoa que abra este endereço pode usá-lo, e o que for
        salvo fica só neste navegador. Em um produto de verdade, isso exigiria autenticação e permissões validadas em um servidor.
      </p>
    </div>
  );
}

/** Estrutura do painel: barra escura, menu lateral e faixa de aviso. Exige o modo administrador (simulado). */
export function AdminShell({ title, children }: { title: string; children: ReactNode }) {
  const { isAdmin, enter, leave } = useAdmin();
  const path = usePath();
  useDocumentTitle(`${title} (admin)`);

  const wasAdmin = useRef(isAdmin);
  useEffect(() => {
    if (isAdmin && !wasAdmin.current) focusPageHeading();
    wasAdmin.current = isAdmin;
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <section className="auth surface-light section--tint" aria-labelledby="gate-admin-title">
        <div className="container auth__inner">
          <div className="card auth__panel">
            <Logo />
            <h1 id="gate-admin-title" className="display auth__title">
              Painel administrativo (demonstração)
            </h1>
            <p className="auth__intro">Área separada da experiência do aluno, para gerir cursos e a marca da plataforma demonstrativa.</p>
            <GateNotice />
            <Button variant="primary" fullWidth onClick={enter}>
              Entrar como administrador de demonstração
            </Button>
            <ButtonLink to="/" variant="secondary" fullWidth>
              Voltar ao site
            </ButtonLink>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="admin">
      <header className="admin-bar surface-dark">
        <div className="admin-bar__inner">
          <AppLink to="/admin" className="admin-bar__brand" aria-label="Painel administrativo — visão geral">
            <Logo />
          </AppLink>
          <span className="admin-bar__tag">Admin · demonstração</span>
          <div className="admin-bar__actions">
            <ButtonLink to="/" variant="ghost" icon="compass">
              Ver o site
            </ButtonLink>
            <Button
              variant="secondary"
              onClick={() => {
                leave();
                navigate('/');
              }}
            >
              Sair do modo admin
            </Button>
          </div>
        </div>
      </header>
      <div className="admin-notice" role="note">
        <Icon name="lock" size={16} /> Modo administrador simulado: sem autorização real, sem backend. As alterações ficam só neste navegador.
      </div>
      <div className="admin__layout container">
        <nav className="admin-nav" aria-label="Painel administrativo">
          <ul>
            {nav.map((item) => {
              const current = item.exact ? path === item.to : path === item.to || path.startsWith(`${item.to}/`);
              return (
                <li key={item.to}>
                  <AppLink to={item.to} className="admin-nav__link" aria-current={current ? 'page' : undefined}>
                    <Icon name={item.icon} size={18} />
                    {item.label}
                  </AppLink>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="admin__content">{children}</div>
      </div>
    </div>
  );
}
