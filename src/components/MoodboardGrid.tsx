import React, { useEffect, useRef, useState } from 'react';
import { SplineWebComponent } from './SplineWebComponent';
import { soundManager } from '../utils/audio';

interface MoodboardItem {
  id: string;
  type: 'card' | 'spline' | 'sticker' | 'phone';
  title?: string;
  tag?: string;
  year?: string;
  desc?: string;
  content?: React.ReactNode;
  splineUrl?: string;
  rotation: number;
  speed: number;
  width: string;
  bg?: string;
}

export const MoodboardGrid: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 3D Card Mouse Tilt State
  const [tilt, setTilt] = useState<{ id: string; rx: number; ry: number } | null>(null);

  const handleCardMouseMove = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y - rect.height / 2) / (rect.height / 2)) * -12;
    const ry = ((x - rect.width / 2) / (rect.width / 2)) * 12;
    setTilt({ id, rx, ry });
  };

  const handleCardMouseLeave = () => setTilt(null);

  const items: MoodboardItem[] = [
    {
      id: 'item-1',
      type: 'card',
      title: 'NEURAL SYSTEM DESIGN',
      tag: 'AI AGENT ARCHITECTURE',
      year: '2026',
      desc: 'High-concurrency LLM orchestration & memory graph pipeline.',
      rotation: -2,
      speed: 0.05,
      width: '450px',
      content: (
        <div style={{ padding: '2rem 1.5rem', textAlign: 'left' }}>
          <span style={{ fontSize: '3.2rem', fontWeight: 900, fontFamily: 'var(--font-display)', display: 'block', lineHeight: 1, marginBottom: '0.8rem' }}>
            NEURAL GRAPH
          </span>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Autonomous multi-agent task planner with dynamic tool routing and vector memory store.
          </p>
        </div>
      ),
    },
    {
      id: 'item-spline-1',
      type: 'spline',
      title: 'CHROMATIC LIQUID GLASS',
      tag: '3D SHADER &amp; REFRACTION',
      year: '2026',
      desc: 'Real-time WebGPU dispersion & chromatic refraction engine.',
      rotation: 4,
      speed: 0.1,
      width: '420px',
      bg: '#0c0c14',
      splineUrl: 'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode',
    },
    {
      id: 'item-2',
      type: 'sticker',
      rotation: 12,
      speed: 0.12,
      width: '180px',
      content: (
        <div
          style={{
            background: 'var(--accent)',
            color: '#000',
            padding: '12px 20px',
            borderRadius: '100px',
            fontWeight: 900,
            fontSize: '0.9rem',
            boxShadow: '4px 4px 0 #000',
            border: '2px solid #000',
            textAlign: 'center',
          }}
          className="font-mono"
        >
          ✦ INTELLIGENCE ✺
        </div>
      ),
    },
    {
      id: 'item-spline-2',
      type: 'spline',
      title: 'QUANTUM DATA CORE',
      tag: 'NEURAL HARDWARE UTILS',
      year: '2025',
      desc: 'Next-gen WebAssembly compiler for deep neural inference.',
      rotation: -4,
      speed: 0.07,
      width: '450px',
      bg: '#07070b',
      splineUrl: 'https://prod.spline.design/qQU0X-nU1-wB5Z9F/scene.splinecode',
    },
    {
      id: 'item-3',
      type: 'phone',
      title: 'WASM AI INFERENCE SUITE',
      tag: 'HIGH-PERFORMANCE TOOLING',
      year: '2025',
      rotation: 3,
      speed: 0.08,
      width: '560px',
      bg: '#0a0a0f',
      content: (
        <div style={{ padding: '2.5rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.2rem' }}>
          <div
            style={{
              width: '150px',
              height: '300px',
              border: '3px solid #333',
              borderRadius: '24px',
              background: '#161622',
              display: 'flex',
              flexDirection: 'column',
              padding: '12px',
              boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
            }}
          >
            <div style={{ width: '40px', height: '4px', background: '#444', borderRadius: '2px', margin: '0 auto 12px' }} />
            <div style={{ flex: 1, background: 'linear-gradient(135deg, #0044e0, #ff2e93)', borderRadius: '12px', padding: '10px', color: '#fff', fontSize: '0.72rem' }}>
              ✦ WASM Kernel active<br />
              FPS: 60 · Latency: 1.2ms
            </div>
          </div>
          <div className="font-mono" style={{ color: 'var(--accent)', fontSize: '0.85rem', lineHeight: 1.6 }}>
            $ mutsumi-ai run --device webgpu<br />
            ✓ Tensor ops compiled<br />
            ✓ Zero memory leaks detected
          </div>
        </div>
      ),
    },
    {
      id: 'item-4',
      type: 'sticker',
      rotation: -15,
      speed: 0.15,
      width: '160px',
      content: (
        <div
          style={{
            background: 'var(--accent-pink)',
            color: '#fff',
            padding: '14px',
            borderRadius: '50%',
            fontWeight: 900,
            fontSize: '1.8rem',
            textAlign: 'center',
            boxShadow: '4px 4px 0 #000',
            border: '2px solid #000',
          }}
        >
          ☺
        </div>
      ),
    },
  ];

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        minHeight: '1400px',
        padding: '5rem 2rem',
        overflow: 'hidden',
        borderTop: '1px solid var(--border-dark)',
        background: 'var(--bg)',
      }}
    >
      <div className="section-label" style={{ marginBottom: '4rem' }}>
        <span>INFINITE MOODBOARD / 智能系统与液态玻璃探索看板 (3D TILT CARDS)</span>
        <span>2021 – 2026</span>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '3rem',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          perspective: '1000px',
        }}
      >
        {items.map((item) => {
          const translateY = (scrollY - 600) * item.speed;
          const isTilted = tilt?.id === item.id;
          const tiltRotX = isTilted ? tilt.rx : 0;
          const tiltRotY = isTilted ? tilt.ry : 0;

          return (
            <div
              key={item.id}
              onMouseMove={(e) => handleCardMouseMove(item.id, e)}
              onMouseLeave={handleCardMouseLeave}
              onMouseEnter={() => soundManager.playHoverBlip()}
              onClick={() => soundManager.playClickTone()}
              style={{
                width: item.width,
                transform: `translateY(${translateY}px) rotate(${item.rotation}deg) rotateX(${tiltRotX}deg) rotateY(${tiltRotY}deg)`,
                transformStyle: 'preserve-3d',
                transition: isTilted ? 'transform 0.05s ease-out' : 'transform 0.3s ease',
                background: item.bg || 'var(--bg-card)',
                color: item.bg ? '#fff' : 'var(--text)',
                border: '1.5px solid var(--border-dark)',
                boxShadow: isTilted ? '12px 16px 30px rgba(0,0,0,0.3)' : '6px 6px 0 var(--border-dark)',
                borderRadius: item.type === 'sticker' ? '0' : '12px',
                cursor: 'pointer',
                position: 'relative',
                zIndex: item.type === 'sticker' ? 10 : 1,
                overflow: 'hidden',
              }}
            >
              {item.title && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    borderBottom: '1px solid var(--border)',
                    fontSize: '0.75rem',
                  }}
                  className="font-mono"
                >
                  <span style={{ fontWeight: 800 }}>{item.tag}</span>
                  <span>{item.year}</span>
                </div>
              )}

              {item.type === 'spline' && item.splineUrl ? (
                <div style={{ height: '320px', width: '100%' }}>
                  <SplineWebComponent url={item.splineUrl} />
                </div>
              ) : (
                item.content
              )}

              {item.title && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '14px 18px',
                    borderTop: '1px dashed var(--border)',
                    fontWeight: 800,
                  }}
                >
                  <span>{item.title}</span>
                  <span>↗</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
