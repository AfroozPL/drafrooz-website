"use client";

import { useState, useTransition } from "react";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function ForgotPasswordForm() {
  const [pending, startTransition] = useTransition();
  const [state, setState] = useState<{
    type: "idle" | "success" | "error";
    message?: string;
  }>({ type: "idle" });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "");
    startTransition(async () => {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        setState({
          type: "success",
          message: "If that email exists, a reset link is on its way.",
        });
        return;
      }
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) {
        setState({ type: "error", message: error.message });
      } else {
        setState({
          type: "success",
          message: "If that email exists, a reset link is on its way.",
        });
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      {state.type === "success" && (
        <p className="text-vivid-mint text-sm">{state.message}</p>
      )}
      {state.type === "error" && (
        <p className="text-amber-gold text-sm">{state.message}</p>
      )}
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Sending..." : "Send reset link"}
      </Button>
    </form>
  );
}
