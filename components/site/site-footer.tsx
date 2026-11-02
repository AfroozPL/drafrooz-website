import Link from "next/link";
import { Container } from "@/components/ui/container";
import { NewsletterForm } from "@/components/site/newsletter-form";
import { practiceAreas } from "@/lib/content/practice";

const navigate = [
  { href: "/strategy-call", label: "Free strategy call" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/publications", label: "Publications" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-white/[0.06] pt-20 pb-10">
      <div aria-hidden className="absolute -bottom-40 left-1/2 h-[400px] w-[900px] -translate-x-1/2 rounded-full bg-deep-violet/10 blur-[120px]" />

      <Container className="relative grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="flex items-center gap-3 mb-5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-electric-blue to-deep-violet font-display text-sm font-bold text-ink">
              AP
            </span>
            <span className="font-display font-semibold text-white tracking-tight">
              Dr. Afrooz Purarjomand
            </span>
          </div>
          <p className="text-light-gray text-sm leading-relaxed max-w-sm">
            AI strategy, implementation and training for businesses and healthcare —
            grounded in research, focused on results.
          </p>
          <p className="mt-4 text-sm text-light-gray">
            Bond University · Gold Coast, Australia
            <br />
            <a href="mailto:afroozarjmand@gmail.com" className="text-electric-blue hover:underline">
              afroozarjmand@gmail.com
            </a>
          </p>
        </div>

        <div className="lg:col-span-3">
          <h4 className="eyebrow !text-white mb-5">Services</h4>
          <ul className="space-y-2.5 text-sm">
            {practiceAreas.map((p) => (
              <li key={p.slug}>
                <Link href={`/services/${p.slug}`} className="text-light-gray hover:text-white transition-colors">
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h4 className="eyebrow !text-white mb-5">Navigate</h4>
          <ul className="space-y-2.5 text-sm">
            {navigate.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-light-gray hover:text-white transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h4 className="eyebrow !text-white mb-5">Stay in the loop</h4>
          <p className="text-light-gray text-sm mb-4 leading-relaxed">
            Practical notes on AI strategy and responsible adoption. No spam.
          </p>
          <NewsletterForm />
        </div>
      </Container>

      <Container className="relative mt-16">
        <p
          aria-hidden
          className="select-none font-display text-[13vw] lg:text-[9.5rem] font-semibold leading-none tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(184,196,212,0.12)]"
        >
          Research meets reality.
        </p>
      </Container>

      <Container className="relative mt-8 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-muted text-xs">
          © {new Date().getFullYear()} Dr. Afrooz Purarjomand. All prices in AUD.
        </p>
        <div className="flex items-center gap-5 text-xs text-muted">
          <a href="https://www.linkedin.com/in/afroozpurarjomand" target="_blank" rel="noopener noreferrer" className="hover:text-electric-blue transition-colors">
            LinkedIn
          </a>
          <a href="https://scholar.google.com/" target="_blank" rel="noopener noreferrer" className="hover:text-electric-blue transition-colors">
            Google Scholar
          </a>
          <a href="https://bond.edu.au" target="_blank" rel="noopener noreferrer" className="hover:text-electric-blue transition-colors">
            Bond University
          </a>
        </div>
      </Container>
    </footer>
  );
}
