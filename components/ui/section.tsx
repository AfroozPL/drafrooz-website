import * as React from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";

interface SectionProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  eyebrow?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
}

export function Section({
  className,
  children,
  eyebrow,
  title,
  description,
  align = "left",
  ...props
}: SectionProps) {
  const hasHeader = eyebrow || title || description;
  return (
    <section className={cn("py-20 lg:py-28", className)} {...props}>
      <Container>
        {hasHeader && (
          <div
            className={cn(
              "max-w-3xl mb-12 lg:mb-16",
              align === "center" && "mx-auto text-center",
            )}
          >
            {eyebrow && (
              <p className="text-electric-blue text-xs font-bold tracking-[0.2em] uppercase mb-4">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="text-3xl lg:text-4xl font-bold text-white text-balance mb-5 tracking-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-light-gray text-lg leading-relaxed text-balance">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}
