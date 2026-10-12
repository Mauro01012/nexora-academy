import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { replacePath, usePath } from '@/app/router';
import { ButtonLink } from '@/components/ui/Button';
import { NoticePage } from '@/components/ui/NoticePage';
import { useAuth } from '@/hooks/useAuth';

/**
 * Guarda de rota da demonstração: sem sessão, não renderiza o conteúdo e leva para o login (com retorno).
 * É só uma barreira de interface: como tudo roda no navegador, ela não protege dados de verdade.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const path = usePath();
  const loginTo = `/entrar?next=${encodeURIComponent(path)}`;

  useEffect(() => {
    if (!isAuthenticated) replacePath(loginTo);
  }, [isAuthenticated, loginTo]);

  if (isAuthenticated) return <>{children}</>;
  return (
    <NoticePage
      id="gate-title"
      icon="lock"
      title="Entre para continuar"
      text="Esta área é só para quem está conectado à conta de demonstração. Levando você ao login…"
      actions={
        <ButtonLink to={loginTo} variant="primary">
          Ir para o login
        </ButtonLink>
      }
    />
  );
}
