import { useBrand } from '@/hooks/useBrand';

interface LogoProps {
  className?: string;
  /** Usados só na prévia do painel de marca. */
  wordmark?: string;
  suffix?: string;
}

export function Logo({ className = '', wordmark: wordmarkOverride, suffix: suffixOverride }: LogoProps) {
  const brand = useBrand();
  const { markPath, markNode } = brand.logo;
  const wordmark = wordmarkOverride ?? brand.logo.wordmark;
  const suffix = suffixOverride ?? brand.logo.suffix;
  return (
    <span className={`logo ${className}`.trim()}>
      <svg className="logo__mark" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <rect className="logo__tile" width="32" height="32" rx="9" />
        <path className="logo__glyph" d={markPath} />
        <circle className="logo__node" cx={markNode.cx} cy={markNode.cy} r={markNode.r} />
      </svg>
      <span className="logo__text">
        <span className="logo__word">{wordmark}</span>
        <span className="logo__sub">{suffix}</span>
      </span>
      <span className="visually-hidden"> — {wordmarkOverride ? `${wordmark} ${suffix}` : brand.name}</span>
    </span>
  );
}
