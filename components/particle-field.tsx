"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  kind: number;
  alpha: number;
  tw: number;
  twSpeed: number;
}

/**
 * Canvas particle field — drifting gold dots and tiny house silhouettes.
 * Ported from datastaq-hvac. Auto-scales down on mobile and renders a
 * single static frame when prefers-reduced-motion is set.
 */
export function ParticleField({
  className = "",
  density = 1,
}: {
  className?: string;
  density?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let w = 0;
    let h = 0;
    let raf = 0;
    let particles: Particle[] = [];
    const goldRGB = "201,162,39";
    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const make = (): Particle => ({
      x: rand(0, w || 1),
      y: rand(0, h || 1),
      vx: rand(-0.16, 0.16),
      vy: rand(-0.3, -0.04),
      r: rand(1, 3.2),
      kind: Math.random(),
      alpha: rand(0.12, 0.52),
      tw: rand(0, Math.PI * 2),
      twSpeed: rand(0.006, 0.022),
    });

    const drawHouse = (x: number, y: number, s: number) => {
      ctx.beginPath();
      ctx.moveTo(x, y - s);
      ctx.lineTo(x + s, y - s * 0.1);
      ctx.lineTo(x + s * 0.66, y - s * 0.1);
      ctx.lineTo(x + s * 0.66, y + s * 0.8);
      ctx.lineTo(x - s * 0.66, y + s * 0.8);
      ctx.lineTo(x - s * 0.66, y - s * 0.1);
      ctx.lineTo(x - s, y - s * 0.1);
      ctx.closePath();
      ctx.stroke();
    };

    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.tw += p.twSpeed;
        if (p.y < -14) {
          p.y = h + 14;
          p.x = rand(0, w);
        }
        if (p.x < -14) p.x = w + 14;
        if (p.x > w + 14) p.x = -14;

        const a = p.alpha * (0.55 + 0.45 * Math.sin(p.tw));
        if (p.kind < 0.82) {
          ctx.beginPath();
          ctx.fillStyle = `rgba(${goldRGB},${a})`;
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.strokeStyle = `rgba(${goldRGB},${a})`;
          ctx.lineWidth = 1;
          ctx.lineJoin = "round";
          drawHouse(p.x, p.y, p.r * 2.6);
        }
      }
      if (!reduced) raf = requestAnimationFrame(frame);
    };

    resize();
    const isMobile = window.innerWidth < 768;
    const count = Math.round((isMobile ? 16 : 44) * density);
    particles = Array.from({ length: count }, make);
    frame();

    window.addEventListener("resize", resize, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
