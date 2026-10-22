import { addDays, addMinutes, parseISO } from "date-fns";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type Slot = {
  /** ISO UTC string */
  start: string;
  /** ISO UTC string */
  end: string;
  /** Pre-formatted label in the host timezone (default Brisbane) */
  label: string;
};

export type DayAvailability = {
  /** yyyy-MM-dd in the host timezone */
  date: string;
  label: string;
  slots: Slot[];
};

export const DEFAULT_TZ = "Australia/Brisbane";

/** How many days ahead clients can book. */
export const BOOKING_WINDOW_DAYS = 56;

/** Slots start every N minutes inside an availability window. */
const SLOT_STEP_MINUTES = 30;

/**
 * A `pending` booking holds its slot while the client is paying. Matches
 * the Stripe Checkout session lifetime, after which the hold lapses.
 */
export const PAYMENT_HOLD_MINUTES = 30;

type Window = { start: string; end: string };
type BusyRange = { start: number; end: number };

type AvailabilityData = {
  rules: Array<{ day_of_week: number; start_time: string; end_time: string }>;
  overrides: Array<{
    date: string;
    is_available: boolean;
    start_time: string | null;
    end_time: string | null;
  }>;
  busy: BusyRange[];
};

/**
 * Decides whether a slot starting at `slotStart` can still be booked at
 * time `now`. Prevents last-minute bookings you can't prepare for.
 */
export function isBookableStart(slotStart: Date, now: Date): boolean {
  const MIN_NOTICE_HOURS = 12;
  return slotStart.getTime() - now.getTime() >= MIN_NOTICE_HOURS * 3600_000;
}

/** Today's date (yyyy-MM-dd) in the host timezone, offset by `offsetDays`. */
function zonedDateString(offsetDays: number, tz: string) {
  const today = formatInTimeZone(new Date(), tz, "yyyy-MM-dd");
  return formatInTimeZone(
    addDays(parseISO(`${today}T12:00:00Z`), offsetDays),
    "UTC",
    "yyyy-MM-dd",
  );
}

function dayOfWeek(date: string) {
  return parseISO(`${date}T12:00:00Z`).getUTCDay();
}

async function loadAvailabilityData(
  fromIso: string,
  toIso: string,
  fromDate: string,
  toDate: string,
): Promise<AvailabilityData> {
  const supabase = createSupabaseAdminClient();
  const [rules, overrides, bookings] = await Promise.all([
    supabase.from("availability_rules").select("day_of_week, start_time, end_time"),
    supabase
      .from("availability_overrides")
      .select("date, is_available, start_time, end_time")
      .gte("date", fromDate)
      .lte("date", toDate),
    supabase
      .from("bookings")
      .select("slot_start, slot_end")
      .or(
        `status.in.(paid,confirmed),and(status.eq.pending,created_at.gt.${new Date(
          Date.now() - PAYMENT_HOLD_MINUTES * 60_000,
        ).toISOString()})`,
      )
      .lt("slot_start", toIso)
      .gt("slot_end", fromIso),
  ]);
  const failed = rules.error ?? overrides.error ?? bookings.error;
  if (failed) throw new Error(`Availability query failed: ${failed.message}`);

  return {
    rules: rules.data ?? [],
    overrides: overrides.data ?? [],
    busy: (bookings.data ?? []).map((b) => ({
      start: new Date(b.slot_start).getTime(),
      end: new Date(b.slot_end).getTime(),
    })),
  };
}

function slotsForDate(
  date: string,
  durationMinutes: number,
  tz: string,
  data: AvailabilityData,
  now: Date,
): Slot[] {
  let windows: Window[] = [];
  const override = data.overrides.find((o) => o.date === date);
  if (override) {
    if (!override.is_available) return [];
    if (override.start_time && override.end_time) {
      windows = [{ start: override.start_time, end: override.end_time }];
    }
  }
  if (windows.length === 0) {
    windows = data.rules
      .filter((r) => r.day_of_week === dayOfWeek(date))
      .map((r) => ({ start: r.start_time, end: r.end_time }));
  }

  const slots: Slot[] = [];
  for (const w of windows) {
    const windowEnd = fromZonedTime(`${date} ${w.end.slice(0, 5)}`, tz);
    let cursor = fromZonedTime(`${date} ${w.start.slice(0, 5)}`, tz);

    while (addMinutes(cursor, durationMinutes) <= windowEnd) {
      const end = addMinutes(cursor, durationMinutes);
      const overlaps = data.busy.some(
        (b) => cursor.getTime() < b.end && end.getTime() > b.start,
      );
      if (!overlaps && isBookableStart(cursor, now)) {
        slots.push({
          start: cursor.toISOString(),
          end: end.toISOString(),
          label: formatInTimeZone(cursor, tz, "h:mm a"),
        });
      }
      cursor = addMinutes(cursor, SLOT_STEP_MINUTES);
    }
  }
  return slots.sort((a, b) => a.start.localeCompare(b.start));
}

/**
 * Every date in the booking window (host timezone) with its open slots.
 */
export async function getAvailability(opts: {
  durationMinutes: number;
  days?: number;
  timezone?: string;
}): Promise<DayAvailability[]> {
  const days = opts.days ?? BOOKING_WINDOW_DAYS;
  const tz = opts.timezone ?? DEFAULT_TZ;
  const dates = Array.from({ length: days }, (_, i) => zonedDateString(i, tz));
  const fromIso = fromZonedTime(`${dates[0]} 00:00`, tz).toISOString();
  const toIso = fromZonedTime(
    `${zonedDateString(days, tz)} 00:00`,
    tz,
  ).toISOString();

  const data = await loadAvailabilityData(
    fromIso,
    toIso,
    dates[0],
    dates[dates.length - 1],
  );
  const now = new Date();

  return dates.map((date) => ({
    date,
    label: formatInTimeZone(parseISO(`${date}T12:00:00Z`), "UTC", "EEE d MMM"),
    slots: slotsForDate(date, opts.durationMinutes, tz, data, now),
  }));
}

/**
 * Re-checks a single slot right before payment, so two people can't pay
 * for the same time and nobody can book a time that was never offered.
 */
export async function isSlotAvailable(opts: {
  slotStart: string;
  durationMinutes: number;
  timezone?: string;
}): Promise<boolean> {
  const tz = opts.timezone ?? DEFAULT_TZ;
  const start = new Date(opts.slotStart);
  if (Number.isNaN(start.getTime())) return false;

  const date = formatInTimeZone(start, tz, "yyyy-MM-dd");
  const data = await loadAvailabilityData(
    fromZonedTime(`${date} 00:00`, tz).toISOString(),
    addDays(fromZonedTime(`${date} 00:00`, tz), 1).toISOString(),
    date,
    date,
  );
  return slotsForDate(date, opts.durationMinutes, tz, data, new Date()).some(
    (s) => s.start === start.toISOString(),
  );
}
