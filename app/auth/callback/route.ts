import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { safeRedirectPath } from "@/lib/utils";

/**
 * Landing route for links in Supabase auth emails (signup confirmation,
 * password reset). Handles both link styles:
 *   - ?code=...                 PKCE link (only works in the browser that signed up)
 *   - ?token_hash=...&type=...  works on any device / browser
 *
 * By the time a PKCE link lands here, Supabase has already verified the
 * email. So if the session exchange fails (e.g. the link was opened in the
 * Gmail app instead of the original browser), send the user to sign in
 * with a friendly "email confirmed" notice rather than a dead end.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  const redirect = safeRedirectPath(
    url.searchParams.get("redirect") ?? url.searchParams.get("next"),
  );

  const toLogin = (notice: string) => {
    const login = new URL("/login", url.origin);
    login.searchParams.set("notice", notice);
    login.searchParams.set("redirect", redirect);
    return NextResponse.redirect(login);
  };

  if (url.searchParams.get("error")) {
    // e.g. otp_expired — the link is old or was already used.
    return toLogin("link-expired");
  }

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.redirect(new URL(redirect, url.origin));
  }

  const supabase = await createSupabaseServerClient();

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });
    if (error) return toLogin("link-expired");
    return NextResponse.redirect(new URL(redirect, url.origin));
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return toLogin("confirmed");
    return NextResponse.redirect(new URL(redirect, url.origin));
  }

  return toLogin("confirmed");
}
