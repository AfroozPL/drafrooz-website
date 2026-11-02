import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { Icon } from "@/components/site/icons";

/** Accessible accordion built on native <details>. */
export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
      {items.map((item, i) => (
        <Reveal key={item.q} delay={i * 60}>
          <details className="faq group py-2">
            <summary className="flex items-center justify-between gap-6 py-5">
              <span className="font-display text-lg sm:text-xl font-medium text-white group-hover:text-electric-blue transition-colors">
                {item.q}
              </span>
              <span className="faq-icon grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/15 text-electric-blue transition-transform duration-300">
                <Icon name="plus" className="h-4 w-4" />
              </span>
            </summary>
            <p className="pb-6 pr-14 text-light-gray leading-relaxed">{item.a}</p>
          </details>
        </Reveal>
      ))}
    </div>
  );
}

/** Sitewide closing call-to-action promoting the free strategy call. */
export function FreeCallBand({
  eyebrow = "Free 30-minute strategy call",
  title = (
    <>
      Your next step with AI <span className="font-serif italic font-normal gradient-text">starts here.</span>
    </>
  ),
  body = "Tell me about your business and what you want to improve. In 30 minutes we'll find where AI can genuinely help — and what to do first.",
}: {
  eyebrow?: string;
  title?: React.ReactNode;
  body?: string;
}) {
  return (
    <section className="relative py-20 lg:py-28">
      <Container>
        <Reveal variant="scale">
          <div className="grain relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-navy via-[#13163a] to-[#1d1147] px-6 py-16 sm:px-12 lg:py-24 text-center">
            <div aria-hidden className="absolute -top-24 left-1/2 h-72 w-[700px] -translate-x-1/2 rounded-full bg-electric-blue/25 blur-[100px]" />
            <div aria-hidden className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-deep-violet/40 blur-[100px]" />
            <div aria-hidden className="absolute inset-0 hero-grid opacity-60" />

            <div className="relative">
              <p className="eyebrow !text-vivid-mint">{eyebrow}</p>
              <h2 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white text-balance max-w-3xl mx-auto leading-[1.02]">
                {title}
              </h2>
              <p className="mt-6 text-lg text-light-gray max-w-2xl mx-auto">{body}</p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/strategy-call"
                  className="group inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 font-semibold text-ink transition hover:shadow-[0_0_40px_rgba(255,255,255,0.35)]"
                >
                  Book a free strategy call
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-white transition-transform group-hover:translate-x-1">
                    <Icon name="arrow" className="h-3.5 w-3.5" />
                  </span>
                </Link>
                <a href="mailto:afroozarjmand@gmail.com" className="text-light-gray hover:text-white transition-colors">
                  Prefer email? afroozarjmand@gmail.com
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/** Infinite horizontal ticker. Content is duplicated for a seamless loop. */
export function Marquee({ items }: { items: string[] }) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-10 pr-10">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-10 whitespace-nowrap font-display text-2xl sm:text-3xl font-medium text-white/70">
          {item}
          <span className="text-electric-blue">✦</span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="group relative flex overflow-hidden py-8 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
      <div className="flex animate-marquee group-hover:[animation-play-state:paused]">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
