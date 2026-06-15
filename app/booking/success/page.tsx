import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";

export const metadata: Metadata = { title: "Booking confirmed" };

type Props = {
  searchParams: Promise<{
    session_id?: string;
    demo?: string;
    service?: string;
    slot?: string;
  }>;
};

export default async function BookingSuccessPage({ searchParams }: Props) {
  const { demo, service, slot } = await searchParams;
  const slotLabel = slot
    ? new Date(slot).toLocaleString("en-AU", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-50 pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-1 accent-bar" />
        <Container className="relative pt-20 pb-12 lg:pt-28 max-w-2xl">
          <Badge tone="mint" className="mb-6">
            Confirmed
          </Badge>
          <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
            {demo ? "Booking simulated." : "Your session is confirmed."}
          </h1>
          <p className="mt-4 text-light-gray text-lg">
            {demo
              ? "This is a preview run — no charge was made, no calendar invite sent."
              : "A confirmation email with the Google Meet link is on its way."}
          </p>
        </Container>
      </section>

      <Section>
        <Card>
          <CardTitle className="mb-3">What happens next</CardTitle>
          {service && slotLabel && (
            <div className="surface-card p-4 mb-5 border-l-2 border-electric-blue">
              <p className="text-white font-bold">{service}</p>
              <p className="text-light-gray text-sm">{slotLabel}</p>
            </div>
          )}
          <CardDescription>
            1. You'll receive a calendar invite with the Meet link.
            <br />
            2. A short preparatory note will follow 24 hours before the session.
            <br />
            3. After the call, a written summary lands in your inbox within 48
            hours.
          </CardDescription>
          <div className="mt-6 flex gap-3">
            <LinkButton href="/dashboard" size="md">
              Go to dashboard
            </LinkButton>
            <LinkButton href="/services" variant="outline" size="md">
              Browse more
            </LinkButton>
          </div>
        </Card>
      </Section>
    </>
  );
}
