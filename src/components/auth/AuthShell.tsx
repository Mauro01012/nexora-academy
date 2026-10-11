import type { ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';

interface AuthShellProps {
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
  footer?: ReactNode;
}

/** Moldura das telas de conta, com o aviso permanente de que o fluxo é simulado. */
export function AuthShell({ eyebrow, title, intro, children, footer }: AuthShellProps) {
  return (
    <section className="auth surface-light section--tint" aria-labelledby="auth-title">
      <div className="container auth__inner">
        <div className="card auth__panel">
          <p className="eyebrow">
            <span className="eyebrow__dot" aria-hidden="true" />
            {eyebrow}
          </p>
          <h1 id="auth-title" className="display auth__title">
            {title}
          </h1>
          {intro ? <p className="auth__intro">{intro}</p> : null}
          <div className="demo-callout" role="note">
            <Icon name="lock" size={18} />
            <p>
              <strong>Ambiente simulado.</strong> Nenhuma conta real é criada e não há segurança de produção. Os dados ficam só neste
              navegador, e a senha não é guardada nem enviada. Não use dados pessoais reais nem senhas de outros serviços.
            </p>
          </div>
          {children}
          {footer ? <p className="auth__alt">{footer}</p> : null}
        </div>
      </div>
    </section>
  );
}
