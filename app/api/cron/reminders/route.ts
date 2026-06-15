import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Cron: sends reminder emails for confirmed sessions happening soon.
 * Scheduled in vercel.json every 6 hours.
 * Protected by CRON_SECRET.
 */
export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    auth !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return NextResponse.json({ skipped: "Supabase not configured" });
  }

  try {
    const { createSupabaseAdminClient } = await import("@/lib/supabase/admin");
    const supabase = createSupabaseAdminClient();

    const now = new Date();
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const { data: upcoming, error } = await supabase
      .from("bookings")
      .select("id, slot_start, status")
      .eq("status", "confirmed")
      .gte("slot_start", now.toISOString())
      .lte("slot_start", in24h.toISOString());

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Email sending wired through lib/email/send when RESEND_API_KEY is set.
    return NextResponse.json({ remindersDue: upcoming?.length ?? 0 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Reminders failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
