import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: 'div' | 'article' | 'li';
  interactive?: boolean;
  children: ReactNode;
}

export function Card({ as: Tag = 'div', interactive = false, className = '', children, ...rest }: CardProps) {
  return (
    <Tag className={`card ${interactive ? 'card--interactive' : ''} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
