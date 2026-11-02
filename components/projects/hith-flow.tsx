"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useInView } from "@/components/motion/use-in-view";

/*
 * "From 21 pathways to one decision" — the Western Health HITH story as
 * an animated diagram. Stage 1 draws the fragmented status quo (8 external
 * referrers, 10 programs, 13 internal + 8 external referral pathways),
 * stage 2 converges everything into the AI decision tool, stage 3 lights
 * the outcomes. Paths use pathLength="1" so every line draws with the same
 * dash maths regardless of its real length.
 */

const W = 1000;
const H = 560;
const EXT_X = 64;
const PROG_X = 250;
const HUB = { x: 575, y: 280, r: 62 };
const OUT_X = 760;

const extY = Array.from({ length: 8 }, (_, i) => 70 + i * 60);
const progY = Array.from({ length: 10 }, (_, i) => 46 + i * 52);

// 13 internal pathways between programs (deliberately tangled).
const internalPairs: [number, number][] = [
  [0, 3], [1, 6], [2, 8], [3, 9], [4, 1], [5, 2], [6, 0],
  [7, 4], [8, 5], [9, 7], [1, 9], [2, 4], [6, 8],
];
// 8 external pathways: referrer → program.
const externalTargets = [2, 7, 0, 5, 9, 3, 6, 1];

const outcomes = [
  { y: 120, label: "Data-driven selection" },
  { y: 230, label: "One referral matrix" },
  { y: 340, label: "+15% at-home capacity" },
  { y: 450, label: "Amalgamation evidence" },
];

const STAGES = [
  { n: "01", label: "Fragmented", body: "10 programs · 3 divisions · 21 referral pathways" },
  { n: "02", label: "Converged", body: "Evidence base + ML decision support" },
  { n: "03", label: "Improved", body: "Better decisions, capacity and strategy" },
];

export function HithFlow() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);
  const [stage, setStage] = React.useState(0);

  React.useEffect(() => {
    if (!inView) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setStage(3);
      return;
    }
    setStage(1);
    const t2 = window.setTimeout(() => setStage(2), 1900);
    const t3 = window.setTimeout(() => setStage(3), 3500);
    return () => {
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [inView]);

  const draw = (on: boolean, delay = 0): React.CSSProperties => ({
    strokeDasharray: 1,
    strokeDashoffset: on ? 0 : 1,
    transition: `stroke-dashoffset 1.1s cubic-bezier(0.6,0,0.2,1) ${delay}ms, opacity 0.8s ease`,
  });

  return (
    <div ref={ref}>
      {/* Stage legend */}
      <ol className="mb-6 grid gap-3 sm:grid-cols-3">
        {STAGES.map((s, i) => (
          <li
            key={s.n}
            className={cn(
              "rounded-2xl border px-4 py-3 transition-all duration-700",
              stage > i
                ? "border-electric-blue/40 bg-electric-blue/[0.06]"
                : "border-white/[0.06] opacity-50",
            )}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-electric-blue">
              {s.n} · {s.label}
            </p>
            <p className="mt-1 text-sm text-light-gray">{s.body}</p>
          </li>
        ))}
      </ol>

      <div className="-mx-6 overflow-x-auto px-6 sm:mx-0 sm:px-0">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="min-w-[720px] w-full h-auto"
          role="img"
          aria-labelledby="hith-title hith-desc"
        >
          <title id="hith-title">Western Health HITH: from 21 referral pathways to one AI-supported decision</title>
          <desc id="hith-desc">
            Eight external referrers and ten HITH programs connected by 21 tangled referral
            pathways converge into a single AI decision tool, which leads to data-driven
            selection, one referral matrix, a 15% increase in at-home capacity and evidence
            for service amalgamation.
          </desc>
          <defs>
            <linearGradient id="hf-conv" x1="0" x2="1">
              <stop offset="0" stopColor="#7C3AED" stopOpacity="0.5" />
              <stop offset="1" stopColor="#00C2FF" />
            </linearGradient>
            <linearGradient id="hf-out" x1="0" x2="1">
              <stop offset="0" stopColor="#00C2FF" />
              <stop offset="1" stopColor="#06FFA5" />
            </linearGradient>
            <radialGradient id="hf-hub">
              <stop offset="0" stopColor="#00C2FF" stopOpacity="0.35" />
              <stop offset="1" stopColor="#00C2FF" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* column labels */}
          {[
            { x: EXT_X, t: "8 referrers" },
            { x: PROG_X, t: "10 programs" },
            { x: HUB.x, t: "AI decision tool" },
            { x: OUT_X + 90, t: "Outcomes" },
          ].map((c) => (
            <text key={c.t} x={c.x} y={18} textAnchor="middle" className="fill-muted font-mono text-[12px] uppercase tracking-[0.15em]">
              {c.t}
            </text>
          ))}

          {/* Stage 1: internal tangle */}
          {internalPairs.map(([a, b], i) => {
            const bulge = PROG_X + 70 + (i % 4) * 22;
            return (
              <path
                key={`in-${i}`}
                d={`M${PROG_X},${progY[a]} C${bulge},${progY[a]} ${bulge},${progY[b]} ${PROG_X},${progY[b]}`}
                pathLength={1}
                fill="none"
                stroke="#B8C4D4"
                strokeWidth={1}
                style={{ ...draw(stage >= 1, i * 70), opacity: stage >= 2 ? 0.08 : 0.35 }}
              />
            );
          })}
          {/* Stage 1: external pathways */}
          {externalTargets.map((t, i) => (
            <path
              key={`ex-${i}`}
              d={`M${EXT_X},${extY[i]} C${EXT_X + 110},${extY[i]} ${PROG_X - 110},${progY[t]} ${PROG_X},${progY[t]}`}
              pathLength={1}
              fill="none"
              stroke="#F59E0B"
              strokeWidth={1}
              style={{ ...draw(stage >= 1, 300 + i * 80), opacity: stage >= 2 ? 0.12 : 0.5 }}
            />
          ))}

          {/* Stage 2: convergence into the hub */}
          {progY.map((y, i) => (
            <path
              key={`cv-${i}`}
              d={`M${PROG_X},${y} C${PROG_X + 190},${y} ${HUB.x - 200},${HUB.y} ${HUB.x - HUB.r},${HUB.y}`}
              pathLength={1}
              fill="none"
              stroke="url(#hf-conv)"
              strokeWidth={1.6}
              style={draw(stage >= 2, i * 60)}
            />
          ))}
          {/* flowing particles along the convergence */}
          {stage >= 2 &&
            progY.map((y, i) => (
              <path
                key={`pt-${i}`}
                d={`M${PROG_X},${y} C${PROG_X + 190},${y} ${HUB.x - 200},${HUB.y} ${HUB.x - HUB.r},${HUB.y}`}
                pathLength={1}
                fill="none"
                stroke="#00C2FF"
                strokeWidth={3}
                strokeLinecap="round"
                className="hf-particle"
                style={{ animationDelay: `${(i % 5) * 0.45}s` }}
              />
            ))}

          {/* Stage 3: outcomes */}
          {outcomes.map((o, i) => (
            <path
              key={`out-${i}`}
              d={`M${HUB.x + HUB.r},${HUB.y} C${HUB.x + 140},${HUB.y} ${OUT_X - 110},${o.y} ${OUT_X},${o.y}`}
              pathLength={1}
              fill="none"
              stroke="url(#hf-out)"
              strokeWidth={2}
              style={draw(stage >= 3, i * 120)}
            />
          ))}

          {/* external nodes */}
          {extY.map((y, i) => (
            <circle key={`en-${i}`} cx={EXT_X} cy={y} r={6} fill="#060A14" stroke="#F59E0B" strokeWidth={1.5} />
          ))}
          {/* program nodes */}
          {progY.map((y, i) => (
            <g key={`pn-${i}`}>
              <circle
                cx={PROG_X}
                cy={y}
                r={9}
                fill={stage >= 2 ? "#00C2FF" : "#0D1B2A"}
                stroke={stage >= 2 ? "#00C2FF" : "#B8C4D4"}
                strokeWidth={1.5}
                style={{ transition: `fill 0.6s ease ${i * 60}ms, stroke 0.6s ease ${i * 60}ms` }}
              />
              <text x={PROG_X - 18} y={y + 4} textAnchor="end" className="fill-muted font-mono text-[11px]">
                P{i + 1}
              </text>
            </g>
          ))}

          {/* hub */}
          <circle cx={HUB.x} cy={HUB.y} r={HUB.r * 2.2} fill="url(#hf-hub)" style={{ opacity: stage >= 2 ? 1 : 0, transition: "opacity 1s ease" }} />
          {stage >= 2 && (
            <>
              <circle cx={HUB.x} cy={HUB.y} r={HUB.r} fill="none" stroke="#00C2FF" strokeOpacity={0.5} className="hf-ring" />
              <circle cx={HUB.x} cy={HUB.y} r={HUB.r} fill="none" stroke="#7C3AED" strokeOpacity={0.5} className="hf-ring" style={{ animationDelay: "1.2s" }} />
            </>
          )}
          <circle
            cx={HUB.x}
            cy={HUB.y}
            r={HUB.r}
            fill="#060A14"
            stroke="#00C2FF"
            strokeWidth={2}
            style={{ opacity: stage >= 2 ? 1 : 0.25, transition: "opacity 0.8s ease" }}
          />
          <text x={HUB.x} y={HUB.y - 4} textAnchor="middle" className="fill-white font-display text-[30px] font-semibold">
            AI
          </text>
          <text x={HUB.x} y={HUB.y + 20} textAnchor="middle" className="fill-light-gray font-mono text-[10px] uppercase tracking-[0.12em]">
            decision tool
          </text>

          {/* outcome nodes + labels */}
          {outcomes.map((o, i) => (
            <g
              key={`on-${i}`}
              style={{
                opacity: stage >= 3 ? 1 : 0.15,
                transition: `opacity 0.7s ease ${300 + i * 140}ms`,
              }}
            >
              <circle cx={OUT_X} cy={o.y} r={8} fill="#06FFA5" />
              <text x={OUT_X + 20} y={o.y + 5} className="fill-white text-[15px] font-medium">
                {o.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <p className="mt-3 text-xs text-muted sm:hidden">Swipe to see the full diagram →</p>
    </div>
  );
}
