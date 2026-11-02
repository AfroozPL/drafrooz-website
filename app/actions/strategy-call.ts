"use server";

import { z } from "zod";

const StrategyCallSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email(),
  company: z.string().trim().max(200).optional(),
  role: z.string().trim().max(120).optional(),
  size: z.string().trim().max(40).optional(),
  goal: z.string().trim().min(10).max(3000),
  times: z.string().trim().max(500).optional(),
  stage: z.enum(["explorer", "experimenter", "builder", "scaler"]).optional(),
});

export type StrategyCallInput = z.infer<typeof StrategyCallSchema>;

type Result = { ok: true } | { ok: false; error: string };

/**
 * Records a free 30-minute strategy call request. Stored alongside contact
 * messages (prefixed so it stands out in the admin inbox) and emailed to
 * Dr. Afrooz, who replies with a meeting time.
 */
export async function requestStrategyCall(input: StrategyCallInput): Promise<Result> {
  const parsed = StrategyCallSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Add your name, a valid email and a sentence or two about your goal (10+ characters).",
    };
  }
  const d = parsed.data;

  const details = [
    "[FREE 30-MIN STRATEGY CALL REQUEST]",
    d.role && `Role: ${d.role}`,
    d.size && `Organisation size: ${d.size}`,
    d.stage && `Readiness check result: ${d.stage}`,
    d.times && `Preferred times: ${d.times}`,
  ].filter(Boolean);
  const message = `${details.join("\n")}\n\nWhat they want to achieve with AI:\n${d.goal}`;

  let stored = false;
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const { createSupabaseAdminClient } = await import("@/lib/supabase/admin");
      const supabase = createSupabaseAdminClient();
      const { error } = await supabase.from("contact_messages").insert({
        name: d.name,
        email: d.email,
        company: d.company || null,
        message,
      });
      if (error) throw error;
      stored = true;
    } catch (err) {
      console.error("[strategy-call] supabase insert failed", err);
    }
  }

  let emailed = false;
  if (process.env.RESEND_API_KEY) {
    try {
      const { sendEmail } = await import("@/lib/email/send");
      const { ContactNotificationEmail } = await import(
        "@/lib/email/templates/contact-notification"
      );
      await sendEmail({
        to: process.env.ADMIN_NOTIFICATION_EMAIL ?? "afroozarjmand@gmail.com",
        subject: `Free strategy call request: ${d.name}${d.company ? ` (${d.company})` : ""}`,
        replyTo: d.email,
        react: ContactNotificationEmail({
          name: d.name,
          email: d.email,
          company: d.company,
          message,
        }),
      });
      emailed = true;
    } catch (err) {
      console.error("[strategy-call] email failed", err);
    }
  }

  // In production, a request that went nowhere must not look successful.
  if (process.env.NODE_ENV === "production" && !stored && !emailed) {
    return {
      ok: false,
      error: "Your request couldn't be sent. Email afroozarjmand@gmail.com and I'll book you in directly.",
    };
  }

  return { ok: true };
}
