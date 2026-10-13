import type { ReactNode } from 'react';

/** Confirmação curta depois de uma ação (salvar, excluir, cancelar). É anunciada por leitores de tela. */
export function Flash({ children }: { children: ReactNode }) {
  return (
    <p className="flash" role="status">
      {children}
    </p>
  );
}
