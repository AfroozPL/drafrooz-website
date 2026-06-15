import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Admin · Bookings" };

export default function AdminBookingsPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-white tracking-tight mb-2">
        Bookings
      </h1>
      <p className="text-light-gray mb-8 max-w-2xl">
        Every consultation booking with its payment and confirmation status.
      </p>
      <Card>
        <Badge tone="muted" className="mb-3">
          No data yet
        </Badge>
        <CardTitle className="mb-2">Connect Supabase to see bookings</CardTitle>
        <CardDescription>
          Once a customer pays via Stripe, the webhook writes a confirmed
          booking to the <code>bookings</code> table and it appears here with
          the client, service, slot, and Meet link.
        </CardDescription>
      </Card>
    </>
  );
}
