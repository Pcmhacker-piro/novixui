import { forwardRef, useEffect, useRef, useState, type HTMLAttributes } from "react";
import { cn } from "../utils";

export interface TickerProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  /** Target value. */
  value: number;
  /** Animation duration (ms). */
  duration?: number;
  /** Fractional digits. */
  decimals?: number;
  /** Prefix (e.g. "$"). */
  prefix?: string;
  /** Suffix (e.g. "k"). */
  suffix?: string;
  /** Locale grouping. */
  format?: boolean;
}

/**
 * Ticker — count-up animated number that respects prefers-reduced-motion.
 */
export const Ticker = forwardRef<HTMLSpanElement, TickerProps>(function Ticker(
  { value, duration = 1200, decimals = 0, prefix = "", suffix = "", format = true, className, ...rest },
  ref,
) {
  const [display, setDisplay] = useState(value);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef(value);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { setDisplay(value); return; }
    fromRef.current = display;
    startRef.current = null;
    let raf = 0;
    const tick = (t: number) => {
      if (startRef.current === null) startRef.current = t;
      const p = Math.min(1, (t - startRef.current) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(fromRef.current + (value - fromRef.current) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  const formatted = format
    ? display.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : display.toFixed(decimals);

  return (
    <span ref={ref} className={cn("tabular-nums", className)} {...rest}>
      {prefix}{formatted}{suffix}
    </span>
  );
});
