import * as React from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";

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
    <section className={cn("relative py-20 lg:py-28", className)} {...props}>
      <Container>
        {hasHeader && (
          <Reveal
            className={cn(
              "max-w-3xl mb-12 lg:mb-16",
              align === "center" && "mx-auto text-center",
            )}
          >
            {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
            {title && (
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-white text-balance mb-5 tracking-tight leading-[1.05]">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-light-gray text-lg leading-relaxed text-balance">
                {description}
              </p>
            )}
          </Reveal>
        )}
        {children}
      </Container>
    </section>
  );
}
