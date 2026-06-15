import Link from "next/link";
import { Container } from "@/components/ui/container";
import { NewsletterForm } from "@/components/site/newsletter-form";

export function SiteFooter() {
  return (
    <footer className="border-t border-light-gray/10 mt-24 pt-16 pb-10">
      <Container className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-electric-blue" />
            <span className="font-bold text-white tracking-tight">
              Dr. Afrooz Purarjomand
            </span>
          </div>
          <p className="text-electric-blue text-sm font-medium mb-4">
            AI/ML &amp; GenAI Specialist · Assistant Professor
          </p>
          <p className="text-light-gray text-sm leading-relaxed max-w-md">
            Bond University · Faculty of Society &amp; Design.
            <br />
            Enterprise AI Strategy · Healthcare Innovation · IS &amp; Business
            Analytics.
          </p>
        </div>

        <div className="lg:col-span-3">
          <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-white mb-4">
            Navigate
          </h4>
          <ul className="space-y-2.5 text-sm">
            {[
              { href: "/about", label: "About" },
              { href: "/services", label: "Services" },
              { href: "/publications", label: "Publications" },
              { href: "/insights", label: "Insights" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-light-gray hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-4">
          <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-white mb-4">
            Stay in the loop
          </h4>
          <p className="text-light-gray text-sm mb-4 leading-relaxed">
            Research notes on enterprise AI strategy and healthcare data
            science — no spam.
          </p>
          <NewsletterForm />
        </div>
      </Container>

      <Container className="mt-12 pt-8 border-t border-light-gray/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-muted text-xs">
          © {new Date().getFullYear()} Dr. Afrooz Purarjomand. Where research
          meets reality.
        </p>
        <div className="flex items-center gap-4 text-xs text-muted">
          <a
            href="https://www.linkedin.com/in/afroozpurarjomand"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-electric-blue transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="https://scholar.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-electric-blue transition-colors"
          >
            Google Scholar
          </a>
          <a
            href="https://bond.edu.au"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-electric-blue transition-colors"
          >
            Bond University
          </a>
        </div>
      </Container>
    </footer>
  );
}
