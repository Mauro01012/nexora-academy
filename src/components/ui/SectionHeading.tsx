import type { ReactNode } from 'react';

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  id?: string;
  children?: ReactNode;
  className?: string;
}

export function SectionHeading({ eyebrow, title, id, children, className = '' }: SectionHeadingProps) {
  return (
    <header className={`section-heading ${className}`.trim()}>
      <p className="eyebrow">
        <span className="eyebrow__dot" aria-hidden="true" />
        {eyebrow}
      </p>
      <h2 id={id} className="display section-heading__title">
        {title}
      </h2>
      {children ? <p className="section-heading__lead">{children}</p> : null}
    </header>
  );
}
