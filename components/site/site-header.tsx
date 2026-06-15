import Link from "next/link";
import { Container } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/link-button";

const nav = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/publications", label: "Publications" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-light-gray/10 bg-midnight/80 backdrop-blur-md">
      <Container className="flex items-center justify-between h-16">
        <Link
          href="/"
          className="flex items-center gap-2 group"
          aria-label="Dr. Afrooz Purarjomand — Home"
        >
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-electric-blue group-hover:shadow-[0_0_12px_rgba(0,194,255,0.7)] transition-shadow" />
          <span className="font-bold text-white tracking-tight">
            Dr. Afrooz Purarjomand
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-light-gray hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-light-gray hover:text-white transition-colors"
          >
            Sign in
          </Link>
          <LinkButton href="/services" size="sm">
            Book a call
          </LinkButton>
        </div>

        <LinkButton href="/services" size="sm" className="md:hidden">
          Book
        </LinkButton>
      </Container>
    </header>
  );
}
