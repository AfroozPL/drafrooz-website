import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getServices } from "@/lib/services/queries";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin · Services" };

export default async function AdminServicesPage() {
  const services = await getServices();
  return (
    <>
      <h1 className="text-2xl font-bold text-white tracking-tight mb-2">
        Services
      </h1>
      <p className="text-light-gray mb-8 max-w-2xl">
        The service catalogue. Editing writes to the <code>services</code> table
        in Supabase; the schema already supports adding webinars and courses.
      </p>
      <div className="space-y-4">
        {services.map((s) => (
          <Card
            key={s.slug}
            className="flex flex-wrap items-center justify-between gap-4"
          >
            <div>
              <CardTitle>{s.name}</CardTitle>
              <CardDescription className="mt-1">{s.tagline}</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <Badge tone={s.tone}>{s.duration_minutes} min</Badge>
              <span className="text-white font-bold">
                {formatCurrency(s.price_cents, s.currency)}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
