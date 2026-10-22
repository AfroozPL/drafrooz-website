import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";

export const dynamic = "force-dynamic";

/**
 * Stripe webhook — confirms a booking only AFTER payment succeeds.
 *
 *   checkout.session.completed / async_payment_succeeded
 *     → confirmPaidBooking (calendar event + client & owner emails)
 *   checkout.session.expired
 *     → release the slot hold
 *
 * Confirmation is idempotent, so a non-2xx response (which makes Stripe
 * retry) is safe and is used when the database write fails.
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

  let event: Stripe.Event;
  try {
    const { getStripe } = await import("@/lib/stripe");
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const { confirmPaidBooking } = await import("@/lib/booking/confirm");
        await confirmPaidBooking(event.data.object);
        break;
      }
      case "checkout.session.expired": {
        const bookingId = event.data.object.metadata?.booking_id;
        if (bookingId) {
          const { createSupabaseAdminClient } = await import(
            "@/lib/supabase/admin"
          );
          await createSupabaseAdminClient()
            .from("bookings")
            .update({ status: "cancelled" })
            .eq("id", bookingId)
            .eq("status", "pending");
        }
        break;
      }
    }
  } catch (err) {
    console.error(`[webhook] ${event.type} failed`, err);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
