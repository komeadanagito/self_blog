import React, { useEffect, useRef } from 'react';

export const WarpCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let visible = false;
    let running = false;
    let W = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let H = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const numStars = 280;
    const stars: { x: number; y: number; z: number; oz: number }[] = [];

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: (Math.random() - 0.5) * W * 2,
        y: (Math.random() - 0.5) * H * 2,
        z: Math.random() * W,
        oz: Math.random() * W,
      });
    }

    let scrollSpeedBoost = 0;
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const dy = Math.abs(window.scrollY - lastScrollY);
      scrollSpeedBoost = Math.min(dy * 0.8, 30);
      lastScrollY = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const start = () => {
      if (!running && visible && !document.hidden) {
        running = true;
        animId = requestAnimationFrame(render);
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else { cancelAnimationFrame(animId); running = false; }
    }, { rootMargin: '15% 0px' });
    observer.observe(canvas);

    const render = () => {
      if (!visible || document.hidden) { running = false; return; }
      ctx.fillStyle = 'rgba(4, 4, 6, 0.35)'; // Smooth star trail
      ctx.fillRect(0, 0, W, H);

      // Decay scroll speed boost back to normal
      scrollSpeedBoost *= 0.92;
      const currentSpeed = 3 + scrollSpeedBoost;

      const cx = W / 2;
      const cy = H / 2;

      for (let s of stars) {
        s.z -= currentSpeed;
        if (s.z <= 0) {
          s.z = W;
          s.x = (Math.random() - 0.5) * W * 2;
          s.y = (Math.random() - 0.5) * H * 2;
        }

        const k = 250 / s.z;
        const px = s.x * k + cx;
        const py = s.y * k + cy;

        if (px >= 0 && px <= W && py >= 0 && py <= H) {
          const size = Math.max(0.5, (1 - s.z / W) * 3);
          const alpha = (1 - s.z / W);
          ctx.fillStyle = `rgba(0, 240, 255, ${alpha})`;
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };
    const onVisibility = () => document.hidden ? (cancelAnimationFrame(animId), running = false) : start();
    document.addEventListener('visibilitychange', onVisibility);

    const onResize = () => {
      if (!canvas.parentElement) return;
      W = canvas.width = canvas.parentElement.clientWidth;
      H = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
};
