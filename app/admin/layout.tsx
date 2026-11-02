import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { AdminNav } from "@/components/admin/admin-nav";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { requireAdmin, supabaseConfigured } from "@/lib/admin/guard";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

async function countNewMessages() {
  if (!supabaseConfigured()) return 0;
  const { count } = await createSupabaseAdminClient()
    .from("contact_messages")
    .select("id", { count: "exact", head: true })
    .eq("status", "new");
  return count ?? 0;
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Must run before any data loads; redirects non-admins.
  const user = await requireAdmin();
  const newCount = user ? await countNewMessages() : 0;

  return (
    <div className="border-t border-white/[0.06]">
      <Container className="max-w-7xl py-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <p className="eyebrow mb-1">Admin</p>
            <p className="mb-5 truncate text-sm text-muted">{user?.email ?? "Preview mode"}</p>
            <AdminNav newCount={newCount} />
            {user && (
              <div className="mt-6 hidden lg:block">
                <SignOutButton />
              </div>
            )}
          </aside>
          <div className="min-w-0">
            {!user && (
              <p className="mb-6 rounded-xl border border-amber-gold/30 bg-amber-gold/10 p-4 text-sm text-amber-gold">
                Preview mode: Supabase isn&apos;t configured locally, so no live data is shown.
              </p>
            )}
            {children}
          </div>
        </div>
      </Container>
    </div>
  );
}
