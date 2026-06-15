import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";
import { getServiceBySlug, getServices } from "@/lib/services/queries";
import { formatCurrency } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Service not found" };
  return {
    title: service.name,
    description: service.tagline,
  };
}

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-50 pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-1 accent-bar" />
        <Container className="relative pt-20 pb-10 lg:pt-28">
          <Badge tone={service.tone} className="mb-6">
            {service.duration_minutes} minute consultation
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight max-w-3xl text-balance leading-[1.05]">
            {service.name}
          </h1>
          <p className="mt-4 text-electric-blue text-xl font-medium">
            {service.tagline}
          </p>
          <p className="mt-6 text-lg text-light-gray max-w-2xl leading-relaxed">
            {service.description}
          </p>
        </Container>
      </section>

      <Section>
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <Card>
              <CardTitle className="mb-5">What you'll walk away with</CardTitle>
              <ul className="space-y-3">
                {service.bullets.map((b) => (
                  <li
                    key={b}
                    className="text-light-gray flex items-start gap-3 text-base"
                  >
                    <span className="text-electric-blue text-lg leading-none mt-1">
                      ▸
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="mt-6">
              <CardTitle className="mb-3">How a session runs</CardTitle>
              <CardDescription>
                Before we meet, I send a short preparatory note and ask one or
                two scoping questions. The session itself is a structured
                conversation — diagnostic first, then options. You get a written
                summary within 48 hours with the takeaways and a recommended
                next step. Sessions happen on Google Meet.
              </CardDescription>
            </Card>
          </div>

          <div className="lg:col-span-5">
            <Card className="surface-card sticky top-24">
              <p className="text-muted text-xs uppercase tracking-wider mb-2">
                Price
              </p>
              <p className="text-white font-bold text-4xl mb-2">
                {formatCurrency(service.price_cents, service.currency)}
              </p>
              <p className="text-light-gray text-sm mb-6">
                One-time charge · paid securely via Stripe at booking ·
                fully refundable up to 24 hours before the session.
              </p>
              <LinkButton href={`/book/${service.slug}`} size="lg" className="w-full">
                Book this session
              </LinkButton>
              <p className="text-muted text-xs mt-4">
                You'll need to sign in or create a free account to confirm a
                booking.
              </p>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}
