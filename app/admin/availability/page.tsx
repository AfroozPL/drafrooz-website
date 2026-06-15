import type { Metadata } from "next";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { DEFAULT_TZ } from "@/lib/booking/availability";

export const metadata: Metadata = { title: "Admin · Availability" };

export default function AdminAvailabilityPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-white tracking-tight mb-2">
        Availability
      </h1>
      <p className="text-light-gray mb-8 max-w-2xl">
        Weekly rules and one-off overrides determine which slots clients can
        book. Default timezone: <code>{DEFAULT_TZ}</code>.
      </p>
      <div className="grid md:grid-cols-2 gap-5">
        <Card>
          <CardTitle className="mb-2">Weekly rules</CardTitle>
          <CardDescription>
            Define recurring working windows per weekday (stored in{" "}
            <code>availability_rules</code>). Slots are tiled by each service's
            duration.
          </CardDescription>
        </Card>
        <Card>
          <CardTitle className="mb-2">Date overrides</CardTitle>
          <CardDescription>
            Close specific dates or open special windows (stored in{" "}
            <code>availability_overrides</code>) — holidays, travel, one-off
            availability.
          </CardDescription>
        </Card>
      </div>
    </>
  );
}
