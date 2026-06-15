import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";

export const metadata: Metadata = { title: "Admin" };

export default function AdminOverviewPage() {
  return (
    <>
      <Badge tone="violet" className="mb-4">
        Admin
      </Badge>
      <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
        Overview
      </h1>
      <p className="text-light-gray mb-8 max-w-2xl">
        Operations console for bookings, services, availability, messages, and
        the newsletter. Live data appears once Supabase is connected and your
        account has the <code>admin</code> role.
      </p>

      <div className="grid md:grid-cols-3 gap-5">
        {[
          {
            h: "Bookings",
            d: "Review upcoming and past consultations, statuses, and Meet links.",
          },
          {
            h: "Services",
            d: "Manage the catalogue, pricing, and what's offered. Built to scale to webinars and courses.",
          },
          {
            h: "Availability",
            d: "Set weekly rules and one-off overrides that drive bookable slots.",
          },
          {
            h: "Messages",
            d: "Read and triage inbound contact form submissions.",
          },
          {
            h: "Newsletter",
            d: "View subscribers and export the list.",
          },
        ].map((c) => (
          <Card key={c.h}>
            <CardTitle className="mb-2">{c.h}</CardTitle>
            <CardDescription>{c.d}</CardDescription>
          </Card>
        ))}
      </div>
    </>
  );
}
