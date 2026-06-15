import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Dashboard" };

type BookingRow = {
  id: string;
  slot_start: string;
  slot_end: string;
  status: string;
  meet_link: string | null;
  service: { name: string; duration_minutes: number } | null;
};

async function safeLoadDashboard(): Promise<{
  email: string | null;
  bookings: BookingRow[];
  ready: boolean;
}> {
  // If Supabase isn't configured yet, return a preview-only stub.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return { email: null, bookings: [], ready: false };
  }
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const email = user?.email ?? null;

    const { data } = await supabase
      .from("bookings")
      .select("id, slot_start, slot_end, status, meet_link, service:services(name, duration_minutes)")
      .order("slot_start", { ascending: true });

    return {
      email,
      bookings: (data as unknown as BookingRow[]) ?? [],
      ready: true,
    };
  } catch {
    return { email: null, bookings: [], ready: false };
  }
}

export default async function DashboardPage() {
  const { email, bookings, ready } = await safeLoadDashboard();

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-50 pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-1 accent-bar" />
        <Container className="relative pt-20 pb-12 lg:pt-24">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <Badge tone="blue" className="mb-4">
                Account
              </Badge>
              <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
                Your dashboard
              </h1>
              {email && (
                <p className="text-light-gray mt-3">Signed in as {email}.</p>
              )}
            </div>
            {ready && <SignOutButton />}
          </div>
        </Container>
      </section>

      {!ready && (
        <Section>
          <Card>
            <CardTitle className="mb-3">Preview mode</CardTitle>
            <CardDescription>
              The dashboard will list your upcoming and past consulting
              sessions once Supabase is connected. Connect it via{" "}
              <code>.env.local</code> →{" "}
              <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
              <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
            </CardDescription>
            <div className="mt-6">
              <LinkButton href="/services" variant="outline" size="sm">
                Browse services
              </LinkButton>
            </div>
          </Card>
        </Section>
      )}

      {ready && (
        <Section eyebrow="Upcoming" title="Your sessions">
          {bookings.length === 0 ? (
            <Card>
              <CardDescription>
                You have no bookings yet.{" "}
                <a href="/services" className="text-electric-blue hover:underline">
                  Book your first session →
                </a>
              </CardDescription>
            </Card>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => (
                <Card
                  key={b.id}
                  className="flex flex-wrap items-center justify-between gap-4"
                >
                  <div>
                    <p className="text-white font-bold">
                      {b.service?.name ?? "Consultation"}
                    </p>
                    <p className="text-light-gray text-sm">
                      {new Date(b.slot_start).toLocaleString()} ·{" "}
                      {b.service?.duration_minutes ?? "—"} min
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge tone={b.status === "confirmed" ? "mint" : "muted"}>
                      {b.status}
                    </Badge>
                    {b.meet_link && (
                      <LinkButton
                        href={b.meet_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="outline"
                        size="sm"
                      >
                        Join Meet →
                      </LinkButton>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Section>
      )}
    </>
  );
}
