import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { ContactForm } from "@/components/site/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Dr. Afrooz Purarjomand.",
};

export default function ContactPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-50 pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-1 accent-bar" />
        <Container className="relative pt-20 pb-12 lg:pt-28">
          <Badge tone="blue" className="mb-6">
            Contact
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight max-w-3xl text-balance leading-[1.05]">
            Let's talk about your AI question.
          </h1>
          <p className="mt-5 text-lg text-light-gray max-w-2xl leading-relaxed">
            For paid consulting, the fastest path is to{" "}
            <a href="/services" className="text-electric-blue hover:underline">
              book a session
            </a>
            . For everything else — research collaboration, speaking, media —
            use the form below or email directly.
          </p>
        </Container>
      </section>

      <Section>
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <Card>
              <CardTitle className="mb-6">Send a message</CardTitle>
              <ContactForm />
            </Card>
          </div>
          <div className="lg:col-span-5 space-y-5">
            <Card>
              <CardTitle className="mb-3">Email</CardTitle>
              <CardDescription>
                <a
                  href="mailto:afroozarjmand@gmail.com"
                  className="text-electric-blue hover:underline"
                >
                  afroozarjmand@gmail.com
                </a>
              </CardDescription>
            </Card>
            <Card>
              <CardTitle className="mb-3">Institution</CardTitle>
              <CardDescription>
                Bond University · Faculty of Society &amp; Design
                <br />
                <a
                  href="https://bond.edu.au"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-electric-blue hover:underline"
                >
                  bond.edu.au
                </a>
              </CardDescription>
            </Card>
            <Card>
              <CardTitle className="mb-3">Elsewhere</CardTitle>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://www.linkedin.com/in/afroozpurarjomand"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-electric-blue hover:underline text-sm"
                  >
                    LinkedIn →
                  </a>
                </li>
                <li>
                  <a
                    href="https://scholar.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-electric-blue hover:underline text-sm"
                  >
                    Google Scholar →
                  </a>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}
