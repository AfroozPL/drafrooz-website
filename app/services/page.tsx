import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { ProcessTimeline } from "@/components/motion/process-timeline";
import { FaqList, FreeCallBand } from "@/components/site/blocks";
import { Icon } from "@/components/site/icons";
import { cn } from "@/lib/utils";
import { faqs, howIWork, practiceAreas } from "@/lib/content/practice";
import { getServices } from "@/lib/services/queries";
import { formatServicePrice } from "@/lib/tax";

export const metadata: Metadata = {
  title: "AI Consulting Services",
  description:
    "AI strategy, implementation, advisory, generative AI, governance and training for businesses and healthcare — plus a free 30-minute strategy call.",
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-70 pointer-events-none" />
        <div aria-hidden className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-deep-violet/20 blur-[120px]" />
        <Container className="relative pt-16 pb-12 lg:pt-24">
          <Reveal variant="blur">
            <p className="eyebrow mb-6">Services</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-semibold tracking-tight leading-[0.98] max-w-4xl text-balance">
              A connected approach to AI.{" "}
              <span className="font-serif italic font-normal gradient-text">A clearer way forward.</span>
            </h1>
            <p className="mt-6 text-lg lg:text-xl text-light-gray max-w-2xl leading-relaxed">
              AI works best when strategy, implementation, governance and people all serve the
              same goal. Choose one area — or let&apos;s work out together which you need first.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/strategy-call" className="rounded-full bg-electric-blue px-6 py-3.5 font-semibold text-ink transition hover:shadow-glow-blue">
                Book a free strategy call
              </Link>
              <Link href="#sessions" className="rounded-full border border-white/15 px-6 py-3.5 font-semibold text-white transition hover:border-white/40">
                See fixed-price sessions
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>

      <Section>
        <div className="grid gap-5 md:grid-cols-2">
          {practiceAreas.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 2) * 100} variant={i % 2 ? "right" : "left"}>
              <Link href={`/services/${p.slug}`} className="block h-full rounded-2xl">
                <SpotlightCard className="group h-full p-7 lg:p-9">
                  <div className="flex items-center gap-4">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl border border-electric-blue/25 bg-electric-blue/10 text-electric-blue transition-all duration-500 group-hover:bg-electric-blue group-hover:text-ink">
                      <Icon name={p.icon} className="h-6 w-6" />
                    </span>
                    <h2 className="font-display text-2xl font-semibold tracking-tight text-white">{p.name}</h2>
                  </div>
                  <p className="mt-5 text-light-gray leading-relaxed">{p.summary}</p>
                  <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                    {p.deliverables.slice(0, 4).map((d) => (
                      <li key={d.title} className="flex items-start gap-2 text-sm text-white/85">
                        <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-electric-blue" />
                        {d.title}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-electric-blue">
                    Explore {p.name.toLowerCase()}
                    <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </SpotlightCard>
              </Link>
            </Reveal>
          ))}

          <Reveal delay={100}>
            <Link href="/strategy-call" className="block h-full rounded-2xl">
              <div className="group grain relative flex h-full flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-electric-blue to-deep-violet p-7 lg:p-9 text-ink">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/70">Not sure where to start?</p>
                  <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight">
                    Book a free 30-minute AI strategy call.
                  </h2>
                  <p className="mt-3 text-ink/80">We&apos;ll work out which of these you actually need — and in what order.</p>
                </div>
                <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-ink px-5 py-3 font-semibold text-white transition group-hover:gap-3">
                  Book my free call <Icon name="arrow" className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </Reveal>
        </div>
      </Section>

      <Section>
        <div className="grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-5 lg:sticky lg:top-32 self-start">
            <p className="eyebrow mb-4">How we work</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-[1.05]">
              Four steps from question to <span className="font-serif italic font-normal text-electric-blue">clarity.</span>
            </h2>
          </Reveal>
          <div className="lg:col-span-7">
            <ProcessTimeline steps={howIWork} />
          </div>
        </div>
      </Section>

      <Section
        id="sessions"
        eyebrow="Fixed-price sessions"
        title="Book a focused working session online."
        description="Transparent pricing. Pay securely with Stripe when you book, and get a written summary afterwards."
      >
        <div className="grid gap-6 lg:grid-cols-3">
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
                <p className="mt-2 text-electric-blue text-sm font-medium">{service.tagline}</p>
                <p className="mt-3 text-light-gray text-sm leading-relaxed">{service.description}</p>
                <ul className="mt-6 flex-1 space-y-2.5">
                  {service.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-light-gray">
                      <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-electric-blue" />
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 border-t border-white/10 pt-5">
                  <p className="font-display text-3xl font-semibold text-white mb-4">
                    {formatServicePrice(service.price_cents, service.currency)}
                  </p>
                  <div className="flex gap-3">
                    <Link
                      href={`/services/${service.slug}`}
                      className="flex-1 rounded-full border border-white/15 py-2.5 text-center text-sm font-semibold text-white transition hover:border-white/40"
                    >
                      Details
                    </Link>
                    <Link
                      href={`/book/${service.slug}`}
                      className="flex-1 rounded-full bg-electric-blue py-2.5 text-center text-sm font-semibold text-ink transition hover:shadow-glow-blue"
                    >
                      Book
                    </Link>
                  </div>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <p className="eyebrow mb-4">FAQ</p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-white leading-[1.05]">
              Good questions. <span className="font-serif italic font-normal text-electric-blue">Clear answers.</span>
            </h2>
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
