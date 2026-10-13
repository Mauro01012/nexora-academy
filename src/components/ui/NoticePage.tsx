import type { AriaRole, ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';
import type { IconName } from '@/components/ui/Icon';

interface NoticePageProps {
  /** Id do título (h1), usado em `aria-labelledby`. */
  id: string;
  icon?: IconName;
  eyebrow?: string;
  title: ReactNode;
  text?: ReactNode;
  /** Use "status" quando o texto muda após uma ação e precisa ser anunciado. */
  textRole?: AriaRole;
  /** Conteúdo entre o texto e os botões (ex.: uma opção de confirmação). */
  children?: ReactNode;
  actions?: ReactNode;
}

/** Página de aviso de tela cheia: não encontrado, acesso restrito, saída da conta, erro. */
export function NoticePage({ id, icon, eyebrow, title, text, textRole, children, actions }: NoticePageProps) {
  return (
    <section className="page-notice surface-light" aria-labelledby={id}>
      <div className="container page-notice__inner">
        {icon ? (
          <span className="page-notice__icon" aria-hidden="true">
            <Icon name={icon} size={28} />
          </span>
        ) : null}
        {eyebrow ? (
          <p className="eyebrow">
            <span className="eyebrow__dot" aria-hidden="true" />
            {eyebrow}
          </p>
        ) : null}
        <h1 id={id} className="display page-notice__title">
          {title}
        </h1>
        {text ? (
          <p className="page-notice__text" role={textRole}>
            {text}
          </p>
        ) : null}
        {children}
        {actions ? <div className="page-notice__actions">{actions}</div> : null}
      </div>
    </section>
  );
}
