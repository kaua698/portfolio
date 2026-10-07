import { useRef, useState } from 'react';

import { projects, teamProjects, type Project } from '../data/projects';
import { gsap, MOTION, SplitText, useGSAP } from '../lib/motion';
import { useReveal } from '../lib/useReveal';
import { CaseDialog } from './CaseDialog';
import { ProjectPreview } from './ProjectPreview';

export function BuildLog() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<Project | null>(null);
  useReveal(root);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        gsap.utils.toArray<HTMLElement>('.project').forEach((row) => {
          const title = row.querySelector<HTMLElement>('.project__title');
          const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 78%', once: true } });

          if (title) {
            SplitText.create(title, {
              type: 'words,chars',
              mask: 'chars',
              onSplit: (self) => {
                tl.from(self.chars, { yPercent: 110, duration: 0.8, stagger: 0.025, ease: 'expo.out' }, 0);
              },
            });
          }
          tl.from(row.querySelector('.project__id'), { opacity: 0, x: -12, duration: 0.5 }, 0)
            .from(row.querySelectorAll('.project__fade'), { y: 24, opacity: 0, duration: 0.7, stagger: 0.07 }, 0.2)
            .fromTo(
              row.querySelector('.preview'),
              { clipPath: 'inset(0 0 100% 0)' },
              { clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'expo.inOut' },
              0.1,
            )
            .from(row.querySelectorAll('.preview img'), { scale: 1.18, duration: 1.4, ease: 'expo.out' }, 0.3);

          // Paralaxe: cada camada da moldura anda numa velocidade
          row.querySelectorAll<HTMLElement>('[data-depth]').forEach((layer) => {
            const depth = Number(layer.dataset.depth ?? 1);
            gsap.fromTo(
              layer,
              { yPercent: 6 * depth },
              {
                yPercent: -6 * depth,
                ease: 'none',
                scrollTrigger: { trigger: row, start: 'top bottom', end: 'bottom top', scrub: true },
              },
            );
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="build" className="section section--build container" tabIndex={-1} aria-labelledby="build-title">
      <span className="section__rule" data-rule aria-hidden="true" />
      <div className="build__head">
        <div>
          <p className="section__label mono signal" data-scramble>
            04 / BUILD LOG
          </p>
          <h2 id="build-title" className="build__title display" data-lines>
            ARQUIVOS
          </h2>
        </div>
        <p className="mono muted" data-reveal>
          {String(projects.length).padStart(2, '0')} REGISTROS · ABRA UM CASE PARA VER TODAS AS TELAS
        </p>
      </div>

      <ol className="projects">
        {projects.map((p, i) => (
          <li key={p.id} className="project">
            <span className="project__id mono signal">{p.id}</span>
            <div className="project__info">
              <h3 className="project__title display">{p.name}</h3>
              <p className="project__purpose project__fade">{p.purpose}</p>
              <p className="project__stack mono muted project__fade">{p.stack.join(' / ').toUpperCase()}</p>
              <dl className="project__facts project__fade">
                <div>
                  <dt className="mono signal">WHAT</dt>
                  <dd>{p.what}</dd>
                </div>
                <div>
                  <dt className="mono signal">HOW</dt>
                  <dd>{p.how}</dd>
                </div>
                <div>
                  <dt className="mono signal">RESULT</dt>
                  <dd>{p.result}</dd>
                </div>
              </dl>
              <div className="project__links mono project__fade">
                <button type="button" className="link-btn" onClick={() => setOpen(p)} data-cursor="VIEW">
                  VIEW CASE →
                </button>
                {p.links.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noreferrer" data-cursor="SOURCE">
                    {l.label} ↗
                  </a>
                ))}
                {p.restricted ? <span className="tag-restricted">CÓDIGO PRIVADO</span> : null}
              </div>
            </div>
            <ProjectPreview project={p} index={i} onOpen={() => setOpen(p)} />
          </li>
        ))}
      </ol>

      <p className="build__team mono muted" data-reveal>
        EM EQUIPE: {teamProjects.join(' · ')}
      </p>

      <CaseDialog project={open} onClose={() => setOpen(null)} />
    </section>
  );
}
