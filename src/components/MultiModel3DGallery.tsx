import React from 'react';
import { SplineWebComponent } from './SplineWebComponent';
import { soundManager } from '../utils/audio';

interface ModelItem {
  id: string;
  category: string;
  name: string;
  desc: string;
  splineUrl: string;
  accentColor: string;
}

export const MultiModel3DGallery: React.FC = () => {
  const models: ModelItem[] = [
    {
      id: 'm1',
      category: 'CHROMATIC REFRACTION',
      name: 'Fluid Rainbow Glass Sphere',
      desc: 'High-purity liquid glass shader with dynamic chromatic dispersion and edge refraction.',
      splineUrl: 'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode',
      accentColor: '#00F0FF',
    },
    {
      id: 'm2',
      category: 'QUANTUM TOPOLOGY',
      name: 'Spatial Quantum Glass Torus',
      desc: 'Complex 3D glass ring topology with dynamic physical light scattering.',
      splineUrl: 'https://prod.spline.design/qQU0X-nU1-wB5Z9F/scene.splinecode',
      accentColor: '#FF2E93',
    },
    {
      id: 'm3',
      category: 'NEURAL MEDIA CORE',
      name: 'Interactive Cyber Particle Core',
      desc: 'Real-time WebGPU particle swarm mapped onto spatial volumetric bounds.',
      splineUrl: 'https://prod.spline.design/2-kK1wN1O-sZ5X9G/scene.splinecode',
      accentColor: '#A3FF12',
    },
    {
      id: 'm4',
      category: 'SPATIAL HARDWARE',
      name: 'Refractive Holographic Crystal',
      desc: 'Multi-faceted crystal glass geometry with procedural caustics and neon specular gloss.',
      splineUrl: 'https://prod.spline.design/7eR4m9u2V1-wX8z0/scene.splinecode',
      accentColor: '#FFD600',
    },
  ];

  return (
    <section
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
      {/* Ambient Radial Glow */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '900px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(0,240,255,0.12) 0%, rgba(255,46,147,0.08) 50%, transparent 70%)',
          filter: 'blur(110px)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        {/* Gallery Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--accent)', letterSpacing: '0.12em', display: 'inline-block', marginBottom: '0.8rem' }}>
            ✦ 3D SPATIAL GALLERY / 高级感 3D 玻璃美学与智能算力核心
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4.2rem)', fontWeight: 900, lineHeight: 1.05 }}>
            SPATIAL 3D <span style={{ color: 'var(--accent)' }}>GLASS SHADERS</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', marginTop: '1rem', maxWidth: '640px', margin: '1rem auto 0', lineHeight: 1.6 }}>
            An immaculate collection of interactive liquid glass refractors, quantum spatial topologies, and procedural neural cores.
          </p>
        </div>

        {/* 4-Column Frameless Glass Viewports Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2.2rem',
          }}
        >
          {models.map((m) => (
            <div
              key={m.id}
              className="premium-glass-panel"
              onMouseEnter={() => soundManager.playHoverBlip()}
              style={{
                borderRadius: '20px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              {/* 3D Model Viewport (Hard Cropped to 100% hide all Spline links and badges) */}
              <div
                style={{
                  height: '300px',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  background: 'rgba(0,0,0,0.4)',
                  position: 'relative',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <SplineWebComponent url={m.splineUrl} />
              </div>

              {/* Model Info */}
              <div style={{ marginTop: '1.2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span className="font-mono" style={{ fontSize: '0.72rem', color: m.accentColor, fontWeight: 800 }}>
                    {m.category}
                  </span>
                  <span className="font-mono" style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>
                    60FPS GPU
                  </span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0.2rem 0 0.5rem', color: '#fff' }}>
                  {m.name}
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                  {m.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
