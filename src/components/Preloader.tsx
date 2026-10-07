import { useRef } from 'react';

import { gsap, SCRAMBLE_CHARS, useGSAP } from '../lib/motion';
import { SpiralGlyph } from './SpiralGlyph';

type Props = { onDone: () => void };

const LINES = ['INITIALIZING SYSTEM', 'MOUNTING ARCHIVE · 05 FILES', 'CAM 01 · ONLINE'];

// Abertura curta (cerca de 1,6 s): contador até 100%, mensagens de sistema e a cortina subindo.
export function Preloader({ onDone }: Props) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const counter = { value: 0 };
      const num = root.current?.querySelector<HTMLElement>('.preloader__count');
      const tl = gsap.timeline({ onComplete: onDone });
      gsap.to('.preloader__glyph', { rotation: 360, duration: 1.6, repeat: -1, ease: 'none' });

      tl.to(counter, {
        value: 100,
        duration: 1.3,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (num) num.textContent = String(Math.round(counter.value)).padStart(3, '0');
        },
      })
        .fromTo('.preloader__bar', { scaleX: 0 }, { scaleX: 1, duration: 1.3, ease: 'power2.inOut' }, 0)
        .from('.preloader__line', { opacity: 0, duration: 0.01, stagger: 0.38 }, 0.1)
        .to(
          '.preloader__line',
          { scrambleText: { text: '{original}', chars: SCRAMBLE_CHARS, speed: 0.6 }, duration: 0.5, stagger: 0.38 },
          0.1,
        )
        .to('.preloader__inner', { opacity: 0, y: -16, duration: 0.3, ease: 'power2.in' }, '+=0.15')
        .to(root.current, { clipPath: 'inset(0 0 100% 0)', duration: 0.75, ease: 'expo.inOut' }, '-=0.05');
    },
    { scope: root },
  );

  return (
    <div ref={root} className="preloader" aria-hidden="true">
      <div className="preloader__top mono">
        <span>KAUÃ / ARCHIVE</span>
        <SpiralGlyph className="preloader__glyph" />
      </div>
      <div className="preloader__inner">
        <div className="preloader__lines">
          {LINES.map((line) => (
            <span key={line} className="preloader__line">
              {line}
            </span>
          ))}
        </div>
        <div className="preloader__meter">
          <span className="preloader__count">000</span>
          <span className="preloader__pct">%</span>
        </div>
        <div className="preloader__track">
          <span className="preloader__bar" />
        </div>
      </div>
    </div>
  );
}
