import { useEffect, useRef, useState } from 'react';

import type { Project } from '../data/projects';
import { gsap, lockScroll, prefersReducedMotion, SCRAMBLE_CHARS } from '../lib/motion';

type Props = { project: Project | null; onClose: () => void };

// Case do projeto em tela cheia. Abre como "acesso a arquivo": cortina vermelha,
// cabeçalho que decodifica e as telas entrando uma depois da outra.
// Usa <dialog> nativo: foco preso dentro, Esc fecha e o foco volta para o botão de origem.
export function CaseDialog({ project, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [shown, setShown] = useState<Project | null>(null);
  const closing = useRef(false);

  useEffect(() => {
    const el = dialog.current;
    if (!el || !project) return;
    setShown(project);
    closing.current = false;
    el.showModal();
    lockScroll(true);
  }, [project]);

  useEffect(() => {
    const el = dialog.current;
    if (!el || !shown || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .fromTo('.case__wipe', { scaleY: 0, transformOrigin: 'bottom' }, { scaleY: 1, duration: 0.45, ease: 'expo.in' })
        .set('.case__panel', { opacity: 1 })
        .to('.case__wipe', { scaleY: 0, transformOrigin: 'top', duration: 0.55, ease: 'expo.out' })
        .set('.case__status', { textContent: `ACCESSING FILE ${shown.id}…` }, '-=0.5')
        .to(
          '.case__status',
          {
            scrambleText: { text: `FILE ${shown.id} · ACCESS GRANTED`, chars: SCRAMBLE_CHARS, speed: 0.6 },
            duration: 0.9,
          },
          '-=0.2',
        )
        .from('.case__title', { yPercent: 100, opacity: 0, duration: 0.7 }, '-=0.6')
        .from('.case__fade', { y: 24, opacity: 0, duration: 0.6, stagger: 0.06 }, '-=0.45')
        .from('.case__shot', { y: 60, opacity: 0, duration: 0.8, stagger: 0.08, ease: 'expo.out' }, '-=0.5');
    }, el);
    return () => ctx.revert();
  }, [shown]);

  const finish = () => {
    dialog.current?.close();
    lockScroll(false);
    setShown(null);
    onClose();
  };

  const close = () => {
    if (closing.current) return;
    closing.current = true;
    if (prefersReducedMotion() || !dialog.current) return finish();
    gsap
      .timeline({ onComplete: finish })
      .fromTo(
        dialog.current.querySelector('.case__wipe'),
        { scaleY: 0, transformOrigin: 'top' },
        { scaleY: 1, duration: 0.4, ease: 'expo.in' },
      )
      .set(dialog.current.querySelector('.case__panel'), { opacity: 0 });
  };

  return (
    <dialog
      ref={dialog}
      className="case"
      aria-labelledby="case-title"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === dialog.current) close();
      }}
    >
      <span className="case__wipe" aria-hidden="true" />
      {shown ? (
        <div className="case__panel" data-lenis-prevent>
          <div className="case__top container">
            <p className="case__status mono signal">FILE {shown.id} · ACCESS GRANTED</p>
            <button type="button" className="case__close mono" onClick={close} data-cursor="CLOSE" autoFocus>
              FECHAR ✕
            </button>
          </div>
          <div className="container case__body">
            <div className="case__mask">
              <h2 id="case-title" className="case__title display">
                {shown.name}
              </h2>
            </div>
            <p className="case__purpose case__fade">{shown.purpose}</p>
            <dl className="case__facts case__fade">
              {(
                [
                  ['WHAT', shown.what],
                  ['WHY', shown.why],
                  ['HOW', shown.how],
                  ['RESULT', shown.result],
                ] as const
              ).map(([k, v]) => (
                <div key={k}>
                  <dt className="mono signal">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mono muted case__fade">{shown.stack.join(' / ').toUpperCase()}</p>
            <div className="project__links mono case__fade">
              {shown.links.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noreferrer" data-cursor="SOURCE">
                  {l.label} ↗
                </a>
              ))}
              {shown.restricted ? (
                <span className="tag-restricted">CÓDIGO PRIVADO · TELAS SOB PEDIDO</span>
              ) : null}
            </div>
          </div>
          <ul className="case__gallery" aria-label={`Telas de ${shown.name}`}>
            {shown.shots.map((s, i) => (
              <li key={s.src} className={`case__shot${s.src.includes('mobile') || shown.kind === 'mobile' ? ' is-phone' : ''}`}>
                <img src={s.src} alt={s.alt} loading="lazy" decoding="async" />
                <span className="mono muted">
                  {String(i + 1).padStart(2, '0')} · {s.alt}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </dialog>
  );
}
