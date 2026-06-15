import * as React from "react";
import { Text, Heading } from "@react-email/components";
import { EmailLayout, colors } from "./_layout";

type Props = {
  name: string;
  email: string;
  company?: string;
  message: string;
};

export function ContactNotificationEmail({
  name,
  email,
  company,
  message,
}: Props) {
  return (
    <EmailLayout preview={`New contact form: ${name}`}>
      <Heading
        as="h1"
        style={{
          color: colors.white,
          fontSize: 20,
          fontWeight: 700,
          margin: "0 0 16px 0",
        }}
      >
        New contact form submission
      </Heading>
      <Text style={{ color: colors.lightGray, fontSize: 13, margin: "0 0 6px" }}>
        <strong style={{ color: colors.white }}>From:</strong> {name} &lt;{email}&gt;
      </Text>
      {company && (
        <Text style={{ color: colors.lightGray, fontSize: 13, margin: "0 0 6px" }}>
          <strong style={{ color: colors.white }}>Company:</strong> {company}
        </Text>
      )}
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
        {message}
      </Text>
    </EmailLayout>
  );
}
