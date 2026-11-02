// Server-only data access for the admin dashboard. Uses the service-role
// client (bypasses RLS), so every exported function checks admin first.

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getAdminUser, supabaseConfigured } from "@/lib/admin/guard";
import type { Database } from "@/lib/supabase/types";

type MessageRow = Database["public"]["Tables"]["contact_messages"]["Row"];
type SubscriberRow = Database["public"]["Tables"]["newsletter_subscribers"]["Row"];

export const STRATEGY_TAG = "[FREE 30-MIN STRATEGY CALL REQUEST]";

export type AdminMessage = MessageRow & {
  kind: "strategy-call" | "contact";
  /** Parsed "Key: value" lines from strategy-call requests. */
  fields: { label: string; value: string }[];
  body: string;
};

export type AdminBooking = {
  id: string;
  status: Database["public"]["Tables"]["bookings"]["Row"]["status"];
  slot_start: string;
  slot_end: string;
  meet_link: string | null;
  notes: string | null;
  created_at: string;
  serviceName: string;
  priceCents: number | null;
  currency: string | null;
  clientName: string | null;
  clientEmail: string | null;
  clientCompany: string | null;
};

export type AdminContact = {
  email: string;
  name: string | null;
  company: string | null;
  messages: number;
  strategyCalls: number;
  bookings: number;
  subscribed: boolean;
  lastActivity: string;
};

async function adminClient() {
  if (!supabaseConfigured()) return null;
  const user = await getAdminUser();
  if (!user) throw new Error("Not authorised");
  return createSupabaseAdminClient();
}

function parseMessage(m: MessageRow): AdminMessage {
  if (!m.message.startsWith(STRATEGY_TAG)) {
    return { ...m, kind: "contact", fields: [], body: m.message };
  }
  const [head, ...rest] = m.message.split("\n\n");
  const fields = head
    .split("\n")
    .slice(1)
    .map((line) => {
      const i = line.indexOf(":");
      return i > 0 ? { label: line.slice(0, i).trim(), value: line.slice(i + 1).trim() } : null;
    })
    .filter((f): f is { label: string; value: string } => f !== null);
  const body = rest.join("\n\n").replace(/^What they want to achieve with AI:\n/, "");
  return { ...m, kind: "strategy-call", fields, body };
}

export async function getMessages(): Promise<AdminMessage[]> {
  const db = await adminClient();
  if (!db) return [];
  const { data, error } = await db
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) throw error;
  return (data ?? []).map(parseMessage);
}

/** Maps auth user ids to email + name (profiles hold name/company). */
async function loadPeople(db: NonNullable<Awaited<ReturnType<typeof adminClient>>>, ids: string[]) {
  const people = new Map<string, { email: string | null; name: string | null; company: string | null }>();
  if (ids.length === 0) return people;
  const unique = [...new Set(ids)];
  const { data: profiles } = await db.from("profiles").select("id, full_name, company").in("id", unique);
  await Promise.all(
    unique.map(async (id) => {
      const { data } = await db.auth.admin.getUserById(id);
      const profile = profiles?.find((p) => p.id === id);
      const meta = data.user?.user_metadata as { full_name?: string } | undefined;
      people.set(id, {
        email: data.user?.email ?? null,
        name: profile?.full_name ?? meta?.full_name ?? null,
        company: profile?.company ?? null,
      });
    }),
  );
  return people;
}

export async function getBookings(): Promise<AdminBooking[]> {
  const db = await adminClient();
  if (!db) return [];
  const { data, error } = await db
    .from("bookings")
    .select("id, user_id, status, slot_start, slot_end, meet_link, notes, created_at, service:services(name, price_cents, currency)")
    .order("slot_start", { ascending: false })
    .limit(500);
  if (error) throw error;
  const rows = (data ?? []) as unknown as (Database["public"]["Tables"]["bookings"]["Row"] & {
    service: { name: string; price_cents: number; currency: string } | null;
  })[];
  const people = await loadPeople(db, rows.map((r) => r.user_id));
  return rows.map((r) => {
    const p = people.get(r.user_id);
    return {
      id: r.id,
      status: r.status,
      slot_start: r.slot_start,
      slot_end: r.slot_end,
      meet_link: r.meet_link,
      notes: r.notes,
      created_at: r.created_at,
      serviceName: r.service?.name ?? "Session",
      priceCents: r.service?.price_cents ?? null,
      currency: r.service?.currency ?? null,
      clientName: p?.name ?? null,
      clientEmail: p?.email ?? null,
      clientCompany: p?.company ?? null,
    };
  });
}

export async function getSubscribers(): Promise<SubscriberRow[]> {
  const db = await adminClient();
  if (!db) return [];
  const { data, error } = await db
    .from("newsletter_subscribers")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(2000);
  if (error) throw error;
  return data ?? [];
}

/** Everyone who has reached out in any way, merged by email. */
export async function getContacts(): Promise<AdminContact[]> {
  const [messages, bookings, subscribers] = await Promise.all([
    getMessages(),
    getBookings(),
    getSubscribers(),
  ]);
  const byEmail = new Map<string, AdminContact>();
  const touch = (email: string | null, patch: Partial<AdminContact>, at: string) => {
    if (!email) return;
    const key = email.toLowerCase();
    const c =
      byEmail.get(key) ??
      { email: key, name: null, company: null, messages: 0, strategyCalls: 0, bookings: 0, subscribed: false, lastActivity: at };
    c.name ??= patch.name ?? null;
    c.company ??= patch.company ?? null;
    if (at > c.lastActivity) c.lastActivity = at;
    byEmail.set(key, c);
    return c;
  };

  for (const m of messages) {
    const c = touch(m.email, { name: m.name, company: m.company }, m.created_at);
    if (!c) continue;
    if (m.kind === "strategy-call") c.strategyCalls++;
    else c.messages++;
  }
  for (const b of bookings) {
    if (b.status === "pending" || b.status === "cancelled") continue;
    const c = touch(b.clientEmail, { name: b.clientName, company: b.clientCompany }, b.created_at);
    if (c) c.bookings++;
  }
  for (const s of subscribers) {
    const c = touch(s.email, {}, s.created_at);
    if (c && s.status === "active") c.subscribed = true;
  }
  return [...byEmail.values()].sort((a, b) => b.lastActivity.localeCompare(a.lastActivity));
}
