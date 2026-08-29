import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

/**
 * Nova UI · Skeleton
 *
 * A pending-content placeholder. Two motion modes: `shimmer` (default) sweeps
 * a soft highlight left-to-right at a constant physical speed; `pulse` is a
 * lower-energy fallback used automatically under `prefers-reduced-motion`.
 *
 * The element is announced as `aria-busy` and hidden from a live region; it
 * exists to reserve layout, not to describe missing content.
 */

const skeletonVariants = cva(
  [
    "relative overflow-hidden isolate",
    "bg-[color-mix(in_oklab,var(--foreground)_6%,transparent)]",
    "before:absolute before:inset-0 before:-translate-x-full",
    "before:bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--foreground)_9%,transparent),transparent)]",
    "before:animate-[nova-shimmer_1.6s_ease-in-out_infinite]",
    "motion-reduce:before:hidden",
    "motion-reduce:animate-pulse",
  ].join(" "),
  {
    variants: {
      shape: {
        rect: "rounded-md",
        pill: "rounded-full",
        circle: "rounded-full aspect-square",
        text: "rounded-sm h-[0.9em] w-full",
      },
    },
    defaultVariants: { shape: "rect" },
  },
);

export interface SkeletonProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  /** Number of stacked text lines. Only meaningful with `shape="text"`. */
  lines?: number;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  function Skeleton({ className, shape, lines, style, ...rest }, ref) {
    if (shape === "text" && lines && lines > 1) {
      return (
        <div
          ref={ref}
          data-slot="root"
          role="status"
          aria-busy="true"
          aria-live="off"
          className="flex flex-col gap-2"
          {...rest}
        >
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              data-slot="line"
              className={cn(
                skeletonVariants({ shape: "text" }),
                i === lines - 1 && "w-[70%]",
                className,
              )}
              style={style}
            />
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        data-slot="root"
        role="status"
        aria-busy="true"
        aria-live="off"
        className={cn(skeletonVariants({ shape }), className)}
        style={style}
        {...rest}
      />
    );
  },
);

export { skeletonVariants };
