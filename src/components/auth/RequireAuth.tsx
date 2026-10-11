import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { replacePath, usePath } from '@/app/router';
import { ButtonLink } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

/**
 * Guarda de rota da demonstração: sem sessão, não renderiza o conteúdo e leva para o login (com retorno).
 * É só uma barreira de interface: como tudo roda no navegador, ela não protege dados de verdade.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const path = usePath();

  useEffect(() => {
    if (!isAuthenticated) replacePath(`/entrar?next=${encodeURIComponent(path)}`);
  }, [isAuthenticated, path]);

  if (isAuthenticated) return <>{children}</>;
  return (
    <section className="page-notice surface-light" aria-labelledby="gate-title">
      <div className="container page-notice__inner">
        <h1 id="gate-title" className="display page-notice__title">
          Entre para continuar
        </h1>
        <p className="page-notice__text">Esta área é só para quem está conectado à conta de demonstração. Levando você ao login…</p>
        <ButtonLink to={`/entrar?next=${encodeURIComponent(path)}`} variant="primary">
          Ir para o login
        </ButtonLink>
      </div>
    </section>
  );
}
