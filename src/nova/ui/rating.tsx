import { forwardRef, useState } from "react";
import { Star } from "lucide-react";
import { cn } from "../utils";

export interface RatingProps {
  /** Controlled value (0..max). */
  value?: number;
  /** Uncontrolled default. */
  defaultValue?: number;
  /** Number of stars. */
  max?: number;
  /** Fires with the chosen value. Omit for read-only. */
  onChange?: (value: number) => void;
  /** Read-only mode. */
  readOnly?: boolean;
  /** Star pixel size. */
  size?: number;
  /** Accessible label. */
  label?: string;
  className?: string;
}

/**
 * Rating — star input with hover preview, keyboard, and controlled state.
 */
export const Rating = forwardRef<HTMLDivElement, RatingProps>(function Rating(
  { value, defaultValue = 0, max = 5, onChange, readOnly = false, size = 20, label = "Rating", className },
  ref,
) {
  const [internal, setInternal] = useState(defaultValue);
  const [hover, setHover] = useState<number | null>(null);
  const current = value ?? internal;
  const display = hover ?? current;

  const set = (next: number) => {
    if (readOnly) return;
    if (value === undefined) setInternal(next);
    onChange?.(next);
  };

  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label={label}
      className={cn("inline-flex items-center gap-0.5", className)}
      onMouseLeave={() => setHover(null)}
    >
      {Array.from({ length: max }, (_, i) => {
        const n = i + 1;
        const active = n <= display;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={n === current}
            aria-label={`${n} star${n === 1 ? "" : "s"}`}
            tabIndex={readOnly ? -1 : n === Math.max(current, 1) ? 0 : -1}
            disabled={readOnly}
            onMouseEnter={() => !readOnly && setHover(n)}
            onClick={() => set(n)}
            onKeyDown={(e) => {
              if (readOnly) return;
              if (e.key === "ArrowRight") { e.preventDefault(); set(Math.min(max, current + 1)); }
              if (e.key === "ArrowLeft")  { e.preventDefault(); set(Math.max(0, current - 1)); }
            }}
            className={cn(
              "rounded-md p-0.5 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
              !readOnly && "hover:scale-110 active:scale-95",
            )}
          >
            <Star
              width={size}
              height={size}
              strokeWidth={1.75}
              className={cn(
                "transition-colors",
                active ? "fill-warning text-warning" : "text-muted-foreground/60",
              )}
            />
          </button>
        );
      })}
    </div>
  );
});
