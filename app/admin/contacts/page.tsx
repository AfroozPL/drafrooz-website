import type { Metadata } from "next";
import { getContacts } from "@/lib/admin/data";
import { fmtDate } from "@/components/admin/format";

export const metadata: Metadata = { title: "Admin · Contacts" };
export const dynamic = "force-dynamic";

function Chip({ n, label, tone }: { n: number; label: string; tone: string }) {
  if (n === 0) return null;
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] ${tone}`}>
      {n} {label}
    </span>
  );
}

export default async function AdminContactsPage() {
  const contacts = await getContacts();

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-white">Contacts</h1>
          <p className="mt-2 max-w-2xl text-light-gray">
            Everyone who has reached out — strategy call requests, messages, paid bookings and
            newsletter sign-ups — combined into one person per email address.
          </p>
        </div>
        <a
          href="/admin/contacts/export"
          className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-electric-blue hover:text-electric-blue"
        >
          Download CSV
        </a>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-white/[0.08]">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-5 py-3 font-medium">Person</th>
              <th className="px-5 py-3 font-medium">How they reached you</th>
              <th className="px-5 py-3 font-medium">Last activity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {contacts.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-12 text-center text-light-gray">
                  No contacts yet. People appear here the first time they message, book or subscribe.
                </td>
              </tr>
            )}
            {contacts.map((c) => (
              <tr key={c.email} className="hover:bg-white/[0.02]">
                <td className="px-5 py-4">
                  <p className="font-medium text-white">{c.name ?? "—"}</p>
                  <a href={`mailto:${c.email}`} className="text-electric-blue hover:underline">{c.email}</a>
                  {c.company && <p className="text-muted">{c.company}</p>}
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    <Chip n={c.strategyCalls} label={c.strategyCalls === 1 ? "strategy call" : "strategy calls"} tone="bg-vivid-mint/15 text-vivid-mint" />
                    <Chip n={c.bookings} label={c.bookings === 1 ? "booking" : "bookings"} tone="bg-electric-blue/15 text-electric-blue" />
                    <Chip n={c.messages} label={c.messages === 1 ? "message" : "messages"} tone="bg-deep-violet/20 text-[#b79cff]" />
                    {c.subscribed && <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-light-gray">newsletter</span>}
                  </div>
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-light-gray">{fmtDate(c.lastActivity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
