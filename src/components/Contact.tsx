import { useRef } from 'react';

import { profile } from '../data/profile';
import { DESKTOP, gsap, MOTION, scrollToTarget, SplitText, useGSAP } from '../lib/motion';
import { useReveal } from '../lib/useReveal';
import { SpiralGlyph } from './SpiralGlyph';

export function Contact() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        SplitText.create('.contact__title', {
          type: 'words,chars',
          mask: 'chars',
          onSplit: (self) =>
            gsap.from(self.chars, {
              yPercent: 110,
              duration: 1,
              stagger: 0.04,
              ease: 'expo.out',
              scrollTrigger: { trigger: '.contact__title', start: 'top 85%', once: true },
            }),
        });
        // A espiral do fundo gira conforme a rolagem
        gsap.to('.contact__spiral', {
          rotation: 220,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom bottom', scrub: 1 },
        });
      });

      // Botões "magnéticos": seguem um pouco o mouse
      mm.add(`${MOTION} and ${DESKTOP}`, () => {
        const cleanups: (() => void)[] = [];
        root.current?.querySelectorAll<HTMLElement>('.magnetic').forEach((btn) => {
          const xTo = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3.out' });
          const yTo = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3.out' });
          const move = (e: PointerEvent) => {
            const r = btn.getBoundingClientRect();
            xTo((e.clientX - (r.left + r.width / 2)) * 0.3);
            yTo((e.clientY - (r.top + r.height / 2)) * 0.3);
          };
          const leave = () => {
            xTo(0);
            yTo(0);
          };
          btn.addEventListener('pointermove', move);
          btn.addEventListener('pointerleave', leave);
          cleanups.push(() => {
            btn.removeEventListener('pointermove', move);
            btn.removeEventListener('pointerleave', leave);
          });
        });
        return () => cleanups.forEach((c) => c());
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="contato" className="contact" tabIndex={-1} aria-labelledby="contato-title">
      <SpiralGlyph className="contact__spiral" />
      <div className="container contact__inner">
        <p className="section__label mono signal" data-scramble>
          05 / CONTATO
        </p>
        <h2 id="contato-title" className="contact__title display">
          LET&apos;S BUILD.
        </h2>
        <p className="lead" data-reveal>
          Aberto a estágio e a projetos. Respondo rápido.
        </p>
        <div className="contact__actions" data-reveal>
          {profile.email ? (
            <a href={`mailto:${profile.email}`} className="btn btn--signal magnetic" data-cursor="MAIL">
              E-MAIL →
            </a>
          ) : null}
          <a
            href={profile.cv}
            className={`btn ${profile.email ? 'btn--ghost' : 'btn--signal'} magnetic`}
            download="Curriculo-Kaua-Borba.pdf"
            data-cursor="PDF"
          >
            CURRÍCULO ↓
          </a>
          <a href={profile.github} className="btn btn--ghost magnetic" target="_blank" rel="noreferrer" data-cursor="SOURCE">
            GITHUB ↗
          </a>
          <a href={profile.linkedin} className="btn btn--ghost magnetic" target="_blank" rel="noreferrer" data-cursor="OPEN">
            LINKEDIN ↗
          </a>
        </div>
      </div>
      <footer className="footer container mono">
        <span>SYSTEM SHUTDOWN · OBRIGADO PELA VISITA</span>
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            scrollToTarget('#hero');
          }}
        >
          VOLTAR AO TOPO ↑
        </a>
        <span>© 2026 {profile.fullName.toUpperCase()}</span>
      </footer>
    </section>
  );
}
