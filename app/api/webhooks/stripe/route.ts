import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Stripe webhook — confirms a booking only AFTER payment succeeds.
 *
 * Flow:
 *   1. Verify the signature against STRIPE_WEBHOOK_SECRET.
 *   2. On `checkout.session.completed`, read metadata (service, slot, user).
 *   3. Create a Google Calendar event + Meet link.
 *   4. Insert a confirmed booking into Supabase.
 *   5. Email the client a confirmation.
 *
 * Returns 200 quickly; failures in side-effects are logged, not surfaced to
 * Stripe (which would otherwise retry indefinitely).
 */
export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 503 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await request.text();

  let event;
  try {
    const { getStripe } = await import("@/lib/stripe");
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as {
      id: string;
      payment_intent: string | null;
      customer_email: string | null;
      metadata: Record<string, string> | null;
    };
    const meta = session.metadata ?? {};

    try {
      const { createSupabaseAdminClient } = await import(
        "@/lib/supabase/admin"
      );
      const supabase = createSupabaseAdminClient();

      // Resolve the service id from the slug.
      const { data: service } = await supabase
        .from("services")
        .select("id, name, duration_minutes")
        .eq("slug", meta.service_slug)
        .maybeSingle();

      let meetLink = "";
      let eventId: string | null = null;

      // Create calendar event + Meet link (best-effort).
      if (process.env.GOOGLE_REFRESH_TOKEN) {
        try {
          const { createCalendarEvent } = await import("@/lib/google/calendar");
          const result = await createCalendarEvent({
            summary: `${service?.name ?? "Consultation"} — Dr. Afrooz Purarjomand`,
            description: meta.notes || undefined,
            startIso: meta.slot_start,
            endIso: meta.slot_end,
            attendeeEmail: session.customer_email ?? undefined,
          });
          meetLink = result.meetLink;
          eventId = result.eventId;
        } catch (e) {
          console.error("[webhook] calendar event failed", e);
        }
      }

      // Insert confirmed booking.
      if (service) {
        await supabase.from("bookings").insert({
          user_id: meta.user_id,
          service_id: service.id,
          slot_start: meta.slot_start,
          slot_end: meta.slot_end,
          status: "confirmed",
          stripe_session_id: session.id,
          stripe_payment_intent: session.payment_intent,
          google_event_id: eventId,
          meet_link: meetLink || null,
          notes: meta.notes || null,
          confirmed_at: new Date().toISOString(),
        });
      }

      // Send confirmation email (best-effort).
      if (process.env.RESEND_API_KEY && session.customer_email) {
        try {
          const { sendEmail } = await import("@/lib/email/send");
          const { BookingConfirmationEmail } = await import(
            "@/lib/email/templates/booking-confirmation"
          );
          await sendEmail({
            to: session.customer_email,
            subject: "Your consultation is confirmed",
            react: BookingConfirmationEmail({
              recipientName: session.customer_email.split("@")[0],
              serviceName: service?.name ?? "Consultation",
              slotStartHuman: new Date(meta.slot_start).toLocaleString(),
              durationMinutes: service?.duration_minutes ?? 30,
              meetLink: meetLink || "https://meet.google.com",
              notes: meta.notes || undefined,
            }),
          });
        } catch (e) {
          console.error("[webhook] confirmation email failed", e);
        }
      }
    } catch (err) {
      console.error("[webhook] processing error", err);
    }
  }

  return NextResponse.json({ received: true });
}
