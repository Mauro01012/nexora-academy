import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import type { RouteDef } from '@/app/routes';

interface ComingSoonProps {
  route: RouteDef | null;
  path: string;
}

/** Exibida para rotas planejadas que ainda não foram implementadas e para endereços desconhecidos. */
export function ComingSoon({ route, path }: ComingSoonProps) {
  return (
    <section className="page-notice surface-light" aria-labelledby="notice-title">
      <div className="container page-notice__inner">
        <span className="page-notice__icon" aria-hidden="true">
          <Icon name={route ? 'lock' : 'compass'} size={28} />
        </span>
        <p className="eyebrow">
          <span className="eyebrow__dot" aria-hidden="true" />
          {route ? 'Em desenvolvimento' : 'Página não encontrada'}
        </p>
        <h1 id="notice-title" className="display page-notice__title">
          {route ? route.title : 'Esse endereço não existe'}
        </h1>
        <p className="page-notice__text">
          {route
            ? `${route.description} Esta área ainda não foi implementada: ela faz parte das próximas etapas do projeto e já está reservada na arquitetura.`
            : `Não encontramos nada em “${path}”. Volte para a página inicial para continuar explorando a plataforma.`}
        </p>
        <div className="page-notice__actions">
          <ButtonLink to="/" variant="primary" arrow>
            Voltar ao início
          </ButtonLink>
          <ButtonLink route="courses" variant="secondary">
            Ver catálogo de cursos
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
