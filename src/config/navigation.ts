import type { RouteId } from '@/app/routes';

export interface NavItem {
  label: string;
  /** Rota registrada. Se omitida, o item aponta para uma seção da página inicial. */
  route?: RouteId;
  section?: string;
}

export const mainNav: NavItem[] = [
  { label: 'Início', route: 'home' },
  { label: 'Cursos', route: 'courses' },
  { label: 'Categorias', section: 'categorias' },
  { label: 'Sobre', section: 'sobre' },
];

export const footerColumns: { title: string; items: NavItem[] }[] = [
  {
    title: 'Plataforma',
    items: [
      { label: 'Início', route: 'home' },
      { label: 'Catálogo de cursos', route: 'courses' },
      { label: 'Categorias', section: 'categorias' },
      { label: 'Instrutores', section: 'instrutores' },
    ],
  },
  {
    title: 'Para alunos',
    items: [
      { label: 'Entrar', route: 'login' },
      { label: 'Criar conta', route: 'signup' },
      { label: 'Área do aluno', route: 'student' },
    ],
  },
  {
    title: 'Institucional',
    items: [
      { label: 'Sobre a plataforma', section: 'sobre' },
      { label: 'Depoimentos', section: 'depoimentos' },
      { label: 'Painel administrativo', route: 'admin' },
    ],
  },
];
