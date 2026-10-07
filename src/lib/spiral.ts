// Espiral de Arquimedes (r cresce em linha reta com o ângulo), desenhada como um único path SVG.
// É uma forma geométrica genérica; não reproduz nenhum símbolo de filme.
export function spiralPath({
  cx = 400,
  cy = 400,
  turns = 8,
  inner = 14,
  outer = 380,
  steps = 40,
}: { cx?: number; cy?: number; turns?: number; inner?: number; outer?: number; steps?: number } = {}) {
  const total = Math.round(turns * steps);
  const parts: string[] = [];
  for (let i = 0; i <= total; i++) {
    const t = i / total;
    const angle = t * turns * Math.PI * 2;
    const r = inner + t * (outer - inner);
    const x = (cx + r * Math.cos(angle)).toFixed(1);
    const y = (cy + r * Math.sin(angle)).toFixed(1);
    parts.push(`${i === 0 ? 'M' : 'L'}${x} ${y}`);
  }
  return parts.join(' ');
}
