import { useEffect } from 'react';
import { useBrand } from '@/hooks/useBrand';

/** Ajusta o título da aba enquanto a página está montada e restaura o anterior ao sair. */
export function useDocumentTitle(title: string): void {
  const { name } = useBrand();
  useEffect(() => {
    const previous = document.title;
    document.title = `${title} — ${name}`;
    return () => {
      document.title = previous;
    };
  }, [title, name]);
}
