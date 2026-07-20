import React, { useEffect, useRef } from 'react';

interface Particle { x: number; y: number; life: number; maxLife: number; size: number; color: string; vx: number; vy: number; }
const COLORS = ['#A3FF12', '#FFD600', '#00F0FF', '#FF2E93'];

export const CursorCanvas: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    let particles: Particle[] = [];
    let raf: number;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e: MouseEvent) => {
      for (let i = 0; i < 3; i++) {
        const size = 7 + Math.random() * 7;
        particles.push({
          x: e.clientX + (Math.random() - 0.5) * 10,
          y: e.clientY + (Math.random() - 0.5) * 10,
          life: 0,
          maxLife: 22 + Math.floor(Math.random() * 18),
          size,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2 - 0.6,
        });
      }
      if (particles.length > 180) particles = particles.slice(-180);
    };
    window.addEventListener('mousemove', onMove);

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter(p => p.life < p.maxLife);
      for (const p of particles) {
        p.life++; p.x += p.vx; p.y += p.vy;
        const alpha = 1 - p.life / p.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
        ctx.restore();
      }
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={ref} id="cursor-canvas" />;
};
