import { useEffect, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';

/** Revela o elemento ao entrar na viewport. Sem IntersectionObserver ou com movimento reduzido, fica visível. */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !('IntersectionObserver' in window)) {
      el.classList.add('is-visible');
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          el.classList.add('is-visible');
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Atraso em milissegundos, para entradas escalonadas. */
  delay?: number;
}

export function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const ref = useReveal<HTMLDivElement>();
  const style = delay ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : undefined;
  return (
    <div ref={ref} className={`reveal ${className}`.trim()} style={style}>
      {children}
    </div>
  );
}
