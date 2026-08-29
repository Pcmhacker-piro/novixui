import { forwardRef, type SVGAttributes } from "react";
import type { LucideIcon, LucideProps } from "lucide-react";
import { cn } from "../utils";

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl";

const SIZE_MAP: Record<IconSize, number> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
};

export interface IconProps extends Omit<LucideProps, "size"> {
  /** Lucide icon component. Any lucide-react export works. */
  icon: LucideIcon;
  /** Semantic size token or raw pixel value. */
  size?: IconSize | number;
  /** Marks the icon as decorative (hidden from assistive tech). Default true. */
  decorative?: boolean;
  /** Accessible label. Required when `decorative={false}`. */
  label?: string;
}

/**
 * Nova <Icon /> — thin, opinionated wrapper around lucide-react.
 * - Enforces a11y: decorative icons are hidden; interactive icons require `label`.
 * - Uses currentColor + design-token sizing.
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
  { icon: LucideComp, size = "md", decorative = true, label, className, ...rest },
  ref,
) {
  const pixels = typeof size === "number" ? size : SIZE_MAP[size];
  const a11y: SVGAttributes<SVGSVGElement> = decorative
    ? { "aria-hidden": true, focusable: false }
    : { role: "img", "aria-label": label };

  return (
    <LucideComp
      ref={ref}
      size={pixels}
      strokeWidth={1.75}
      className={cn("shrink-0", className)}
      {...a11y}
      {...rest}
    />
  );
});
