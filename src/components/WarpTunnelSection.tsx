import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;
  pz: number;
  color: string;
}

export const WarpTunnelSection: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Starfield Particle Array
    const numStars = 300;
    const stars: Star[] = [];
    const colors = ['#00F0FF', '#A3FF12', '#FF2E93', '#FFFFFF', '#FFD600'];

    const initStar = (star: Star) => {
      star.x = (Math.random() - 0.5) * width * 2;
      star.y = (Math.random() - 0.5) * height * 2;
      star.z = width;
      star.pz = width;
      star.color = colors[Math.floor(Math.random() * colors.length)];
    };

    for (let i = 0; i < numStars; i++) {
      const s = { x: 0, y: 0, z: 0, pz: 0, color: '#FFF' };
      initStar(s);
      s.z = Math.random() * width;
      s.pz = s.z;
      stars.push(s);
    }

    const speed = 12;
    const cx = width / 2;
    const cy = height / 2;

    const render = () => {
      // Dark translucent trails
      ctx.fillStyle = 'rgba(5, 5, 8, 0.25)';
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < numStars; i++) {
        const s = stars[i];
        s.pz = s.z;
        s.z -= speed;

        if (s.z <= 0) {
          initStar(s);
          continue;
        }

        // Project 3D coordinates to 2D
        const k = 250 / s.z;
        const pk = 250 / s.pz;

        const px = s.x * k + cx;
        const py = s.y * k + cy;

        const prevX = s.x * pk + cx;
        const prevY = s.y * pk + cy;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(px, py);
          ctx.strokeStyle = s.color;
          ctx.lineWidth = Math.max(0.5, (1 - s.z / width) * 3);
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section className="warp-section">
      <canvas id="warp-canvas" ref={canvasRef} />
      <div className="warp-content">
        <h2 className="warp-title">INNOVATE WITH A HUMAN TOUCH</h2>
        <div className="warp-quotes">
          <p>✦ Clarity first. Delight second.</p>
          <p>✦ Ship in small loops. Aim for long arcs.</p>
          <p>✦ Building tomorrow's intelligent digital products.</p>
        </div>
      </div>
    </section>
  );
};
