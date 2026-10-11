import type { Category } from '@/types';

export const categories: Category[] = [
  {
    id: 'web',
    name: 'Desenvolvimento Web',
    description: 'Interfaces, APIs e aplicações completas, do HTML moderno ao deploy.',
    icon: 'code',
    tone: 'primary',
    courseCount: 24,
  },
  {
    id: 'dados',
    name: 'Dados e Analytics',
    description: 'Python, SQL e visualização para transformar dados em decisões.',
    icon: 'chart',
    tone: 'mint',
    courseCount: 18,
  },
  {
    id: 'design',
    name: 'Design de Produto',
    description: 'Pesquisa, prototipação e sistemas de design com foco no usuário.',
    icon: 'palette',
    tone: 'accent',
    courseCount: 16,
  },
  {
    id: 'ia',
    name: 'Inteligência Artificial',
    description: 'Modelos generativos, automações e IA aplicada a fluxos de trabalho.',
    icon: 'cpu',
    tone: 'primary',
    courseCount: 14,
  },
  {
    id: 'seguranca',
    name: 'Cibersegurança',
    description: 'Boas práticas de segurança para pessoas desenvolvedoras e equipes.',
    icon: 'shield',
    tone: 'slate',
    courseCount: 12,
  },
  {
    id: 'negocios',
    name: 'Negócios Digitais',
    description: 'Gestão de produto, métricas e estratégia para negócios online.',
    icon: 'briefcase',
    tone: 'amber',
    courseCount: 15,
  },
];

export const categoryById = (id: string): Category | undefined => categories.find((c) => c.id === id);
