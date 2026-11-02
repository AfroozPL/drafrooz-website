"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { levers, projects, type LeverKey } from "@/lib/content/projects";
import { Icon } from "@/components/site/icons";

/**
 * "How AI created value" — pick a value lever and the projects that
 * delivered it light up; the rest recede.
 */
export function LeverExplorer() {
  const [active, setActive] = React.useState<LeverKey | "all">("all");
  const current = levers.find((l) => l.key === active);
  const matches = (keys: LeverKey[]) => active === "all" || keys.includes(active);
  // Western Health (flagship) delivered decisions, efficiency and strategy.
  const flagshipLevers: LeverKey[] = ["decisions", "efficiency", "strategy"];
  const count =
    active === "all"
      ? projects.length + 1
      : projects.filter((p) => p.levers.includes(active)).length +
        (flagshipLevers.includes(active) ? 1 : 0);

  return (
    <div>
      <div role="tablist" aria-label="Value levers" className="flex flex-wrap gap-2">
        {[{ key: "all" as const, name: "All projects" }, ...levers].map((l) => (
          <button
            key={l.key}
            role="tab"
            aria-selected={active === l.key}
            onClick={() => setActive(l.key)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition-all duration-300",
              active === l.key
                ? "border-electric-blue bg-electric-blue text-ink font-semibold shadow-glow-blue"
                : "border-white/15 text-light-gray hover:border-white/40 hover:text-white",
            )}
          >
            {l.name}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1 min-h-[3rem]" aria-live="polite">
        <p className="font-display text-4xl font-semibold text-white tabular-nums">{count}</p>
        <p className="text-light-gray">
          {current ? (
            <>
              projects delivering <span className="text-white">{current.name.toLowerCase()}</span> — {current.body}
            </>
          ) : (
            "projects across healthcare, industry, education and policy"
          )}
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ProjectTile
          on={matches(flagshipLevers)}
          title="Western at Home — HITH AI decision tool"
          client="Western Health · Victoria"
          sector="Healthcare"
          summary="AI decision support for Hospital in the Home across 10 programs and 3 divisions."
          href="#western-health"
          featured
        />
        {projects.map((p) => (
          <ProjectTile
            key={p.slug}
            on={matches(p.levers)}
            title={p.title}
            client={p.client}
            sector={p.sector}
            summary={p.summary}
            metric={p.metric}
            href={`#${p.slug}`}
          />
        ))}
      </div>
    </div>
  );
}

function ProjectTile({
  on,
  title,
  client,
  sector,
  summary,
  metric,
  href,
  featured,
}: {
  on: boolean;
  title: string;
  client: string;
  sector: string;
  summary: string;
  metric?: { value: string; label: string };
  href: string;
  featured?: boolean;
}) {
  return (
    <a
      href={href}
      tabIndex={on ? 0 : -1}
      aria-hidden={!on || undefined}
      className={cn(
        "group relative flex flex-col rounded-2xl border p-5 transition-all duration-500",
        on
          ? "border-white/10 bg-navy/60 opacity-100 hover:-translate-y-1 hover:border-electric-blue/50"
          : "pointer-events-none scale-[0.97] border-white/[0.04] bg-transparent opacity-25 blur-[1px]",
        featured && on && "gradient-border",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-electric-blue">{sector}</span>
        {featured && (
          <span className="rounded-full bg-vivid-mint/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-vivid-mint">
            Flagship
          </span>
        )}
      </div>
      <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-white">{title}</h3>
      <p className="mt-1 text-xs text-muted">{client}</p>
      <p className="mt-3 flex-1 text-sm text-light-gray leading-relaxed">{summary}</p>
      <div className="mt-4 flex items-end justify-between">
        {metric ? (
          <p>
            <span className="font-display text-2xl font-semibold text-white">{metric.value}</span>{" "}
            <span className="text-xs text-light-gray">{metric.label}</span>
          </p>
        ) : (
          <span />
        )}
        <Icon name="arrow" className="h-4 w-4 text-electric-blue transition-transform group-hover:translate-x-1" />
      </div>
    </a>
  );
}
