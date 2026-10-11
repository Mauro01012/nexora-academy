import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { AppLink } from '@/app/router';
import type { RouteId } from '@/app/routes';
import { Icon } from '@/components/ui/Icon';
import type { IconName } from '@/components/ui/Icon';

export type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'md' | 'lg';

interface Visual {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Ícone à esquerda. */
  icon?: IconName;
  /** Seta à direita, com microinteração no hover. */
  arrow?: boolean;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
}

const classes = ({ variant = 'primary', size = 'md', fullWidth, className = '' }: Visual) =>
  ['btn', `btn--${variant}`, `btn--${size}`, fullWidth ? 'btn--block' : '', className].filter(Boolean).join(' ');

function Content({ icon, arrow, children }: Pick<Visual, 'icon' | 'arrow' | 'children'>) {
  return (
    <>
      {icon ? <Icon name={icon} size={18} /> : null}
      <span>{children}</span>
      {arrow ? <Icon name="arrowRight" size={18} className="btn__arrow" /> : null}
    </>
  );
}

export function Button({
  variant,
  size,
  icon,
  arrow,
  fullWidth,
  className,
  children,
  type = 'button',
  ...rest
}: Visual & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>) {
  return (
    <button type={type} className={classes({ variant, size, fullWidth, className, children })} {...rest}>
      <Content icon={icon} arrow={arrow}>
        {children}
      </Content>
    </button>
  );
}

interface ButtonLinkProps extends Visual {
  to?: string;
  section?: string;
  route?: RouteId;
  onClick?: () => void;
}

export function ButtonLink({ variant, size, icon, arrow, fullWidth, className, children, ...link }: ButtonLinkProps) {
  return (
    <AppLink className={classes({ variant, size, fullWidth, className, children })} {...link}>
      <Content icon={icon} arrow={arrow}>
        {children}
      </Content>
    </AppLink>
  );
}

/** Link para e-mail ou endereço externo, com a mesma aparência dos botões. */
export function ButtonAnchor({
  variant,
  size,
  icon,
  arrow,
  fullWidth,
  className,
  children,
  href,
}: Visual & { href: string }) {
  return (
    <a className={classes({ variant, size, fullWidth, className, children })} href={href}>
      <Content icon={icon} arrow={arrow}>
        {children}
      </Content>
    </a>
  );
}
