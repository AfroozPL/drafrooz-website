"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation.
  React.useEffect(() => setOpen(false), [pathname]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-500",
        scrolled || open
          ? "border-b border-white/[0.06] bg-ink/75 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <Container className={cn("flex items-center justify-between transition-all duration-500", scrolled ? "h-16" : "h-20")}>
        <Link href="/" className="group flex items-center gap-3" aria-label="Dr. Afrooz Purarjomand — Home">
          <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-electric-blue to-deep-violet font-display text-sm font-bold text-ink transition-transform duration-500 group-hover:rotate-[8deg]">
            AP
          </span>
          <span className="leading-tight">
            <span className="block font-display font-semibold tracking-tight text-white">
              Dr. Afrooz Purarjomand
            </span>
            <span className="hidden sm:block font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
              AI strategy &amp; research
            </span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden lg:flex items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.02] p-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm transition-colors",
                isActive(item.href) ? "bg-white/10 text-white" : "text-light-gray hover:text-white",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <Link href="/login" className="text-sm text-light-gray hover:text-white transition-colors">
            Sign in
          </Link>
          <Link
            href="/strategy-call"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-electric-blue px-5 py-2.5 text-sm font-semibold text-ink transition-shadow hover:shadow-glow-blue"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-ink/60 animate-pulse-ring" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-ink" />
            </span>
            Free strategy call
          </Link>
        </div>

        <button
          type="button"
          className="lg:hidden grid h-10 w-10 place-items-center rounded-full border border-white/10"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="relative block h-3 w-5">
            <span className={cn("absolute left-0 h-0.5 w-5 bg-white transition-all duration-300", open ? "top-1.5 rotate-45" : "top-0")} />
            <span className={cn("absolute left-0 top-1.5 h-0.5 w-5 bg-white transition-opacity duration-300", open && "opacity-0")} />
            <span className={cn("absolute left-0 h-0.5 w-5 bg-white transition-all duration-300", open ? "top-1.5 -rotate-45" : "top-3")} />
          </span>
        </button>
      </Container>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="lg:hidden h-[calc(100dvh-4rem)] overflow-y-auto border-t border-white/[0.06] bg-ink/95 backdrop-blur-xl"
      >
        <Container className="flex flex-col gap-1 py-8">
          {nav.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className="animate-rise-in border-b border-white/[0.06] py-4 font-display text-3xl font-semibold text-white"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/login" className="py-4 text-light-gray">
            Sign in
          </Link>
          <Link
            href="/strategy-call"
            className="mt-4 rounded-full bg-electric-blue px-6 py-4 text-center font-semibold text-ink"
          >
            Book a free 30-min strategy call
          </Link>
        </Container>
      </div>
    </header>
  );
}
