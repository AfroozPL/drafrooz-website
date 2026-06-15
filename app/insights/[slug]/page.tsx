import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { getAllInsights, getInsightBySlug } from "@/lib/insights/mdx";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getInsightBySlug(slug);
  if (!post) return { title: "Not found" };
  return { title: post.title, description: post.excerpt };
}

export async function generateStaticParams() {
  const posts = await getAllInsights();
  return posts.map((p) => ({ slug: p.slug }));
}

// Minimal MDX-ish renderer: paragraphs, ##/### headings, > quotes, and **bold**.
function renderContent(raw: string) {
  const blocks = raw.split(/\n\n+/);
  return blocks.map((block, i) => {
    const trimmed = block.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith("## ")) {
      return (
        <h2
          key={i}
          className="text-2xl font-bold text-white tracking-tight mt-12 mb-4"
        >
          {trimmed.slice(3)}
        </h2>
      );
    }
    if (trimmed.startsWith("### ")) {
      return (
        <h3
          key={i}
          className="text-xl font-bold text-white tracking-tight mt-8 mb-3"
        >
          {trimmed.slice(4)}
        </h3>
      );
    }
    if (trimmed.startsWith("> ")) {
      return (
        <blockquote
          key={i}
          className="border-l-2 border-electric-blue pl-5 italic text-white text-lg my-6"
        >
          {trimmed.slice(2).replace(/^>\s*/gm, "")}
        </blockquote>
      );
    }
    if (trimmed.startsWith("- ")) {
      const items = trimmed.split(/\n- /).map((s) => s.replace(/^- /, ""));
      return (
        <ul key={i} className="space-y-2 my-6">
          {items.map((it, j) => (
            <li key={j} className="text-light-gray flex items-start gap-3">
              <span className="text-electric-blue mt-1.5">▸</span>
              <span
                dangerouslySetInnerHTML={{
                  __html: it.replace(
                    /\*\*(.+?)\*\*/g,
                    '<strong class="text-white">$1</strong>',
                  ),
                }}
              />
            </li>
          ))}
        </ul>
      );
    }
    return (
      <p
        key={i}
        className="text-light-gray text-lg leading-relaxed my-5"
        dangerouslySetInnerHTML={{
          __html: trimmed
            .replace(
              /\*\*(.+?)\*\*/g,
              '<strong class="text-white">$1</strong>',
            )
            .replace(/_(.+?)_/g, '<em class="text-white">$1</em>'),
        }}
      />
    );
  });
}

export default async function InsightPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getInsightBySlug(slug);
  if (!post) notFound();

  return (
    <article>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-50 pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-1 accent-bar" />
        <Container className="relative pt-20 pb-10 lg:pt-28 max-w-3xl">
          <Link
            href="/insights"
            className="text-electric-blue text-sm hover:underline"
          >
            ← All insights
          </Link>
          <p className="text-muted text-xs uppercase tracking-wider mt-6 mb-4">
            {new Date(post.date).toLocaleDateString("en-AU", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h1 className="text-3xl lg:text-5xl font-bold text-white tracking-tight text-balance leading-[1.1]">
            {post.title}
          </h1>
          {post.tags && (
            <div className="flex gap-2 flex-wrap mt-6">
              {post.tags.map((t) => (
                <Badge key={t} tone="muted">
                  {t}
                </Badge>
              ))}
            </div>
          )}
        </Container>
      </section>

      <Container className="max-w-3xl pb-24">{renderContent(post.content)}</Container>
    </article>
  );
}
