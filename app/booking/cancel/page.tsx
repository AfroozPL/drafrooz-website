import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";

export const metadata: Metadata = { title: "Booking cancelled" };

export default function BookingCancelPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-50 pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-1 accent-bar" />
        <Container className="relative pt-20 pb-12 lg:pt-28 max-w-2xl">
          <Badge tone="amber" className="mb-6">
            Cancelled
          </Badge>
          <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
            Checkout cancelled.
          </h1>
          <p className="mt-4 text-light-gray text-lg">
            No charge was made and no time slot was reserved.
          </p>
        </Container>
      </section>
      <Section>
        <Card>
          <CardTitle className="mb-3">Try again?</CardTitle>
          <CardDescription>
            Pick a service and a time when you're ready. If you ran into an
            issue, send a message via{" "}
            <a href="/contact" className="text-electric-blue hover:underline">
              the contact page
            </a>{" "}
            and I'll help.
          </CardDescription>
          <div className="mt-6 flex gap-3">
            <LinkButton href="/services" size="md">
              See services
            </LinkButton>
            <LinkButton href="/" variant="outline" size="md">
              Back home
            </LinkButton>
          </div>
        </Card>
      </Section>
    </>
  );
}
