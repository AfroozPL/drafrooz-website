"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { subscribeNewsletter } from "@/app/actions/newsletter";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<{
    type: "idle" | "success" | "error";
    message?: string;
  }>({ type: "idle" });
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await subscribeNewsletter(email);
      if (result.ok) {
        setState({ type: "success", message: "You're subscribed. Thanks!" });
        setEmail("");
      } else {
        setState({ type: "error", message: result.error });
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="flex gap-2">
        <Input
          type="email"
          required
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={pending}
          className="flex-1"
        />
        <Button type="submit" size="md" disabled={pending}>
          {pending ? "..." : "Join"}
        </Button>
      </div>
      {state.type !== "idle" && (
        <p
          className={
            state.type === "success"
              ? "text-vivid-mint text-xs"
              : "text-amber-gold text-xs"
          }
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
