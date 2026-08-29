import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

const statusVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] font-medium",
  {
    variants: {
      tone: {
        online:   "border-transparent bg-[color-mix(in_oklab,var(--success)_14%,transparent)] text-success",
        busy:     "border-transparent bg-[color-mix(in_oklab,var(--danger)_14%,transparent)]  text-danger",
        away:     "border-transparent bg-[color-mix(in_oklab,var(--warning)_18%,transparent)] text-warning-foreground",
        offline:  "border-border bg-surface text-muted-foreground",
      },
    },
    defaultVariants: { tone: "online" },
  },
);

const dotColor: Record<NonNullable<VariantProps<typeof statusVariants>["tone"]>, string> = {
  online:  "var(--success)",
  busy:    "var(--danger)",
  away:    "var(--warning)",
  offline: "var(--muted-foreground)",
};

export interface StatusProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusVariants> {
  pulse?: boolean;
}

/**
 * Status — colored dot + label pill for presence, health, deploy state.
 */
export const Status = forwardRef<HTMLSpanElement, StatusProps>(function Status(
  { tone = "online", pulse = true, className, children, ...rest },
  ref,
) {
  const color = dotColor[tone ?? "online"];
  return (
    <span ref={ref} className={cn(statusVariants({ tone }), className)} {...rest}>
      <span className="relative grid place-items-center">
        {pulse && (
          <span
            aria-hidden
            className="absolute inline-flex size-2.5 animate-ping rounded-full opacity-60"
            style={{ background: color }}
          />
        )}
        <span
          aria-hidden
          className="relative inline-block size-1.5 rounded-full"
          style={{ background: color }}
        />
      </span>
      {children}
    </span>
  );
});

export { statusVariants };
