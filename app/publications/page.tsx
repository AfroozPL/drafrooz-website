import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";

export const metadata: Metadata = {
  title: "Publications",
  description:
    "Peer-reviewed research and thought leadership on enterprise AI, GenAI, and healthcare data science.",
};

const placeholderPublications = [
  {
    year: "2026",
    type: "Journal · in review",
    title:
      "Responsible Adoption of Generative AI in Enterprise: A Capability-Maturity Framework",
    venue: "Information Systems Research (under review)",
    summary:
      "A four-stage maturity model for evaluating enterprise readiness for GenAI deployment, validated across 14 Asia-Pacific organisations.",
    tone: "blue" as const,
  },
  {
    year: "2025",
    type: "Conference",
    title:
      "Augmenting Clinical Decision Support with Healthcare-Specific LLMs",
    venue: "ICIS 2025 — Proceedings",
    summary:
      "Empirical evaluation of domain-tuned LLMs in clinical decision workflows, with attention to fairness and accountability.",
    tone: "violet" as const,
  },
  {
    year: "2025",
    type: "Book chapter",
    title:
      "Curriculum Design for the GenAI Era: Rethinking IS & Business Analytics",
    venue: "Routledge Handbook of AI in Higher Education",
    summary:
      "Pedagogical patterns for embedding GenAI literacy across IS and analytics programmes without losing analytical rigour.",
    tone: "mint" as const,
  },
];

export default function PublicationsPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-50 pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-1 accent-bar" />
        <Container className="relative pt-20 pb-12 lg:pt-28">
          <Badge tone="mint" className="mb-6">
            Research
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight max-w-3xl text-balance leading-[1.05]">
            Peer-reviewed publications &amp; selected outputs.
          </h1>
          <p className="mt-5 text-lg text-light-gray max-w-2xl">
            Every claim made in consulting is grounded in research — here are
            the papers, chapters, and outputs behind it.
          </p>
        </Container>
      </section>

      <Section>
        <div className="space-y-5">
          {placeholderPublications.map((pub, i) => (
            <Card
              key={i}
              className="flex flex-col md:flex-row md:items-start md:gap-8"
            >
              <div className="md:w-32 shrink-0 mb-4 md:mb-0">
                <p className="text-electric-blue text-2xl font-bold">
                  {pub.year}
                </p>
                <Badge tone={pub.tone} className="mt-2">
                  {pub.type}
                </Badge>
              </div>
              <div className="flex-1">
                <CardTitle className="mb-2">{pub.title}</CardTitle>
                <p className="text-light-gray text-sm mb-3">{pub.venue}</p>
                <CardDescription>{pub.summary}</CardDescription>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 surface-card p-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-white font-bold">Full publication list</p>
            <p className="text-light-gray text-sm mt-1">
              Maintained on Google Scholar with citation metrics and full-text
              links.
            </p>
          </div>
          <LinkButton
            href="https://scholar.google.com/"
            variant="outline"
            size="md"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Google Scholar →
          </LinkButton>
        </div>
      </Section>
    </>
  );
}
