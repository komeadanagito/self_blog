import React from 'react';
import { SplineWebComponent } from './SplineWebComponent';

interface ThreeDeviceShowcaseProps {
  sceneUrl?: string;
  title?: string;
  subtitle?: string;
}

export const ThreeDeviceShowcase: React.FC<ThreeDeviceShowcaseProps> = ({
  sceneUrl = 'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode',
  title = 'AI MOBILE AGENT APP',
  subtitle = 'NEXT-GEN INTELLECTUAL SUITE FOR MOBILE',
}) => {
  return (
    <section
      style={{
        padding: '5rem 1.75rem',
        background: 'var(--bg)',
        borderTop: '1px solid var(--border-dark)',
        borderBottom: '1px solid var(--border-dark)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '3rem',
          alignItems: 'center',
        }}
      >
        {/* Left Intro Text */}
        <div>
          <span
            className="font-mono"
            style={{
              fontSize: '0.78rem',
              fontWeight: 800,
              color: 'var(--text-muted)',
              letterSpacing: '0.1em',
              display: 'block',
              marginBottom: '1rem',
            }}
          >
            ✦ 3D DEVICE &amp; MOBILE AGENT INTEGRATION
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
              fontWeight: 900,
              lineHeight: 1.05,
              marginBottom: '1.5rem',
              letterSpacing: '-0.03em',
            }}
          >
            INTELLIGENT<br />
            <span style={{ color: 'var(--accent-blue)' }}>3D MOBILE</span> SUITE
          </h2>
          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--text-muted)',
              lineHeight: 1.7,
              marginBottom: '2rem',
              maxWidth: '500px',
            }}
          >
            Tactile, GPU-accelerated mobile interfaces built for seamless human-AI collaboration.
            Featuring 60fps 3D shaders, real-time spatial physics, and neural device tools.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }} className="font-mono">
            {['IOS 18 + WEBGL', 'REAL-TIME RAG', 'SPLINE 3D SHADER'].map((chip) => (
              <span
                key={chip}
                style={{
                  padding: '6px 14px',
                  border: '1.5px solid var(--border-dark)',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  background: 'var(--bg-card)',
                  boxShadow: '2px 2px 0 var(--border-dark)',
                }}
              >
                {chip}
              </span>
            ))}
          </div>
        </div>

        {/* Right 3D Interactive Phone Mockup Container */}
        <div
          style={{
            height: '480px',
            background: 'var(--bg-card)',
            border: '2px solid var(--border-dark)',
            borderRadius: '24px',
            boxShadow: '8px 8px 0 var(--border-dark)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <SplineWebComponent url={sceneUrl} />
        </div>
      </div>
    </section>
  );
};
