import * as React from "react";
import { Text, Heading } from "@react-email/components";
import { EmailLayout, colors } from "./_layout";

type Props = {
  clientName: string;
  clientEmail: string;
  serviceName: string;
  slotStartHuman: string;
  durationMinutes: number;
  amountPaid: string;
  meetLink?: string;
  notes?: string;
};

/** Sent to the site owner whenever a client completes a paid booking. */
export function BookingNotificationEmail({
  clientName,
  clientEmail,
  serviceName,
  slotStartHuman,
  durationMinutes,
  amountPaid,
  meetLink,
  notes,
}: Props) {
  const row = (label: string, value: React.ReactNode) => (
    <Text style={{ color: colors.lightGray, fontSize: 13, margin: "0 0 6px" }}>
      <strong style={{ color: colors.white }}>{label}:</strong> {value}
    </Text>
  );

  return (
    <EmailLayout preview={`New booking: ${clientName} — ${slotStartHuman}`}>
      <Heading
        as="h1"
        style={{
          color: colors.white,
          fontSize: 20,
          fontWeight: 700,
          margin: "0 0 16px 0",
        }}
      >
        New paid booking
      </Heading>
      {row("Client", `${clientName} <${clientEmail}>`)}
      {row("Session", `${serviceName} · ${durationMinutes} min`)}
      {row("When", slotStartHuman)}
      {row("Paid", amountPaid)}
      {meetLink && row("Meet", meetLink)}
      {notes && (
        <Text
          style={{
            color: colors.white,
            fontSize: 14,
            whiteSpace: "pre-wrap",
            marginTop: 16,
            padding: 16,
            backgroundColor: "rgba(184,196,212,0.05)",
            borderRadius: 8,
          }}
        >
          {notes}
        </Text>
      )}
    </EmailLayout>
  );
}
