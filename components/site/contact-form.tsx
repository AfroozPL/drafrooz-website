"use client";

import { useState, useTransition } from "react";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { submitContact } from "@/app/actions/contact";

export function ContactForm() {
  const [pending, startTransition] = useTransition();
  const [state, setState] = useState<{
    type: "idle" | "success" | "error";
    message?: string;
  }>({ type: "idle" });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await submitContact({
        name: String(form.get("name") ?? ""),
        email: String(form.get("email") ?? ""),
        company: String(form.get("company") ?? ""),
        message: String(form.get("message") ?? ""),
      });
      if (result.ok) {
        setState({ type: "success", message: "Thanks — I'll be in touch soon." });
        (e.target as HTMLFormElement).reset();
      } else {
        setState({ type: "error", message: result.error });
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Your name</Label>
          <Input id="name" name="name" required placeholder="Jane Smith" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@company.com"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="company">Company / Organisation</Label>
        <Input id="company" name="company" placeholder="Acme Health" />
      </div>
      <div>
        <Label htmlFor="message">How can I help?</Label>
        <Textarea
          id="message"
          name="message"
          required
          placeholder="A few sentences about your team, your AI question, and what success looks like."
        />
      </div>
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Sending..." : "Send message"}
      </Button>
      {state.type === "success" && (
        <p className="text-vivid-mint text-sm">{state.message}</p>
      )}
      {state.type === "error" && (
        <p className="text-amber-gold text-sm">{state.message}</p>
      )}
    </form>
  );
}
