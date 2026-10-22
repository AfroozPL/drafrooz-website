import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";
import { safeRedirectPath } from "@/lib/utils";

export const metadata: Metadata = { title: "Sign in" };

type Props = {
  searchParams: Promise<{ redirect?: string; notice?: string }>;
};

const NOTICES: Record<string, { tone: "mint" | "amber"; text: string }> = {
  confirmed: {
    tone: "mint",
    text: "Your email is confirmed. Sign in to continue.",
  },
  "link-expired": {
    tone: "amber",
    text: "That link has expired or was already used. If you've confirmed your email, just sign in below.",
  },
};

export default async function LoginPage({ searchParams }: Props) {
  const { redirect, notice } = await searchParams;
  const redirectTo = safeRedirectPath(redirect);
  const banner = notice ? NOTICES[notice] : undefined;

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 hero-grid opacity-40 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-1 accent-bar" />
      <Container className="relative py-20 lg:py-28 max-w-md">
        <Badge tone="blue" className="mb-6">
          Account
        </Badge>
        <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-2">
          Welcome back.
        </h1>
        <p className="text-light-gray mb-8">
          Sign in to manage your bookings and account.
        </p>

        {banner && (
          <div
            role="status"
            className={`surface-card p-4 mb-6 text-sm border-l-2 ${
              banner.tone === "mint"
                ? "border-vivid-mint text-white"
                : "border-amber-gold text-light-gray"
            }`}
          >
            {banner.text}
          </div>
        )}

        <Card>
          <CardTitle className="mb-6">Sign in</CardTitle>
          <LoginForm redirectTo={redirectTo} />
        </Card>

        <p className="text-light-gray text-sm text-center mt-6">
          New here?{" "}
          <Link
            href={`/signup?redirect=${encodeURIComponent(redirectTo)}`}
            className="text-electric-blue hover:underline">
            Create an account →
          </Link>
        </p>

        {!process.env.NEXT_PUBLIC_SUPABASE_URL && (
          <CardDescription className="mt-8 text-center text-xs">
            For preview only: sign-in requires Supabase to be connected. Add
            your keys to <code>.env.local</code> to enable real authentication.
          </CardDescription>
        )}
      </Container>
    </div>
  );
}
