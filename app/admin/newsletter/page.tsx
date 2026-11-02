import type { Metadata } from "next";
import { getSubscribers } from "@/lib/admin/data";
import { fmtDate } from "@/components/admin/format";

export const metadata: Metadata = { title: "Admin · Subscribers" };
export const dynamic = "force-dynamic";

export default async function AdminNewsletterPage() {
  const subscribers = await getSubscribers();
  const active = subscribers.filter((s) => s.status === "active");

  return (
    <>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-white">Subscribers</h1>
      <p className="mt-2 mb-8 max-w-2xl text-light-gray">
        {active.length} active newsletter subscriber{active.length === 1 ? "" : "s"}. They also appear
        in Contacts, which you can download as CSV.
      </p>
      <div className="overflow-x-auto rounded-2xl border border-white/[0.08]">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {subscribers.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-12 text-center text-light-gray">
                  No subscribers yet. Sign-ups from the footer form appear here.
                </td>
              </tr>
            )}
            {subscribers.map((s) => (
              <tr key={s.id}>
                <td className="px-5 py-3">
                  <a href={`mailto:${s.email}`} className="text-electric-blue hover:underline">{s.email}</a>
                </td>
                <td className="px-5 py-3 capitalize text-light-gray">{s.status}</td>
                <td className="px-5 py-3 text-light-gray">{fmtDate(s.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
