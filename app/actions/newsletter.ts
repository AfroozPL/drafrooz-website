"use server";

import { z } from "zod";

const EmailSchema = z.string().email();

type Result = { ok: true } | { ok: false; error: string };

export async function subscribeNewsletter(email: string): Promise<Result> {
  const parsed = EmailSchema.safeParse(email);
  if (!parsed.success) {
    return { ok: false, error: "Please enter a valid email." };
  }

  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    try {
      const { createSupabaseAdminClient } = await import(
        "@/lib/supabase/admin"
      );
      const supabase = createSupabaseAdminClient();
      const { error } = await supabase
        .from("newsletter_subscribers")
        .upsert({ email: parsed.data, status: "active" }, { onConflict: "email" });
      if (error) {
        return { ok: false, error: "Subscription failed. Try again." };
      }
    } catch {
      return { ok: false, error: "Subscription failed. Try again." };
    }
  }

  return { ok: true };
}
