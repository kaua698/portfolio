import { useEffect, useState } from 'react';

import { BuildLog } from './components/BuildLog';
import { Capabilities } from './components/Capabilities';
import { Contact } from './components/Contact';
import { Cursor } from './components/Cursor';
import { Evolution } from './components/Evolution';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
import { Preloader } from './components/Preloader';
import { Profile } from './components/Profile';
import { marquee } from './data/profile';
import { prefersReducedMotion, ScrollTrigger, startSmoothScroll } from './lib/motion';

// A abertura aparece uma vez por visita (sessão) e nunca para quem pediu menos movimento
const SEEN_KEY = 'kaua:intro-seen';
function shouldShowIntro() {
  if (prefersReducedMotion()) return false;
  try {
    return sessionStorage.getItem(SEEN_KEY) !== '1';
  } catch {
    return true;
  }
}

export default function App() {
  const [intro, setIntro] = useState(shouldShowIntro);
  const ready = !intro;

  useEffect(() => startSmoothScroll(), []);

  // Recalcula as posições do ScrollTrigger depois que as fontes carregam
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  const finishIntro = () => {
    try {
      sessionStorage.setItem(SEEN_KEY, '1');
    } catch {
      // navegação privada: só não lembra
    }
    setIntro(false);
  };

  return (
    <>
      <a href="#build" className="skip-link">
        Pular para os projetos
      </a>
      {intro ? <Preloader onDone={finishIntro} /> : null}
      <Cursor />
      <div className="grain" aria-hidden="true" />
      <Header />
      <main>
        <Hero ready={ready} />
        <Profile />
        <Evolution />
        <Marquee items={marquee} />
        <Capabilities />
        <BuildLog />
      </main>
      <Contact />
    </>
  );
}
