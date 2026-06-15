import { addDays, addMinutes, format, isSameDay, parseISO, startOfDay } from "date-fns";
import { formatInTimeZone, fromZonedTime, toZonedTime } from "date-fns-tz";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type Slot = {
  /** ISO UTC string */
  start: string;
  /** ISO UTC string */
  end: string;
  /** Pre-formatted label in the host timezone (default Brisbane) */
  label: string;
};

export const DEFAULT_TZ = "Australia/Brisbane";

/**
 * Given a date (in host timezone), compute all bookable slots for a service.
 */
export async function getSlotsForDate(opts: {
  date: Date;
  durationMinutes: number;
  timezone?: string;
}): Promise<Slot[]> {
  const tz = opts.timezone ?? DEFAULT_TZ;
  const zonedDate = toZonedTime(opts.date, tz);
  const dayStart = startOfDay(zonedDate);
  const isoDate = format(dayStart, "yyyy-MM-dd");
  const dow = dayStart.getDay();

  const supabase = createSupabaseAdminClient();

  const [{ data: rules }, { data: override }, { data: existingBookings }] =
    await Promise.all([
      supabase
        .from("availability_rules")
        .select("*")
        .eq("day_of_week", dow),
      supabase
        .from("availability_overrides")
        .select("*")
        .eq("date", isoDate)
        .maybeSingle(),
      supabase
        .from("bookings")
        .select("slot_start, slot_end")
        .in("status", ["pending", "paid", "confirmed"])
        .gte("slot_start", fromZonedTime(dayStart, tz).toISOString())
        .lt(
          "slot_start",
          fromZonedTime(addDays(dayStart, 1), tz).toISOString(),
        ),
    ]);

  let windows: Array<{ start: string; end: string }> = [];
  if (override) {
    if (!override.is_available) return [];
    if (override.start_time && override.end_time) {
      windows = [{ start: override.start_time, end: override.end_time }];
    }
  }
  if (windows.length === 0 && rules && rules.length > 0) {
    windows = rules.map((r) => ({ start: r.start_time, end: r.end_time }));
  }
  if (windows.length === 0) return [];

  const taken = new Set(
    (existingBookings ?? []).map((b) => new Date(b.slot_start).toISOString()),
  );

  const slots: Slot[] = [];
  for (const w of windows) {
    const [sh, sm] = w.start.split(":").map(Number);
    const [eh, em] = w.end.split(":").map(Number);

    let cursor = new Date(dayStart);
    cursor.setHours(sh, sm ?? 0, 0, 0);
    const end = new Date(dayStart);
    end.setHours(eh, em ?? 0, 0, 0);

    while (addMinutes(cursor, opts.durationMinutes) <= end) {
      const slotStartUtc = fromZonedTime(cursor, tz);
      const slotEndUtc = addMinutes(slotStartUtc, opts.durationMinutes);
      const iso = slotStartUtc.toISOString();

      if (slotStartUtc.getTime() > Date.now() && !taken.has(iso)) {
        slots.push({
          start: iso,
          end: slotEndUtc.toISOString(),
          label: formatInTimeZone(slotStartUtc, tz, "HH:mm"),
        });
      }
      cursor = addMinutes(cursor, opts.durationMinutes);
    }
  }
  return slots;
}

/**
 * Generates a 14-day rolling window of dates from today, each with its slots.
 */
export async function getAvailability(opts: {
  durationMinutes: number;
  days?: number;
  timezone?: string;
}): Promise<Array<{ date: string; label: string; slots: Slot[] }>> {
  const days = opts.days ?? 14;
  const tz = opts.timezone ?? DEFAULT_TZ;
  const today = toZonedTime(new Date(), tz);

  const out: Array<{ date: string; label: string; slots: Slot[] }> = [];
  for (let i = 0; i < days; i++) {
    const d = addDays(startOfDay(today), i);
    const slots = await getSlotsForDate({
      date: d,
      durationMinutes: opts.durationMinutes,
      timezone: tz,
    });
    out.push({
      date: format(d, "yyyy-MM-dd"),
      label: format(d, "EEE d MMM"),
      slots,
    });
  }
  return out;
}

export function isSameDayInTz(a: Date, b: Date, tz = DEFAULT_TZ) {
  return isSameDay(toZonedTime(a, tz), toZonedTime(b, tz));
}

export function parseSlotStart(iso: string): Date {
  return parseISO(iso);
}
