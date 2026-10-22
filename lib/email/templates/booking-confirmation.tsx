import * as React from "react";
import { Text, Heading, Button, Section } from "@react-email/components";
import { EmailLayout, colors } from "./_layout";

type Props = {
  recipientName: string;
  serviceName: string;
  slotStartHuman: string;
  durationMinutes: number;
  amountPaid?: string;
  meetLink?: string;
  notes?: string;
};

export function BookingConfirmationEmail({
  recipientName,
  serviceName,
  slotStartHuman,
  durationMinutes,
  amountPaid,
  meetLink,
  notes,
}: Props) {
  return (
    <EmailLayout
      preview={`Your ${serviceName} is confirmed for ${slotStartHuman}`}
    >
      <Heading
        as="h1"
        style={{
          color: colors.white,
          fontSize: 22,
          fontWeight: 700,
          margin: "0 0 8px 0",
        }}
      >
        Your session is confirmed.
      </Heading>
      <Text style={{ color: colors.lightGray, fontSize: 14, margin: "0 0 24px" }}>
        Hi {recipientName}, thanks for booking — looking forward to our
        conversation.
      </Text>

      <Section
        style={{
          backgroundColor: "rgba(0,194,255,0.06)",
          borderLeft: `3px solid ${colors.electricBlue}`,
          padding: 16,
          marginBottom: 24,
        }}
      >
        <Text style={{ color: colors.white, fontSize: 14, fontWeight: 700, margin: 0 }}>
          {serviceName}
        </Text>
        <Text style={{ color: colors.lightGray, fontSize: 13, margin: "6px 0 0" }}>
          {slotStartHuman} · {durationMinutes} minutes
        </Text>
        {amountPaid && (
          <Text style={{ color: colors.lightGray, fontSize: 13, margin: "6px 0 0" }}>
            Paid: {amountPaid}
          </Text>
        )}
      </Section>

      {meetLink ? (
        <Button
          href={meetLink}
          style={{
            backgroundColor: colors.electricBlue,
            color: colors.midnight,
            fontWeight: 700,
            padding: "14px 22px",
            borderRadius: 8,
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Join Google Meet
        </Button>
      ) : (
        <Text style={{ color: colors.lightGray, fontSize: 13, margin: 0 }}>
          Your video-call link will be sent to you before the session.
        </Text>
      )}

      <Text style={{ color: colors.lightGray, fontSize: 12, margin: "24px 0 0" }}>
        Need to reschedule? Simply reply to this email.
      </Text>

      {notes && (
        <Text style={{ color: colors.lightGray, fontSize: 13, marginTop: 16 }}>
          <strong style={{ color: colors.white }}>Your note:</strong> {notes}
        </Text>
      )}
    </EmailLayout>
  );
}
