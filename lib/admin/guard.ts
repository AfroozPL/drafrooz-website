import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/auth/admin";

export function supabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

/** The signed-in user if they are an admin, otherwise null. */
export async function getAdminUser() {
  if (!supabaseConfigured()) return null;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return isAdminUser(user) ? user : null;
}

/**
 * Page guard. redirect() works by throwing, so it is deliberately kept out
 * of any try/catch.
 */
export async function requireAdmin() {
  if (!supabaseConfigured()) {
    // Local design preview without a database: show the empty dashboard.
    if (process.env.NODE_ENV !== "production") return null;
    redirect("/");
  }
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/admin");
  if (!isAdminUser(user)) redirect("/dashboard");
  return user;
}
