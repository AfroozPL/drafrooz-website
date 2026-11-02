"use client";

import * as React from "react";
import { useInView } from "@/components/motion/use-in-view";

/** Number that counts up from zero when it scrolls into view. */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  duration = 1800,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const [ref, inView] = useInView<HTMLSpanElement>(0.5);
  const [n, setN] = React.useState(0);

  React.useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 4);
      setN(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {/* Screen readers get the final value, not the ticking one. */}
      <span className="sr-only">
        {prefix}
        {value.toLocaleString("en-AU")}
        {suffix}
      </span>
      <span aria-hidden>
        {prefix}
        {n.toLocaleString("en-AU")}
        {suffix}
      </span>
    </span>
  );
}
