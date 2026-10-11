import { useEffect } from 'react';

/** Ajusta o título da aba enquanto a página está montada e restaura o anterior ao sair. */
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    const previous = document.title;
    document.title = `${title} — NEXORA ACADEMY`;
    return () => {
      document.title = previous;
    };
  }, [title]);
}
