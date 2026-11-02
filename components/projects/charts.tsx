"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useInView } from "@/components/motion/use-in-view";
import { roadmapSegments } from "@/lib/content/projects";

/** Dreamworld roadmap: 21 opportunities, sequenced into four groups. */
export function RoadmapBar() {
  const [ref, inView] = useInView<HTMLDivElement>(0.4);
  const total = roadmapSegments.reduce((s, x) => s + x.count, 0);

  return (
    <div ref={ref}>
      <div
        className="flex h-12 gap-1 overflow-hidden rounded-xl"
        role="img"
        aria-label={roadmapSegments.map((s) => `${s.count} ${s.label}`).join(", ")}
      >
        {roadmapSegments.map((s, i) => (
          <div
            key={s.label}
            className={cn("relative grid place-items-center rounded-lg transition-all duration-1000 ease-out", s.color)}
            style={{
              width: inView ? `${(s.count / total) * 100}%` : "0%",
              minWidth: inView ? "2.25rem" : 0,
              transitionDelay: `${i * 180}ms`,
            }}
          >
            <span className={cn("font-display text-lg font-semibold", i === 3 ? "text-white" : "text-ink")}>
              {s.count}
            </span>
          </div>
        ))}
      </div>
      <dl className="mt-5 grid gap-4 sm:grid-cols-4">
        {roadmapSegments.map((s, i) => (
          <div
            key={s.label}
            className="transition-all duration-700"
            style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(8px)", transitionDelay: `${400 + i * 150}ms` }}
          >
            <dt className="flex items-center gap-2 text-sm font-medium text-white">
              <span className={cn("h-2.5 w-2.5 rounded-full", s.color)} />
              {s.label}
            </dt>
            <dd className="mt-1 text-xs text-light-gray leading-relaxed">{s.body}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** Ring gauge for model performance (ROC-AUC). */
export function AucGauge({ value, label }: { value: number; label: string }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.5);
  // React 18 ids contain colons; strip them so url(#id) resolves everywhere.
  const gid = `auc${React.useId().replace(/:/g, "")}`;
  const r = 52;
  const c = 2 * Math.PI * r;

  return (
    <div ref={ref} className="flex flex-col items-center text-center">
      <div className="relative h-36 w-36">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden>
          <defs>
            <linearGradient id={gid} x1="0" x2="1">
              <stop offset="0" stopColor="#00C2FF" />
              <stop offset="1" stopColor="#7C3AED" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="9" />
          <circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke={`url(#${gid})`}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={inView ? c * (1 - value) : c}
            style={{ transition: "stroke-dashoffset 1.6s cubic-bezier(0.2,0.7,0.2,1)" }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div>
            <p className="font-display text-3xl font-semibold text-white">{String(value)}</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">ROC-AUC</p>
          </div>
        </div>
      </div>
      <p className="mt-3 max-w-[12rem] text-sm text-light-gray">{label}</p>
    </div>
  );
}
