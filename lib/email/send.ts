import { Resend } from "resend";
import type { ReactElement } from "react";

/**
 * Sends transactional email through whichever provider is configured:
 *   1. Gmail SMTP (GMAIL_USER + GMAIL_APP_PASSWORD) — works without owning
 *      a domain; mail comes from your own Gmail address.
 *   2. Resend (RESEND_API_KEY) — needs a verified domain to email clients.
 * Throws on failure so callers can log it instead of failing silently.
 */

let cachedResend: Resend | null = null;
function getResend(): Resend {
  if (!cachedResend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      throw new Error("RESEND_API_KEY is not set");
    }
    cachedResend = new Resend(key);
  }
  return cachedResend;
}

type SendArgs = {
  to: string | string[];
  subject: string;
  react: ReactElement;
  replyTo?: string;
};

export function isEmailConfigured() {
  return Boolean(
    (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) ||
      process.env.RESEND_API_KEY,
  );
}

export async function sendEmail({ to, subject, react, replyTo }: SendArgs) {
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    const [{ default: nodemailer }, { render }] = await Promise.all([
      import("nodemailer"),
      import("@react-email/components"),
    ]);
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
    return transport.sendMail({
      from: `"Dr. Afrooz Purarjomand" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html: await render(react),
      replyTo,
    });
  }

  const from =
    process.env.RESEND_FROM_EMAIL ||
    "Dr. Afrooz Purarjomand <onboarding@resend.dev>";
  const { data, error } = await getResend().emails.send({
    from,
    to,
    subject,
    react,
    replyTo,
  });
  if (error) {
    throw new Error(`Resend: ${error.message}`);
  }
  return data;
}
