import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

const badgeVariants = cva(
  [
    "inline-flex items-center gap-1 whitespace-nowrap font-medium",
    "transition-colors [&_svg]:size-3",
  ].join(" "),
  {
    variants: {
      variant: {
        neutral: "bg-subtle text-foreground border border-border",
        accent: "bg-accent-muted text-accent border border-transparent",
        primary: "bg-primary text-primary-foreground",
        success:
          "bg-[color-mix(in_oklab,var(--success)_15%,transparent)] text-success border border-transparent",
        warning:
          "bg-[color-mix(in_oklab,var(--warning)_18%,transparent)] text-warning-foreground border border-transparent",
        danger:
          "bg-[color-mix(in_oklab,var(--danger)_15%,transparent)] text-danger border border-transparent",
        outline: "border border-border text-muted-foreground bg-transparent",
      },
      size: {
        sm: "h-5 px-1.5 text-[10px] rounded-sm",
        md: "h-6 px-2 text-xs rounded-md",
        lg: "h-7 px-2.5 text-sm rounded-md",
      },
      dot: {
        true: "pl-1.5",
        false: "",
      },
    },
    defaultVariants: { variant: "neutral", size: "md", dot: false },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Show a leading status dot in currentColor. */
  dot?: boolean;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { className, variant, size, dot, children, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant, size, dot }), className)}
      {...rest}
    >
      {dot && (
        <span
          aria-hidden
          className="size-1.5 rounded-full bg-current opacity-80"
        />
      )}
      {children}
    </span>
  );
});

export { badgeVariants };
