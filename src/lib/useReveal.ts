import type { RefObject } from 'react';

import { gsap, MOTION, SCRAMBLE_CHARS, ScrollTrigger, SplitText, useGSAP } from './motion';

// Animações de entrada compartilhadas pelas seções. Basta marcar no HTML:
//   data-scramble  → rótulo mono que "decodifica" ao aparecer
//   data-lines     → título que sobe linha por linha de dentro de uma máscara
//   data-reveal    → bloco que sobe e aparece (em grupo, um depois do outro)
//   data-rule      → fio que se desenha da esquerda para a direita
export function useReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        const root = scope.current;
        if (!root) return;

        root.querySelectorAll<HTMLElement>('[data-scramble]').forEach((el) => {
          gsap.to(el, {
            scrambleText: { text: '{original}', chars: SCRAMBLE_CHARS, speed: 0.5 },
            duration: 0.9,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          });
        });

        root.querySelectorAll<HTMLElement>('[data-lines]').forEach((el) => {
          SplitText.create(el, {
            type: 'lines',
            mask: 'lines',
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 105,
                duration: 1,
                stagger: 0.09,
                ease: 'expo.out',
                scrollTrigger: { trigger: el, start: 'top 85%', once: true },
              }),
          });
        });

        root.querySelectorAll<HTMLElement>('[data-rule]').forEach((el) => {
          gsap.from(el, {
            scaleX: 0,
            transformOrigin: 'left center',
            duration: 1.2,
            ease: 'expo.inOut',
            scrollTrigger: { trigger: el, start: 'top 92%', once: true },
          });
        });

        const blocks = root.querySelectorAll<HTMLElement>('[data-reveal]');
        if (blocks.length) {
          gsap.set(blocks, { y: 40, opacity: 0 });
          ScrollTrigger.batch(blocks, {
            start: 'top 90%',
            once: true,
            onEnter: (batch) => gsap.to(batch, { y: 0, opacity: 1, duration: 0.9, stagger: 0.1, overwrite: true }),
          });
        }
      });
      return () => mm.revert();
    },
    { scope },
  );
}
