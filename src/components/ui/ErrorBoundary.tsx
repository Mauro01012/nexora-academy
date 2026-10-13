import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Button, ButtonLink } from '@/components/ui/Button';
import { NoticePage } from '@/components/ui/NoticePage';

interface Props {
  children: ReactNode;
  /** Quando o valor muda (ex.: a rota), o erro é descartado e a tela volta a ser renderizada. */
  resetKey?: string;
}

interface State {
  failed: boolean;
}

/** Evita a tela em branco se uma página falhar ao renderizar: o cabeçalho e o rodapé continuam e há um caminho de volta. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Falha ao exibir a página:', error, info.componentStack);
  }

  componentDidUpdate(previous: Props): void {
    if (this.state.failed && previous.resetKey !== this.props.resetKey) this.setState({ failed: false });
  }

  render(): ReactNode {
    if (!this.state.failed) return this.props.children;
    return (
      <NoticePage
        id="erro-title"
        icon="compass"
        eyebrow="Algo deu errado"
        title="Não foi possível exibir esta página"
        text="Ocorreu um erro inesperado. Tente de novo ou volte ao início; os dados guardados neste navegador não foram alterados."
        actions={
          <>
            <Button variant="primary" onClick={() => this.setState({ failed: false })}>
              Tentar novamente
            </Button>
            <ButtonLink to="/" variant="secondary" onClick={() => this.setState({ failed: false })}>
              Voltar ao início
            </ButtonLink>
          </>
        }
      />
    );
  }
}

