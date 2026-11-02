"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getAdminUser } from "@/lib/admin/guard";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type Result = { ok: true } | { ok: false; error: string };

const MessageStatus = z.object({
  id: z.string().uuid(),
  status: z.enum(["new", "read", "replied", "archived"]),
});

/** Admin only: move a message through new → read → replied → archived. */
export async function setMessageStatus(input: z.infer<typeof MessageStatus>): Promise<Result> {
  if (!(await getAdminUser())) return { ok: false, error: "Sign in as an admin to do that." };
  const parsed = MessageStatus.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid request." };

  const { error } = await createSupabaseAdminClient()
    .from("contact_messages")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.id);
  if (error) {
    console.error("[admin] message status update failed", error);
    return { ok: false, error: "Couldn't update the message. Try again." };
  }
  revalidatePath("/admin", "layout");
  return { ok: true };
}

const BookingDone = z.object({ id: z.string().uuid() });

/**
 * Admin only: mark a paid/confirmed session as completed. Cancelling and
 * refunds are deliberately not offered here — they must go through Stripe
 * so the client is actually refunded.
 */
export async function markBookingCompleted(input: z.infer<typeof BookingDone>): Promise<Result> {
  if (!(await getAdminUser())) return { ok: false, error: "Sign in as an admin to do that." };
  const parsed = BookingDone.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid request." };

  const { error } = await createSupabaseAdminClient()
    .from("bookings")
    .update({ status: "completed" })
    .eq("id", parsed.data.id)
    .in("status", ["paid", "confirmed"]);
  if (error) {
    console.error("[admin] booking update failed", error);
    return { ok: false, error: "Couldn't update the booking. Try again." };
  }
  revalidatePath("/admin", "layout");
  return { ok: true };
}
