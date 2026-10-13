import { ButtonLink } from '@/components/ui/Button';
import { NoticePage } from '@/components/ui/NoticePage';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import type { RouteDef } from '@/app/routes';

interface ComingSoonProps {
  route: RouteDef | null;
  path: string;
}

/** Exibida para rotas planejadas que ainda não foram implementadas e para endereços desconhecidos. */
export function ComingSoon({ route, path }: ComingSoonProps) {
  useDocumentTitle(route ? route.title : 'Página não encontrada');
  return (
    <NoticePage
      id="notice-title"
      icon={route ? 'lock' : 'compass'}
      eyebrow={route ? 'Em desenvolvimento' : 'Página não encontrada'}
      title={route ? route.title : 'Esse endereço não existe'}
      text={
        route
          ? `${route.description} Esta área ainda não foi implementada: ela faz parte das próximas etapas do projeto e já está reservada na arquitetura.`
          : `Não encontramos nada em “${path}”. Volte para a página inicial para continuar explorando a plataforma.`
      }
      actions={
        <>
          <ButtonLink to="/" variant="primary" arrow>
            Voltar ao início
          </ButtonLink>
          <ButtonLink route="courses" variant="secondary">
            Ver catálogo de cursos
          </ButtonLink>
        </>
      }
    />
  );
}
