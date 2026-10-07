import { useRef } from 'react';

import { profile } from '../data/profile';
import { projects } from '../data/projects';
import { gsap, MOTION, SCRAMBLE_CHARS, scrollToTarget, SplitText, useGSAP } from '../lib/motion';
import { Spiral } from './Spiral';

type Props = { ready: boolean };

const STATUS = [
  ['MODE', 'PORTFOLIO'],
  ['STATE', 'ONLINE'],
  ['BUILD', '2026.10'],
  ['PROJECTS', `${String(projects.length).padStart(2, '0')} ARQUIVADOS`],
  ['SIGNAL', 'STABLE'],
];

export function Hero({ ready }: Props) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!ready) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        const tl = gsap.timeline({ delay: 0.05 });

        // Nome montado letra por letra, subindo de dentro de uma máscara
        SplitText.create('.hero__name', {
          type: 'words,chars',
          mask: 'chars',
          onSplit: (self) => {
            tl.from(self.chars, { yPercent: 115, duration: 1.1, stagger: 0.07, ease: 'expo.out' }, 0);
          },
        });

        tl.to('.hero__kicker', { scrambleText: { text: '{original}', chars: SCRAMBLE_CHARS, speed: 0.5 }, duration: 0.9 }, 0.15)
          .from('.hero__role', { yPercent: 100, opacity: 0, duration: 0.8 }, 0.45)
          .from('.hero__tagline', { y: 18, opacity: 0, duration: 0.8 }, 0.6)
          .from('.hero__actions > *', { y: 18, opacity: 0, duration: 0.6, stagger: 0.08 }, 0.75)
          .from('.status', { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'expo.inOut' }, 0.7)
          .to(
            '.status__value',
            { scrambleText: { text: '{original}', chars: SCRAMBLE_CHARS, speed: 0.5 }, duration: 0.9, stagger: 0.08 },
            1,
          )
          .from('.hero__scroll', { opacity: 0, duration: 0.6 }, 1.2);

        // A seta do "scroll to enter" desce e volta
        gsap.to('.hero__arrow', { y: 6, duration: 0.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [ready] },
  );

  return (
    <section ref={root} id="hero" className="hero" tabIndex={-1} aria-labelledby="hero-title">
      <Spiral start={ready} />
      <div className="container hero__inner">
        <div className="hero__copy">
          <p className="hero__kicker mono signal">PERSONAL DEVELOPMENT SYSTEM // 2026</p>
          <h1 id="hero-title" className="hero__name display">
            {profile.name}
          </h1>
          <div className="hero__mask">
            <p className="hero__role display">
              {profile.role} <span className="muted">/ {profile.course}</span>
            </p>
          </div>
          <p className="hero__tagline">{profile.tagline}</p>
          <div className="hero__actions">
            <a
              href="#build"
              className="btn btn--solid"
              data-cursor="ABRIR"
              onClick={(e) => {
                e.preventDefault();
                scrollToTarget('#build');
              }}
            >
              VER PROJETOS →
            </a>
            <a href={profile.github} className="btn btn--ghost" target="_blank" rel="noreferrer" data-cursor="SOURCE">
              GITHUB ↗
            </a>
          </div>
        </div>

        <div className="hero__bottom">
          <p className="hero__scroll mono">
            <span>
              SCROLL TO ENTER <span className="hero__arrow">↓</span>
            </span>
            <span className="muted">ARQUIVO 01 DE {String(projects.length).padStart(2, '0')}</span>
          </p>
          <div className="status mono">
            <p className="status__title signal">SYSTEM STATUS</p>
            <dl>
              {STATUS.map(([k, v]) => (
                <div key={k} className="status__row">
                  <dt>{k}</dt>
                  <dd className="status__value">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
