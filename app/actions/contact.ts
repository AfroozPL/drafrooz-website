"use server";

import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  company: z.string().max(200).optional(),
  message: z.string().min(10).max(4000),
});

type ContactResult =
  | { ok: true }
  | { ok: false; error: string };

export async function submitContact(
  input: z.infer<typeof ContactSchema>,
): Promise<ContactResult> {
  const parsed = ContactSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please fill in all required fields." };
  }

  // Persist to Supabase if configured.
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    try {
      const { createSupabaseAdminClient } = await import(
        "@/lib/supabase/admin"
      );
      const supabase = createSupabaseAdminClient();
      await supabase.from("contact_messages").insert({
        name: parsed.data.name,
        email: parsed.data.email,
        company: parsed.data.company ?? null,
        message: parsed.data.message,
      });
    } catch (err) {
      console.error("[contact] supabase insert failed", err);
    }
  }

  // Send notification email if Resend is configured.
  if (process.env.RESEND_API_KEY) {
    try {
      const { sendEmail } = await import("@/lib/email/send");
      const { ContactNotificationEmail } = await import(
        "@/lib/email/templates/contact-notification"
      );
      await sendEmail({
        to:
          process.env.ADMIN_NOTIFICATION_EMAIL ?? "afroozarjmand@gmail.com",
        subject: `New contact: ${parsed.data.name}`,
        replyTo: parsed.data.email,
        react: ContactNotificationEmail({
          name: parsed.data.name,
          email: parsed.data.email,
          company: parsed.data.company,
          message: parsed.data.message,
        }),
      });
    } catch (err) {
      console.error("[contact] email failed", err);
    }
  }

  return { ok: true };
}
