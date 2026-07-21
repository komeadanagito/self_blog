import React, { Suspense, useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import { soundManager } from '../utils/audio';

const Spline = React.lazy(() => import('@splinetool/react-spline'));

/** Liquid glass master — atmosphere under the editorial UI */
const SPLINE_BG = 'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode';

/** 7-stage stack: Transformer → … → OpenClaw / Harness */
const phases = [
  { id: 1, year: '2017', tone: 'ink', accent: '#a3ff12', hue: 0 },
  { id: 2, year: '2020', tone: 'ivory', accent: '#1747ff', hue: 200 },
  { id: 3, year: '2021', tone: 'ink', accent: '#00f0ff', hue: 170 },
  { id: 4, year: '2023', tone: 'teal', accent: '#00e8d2', hue: 155 },
  { id: 5, year: '2024', tone: 'ink', accent: '#ff5a36', hue: 320 },
  { id: 6, year: '2025', tone: 'ivory', accent: '#1747ff', hue: 220 },
  { id: 7, year: '2026', tone: 'lime', accent: '#0a0b0d', hue: 80 },
] as const;

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

/** Lightweight particle field — WebGL-adjacent energy without a second heavy runtime */
const EvolutionField: React.FC<{ active: boolean; accent: string; boost: number }> = ({ active, accent, boost }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const count = 48;
    const particles = Array.from({ length: count }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      z: Math.random(),
      s: 0.4 + Math.random() * 1.8,
      vx: (Math.random() - 0.5) * 0.00045,
      vy: (Math.random() - 0.5) * 0.00035,
      phase: Math.random() * Math.PI * 2,
      seed: i,
    }));

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const energy = 0.55 + boost * 0.9;
      // soft accent wash
      const g = ctx.createRadialGradient(w * 0.72, h * 0.45, 0, w * 0.72, h * 0.45, w * 0.42);
      g.addColorStop(0, `${accent}33`);
      g.addColorStop(0.45, `${accent}10`);
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx * energy;
        p.y += p.vy * energy + Math.sin(t * 0.001 + p.phase) * 0.00012 * energy;
        if (p.x < -0.05) p.x = 1.05;
        if (p.x > 1.05) p.x = -0.05;
        if (p.y < -0.05) p.y = 1.05;
        if (p.y > 1.05) p.y = -0.05;

        const px = p.x * w;
        const py = p.y * h;
        const r = p.s * (1.2 + p.z * 2.2) * (1 + boost * 0.8);
        const a = (0.18 + p.z * 0.55) * (0.65 + boost * 0.7);
        ctx.beginPath();
        ctx.fillStyle = accent.length === 7
          ? `${accent}${Math.round(a * 255).toString(16).padStart(2, '0')}`
          : accent;
        ctx.globalAlpha = a;
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();

        // streak when jumping
        if (boost > 0.2) {
          ctx.beginPath();
          ctx.strokeStyle = accent;
          ctx.globalAlpha = a * 0.45;
          ctx.lineWidth = 1;
          ctx.moveTo(px, py);
          ctx.lineTo(px - boost * 28 * (p.seed % 2 ? 1 : -1), py + boost * 18);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;

      // orbit rings
      ctx.save();
      ctx.translate(w * 0.72, h * 0.48);
      ctx.rotate(t * 0.00015 * (1 + boost));
      for (let i = 0; i < 3; i += 1) {
        const radius = 70 + i * 48 + boost * 20;
        ctx.beginPath();
        ctx.strokeStyle = accent;
        ctx.globalAlpha = 0.08 + i * 0.04 + boost * 0.12;
        ctx.lineWidth = 1 + boost;
        ctx.setLineDash(i === 1 ? [6, 10] : []);
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [active, accent, boost]);

  return <canvas ref={canvasRef} className="evo-field-canvas" aria-hidden="true" />;
};

const DiagramInfra: React.FC = () => (
  <div className="ed-board ed-infra">
    <div className="ed-blocks">
      <article style={{ '--d': 0 } as React.CSSProperties}><b>Encoder</b><span>Self-Attn · FFN · N×</span></article>
      <div className="ed-link" aria-hidden="true" />
      <article className="is-hot" style={{ '--d': 1 } as React.CSSProperties}><b>Multi-Head</b><span>Attention(Q,K,V)</span></article>
      <div className="ed-link" aria-hidden="true" />
      <article style={{ '--d': 2 } as React.CSSProperties}><b>Decoder</b><span>Masked · Cross · FFN</span></article>
    </div>
    <code>softmax(QKᵀ / √d) · V</code>
  </div>
);

const DiagramPrompt: React.FC = () => (
  <div className="ed-board ed-prompt">
    {[
      ['SYS', 'You are a careful assistant.', 'is-sys'],
      ['FS·1', 'Example Q → A', ''],
      ['FS·2', 'Example Q → A', ''],
      ['USER', 'Live query…', 'is-user'],
      ['OUT', 'Next-token stream →', 'is-out'],
    ].map(([b, p, cls], i) => (
      <div key={b} className={`ed-chatline ${cls}`} style={{ '--d': i } as React.CSSProperties}>
        <b>{b}</b><p>{p}</p>
      </div>
    ))}
  </div>
);

const DiagramKnowledge: React.FC = () => {
  const { t } = useI18n();
  const [mode, setMode] = useState<'ft' | 'rag'>('rag');
  return (
    <div className={`ed-board ed-know mode-${mode}`}>
      <div className="ed-tabs">
        <button type="button" className={mode === 'ft' ? 'on' : ''} onClick={() => setMode('ft')}>{t('timeline.3.ft')}</button>
        <button type="button" className={mode === 'rag' ? 'on' : ''} onClick={() => setMode('rag')}>{t('timeline.3.rag')}</button>
      </div>
      <div className="ed-flowline" key={mode}>
        {mode === 'ft' ? (
          <><span>Base</span><em>→</em><span className="hot">LoRA ΔW</span><em>→</em><span>Adapted</span></>
        ) : (
          <><span>Query</span><em>→</em><span className="hot">Retrieve</span><em>→</em><span>Gen</span></>
        )}
      </div>
      <div className="ed-stats">
        <div><small>{t('timeline.3.weights')}</small><b>{mode === 'ft' ? 'YES' : 'NO'}</b></div>
        <div><small>{t('timeline.3.live')}</small><b>{mode === 'rag' ? 'HIGH' : 'FIXED'}</b></div>
        <div><small>{t('timeline.3.cost')}</small><b>{mode === 'ft' ? 'HIGH' : 'LOW'}</b></div>
      </div>
    </div>
  );
};

const DiagramAction: React.FC = () => (
  <div className="ed-board ed-action">
    <div className="ed-stack-steps">
      <div style={{ '--d': 0 } as React.CSSProperties}><b>01</b><div><strong>Function Calling</strong><span>JSON Schema → invoke</span></div></div>
      <div className="is-hot" style={{ '--d': 1 } as React.CSSProperties}><b>02</b><div><strong>MCP</strong><span>Universal tool protocol</span></div></div>
    </div>
    <div className="ed-ports">
      {['GitHub', 'DB', 'Browser', 'Files', 'API'].map((p, i) => (
        <span key={p} style={{ '--d': i } as React.CSSProperties}>{p}</span>
      ))}
    </div>
  </div>
);

const DiagramAgent: React.FC = () => {
  const { t } = useI18n();
  const [mode, setMode] = useState<'single' | 'multi'>('single');
  return (
    <div className={`ed-board ed-agent mode-${mode}`}>
      <div className="ed-tabs">
        <button type="button" className={mode === 'single' ? 'on' : ''} onClick={() => setMode('single')}>{t('timeline.5.single')}</button>
        <button type="button" className={mode === 'multi' ? 'on' : ''} onClick={() => setMode('multi')}>{t('timeline.5.multi')}</button>
      </div>
      <div className="ed-react">
        <i>THINK</i><span>→</span><i>ACT</i><span>→</span><i>OBSERVE</i><span>↻</span>
      </div>
      <div className="ed-agents" key={mode}>
        {mode === 'single'
          ? <div className="solo">AGENT</div>
          : ['Planner', 'Coder', 'Critic', 'Runner'].map((a, i) => (
            <div key={a} style={{ '--d': i } as React.CSSProperties}>{a}</div>
          ))}
      </div>
    </div>
  );
};

const DiagramContext: React.FC = () => {
  const { t } = useI18n();
  const [mode, setMode] = useState<'write' | 'select' | 'compress' | 'skill'>('skill');
  const usage = { write: 82, select: 44, compress: 28, skill: 36 }[mode];
  return (
    <div className={`ed-board ed-ctx mode-${mode}`}>
      <div className="ed-tabs ed-tabs-wide">
        {(['write', 'select', 'compress', 'skill'] as const).map((m) => (
          <button key={m} type="button" className={mode === m ? 'on' : ''} onClick={() => setMode(m)}>{t(`timeline.6.${m}`)}</button>
        ))}
      </div>
      <div className="ed-meter">
        <span>{t('timeline.6.capacity')}</span>
        <b>{usage}%</b>
        <div><i style={{ width: `${usage}%` }} /></div>
      </div>
      <div className="ed-files">
        {['conversation.log', 'architecture.md', 'SKILL.md', 'scripts/', 'refs/', 'noise.tmp'].map((f, i) => (
          <div
            key={f}
            className={f === 'SKILL.md' ? 'skill' : f.includes('noise') ? 'noise' : ''}
            style={{ '--d': i } as React.CSSProperties}
          >
            <strong>{f}</strong>
          </div>
        ))}
      </div>
    </div>
  );
};

const DiagramHarness: React.FC = () => {
  const { t } = useI18n();
  return (
    <div className="ed-board ed-harness">
      <div className="ed-split">
        <article>
          <header>OpenClaw</header>
          <p>{t('timeline.7.openclawBody')}</p>
        </article>
        <article className="is-hot">
          <header>Harness</header>
          <ul>
            {['BUILD', 'TYPECHECK', 'UNIT 128/128', 'POLICY', 'REGRESSION'].map((x, i) => (
              <li key={x} style={{ '--i': i } as React.CSSProperties}><span>{x}</span><b>{t('timeline.7.pass')}</b></li>
            ))}
          </ul>
        </article>
      </div>
      <div className="ed-pillrow">
        <span>{t('timeline.7.guide')}</span>
        <span>{t('timeline.7.context')}</span>
        <span>{t('timeline.7.verify')}</span>
        <span>{t('timeline.7.feedback')}</span>
      </div>
    </div>
  );
};

const diagrams = [DiagramInfra, DiagramPrompt, DiagramKnowledge, DiagramAction, DiagramAgent, DiagramContext, DiagramHarness] as const;

export const PortfolioSections: React.FC = () => {
  const { t, language } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const activeRef = useRef(0);
  const jumpTimer = useRef(0);
  const boostRef = useRef(0);
  const [activePhase, setActivePhase] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [jumping, setJumping] = useState(false);
  const [jumpDir, setJumpDir] = useState<1 | -1>(1);
  const [inView, setInView] = useState(false);
  const [mounted3d, setMounted3d] = useState(false);
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [fxBoost, setFxBoost] = useState(0);

  useEffect(() => {
    if (inView) setMounted3d(true);
  }, [inView]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let frame = 0;
    let visible = false;
    let boostRaf = 0;

    const decayBoost = () => {
      boostRef.current *= 0.9;
      if (boostRef.current < 0.02) {
        boostRef.current = 0;
        setFxBoost(0);
        return;
      }
      setFxBoost(boostRef.current);
      boostRaf = requestAnimationFrame(decayBoost);
    };

    const update = () => {
      const rect = section.getBoundingClientRect();
      const travel = Math.max(1, rect.height - window.innerHeight);
      const progress = clamp01(-rect.top / travel);
      const phaseFloat = progress * (phases.length - 1);
      const next = Math.min(phases.length - 1, Math.max(0, Math.round(phaseFloat)));
      const local = phaseFloat - Math.floor(phaseFloat + 1e-6);
      const p = phases[next];

      // Continuous scrub energy between jumps
      const settle = 1 - Math.abs(phaseFloat - next) * 2; // 1 at center, 0 at edges
      section.style.setProperty('--evo-progress', progress.toFixed(5));
      section.style.setProperty('--evo-phase', phaseFloat.toFixed(5));
      section.style.setProperty('--evo-local', clamp01(local).toFixed(5));
      section.style.setProperty('--evo-settle', clamp01(settle).toFixed(5));
      section.style.setProperty('--evo-accent', p.accent);
      section.style.setProperty('--evo-hue', String(p.hue));
      section.style.setProperty('--evo-paray', `${((progress - 0.5) * 36).toFixed(2)}px`);
      section.style.setProperty('--evo-tilt', `${((0.5 - (phaseFloat - next + 0.5)) * 8).toFixed(2)}deg`);
      section.style.setProperty('--evo-boost', boostRef.current.toFixed(3));
      section.dataset.tone = p.tone;
      section.dataset.step = String(p.id);

      if (next !== activeRef.current) {
        const dir: 1 | -1 = next > activeRef.current ? 1 : -1;
        setJumpDir(dir);
        section.dataset.jump = dir > 0 ? 'down' : 'up';
        activeRef.current = next;
        setActivePhase(next);
        setAnimKey((k) => k + 1);
        setJumping(true);
        boostRef.current = 1;
        setFxBoost(1);
        cancelAnimationFrame(boostRaf);
        boostRaf = requestAnimationFrame(decayBoost);
        soundManager.playClickTone();
        window.clearTimeout(jumpTimer.current);
        jumpTimer.current = window.setTimeout(() => {
          setJumping(false);
          section.dataset.jump = '';
        }, 720);
      }
      frame = 0;
    };

    const onScroll = () => {
      if (visible && !frame) frame = requestAnimationFrame(update);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      setInView(visible);
      section.classList.toggle('is-in-view', visible);
      if (visible) update();
    }, { rootMargin: '12% 0px' });

    io.observe(section);
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      cancelAnimationFrame(boostRaf);
      window.clearTimeout(jumpTimer.current);
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const jumpTo = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const top = section.getBoundingClientRect().top + window.scrollY;
    const travel = section.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (index / (phases.length - 1)) * travel, behavior: 'smooth' });
  };

  const phase = phases[activePhase];
  const id = phase.id;
  const Diagram = diagrams[activePhase];
  const chain = (t(`timeline.${id}.chain`) || '').split(' → ').filter(Boolean);

  return (
    <main id="ai-evolution" className="ai-evolution evo-root">
      <section
        className={`evo-scroll ${jumping ? 'is-jumping' : ''}`}
        ref={sectionRef}
        data-tone={phase.tone}
        data-step={String(id)}
        data-dir={jumpDir > 0 ? 'down' : 'up'}
      >
        <div className="evo-sticky">
          {/* 3D / field atmosphere (under UI) */}
          <div className="evo-fx-root" aria-hidden="true">
            <div
              className={`evo-spline-bg ${splineLoaded ? 'is-ready' : ''}`}
              style={{ filter: `hue-rotate(${phase.hue}deg) saturate(1.15) brightness(1.05)` }}
            >
              {mounted3d && (
                <Suspense fallback={null}>
                  <Spline
                    scene={SPLINE_BG}
                    renderOnDemand
                    onLoad={() => setSplineLoaded(true)}
                  />
                </Suspense>
              )}
            </div>
            <EvolutionField active={inView && mounted3d} accent={phase.accent} boost={fxBoost} />
            <div className="evo-scanlines" />
            <div className="evo-noise" />
            <div className="evo-vignette" />
            <div className="evo-burst" />
          </div>

          <div className="evo-grid" aria-hidden="true" />
          <div className="evo-glow" aria-hidden="true" />
          <div className="evo-slash" aria-hidden="true" />
          <div className="evo-rgb" aria-hidden="true" />
          <div className="evo-jump-flash" aria-hidden="true" />
          <div className="evo-giant" aria-hidden="true" key={`g-${animKey}`}>0{id}</div>

          <div className="evo-topbar">
            <span>{t('timeline.kicker')}</span>
            <span className="evo-top-mid">
              <i />
              {String(id).padStart(2, '0')} / 07 · {phase.year}
            </span>
            <span>{t('timeline.scroll')}</span>
          </div>

          {/* Built stack chips — progressive depth */}
          <div className="evo-built" aria-hidden="true">
            {phases.slice(0, activePhase + 1).map((p, i) => (
              <span
                key={p.id}
                className={i === activePhase ? 'is-now' : ''}
                style={{ '--d': i, '--ra': p.accent } as React.CSSProperties}
              >
                {t(`timeline.${p.id}.short`)}
              </span>
            ))}
          </div>

          <div className="evo-main" key={`${animKey}-${language}`} data-dir={jumpDir > 0 ? 'down' : 'up'}>
            <div className="evo-copy">
              <span className="evo-layer" style={{ '--d': 0 } as React.CSSProperties}>{t(`timeline.${id}.layer`)}</span>
              <h2 style={{ '--d': 1 } as React.CSSProperties}>
                {t(`timeline.${id}.title`)}
                <br />
                <em>{t(`timeline.${id}.accent`)}</em>
              </h2>
              <p style={{ '--d': 2 } as React.CSSProperties}>{t(`timeline.${id}.body`)}</p>

              {chain.length > 0 && (
                <div className="evo-chain" style={{ '--d': 3 } as React.CSSProperties}>
                  {chain.map((node, i) => (
                    <React.Fragment key={`${node}-${i}`}>
                      <span style={{ '--ci': i } as React.CSSProperties}>{node}</span>
                      {i < chain.length - 1 && <i>↓</i>}
                    </React.Fragment>
                  ))}
                </div>
              )}

              <dl className="evo-facts" style={{ '--d': 4 } as React.CSSProperties}>
                <div>
                  <dt>{t('timeline.shift')}</dt>
                  <dd>{t(`timeline.${id}.shift`)}</dd>
                </div>
                <div>
                  <dt>{t('timeline.solution')}</dt>
                  <dd>{t(`timeline.${id}.solution`)}</dd>
                </div>
                <div>
                  <dt>{t('timeline.mechanism')}</dt>
                  <dd>{t(`timeline.${id}.mechanism`)}</dd>
                </div>
                <div className="is-limit">
                  <dt>{t('timeline.limit')}</dt>
                  <dd>{t(`timeline.${id}.limit`)}</dd>
                </div>
              </dl>
            </div>

            <div className="evo-stage" style={{ '--d': 2 } as React.CSSProperties}>
              <div className="evo-stage-frame">
                <div className="evo-stage-corner" aria-hidden="true" />
                <Diagram />
              </div>
              <div className="evo-stage-meta">
                <span>{t(`timeline.${id}.short`)}</span>
                <span className="evo-live-dot">LIVE</span>
                <span>{String(id).padStart(2, '0')} / 07</span>
              </div>
            </div>
          </div>

          <nav className="evo-rail" aria-label="AI stack">
            <div className="evo-rail-fill" aria-hidden="true" />
            {phases.map((p, index) => (
              <button
                key={p.id}
                type="button"
                className={index === activePhase ? 'is-on' : index < activePhase ? 'is-past' : ''}
                style={{ '--ra': p.accent } as React.CSSProperties}
                onClick={() => {
                  soundManager.playClickTone();
                  jumpTo(index);
                }}
                onMouseEnter={() => soundManager.playHoverBlip()}
              >
                <b>0{p.id}</b>
                <strong>{t(`timeline.${p.id}.short`)}</strong>
                <small>{t(`timeline.${p.id}.layer`)}</small>
              </button>
            ))}
          </nav>
        </div>
      </section>
    </main>
  );
};
