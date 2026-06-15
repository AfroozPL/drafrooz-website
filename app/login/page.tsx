import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Sign in" };

type Props = { searchParams: Promise<{ redirect?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { redirect } = await searchParams;
  const redirectTo = redirect && redirect.startsWith("/") ? redirect : "/dashboard";

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

        <Card>
          <CardTitle className="mb-6">Sign in</CardTitle>
          <LoginForm redirectTo={redirectTo} />
        </Card>

        <p className="text-light-gray text-sm text-center mt-6">
          New here?{" "}
          <Link href="/signup" className="text-electric-blue hover:underline">
            Create an account →
          </Link>
        </p>

        <CardDescription className="mt-8 text-center text-xs">
          For preview only: sign-in requires Supabase to be connected. Add your
          keys to <code>.env.local</code> to enable real authentication.
        </CardDescription>
      </Container>
    </div>
  );
}
