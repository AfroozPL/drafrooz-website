import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";

export const metadata: Metadata = { title: "Booking confirmed" };
export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{
    session_id?: string;
    demo?: string;
    service?: string;
    slot?: string;
  }>;
};

type Outcome =
  | { state: "confirmed"; service: string; slot: string; duration: number }
  | { state: "processing" }
  | { state: "unpaid" }
  | { state: "demo"; service?: string; slot?: string };

/**
 * Stripe returns the client here after Embedded Checkout. We confirm the
 * booking directly as well as via the webhook, so the client sees a real
 * result even if the webhook is delayed.
 */
async function resolveOutcome(params: Awaited<Props["searchParams"]>): Promise<Outcome> {
  if (!params.session_id) {
    return { state: "demo", service: params.service, slot: params.slot };
  }
  if (!process.env.STRIPE_SECRET_KEY) return { state: "unpaid" };

  const { getStripe } = await import("@/lib/stripe");
  const { confirmPaidBooking, formatSlotForHumans } = await import(
    "@/lib/booking/confirm"
  );
  try {
    const session = await getStripe().checkout.sessions.retrieve(
      params.session_id,
    );
    if (session.payment_status !== "paid") {
      return session.status === "complete"
        ? { state: "processing" }
        : { state: "unpaid" };
    }
    const booking = await confirmPaidBooking(session);
    return {
      state: "confirmed",
      service: booking?.serviceName ?? "Consultation",
      slot: formatSlotForHumans(session.metadata?.slot_start ?? ""),
      duration: booking?.durationMinutes ?? 0,
    };
  } catch (err) {
    // Unknown session id (mistyped or tampered URL) — nothing was paid.
    if ((err as { code?: string }).code === "resource_missing") {
      return { state: "unpaid" };
    }
    console.error("[success] could not confirm session", err);
    // Payment went through (Stripe redirected here); the webhook will retry.
    return { state: "processing" };
  }
}

const COPY: Record<Outcome["state"], { badge: string; title: string; body: string }> = {
  confirmed: {
    badge: "Confirmed",
    title: "Your session is booked.",
    body: "Payment received. A confirmation email is on its way to your inbox.",
  },
  processing: {
    badge: "Processing",
    title: "Payment received — finalising.",
    body: "We're confirming your booking now. You'll get a confirmation email within a few minutes.",
  },
  unpaid: {
    badge: "Not paid",
    title: "Payment wasn't completed.",
    body: "No charge was made. You can pick a time and try again.",
  },
  demo: {
    badge: "Preview",
    title: "Booking simulated.",
    body: "This is a local preview run — no charge was made, no emails sent.",
  },
};

export default async function BookingSuccessPage({ searchParams }: Props) {
  const outcome = await resolveOutcome(await searchParams);
  const copy = COPY[outcome.state];

  const detail =
    outcome.state === "confirmed"
      ? { service: outcome.service, slot: `${outcome.slot} · ${outcome.duration} min` }
      : outcome.state === "demo" && outcome.service && outcome.slot
        ? {
            service: outcome.service,
            slot: new Date(outcome.slot).toLocaleString("en-AU", {
              dateStyle: "full",
              timeStyle: "short",
            }),
          }
        : null;

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-50 pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-1 accent-bar" />
        <Container className="relative pt-20 pb-12 lg:pt-28 max-w-2xl">
          <Badge
            tone={outcome.state === "unpaid" ? "amber" : "mint"}
            className="mb-6"
          >
            {copy.badge}
          </Badge>
          <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
            {copy.title}
          </h1>
          <p className="mt-4 text-light-gray text-lg">{copy.body}</p>
        </Container>
      </section>

      <Section>
        <Card>
          <CardTitle className="mb-3">
            {outcome.state === "unpaid" ? "Try again?" : "What happens next"}
          </CardTitle>
          {detail && (
            <div className="surface-card p-4 mb-5 border-l-2 border-electric-blue">
              <p className="text-white font-bold">{detail.service}</p>
              <p className="text-light-gray text-sm">{detail.slot}</p>
            </div>
          )}
          {outcome.state !== "unpaid" && (
            <CardDescription>
              1. You'll receive a confirmation email with your session details.
              <br />
              2. Your video-call link arrives before the session.
              <br />
              3. After the call, a written summary lands in your inbox within 48
              hours.
            </CardDescription>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            {outcome.state === "unpaid" ? (
              <LinkButton href="/services" size="md">
                Choose a time
              </LinkButton>
            ) : (
              <LinkButton href="/dashboard" size="md">
                View my bookings
              </LinkButton>
            )}
            <LinkButton href="/services" variant="outline" size="md">
              Browse services
            </LinkButton>
          </div>
        </Card>
      </Section>
    </>
  );
}
