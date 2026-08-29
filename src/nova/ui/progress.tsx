import { forwardRef } from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "../utils";

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  /** Show animated shimmer sheen across the fill. */
  shimmer?: boolean;
  /** Indeterminate loading state — ignores value. */
  indeterminate?: boolean;
  /** Size variant */
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-1.5",
  md: "h-2",
  lg: "h-3",
};

export const Progress = forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(
  (
    {
      className,
      value,
      size = "md",
      shimmer = true,
      indeterminate = false,
      ...props
    },
    ref,
  ) => {
    const clampedValue =
      typeof value === "number" && !Number.isNaN(value)
        ? Math.min(100, Math.max(0, value))
        : 0;

    return (
      <ProgressPrimitive.Root
        ref={ref}
        value={indeterminate ? null : clampedValue}
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-subtle border border-border/40",
          sizeClasses[size] ?? sizeClasses.md,
          className,
        )}
        {...props}
      >
        {indeterminate ? (
          <div className="absolute inset-y-0 -left-1/3 w-1/3 rounded-full bg-gradient-to-r from-primary to-accent [animation:nova-progress-indeterminate_1.4s_ease-in-out_infinite]" />
        ) : (
          <ProgressPrimitive.Indicator
            className={cn(
              "relative h-full rounded-full bg-gradient-to-r from-primary to-accent transition-transform duration-500 [transition-timing-function:cubic-bezier(0.65,0,0.35,1)]",
              "shadow-[0_0_12px_-2px_color-mix(in_oklab,var(--primary)_70%,transparent)]",
            )}
            style={{ transform: `translateX(-${100 - clampedValue}%)` }}
          >
            {shimmer && (
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <div className="absolute inset-y-0 -inset-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent [animation:nova-shimmer_2s_ease-in-out_infinite]" />
              </div>
            )}
          </ProgressPrimitive.Indicator>
        )}
      </ProgressPrimitive.Root>
    );
  },
);
Progress.displayName = "Progress";

