"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Card whose glow follows the pointer, with an optional subtle 3D tilt.
 * Only writes CSS variables, so React never re-renders on mouse move.
 */
export function SpotlightCard({
  className,
  tilt = false,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { tilt?: boolean }) {
  const ref = React.useRef<HTMLDivElement>(null);

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
    if (tilt && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const rx = ((y / rect.height) - 0.5) * -5;
      const ry = ((x / rect.width) - 0.5) * 5;
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    }
  }

  function onLeave() {
    if (ref.current) ref.current.style.transform = "";
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cn(
        "spotlight surface-card transition-[transform,border-color] duration-300 ease-out hover:border-electric-blue/30",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
