import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { getAllInsights } from "@/lib/insights/mdx";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Short, opinionated notes on enterprise AI strategy, GenAI research, and healthcare data science.",
};

export default async function InsightsPage() {
  const posts = await getAllInsights();

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-50 pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-1 accent-bar" />
        <Container className="relative pt-20 pb-12 lg:pt-28">
          <Badge tone="amber" className="mb-6">
            Insights
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight max-w-3xl text-balance leading-[1.05]">
            Notes from the frontier of enterprise AI.
          </h1>
          <p className="mt-5 text-lg text-light-gray max-w-2xl">
            Short, opinionated reads for AI leaders who want evidence, not
            buzzwords. Updated bi-weekly.
          </p>
        </Container>
      </section>

      <Section>
        {posts.length === 0 ? (
          <Card>
            <CardDescription>
              First post lands next week. Subscribe via the footer to be
              notified.
            </CardDescription>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <Link key={post.slug} href={`/insights/${post.slug}`}>
                <Card className="h-full transition-all hover:-translate-y-1">
                  <p className="text-muted text-xs uppercase tracking-wider mb-3">
                    {new Date(post.date).toLocaleDateString("en-AU", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <CardTitle className="mb-3">{post.title}</CardTitle>
                  <CardDescription>{post.excerpt}</CardDescription>
                  {post.tags && (
                    <div className="flex gap-2 flex-wrap mt-5">
                      {post.tags.map((t) => (
                        <Badge key={t} tone="muted">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
