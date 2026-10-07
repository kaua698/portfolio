import { useRef } from 'react';

import { DESKTOP, gsap, MOTION, useGSAP } from '../lib/motion';
import { spiralPath } from '../lib/spiral';

const PATH = spiralPath();

// Olho no centro da lente: contorno amendoado de 184 × 84 e íris de raio 30
const EYE = 'M308 400 Q400 316 492 400 Q400 484 308 400 Z';
const IRIS_RANGE = { x: 44, y: 14 };
const APERTURE = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2;
  return `M${(400 + Math.cos(a) * 17).toFixed(1)} ${(400 + Math.sin(a) * 17).toFixed(1)} L${(400 + Math.cos(a) * 27).toFixed(1)} ${(400 + Math.sin(a) * 27).toFixed(1)}`;
}).join(' ');

type Props = { start: boolean };

// Lente da "câmera": espiral fina que se desenha do centro para fora, gira devagar,
// reage ao mouse e se aproxima conforme a pessoa rola a página.
// No centro, um olho acompanha o cursor e pisca a cada 4 segundos; o feixe do radar
// aponta sempre para onde o olho está olhando.
export function Spiral({ start }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const zoom = useRef<HTMLSpanElement>(null);
  const svg = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      if (!start) return;
      const mm = gsap.matchMedia();

      mm.add(MOTION, () => {
        const intro = gsap.timeline();
        intro
          .from('.spiral__ring', { scale: 0.6, opacity: 0, duration: 1.4, svgOrigin: '400 400', ease: 'expo.out' })
          .from('.spiral__path', { drawSVG: '0%', duration: 2.6, ease: 'power2.inOut' }, 0.1)
          .from('.spiral__tick', { opacity: 0, stagger: 0.08, duration: 0.3 }, 0.6)
          .from('.spiral__end', { scale: 0, svgOrigin: '780 400', duration: 0.5, ease: 'back.out(3)' }, 2.4)
          .from('.spiral__sweep', { opacity: 0, duration: 1.2 }, 1.2)
          .from('.eye__rim', { scale: 0, svgOrigin: '400 400', duration: 0.9, ease: 'expo.out' }, 1.6)
          .from('.eye__ball', { scaleY: 0, svgOrigin: '400 400', duration: 0.5, ease: 'power2.out' }, 2.1);

        // Piscada a cada 4 segundos (fecha rápido, abre um pouco mais devagar)
        gsap
          .timeline({ repeat: -1, repeatDelay: 4, delay: 3 })
          .to('.eye__ball', { scaleY: 0.06, svgOrigin: '400 400', duration: 0.09, ease: 'power2.in' })
          .to('.eye__ball', { scaleY: 1, svgOrigin: '400 400', duration: 0.16, ease: 'power2.out' });

        gsap.to('.spiral__spin', { rotation: 360, svgOrigin: '400 400', duration: 160, repeat: -1, ease: 'none' });

        // Ao rolar: a lente aproxima e some aos poucos
        // O olho gira ao contrário da lente para continuar na horizontal
        gsap.to('.eye', {
          rotation: 40,
          svgOrigin: '400 400',
          ease: 'none',
          scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 0.8 },
        });

        gsap.to('.spiral__zoom', {
          scale: 1.35,
          rotation: -40,
          opacity: 0.25,
          ease: 'none',
          scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 0.8,
            onUpdate: (self) => {
              if (zoom.current) zoom.current.textContent = `ZOOM ${(1 + self.progress * 0.35).toFixed(2)}×`;
            },
          },
        });
      });

      mm.add(`${MOTION} and ${DESKTOP}`, () => {
        const xTo = gsap.quickTo('.spiral__parallax', 'x', { duration: 1.2, ease: 'power3.out' });
        const yTo = gsap.quickTo('.spiral__parallax', 'y', { duration: 1.2, ease: 'power3.out' });
        const onMove = (e: PointerEvent) => {
          xTo((e.clientX / window.innerWidth - 0.5) * -36);
          yTo((e.clientY / window.innerHeight - 0.5) * -36);
        };
        window.addEventListener('pointermove', onMove);
        return () => window.removeEventListener('pointermove', onMove);
      });

      // Olho seguindo o cursor (com toque também). Sem movimento por 3 s, ele olha em volta.
      mm.add({ motion: MOTION, reduce: '(prefers-reduced-motion: reduce)' }, (ctx) => {
        const el = svg.current;
        if (!el) return;
        const calm = Boolean(ctx.conditions?.reduce);
        const dur = calm ? 0.05 : 0.45;
        const xTo = gsap.quickTo('.eye__iris', 'x', { duration: dur, ease: 'power3.out' });
        const yTo = gsap.quickTo('.eye__iris', 'y', { duration: dur, ease: 'power3.out' });
        let lastMove = 0;

        // Feixe do radar: a fatia vai de 0° a -30°, então +15° deixa o centro dela na direção do olhar.
        // O ângulo é "desenrolado" para o feixe virar pelo caminho mais curto, sem dar volta inteira.
        gsap.set('.spiral__sweep', { svgOrigin: '400 400' });
        const sweepTo = gsap.quickTo('.spiral__sweep', 'rotation', { duration: calm ? 0.05 : 0.9, ease: 'power3.out' });
        let sweep = 0;
        const aim = (dx: number, dy: number) => {
          const target = (Math.atan2(dy, dx) * 180) / Math.PI + 15;
          sweep += ((((target - sweep) % 360) + 540) % 360) - 180;
          sweepTo(sweep);
        };

        const look = (clientX: number, clientY: number) => {
          const ctm = el.getScreenCTM();
          if (!ctm) return;
          const p = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse());
          const dx = p.x - 400;
          const dy = p.y - 400;
          const dist = Math.hypot(dx, dy) || 1;
          const reach = Math.min(dist / 260, 1);
          xTo((dx / dist) * IRIS_RANGE.x * reach);
          yTo((dy / dist) * IRIS_RANGE.y * reach);
          aim(dx, dy);
        };
        const onMove = (e: PointerEvent) => {
          lastMove = performance.now();
          look(e.clientX, e.clientY);
        };
        // Pupila dilata em cima de links e botões
        const onOver = (e: PointerEvent) => {
          const hot = Boolean((e.target as Element | null)?.closest?.('a, button'));
          gsap.to('.eye__pupil', { scale: hot ? 1.45 : 1, svgOrigin: '400 400', duration: 0.3, overwrite: true });
        };

        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerdown', onMove);
        document.addEventListener('pointerover', onOver);

        const glance = calm
          ? null
          : gsap.delayedCall(2.4, function repeat() {
              if (performance.now() - lastMove > 3000) {
                const a = Math.random() * Math.PI * 2;
                const r = 0.4 + Math.random() * 0.6;
                xTo(Math.cos(a) * IRIS_RANGE.x * r);
                yTo(Math.sin(a) * IRIS_RANGE.y * r);
                aim(Math.cos(a), Math.sin(a));
              }
              glance?.restart(true);
            });

        return () => {
          glance?.kill();
          window.removeEventListener('pointermove', onMove);
          window.removeEventListener('pointerdown', onMove);
          document.removeEventListener('pointerover', onOver);
        };
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [start] },
  );

  return (
    <div ref={root} className="spiral" aria-hidden="true">
      <div className="spiral__zoom">
        <div className="spiral__parallax">
          <svg ref={svg} viewBox="0 0 800 800" fill="none" className={start ? undefined : 'is-hidden'}>
            <defs>
              <linearGradient id="sweep" x1="400" y1="400" x2="800" y2="400" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#E02A36" stopOpacity="0" />
                <stop offset="1" stopColor="#E02A36" stopOpacity="0.18" />
              </linearGradient>
              <radialGradient id="iris" cx="400" cy="400" r="30" gradientUnits="userSpaceOnUse">
                <stop offset="0.3" stopColor="#3A060B" />
                <stop offset="1" stopColor="#12030A" />
              </radialGradient>
              <clipPath id="eye-clip">
                <path d={EYE} />
              </clipPath>
            </defs>
            <path className="spiral__sweep" d="M400 400 L792 400 A392 392 0 0 0 739 204 Z" fill="url(#sweep)" />
            <g className="spiral__spin">
              <path className="spiral__path" d={PATH} stroke="#6A6A6A" strokeWidth="1.2" />
              <circle className="spiral__end" cx="780" cy="400" r="5" fill="#E02A36" />
            </g>
            <circle className="spiral__ring" cx="400" cy="400" r="392" stroke="#2A2A2A" />
            <circle className="spiral__ring" cx="400" cy="400" r="300" stroke="#1C1C1C" strokeDasharray="2 10" />
            <path className="spiral__tick" d="M400 0 V40" stroke="#7E131C" strokeWidth="2" />
            <path className="spiral__tick" d="M800 400 H760" stroke="#7E131C" strokeWidth="2" />
            <path className="spiral__tick" d="M400 800 V760" stroke="#7E131C" strokeWidth="2" />
            <path className="spiral__tick" d="M0 400 H40" stroke="#7E131C" strokeWidth="2" />
            <g className="eye">
              <g className="eye__rim">
                <circle cx="400" cy="400" r="104" fill="#050505" />
                <circle cx="400" cy="400" r="104" stroke="#2A2A2A" strokeDasharray="3 7" />
              </g>
              <g className="eye__ball">
                <path d={EYE} fill="#0B0B0B" />
                <g clipPath="url(#eye-clip)">
                  <g className="eye__iris">
                    <circle cx="400" cy="400" r="30" fill="url(#iris)" stroke="#E02A36" strokeWidth="1.5" />
                    <path d={APERTURE} stroke="#7E131C" strokeWidth="1.2" />
                    <circle className="eye__pupil" cx="400" cy="400" r="11" fill="#050505" stroke="#E02A36" strokeWidth="1" />
                    <circle cx="392" cy="391" r="3" fill="#F2F2F2" opacity="0.85" />
                  </g>
                </g>
                <path d={EYE} stroke="#F2F2F2" strokeWidth="1.6" strokeLinejoin="round" />
              </g>
            </g>
          </svg>
        </div>
      </div>
      <span className="spiral__label spiral__label--tl">CAM 01 · LENS</span>
      <span ref={zoom} className="spiral__label spiral__label--br">ZOOM 1.00×</span>
    </div>
  );
}
