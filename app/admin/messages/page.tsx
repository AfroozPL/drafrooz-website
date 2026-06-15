import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Admin · Messages" };

export default function AdminMessagesPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-white tracking-tight mb-2">
        Messages
      </h1>
      <p className="text-light-gray mb-8 max-w-2xl">
        Inbound contact form submissions, newest first.
      </p>
      <Card>
        <Badge tone="muted" className="mb-3">
          No data yet
        </Badge>
        <CardTitle className="mb-2">Connect Supabase to see messages</CardTitle>
        <CardDescription>
          Contact form submissions are stored in the{" "}
          <code>contact_messages</code> table and a notification email is sent
          via Resend.
        </CardDescription>
      </Card>
    </>
  );
}
