import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "../utils";

/**
 * Nova UI · Button
 *
 * Premium, tactile action surface. All depth, highlight, glow, and
 * press-sink behavior is delegated to the `nova-btn` utility in styles.css
 * so every variant participates in one motion language.
 *
 * Public API is stable: `variant`, `size`, `asChild`, `loading`,
 * `leadingIcon`, `trailingIcon`, plus all native button attributes.
 */

const buttonVariants = cva(
  [
    "nova-btn",
    "relative inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "font-medium tracking-[-0.005em] select-none",
    "focus-visible:outline-none",
    "focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_color-mix(in_oklab,var(--ring)_75%,transparent)]",
    "disabled:pointer-events-none disabled:opacity-55 disabled:saturate-[.85]",
    "[&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          "bg-primary text-primary-foreground [--nova-btn-glow:var(--primary)]",
          "shadow-[inset_0_1px_0_0_color-mix(in_oklab,white_18%,transparent),inset_0_-1px_0_0_color-mix(in_oklab,black_22%,transparent),0_1px_2px_0_color-mix(in_oklab,black_35%,transparent),0_6px_14px_-6px_color-mix(in_oklab,var(--primary)_55%,transparent),0_18px_36px_-14px_color-mix(in_oklab,var(--primary)_55%,transparent)]",
          "hover:brightness-[1.06]",
        ].join(" "),
        accent: [
          "bg-accent text-accent-foreground [--nova-btn-glow:var(--accent)]",
          "shadow-[inset_0_1px_0_0_color-mix(in_oklab,white_28%,transparent),inset_0_-1px_0_0_color-mix(in_oklab,black_18%,transparent),0_1px_2px_0_color-mix(in_oklab,black_28%,transparent),0_8px_18px_-6px_color-mix(in_oklab,var(--accent)_50%,transparent),0_22px_44px_-14px_color-mix(in_oklab,var(--accent)_55%,transparent)]",
          "hover:brightness-[1.08]",
        ].join(" "),
        secondary: [
          "bg-surface-elevated text-foreground border border-border/80",
          "[--nova-btn-highlight:0.9] [--nova-btn-glow:var(--foreground)]",
          "shadow-[inset_0_1px_0_0_color-mix(in_oklab,white_60%,transparent),0_1px_2px_0_color-mix(in_oklab,black_8%,transparent),0_4px_12px_-4px_color-mix(in_oklab,black_10%,transparent)]",
          "hover:bg-subtle hover:border-border-strong",
        ].join(" "),
        outline: [
          "bg-transparent text-foreground border border-border/85",
          "[--nova-btn-highlight:0] [--nova-btn-glow:var(--accent)]",
          "shadow-[inset_0_1px_0_0_color-mix(in_oklab,white_22%,transparent)]",
          "hover:bg-subtle/70 hover:border-border-strong",
        ].join(" "),
        ghost: [
          "bg-transparent text-foreground border border-transparent",
          "[--nova-btn-highlight:0] [--nova-btn-glow:var(--accent)]",
          "hover:bg-subtle hover:border-border/40",
        ].join(" "),
        destructive: [
          "bg-danger text-danger-foreground [--nova-btn-glow:var(--danger)]",
          "shadow-[inset_0_1px_0_0_color-mix(in_oklab,white_22%,transparent),inset_0_-1px_0_0_color-mix(in_oklab,black_22%,transparent),0_1px_2px_0_color-mix(in_oklab,black_28%,transparent),0_8px_18px_-6px_color-mix(in_oklab,var(--danger)_50%,transparent),0_20px_40px_-14px_color-mix(in_oklab,var(--danger)_55%,transparent)]",
          "hover:brightness-[1.06]",
        ].join(" "),
        link: [
          "bg-transparent text-accent p-0 h-auto rounded-none",
          "[--nova-btn-highlight:0] [--nova-btn-glow:transparent]",
          "underline-offset-4 hover:underline",
        ].join(" "),
      },
      size: {
        sm: "h-8 px-3.5 text-xs rounded-[9px] [&_svg]:size-3.5",
        md: "h-9 px-4 text-sm rounded-[10px] [&_svg]:size-4",
        lg: "h-11 px-6 text-[15px] rounded-[12px] [&_svg]:size-[18px]",
        icon: "h-9 w-9 rounded-[10px] [&_svg]:size-4",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render into the child element instead of a <button>. */
  asChild?: boolean;
  /** Show loading spinner and disable interaction. */
  loading?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant,
    size,
    asChild,
    loading,
    disabled,
    leadingIcon,
    trailingIcon,
    children,
    type,
    ...rest
  },
  ref,
) {
  const Comp = asChild ? Slot : "button";
  const isIconOnly = size === "icon";

  // asChild path: Slottable must be a direct child of Slot, so we can't wrap
  // for layout-shift-free loading. Fall back to swap semantics.
  if (asChild) {
    return (
      <Comp
        ref={ref}
        data-loading={loading ? "" : undefined}
        aria-busy={loading || undefined}
        className={cn(buttonVariants({ variant, size }), className)}
        {...rest}
      >
        {loading ? <Loader2 aria-hidden className="animate-spin" /> : leadingIcon}
        <Slottable>{children}</Slottable>
        {!loading && trailingIcon}
      </Comp>
    );
  }

  return (
    <Comp
      ref={ref}
      type={type ?? "button"}
      data-loading={loading ? "" : undefined}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      className={cn(buttonVariants({ variant, size }), className)}
      {...rest}
    >
      {loading && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[3] flex items-center justify-center"
        >
          <Loader2 className="animate-spin" />
        </span>
      )}
      <span
        data-slot="content"
        className={cn(
          "relative z-[2] inline-flex items-center justify-center gap-2 transition-opacity duration-150",
          loading && "opacity-0",
        )}
      >
        {!loading && leadingIcon}
        {isIconOnly ? (!loading && children) : children}
        {!loading && trailingIcon}
      </span>
    </Comp>
  );
});

export { buttonVariants };
