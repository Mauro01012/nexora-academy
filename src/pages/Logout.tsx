import { useState } from 'react';
import { ButtonLink, Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { useAuth } from '@/hooks/useAuth';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

type Phase = 'idle' | 'left' | 'erased';

/** Saída da conta: confirma, encerra a sessão e oferece apagar os dados guardados pela demonstração. */
export function Logout() {
  useDocumentTitle('Sair da conta');
  const { user, logOut, resetDemo } = useAuth();
  const [phase, setPhase] = useState<Phase>('idle');
  const [erase, setErase] = useState(false);

  const confirm = () => {
    if (erase) resetDemo();
    else logOut();
    setPhase(erase ? 'erased' : 'left');
  };

  let title = 'Você não está conectado';
  let text = 'Não há sessão de demonstração ativa neste navegador.';
  if (phase === 'left') {
    title = 'Você saiu da conta';
    text = 'A sessão foi encerrada. A conta e o progresso de demonstração continuam guardados neste navegador para a próxima vez.';
  } else if (phase === 'erased') {
    title = 'Você saiu e os dados foram apagados';
    text = 'Contas, sessão e progresso de demonstração foram removidos deste navegador.';
  } else if (user) {
    title = 'Sair da conta?';
    text = `Você está conectado como ${user.name} (${user.email}), em uma conta de demonstração.`;
  }

  return (
    <section className="page-notice surface-light" aria-labelledby="logout-title">
      <div className="container page-notice__inner">
        <span className="page-notice__icon" aria-hidden="true">
          <Icon name="user" size={28} />
        </span>
        <h1 id="logout-title" className="display page-notice__title">
          {title}
        </h1>
        <p className="page-notice__text" role="status">
          {text}
        </p>

        {phase === 'idle' && user ? (
          <>
            <div className="check">
              <input id="logout-erase" type="checkbox" checked={erase} onChange={(e) => setErase(e.target.checked)} />
              <label htmlFor="logout-erase">Apagar também os dados desta demonstração neste navegador (contas e progresso)</label>
            </div>
            <div className="page-notice__actions">
              <Button variant="primary" onClick={confirm}>
                Sair da conta
              </Button>
              <ButtonLink to="/aluno" variant="secondary">
                Cancelar
              </ButtonLink>
            </div>
          </>
        ) : (
          <div className="page-notice__actions">
            <ButtonLink to="/entrar" variant="primary" arrow>
              Entrar
            </ButtonLink>
            <ButtonLink to="/cursos" variant="secondary">
              Ver catálogo de cursos
            </ButtonLink>
          </div>
        )}
      </div>
    </section>
  );
}
