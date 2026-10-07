import { useRef } from 'react';

import { gsap, MOTION, ScrollTrigger, useGSAP } from '../lib/motion';
import { SpiralGlyph } from './SpiralGlyph';

type Props = { items: string[] };

// Faixa de tecnologias que corre sem parar; a velocidade aumenta e inverte com a rolagem.
export function Marquee({ items }: Props) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        const loop = gsap.to('.marquee__track', { xPercent: -50, duration: 28, ease: 'none', repeat: -1 });
        let resetTimer: ReturnType<typeof setTimeout> | undefined;
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            const boost = gsap.utils.clamp(-6, 6, self.getVelocity() / 300);
            gsap.to(loop, { timeScale: boost === 0 ? 1 : boost, duration: 0.3, overwrite: true });
            clearTimeout(resetTimer);
            resetTimer = setTimeout(() => gsap.to(loop, { timeScale: Math.sign(boost) || 1, duration: 0.8 }), 120);
          },
        });
        return () => {
          clearTimeout(resetTimer);
          st.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const row = items.flatMap((item) => [item, '·']);

  return (
    <div ref={root} className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {[0, 1].map((copy) => (
          <div key={copy} className="marquee__group">
            {row.map((item, i) =>
              item === '·' ? <SpiralGlyph key={i} className="marquee__glyph" /> : <span key={i}>{item}</span>,
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
