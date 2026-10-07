import type { Project } from '../data/projects';

type Props = { project: Project; index: number; onOpen: () => void };

// Moldura de "câmera de segurança" com os prints do projeto.
// Mobile: dois celulares em profundidades diferentes. Web: janela de navegador + celular.
export function ProjectPreview({ project, index, onOpen }: Props) {
  const [first, second] = project.shots;
  const phoneShot = project.kind === 'web' ? project.shots.find((s) => s.src.includes('mobile')) : second;
  const cam = `CAM ${String(index + 1).padStart(2, '0')}`;

  return (
    <button
      type="button"
      className={`preview preview--${project.kind}`}
      onClick={onOpen}
      data-cursor="VIEW"
      aria-label={`Abrir o case de ${project.name}`}
    >
      <span className="preview__screen">
        {project.kind === 'mobile' ? (
          <>
            {phoneShot ? (
              <span className="phone phone--back" data-depth="0.6">
                <img src={phoneShot.src} alt="" loading="lazy" decoding="async" />
              </span>
            ) : null}
            <span className="phone phone--front" data-depth="1">
              <img src={first.src} alt={first.alt} loading="lazy" decoding="async" />
            </span>
          </>
        ) : (
          <>
            <span className="browser" data-depth="0.5">
              <span className="browser__bar" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <img src={first.src} alt={first.alt} loading="lazy" decoding="async" />
            </span>
            {phoneShot ? (
              <span className="phone phone--small" data-depth="1">
                <img src={phoneShot.src} alt="" loading="lazy" decoding="async" />
              </span>
            ) : null}
          </>
        )}
      </span>
      <span className="preview__hud mono" aria-hidden="true">
        <span className="preview__cam">
          <span className="rec-dot" /> {cam}
        </span>
        <span>FILE {project.id}</span>
      </span>
      <span className="preview__scan" aria-hidden="true" />
      <span className="preview__corners" aria-hidden="true" />
      <span className="preview__open mono" aria-hidden="true">
        VIEW CASE →
      </span>
    </button>
  );
}
