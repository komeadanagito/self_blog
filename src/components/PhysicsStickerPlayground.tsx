import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../utils/audio';

interface DraggableBadge {
  id: string;
  label: string;
  bg: string;
  color: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
}

export const PhysicsStickerPlayground: React.FC = () => {
  const [badges, setBadges] = useState<DraggableBadge[]>([
    { id: 'b1', label: '✦ AI ENGINEER', bg: '#00F0FF', color: '#000', x: 120, y: 180, vx: 0, vy: 0, rotation: -6 },
    { id: 'b2', label: '☺ 2026 CRAFT', bg: '#FFD600', color: '#000', x: 340, y: 260, vx: 0, vy: 0, rotation: 8 },
    { id: 'b3', label: '✺ NEURAL GRAPH', bg: '#FF2E93', color: '#FFF', x: 220, y: 380, vx: 0, vy: 0, rotation: -12 },
    { id: 'b4', label: '⌗ WEBGL SHADER', bg: '#A3FF12', color: '#000', x: 450, y: 140, vx: 0, vy: 0, rotation: 15 },
  ]);

  const draggingId = useRef<string | null>(null);
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (id: string, e: React.PointerEvent) => {
    soundManager.playClickTone();
    draggingId.current = id;

    const badge = badges.find((b) => b.id === id);
    if (badge) {
      dragOffset.current = {
        x: e.clientX - badge.x,
        y: e.clientY - badge.y,
      };
    }
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingId.current) return;

    const newX = e.clientX - dragOffset.current.x;
    const newY = e.clientY - dragOffset.current.y;

    setBadges((prev) =>
      prev.map((b) => (b.id === draggingId.current ? { ...b, x: newX, y: newY } : b))
    );
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggingId.current) {
      soundManager.playHoverBlip();
      draggingId.current = null;
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '480px',
        background: 'var(--bg-card)',
        borderTop: '1px solid var(--border-dark)',
        borderBottom: '1px solid var(--border-dark)',
        padding: '3rem 2rem',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      <div className="section-label font-mono" style={{ marginBottom: '2rem' }}>
        <span>PHYSICS STICKER PLAYGROUND / 自由拖拽与碰撞试炼场 (TRY DRAGGING US)</span>
        <span>INTERACTIVE ENGINE</span>
      </div>

      <div style={{ position: 'relative', height: '360px', width: '100%', border: '2px dashed var(--border-dark)', borderRadius: '16px', background: 'rgba(0,0,0,0.02)' }}>
        <p className="font-mono" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--text-muted)', fontSize: '0.85rem', pointerEvents: 'none' }}>
          ✦ CLICK AND DRAG THE BADGES AROUND THE CANVAS ✦
        </p>

        {badges.map((b) => (
          <div
            key={b.id}
            onPointerDown={(e) => handlePointerDown(b.id, e)}
            onMouseEnter={() => soundManager.playHoverBlip()}
            style={{
              position: 'absolute',
              left: b.x,
              top: b.y,
              background: b.bg,
              color: b.color,
              padding: '14px 24px',
              borderRadius: '100px',
              fontWeight: 900,
              fontSize: '1rem',
              fontFamily: 'var(--font-mono)',
              boxShadow: '6px 6px 0 var(--border-dark)',
              border: '2px solid var(--border-dark)',
              cursor: 'grab',
              transform: `rotate(${b.rotation}deg)`,
              transition: draggingId.current === b.id ? 'none' : 'transform 0.15s ease',
              zIndex: draggingId.current === b.id ? 100 : 10,
              touchAction: 'none',
            }}
          >
            {b.label}
          </div>
        ))}
      </div>
    </div>
  );
};
