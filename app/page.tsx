import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { NeuralField } from "@/components/motion/neural-field";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { ProcessTimeline } from "@/components/motion/process-timeline";
import { ScrollText } from "@/components/motion/scroll-text";
import { ReadinessCheck } from "@/components/site/readiness-check";
import { FaqList, FreeCallBand, Marquee } from "@/components/site/blocks";
import { Icon } from "@/components/site/icons";
import { cn } from "@/lib/utils";
import {
  capabilities,
  faqs,
  howIWork,
  practiceAreas,
  sectors,
  whyMe,
} from "@/lib/content/practice";
import { getServices } from "@/lib/services/queries";
import { formatServicePrice } from "@/lib/tax";

const HEADLINE = ["Make", "AI", "*work*", "for", "your", "business."];

const callAgenda = [
  { t: "0–5 min", h: "Your business & goals", p: "Where you are today and what you want to improve." },
  { t: "5–15 min", h: "Opportunities", p: "Where AI could save time, cut costs or lift quality." },
  { t: "15–25 min", h: "Readiness & risk", p: "Data, people, privacy and governance to plan for." },
  { t: "25–30 min", h: "Your next step", p: "One practical action — whether or not we work together." },
];

// Bento layout: which practice areas span two columns on large screens.
const WIDE = new Set(["ai-strategy", "healthcare-ai"]);

export default async function HomePage() {
  const services = await getServices();

  return (
    <>
      {/* ───────────── HERO ───────────── */}
      <section className="relative -mt-20 overflow-hidden pt-20">
        <NeuralField className="absolute inset-0 h-full w-full opacity-70" />
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(124,58,237,0.22),transparent_55%),radial-gradient(ellipse_at_10%_80%,rgba(0,194,255,0.14),transparent_50%)]" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />

        <Container className="relative grid items-center gap-14 pt-16 pb-24 lg:grid-cols-12 lg:pt-24 lg:pb-32">
          <div className="lg:col-span-7">
            <p className="animate-rise-in inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-light-gray backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-vivid-mint" />
              AI strategy · implementation · training
            </p>

            <h1 className="word-rise mt-7 font-display text-[clamp(2.75rem,7.5vw,6rem)] font-semibold leading-[0.95] tracking-[-0.035em] text-white">
              {HEADLINE.map((w, i) => {
                const accent = w.startsWith("*");
                return (
                  <React.Fragment key={w}>
                    <span
                      style={{ animationDelay: `${150 + i * 90}ms` }}
                      className={cn(accent && "font-serif italic font-normal pr-1")}
                    >
                      {accent ? <span className="gradient-text">{w.replace(/\*/g, "")}</span> : w}
                    </span>{" "}
                  </React.Fragment>
                );
              })}
            </h1>

            <p className="animate-rise-in mt-7 max-w-xl text-lg lg:text-xl leading-relaxed text-light-gray [animation-delay:700ms]">
              I help leadership teams decide where AI fits, implement it responsibly and make
              it stick — combining peer-reviewed research with hands-on enterprise consulting.
            </p>

            <div className="animate-rise-in mt-10 flex flex-wrap items-center gap-4 [animation-delay:850ms]">
              <Link
                href="/strategy-call"
                className="group inline-flex items-center gap-3 rounded-full bg-electric-blue px-7 py-4 font-semibold text-ink transition hover:shadow-[0_0_48px_rgba(0,194,255,0.55)]"
              >
                Book a free 30-min strategy call
                <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-electric-blue transition-transform group-hover:translate-x-1">
                  <Icon name="arrow" className="h-3.5 w-3.5" />
                </span>
              </Link>
              <Link
                href="#services"
                className="rounded-full border border-white/15 px-7 py-4 font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
              >
                Explore services
              </Link>
            </div>

            <ul className="animate-rise-in mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-light-gray [animation-delay:1000ms]">
              {["Free, no obligation", "30 minutes on Google Meet", "Independent advice"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Icon name="check" className="h-4 w-4 text-vivid-mint" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Portrait */}
          <div className="relative mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-none animate-rise-in [animation-delay:400ms]">
            <div aria-hidden className="absolute -inset-6 rounded-full border border-dashed border-electric-blue/20 animate-spin-slow" />
            <div aria-hidden className="absolute -inset-16 rounded-full border border-white/[0.04]" />
            <div className="gradient-border relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-navy">
              <Image
                src="/headshot.jpg"
                alt="Dr. Afrooz Purarjomand"
                fill
                priority
                sizes="(min-width: 1024px) 38vw, 90vw"
                className="object-cover object-top"
              />
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/90 to-transparent" />
              <div className="absolute inset-x-5 bottom-5">
                <p className="font-display text-xl font-semibold text-white">Dr. Afrooz Purarjomand</p>
                <p className="text-sm text-light-gray">AI/ML &amp; GenAI Specialist · Assistant Professor</p>
              </div>
            </div>

            <div className="absolute -left-4 top-10 sm:-left-10 animate-float rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 shadow-2xl backdrop-blur-xl">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-electric-blue">Research</p>
              <p className="text-sm font-medium text-white">Peer-reviewed GenAI</p>
            </div>
            <div className="absolute -right-3 top-1/2 sm:-right-8 animate-float [animation-delay:2s] rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 shadow-2xl backdrop-blur-xl">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-deep-violet">Faculty</p>
              <p className="text-sm font-medium text-white">Bond University</p>
            </div>
          </div>
        </Container>
      </section>

      {/* ───────────── MARQUEE ───────────── */}
      <div className="border-y border-white/[0.06] bg-white/[0.015]">
        <Marquee items={capabilities} />
      </div>

      {/* ───────────── STATEMENT ───────────── */}
      <section className="py-28 lg:py-40">
        <Container>
          <p className="eyebrow mb-8">Where research meets reality</p>
          <ScrollText
            className="font-display text-3xl sm:text-4xl lg:text-[3.4rem] font-semibold leading-[1.12] tracking-tight max-w-5xl"
            text="Most AI projects stall somewhere between the impressive demo and the business case. I help you close that gap — choosing the *right* problems, building with *evidence*, and leaving your team able to carry it forward."
          />
        </Container>
      </section>

      {/* ───────────── SERVICES ───────────── */}
      <Section
        id="services"
        eyebrow="What I do"
        title={<>AI expertise for every stage of <span className="font-serif italic font-normal text-electric-blue">adoption.</span></>}
        description="From your first conversation about AI to scaling it across the organisation — strategy, implementation, advisory, governance and training under one roof."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {practiceAreas.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 90} className={cn(WIDE.has(p.slug) && "lg:col-span-2")}>
              <Link href={`/services/${p.slug}`} className="block h-full rounded-2xl">
                <SpotlightCard tilt className="group flex h-full flex-col p-7 lg:p-8">
                  <div className="flex items-start justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl border border-electric-blue/25 bg-electric-blue/10 text-electric-blue transition-all duration-500 group-hover:scale-110 group-hover:bg-electric-blue group-hover:text-ink">
                      <Icon name={p.icon} className="h-6 w-6" />
                    </span>
                    <span className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-light-gray transition-all duration-300 group-hover:-rotate-45 group-hover:border-electric-blue group-hover:text-electric-blue">
                      <Icon name="arrow" className="h-4 w-4" />
                    </span>
                  </div>
                  <h3 className="mt-8 font-display text-2xl font-semibold tracking-tight text-white">{p.name}</h3>
                  <p className="mt-3 text-light-gray leading-relaxed max-w-lg">{p.summary}</p>
                  {WIDE.has(p.slug) && (
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {p.deliverables.slice(0, 4).map((d) => (
                        <li key={d.title} className="rounded-full border border-white/10 px-3 py-1 text-xs text-light-gray">
                          {d.title}
                        </li>
                      ))}
                    </ul>
                  )}
                </SpotlightCard>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ───────────── FREE STRATEGY CALL ───────────── */}
      <section className="relative py-20 lg:py-28">
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-transparent via-deep-violet/[0.07] to-transparent" />
        <Container className="relative grid items-center gap-14 lg:grid-cols-2">
          <Reveal variant="left">
            <span className="inline-flex items-center gap-2 rounded-full border border-vivid-mint/40 bg-vivid-mint/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-vivid-mint">
              <span className="h-1.5 w-1.5 rounded-full bg-vivid-mint animate-pulse" />
              Free · no obligation
            </span>
            <h2 className="mt-6 font-display text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.02] text-white text-balance">
              30 minutes that could change how you <span className="font-serif italic font-normal gradient-text">use AI.</span>
            </h2>
            <p className="mt-6 text-lg text-light-gray leading-relaxed max-w-xl">
              Not sure where to start, or worried about getting it wrong? Book a free strategy
              call. You&apos;ll get honest, expert advice on AI adoption for your business — and
              leave with a clear next step.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 max-w-xl">
              {[
                "For business owners & executives",
                "Strategy, not a sales pitch",
                "Tailored to your industry",
                "Reply within one business day",
              ].map((t) => (
                <p key={t} className="flex items-center gap-2 text-sm text-white">
                  <Icon name="check" className="h-4 w-4 text-vivid-mint" />
                  {t}
                </p>
              ))}
            </div>
            <Link
              href="/strategy-call"
              className="group mt-10 inline-flex items-center gap-3 rounded-full bg-vivid-mint px-7 py-4 font-semibold text-ink transition hover:shadow-glow-mint"
            >
              Book my free strategy call
              <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>

          <Reveal variant="right" delay={120}>
            <div className="gradient-border relative rounded-3xl bg-navy/70 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div className="flex items-center gap-3">
                  <div className="relative h-11 w-11 overflow-hidden rounded-full ring-2 ring-electric-blue/40">
                    <Image src="/headshot.jpg" alt="" fill sizes="44px" className="object-cover object-top" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">AI strategy call</p>
                    <p className="text-xs text-light-gray">with Dr. Afrooz · Google Meet</p>
                  </div>
                </div>
                <span className="rounded-full bg-vivid-mint/15 px-3 py-1 font-mono text-xs text-vivid-mint">$0</span>
              </div>
              <ol className="mt-6 space-y-5">
                {callAgenda.map((a, i) => (
                  <Reveal as="li" key={a.h} delay={200 + i * 120} variant="right" className="flex gap-4">
                    <span className="w-20 shrink-0 pt-0.5 font-mono text-[11px] uppercase tracking-wider text-electric-blue">
                      {a.t}
                    </span>
                    <div>
                      <p className="font-medium text-white">{a.h}</p>
                      <p className="text-sm text-light-gray">{a.p}</p>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ───────────── READINESS CHECK ───────────── */}
      <Section
        id="readiness"
        eyebrow="AI readiness check"
        title={<>Where does your business stand on AI? <span className="font-serif italic font-normal text-electric-blue">Find out in 60 seconds.</span></>}
        description="Five quick questions. You'll get your AI maturity stage and the next step that usually pays off most at that stage."
      >
        <Reveal variant="scale">
          <ReadinessCheck />
        </Reveal>
      </Section>

      {/* ───────────── WHY ME ───────────── */}
      <Section>
        <div className="grid items-center gap-14 lg:grid-cols-12">
          <Reveal variant="left" className="lg:col-span-5">
            <div className="relative">
              <div aria-hidden className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-electric-blue/30 via-deep-violet/20 to-transparent blur-2xl" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10">
                <Image src="/headshot.jpg" alt="Dr. Afrooz Purarjomand" fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover object-top" />
              </div>
              <blockquote className="relative -mt-16 mx-4 sm:mx-8 rounded-2xl border border-white/10 bg-ink/85 p-6 backdrop-blur-xl">
                <p className="font-serif text-xl italic leading-snug text-white">
                  &ldquo;AI is not a replacement — it is a multiplier for human expertise when
                  deployed strategically.&rdquo;
                </p>
              </blockquote>
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow mb-4">Why work with me</p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-[1.05] text-balance">
                An academic&apos;s rigour. <span className="font-serif italic font-normal text-electric-blue">A consultant&apos;s pragmatism.</span>
              </h2>
              <p className="mt-6 text-lg text-light-gray leading-relaxed">
                As an AI/ML and GenAI specialist and Assistant Professor at Bond University, I
                spend my time where AI research is heading — and my consulting time making
                sure it delivers for real organisations.
              </p>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {whyMe.map((w, i) => (
                <Reveal key={w.title} delay={i * 100}>
                  <div className="h-full border-l-2 border-electric-blue/40 pl-5 transition-colors hover:border-electric-blue">
                    <h3 className="font-display text-lg font-semibold text-white">{w.title}</h3>
                    <p className="mt-2 text-sm text-light-gray leading-relaxed">{w.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={300}>
              <Link href="/about" className="group mt-10 inline-flex items-center gap-2 font-semibold text-electric-blue">
                More about Dr. Afrooz
                <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* ───────────── SELECTED PROJECTS ───────────── */}
      <Section
        eyebrow="Selected projects"
        title={<>AI that&apos;s already <span className="font-serif italic font-normal text-electric-blue">at work.</span></>}
        description="From hospital decision-making to theme-park strategy and small-business automation — practical AI, delivered."
      >
        <div className="grid gap-5 lg:grid-cols-12">
          <Reveal variant="left" className="lg:col-span-7 lg:row-span-3">
            <Link href="/projects#western-health" className="group block h-full rounded-[2rem]">
              <div className="gradient-border grain relative flex h-full flex-col justify-between overflow-hidden rounded-[2rem] bg-gradient-to-br from-navy via-ink to-[#120d2e] p-8 lg:p-10">
                <div aria-hidden className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-electric-blue/20 blur-[90px] transition-transform duration-700 group-hover:scale-125" />
                <div className="relative">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-vivid-mint/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-vivid-mint">Flagship · Healthcare</span>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-light-gray">Chief Investigator · 2023–2025</span>
                  </div>
                  <h3 className="mt-6 font-display text-3xl lg:text-4xl font-semibold leading-tight text-white">
                    Western Health: an AI decision tool for Hospital in the Home
                  </h3>
                  <p className="mt-4 max-w-xl text-light-gray leading-relaxed">
                    10 programs, 3 divisions and 21 referral pathways brought together into one
                    evidence base — with machine learning and predictive modelling supporting
                    patient selection and allocation.
                  </p>
                </div>
                <div className="relative mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
                  {[
                    { v: "+15%", l: "at-home capacity informed" },
                    { v: "21 → 1", l: "referral pathways" },
                    { v: "$231k", l: "funded project" },
                  ].map((x) => (
                    <div key={x.l}>
                      <p className="font-display text-2xl lg:text-3xl font-semibold gradient-text">{x.v}</p>
                      <p className="mt-1 text-xs text-light-gray">{x.l}</p>
                    </div>
                  ))}
                </div>
                <span className="relative mt-8 inline-flex items-center gap-2 text-sm font-semibold text-electric-blue">
                  Read the case study
                  <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </Reveal>
          {[
            { href: "/projects#theme-park-roadmap", tag: "Strategy · Tourism", t: "Dreamworld AI opportunity roadmap", v: "21", l: "opportunities sequenced" },
            { href: "/projects#ema-beauty", tag: "Automation · SME", t: "Ema Beauty booking platform", v: "24/7", l: "self-service booking" },
            { href: "/projects#ai-front-desk", tag: "Small business", t: "AI Front Desk & Quote Engine", v: "6", l: "AI challenge themes from 67 businesses" },
          ].map((c, i) => (
            <Reveal key={c.t} variant="right" delay={i * 110} className="lg:col-span-5">
              <Link href={c.href} className="group block h-full rounded-2xl">
                <SpotlightCard className="flex h-full items-center justify-between gap-6 p-6">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-electric-blue">{c.tag}</p>
                    <h3 className="mt-2 font-display text-lg font-semibold text-white">{c.t}</h3>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-display text-3xl font-semibold text-white">{c.v}</p>
                    <p className="max-w-[9rem] text-[11px] text-light-gray">{c.l}</p>
                  </div>
                </SpotlightCard>
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8">
          <Link href="/projects" className="group inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 font-semibold text-white transition hover:border-electric-blue hover:text-electric-blue">
            See all projects
            <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </Section>

      {/* ───────────── PROCESS ───────────── */}
      <Section>
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal className="lg:sticky lg:top-32">
              <p className="eyebrow mb-4">How we work</p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-[1.05] text-balance">
                Clarity from the <span className="font-serif italic font-normal text-electric-blue">first conversation.</span>
              </h2>
              <p className="mt-6 text-lg text-light-gray leading-relaxed">
                A clear, staged path from &ldquo;should we be using AI?&rdquo; to AI that
                delivers measurable value — with decision points along the way, so you never
                commit more than the evidence supports.
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <ProcessTimeline steps={howIWork} />
          </div>
        </div>
      </Section>

      {/* ───────────── SECTORS ───────────── */}
      <Section
        eyebrow="Who I work with"
        title="Built for organisations that want AI done properly."
      >
        <div className="grid gap-px overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-3">
          {sectors.map((s, i) => (
            <Reveal key={s.name} delay={(i % 3) * 80} className="bg-ink">
              <div className="group h-full p-8 transition-colors hover:bg-navy/80">
                <h3 className="font-display text-xl font-semibold text-white group-hover:text-electric-blue transition-colors">
                  {s.name}
                </h3>
                <p className="mt-2 text-sm text-light-gray">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ───────────── PAID SESSIONS ───────────── */}
      <Section
        eyebrow="Book a session"
        title="Ready to go deeper? Book a focused working session."
        description="Fixed-price sessions you can book and pay for online, with a written summary afterwards."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.slug} delay={i * 100}>
              <SpotlightCard
                className={cn(
                  "flex h-full flex-col p-7",
                  service.highlight && "gradient-border shadow-glow-blue",
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-electric-blue">
                    {service.duration_minutes} min
                  </span>
                  {service.highlight && (
                    <span className="rounded-full bg-electric-blue px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-ink">
                      Most chosen
                    </span>
                  )}
                </div>
                <h3 className="mt-5 font-display text-2xl font-semibold text-white">{service.name}</h3>
                <p className="mt-2 text-light-gray text-sm leading-relaxed">{service.tagline}</p>
                <ul className="mt-6 flex-1 space-y-2.5">
                  {service.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-light-gray">
                      <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-electric-blue" />
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
                  <span className="font-display text-2xl font-semibold text-white">
                    {formatServicePrice(service.price_cents, service.currency)}
                  </span>
                  <Link
                    href={`/book/${service.slug}`}
                    className="rounded-full border border-electric-blue/40 px-4 py-2 text-sm font-semibold text-electric-blue transition hover:bg-electric-blue hover:text-ink"
                  >
                    Book
                  </Link>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8 text-center text-sm text-light-gray">
          Not sure which to choose?{" "}
          <Link href="/strategy-call" className="text-vivid-mint hover:underline">
            Start with the free strategy call →
          </Link>
        </Reveal>
      </Section>

      {/* ───────────── FAQ ───────────── */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <p className="eyebrow mb-4">Frequently asked questions</p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-white leading-[1.05]">
              Good questions. <span className="font-serif italic font-normal text-electric-blue">Clear answers.</span>
            </h2>
            <p className="mt-5 text-light-gray">
              Can&apos;t see yours?{" "}
              <Link href="/contact" className="text-electric-blue hover:underline">
                Send me a message.
              </Link>
            </p>
          </Reveal>
          <div className="lg:col-span-8">
            <FaqList items={faqs} />
          </div>
        </div>
      </Section>

      <FreeCallBand />
    </>
  );
}
