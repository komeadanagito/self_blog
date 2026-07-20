import React, { useEffect, useRef } from 'react';
import { AmbientShader } from './AmbientShader';
import { FlowFieldCanvas } from './FlowFieldCanvas';

const useScrollProgress = (ref: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let frame = 0;
    const update = () => {
      const rect = element.getBoundingClientRect();
      const travel = Math.max(1, rect.height - window.innerHeight);
      const progress = Math.max(0, Math.min(1, -rect.top / travel));
      element.style.setProperty('--lab-progress', progress.toFixed(4));
      element.style.setProperty('--lab-shift', `${(progress - 0.5) * 38}vw`);
      element.style.setProperty('--lab-shift-reverse', `${(0.5 - progress) * 42}vw`);
      frame = 0;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ref]);
};

const ShaderLab: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  useScrollProgress(ref);
  return (
    <section ref={ref} className="experiment-page shader-page">
      <div className="experiment-sticky">
        <AmbientShader className="shader-page-canvas" />
        <div className="shader-noise" />
        <div className="experiment-counter">04 / 06 · CUSTOM GLSL</div>
        <h2 className="shader-page-title"><span>COLOR IS</span><em>A MATERIAL.</em></h2>
        <div className="shader-glass-card">
          <span>LIVE MATERIAL STUDY</span>
          <p>No video. No embed. Every pixel is calculated in real time and reacts to your pointer.</p>
          <div><i /> MOVE TO DISTORT</div>
        </div>
      </div>
    </section>
  );
};

const KineticType: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  useScrollProgress(ref);

  const tilt = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    event.currentTarget.style.setProperty('--tilt-x', `${y * -10}deg`);
    event.currentTarget.style.setProperty('--tilt-y', `${x * 12}deg`);
  };
  const reset = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty('--tilt-x', '0deg');
    event.currentTarget.style.setProperty('--tilt-y', '0deg');
  };

  return (
    <section ref={ref} className="experiment-page kinetic-page">
      <div className="experiment-sticky">
        <div className="kinetic-ribbon ribbon-one">TYPE IN MOTION · TYPE IN MOTION · TYPE IN MOTION ·</div>
        <div className="kinetic-ribbon ribbon-two">SCROLL BOTH WAYS · SCROLL BOTH WAYS · SCROLL BOTH WAYS ·</div>
        <div className="kinetic-stage">
          <div className="kinetic-intro"><span>05 / 06 · KINETIC SYSTEM</span><h2>WORDS<br />WITH<br /><em>WEIGHT.</em></h2></div>
          <div className="kinetic-card card-alpha" onPointerMove={tilt} onPointerLeave={reset}><b>Aa</b><span>VARIABLE FORM<br />01—09</span></div>
          <div className="kinetic-card card-symbol" onPointerMove={tilt} onPointerLeave={reset}><b>↗</b><span>DIRECTION<br />IS CONTENT</span></div>
          <div className="kinetic-card card-index" onPointerMove={tilt} onPointerLeave={reset}><b>64</b><span>FRAMES<br />PER SECOND</span></div>
        </div>
      </div>
    </section>
  );
};

const SignalNetwork: React.FC = () => (
  <section className="signal-page">
    <FlowFieldCanvas />
    <div className="signal-grid" />
    <div className="signal-copy">
      <span>06 / 06 · BEHAVIORAL CANVAS</span>
      <h2>TOUCH THE<br /><em>NETWORK.</em></h2>
      <p>Each node has memory. Move through the field to disturb it; leave and the system finds its structure again.</p>
    </div>
    <div className="signal-status"><i /> LIVE PHYSICS · POINTER REPULSION</div>
  </section>
);

export const ExperimentalSections: React.FC = () => (
  <div className="experimental-sections">
    <header className="lab-interlude"><span>BEYOND SPLINE / CODED IN-HOUSE</span><h2>THE BROWSER<br />IS THE <em>MEDIUM.</em></h2></header>
    <ShaderLab />
    <KineticType />
    <SignalNetwork />
  </div>
);
