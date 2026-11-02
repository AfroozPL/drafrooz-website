import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { StrategyCallForm } from "@/components/site/strategy-call-form";
import { Icon } from "@/components/site/icons";
import { stages } from "@/lib/content/readiness";

export const metadata: Metadata = {
  title: "Book a free AI strategy call",
  description:
    "A free, no-obligation 30-minute call with Dr. Afrooz Purarjomand to talk through AI strategy, adoption and implementation for your business.",
};

type Props = { searchParams: Promise<{ stage?: string }> };

const agenda = [
  "Where your business is today and what you want to improve",
  "The AI opportunities most likely to pay off for you",
  "Risks, data and governance considerations to plan for",
  "A practical next step — whether or not we work together",
];

export default async function StrategyCallPage({ searchParams }: Props) {
  const { stage: stageParam } = await searchParams;
  const stage = stageParam && Object.hasOwn(stages, stageParam)
    ? (stageParam as keyof typeof stages)
    : undefined;

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 hero-grid opacity-70 pointer-events-none" />
      <div className="absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-deep-violet/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 -left-40 h-[500px] w-[500px] rounded-full bg-electric-blue/10 blur-[120px] pointer-events-none" />

      <Container className="relative pt-16 pb-24 lg:pt-24">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-6">
            <Reveal variant="blur">
              <span className="inline-flex items-center gap-2 rounded-full border border-vivid-mint/40 bg-vivid-mint/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-vivid-mint">
                <span className="h-1.5 w-1.5 rounded-full bg-vivid-mint animate-pulse" />
                Free · 30 minutes
              </span>
              <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.02] text-balance">
                Let&apos;s find your best{" "}
                <span className="font-serif italic font-normal gradient-text">first move</span>{" "}
                with AI.
              </h1>
              <p className="mt-6 text-lg text-light-gray leading-relaxed max-w-xl">
                Book a free 30-minute strategy call. We&apos;ll talk through your business, where
                AI could help, and what a sensible, responsible first step looks like. No
                pitch, no jargon, no obligation.
              </p>
            </Reveal>

            {stage && (
              <Reveal delay={100} className="mt-8 rounded-2xl border border-electric-blue/30 bg-electric-blue/5 p-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-electric-blue">
                  Your readiness check result
                </p>
                <p className="mt-2 text-white">
                  <strong>{stages[stage].name}.</strong>{" "}
                  <span className="text-light-gray">I&apos;ll come prepared to talk about it.</span>
                </p>
              </Reveal>
            )}

            <Reveal delay={150} className="mt-10">
              <h2 className="font-display text-xl font-semibold text-white">What we&apos;ll cover</h2>
              <ul className="mt-5 space-y-4">
                {agenda.map((item) => (
                  <li key={item} className="flex gap-3 text-light-gray">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-electric-blue/15 text-electric-blue">
                      <Icon name="check" className="h-3.5 w-3.5" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={250} className="mt-10 flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-full ring-2 ring-electric-blue/40">
                <Image src="/headshot.jpg" alt="" fill sizes="64px" className="object-cover object-top" />
              </div>
              <div>
                <p className="font-semibold text-white">Dr. Afrooz Purarjomand</p>
                <p className="text-sm text-light-gray">AI/ML &amp; GenAI Specialist · Bond University</p>
              </div>
            </Reveal>
          </div>

          <Reveal variant="right" delay={100} className="lg:col-span-6">
            <div className="gradient-border rounded-3xl bg-navy/70 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-electric-blue/15 text-electric-blue">
                  <Icon name="calendar" />
                </span>
                <div>
                  <p className="font-display text-lg font-semibold text-white">Request your call</p>
                  <p className="text-sm text-light-gray">I reply within one business day.</p>
                </div>
              </div>
              <StrategyCallForm stage={stage} />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
