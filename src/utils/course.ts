import { categories } from '@/data/categories';
import type { Level } from '@/types';

export type CoverPattern = 'arcs' | 'grid' | 'bars';

const patterns: CoverPattern[] = ['arcs', 'grid', 'bars'];

/** Padrão da capa SVG de cada categoria (o mesmo na página inicial e no catálogo). */
export const coverPatternFor = (categoryId: string): CoverPattern =>
  patterns[Math.max(0, categories.findIndex((c) => c.id === categoryId)) % patterns.length];

const numberFormat = new Intl.NumberFormat('pt-BR');
const priceFormat = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

export const formatNumber = (value: number): string => numberFormat.format(value);

/** Preço em reais; sem preço, o curso é gratuito. */
export const formatPrice = (price?: number): string => (price ? priceFormat.format(price) : 'Gratuito');

/** Posição do nível (1 a 3), usada no indicador visual dos cartões. */
export const levelRank: Record<Level, number> = { Iniciante: 1, Intermediário: 2, Avançado: 3 };
