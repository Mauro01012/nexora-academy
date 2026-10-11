import { applyBrandTheme, brand } from '@/config/brand';
import { contrast, isHex, shade } from '@/utils/color';

/**
 * Personalização da marca em tempo de execução. Parte da configuração central (src/config/brand.ts), que continua sendo
 * a fonte dos padrões, e aplica por cima só o que o painel editar (guardado no localStorage).
 */
const KEY = 'nexora.brand.v1';

export interface BrandOverrides {
  wordmark: string;
  suffix: string;
  tagline: string;
  description: string;
  email: string;
  primary: string;
  accent: string;
}

export interface ActiveBrand {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  logo: { wordmark: string; suffix: string; markPath: string; markNode: { cx: number; cy: number; r: number } };
  contact: { email: string; city: string; hours: string };
  demo: typeof brand.demo;
}

export const brandDefaults = (): BrandOverrides => ({
  wordmark: brand.logo.wordmark,
  suffix: brand.logo.suffix,
  tagline: brand.tagline,
  description: brand.description,
  email: brand.contact.email,
  primary: brand.colors['primary-600'],
  accent: brand.colors['accent-500'],
});

/** Variáveis CSS derivadas das duas cores escolhidas. Com as cores originais, devolve a paleta original. */
export function paletteFor(primary: string, accent: string): Record<string, string> {
  const c = brand.colors;
  const keepP = primary.toUpperCase() === c['primary-600'].toUpperCase();
  const keepA = accent.toUpperCase() === c['accent-500'].toUpperCase();
  return {
    '--color-primary-400': keepP ? c['primary-400'] : shade(primary, 0.2),
    '--color-primary-500': keepP ? c['primary-500'] : shade(primary, 0.09),
    '--color-primary-600': keepP ? c['primary-600'] : primary.toUpperCase(),
    '--color-primary-700': keepP ? c['primary-700'] : shade(primary, -0.07),
    '--color-accent-400': keepA ? c['accent-400'] : shade(accent, 0.08),
    '--color-accent-500': keepA ? c['accent-500'] : accent.toUpperCase(),
    '--color-accent-600': keepA ? c['accent-600'] : shade(accent, -0.08),
  };
}

export function validateBrand(v: BrandOverrides): Partial<Record<keyof BrandOverrides, string>> {
  const e: Partial<Record<keyof BrandOverrides, string>> = {};
  const word = (t: string) => t.trim().length >= 2 && t.trim().length <= 14 && /^[\p{L}\p{N} &-]+$/u.test(t.trim());
  if (!word(v.wordmark)) e.wordmark = 'Use de 2 a 14 letras, números ou espaços.';
  if (!word(v.suffix)) e.suffix = 'Use de 2 a 14 letras, números ou espaços.';
  if (v.tagline.trim().length < 5 || v.tagline.trim().length > 80) e.tagline = 'Use de 5 a 80 caracteres.';
  if (v.description.trim().length < 20 || v.description.trim().length > 200) e.description = 'Use de 20 a 200 caracteres.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim()) || v.email.length > 120) e.email = 'Informe um e-mail válido.';
  if (!isHex(v.primary)) e.primary = 'Use o formato #RRGGBB.';
  else if (contrast(v.primary, '#FFFFFF') < 4.5) e.primary = 'Muito clara: o texto branco dos botões ficaria ilegível (contraste mínimo 4,5:1).';
  if (!isHex(v.accent)) e.accent = 'Use o formato #RRGGBB.';
  else if (contrast(v.accent, brand.colors['ink-950']) < 4.5) e.accent = 'Muito escura: o texto escuro dos botões de destaque ficaria ilegível (contraste mínimo 4,5:1).';
  return e;
}

function load(): BrandOverrides | null {
  try {
    const raw = JSON.parse(window.localStorage.getItem(KEY) ?? 'null') as Partial<BrandOverrides> | null;
    if (!raw || typeof raw !== 'object') return null;
    const merged = { ...brandDefaults(), ...Object.fromEntries(Object.entries(raw).filter(([, value]) => typeof value === 'string')) } as BrandOverrides;
    return Object.keys(validateBrand(merged)).length === 0 ? merged : null; // valores inválidos: volta ao padrão
  } catch {
    return null;
  }
}

function resolve(o: BrandOverrides | null): ActiveBrand {
  const v = o ?? brandDefaults();
  const wordmark = v.wordmark.trim();
  const suffix = v.suffix.trim();
  return {
    name: `${wordmark} ${suffix}`,
    shortName: wordmark.charAt(0) + wordmark.slice(1).toLowerCase(),
    tagline: v.tagline.trim(),
    description: v.description.trim(),
    logo: { ...brand.logo, wordmark, suffix },
    contact: { ...brand.contact, email: v.email.trim() },
    demo: brand.demo,
  };
}

let overrides: BrandOverrides | null = load();
let active: ActiveBrand = resolve(overrides);
const listeners = new Set<() => void>();

function publish(): void {
  const o = overrides ?? brandDefaults();
  const root = document.documentElement;
  for (const [name, value] of Object.entries(paletteFor(o.primary, o.accent))) root.style.setProperty(name, value);
}

/** Aplica a marca ao documento. Chamar uma vez na inicialização, depois de `applyBrandTheme()`. */
export function initBrand(): void {
  applyBrandTheme();
  publish();
  document.title = `${active.name} — ${active.tagline}`;
}

function commit(next: BrandOverrides | null): void {
  const previousTitle = `${active.name} — ${active.tagline}`;
  overrides = next;
  active = resolve(next);
  try {
    if (next) window.localStorage.setItem(KEY, JSON.stringify(next));
    else window.localStorage.removeItem(KEY);
  } catch {
    /* sem armazenamento: vale só nesta sessão */
  }
  publish();
  if (document.title === previousTitle) document.title = `${active.name} — ${active.tagline}`;
  listeners.forEach((l) => l());
}

export const saveBrand = (values: BrandOverrides): void => commit({ ...values, wordmark: values.wordmark.trim().toUpperCase(), suffix: values.suffix.trim().toUpperCase() });
export const resetBrand = (): void => commit(null);
export const getBrandOverrides = (): BrandOverrides => overrides ?? brandDefaults();
export const isBrandCustomized = (): boolean => overrides !== null;
export const subscribeBrand = (l: () => void): (() => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
export const getActiveBrand = (): ActiveBrand => active;
