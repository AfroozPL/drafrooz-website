import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = { title: "Reset password" };

export default function ForgotPasswordPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 hero-grid opacity-40 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-1 accent-bar" />
      <Container className="relative py-20 lg:py-28 max-w-md">
        <Badge tone="amber" className="mb-6">
          Reset
        </Badge>
        <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-2">
          Forgot your password?
        </h1>
        <p className="text-light-gray mb-8">
          We'll send a reset link to your email.
        </p>

        <Card>
          <CardTitle className="mb-6">Reset password</CardTitle>
          <ForgotPasswordForm />
        </Card>

        <p className="text-light-gray text-sm text-center mt-6">
          Remembered it?{" "}
          <Link href="/login" className="text-electric-blue hover:underline">
            Back to sign in
          </Link>
        </p>
      </Container>
    </div>
  );
}
