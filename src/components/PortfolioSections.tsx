import React, { Suspense, useEffect, useRef, useState } from 'react';
import { soundManager } from '../utils/audio';

const Spline = React.lazy(() => import('@splinetool/react-spline'));

type Scene = {
  index: string;
  eyebrow: string;
  title: string;
  italic: string;
  body: string;
  meta: string[];
  url: string;
  tone: 'ink' | 'ivory' | 'blue';
  side: 'left' | 'right';
};

const scenes: Scene[] = [
  {
    index: '01',
    eyebrow: 'MATERIAL STUDY / REFRACTION',
    title: 'LIGHT BECOMES',
    italic: 'material.',
    body: 'An interactive study in transparency, chromatic edges and weightless form.',
    meta: ['REAL-TIME 3D', 'POINTER REACTIVE', 'SPATIAL'],
    url: 'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode',
    tone: 'ink',
    side: 'left',
  },
  {
    index: '02',
    eyebrow: 'INTELLIGENT OBJECT / SYSTEM',
    title: 'COMPLEXITY,',
    italic: 'made legible.',
    body: 'A spatial interface language for agents, tools and the decisions between them.',
    meta: ['AI SYSTEMS', 'INTERACTION', 'PROTOTYPE'],
    url: 'https://prod.spline.design/HqdfCmOueigtautT/scene.splinecode',
    tone: 'ivory',
    side: 'right',
  },
  {
    index: '03',
    eyebrow: 'SIGNAL STUDY / COMPUTATION',
    title: 'A MACHINE WITH',
    italic: 'presence.',
    body: 'Motion and form reveal system state without turning the interface into a dashboard.',
    meta: ['GENERATIVE', 'MOTION SYSTEM', 'WEBGL'],
    url: 'https://prod.spline.design/3L7ADylHDDQ2VzfA/scene.splinecode',
    tone: 'blue',
    side: 'left',
  },
];

const LazyScene: React.FC<{ url: string; active: boolean }> = ({ url, active }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!active) setLoaded(false);
  }, [active]);

  return (
    <div className="chapter-spline">
      {active && !loaded && <div className="scene-loader"><span /><small>LOADING SPATIAL SCENE</small></div>}
      {active && (
        <Suspense fallback={null}>
          <Spline
            scene={url}
            renderOnDemand
            onLoad={() => setLoaded(true)}
            className={loaded ? 'scene-is-loaded' : 'scene-is-loading'}
          />
        </Suspense>
      )}
    </div>
  );
};

const SplineChapter: React.FC<{ scene: Scene }> = ({ scene }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { rootMargin: '35% 0px' });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let raf = 0;

    const update = () => {
      const rect = section.getBoundingClientRect();
      const viewport = window.innerHeight;
      const raw = (viewport - rect.top) / (viewport + rect.height);
      const progress = Math.max(0, Math.min(1, raw));
      const centered = Math.max(0, 1 - Math.abs(progress - 0.5) * 2);
      const direction = scene.side === 'left' ? -1 : 1;
      section.style.setProperty('--chapter-progress', progress.toFixed(4));
      section.style.setProperty('--chapter-focus', centered.toFixed(4));
      section.style.setProperty('--chapter-card-shift', `${(0.5 - progress) * direction * 220}px`);
      section.style.setProperty('--chapter-stage-shift', `${(progress - 0.5) * direction * 90}px`);
      section.style.setProperty('--chapter-scale', `${0.965 + centered * 0.035}`);
      raf = 0;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    event.currentTarget.style.setProperty('--pointer-x', `${x * 9}px`);
    event.currentTarget.style.setProperty('--pointer-y', `${y * 7}px`);
  };

  const resetPointer = (event: React.PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--pointer-x', '0px');
    event.currentTarget.style.setProperty('--pointer-y', '0px');
  };

  return (
    <section
      ref={sectionRef}
      className={`spline-chapter chapter-${scene.tone} chapter-${scene.side}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <div className="chapter-sticky">
        <div className="chapter-stage">
          <LazyScene url={scene.url} active={active} />
          <div className="chapter-grid" aria-hidden="true" />
          <span className="chapter-coordinate coordinate-top">{scene.index} / 03</span>
          <span className="chapter-coordinate coordinate-bottom">MOVE / SCROLL / EXPLORE</span>
        </div>

        <article className="chapter-card" onMouseEnter={() => soundManager.playHoverBlip()}>
          <div className="chapter-card-top"><span>{scene.index}</span><span>{scene.eyebrow}</span></div>
          <h2>{scene.title}<br /><em>{scene.italic}</em></h2>
          <p>{scene.body}</p>
          <div className="chapter-meta">
            {scene.meta.map((item) => <span key={item}>{item}</span>)}
          </div>
        </article>
      </div>
    </section>
  );
};

export const PortfolioSections: React.FC = () => (
  <main id="work" className="immersive-story">
    <header className="story-prologue">
      <span className="section-kicker">SELECTED INTERACTIVE WORK / 2026</span>
      <p>THREE STUDIES.<br /><em>THREE DISTINCT WORLDS.</em></p>
      <span className="prologue-hint">SCROLL TO ENTER ↓</span>
    </header>
    {scenes.map((scene) => <SplineChapter scene={scene} key={scene.index} />)}
  </main>
);
