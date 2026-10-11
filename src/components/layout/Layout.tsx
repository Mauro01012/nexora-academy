import type { MouseEvent, ReactNode } from 'react';
import { useScrollOnNavigate } from '@/app/router';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

export function Layout({ children }: { children: ReactNode }) {
  useScrollOnNavigate();

  // O link de salto usa o hash para a rota; por isso move o foco manualmente em vez de navegar.
  const skipToContent = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const main = document.getElementById('conteudo');
    main?.focus();
    main?.scrollIntoView();
  };

  return (
    <>
      <a className="skip-link" href="#conteudo" onClick={skipToContent}>
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </>
  );
}
