import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Admin · Newsletter" };

export default function AdminNewsletterPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-white tracking-tight mb-2">
        Newsletter
      </h1>
      <p className="text-light-gray mb-8 max-w-2xl">
        Subscribers to the research notes list.
      </p>
      <Card>
        <Badge tone="muted" className="mb-3">
          No data yet
        </Badge>
        <CardTitle className="mb-2">
          Connect Supabase to see subscribers
        </CardTitle>
        <CardDescription>
          Footer sign-ups are stored in the{" "}
          <code>newsletter_subscribers</code> table and can be exported here.
        </CardDescription>
      </Card>
    </>
  );
}
