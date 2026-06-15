import { Resend } from "resend";
import type { ReactElement } from "react";

let cached: Resend | null = null;
function getResend(): Resend {
  if (!cached) {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      throw new Error("RESEND_API_KEY is not set");
    }
    cached = new Resend(key);
  }
  return cached;
}

type SendArgs = {
  to: string | string[];
  subject: string;
  react: ReactElement;
  replyTo?: string;
};

export async function sendEmail({ to, subject, react, replyTo }: SendArgs) {
  const from =
    process.env.RESEND_FROM_EMAIL ||
    "Dr. Afrooz Purarjomand <onboarding@resend.dev>";
  return getResend().emails.send({
    from,
    to,
    subject,
    react,
    replyTo,
  });
}
