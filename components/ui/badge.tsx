import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider border",
  {
    variants: {
      tone: {
        blue: "text-electric-blue border-electric-blue/40 bg-electric-blue/5",
        violet: "text-deep-violet border-deep-violet/40 bg-deep-violet/10",
        mint: "text-vivid-mint border-vivid-mint/40 bg-vivid-mint/5",
        amber: "text-amber-gold border-amber-gold/40 bg-amber-gold/5",
        muted: "text-light-gray border-light-gray/20 bg-light-gray/5",
      },
    },
    defaultVariants: { tone: "blue" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
