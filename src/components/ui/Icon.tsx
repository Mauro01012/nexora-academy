import type { SVGProps } from 'react';

/** Conjunto próprio de ícones de traço (24x24), mantido aqui para evitar dependências extras. */
const paths = {
  menu: 'M4 6h16M4 12h16M4 18h16',
  close: 'M6 6l12 12M18 6L6 18',
  arrowRight: 'M5 12h14M13 6l6 6-6 6',
  play: 'M8 5.5v13l11-6.5z',
  code: 'M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14',
  chart: 'M4 20V10M10 20V4M16 20v-7M21 20H3',
  palette:
    'M12 3a9 9 0 100 18c1.4 0 2-1 1.5-2.2-.5-1.2.3-2.3 1.6-2.3H17a4 4 0 004-4c0-5-4-9.5-9-9.5zM7.5 11h.01M10 7.5h.01M14.5 7.5h.01',
  shield: 'M12 3l7 3v5.5c0 4.5-3 7.5-7 9.5-4-2-7-5-7-9.5V6zM9 12l2 2 4-4',
  briefcase: 'M4 8h16v11H4zM9 8V5h6v3M4 13h16',
  cpu: 'M7 7h10v10H7zM10 10h4v4h-4zM9 3v4M15 3v4M9 17v4M15 17v4M3 9h4M3 15h4M17 9h4M17 15h4',
  layers: 'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5',
  award: 'M12 3a6 6 0 100 12 6 6 0 000-12zM8.5 14.5L7 21l5-3 5 3-1.5-6.5',
  clock: 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 7v5l3 2',
  users:
    'M9 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM2.5 20c0-3.3 2.9-6 6.5-6s6.5 2.7 6.5 6M16 4.5a3.5 3.5 0 010 6.5M18 14.3c2 .7 3.5 2.6 3.5 5.7',
  star: 'M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8 6.8 19.6l1-5.8L3.5 9.7l5.9-.8z',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  book: 'M4 5.5C6.5 4.5 9.5 4.5 12 6c2.5-1.5 5.5-1.5 8-.5V19c-2.5-1-5.5-1-8 .5-2.5-1.5-5.5-1.5-8-.5zM12 6v13.5',
  target:
    'M12 3a9 9 0 100 18 9 9 0 000-18zM12 7a5 5 0 100 10 5 5 0 000-10zM12 11a1 1 0 100 2 1 1 0 000-2z',
  compass: 'M12 3a9 9 0 100 18 9 9 0 000-18zM15.5 8.5l-2 5-5 2 2-5z',
  user: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 20c0-4 3.6-6 8-6s8 2 8 6',
  mail: 'M3 6h18v12H3zM3 7l9 7 9-7',
  video: 'M3 7h12v10H3zM15 11l6-3v8l-6-3',
  lock: 'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 017 0v3',
} as const;

export type IconName = keyof typeof paths;

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  filled?: boolean;
  /** Se informado, o ícone é exposto a leitores de tela; caso contrário é decorativo. */
  title?: string;
}

export function Icon({ name, size = 20, strokeWidth = 1.75, filled = false, title, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      focusable="false"
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      <path d={paths[name]} />
    </svg>
  );
}
