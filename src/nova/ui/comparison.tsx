import { forwardRef, useCallback, useRef, useState, type ReactNode } from "react";
import { cn } from "../utils";

export interface ComparisonProps {
  /** Left / "before" content — usually an <img>. */
  before: ReactNode;
  /** Right / "after" content — usually an <img>. */
  after: ReactNode;
  /** Initial slider position (0..100). */
  defaultPosition?: number;
  /** Optional labels rendered as chips. */
  beforeLabel?: string;
  afterLabel?: string;
  /** Aspect ratio (width / height). */
  aspect?: number;
  className?: string;
}

/**
 * Comparison — before/after image slider with pointer + keyboard control.
 */
export const Comparison = forwardRef<HTMLDivElement, ComparisonProps>(function Comparison(
  { before, after, defaultPosition = 50, beforeLabel, afterLabel, aspect = 16 / 9, className },
  ref,
) {
  const [pos, setPos] = useState(defaultPosition);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);

  const update = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, pct)));
  }, []);

  return (
    <div
      ref={(node) => {
        containerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as { current: HTMLDivElement | null }).current = node;
      }}
      className={cn("relative w-full overflow-hidden rounded-xl border border-border/70 select-none", className)}
      style={{ aspectRatio: aspect }}
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as Element).setPointerCapture?.(e.pointerId);
        update(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && update(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <div className="absolute inset-0">{after}</div>
      <div
        className="absolute inset-y-0 left-0 overflow-hidden"
        style={{ width: `${pos}%` }}
        aria-hidden
      >
        <div className="h-full w-[100vw] max-w-none">{before}</div>
      </div>

      {beforeLabel && (
        <span className="absolute left-3 top-3 rounded-full bg-background/80 px-2 py-0.5 text-[11px] font-medium text-foreground backdrop-blur">
          {beforeLabel}
        </span>
      )}
      {afterLabel && (
        <span className="absolute right-3 top-3 rounded-full bg-background/80 px-2 py-0.5 text-[11px] font-medium text-foreground backdrop-blur">
          {afterLabel}
        </span>
      )}

      <div
        role="slider"
        tabIndex={0}
        aria-label="Comparison position"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft")  setPos((p) => Math.max(0, p - 2));
          if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 2));
        }}
        className="absolute inset-y-0 -ml-[1px] w-0.5 cursor-ew-resize bg-white/90 shadow-[0_0_0_1px_rgba(0,0,0,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
        style={{ left: `${pos}%` }}
      >
        <div className="absolute left-1/2 top-1/2 grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-foreground shadow-lg">
          <svg viewBox="0 0 20 20" className="size-3.5" aria-hidden>
            <path fill="currentColor" d="M6 4 2 10l4 6zM14 4l4 6-4 6z" />
          </svg>
        </div>
      </div>
    </div>
  );
});
