"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "up" | "down" | "left" | "right" | "scale" | "blur";

interface RevealProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  variant?: Variant;
  /** Delay in ms — use for staggering siblings. */
  delay?: number;
  /** Keep visible after the first reveal instead of fading out on exit. */
  once?: boolean;
}

/**
 * Fades its children in as they scroll into view and back out as they
 * leave, so the page feels alive in both scroll directions. Styling lives
 * in globals.css (.reveal); reduced-motion users see content immediately.
 */
export function Reveal({
  as: Tag = "div",
  variant = "up",
  delay = 0,
  once = false,
  className,
  style,
  children,
  ...props
}: RevealProps) {
  const ref = React.useRef<HTMLElement>(null);
  // Start visible so content is readable without JS (and in SSR HTML);
  // the effect hides off-screen elements before first paint of motion.
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = el.getBoundingClientRect();
    if (rect.top > window.innerHeight || rect.bottom < 0) setVisible(false);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return (
    <Tag
      ref={ref}
      data-variant={variant}
      data-visible={visible}
      className={cn("reveal", className)}
      style={{ ...style, ["--reveal-delay" as string]: `${delay}ms` }}
      {...props}
    >
      {children}
    </Tag>
  );
}
