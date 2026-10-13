/**
 * Fonte única da identidade da marca.
 * Para personalizar a plataforma para outro cliente, edite este arquivo:
 * nome, slogan, cores, fontes, logotipo e dados demonstrativos.
 * As cores são publicadas como variáveis CSS (--color-*) por `applyBrandTheme()`.
 */
export const brand = {
  name: 'NEXORA ACADEMY',
  shortName: 'Nexora',
  tagline: 'Conhecimento com método. Carreira com clareza.',
  description:
    'Plataforma de cursos online de tecnologia, com trilhas práticas, mentoria e acompanhamento de progresso.',
  locale: 'pt-BR',

  colors: {
    // Base escura (tinta)
    'ink-950': '#070D1A',
    'ink-900': '#0B1324',
    'ink-800': '#121C33',
    'ink-700': '#1C2A48',
    'ink-600': '#2B3B5E',
    // Base clara (papel)
    'paper-50': '#FDFCF8',
    'paper-100': '#F6F2E9',
    'paper-200': '#EAE4D5',
    'paper-300': '#D8D0BC',
    // Texto auxiliar
    'slate-600': '#4A5570',
    'slate-300': '#AEB8D0',
    // Primária (confiança, ação)
    'primary-400': '#7F9BFF',
    'primary-500': '#4A6DFF',
    'primary-600': '#2448E0',
    'primary-700': '#1B3AB8',
    // Acento (energia, chamadas principais)
    'accent-400': '#FF8A63',
    'accent-500': '#FF6A3D',
    'accent-600': '#E5502A',
    // Apoio (progresso, sucesso, destaque)
    'mint-400': '#4FD1A1',
    'mint-600': '#0F7A59',
    'amber-400': '#F2B84B',
    // Estado de erro: independe da cor de destaque da marca e mantém contraste mínimo de 4,5:1
    'danger-600': '#B42318',
    'danger-400': '#FF9C8F',
  },

  fonts: {
    display: "'Fraunces', 'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
    body: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    mono: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
  },

  logo: {
    wordmark: 'NEXORA',
    suffix: 'ACADEMY',
    /** Marca: um "N" desenhado como trajetória, com um nó de destaque no vértice. */
    markPath: 'M10 23V9l12 14V9',
    markNode: { cx: 22, cy: 9, r: 2.8 },
  },

  contact: {
    email: 'contato@nexora-academy.example',
    city: 'Atendimento 100% online',
    hours: 'Segunda a sexta, das 9h às 18h',
  },

  demo: {
    notice:
      'Projeto demonstrativo. Cursos, instrutores, números e depoimentos são fictícios e servem apenas para apresentação.',
    stats: [
      { value: '48 mil+', label: 'alunos em trilhas ativas' },
      { value: '120', label: 'cursos organizados por trilha' },
      { value: '4,8/5', label: 'avaliação média das aulas' },
      { value: '92%', label: 'de conclusão nos programas guiados' },
    ],
  },
} as const;

export type Brand = typeof brand;

/** Publica cores e fontes da marca como variáveis CSS no elemento raiz. */
export function applyBrandTheme(root: HTMLElement = document.documentElement): void {
  for (const [token, value] of Object.entries(brand.colors)) {
    root.style.setProperty(`--color-${token}`, value);
  }
  root.style.setProperty('--font-display', brand.fonts.display);
  root.style.setProperty('--font-body', brand.fonts.body);
  root.style.setProperty('--font-mono', brand.fonts.mono);
  document.title = `${brand.name} — ${brand.tagline}`;
}
