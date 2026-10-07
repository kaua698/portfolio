import { useRef } from 'react';

import { evolution } from '../data/profile';
import { gsap, MOTION, SCRAMBLE_CHARS, useGSAP } from '../lib/motion';
import { useReveal } from '../lib/useReveal';

// Linha do tempo como log de build: uma linha vermelha desce com a rolagem
// e cada entrada "acende" quando a linha passa por ela.
export function Evolution() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        gsap.fromTo(
          '.log__progress',
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: { trigger: '.log', start: 'top 70%', end: 'bottom 60%', scrub: 0.6 },
          },
        );
        gsap.utils.toArray<HTMLElement>('.log__item').forEach((item) => {
          const state = item.querySelector('.log__state');
          gsap.from(item, {
            opacity: 0.25,
            duration: 0.4,
            scrollTrigger: { trigger: item, start: 'top 68%', toggleActions: 'play none none reverse' },
          });
          if (state) {
            gsap.to(state, {
              scrambleText: { text: '{original}', chars: SCRAMBLE_CHARS, speed: 0.6 },
              duration: 0.7,
              scrollTrigger: { trigger: item, start: 'top 68%', once: true },
            });
          }
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="evolucao" className="section container" tabIndex={-1} aria-labelledby="evolucao-title">
      <span className="section__rule" data-rule aria-hidden="true" />
      <h2 id="evolucao-title" className="section__label mono signal" data-scramble>
        02 / EVOLUÇÃO
      </h2>
      <div className="section__body">
        <div className="log mono">
          <span className="log__track" aria-hidden="true">
            <span className="log__progress" />
          </span>
          <ol className="log__list">
            {evolution.map((e) => (
              <li key={e.state} className={`log__item${e.next ? ' is-next' : ''}`}>
                <span className="log__year">[{e.year}]</span>
                <span className="log__state">{e.state}</span>
                <span className="log__text">{e.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
