import React, { useState } from 'react';
import { soundManager } from '../utils/audio';

export const BlogGrid: React.FC = () => {
  const [fontWeight, setFontWeight] = useState(700);

  return (
    <section className="grid-section">
      <div className="section-header">
        <div>
          <span className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            SELECTED WORKS & BLOG POSTS
          </span>
          <h2 className="section-title">ENGINEERING & CRAFT</h2>
        </div>
        <span className="font-mono" style={{ fontSize: '0.9rem', color: 'var(--text-mono)' }}>
          [06 PROJECTS]
        </span>
      </div>

      <div className="cards-grid">
        {/* Card 1: Inspire Mono Typeface */}
        <article
          className="project-card"
          onMouseEnter={() => soundManager.playHoverBlip()}
          onClick={() => soundManager.playClickTone()}
        >
          <div className="card-tags">
            <span className="tag-badge tag-accent">TYPE EXPERIMENT</span>
            <span className="font-mono" style={{ fontSize: '0.75rem' }}>2026</span>
          </div>

          <div
            className="card-visual-box visual-inspire"
            onMouseMove={(e) => {
              const weight = 300 + Math.floor((e.clientX % 100) / 100 * 600);
              setFontWeight(weight);
            }}
          >
            <span style={{ fontWeight }}>Inspire Mono</span>
            <small>WEIGHT: {fontWeight} | 1.00 FPS</small>
          </div>

          <div>
            <h3 className="card-title">INSPIRE MONO</h3>
            <p className="card-desc">Open-source engineered monospace typeface tailored for code readability and matrix alignment.</p>
          </div>

          <div className="card-footer">
            <span>2026 CODING PROJECT</span>
            <span className="card-arrow">↗</span>
          </div>
        </article>

        {/* Card 2: WASM DESIGN UTILS */}
        <article
          className="project-card"
          onMouseEnter={() => soundManager.playHoverBlip()}
          onClick={() => soundManager.playClickTone()}
        >
          <div className="card-tags">
            <span className="tag-badge">CODE / UTILS</span>
            <span className="font-mono" style={{ fontSize: '0.75rem' }}>2025</span>
          </div>

          <div className="card-visual-box">
            <div className="visual-wasm">
              <code>$ npm i @mutsumiwakaba/wasm_design_utils</code>
              <div style={{ color: '#888', marginTop: '6px', fontSize: '0.7rem' }}>
                ✓ WASM SIMD Accelerated [0.4ms]
              </div>
            </div>
          </div>

          <div>
            <h3 className="card-title">WASM DESIGN UTILS</h3>
            <p className="card-desc">High performance Rust/WebAssembly module for real-time SVG pathing and image processing.</p>
          </div>

          <div className="card-footer">
            <span>2025 TOOLS</span>
            <span className="card-arrow">↗</span>
          </div>
        </article>

        {/* Card 3: VECTOR SYMBOLS */}
        <article
          className="project-card"
          onMouseEnter={() => soundManager.playHoverBlip()}
          onClick={() => soundManager.playClickTone()}
        >
          <div className="card-tags">
            <span className="tag-badge tag-accent">ICON SYSTEM</span>
            <span className="font-mono" style={{ fontSize: '0.75rem' }}>2023</span>
          </div>

          <div className="card-visual-box">
            <div className="visual-icons-grid">
              {['⌂', '◎', '◌', '♧', '⌕', '◇', '⌁', '♫', '⌘', '↳', '⚡', '✦'].map((icon, i) => (
                <div key={i} className="icon-cell" onMouseEnter={() => soundManager.playHoverBlip()}>
                  {icon}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="card-title">VECTOR SYMBOLS</h3>
            <p className="card-desc">4x4 Matrix grid of interactive vector UI glyphs for brutalist user interfaces.</p>
          </div>

          <div className="card-footer">
            <span>2023 TOOLS</span>
            <span className="card-arrow">↗</span>
          </div>
        </article>

        {/* Card 4: Neural Canvas AI */}
        <article
          className="project-card"
          onMouseEnter={() => soundManager.playHoverBlip()}
          onClick={() => soundManager.playClickTone()}
        >
          <div className="card-tags">
            <span className="tag-badge tag-accent">AI RESEARCH</span>
            <span className="font-mono" style={{ fontSize: '0.75rem' }}>2026</span>
          </div>

          <div className="card-visual-box" style={{ background: '#09090D', color: '#00F0FF' }}>
            <div className="font-mono" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>NEURAL CANVAS</div>
              <div style={{ fontSize: '0.7rem', color: '#A3FF12', marginTop: '4px' }}>AUTONOMOUS AGENT PIPELINE</div>
            </div>
          </div>

          <div>
            <h3 className="card-title">NEURAL CANVAS ENGINE</h3>
            <p className="card-desc">Generative AI visual workspace with real-time WebGL canvas shaders and LLM vector nodes.</p>
          </div>

          <div className="card-footer">
            <span>2026 AI AGENT</span>
            <span className="card-arrow">↗</span>
          </div>
        </article>

        {/* Card 5: Mobile iOS Widget Mockup */}
        <article
          className="project-card"
          onMouseEnter={() => soundManager.playHoverBlip()}
          onClick={() => soundManager.playClickTone()}
        >
          <div className="card-tags">
            <span className="tag-badge">MOBILE UI</span>
            <span className="font-mono" style={{ fontSize: '0.75rem' }}>2022</span>
          </div>

          <div className="card-visual-box">
            <div className="visual-mobile-ui">
              <div>
                <strong>9:41</strong>
                <div style={{ color: '#A3FF12', fontSize: '0.55rem' }}>TUE JUL 20</div>
              </div>
              <div style={{ background: '#222', padding: '4px', borderRadius: '6px' }}>
                <div>阿里云 App Widget</div>
                <div style={{ color: '#888' }}>Cloud Engine Active</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="card-title">ADIVE 阿里云 MOBILE</h3>
            <p className="card-desc">Cloud infrastructure monitoring iOS widgets & design system component library.</p>
          </div>

          <div className="card-footer">
            <span>2020–2022</span>
            <span className="card-arrow">↗</span>
          </div>
        </article>

        {/* Card 6: FOF SEE HEAR TOUCH */}
        <article
          className="project-card"
          onMouseEnter={() => soundManager.playHoverBlip()}
          onClick={() => soundManager.playClickTone()}
        >
          <div className="card-tags">
            <span className="tag-badge">EVENT / EXHIBITION</span>
            <span className="font-mono" style={{ fontSize: '0.75rem' }}>2022</span>
          </div>

          <div className="card-visual-box" style={{ background: '#FF2E93', color: '#FFF' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.3rem', textTransform: 'uppercase' }}>
              SEE HEAR TOUCH
            </div>
          </div>

          <div>
            <h3 className="card-title">FOF: SEE HEAR TOUCH</h3>
            <p className="card-desc">Interactive multisensory exhibition design and generative sound installation.</p>
          </div>

          <div className="card-footer">
            <span>2022 EVENT</span>
            <span className="card-arrow">↗</span>
          </div>
        </article>
      </div>
    </section>
  );
};
