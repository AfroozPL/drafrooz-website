"use client";

import * as React from "react";

type Node = { x: number; y: number; vx: number; vy: number; r: number; hue: 0 | 1 | 2 };

const COLORS = ["0,194,255", "124,58,237", "6,255,165"];

/**
 * Ambient hero background: a drifting network of nodes that link up when
 * close and lean toward the cursor — a quiet picture of ideas connecting.
 * Pauses off-screen and renders a single static frame for reduced motion.
 */
export function NeuralField({ className }: { className?: string }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    let raf = 0;
    let running = true;
    const mouse = { x: -9999, y: -9999 };

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(90, (width * height) / 14000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.8,
        hue: (Math.random() < 0.6 ? 0 : Math.random() < 0.8 ? 1 : 2) as Node["hue"],
      }));
    }

    function frame() {
      ctx!.clearRect(0, 0, width, height);
      const linkDist = 130;

      for (const n of nodes) {
        // Gentle pull toward the cursor.
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const d = Math.hypot(dx, dy);
        if (d < 220 && d > 1) {
          n.vx += (dx / d) * 0.012;
          n.vy += (dy / d) * 0.012;
        }
        n.vx *= 0.985;
        n.vy *= 0.985;
        n.x += n.vx + (Math.random() - 0.5) * 0.05;
        n.y += n.vy + (Math.random() - 0.5) * 0.05;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < linkDist) {
            const near = Math.hypot(mouse.x - a.x, mouse.y - a.y) < 180;
            ctx!.strokeStyle = `rgba(${COLORS[a.hue]},${(1 - d / linkDist) * (near ? 0.55 : 0.18)})`;
            ctx!.lineWidth = near ? 1 : 0.6;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
      }

      for (const n of nodes) {
        ctx!.fillStyle = `rgba(${COLORS[n.hue]},0.9)`;
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx!.fill();
      }

      if (running && !reduced) raf = requestAnimationFrame(frame);
    }

    function onMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }
    function onLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    resize();
    frame();

    const io = new IntersectionObserver(([entry]) => {
      const wasRunning = running;
      running = entry.isIntersecting;
      if (running && !wasRunning && !reduced) raf = requestAnimationFrame(frame);
    });
    io.observe(canvas);

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) frame();
    });
    ro.observe(canvas);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
