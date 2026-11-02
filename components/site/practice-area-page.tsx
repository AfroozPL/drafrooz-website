import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { FaqList, FreeCallBand } from "@/components/site/blocks";
import { Icon } from "@/components/site/icons";
import { practiceAreas, type PracticeArea } from "@/lib/content/practice";

export function PracticeAreaPage({ area }: { area: PracticeArea }) {
  const others = practiceAreas.filter((p) => p.slug !== area.slug).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-70 pointer-events-none" />
        <div aria-hidden className="absolute -top-32 -right-20 h-[520px] w-[520px] rounded-full bg-deep-violet/20 blur-[120px]" />
        <div aria-hidden className="absolute top-40 -left-40 h-[400px] w-[400px] rounded-full bg-electric-blue/10 blur-[120px]" />
        <Container className="relative pt-14 pb-16 lg:pt-20 lg:pb-24">
          <Reveal variant="down">
            <nav aria-label="Breadcrumb" className="mb-10 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
              <Link href="/services" className="hover:text-white">Services</Link>
              <span className="mx-2">/</span>
              <span className="text-light-gray">{area.name}</span>
            </nav>
          </Reveal>
          <div className="grid items-end gap-10 lg:grid-cols-12">
            <Reveal variant="blur" className="lg:col-span-8">
              <span className="grid h-14 w-14 place-items-center rounded-2xl border border-electric-blue/30 bg-electric-blue/10 text-electric-blue">
                <Icon name={area.icon} className="h-7 w-7" />
              </span>
              <p className="eyebrow mt-8">{area.name}</p>
              <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.0] text-balance">
                {area.headline}
              </h1>
              <p className="mt-6 text-lg lg:text-xl text-light-gray leading-relaxed max-w-2xl">{area.intro}</p>
            </Reveal>
            <Reveal variant="right" delay={150} className="lg:col-span-4">
              <div className="gradient-border rounded-3xl bg-navy/70 p-6 backdrop-blur-xl">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-vivid-mint">Free · 30 minutes</p>
                <p className="mt-3 font-display text-xl font-semibold text-white">
                  Talk through {area.name.toLowerCase()} for your business.
                </p>
                <Link
                  href="/strategy-call"
                  className="mt-6 flex items-center justify-center gap-2 rounded-full bg-electric-blue px-5 py-3.5 font-semibold text-ink transition hover:shadow-glow-blue"
                >
                  Book a free strategy call <Icon name="arrow" className="h-4 w-4" />
                </Link>
                <p className="mt-3 text-center text-xs text-muted">No obligation. Reply within one business day.</p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* What's included */}
      <Section eyebrow="What's included" title="What you get.">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {area.deliverables.map((d, i) => (
            <Reveal key={d.title} delay={(i % 3) * 90}>
              <SpotlightCard className="h-full p-7">
                <Icon name="check" className="h-6 w-6 text-electric-blue" />
                <h3 className="mt-5 font-display text-xl font-semibold text-white">{d.title}</h3>
                <p className="mt-2 text-sm text-light-gray leading-relaxed">{d.body}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Process */}
      <Section eyebrow="How it works" title="A clear path, step by step.">
        <ol className="relative grid gap-8 md:grid-cols-4">
          <div aria-hidden className="absolute left-0 right-0 top-5 hidden h-px bg-gradient-to-r from-electric-blue via-deep-violet to-vivid-mint opacity-40 md:block" />
          {area.process.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i * 140} className="relative">
              <span className="relative grid h-10 w-10 place-items-center rounded-full border border-electric-blue bg-ink font-mono text-xs text-electric-blue">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm text-light-gray leading-relaxed">{step.body}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* Is it right for you */}
      <Section>
        <Reveal variant="scale">
          <div className="grid gap-10 rounded-3xl bg-paper p-8 text-ink sm:p-12 lg:grid-cols-2">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-deep-violet">Is it right for you?</p>
              <h2 className="mt-4 font-display text-3xl sm:text-4xl font-semibold tracking-tight">
                This is a good fit if you&apos;re…
              </h2>
            </div>
            <ul className="space-y-4">
              {area.rightFor.map((r) => (
                <li key={r} className="flex gap-3 text-lg">
                  <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-deep-violet text-white">
                    <Icon name="check" className="h-3.5 w-3.5" />
                  </span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </Section>

      {/* FAQ */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <p className="eyebrow mb-4">FAQ</p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-white">
              Common questions
            </h2>
          </Reveal>
          <div className="lg:col-span-8">
            <FaqList items={area.faqs} />
          </div>
        </div>
      </Section>

      {/* Related */}
      <Section eyebrow="Related services" title="Often combined with">
        <div className="grid gap-5 md:grid-cols-3">
          {others.map((p, i) => (
            <Reveal key={p.slug} delay={i * 100}>
              <Link href={`/services/${p.slug}`} className="block h-full rounded-2xl">
                <SpotlightCard className="group h-full p-6">
                  <Icon name={p.icon} className="h-6 w-6 text-electric-blue" />
                  <h3 className="mt-4 font-display text-lg font-semibold text-white">{p.name}</h3>
                  <p className="mt-2 text-sm text-light-gray">{p.summary}</p>
                </SpotlightCard>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <FreeCallBand />
    </>
  );
}
