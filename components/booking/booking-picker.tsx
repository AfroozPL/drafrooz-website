"use client";

import { useMemo, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea, Label } from "@/components/ui/input";
import { startCheckout } from "@/app/actions/checkout";
import type { Slot } from "@/lib/booking/availability";

type DayEntry = { date: string; label: string; slots: Slot[] };

export function BookingPicker({
  serviceSlug,
  serviceName,
  days,
  timezone,
  priceLabel,
}: {
  serviceSlug: string;
  serviceName: string;
  days: DayEntry[];
  timezone: string;
  priceLabel: string;
}) {
  const [activeDate, setActiveDate] = useState(
    days.find((d) => d.slots.length > 0)?.date ?? days[0]?.date ?? "",
  );
  const [selected, setSelected] = useState<Slot | null>(null);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const activeDay = useMemo(
    () => days.find((d) => d.date === activeDate),
    [days, activeDate],
  );

  function onContinue() {
    if (!selected) return;
    setError(null);
    startTransition(async () => {
      const result = await startCheckout({
        serviceSlug,
        slotStart: selected.start,
        slotEnd: selected.end,
        notes: notes.trim() || undefined,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      window.location.href = result.url;
    });
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Day picker */}
      <div>
        <Label>Pick a day</Label>
        <div className="space-y-1 max-h-[420px] overflow-y-auto pr-2">
          {days.map((d) => {
            const empty = d.slots.length === 0;
            const isActive = d.date === activeDate;
            return (
              <button
                key={d.date}
                type="button"
                onClick={() => !empty && setActiveDate(d.date)}
                disabled={empty}
                className={`w-full text-left rounded-md px-3 py-2.5 text-sm border transition-colors ${
                  isActive
                    ? "border-electric-blue text-white bg-electric-blue/10"
                    : empty
                      ? "border-light-gray/10 text-muted cursor-not-allowed"
                      : "border-light-gray/10 text-light-gray hover:text-white hover:border-electric-blue/40"
                }`}
              >
                <span className="font-medium">{d.label}</span>
                <span className="text-xs ml-2 text-muted">
                  {empty ? "no times" : `${d.slots.length} times`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Slot grid */}
      <div>
        <Label>Pick a time ({timezone.replace("_", " ")})</Label>
        {!activeDay || activeDay.slots.length === 0 ? (
          <p className="text-light-gray text-sm">No times available.</p>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {activeDay.slots.map((s) => {
              const isActive = selected?.start === s.start;
              return (
                <button
                  key={s.start}
                  type="button"
                  onClick={() => setSelected(s)}
                  className={`rounded-md px-3 py-2.5 text-sm border font-medium transition-colors ${
                    isActive
                      ? "border-electric-blue text-midnight bg-electric-blue"
                      : "border-light-gray/15 text-light-gray hover:text-white hover:border-electric-blue/50"
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirm */}
      <div className="space-y-4">
        <Label>Anything I should know? (optional)</Label>
        <Textarea
          placeholder="A short note about your team and goal helps me prepare."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={1000}
        />

        <div className="surface-card p-4 text-sm">
          <p className="text-muted text-xs uppercase tracking-wider mb-2">Summary</p>
          <p className="text-white font-bold">{serviceName}</p>
          {selected ? (
            <p className="text-light-gray mt-1">
              {activeDay?.label} · {selected.label}
            </p>
          ) : (
            <p className="text-light-gray mt-1">Pick a time to continue.</p>
          )}
          <p className="text-electric-blue font-bold mt-3">{priceLabel}</p>
        </div>

        {error && <p className="text-amber-gold text-sm">{error}</p>}

        <Button
          type="button"
          size="lg"
          className="w-full"
          disabled={!selected || pending}
          onClick={onContinue}
        >
          {pending ? "Redirecting..." : "Continue to payment"}
        </Button>
      </div>
    </div>
  );
}
