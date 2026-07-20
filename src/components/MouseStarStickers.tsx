import React, { useEffect, useState } from 'react';

interface StarSticker {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  symbol: string;
}

const SYMBOLS = ['✦', '★', '✺', '☺', '✸', '✧'];

export const MouseStarStickers: React.FC = () => {
  const [stickers, setStickers] = useState<StarSticker[]>([]);

  useEffect(() => {
    let count = 0;
    const handleMouseMove = (e: MouseEvent) => {
      // Spawn star sticker only over top navigation header or interactive elements
      const target = e.target as HTMLElement;
      const isNav = target.closest('.site-nav');
      
      if (isNav && Math.random() < 0.35) {
        const newSticker: StarSticker = {
          id: count++,
          x: e.clientX,
          y: e.clientY,
          size: Math.floor(Math.random() * 14) + 12,
          rotation: Math.floor(Math.random() * 360),
          symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        };

        setStickers((prev) => [...prev.slice(-15), newSticker]);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 99999 }}>
      {stickers.map((s) => (
        <span
          key={s.id}
          style={{
            position: 'absolute',
            left: s.x,
            top: s.y,
            fontSize: `${s.size}px`,
            transform: `translate(-50%, -50%) rotate(${s.rotation}deg)`,
            color: '#A3FF12',
            textShadow: '0 0 8px rgba(163,255,18,0.8), 1px 1px 0 #000',
            animation: 'starPopFade 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            userSelect: 'none',
          }}
        >
          {s.symbol}
        </span>
      ))}
    </div>
  );
};
