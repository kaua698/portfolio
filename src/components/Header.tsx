import { useEffect, useRef, useState } from 'react';

import { gsap, scrollToTarget, useGSAP } from '../lib/motion';

const NAV = [
  { href: '#perfil', label: '01 PERFIL' },
  { href: '#evolucao', label: '02 EVOLUÇÃO' },
  { href: '#stack', label: '03 STACK' },
  { href: '#build', label: '04 BUILD LOG' },
  { href: '#contato', label: '05 CONTATO' },
];

function pad(n: number) {
  return String(n).padStart(2, '0');
}

// Cabeçalho fixo: marca, navegação, gravação "REC" com o tempo na página e barra de progresso da rolagem.
export function Header() {
  const root = useRef<HTMLElement>(null);
  const clock = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);

  // Tempo desde que a página abriu, no formato de câmera HH:MM:SS:FF
  useEffect(() => {
    const t0 = performance.now();
    let raf = 0;
    const tick = () => {
      const ms = performance.now() - t0;
      const total = Math.floor(ms / 1000);
      const frames = Math.floor((ms % 1000) / (1000 / 24));
      if (clock.current) {
        clock.current.textContent = `${pad(Math.floor(total / 3600))}:${pad(Math.floor(total / 60) % 60)}:${pad(total % 60)}:${pad(frames)}`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useGSAP(
    () => {
      gsap.to('.header__progress', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
      });
    },
    { scope: root },
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setOpen(false);
    scrollToTarget(href);
    const target = document.querySelector<HTMLElement>(href);
    target?.focus({ preventScroll: true });
  };

  return (
    <header ref={root} className="header">
      <div className="header__bar container">
        <a href="#hero" className="header__brand" onClick={(e) => go(e, '#hero')}>
          KAUÃ <span className="muted">/ ARCHIVE</span>
        </a>
        <nav aria-label="Seções" className={`header__nav${open ? ' is-open' : ''}`} id="menu">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} onClick={(e) => go(e, item.href)}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="header__rec" aria-hidden="true">
          <span className="rec-dot" />
          REC <span ref={clock} className="header__clock">00:00:00:00</span>
        </div>
        <button
          type="button"
          className="header__toggle"
          aria-expanded={open}
          aria-controls="menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'FECHAR' : 'MENU'}
        </button>
      </div>
      <span className="header__progress" aria-hidden="true" />
    </header>
  );
}
