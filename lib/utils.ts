import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Only allow same-site relative paths as post-auth redirects
 * ("/book/x" is fine; "//evil.com" and "https://..." are not).
 */
export function safeRedirectPath(
  path: string | null | undefined,
  fallback = "/dashboard",
) {
  // Browsers treat "/\evil.com" like "//evil.com", so reject backslashes
  // and control characters, then confirm the path stays on this origin.
  if (
    !path ||
    !path.startsWith("/") ||
    path.startsWith("//") ||
    /[\\\x00-\x1f]/.test(path)
  ) {
    return fallback;
  }
  try {
    const url = new URL(path, "http://local.invalid");
    if (url.origin !== "http://local.invalid") return fallback;
    return url.pathname + url.search + url.hash;
  } catch {
    return fallback;
  }
}

export function formatCurrency(
  amountCents: number,
  currency: string = "AUD",
  locale: string = "en-US",
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amountCents / 100);
}
