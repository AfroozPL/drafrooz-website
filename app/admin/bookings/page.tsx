import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getBookings, type AdminBooking } from "@/lib/admin/data";
import { fmtDateTime, fmtMoney } from "@/components/admin/format";
import { MarkCompletedButton } from "@/components/admin/booking-actions";

export const metadata: Metadata = { title: "Admin · Bookings" };
export const dynamic = "force-dynamic";

type View = "upcoming" | "past" | "other";
type Props = { searchParams: Promise<{ view?: string }> };

const STATUS_STYLE: Record<AdminBooking["status"], string> = {
  pending: "bg-amber-gold/15 text-amber-gold",
  paid: "bg-electric-blue/15 text-electric-blue",
  confirmed: "bg-vivid-mint/15 text-vivid-mint",
  completed: "bg-deep-violet/20 text-[#b79cff]",
  cancelled: "bg-white/10 text-muted",
};

const ACTIVE = new Set(["paid", "confirmed"]);

export default async function AdminBookingsPage({ searchParams }: Props) {
  const { view: raw } = await searchParams;
  const view: View = raw === "past" || raw === "other" ? raw : "upcoming";
  const all = await getBookings();
  const now = Date.now();

  const groups: Record<View, AdminBooking[]> = {
    upcoming: all
      .filter((b) => ACTIVE.has(b.status) && new Date(b.slot_end).getTime() >= now)
      .sort((a, b) => a.slot_start.localeCompare(b.slot_start)),
    past: all.filter(
      (b) => b.status === "completed" || (ACTIVE.has(b.status) && new Date(b.slot_end).getTime() < now),
    ),
    other: all.filter((b) => b.status === "pending" || b.status === "cancelled"),
  };
  const rows = groups[view];

  const tabs: { key: View; label: string }[] = [
    { key: "upcoming", label: "Upcoming" },
    { key: "past", label: "Past" },
    { key: "other", label: "Unpaid & cancelled" },
  ];

  return (
    <>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-white">Bookings</h1>
      <p className="mt-2 mb-8 max-w-2xl text-light-gray">
        Paid sessions booked through the website. Times are shown in Brisbane time (AEST).
        Refunds and cancellations are handled in Stripe so clients are actually refunded.
      </p>

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={`/admin/bookings?view=${t.key}`}
            aria-current={view === t.key ? "page" : undefined}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-colors",
              view === t.key
                ? "border-electric-blue bg-electric-blue text-ink font-semibold"
                : "border-white/15 text-light-gray hover:text-white",
            )}
          >
            {t.label} <span className="opacity-70">{groups[t.key].length}</span>
          </Link>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/[0.08]">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-5 py-3 font-medium">When</th>
              <th className="px-5 py-3 font-medium">Client</th>
              <th className="px-5 py-3 font-medium">Session</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-light-gray">
                  {view === "upcoming"
                    ? "No upcoming sessions. New paid bookings will appear here automatically."
                    : "Nothing in this list."}
                </td>
              </tr>
            )}
            {rows.map((b) => (
              <tr key={b.id} className="align-top hover:bg-white/[0.02]">
                <td className="px-5 py-4 text-white whitespace-nowrap">{fmtDateTime(b.slot_start)}</td>
                <td className="px-5 py-4">
                  <p className="font-medium text-white">{b.clientName ?? "—"}</p>
                  {b.clientEmail && (
                    <a href={`mailto:${b.clientEmail}`} className="text-electric-blue hover:underline">
                      {b.clientEmail}
                    </a>
                  )}
                  {b.clientCompany && <p className="text-muted">{b.clientCompany}</p>}
                  {b.notes && <p className="mt-2 max-w-xs whitespace-pre-wrap text-light-gray">“{b.notes}”</p>}
                </td>
                <td className="px-5 py-4">
                  <p className="text-white">{b.serviceName}</p>
                  <p className="text-muted">{fmtMoney(b.priceCents, b.currency)}</p>
                </td>
                <td className="px-5 py-4">
                  <span className={cn("rounded-full px-2.5 py-1 text-xs capitalize", STATUS_STYLE[b.status])}>
                    {b.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex flex-col items-end gap-2">
                    {b.meet_link && (
                      <a href={b.meet_link} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-electric-blue hover:underline">
                        Open Meet link
                      </a>
                    )}
                    {ACTIVE.has(b.status) && <MarkCompletedButton id={b.id} />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
