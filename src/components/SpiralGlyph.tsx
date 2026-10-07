import { spiralPath } from '../lib/spiral';

const GLYPH = spiralPath({ cx: 12, cy: 12, turns: 3, inner: 1, outer: 11, steps: 24 });

// Espiral pequena usada como separador e ícone
export function SpiralGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={GLYPH} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
