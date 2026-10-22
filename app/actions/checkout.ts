"use server";

import { z } from "zod";
import { getServiceBySlug } from "@/lib/services/queries";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  PAYMENT_HOLD_MINUTES,
  isSlotAvailable,
} from "@/lib/booking/availability";

const CheckoutSchema = z.object({
  serviceSlug: z.string().min(1),
  slotStart: z.string().datetime(),
  notes: z.string().max(1000).optional(),
});

type CheckoutResult =
  | { ok: true; clientSecret: string }
  | { ok: true; demoUrl: string }
  | { ok: false; error: string };

/**
 * Holds the chosen slot and opens a Stripe Embedded Checkout session.
 * The booking is only confirmed once Stripe reports the payment as paid
 * (see lib/booking/confirm.ts).
 */
export async function startCheckout(
  input: z.infer<typeof CheckoutSchema>,
): Promise<CheckoutResult> {
  const parsed = CheckoutSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Invalid booking request." };
  }

  const service = await getServiceBySlug(parsed.data.serviceSlug);
  if (!service) {
    return { ok: false, error: "Service not found." };
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    // Local design preview only — never fake a booking on the live site.
    if (process.env.NODE_ENV !== "production") {
      const params = new URLSearchParams({
        demo: "1",
        service: service.name,
        slot: parsed.data.slotStart,
      });
      return { ok: true, demoUrl: `/booking/success?${params.toString()}` };
    }
    return {
      ok: false,
      error:
        "Online payments aren't available right now. Please use the contact page and I'll book you in personally.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "Your session expired — please sign in again." };
  }

  const slotStart = new Date(parsed.data.slotStart);
  const slotEnd = new Date(
    slotStart.getTime() + service.duration_minutes * 60_000,
  );

  const { createSupabaseAdminClient } = await import("@/lib/supabase/admin");
  const admin = createSupabaseAdminClient();

  // Release any earlier unpaid hold by this client (e.g. they went back
  // and picked a different time).
  await admin
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("user_id", user.id)
    .eq("status", "pending");

  if (
    !(await isSlotAvailable({
      slotStart: slotStart.toISOString(),
      durationMinutes: service.duration_minutes,
    }))
  ) {
    return {
      ok: false,
      error: "Sorry — that time was just taken. Please choose another.",
    };
  }

  const { data: serviceRow } = await admin
    .from("services")
    .select("id")
    .eq("slug", service.slug)
    .maybeSingle();
  if (!serviceRow) {
    return { ok: false, error: "This service is not bookable right now." };
  }

  const { data: booking, error: holdError } = await admin
    .from("bookings")
    .insert({
      user_id: user.id,
      service_id: serviceRow.id,
      slot_start: slotStart.toISOString(),
      slot_end: slotEnd.toISOString(),
      status: "pending",
      notes: parsed.data.notes ?? null,
    })
    .select("id")
    .single();
  if (holdError || !booking) {
    console.error("[checkout] could not hold slot", holdError);
    return { ok: false, error: "Could not reserve that time. Please try again." };
  }

  try {
    const { getStripe } = await import("@/lib/stripe");
    const stripe = getStripe();
    const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const fullName =
      (user.user_metadata as { full_name?: string } | null)?.full_name ?? "";

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: service.currency.toLowerCase(),
            unit_amount: service.price_cents,
            product_data: {
              name: service.name,
              description: service.tagline || undefined,
            },
          },
          quantity: 1,
        },
      ],
      customer_email: user.email ?? undefined,
      client_reference_id: booking.id,
      metadata: {
        booking_id: booking.id,
        service_slug: service.slug,
        slot_start: slotStart.toISOString(),
        slot_end: slotEnd.toISOString(),
        user_id: user.id,
        customer_name: fullName,
      },
      payment_intent_data: {
        description: `${service.name} — ${slotStart.toISOString()}`,
      },
      expires_at: Math.floor(Date.now() / 1000) + PAYMENT_HOLD_MINUTES * 60,
      return_url: `${origin}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
    });

    await admin
      .from("bookings")
      .update({ stripe_session_id: session.id })
      .eq("id", booking.id);

    if (!session.client_secret) {
      throw new Error("Stripe did not return a client secret");
    }
    return { ok: true, clientSecret: session.client_secret };
  } catch (err) {
    console.error("[checkout] stripe session failed", err);
    await admin
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", booking.id);
    return {
      ok: false,
      error: "Payment could not be started. Please try again in a moment.",
    };
  }
}
