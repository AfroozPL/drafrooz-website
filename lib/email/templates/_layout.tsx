import * as React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Hr,
} from "@react-email/components";

const colors = {
  midnight: "#0A0E1A",
  navy: "#0D1B2A",
  electricBlue: "#00C2FF",
  lightGray: "#B8C4D4",
  white: "#FFFFFF",
};

export function EmailLayout({
  preview,
  children,
}: {
  preview: string;
  children: React.ReactNode;
}) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body
        style={{
          backgroundColor: colors.midnight,
          fontFamily:
            "Helvetica, Arial, -apple-system, BlinkMacSystemFont, sans-serif",
          margin: 0,
          padding: 0,
          color: colors.white,
        }}
      >
        <Container style={{ maxWidth: "560px", margin: "0 auto", padding: "32px 24px" }}>
          <Section style={{ paddingBottom: 24 }}>
            <Text
              style={{
                color: colors.electricBlue,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "2px",
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              Dr. Afrooz Purarjomand
            </Text>
            <Text
              style={{
                color: colors.lightGray,
                fontSize: 12,
                margin: "4px 0 0 0",
              }}
            >
              Where research meets reality.
            </Text>
          </Section>

          <Section
            style={{
              backgroundColor: colors.navy,
              border: `1px solid rgba(184,196,212,0.12)`,
              borderRadius: 16,
              padding: 32,
            }}
          >
            {children}
          </Section>

          <Hr style={{ borderColor: "rgba(184,196,212,0.12)", margin: "32px 0 16px" }} />
          <Text style={{ color: colors.lightGray, fontSize: 11, lineHeight: "16px", margin: 0 }}>
            Bond University · Faculty of Society &amp; Design.<br />
            You received this email because of a booking, account action, or
            subscription on drafrooz.com.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export { colors };
