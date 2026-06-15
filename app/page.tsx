import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";
import { brand } from "@/lib/content/brand";
import { getServices } from "@/lib/services/queries";
import { formatCurrency } from "@/lib/utils";

export default async function HomePage() {
  const services = await getServices();

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-60 pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-1 accent-bar" />
        <div className="absolute -top-32 -right-40 w-[500px] h-[500px] rounded-full bg-electric-blue/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-32 w-[500px] h-[500px] rounded-full bg-deep-violet/10 blur-3xl pointer-events-none" />

        <Container className="relative pt-24 pb-28 lg:pt-32 lg:pb-36">
          <Badge tone="blue" className="mb-6">
            Version 1.0 · 2026
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight max-w-4xl text-balance leading-[1.05]">
            Where <span className="gradient-text">research</span> meets reality.
          </h1>
          <p className="mt-6 text-lg lg:text-xl text-light-gray max-w-2xl leading-relaxed">
            {brand.usp}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <LinkButton href="/services" size="lg">
              Book a consultation
            </LinkButton>
            <LinkButton href="/about" variant="outline" size="lg">
              About Dr. Afrooz
            </LinkButton>
          </div>

          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-3xl">
            {[
              { k: "Peer-reviewed", v: "GenAI research" },
              { k: "Enterprise", v: "AI strategy" },
              { k: "Healthcare", v: "data science" },
              { k: "Bond University", v: "Faculty" },
            ].map((item) => (
              <div key={item.k}>
                <p className="text-electric-blue text-xs font-bold tracking-[0.2em] uppercase">
                  {item.k}
                </p>
                <p className="text-light-gray text-sm mt-1">{item.v}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* VALUES */}
      <Section
        eyebrow="Brand Values"
        title="Four principles that ground every engagement."
        description="Rigour, impact, accessibility, integrity — the operating system behind the research, the teaching, and the consulting."
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {brand.values.map((v) => (
            <Card key={v.name} className="h-full">
              <Badge tone={v.tone} className="mb-4">
                {v.name}
              </Badge>
              <CardDescription>{v.description}</CardDescription>
            </Card>
          ))}
        </div>
      </Section>

      {/* SERVICES */}
      <Section
        eyebrow="Consulting"
        title="Paid AI consulting — research-grounded, action-oriented."
        description="Three engagement shapes for leadership teams ready to translate AI ambition into evidence-based strategy."
      >
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card
              key={service.slug}
              className={
                service.highlight
                  ? "ring-1 ring-electric-blue/40 shadow-glow-blue"
                  : ""
              }
            >
              <div className="flex items-center justify-between mb-4">
                <Badge tone={service.tone}>{service.duration_minutes} min</Badge>
                {service.highlight && (
                  <span className="text-xs text-electric-blue font-bold tracking-wider uppercase">
                    Most chosen
                  </span>
                )}
              </div>
              <CardTitle className="mb-2">{service.name}</CardTitle>
              <p className="text-electric-blue text-sm font-medium mb-3">
                {service.tagline}
              </p>
              <CardDescription className="mb-5">
                {service.description}
              </CardDescription>
              <ul className="space-y-2 mb-6">
                {service.bullets.map((b) => (
                  <li
                    key={b}
                    className="text-light-gray text-sm flex items-start gap-2"
                  >
                    <span className="text-electric-blue mt-1">▸</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between pt-4 border-t border-light-gray/10">
                <span className="text-white font-bold text-xl">
                  {formatCurrency(service.price_cents, service.currency)}
                </span>
                <LinkButton
                  href={`/services/${service.slug}`}
                  variant="outline"
                  size="sm"
                >
                  Details
                </LinkButton>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* KEY MESSAGES */}
      <Section
        eyebrow="Key Messages"
        title="The four convictions guiding the work."
      >
        <div className="grid md:grid-cols-2 gap-5">
          {brand.keyMessages.map((msg, i) => (
            <Card key={i}>
              <p className="text-electric-blue text-xs font-bold tracking-[0.2em] uppercase mb-3">
                0{i + 1}
              </p>
              <p className="text-white text-lg leading-relaxed">{msg}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-40 pointer-events-none" />
        <Container className="relative py-24 lg:py-32 text-center">
          <p className="text-electric-blue text-xs font-bold tracking-[0.2em] uppercase mb-5">
            {brand.tagline}
          </p>
          <h2 className="text-3xl lg:text-5xl font-bold text-white tracking-tight max-w-3xl mx-auto text-balance leading-tight">
            Turn AI hype into measurable strategy.
          </h2>
          <p className="mt-6 text-lg text-light-gray max-w-2xl mx-auto">
            Ready to talk through your highest-leverage AI opportunity? Start
            with a Discovery Call — 30 focused minutes, written summary
            included.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <LinkButton href="/services" size="lg">
              See consulting services
            </LinkButton>
            <LinkButton href="/contact" variant="ghost" size="lg">
              Or send a message →
            </LinkButton>
          </div>
        </Container>
      </section>
    </>
  );
}
