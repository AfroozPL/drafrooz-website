"use client";

import { useState, useTransition } from "react";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { requestStrategyCall, type StrategyCallInput } from "@/app/actions/strategy-call";
import { Icon } from "@/components/site/icons";

const SIZES = ["Just me", "2–20", "21–200", "201–1,000", "1,000+"];

export function StrategyCallForm({ stage }: { stage?: StrategyCallInput["stage"] }) {
  const [pending, startTransition] = useTransition();
  const [size, setSize] = useState<string>("");
  const [state, setState] = useState<
    { type: "idle" } | { type: "success" } | { type: "error"; message: string }
  >({ type: "idle" });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const get = (k: string) => String(form.get(k) ?? "");
    startTransition(async () => {
      const result = await requestStrategyCall({
        name: get("name"),
        email: get("email"),
        company: get("company"),
        role: get("role"),
        size,
        goal: get("goal"),
        times: get("times"),
        stage,
      });
      setState(result.ok ? { type: "success" } : { type: "error", message: result.error });
    });
  }

  if (state.type === "success") {
    return (
      <div className="py-10 text-center animate-rise-in">
        <div className="relative mx-auto grid h-16 w-16 place-items-center">
          <span className="absolute inset-0 rounded-full bg-vivid-mint/30 animate-pulse-ring" />
          <span className="relative grid h-16 w-16 place-items-center rounded-full bg-vivid-mint text-ink">
            <Icon name="check" className="h-7 w-7" />
          </span>
        </div>
        <h3 className="mt-6 font-display text-2xl font-semibold text-white">Request received</h3>
        <p className="mt-3 text-light-gray max-w-md mx-auto">
          I&apos;ll email you within one business day with a meeting link and a couple of times
          to choose from.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="sc-name">Your name</Label>
          <Input id="sc-name" name="name" required autoComplete="name" placeholder="Jane Smith" />
        </div>
        <div>
          <Label htmlFor="sc-email">Work email</Label>
          <Input id="sc-email" name="email" type="email" required autoComplete="email" placeholder="you@company.com" />
        </div>
        <div>
          <Label htmlFor="sc-company">Organisation</Label>
          <Input id="sc-company" name="company" autoComplete="organization" placeholder="Acme Health" />
        </div>
        <div>
          <Label htmlFor="sc-role">Your role</Label>
          <Input id="sc-role" name="role" autoComplete="organization-title" placeholder="COO" />
        </div>
      </div>

      <fieldset>
        <legend className="block text-xs font-semibold tracking-wider uppercase text-light-gray mb-2">
          Organisation size
        </legend>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={size === s}
              onClick={() => setSize(size === s ? "" : s)}
              className={
                size === s
                  ? "rounded-full border border-electric-blue bg-electric-blue/15 px-4 py-2 text-sm text-white"
                  : "rounded-full border border-white/15 px-4 py-2 text-sm text-light-gray hover:border-white/40 hover:text-white transition-colors"
              }
            >
              {s}
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <Label htmlFor="sc-goal">What would you like AI to help with?</Label>
        <Textarea
          id="sc-goal"
          name="goal"
          required
          minLength={10}
          placeholder="e.g. We spend hours each week answering the same client questions and want to know if AI can help — safely."
        />
      </div>
      <div>
        <Label htmlFor="sc-times">Preferred days / times (optional)</Label>
        <Input id="sc-times" name="times" placeholder="Weekday mornings, AEST" />
      </div>

      <Button type="submit" size="lg" disabled={pending} className="w-full rounded-full">
        {pending ? "Sending request…" : "Request my free strategy call"}
      </Button>
      {state.type === "error" && <p className="text-amber-gold text-sm">{state.message}</p>}
      <p className="text-muted text-xs text-center">
        Free · 30 minutes · Google Meet · No obligation
      </p>
    </form>
  );
}
