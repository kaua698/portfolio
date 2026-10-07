import { useRef } from 'react';

import { capabilities } from '../data/profile';
import { useReveal } from '../lib/useReveal';

export function Capabilities() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  return (
    <section ref={root} id="stack" className="section container" tabIndex={-1} aria-labelledby="stack-title">
      <span className="section__rule" data-rule aria-hidden="true" />
      <h2 id="stack-title" className="section__label mono signal" data-scramble>
        03 / CAPABILITIES
      </h2>
      <div className="section__body">
        <ul className="caps">
          {capabilities.map((c, i) => (
            <li key={c.area} className="caps__cell" data-reveal>
              <span className="caps__head mono muted">
                <span>{c.area}</span>
                <span>{String(i + 1).padStart(2, '0')}</span>
              </span>
              <span className="caps__tech display">{c.tech}</span>
              <span className="caps__text">{c.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
