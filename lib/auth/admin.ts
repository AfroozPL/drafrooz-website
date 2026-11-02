import type { User } from "@supabase/supabase-js";

/**
 * Emails that are always treated as site admins once verified. Override
 * with ADMIN_EMAILS (comma-separated) in the environment if needed.
 */
const DEFAULT_ADMIN_EMAILS = ["afroozarjmand@gmail.com", "apurarjo@bond.edu.au"];

function adminEmails(): string[] {
  const fromEnv = process.env.ADMIN_EMAILS?.split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return fromEnv && fromEnv.length > 0 ? fromEnv : DEFAULT_ADMIN_EMAILS;
}

/**
 * A user is an admin if their account carries the `admin` role in
 * app_metadata (set server-side only), or if their *verified* email is on
 * the admin list. The verification check matters: without it, anyone could
 * sign up with the owner's address before confirming it.
 */
export function isAdminUser(user: Pick<User, "email" | "email_confirmed_at" | "app_metadata"> | null | undefined): boolean {
  if (!user) return false;
  const role = (user.app_metadata as { role?: string } | null)?.role;
  if (role === "admin") return true;
  const email = user.email?.toLowerCase();
  return Boolean(email && user.email_confirmed_at && adminEmails().includes(email));
}
