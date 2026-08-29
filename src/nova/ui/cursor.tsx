import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../utils";

export interface CursorProps extends HTMLAttributes<HTMLDivElement> {
  /** Display name shown in the label chip. */
  name: string;
  /** Any CSS color — cursor arrow + chip. */
  color?: string;
  /** Absolute-position offset in pixels. */
  x?: number;
  y?: number;
}

/**
 * Cursor — a live-collaboration pointer chip. Designed to sit inside a
 * `position: relative` container and be moved via `x` / `y` props.
 */
export const Cursor = forwardRef<HTMLDivElement, CursorProps>(function Cursor(
  { name, color = "var(--accent)", x = 0, y = 0, className, style, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("pointer-events-none absolute z-10 select-none transition-transform duration-500 ease-out", className)}
      style={{ transform: `translate(${x}px, ${y}px)`, ...style }}
      {...rest}
    >
      <svg viewBox="0 0 24 24" width={20} height={20} className="drop-shadow-sm">
        <path
          d="M4 3 L20 12 L12 13 L9 21 Z"
          fill={color}
          stroke="white"
          strokeWidth={1.25}
          strokeLinejoin="round"
        />
      </svg>
      <span
        className="ml-3 -mt-1 inline-block rounded-md px-1.5 py-0.5 text-[11px] font-medium text-white shadow-sm"
        style={{ background: color }}
      >
        {name}
      </span>
    </div>
  );
});
