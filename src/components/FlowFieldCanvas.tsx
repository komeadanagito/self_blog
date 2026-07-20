import React, { useEffect, useRef } from 'react';

type Point = { x: number; y: number; ox: number; oy: number; vx: number; vy: number; phase: number };

export const FlowFieldCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;
    const pointer = { x: -1000, y: -1000, active: false };
    const points: Point[] = [];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const seedPoints = () => {
      points.length = 0;
      const spacing = Math.max(82, Math.min(width, height) / 8);
      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;
      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const x = (col + 0.5) * spacing;
          const y = (row + 0.5) * spacing;
          points.push({ x, y, ox: x, oy: y, vx: 0, vy: 0, phase: Math.random() * Math.PI * 2 });
        }
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedPoints();
    };

    const move = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    };
    const leave = () => { pointer.active = false; };

    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    observer.observe(canvas);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerleave', leave);
    window.addEventListener('resize', resize);
    resize();

    const render = (now: number) => {
      if (visible) {
        context.fillStyle = '#050609';
        context.fillRect(0, 0, width, height);
        const time = reducedMotion ? 0 : now * 0.001;

        for (const point of points) {
          const dx = point.x - pointer.x;
          const dy = point.y - pointer.y;
          const distance = Math.max(1, Math.hypot(dx, dy));
          if (pointer.active && distance < 190) {
            const force = (1 - distance / 190) * 1.7;
            point.vx += (dx / distance) * force;
            point.vy += (dy / distance) * force;
          }
          point.vx += (point.ox + Math.sin(time + point.phase) * 8 - point.x) * 0.018;
          point.vy += (point.oy + Math.cos(time * 0.8 + point.phase) * 8 - point.y) * 0.018;
          point.vx *= 0.9;
          point.vy *= 0.9;
          point.x += point.vx;
          point.y += point.vy;
        }

        context.lineWidth = 0.8;
        for (let i = 0; i < points.length; i += 1) {
          for (let j = i + 1; j < points.length; j += 1) {
            const a = points[i];
            const b = points[j];
            const distance = Math.hypot(a.x - b.x, a.y - b.y);
            if (distance < 125) {
              context.strokeStyle = `rgba(116, 143, 255, ${(1 - distance / 125) * 0.42})`;
              context.beginPath();
              context.moveTo(a.x, a.y);
              context.lineTo(b.x, b.y);
              context.stroke();
            }
          }
        }

        for (const point of points) {
          const near = pointer.active && Math.hypot(point.x - pointer.x, point.y - pointer.y) < 190;
          context.fillStyle = near ? '#b6ff39' : '#f2f4ff';
          context.beginPath();
          context.arc(point.x, point.y, near ? 3.2 : 1.8, 0, Math.PI * 2);
          context.fill();
        }
      }
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerleave', leave);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="flow-field-canvas" aria-label="Interactive particle network" />;
};
