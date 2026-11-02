import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin/guard";
import { getContacts } from "@/lib/admin/data";

export const dynamic = "force-dynamic";

/** Quote a CSV cell, and neutralise spreadsheet formulas (CSV injection). */
function cell(v: string | number | boolean | null) {
  let s = v == null ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET() {
  if (!(await getAdminUser())) {
    return new NextResponse("Not authorised", { status: 403 });
  }
  const contacts = await getContacts();
  const header = ["Name", "Email", "Company", "Strategy calls", "Bookings", "Messages", "Newsletter", "Last activity"];
  const lines = [
    header.map(cell).join(","),
    ...contacts.map((c) =>
      [c.name, c.email, c.company, c.strategyCalls, c.bookings, c.messages, c.subscribed ? "yes" : "no", c.lastActivity]
        .map(cell)
        .join(","),
    ),
  ];
  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="contacts-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
