import { useRef } from 'react';

import { profile } from '../data/profile';
import { useReveal } from '../lib/useReveal';

export function Profile() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  return (
    <section ref={root} id="perfil" className="section container" tabIndex={-1} aria-labelledby="perfil-title">
      <span className="section__rule" data-rule aria-hidden="true" />
      <p className="section__label mono signal" data-scramble>
        01 / PERFIL
      </p>
      <div className="section__body">
        <h2 id="perfil-title" className="profile__statement display" data-lines>
          {profile.statement}
        </h2>
        <p className="lead" data-reveal>
          {profile.about}
        </p>
        <dl className="facts">
          {profile.facts.map((f) => (
            <div key={f.label} className="facts__item" data-reveal>
              <dt className="mono muted">{f.label}</dt>
              <dd className={f.signal ? 'signal' : undefined}>{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
