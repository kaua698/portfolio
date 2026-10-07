import { useEffect, useRef } from 'react';

import { DESKTOP, gsap, prefersReducedMotion } from '../lib/motion';

// Cursor de mira, só em desktop. Sobre elementos com data-cursor mostra a ação (VIEW, SOURCE...).
// O cursor do sistema continua visível: este é só um reforço visual.
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ring.current;
    if (!el || !window.matchMedia(DESKTOP).matches) return;
    const quick = prefersReducedMotion() ? 0.01 : 0.35;
    const xTo = gsap.quickTo(el, 'x', { duration: quick, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: quick, ease: 'power3.out' });

    const move = (e: PointerEvent) => {
      el.classList.add('is-visible');
      xTo(e.clientX);
      yTo(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-cursor]');
      const text = target?.dataset.cursor ?? '';
      if (label.current) label.current.textContent = text;
      el.classList.toggle('is-active', Boolean(text));
    };
    const leave = () => el.classList.remove('is-visible');

    window.addEventListener('pointermove', move);
    document.addEventListener('pointerover', over);
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, []);

  return (
    <div ref={ring} className="cursor" aria-hidden="true">
      <span className="cursor__ring" />
      <span ref={label} className="cursor__label mono" />
    </div>
  );
}
