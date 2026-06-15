import { createSupabaseServerClient } from "@/lib/supabase/server";
import { fallbackServices } from "@/lib/content/brand";

export type ServiceView = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  duration_minutes: number;
  price_cents: number;
  currency: string;
  bullets: string[];
  tone: "blue" | "violet" | "mint" | "amber";
  highlight?: boolean;
};

/**
 * Reads services from Supabase. Falls back to brand fallback data
 * if Supabase is unreachable or not yet provisioned, so the marketing
 * pages always render — important during local dev / first deploy.
 */
export async function getServices(): Promise<ServiceView[]> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return fallbackServices;
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return fallbackServices;
    }

    return data.map((row) => {
      const fallback = fallbackServices.find((f) => f.slug === row.slug);
      return {
        slug: row.slug,
        name: row.name,
        tagline: row.tagline ?? fallback?.tagline ?? "",
        description: row.description,
        duration_minutes: row.duration_minutes,
        price_cents: row.price_cents,
        currency: row.currency,
        bullets: fallback?.bullets ?? [],
        tone: fallback?.tone ?? ("blue" as const),
        highlight: fallback?.highlight,
      } satisfies ServiceView;
    });
  } catch {
    return fallbackServices;
  }
}

export async function getServiceBySlug(
  slug: string,
): Promise<ServiceView | null> {
  const services = await getServices();
  return services.find((s) => s.slug === slug) ?? null;
}
