import type { Metadata } from "next";
import {
  Inter,
  Bricolage_Grotesque,
  Instrument_Serif,
  JetBrains_Mono,
} from "next/font/google";
import Script from "next/script";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { ElevenLabsWidget } from "@/components/site/elevenlabs-widget";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { brand } from "@/lib/content/brand";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://drafrooz.com",
  ),
  title: {
    default: `${brand.name} — ${brand.tagline}`,
    template: `%s · ${brand.name}`,
  },
  description: brand.usp,
  openGraph: {
    title: `${brand.name} — ${brand.tagline}`,
    description: brand.usp,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.name} — ${brand.tagline}`,
    description: brand.usp,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-AU"
      className={`${inter.variable} ${display.variable} ${serif.variable} ${mono.variable}`}
    >
      <body className="bg-ink font-sans text-white antialiased min-h-screen flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-electric-blue focus:px-4 focus:py-2 focus:text-ink"
        >
          Skip to content
        </a>
        <ScrollProgress />
        <SiteHeader />
        <main id="main" className="flex-1">{children}</main>
        <SiteFooter />
        <Script
          src="https://drafrooz-chatbot.vercel.app/widget.js"
          strategy="afterInteractive"
        />
        <ElevenLabsWidget />
      </body>
    </html>
  );
}
