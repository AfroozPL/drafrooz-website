"use server";

import { z } from "zod";
import { getServiceBySlug } from "@/lib/services/queries";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const CheckoutSchema = z.object({
  serviceSlug: z.string().min(1),
  slotStart: z.string().min(1),
  slotEnd: z.string().min(1),
  notes: z.string().max(1000).optional(),
});

type CheckoutResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

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

  // If Stripe isn't configured yet, route to a demo success page so the flow
  // is still visible in preview without real payments.
  if (!process.env.STRIPE_SECRET_KEY) {
    const params = new URLSearchParams({
      demo: "1",
      service: service.name,
      slot: parsed.data.slotStart,
    });
    return { ok: true, url: `/booking/success?${params.toString()}` };
  }

  // Auth check
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return {
        ok: false,
        error: "Please sign in before booking.",
      };
    }

    const { getStripe } = await import("@/lib/stripe");
    const stripe = getStripe();
    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: service.currency.toLowerCase(),
            unit_amount: service.price_cents,
            product_data: {
              name: service.name,
              description: service.tagline,
            },
          },
          quantity: 1,
        },
      ],
      customer_email: user.email ?? undefined,
      metadata: {
        service_slug: service.slug,
        slot_start: parsed.data.slotStart,
        slot_end: parsed.data.slotEnd,
        user_id: user.id,
        notes: parsed.data.notes ?? "",
      },
      success_url: `${origin}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/booking/cancel`,
    });

    if (!session.url) {
      return { ok: false, error: "Could not start checkout." };
    }
    return { ok: true, url: session.url };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed.";
    return { ok: false, error: message };
  }
}
