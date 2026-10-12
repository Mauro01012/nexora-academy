import { useEffect, useRef, useState } from 'react';
import { focusPageHeading } from '@/app/focus';
import { Button, ButtonLink } from '@/components/ui/Button';
import { NoticePage } from '@/components/ui/NoticePage';
import { useAuth } from '@/hooks/useAuth';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

type Phase = 'idle' | 'left' | 'erased';

/** Saída da conta: confirma, encerra a sessão e oferece apagar os dados guardados pela demonstração. */
export function Logout() {
  useDocumentTitle('Sair da conta');
  const { user, logOut, resetDemo } = useAuth();
  const [phase, setPhase] = useState<Phase>('idle');
  const [erase, setErase] = useState(false);

  // O botão que a pessoa acabou de usar some da tela: leva o foco ao novo título para ele ser anunciado.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) firstRender.current = false;
    else focusPageHeading();
  }, [phase]);

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

  const confirming = phase === 'idle' && user;

  return (
    <NoticePage
      id="logout-title"
      icon="user"
      title={title}
      text={text}
      textRole="status"
      actions={
        confirming ? (
          <>
            <Button variant="primary" onClick={confirm}>
              Sair da conta
            </Button>
            <ButtonLink to="/aluno" variant="secondary">
              Cancelar
            </ButtonLink>
          </>
        ) : (
          <>
            <ButtonLink to="/entrar" variant="primary" arrow>
              Entrar
            </ButtonLink>
            <ButtonLink to="/cursos" variant="secondary">
              Ver catálogo de cursos
            </ButtonLink>
          </>
        )
      }
    >
      {confirming ? (
        <div className="check">
          <input id="logout-erase" type="checkbox" checked={erase} onChange={(e) => setErase(e.target.checked)} />
          <label htmlFor="logout-erase">Apagar também os dados desta demonstração neste navegador (contas e progresso)</label>
        </div>
      ) : null}
    </NoticePage>
  );
}
