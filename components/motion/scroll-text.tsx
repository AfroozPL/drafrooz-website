"use client";

import * as React from "react";

/**
 * Large statement whose words brighten one by one as the reader scrolls
 * through it. Words wrapped in *asterisks* get the accent treatment.
 */
export function ScrollText({ text, className }: { text: string; className?: string }) {
  const ref = React.useRef<HTMLParagraphElement>(null);
  const [progress, setProgress] = React.useState(0);
  const words = text.split(" ");

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
      return;
    }
    let raf = 0;
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the top hits 85% of the viewport, 1 when the bottom reaches 45%.
      const p = (vh * 0.85 - rect.top) / (rect.height + vh * 0.4);
      setProgress(Math.max(0, Math.min(1, p)));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <p ref={ref} className={className}>
      {words.map((raw, i) => {
        const accent = raw.startsWith("*");
        const word = raw.replace(/\*/g, "");
        const lit = progress * words.length > i;
        return (
          <React.Fragment key={i}>
            <span
              className={
                accent
                  ? "font-serif italic font-normal transition-colors duration-300 " +
                    (lit ? "text-electric-blue" : "text-white/15")
                  : "transition-colors duration-300 " + (lit ? "text-white" : "text-white/15")
              }
            >
              {word}
            </span>{" "}
          </React.Fragment>
        );
      })}
    </p>
  );
}
