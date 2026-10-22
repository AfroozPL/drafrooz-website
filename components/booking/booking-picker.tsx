"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Textarea, Label } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { startCheckout } from "@/app/actions/checkout";
import type { DayAvailability, Slot } from "@/lib/booking/availability";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Parse "yyyy-MM-dd" as a calendar date, independent of the viewer's timezone. */
function utcNoon(date: string) {
  return new Date(`${date}T12:00:00Z`);
}

function monthKey(date: string) {
  return date.slice(0, 7);
}

function formatMonth(key: string) {
  return utcNoon(`${key}-01`).toLocaleDateString("en-AU", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatLongDate(date: string) {
  return utcNoon(date).toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
}

/** Calendar cells for a month, Monday-first, padded with nulls. */
function monthCells(key: string): Array<string | null> {
  const [y, m] = key.split("-").map(Number);
  const first = new Date(Date.UTC(y, m - 1, 1));
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const lead = (first.getUTCDay() + 6) % 7;
  const cells: Array<string | null> = Array(lead).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(`${key}-${String(d).padStart(2, "0")}`);
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

type Step = "select" | "pay";

export function BookingPicker({
  serviceSlug,
  serviceName,
  days,
  timezone,
  priceLabel,
  durationMinutes,
  publishableKey,
  gstAtPayment,
}: {
  serviceSlug: string;
  serviceName: string;
  days: DayAvailability[];
  timezone: string;
  priceLabel: string;
  durationMinutes: number;
  publishableKey: string | null;
  gstAtPayment: boolean;
}) {
  const slotsByDate = useMemo(
    () => new Map(days.map((d) => [d.date, d.slots])),
    [days],
  );
  const months = useMemo(
    () => Array.from(new Set(days.map((d) => monthKey(d.date)))),
    [days],
  );
  const firstOpen = days.find((d) => d.slots.length > 0)?.date ?? null;

  const [monthIndex, setMonthIndex] = useState(() =>
    Math.max(0, months.indexOf(monthKey(firstOpen ?? days[0]?.date ?? ""))),
  );
  const [activeDate, setActiveDate] = useState<string | null>(firstOpen);
  const [selected, setSelected] = useState<Slot | null>(null);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("select");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [viewerTz, setViewerTz] = useState<string | null>(null);

  useEffect(() => {
    setViewerTz(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  const stripePromise = useMemo(
    () => (publishableKey ? loadStripe(publishableKey) : null),
    [publishableKey],
  );

  const today = days[0]?.date ?? "";
  const activeSlots = activeDate ? slotsByDate.get(activeDate) ?? [] : [];
  const morning = activeSlots.filter((s) => s.label.endsWith("AM"));
  const afternoon = activeSlots.filter((s) => !s.label.endsWith("AM"));
  const showLocalTime = viewerTz !== null && viewerTz !== timezone;

  function localTime(slot: Slot) {
    return new Date(slot.start).toLocaleString(undefined, {
      weekday: "short",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    });
  }

  function pickDate(date: string) {
    setActiveDate(date);
    setSelected(null);
    setError(null);
  }

  function onContinue() {
    if (!selected) return;
    setError(null);
    startTransition(async () => {
      const result = await startCheckout({
        serviceSlug,
        slotStart: selected.start,
        notes: notes.trim() || undefined,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      if ("demoUrl" in result) {
        window.location.href = result.demoUrl;
        return;
      }
      if (!stripePromise) {
        setError("Payments are temporarily unavailable. Please contact me to book.");
        return;
      }
      setClientSecret(result.clientSecret);
      setStep("pay");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function backToSelect() {
    setStep("select");
    setClientSecret(null);
  }

  const summary = (
    <div className="surface-card p-5 text-sm">
      <p className="text-muted text-xs uppercase tracking-wider mb-3">
        Your booking
      </p>
      <p className="text-white font-bold text-base">{serviceName}</p>
      {selected && activeDate ? (
        <div className="mt-3 space-y-1">
          <p className="text-white">{formatLongDate(activeDate)}</p>
          <p className="text-light-gray">
            {selected.label} · {durationMinutes} min ·{" "}
            {timezone.split("/")[1]?.replace("_", " ")} time
          </p>
          {showLocalTime && (
            <p className="text-muted text-xs">Your time: {localTime(selected)}</p>
          )}
        </div>
      ) : (
        <p className="text-light-gray mt-3">Pick a date and time.</p>
      )}
      <div className="mt-4 pt-4 border-t border-light-gray/10 flex items-center justify-between">
        <span className="text-muted">{gstAtPayment ? "Price" : "Total"}</span>
        <span className="text-electric-blue font-bold">{priceLabel}</span>
      </div>
      {gstAtPayment && (
        <p className="text-muted text-xs mt-2">
          GST is calculated and added at payment.
        </p>
      )}
    </div>
  );

  return (
    <div>
      <ol className="flex items-center gap-3 mb-8 text-xs font-semibold uppercase tracking-wider">
        {[
          { id: "select", label: "Date & time" },
          { id: "pay", label: "Secure payment" },
          { id: "done", label: "Confirmed" },
        ].map((s, i) => {
          const isActive = s.id === step;
          const isDone = step === "pay" && s.id === "select";
          return (
            <li key={s.id} className="flex items-center gap-3">
              {i > 0 && <span className="h-px w-6 sm:w-10 bg-light-gray/20" />}
              <span
                className={cn(
                  "flex items-center gap-2",
                  isActive ? "text-white" : isDone ? "text-electric-blue" : "text-muted",
                )}
              >
                <span
                  className={cn(
                    "grid place-items-center h-6 w-6 rounded-full border text-[11px]",
                    isActive
                      ? "border-electric-blue bg-electric-blue text-midnight"
                      : isDone
                        ? "border-electric-blue text-electric-blue"
                        : "border-light-gray/20",
                  )}
                >
                  {isDone ? "✓" : i + 1}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </span>
            </li>
          );
        })}
      </ol>

      {step === "pay" && clientSecret && stripePromise ? (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-8 items-start">
          <div className="rounded-xl bg-white p-2 sm:p-4 min-h-[480px]">
            <EmbeddedCheckoutProvider
              key={clientSecret}
              stripe={stripePromise}
              options={{ clientSecret }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
          <div className="space-y-4 lg:sticky lg:top-24">
            {summary}
            <p className="text-muted text-xs leading-relaxed">
              Your time is held for 30 minutes while you pay. Card details are
              handled by Stripe and never touch this website.
            </p>
            <Button variant="ghost" size="sm" onClick={backToSelect}>
              ← Change time
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-8 items-start">
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] gap-6">
            {/* Month calendar */}
            <div className="surface-card p-5">
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => setMonthIndex((i) => i - 1)}
                  disabled={monthIndex === 0}
                  aria-label="Previous month"
                  className="h-8 w-8 grid place-items-center rounded-md text-light-gray hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  ‹
                </button>
                <p className="text-white font-bold">
                  {months[monthIndex] ? formatMonth(months[monthIndex]) : ""}
                </p>
                <button
                  type="button"
                  onClick={() => setMonthIndex((i) => i + 1)}
                  disabled={monthIndex >= months.length - 1}
                  aria-label="Next month"
                  className="h-8 w-8 grid place-items-center rounded-md text-light-gray hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  ›
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-[11px] uppercase tracking-wider text-muted mb-2">
                {WEEKDAYS.map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {months[monthIndex] &&
                  monthCells(months[monthIndex]).map((date, i) => {
                    if (!date) return <span key={`pad-${i}`} />;
                    const open = (slotsByDate.get(date)?.length ?? 0) > 0;
                    const isActive = date === activeDate;
                    return (
                      <button
                        key={date}
                        type="button"
                        disabled={!open}
                        onClick={() => pickDate(date)}
                        aria-pressed={isActive}
                        aria-label={`${formatLongDate(date)}${open ? "" : " — unavailable"}`}
                        className={cn(
                          "relative aspect-square rounded-lg text-sm transition-all",
                          isActive
                            ? "bg-electric-blue text-midnight font-bold shadow-glow-blue"
                            : open
                              ? "text-white font-semibold bg-electric-blue/10 hover:bg-electric-blue/25"
                              : "text-muted/50 cursor-not-allowed",
                          date === today && !isActive && "ring-1 ring-light-gray/30",
                        )}
                      >
                        {Number(date.slice(8))}
                        {open && !isActive && (
                          <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-electric-blue" />
                        )}
                      </button>
                    );
                  })}
              </div>
              <p className="mt-4 text-muted text-xs flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-electric-blue" />
                Highlighted days have open times
              </p>
            </div>

            {/* Time slots */}
            <div className="surface-card p-5">
              <p className="text-white font-bold">
                {activeDate ? formatLongDate(activeDate) : "Choose a day"}
              </p>
              <p className="text-muted text-xs mt-1 mb-4">
                Times in {timezone.replace("_", " ")}
                {showLocalTime && " · your local time shown on selection"}
              </p>

              {!firstOpen ? (
                <p className="text-light-gray text-sm">
                  No times are open right now. Please{" "}
                  <a href="/contact" className="text-electric-blue hover:underline">
                    get in touch
                  </a>{" "}
                  and I'll find a time for you.
                </p>
              ) : activeSlots.length === 0 ? (
                <p className="text-light-gray text-sm">
                  Pick a highlighted day to see times.
                </p>
              ) : (
                <div className="space-y-5 max-h-[360px] overflow-y-auto pr-1">
                  {[
                    { title: "Morning", slots: morning },
                    { title: "Afternoon", slots: afternoon },
                  ]
                    .filter((g) => g.slots.length > 0)
                    .map((g) => (
                      <div key={g.title}>
                        <Label>{g.title}</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {g.slots.map((s) => {
                            const isActive = selected?.start === s.start;
                            return (
                              <button
                                key={s.start}
                                type="button"
                                onClick={() => {
                                  setSelected(s);
                                  setError(null);
                                }}
                                aria-pressed={isActive}
                                className={cn(
                                  "rounded-md px-3 py-2.5 text-sm border font-medium transition-colors",
                                  isActive
                                    ? "border-electric-blue text-midnight bg-electric-blue"
                                    : "border-light-gray/15 text-light-gray hover:text-white hover:border-electric-blue/50",
                                )}
                              >
                                {s.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Summary + continue */}
          <div className="space-y-4 lg:sticky lg:top-24">
            {summary}
            <div>
              <Label htmlFor="booking-notes">Anything I should know? (optional)</Label>
              <Textarea
                id="booking-notes"
                placeholder="A short note about your team and goal helps me prepare."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={1000}
                className="min-h-[96px]"
              />
            </div>
            {error && (
              <p role="alert" className="text-amber-gold text-sm">
                {error}
              </p>
            )}
            <Button
              type="button"
              size="lg"
              className="w-full"
              disabled={!selected || pending}
              onClick={onContinue}
            >
              {pending ? "Reserving your time..." : "Continue to payment →"}
            </Button>
            <p className="text-muted text-xs text-center">
              🔒 Secure payment by Stripe
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
