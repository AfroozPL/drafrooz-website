import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { CountUp } from "@/components/motion/count-up";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { HithFlow } from "@/components/projects/hith-flow";
import { LeverExplorer } from "@/components/projects/lever-explorer";
import { AucGauge, RoadmapBar } from "@/components/projects/charts";
import { FreeCallBand } from "@/components/site/blocks";
import { Icon } from "@/components/site/icons";
import { cn } from "@/lib/utils";
import {
  consultingMethod,
  levers,
  portfolioStats,
  projects,
  toolsBuilt,
  westernHealth as wh,
  type Project,
} from "@/lib/content/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Applied AI projects by Dr. Afrooz Purarjomand — from an AI decision tool for Western Health's Hospital in the Home program to AI roadmaps, automation and products for industry.",
};

const leverName = (k: Project["levers"][number]) => levers.find((l) => l.key === k)?.name ?? k;

// Projects that get a custom visual are rendered separately below.
const FEATURED = new Set(["theme-park-roadmap", "ed-risk"]);

export default function ProjectsPage() {
  const roadmap = projects.find((p) => p.slug === "theme-park-roadmap")!;
  const edRisk = projects.find((p) => p.slug === "ed-risk")!;
  const rest = projects.filter((p) => !FEATURED.has(p.slug));

  return (
    <>
      {/* ───────── HERO ───────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-70 pointer-events-none" />
        <div aria-hidden className="absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-deep-violet/20 blur-[120px]" />
        <div aria-hidden className="absolute top-40 -left-40 h-[500px] w-[500px] rounded-full bg-electric-blue/10 blur-[120px]" />
        <Container className="relative pt-16 pb-16 lg:pt-24 lg:pb-20">
          <Reveal variant="blur">
            <p className="eyebrow mb-6">Projects</p>
            <h1 className="font-display text-[clamp(2.6rem,7vw,5.5rem)] font-semibold tracking-[-0.03em] leading-[0.98] max-w-5xl">
              AI in practice —{" "}
              <span className="font-serif italic font-normal gradient-text pr-2">not just in theory.</span>
            </h1>
            <p className="mt-7 text-lg lg:text-xl text-light-gray max-w-3xl leading-relaxed">
              Across healthcare, industry and higher education, I&apos;ve moved AI from concept to
              working systems that change how organisations decide, operate and serve their
              customers. Every project starts from a real business or clinical decision —
              and builds in governance, explainability and human oversight.
            </p>
          </Reveal>

          <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.08] lg:grid-cols-4">
            {portfolioStats.map((s, i) => (
              <Reveal key={s.label} delay={i * 100} className="bg-ink/90 p-6 lg:p-8">
                <CountUp
                  value={s.value}
                  prefix={s.prefix}
                  suffix={s.suffix}
                  className="block font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white"
                />
                <p className="mt-2 text-sm text-light-gray">{s.label}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ───────── FLAGSHIP: WESTERN HEALTH ───────── */}
      <section id="western-health" className="relative scroll-mt-24 py-20 lg:py-28">
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-transparent via-electric-blue/[0.04] to-transparent" />
        <Container className="relative">
          <Reveal>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-vivid-mint/15 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-vivid-mint">
                Flagship project
              </span>
              {[wh.client, wh.role, wh.when, `${wh.funding} funded`].map((t) => (
                <span key={t} className="rounded-full border border-white/10 px-3 py-1 text-xs text-light-gray">
                  {t}
                </span>
              ))}
            </div>
            <h2 className="mt-6 font-display text-3xl sm:text-4xl lg:text-6xl font-semibold tracking-tight leading-[1.02] max-w-4xl text-balance">
              Western at Home: AI for{" "}
              <span className="font-serif italic font-normal text-electric-blue">Hospital in the Home.</span>
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-10 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <p className="eyebrow mb-3 !text-amber-gold">The business problem</p>
              <p className="text-lg text-light-gray leading-relaxed">{wh.problem}</p>
            </Reveal>
            <Reveal delay={120} className="lg:col-span-5">
              <div className="rounded-2xl border border-white/10 bg-navy/50 p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">HITH divisions</p>
                <ul className="mt-4 space-y-3">
                  {wh.divisions.map((d) => (
                    <li key={d} className="flex items-center gap-3 text-white">
                      <span className="h-2 w-2 rounded-full bg-amber-gold" />
                      {d}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-5 text-center">
                  {[
                    { v: "10", l: "programs" },
                    { v: "21", l: "referral pathways" },
                    { v: "11k+", l: "staff" },
                  ].map((x) => (
                    <div key={x.l}>
                      <p className="font-display text-2xl font-semibold text-white">{x.v}</p>
                      <p className="text-[11px] text-muted">{x.l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* The signature diagram */}
          <Reveal variant="scale" className="mt-14">
            <div className="grain relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-navy/90 via-ink to-[#120d2e] p-6 sm:p-10">
              <div aria-hidden className="absolute inset-0 hero-grid opacity-40" />
              <div className="relative">
                <p className="eyebrow">How AI changed the process</p>
                <h3 className="mt-3 font-display text-2xl sm:text-3xl font-semibold text-white">
                  From 21 pathways to one AI-supported decision.
                </h3>
                <div className="mt-8">
                  <HithFlow />
                </div>
              </div>
            </div>
          </Reveal>

          {/* What we did */}
          <div className="mt-20">
            <Reveal>
              <p className="eyebrow mb-3">What we did</p>
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-white">
                Evidence first, then the AI.
              </h3>
            </Reveal>
            <ol className="mt-8 grid gap-4 md:grid-cols-5">
              {wh.steps.map((s, i) => (
                <Reveal as="li" key={s.title} delay={i * 110} className="relative">
                  <div className={cn(
                    "h-full rounded-2xl border p-5 transition-colors",
                    i === wh.steps.length - 1
                      ? "border-electric-blue/50 bg-electric-blue/[0.08] shadow-glow-blue"
                      : "border-white/10 bg-navy/40",
                  )}>
                    <span className="font-mono text-xs text-electric-blue">{String(i + 1).padStart(2, "0")}</span>
                    <h4 className="mt-3 font-display text-lg font-semibold leading-snug text-white">{s.title}</h4>
                    <p className="mt-2 text-sm text-light-gray leading-relaxed">{s.body}</p>
                    <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">{s.tag}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>

          {/* Impact */}
          <div className="mt-20 grid gap-10 lg:grid-cols-12">
            <Reveal className="lg:col-span-4">
              <p className="eyebrow mb-3">How AI improved the business</p>
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-white">
                Better decisions. More capacity. A clearer strategy.
              </h3>
              <p className="mt-4 text-light-gray">
                I led a team of three research assistants and coordinated clinical,
                operational and policy stakeholders across the organisation.
              </p>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
              {wh.impact.map((m, i) => (
                <Reveal key={m.title} delay={i * 100}>
                  <SpotlightCard className="h-full p-6">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-electric-blue/10 text-electric-blue">
                      <Icon name={m.icon} className="h-5 w-5" />
                    </span>
                    <h4 className="mt-4 font-display text-xl font-semibold text-white">{m.title}</h4>
                    <p className="mt-2 text-sm text-light-gray leading-relaxed">{m.body}</p>
                  </SpotlightCard>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Outputs */}
          <Reveal className="mt-12 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Published outputs</p>
            <ul className="mt-4 grid gap-3 md:grid-cols-2">
              {wh.outputs.map((o) => (
                <li key={o} className="flex gap-3 text-sm text-light-gray">
                  <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-vivid-mint" />
                  {o}
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      {/* ───────── VALUE LEVERS ───────── */}
      <Section
        eyebrow="How AI created value"
        title={<>Five ways AI improved strategy, processes and <span className="font-serif italic font-normal text-electric-blue">efficiency.</span></>}
        description="Choose a value lever to see which projects delivered it."
      >
        <Reveal>
          <LeverExplorer />
        </Reveal>
      </Section>

      {/* ───────── INDUSTRY & CONSULTANCY ───────── */}
      <Section
        eyebrow="Industry & consultancy"
        title="Strategy, automation and AI products — for real clients."
      >
        {/* Roadmap feature */}
        <Reveal id={roadmap.slug} className="scroll-mt-28">
          <div className="rounded-[2rem] border border-white/10 bg-navy/40 p-6 sm:p-10">
            <ProjectHeader p={roadmap} />
            <div className="mt-8 grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <p className="text-light-gray leading-relaxed">{roadmap.summary}</p>
                <ProjectLists p={roadmap} />
              </div>
              <div className="lg:col-span-7">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted mb-4">
                  21 opportunities, re-ordered by constraint
                </p>
                <RoadmapBar />
                <div className="mt-8 grid grid-cols-3 gap-3">
                  {["Review intelligence", "Segmented forecast", "Rostering optimiser"].map((t, i) => (
                    <div key={t} className="rounded-xl border border-white/10 p-3">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-electric-blue">
                        Months {i * 3}–{i * 3 + 3}
                      </p>
                      <p className="mt-1 text-sm text-white">{t}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {rest.map((p, i) => (
            <Reveal key={p.slug} id={p.slug} delay={(i % 2) * 100} className="scroll-mt-28">
              <SpotlightCard className="h-full p-6 sm:p-8">
                <ProjectHeader p={p} />
                <p className="mt-5 text-light-gray leading-relaxed">{p.summary}</p>
                <ProjectLists p={p} />
              </SpotlightCard>
            </Reveal>
          ))}
        </div>

        {/* ED risk feature */}
        <Reveal id={edRisk.slug} className="mt-6 scroll-mt-28">
          <div className="rounded-[2rem] border border-white/10 bg-navy/40 p-6 sm:p-10">
            <ProjectHeader p={edRisk} />
            <div className="mt-8 grid items-center gap-10 lg:grid-cols-12">
              <div className="lg:col-span-6">
                <p className="text-light-gray leading-relaxed">{edRisk.summary}</p>
                <ProjectLists p={edRisk} />
              </div>
              <div className="flex flex-wrap justify-center gap-10 lg:col-span-6">
                <AucGauge value={0.872} label="Predicting patients who leave before being seen" />
                <AucGauge value={0.91} label="Predicting crisis stabilisation unit admission" />
              </div>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* ───────── TOOLS BUILT ───────── */}
      <Section
        eyebrow="AI products & tools built"
        title={<>I don&apos;t just advise — <span className="font-serif italic font-normal text-electric-blue">I build.</span></>}
        description="Working AI systems, each made for a real user group and put into use."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {toolsBuilt.map((t, i) => (
            <Reveal key={t.name} delay={(i % 5) * 70}>
              <SpotlightCard tilt className="flex h-full flex-col p-5">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-electric-blue/25 to-deep-violet/25 text-electric-blue">
                  <Icon name="spark" className="h-4 w-4" />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold leading-snug text-white">{t.name}</h3>
                <p className="mt-1 text-xs text-muted">{t.users}</p>
                <p className="mt-3 flex-1 text-sm text-light-gray leading-relaxed">{t.does}</p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {t.stack.map((s) => (
                    <li key={s} className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-light-gray">
                      {s}
                    </li>
                  ))}
                </ul>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ───────── METHOD ───────── */}
      <Section
        eyebrow="My consulting method"
        title="The thread through every project."
      >
        <ol className="grid gap-px overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.08] md:grid-cols-4">
          {consultingMethod.map((m, i) => (
            <Reveal as="li" key={m.title} delay={i * 110} className="bg-ink p-7">
              <span className="font-mono text-xs text-electric-blue">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 font-display text-xl font-semibold text-white">{m.title}</h3>
              <p className="mt-2 text-sm text-light-gray leading-relaxed">{m.body}</p>
            </Reveal>
          ))}
        </ol>
        <Reveal className="mt-8 text-sm text-light-gray">
          Looking for the full research record?{" "}
          <Link href="/publications" className="text-electric-blue hover:underline">
            See publications →
          </Link>
        </Reveal>
      </Section>

      <FreeCallBand
        eyebrow="Your project could be next"
        title={<>Want results like these in <span className="font-serif italic font-normal gradient-text">your business?</span></>}
        body="Book a free 30-minute strategy call. We'll look at where AI could improve your decisions, processes and efficiency — and what a practical first project would look like."
      />
    </>
  );
}

function ProjectHeader({ p }: { p: Project }) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-electric-blue">{p.sector}</span>
        <span className="text-muted">·</span>
        <span className="text-xs text-light-gray">{p.role}</span>
        {p.when && (
          <>
            <span className="text-muted">·</span>
            <span className="text-xs text-light-gray">{p.when}</span>
          </>
        )}
      </div>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-2xl font-semibold leading-tight text-white">{p.title}</h3>
          <p className="mt-1 text-sm text-muted">{p.client}</p>
        </div>
        {p.metric && (
          <div className="text-right">
            <p className="font-display text-3xl font-semibold gradient-text">{p.metric.value}</p>
            <p className="max-w-[10rem] text-xs text-light-gray">{p.metric.label}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectLists({ p }: { p: Project }) {
  return (
    <div className="mt-6 grid gap-6 sm:grid-cols-2">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-deep-violet">How AI was used</p>
        <ul className="mt-3 space-y-2">
          {p.ai.map((a) => (
            <li key={a} className="flex gap-2 text-sm text-white/85">
              <Icon name="spark" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-deep-violet" />
              {a}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-vivid-mint">Business value</p>
        <ul className="mt-3 space-y-2">
          {p.outcomes.map((o) => (
            <li key={o} className="flex gap-2 text-sm text-white/85">
              <Icon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-vivid-mint" />
              {o}
            </li>
          ))}
        </ul>
      </div>
      <ul className="flex flex-wrap gap-1.5 sm:col-span-2">
        {p.levers.map((l) => (
          <li key={l} className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[11px] text-light-gray">
            {leverName(l)}
          </li>
        ))}
      </ul>
    </div>
  );
}
