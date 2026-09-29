import { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Orbs configuration
    const orbs = [
      { x: 0.2, y: 0.3, r: 0.35, color: [100, 180, 255], speed: 0.0008, phase: 0 },
      { x: 0.7, y: 0.2, r: 0.30, color: [180, 100, 255], speed: 0.0012, phase: 2 },
      { x: 0.5, y: 0.7, r: 0.40, color: [100, 220, 200], speed: 0.001, phase: 4 },
      { x: 0.85, y: 0.6, r: 0.25, color: [255, 130, 200], speed: 0.0009, phase: 1 },
      { x: 0.15, y: 0.75, r: 0.28, color: [255, 210, 80], speed: 0.0011, phase: 3 },
      { x: 0.6, y: 0.4, r: 0.20, color: [80, 200, 255], speed: 0.0015, phase: 5 },
    ];

    const draw = () => {
      time += 1;
      const w = canvas.width;
      const h = canvas.height;

      // White base
      ctx.fillStyle = 'rgb(245, 248, 255)';
      ctx.fillRect(0, 0, w, h);

      // Draw animated gradient orbs
      orbs.forEach((orb) => {
        const dx = Math.sin(time * orb.speed + orb.phase) * 0.12;
        const dy = Math.cos(time * orb.speed * 0.7 + orb.phase) * 0.10;
        const cx = (orb.x + dx) * w;
        const cy = (orb.y + dy) * h;
        const radius = orb.r * Math.min(w, h);

        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        const [r, g, b] = orb.color;
        gradient.addColorStop(0, `rgba(${r},${g},${b},0.45)`);
        gradient.addColorStop(0.5, `rgba(${r},${g},${b},0.2)`);
        gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Floating particles
      const particleCount = 18;
      for (let i = 0; i < particleCount; i++) {
        const px = ((i * 137.5 + time * 0.15) % w);
        const py = ((i * 89.3 + time * 0.08 * (i % 3 === 0 ? -1 : 1)) % h + h) % h;
        const ps = 2 + (i % 4);
        const alpha = 0.3 + 0.2 * Math.sin(time * 0.02 + i);
        ctx.beginPath();
        ctx.arc(px, py, ps, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100,160,255,${alpha})`;
        ctx.fill();
      }

      // Subtle grid lines for digital feel
      ctx.strokeStyle = 'rgba(100,150,255,0.05)';
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x <= w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y <= h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
}
