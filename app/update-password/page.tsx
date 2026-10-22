import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { UpdatePasswordForm } from "@/components/auth/update-password-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Choose a new password" };
export const dynamic = "force-dynamic";

export default async function UpdatePasswordPage() {
  let signedIn = false;
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    signedIn = Boolean(user);
  }

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 hero-grid opacity-40 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-1 accent-bar" />
      <Container className="relative py-20 lg:py-28 max-w-md">
        <Badge tone="amber" className="mb-6">
          Reset
        </Badge>
        <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-8">
          Choose a new password.
        </h1>

        <Card>
          <CardTitle className="mb-6">New password</CardTitle>
          {signedIn ? (
            <UpdatePasswordForm />
          ) : (
            <CardDescription>
              This reset link couldn't be verified. Open it in the same browser
              you requested it from, or{" "}
              <Link
                href="/forgot-password"
                className="text-electric-blue hover:underline"
              >
                request a new link
              </Link>
              .
            </CardDescription>
          )}
        </Card>
      </Container>
    </div>
  );
}
