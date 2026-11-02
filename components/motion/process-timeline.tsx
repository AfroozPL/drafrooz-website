"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type ProcessStep = { title: string; body: string; detail?: string };

/**
 * Vertical timeline whose connecting line fills as you scroll through it;
 * each step lights up once the line reaches it.
 */
export function ProcessTimeline({ steps }: { steps: ProcessStep[] }) {
  const ref = React.useRef<HTMLOListElement>(null);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
      return;
    }
    let raf = 0;
    function update() {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const start = window.innerHeight * 0.75;
      const p = (start - rect.top) / rect.height;
      setProgress(Math.max(0, Math.min(1, p)));
    }
    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <ol ref={ref} className="relative">
      <div aria-hidden className="absolute left-[19px] top-2 bottom-2 w-px bg-white/10" />
      <div
        aria-hidden
        className="absolute left-[19px] top-2 w-px bg-gradient-to-b from-electric-blue via-deep-violet to-vivid-mint"
        style={{ height: `calc(${progress * 100}% - 16px)` }}
      />
      {steps.map((step, i) => {
        const active = progress >= (i + 0.3) / steps.length;
        return (
          <li key={step.title} className="relative pl-16 pb-12 last:pb-0">
            <span
              className={cn(
                "absolute left-0 top-0 grid h-10 w-10 place-items-center rounded-full border font-mono text-xs transition-all duration-500",
                active
                  ? "border-electric-blue bg-electric-blue text-ink shadow-glow-blue"
                  : "border-white/15 bg-ink text-muted",
              )}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div
              className={cn(
                "transition-all duration-500",
                active ? "opacity-100 translate-x-0" : "opacity-40 translate-x-2",
              )}
            >
              <h3 className="font-display text-2xl font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-light-gray leading-relaxed max-w-xl">{step.body}</p>
              {step.detail && (
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-electric-blue/80">
                  {step.detail}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
