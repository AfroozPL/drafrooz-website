import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = { title: "Create account" };

type Props = { searchParams: Promise<{ redirect?: string }> };

export default async function SignupPage({ searchParams }: Props) {
  const { redirect } = await searchParams;
  const redirectTo = redirect && redirect.startsWith("/") ? redirect : "/dashboard";

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 hero-grid opacity-40 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-1 accent-bar" />
      <Container className="relative py-20 lg:py-28 max-w-md">
        <Badge tone="violet" className="mb-6">
          New account
        </Badge>
        <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-2">
          Create your account.
        </h1>
        <p className="text-light-gray mb-8">
          Free account — needed to book a paid consultation.
        </p>

        <Card>
          <CardTitle className="mb-6">Sign up</CardTitle>
          <SignupForm redirectTo={redirectTo} />
        </Card>

        <p className="text-light-gray text-sm text-center mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-electric-blue hover:underline">
            Sign in →
          </Link>
        </p>

        <CardDescription className="mt-8 text-center text-xs">
          For preview only: account creation requires Supabase to be connected.
        </CardDescription>
      </Container>
    </div>
  );
}
