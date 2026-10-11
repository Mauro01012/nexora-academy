/**
 * Mapa de rotas da aplicação.
 * Para ativar uma área nas próximas etapas: (1) crie a página, (2) registre-a em
 * `src/app/pages.tsx` e (3) troque `implemented` para `true`. Nenhum link precisa mudar.
 */
export type RouteId = 'home' | 'courses' | 'course' | 'login' | 'signup' | 'student' | 'admin';

export interface RouteDef {
  id: RouteId;
  /** Caminho (usado após o "#"). Segmentos com ":" são parâmetros. */
  path: string;
  title: string;
  description: string;
  implemented: boolean;
  /** Enquanto a página não existe, os links principais levam a esta seção da página inicial. */
  fallbackSection?: string;
}

export const routes: RouteDef[] = [
  { id: 'home', path: '/', title: 'Início', description: 'Página inicial da plataforma.', implemented: true },
  {
    id: 'courses',
    path: '/cursos',
    title: 'Catálogo de cursos',
    description: 'Catálogo com os cursos da plataforma, com categoria, nível, instrutor, duração e preço.',
    implemented: true,
    fallbackSection: 'cursos',
  },
  {
    id: 'course',
    path: '/cursos/:slug',
    title: 'Página do curso',
    description: 'Detalhes do curso, conteúdo programático, instrutor e matrícula.',
    implemented: false,
  },
  { id: 'login', path: '/entrar', title: 'Entrar', description: 'Acesso à conta do aluno.', implemented: false },
  { id: 'signup', path: '/cadastro', title: 'Criar conta', description: 'Cadastro de novos alunos.', implemented: false },
  {
    id: 'student',
    path: '/aluno',
    title: 'Área do aluno',
    description: 'Cursos em andamento, progresso, certificados e perfil.',
    implemented: false,
  },
  {
    id: 'admin',
    path: '/admin',
    title: 'Painel administrativo',
    description: 'Gestão de cursos, instrutores, alunos e indicadores.',
    implemented: false,
  },
];

export function getRoute(id: RouteId): RouteDef {
  const route = routes.find((r) => r.id === id);
  if (!route) throw new Error(`Rota desconhecida: ${id}`);
  return route;
}

/** Procura a rota que corresponde a um caminho, extraindo parâmetros (ex.: /cursos/:slug). */
export function matchRoute(pathname: string): { route: RouteDef; params: Record<string, string> } | null {
  const clean = pathname.replace(/\/+$/, '') || '/';
  const parts = clean.split('/').filter(Boolean);
  for (const route of routes) {
    const routeParts = route.path.split('/').filter(Boolean);
    if (routeParts.length !== parts.length) continue;
    const params: Record<string, string> = {};
    const ok = routeParts.every((segment, i) => {
      if (segment.startsWith(':')) {
        params[segment.slice(1)] = decodeURIComponent(parts[i]);
        return true;
      }
      return segment === parts[i];
    });
    if (ok) return { route, params };
  }
  return null;
}

export interface LinkTarget {
  to: string;
  section?: string;
}

/** Destino efetivo de uma rota: se ainda não existe, usa a seção de fallback da home. */
export function resolveRoute(id: RouteId): LinkTarget {
  const route = getRoute(id);
  if (!route.implemented && route.fallbackSection) return { to: '/', section: route.fallbackSection };
  return { to: route.path };
}
