import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  color: string;
  vx: number;
  vy: number;
  maxLife: number;
  life: number;
}

export const PixelTrailCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    const colors = ['#A3FF12', '#00F0FF', '#FFD600', '#FF2E93'];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleMouseMove = (e: MouseEvent) => {
      // Spawn 2-3 square particles per mouse movement tick
      for (let i = 0; i < 2; i++) {
        const size = Math.floor(Math.random() * 6) + 8; // 8px - 14px square
        const color = colors[Math.floor(Math.random() * colors.length)];
        particles.push({
          x: e.clientX + (Math.random() - 0.5) * 12,
          y: e.clientY + (Math.random() - 0.5) * 12,
          size,
          alpha: 1.0,
          color,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8 - 0.5, // Slight upward float
          maxLife: Math.floor(Math.random() * 25) + 20,
          life: 0
        });
      }

      // Limit particle array size
      if (particles.length > 150) {
        particles = particles.slice(particles.length - 150);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha = 1 - p.life / p.maxLife;

        if (p.alpha > 0) {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          // Crisp pixel rectangle without rounded corners
          ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
          // Dark pixel border for Neo-brutalist feel
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 1;
          ctx.strokeRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
          ctx.restore();
        }
      }

      // Filter out dead particles
      particles = particles.filter(p => p.life < p.maxLife);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas id="pixel-trail-canvas" ref={canvasRef} />;
};
