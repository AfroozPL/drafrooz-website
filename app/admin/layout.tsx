import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/container";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const adminNav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/availability", label: "Availability" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/newsletter", label: "Newsletter" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Enforce admin role only when Supabase is configured. Middleware also guards
  // this, but we double-check here for defence in depth.
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const supabase = await createSupabaseServerClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const role = (user?.app_metadata as { role?: string } | null)?.role;
      if (!user) redirect("/login?redirect=/admin");
      if (role !== "admin") redirect("/dashboard");
    } catch {
      // Surface in preview if Supabase unreachable.
    }
  }

  return (
    <div className="border-t border-light-gray/10">
      <Container className="py-8">
        <div className="flex flex-wrap gap-2 mb-8">
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-light-gray hover:text-white px-3 py-1.5 rounded-md border border-light-gray/10 hover:border-electric-blue/40 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
        {children}
      </Container>
    </div>
  );
}
