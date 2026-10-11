import type { Tone } from '@/types';

interface Props {
  name: string;
  initials: string;
  tone: Tone;
}

/** Retrato ilustrado em monograma. Os instrutores são fictícios, então não há fotos reais. */
export function InstructorMonogram({ name, initials, tone }: Props) {
  return (
    <svg
      className="monogram"
      data-tone={tone}
      viewBox="0 0 320 400"
      role="img"
      aria-label={`Monograma ilustrado de ${name}`}
    >
      <rect className="monogram__bg" width="320" height="400" />
      <circle className="monogram__ring" cx="240" cy="90" r="120" />
      <circle className="monogram__ring" cx="240" cy="90" r="76" />
      <path className="monogram__shape" d="M0 400V300c60-34 120-34 180 0s90 34 140 8v92z" />
      <text className="monogram__text" x="36" y="248" aria-hidden="true">
        {initials}
      </text>
    </svg>
  );
}
