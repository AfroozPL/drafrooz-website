import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { BookingPicker } from "@/components/booking/booking-picker";
import { getServiceBySlug } from "@/lib/services/queries";
import { formatCurrency } from "@/lib/utils";
import { DEFAULT_TZ, type Slot } from "@/lib/booking/availability";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { addDays, format } from "date-fns";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  return {
    title: service ? `Book — ${service.name}` : "Book",
  };
}

/**
 * Generates a demo 14-day window of slots when Supabase isn't configured —
 * useful for previewing the booking UI before the database is wired up.
 */
function demoAvailability(durationMinutes: number) {
  const out: Array<{ date: string; label: string; slots: Slot[] }> = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const day = addDays(today, i);
    const dow = day.getDay();
    const slots: Slot[] = [];
    if (dow !== 0 && dow !== 6) {
      for (let hour = 9; hour < 17; hour++) {
        const slotStart = new Date(day);
        slotStart.setHours(hour, 0, 0, 0);
        if (slotStart.getTime() <= Date.now()) continue;
        const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60000);
        slots.push({
          start: slotStart.toISOString(),
          end: slotEnd.toISOString(),
          label: `${hour.toString().padStart(2, "0")}:00`,
        });
      }
    }
    out.push({
      date: format(day, "yyyy-MM-dd"),
      label: format(day, "EEE d MMM"),
      slots,
    });
  }
  return out;
}

async function loadDays(durationMinutes: number) {
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    try {
      const { getAvailability } = await import("@/lib/booking/availability");
      return await getAvailability({ durationMinutes });
    } catch {
      return demoAvailability(durationMinutes);
    }
  }
  return demoAvailability(durationMinutes);
}

export default async function BookPage({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  // Soft auth gate: only enforce if Supabase is configured.
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const supabase = await createSupabaseServerClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        redirect(`/login?redirect=/book/${slug}`);
      }
    } catch {
      // No-op — surface page for preview.
    }
  }

  const days = await loadDays(service.duration_minutes);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-50 pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-1 accent-bar" />
        <Container className="relative pt-20 pb-10 lg:pt-24">
          <Badge tone={service.tone} className="mb-6">
            Book · {service.duration_minutes} min
          </Badge>
          <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight max-w-2xl text-balance">
            Book {service.name}
          </h1>
          <p className="mt-3 text-light-gray max-w-2xl">{service.tagline}</p>
          <p className="mt-4 text-electric-blue font-bold">
            {formatCurrency(service.price_cents, service.currency)} · paid
            securely at booking
          </p>
        </Container>
      </section>

      <Section>
        {!process.env.STRIPE_SECRET_KEY && (
          <Card className="mb-8">
            <CardTitle className="mb-2">Preview mode</CardTitle>
            <CardDescription>
              Stripe isn't connected yet, so "Continue to payment" will simulate
              a successful booking for preview purposes. Add{" "}
              <code>STRIPE_SECRET_KEY</code> to <code>.env.local</code> to
              enable real payments.
            </CardDescription>
          </Card>
        )}
        <Card>
          <BookingPicker
            serviceSlug={service.slug}
            serviceName={service.name}
            days={days}
            timezone={DEFAULT_TZ}
            priceLabel={`${formatCurrency(service.price_cents, service.currency)} · ${service.duration_minutes} min`}
          />
        </Card>
      </Section>
    </>
  );
}
