import { formatCurrency } from "@/lib/utils";

/**
 * GST is charged only when GST_REGISTERED="true". Set it after the
 * business is registered for GST with the ATO AND that registration is
 * added in Stripe (Tax → Registrations). Without a Stripe registration,
 * Stripe Tax silently collects nothing, so both steps are required.
 * Changing it needs a redeploy (some pages are prerendered).
 */
export function isGstRegistered() {
  return process.env.GST_REGISTERED === "true";
}

/** Price shown to clients: "A$150 + GST" once GST applies, else "A$150". */
export function formatServicePrice(amountCents: number, currency: string) {
  const price = formatCurrency(amountCents, currency);
  return isGstRegistered() ? `${price} + GST` : price;
}
