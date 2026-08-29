import { forwardRef, type SVGAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

/**
 * Nova UI · Spinner
 *
 * A minimal, accessible activity indicator. SVG-only, GPU-friendly.
 * Uses stroke-linecap rounding + a partial arc so the motion reads as
 * "something is working" without the noisy full-ring shimmer common to
 * generic spinners.
 *
 * When the spinner communicates a specific pending operation, provide a
 * `label` — it is announced politely and rendered visually hidden.
 */

const spinnerVariants = cva(
  [
    "inline-block shrink-0 animate-[nova-spin_0.8s_linear_infinite]",
    "motion-reduce:animate-[nova-spin_2s_linear_infinite]",
    "motion-reduce:opacity-70",
  ].join(" "),
  {
    variants: {
      size: {
        xs: "size-3",
        sm: "size-4",
        md: "size-5",
        lg: "size-6",
        xl: "size-8",
        inherit: "size-[1em]",
      },
      tone: {
        current: "text-current",
        muted: "text-muted-foreground",
        accent: "text-accent",
        primary: "text-primary",
      },
    },
    defaultVariants: { size: "md", tone: "current" },
  },
);

export interface SpinnerProps
  extends Omit<SVGAttributes<SVGSVGElement>, "children">,
    VariantProps<typeof spinnerVariants> {
  /** Descriptive label; announced via SR and set as `aria-label`. */
  label?: string;
  /** Stroke thickness in SVG units. Defaults to 2. */
  strokeWidth?: number;
}

export const Spinner = forwardRef<SVGSVGElement, SpinnerProps>(function Spinner(
  { className, size, tone, label, strokeWidth = 2, ...rest },
  ref,
) {
  const decorative = !label;
  return (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      fill="none"
      role={decorative ? "presentation" : "status"}
      aria-hidden={decorative || undefined}
      aria-label={label}
      aria-live={decorative ? undefined : "polite"}
      data-slot="root"
      className={cn(spinnerVariants({ size, tone }), className)}
      {...rest}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeOpacity="0.18"
        strokeWidth={strokeWidth}
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
});

export { spinnerVariants };
