import type Stripe from "stripe";
import { formatInTimeZone } from "date-fns-tz";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { DEFAULT_TZ } from "@/lib/booking/availability";
import { formatCurrency } from "@/lib/utils";

export type ConfirmedBooking = {
  serviceName: string;
  slotStart: string;
  durationMinutes: number;
};

export function formatSlotForHumans(iso: string) {
  return `${formatInTimeZone(
    new Date(iso),
    DEFAULT_TZ,
    "EEEE d MMMM yyyy, h:mm a",
  )} (Brisbane time)`;
}

/**
 * Turns a paid Stripe Checkout session into a confirmed booking, then
 * creates the calendar event and emails both the client and the owner.
 *
 * Safe to call more than once for the same session (the Stripe webhook
 * and the success page both call it): only the first caller "claims" the
 * booking and runs the side-effects.
 */
export async function confirmPaidBooking(
  session: Stripe.Checkout.Session,
): Promise<ConfirmedBooking | null> {
  if (session.payment_status !== "paid") return null;

  const meta = session.metadata ?? {};
  const supabase = createSupabaseAdminClient();
  const paymentIntent =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null;

  const { data: service } = await supabase
    .from("services")
    .select("id, name, duration_minutes")
    .eq("slug", meta.service_slug ?? "")
    .maybeSingle();

  const summary: ConfirmedBooking = {
    serviceName: service?.name ?? "Consultation",
    slotStart: meta.slot_start,
    durationMinutes: service?.duration_minutes ?? 30,
  };

  // Atomic claim: only a booking that has never been confirmed matches.
  const { data: claimed, error: claimError } = await supabase
    .from("bookings")
    .update({
      status: "confirmed",
      confirmed_at: new Date().toISOString(),
      stripe_session_id: session.id,
      stripe_payment_intent: paymentIntent,
    })
    .eq("id", meta.booking_id ?? "")
    .is("confirmed_at", null)
    .select("id, notes")
    .maybeSingle();
  if (claimError) throw new Error(`Booking claim failed: ${claimError.message}`);

  if (!claimed) {
    const { data: existing } = await supabase
      .from("bookings")
      .select("id")
      .eq("stripe_session_id", session.id)
      .not("confirmed_at", "is", null)
      .maybeSingle();
    // Already confirmed by an earlier call — nothing more to do.
    if (existing) return summary;
    throw new Error(`No booking found for paid session ${session.id}`);
  }

  const clientEmail =
    session.customer_details?.email ?? session.customer_email ?? "";
  const clientName =
    meta.customer_name ||
    session.customer_details?.name ||
    clientEmail.split("@")[0];
  const notes = claimed.notes ?? undefined;

  let meetLink: string | undefined;
  if (process.env.GOOGLE_REFRESH_TOKEN) {
    try {
      const { createCalendarEvent } = await import("@/lib/google/calendar");
      const event = await createCalendarEvent({
        summary: `${summary.serviceName} — ${clientName}`,
        description: notes,
        startIso: meta.slot_start,
        endIso: meta.slot_end,
        attendeeEmail: clientEmail || undefined,
      });
      meetLink = event.meetLink || undefined;
      await supabase
        .from("bookings")
        .update({ google_event_id: event.eventId, meet_link: meetLink ?? null })
        .eq("id", claimed.id);
    } catch (e) {
      console.error("[booking] calendar event failed", e);
    }
  }

  const { isEmailConfigured, sendEmail } = await import("@/lib/email/send");
  if (!isEmailConfigured()) {
    console.error("[booking] no email provider configured — emails skipped");
    return summary;
  }

  const slotStartHuman = formatSlotForHumans(meta.slot_start);
  const amountPaid = formatCurrency(
    session.amount_total ?? 0,
    (session.currency ?? "usd").toUpperCase(),
  );

  const [{ BookingConfirmationEmail }, { BookingNotificationEmail }] =
    await Promise.all([
      import("@/lib/email/templates/booking-confirmation"),
      import("@/lib/email/templates/booking-notification"),
    ]);

  const results = await Promise.allSettled([
    clientEmail
      ? sendEmail({
          to: clientEmail,
          subject: `Confirmed: ${summary.serviceName} on ${slotStartHuman}`,
          replyTo: process.env.ADMIN_NOTIFICATION_EMAIL,
          react: BookingConfirmationEmail({
            recipientName: clientName,
            serviceName: summary.serviceName,
            slotStartHuman,
            durationMinutes: summary.durationMinutes,
            amountPaid,
            meetLink,
            notes,
          }),
        })
      : Promise.reject(new Error("Client email missing on session")),
    sendEmail({
      to: process.env.ADMIN_NOTIFICATION_EMAIL ?? "afroozarjmand@gmail.com",
      subject: `New booking: ${clientName} — ${summary.serviceName}`,
      replyTo: clientEmail || undefined,
      react: BookingNotificationEmail({
        clientName,
        clientEmail,
        serviceName: summary.serviceName,
        slotStartHuman,
        durationMinutes: summary.durationMinutes,
        amountPaid,
        meetLink,
        notes,
      }),
    }),
  ]);
  results.forEach((r, i) => {
    if (r.status === "rejected") {
      console.error(
        `[booking] ${i === 0 ? "client" : "owner"} email failed`,
        r.reason,
      );
    }
  });

  return summary;
}
