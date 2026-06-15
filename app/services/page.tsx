import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";
import { getServices } from "@/lib/services/queries";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Paid AI consulting engagements — research-grounded, action-oriented, transparently priced.",
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-50 pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-1 accent-bar" />
        <Container className="relative pt-20 pb-12 lg:pt-28">
          <Badge tone="blue" className="mb-6">
            Consulting
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight max-w-3xl text-balance leading-[1.05]">
            Research-grounded AI consulting,{" "}
            <span className="gradient-text">on your timeline.</span>
          </h1>
          <p className="mt-5 text-lg text-light-gray max-w-2xl leading-relaxed">
            Three engagement shapes for leadership teams ready to translate AI
            ambition into evidence-based strategy. Pricing is transparent.
            Payment is secured by Stripe at booking.
          </p>
        </Container>
      </section>

      <Section>
        <div className="grid lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card
              key={service.slug}
              className={`flex flex-col h-full ${
                service.highlight
                  ? "ring-1 ring-electric-blue/40 shadow-glow-blue"
                  : ""
              }`}
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
              <ul className="space-y-2 mb-6 flex-1">
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
              <div className="pt-4 border-t border-light-gray/10">
                <p className="text-white font-bold text-2xl mb-4">
                  {formatCurrency(service.price_cents, service.currency)}
                </p>
                <div className="flex gap-3">
                  <LinkButton
                    href={`/services/${service.slug}`}
                    variant="outline"
                    size="md"
                    className="flex-1"
                  >
                    Details
                  </LinkButton>
                  <LinkButton
                    href={`/book/${service.slug}`}
                    size="md"
                    className="flex-1"
                  >
                    Book
                  </LinkButton>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="How it works"
        title="Four steps from question to clarity."
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              n: "01",
              h: "Choose a service",
              p: "Pick the engagement shape that matches your question.",
            },
            {
              n: "02",
              h: "Pick a time",
              p: "Real-time availability — pay securely with Stripe.",
            },
            {
              n: "03",
              h: "Get a brief",
              p: "Pre-session, I prepare relevant research and questions.",
            },
            {
              n: "04",
              h: "Session + summary",
              p: "Google Meet call, written follow-up with concrete next steps.",
            },
          ].map((step) => (
            <Card key={step.n}>
              <p className="text-electric-blue text-xs font-bold tracking-[0.2em] uppercase mb-3">
                {step.n}
              </p>
              <CardTitle className="mb-2">{step.h}</CardTitle>
              <CardDescription>{step.p}</CardDescription>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="More services soon"
        title="Webinars, online courses, retainer engagements."
        description="The architecture is built to grow — webinars, on-demand courses, and ongoing retainer advisory are coming next. Subscribe to the newsletter for the launch."
      />
    </>
  );
}
