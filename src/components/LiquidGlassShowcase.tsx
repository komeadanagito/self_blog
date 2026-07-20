import React, { useState } from 'react';
import { SplineWebComponent } from './SplineWebComponent';
import { soundManager } from '../utils/audio';

export const LiquidGlassShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'liquid' | 'autolayout' | 'video'>('liquid');

  return (
    <section
      className="liquid-glass-section"
      style={{
        padding: '5.5rem 1.75rem',
        background: 'var(--bg-dark)',
        color: '#fff',
        borderTop: '1px solid var(--border-dark)',
        borderBottom: '1px solid var(--border-dark)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient Glass Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(0, 240, 255, 0.15) 0%, rgba(255, 46, 147, 0.12) 50%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        {/* Section Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <span className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--accent)', letterSpacing: '0.1em', display: 'block', marginBottom: '0.8rem' }}>
              ✦ ADVANCED SHADER &amp; AI INTERACTION / 高级感 3D 玻璃美学
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem, 4.5vw, 4rem)', fontWeight: 900, lineHeight: 1.05 }}>
              LIQUID GLASS &amp;<br />
              <span style={{ color: 'var(--accent)' }}>AI NEURAL LAYOUT</span>
            </h2>
          </div>

          {/* Interactive Feature Tabs */}
          <div className="font-mono" style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.06)', padding: '6px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.12)' }}>
            {(['liquid', 'autolayout', 'video'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  soundManager.playClickTone();
                  setActiveTab(tab);
                }}
                onMouseEnter={() => soundManager.playHoverBlip()}
                style={{
                  background: activeTab === tab ? 'var(--accent)' : 'transparent',
                  color: activeTab === tab ? '#000' : 'rgba(255,255,255,0.7)',
                  border: 'none',
                  padding: '8px 18px',
                  borderRadius: '100px',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  transition: 'all 0.2s ease',
                }}
              >
                {tab === 'liquid' ? '✦ Liquid Glass' : tab === 'autolayout' ? '⌗ Neural Layout' : '▶ Media Shader'}
              </button>
            ))}
          </div>
        </div>

        {/* Feature Grid with Stackable 3D Glass Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.75rem',
            alignItems: 'stretch',
          }}
        >
          {/* Glass Card 1: 3D Liquid Sphere & Refraction */}
          <div
            className="premium-glass-panel"
            style={{
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '380px',
            }}
          >
            <div style={{ height: '220px', borderRadius: '12px', overflow: 'hidden', background: 'rgba(0,0,0,0.4)', position: 'relative' }}>
              <SplineWebComponent url="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" />
            </div>
            <div style={{ marginTop: '1.2rem' }}>
              <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)' }}>GLASS MATERIAL SYSTEM</span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0.4rem 0' }}>Refractive Dispersion Shaders</h3>
              <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                Stackable Liquid Glass with dynamic physical refraction, internal thickness, and chromatic caustics.
              </p>
            </div>
          </div>

          {/* Glass Card 2: 3D Neural AutoLayout Stack */}
          <div
            className="premium-glass-panel"
            style={{
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '380px',
            }}
          >
            <div
              style={{
                height: '220px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(0,240,255,0.1), rgba(255,46,147,0.1))',
                border: '1px solid rgba(255,255,255,0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                padding: '12px',
                justifyContent: 'center',
              }}
            >
              {[1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.18)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.78rem',
                    transform: `translateY(${idx * 2}px)`,
                  }}
                  className="font-mono"
                >
                  <span>NEURAL AGENT PIPELINE 0{idx}</span>
                  <span style={{ color: 'var(--accent)' }}>FLEX SPATIAL</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '1.2rem' }}>
              <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--accent-gold)' }}>RESPONSIVE SPATIAL ENGINE</span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0.4rem 0' }}>3D Neural AutoLayout</h3>
              <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                Automatic 3D flexbox wrapping and spatial alignment inside procedural GPU viewports.
              </p>
            </div>
          </div>

          {/* Glass Card 3: Embedded Media Layer */}
          <div
            className="premium-glass-panel"
            style={{
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '380px',
            }}
          >
            <div style={{ height: '220px', borderRadius: '12px', overflow: 'hidden', background: '#000', position: 'relative' }}>
              <video
                src="https://framerusercontent.com/assets/PPnR8AmcnZQeBj03vHtISIKTs.png"
                poster="https://framerusercontent.com/assets/PPnR8AmcnZQeBj03vHtISIKTs.png"
                autoPlay
                loop
                muted
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '12px',
                }}
              >
                <span className="font-mono" style={{ fontSize: '0.72rem', color: '#fff' }}>▶ LIVE AI SHADER STREAM</span>
              </div>
            </div>
            <div style={{ marginTop: '1.2rem' }}>
              <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--accent-pink)' }}>DYNAMIC MEDIA PIPELINE</span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0.4rem 0' }}>Real-time Glass Video Layers</h3>
              <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                Seamless integration of video media maps mapped directly onto curved 3D glass surfaces.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
