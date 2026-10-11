import type { Tone } from '@/types';

type Pattern = 'arcs' | 'grid' | 'bars';

interface CourseCoverProps {
  tone: Tone;
  pattern?: Pattern;
  className?: string;
}

/** Capa ilustrativa gerada em SVG (decorativa; o título do curso aparece ao lado). */
export function CourseCover({ tone, pattern = 'arcs', className = '' }: CourseCoverProps) {
  return (
    <svg
      className={`cover ${className}`.trim()}
      data-tone={tone}
      viewBox="0 0 400 260"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <rect className="cover__bg" width="400" height="260" />
      {pattern === 'arcs' && (
        <g>
          <circle className="cover__line" cx="300" cy="150" r="150" />
          <circle className="cover__line" cx="300" cy="150" r="105" />
          <circle className="cover__line" cx="300" cy="150" r="60" />
          <circle className="cover__solid" cx="300" cy="150" r="22" />
          <circle className="cover__soft" cx="70" cy="215" r="46" />
        </g>
      )}
      {pattern === 'grid' && (
        <g>
          {[0, 1, 2, 3, 4, 5].flatMap((row) =>
            [0, 1, 2, 3, 4, 5, 6, 7].map((col) => (
              <circle
                key={`${row}-${col}`}
                className={(row + col) % 5 === 0 ? 'cover__solid' : 'cover__dot'}
                cx={40 + col * 46}
                cy={36 + row * 42}
                r={(row + col) % 5 === 0 ? 7 : 3.5}
              />
            )),
          )}
        </g>
      )}
      {pattern === 'bars' && (
        <g>
          {[52, 96, 150, 112, 188, 140].map((h, i) => (
            <rect
              key={h + i}
              className={i === 4 ? 'cover__solid' : 'cover__soft'}
              x={46 + i * 56}
              y={230 - h}
              width="36"
              height={h}
              rx="8"
            />
          ))}
          <path className="cover__line" d="M30 230H370" />
        </g>
      )}
    </svg>
  );
}
