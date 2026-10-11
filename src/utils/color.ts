/** Utilitários de cor para a personalização da marca (hex #RRGGBB). */
export const isHex = (value: string): boolean => /^#[0-9a-fA-F]{6}$/.test(value.trim());

const parse = (hex: string): [number, number, number] => {
  const n = parseInt(hex.trim().slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

function luminance(hex: string): number {
  const [r, g, b] = parse(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Razão de contraste WCAG entre duas cores (de 1 a 21). */
export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Clareia (delta > 0) ou escurece (delta < 0) a cor, mudando só a luminosidade HSL. */
export function shade(hex: string, delta: number): string {
  const [r, g, b] = parse(hex).map((v) => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let l = (max + min) / 2;
  const d = max - min;
  let h = 0;
  let s = 0;
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h /= 6;
  }
  l = Math.min(0.95, Math.max(0.05, l + delta));
  const hue = (t: number) => {
    const x = (t + 1) % 1;
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    if (x < 1 / 6) return p + (q - p) * 6 * x;
    if (x < 1 / 2) return q;
    if (x < 2 / 3) return p + (q - p) * (2 / 3 - x) * 6;
    return p;
  };
  const rgb = s === 0 ? [l, l, l] : [hue(h + 1 / 3), hue(h), hue(h - 1 / 3)];
  return `#${rgb.map((v) => Math.round(v * 255).toString(16).padStart(2, '0')).join('')}`.toUpperCase();
}
