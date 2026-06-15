import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";
import { brand } from "@/lib/content/brand";

export const metadata: Metadata = {
  title: "About",
  description:
    "Dr. Afrooz Purarjomand — AI/ML & GenAI Specialist · Assistant Professor at Bond University.",
};

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-50 pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-1 accent-bar" />
        <Container className="relative pt-20 pb-12 lg:pt-28">
          <Badge tone="violet" className="mb-6">
            About
          </Badge>
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7">
              <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight text-balance leading-[1.05]">
                {brand.name}
              </h1>
              <p className="mt-4 text-electric-blue text-lg font-medium">
                {brand.title}
              </p>
              <p className="mt-1 text-light-gray">{brand.institution}</p>
              <p className="mt-8 text-lg text-light-gray leading-relaxed">
                {brand.positioning}
              </p>
              <blockquote className="mt-8 border-l-2 border-electric-blue pl-5 italic text-white text-lg leading-relaxed">
                "I help organisations turn AI hype into measurable strategy. As
                an AI researcher and assistant professor at Bond University, I
                combine peer-reviewed research with enterprise consulting to
                ensure your AI investments actually work."
              </blockquote>
            </div>

            {/* Headshot placeholder */}
            <div className="lg:col-span-5">
              <div className="surface-card aspect-[4/5] flex flex-col items-center justify-center p-8 text-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-electric-blue/20 to-deep-violet/20 border border-electric-blue/30 flex items-center justify-center mb-6">
                  <span className="text-electric-blue text-4xl font-bold">
                    AP
                  </span>
                </div>
                <p className="text-white font-bold">Headshot placeholder</p>
                <p className="text-muted text-xs mt-2 max-w-[200px]">
                  Professional photo will replace this once you upload it to{" "}
                  <code className="text-light-gray">/public/headshot.jpg</code>.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Section
        eyebrow="Mission"
        title={brand.mission}
        description={brand.vision}
      />

      <Section eyebrow="Brand Values">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {brand.values.map((v) => (
            <Card key={v.name}>
              <Badge tone={v.tone} className="mb-4">
                {v.name}
              </Badge>
              <CardDescription>{v.description}</CardDescription>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Curriculum Vitae"
        title="Selected research, teaching, and consultancy."
        description="A full CV will live here once Dr. Afrooz uploads it. Below is the structure it will follow."
      >
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              h: "Academic appointments",
              items: [
                "Assistant Professor, Bond University — Faculty of Society & Design",
                "Research streams: GenAI, IS, business analytics, healthcare data science",
                "Doctoral supervision and curriculum design",
              ],
            },
            {
              h: "Industry & consultancy",
              items: [
                "Enterprise AI strategy advisory",
                "Healthcare data science programmes",
                "Workforce AI literacy and capability building",
              ],
            },
            {
              h: "Research focus",
              items: [
                "Responsible adoption of GenAI in enterprise contexts",
                "Healthcare innovation through AI-augmented decision support",
                "IS curriculum for the GenAI era",
              ],
            },
            {
              h: "Speaking & teaching",
              items: [
                "Executive workshops on AI strategy and governance",
                "Postgraduate and undergraduate teaching in IS / analytics",
                "Public lectures and panel contributions",
              ],
            },
          ].map((b) => (
            <Card key={b.h}>
              <CardTitle className="mb-4">{b.h}</CardTitle>
              <ul className="space-y-2">
                {b.items.map((it) => (
                  <li
                    key={it}
                    className="text-light-gray text-sm flex items-start gap-2"
                  >
                    <span className="text-electric-blue mt-1">▸</span>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        <div className="mt-10 surface-card p-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-white font-bold">Full CV — coming soon</p>
            <p className="text-light-gray text-sm mt-1">
              Once uploaded, this becomes a downloadable PDF link.
            </p>
          </div>
          <LinkButton href="/contact" variant="outline" size="sm">
            Request a copy →
          </LinkButton>
        </div>
      </Section>

      <Section eyebrow="Get in touch" title="Want to work together?">
        <div className="flex flex-wrap gap-4">
          <LinkButton href="/services" size="lg">
            See consulting services
          </LinkButton>
          <LinkButton href="/contact" variant="outline" size="lg">
            Send a message
          </LinkButton>
        </div>
      </Section>
    </>
  );
}
