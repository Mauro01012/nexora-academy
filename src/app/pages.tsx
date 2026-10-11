import type { ComponentType } from 'react';
import type { RouteId } from '@/app/routes';
import { Home } from '@/pages/Home';

/**
 * Registro das páginas implementadas. Nas próximas etapas, adicione aqui o catálogo,
 * a página do curso, o login/cadastro, a área do aluno e o painel administrativo
 * (e marque `implemented: true` em routes.ts).
 */
export const pages: Partial<Record<RouteId, ComponentType<{ params: Record<string, string> }>>> = {
  home: Home,
};
