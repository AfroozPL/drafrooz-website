import type { Metadata } from "next";
import Link from "next/link";
import { getBookings, getContacts, getMessages } from "@/lib/admin/data";
import { fmtDateTime, fmtMoney, timeAgo } from "@/components/admin/format";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin · Overview" };
export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [messages, bookings, contacts] = await Promise.all([getMessages(), getBookings(), getContacts()]);
  const now = Date.now();

  const newMessages = messages.filter((m) => m.status === "new");
  const openCalls = messages.filter(
    (m) => m.kind === "strategy-call" && (m.status === "new" || m.status === "read"),
  );
  const upcoming = bookings
    .filter((b) => (b.status === "paid" || b.status === "confirmed") && new Date(b.slot_end).getTime() >= now)
    .sort((a, b) => a.slot_start.localeCompare(b.slot_start));
  const paidRevenue = bookings
    .filter((b) => b.status === "paid" || b.status === "confirmed" || b.status === "completed")
    .reduce((sum, b) => sum + (b.priceCents ?? 0), 0);

  const stats = [
    { label: "New messages", value: newMessages.length, href: "/admin/messages", accent: newMessages.length > 0 },
    { label: "Strategy calls to arrange", value: openCalls.length, href: "/admin/messages?tab=strategy-call", accent: openCalls.length > 0 },
    { label: "Upcoming sessions", value: upcoming.length, href: "/admin/bookings" },
    { label: "Contacts", value: contacts.length, href: "/admin/contacts" },
  ];

  return (
    <>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-white">Overview</h1>
      <p className="mt-2 mb-8 text-light-gray">
        What needs your attention, at a glance. Session revenue to date (ex GST):{" "}
        <span className="text-white">{fmtMoney(paidRevenue, "AUD")}</span>
      </p>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={cn(
              "rounded-2xl border p-5 transition-colors hover:border-electric-blue/50",
              s.accent ? "border-vivid-mint/40 bg-vivid-mint/[0.06]" : "border-white/[0.08] bg-navy/40",
            )}
          >
            <p className={cn("font-display text-4xl font-semibold", s.accent ? "text-vivid-mint" : "text-white")}>
              {s.value}
            </p>
            <p className="mt-1 text-sm text-light-gray">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-6 xl:grid-cols-2">
        <Panel title="Next sessions" href="/admin/bookings" empty="No upcoming sessions booked.">
          {upcoming.slice(0, 5).map((b) => (
            <li key={b.id} className="flex items-start justify-between gap-4 py-3">
              <div className="min-w-0">
                <p className="truncate font-medium text-white">{b.clientName ?? b.clientEmail ?? "Client"}</p>
                <p className="text-sm text-muted">{b.serviceName}</p>
              </div>
              <p className="shrink-0 text-right text-sm text-light-gray">{fmtDateTime(b.slot_start)}</p>
            </li>
          ))}
        </Panel>

        <Panel title="Latest enquiries" href="/admin/messages" empty="No messages yet.">
          {messages
            .filter((m) => m.status !== "archived")
            .slice(0, 6)
            .map((m) => (
              <li key={m.id} className="flex items-start justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 font-medium text-white">
                    {m.status === "new" && <span className="h-2 w-2 rounded-full bg-vivid-mint" aria-label="New" />}
                    <span className="truncate">{m.name}</span>
                    {m.kind === "strategy-call" && (
                      <span className="shrink-0 rounded-full bg-vivid-mint/10 px-2 py-0.5 font-mono text-[10px] uppercase text-vivid-mint">
                        Strategy call
                      </span>
                    )}
                  </p>
                  <p className="truncate text-sm text-muted">{m.body}</p>
                </div>
                <p className="shrink-0 text-xs text-muted">{timeAgo(m.created_at)}</p>
              </li>
            ))}
        </Panel>
      </div>
    </>
  );
}

function Panel({
  title,
  href,
  empty,
  children,
}: {
  title: string;
  href: string;
  empty: string;
  children: React.ReactNode;
}) {
  const hasItems = Array.isArray(children) ? children.length > 0 : Boolean(children);
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-navy/30 p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-white">{title}</h2>
        <Link href={href} className="text-sm text-electric-blue hover:underline">View all →</Link>
      </div>
      {hasItems ? (
        <ul className="mt-3 divide-y divide-white/[0.06]">{children}</ul>
      ) : (
        <p className="mt-4 text-sm text-light-gray">{empty}</p>
      )}
    </section>
  );
}
