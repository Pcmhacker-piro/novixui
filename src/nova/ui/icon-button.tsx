import {
  forwardRef,
  useCallback,
  type ButtonHTMLAttributes,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";
import { Spinner } from "./spinner";

/**
 * Nova UI · IconButton
 *
 * A square, icon-only action. Enforces an `aria-label` (or `aria-labelledby`)
 * at the type level — an icon-only control without an accessible name is
 * banned by the Nova Engineering Spec.
 *
 * @signatures MoonEdge, PressSink, HaloHover, NovaRing (see DESIGN_LANGUAGE §17)
 */

const iconButtonVariants = cva(
  [
    "nova-icon-btn",
    "relative inline-flex items-center justify-center shrink-0",
    "select-none appearance-none",
    "focus-visible:outline-none",
    "focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:shrink-0 [&_svg]:relative [&_svg]:z-[2]",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground hover:bg-primary/95",
        accent:
          "bg-accent text-accent-foreground hover:brightness-110",
        secondary:
          "bg-surface text-foreground border border-border/70 hover:bg-subtle",
        ghost:
          "bg-subtle/40 text-muted-foreground hover:bg-subtle hover:text-foreground",
        outline:
          "bg-transparent text-foreground border border-border/80 hover:bg-subtle",
        destructive:
          "bg-danger text-danger-foreground hover:brightness-110",
      },
      size: {
        xs: "h-7 w-7 rounded-[7px] [&_svg]:size-3.5",
        sm: "h-8 w-8 rounded-[8px] [&_svg]:size-4",
        md: "h-9 w-9 rounded-[10px] [&_svg]:size-4",
        lg: "h-10 w-10 rounded-[11px] [&_svg]:size-[18px]",
        xl: "h-11 w-11 rounded-[12px] [&_svg]:size-5",
      },
    },
    defaultVariants: { variant: "ghost", size: "md" },
  },
);

type NamedIconButton =
  | { "aria-label": string; "aria-labelledby"?: string }
  | { "aria-label"?: string; "aria-labelledby": string };

export type IconButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "aria-label" | "aria-labelledby"
> &
  VariantProps<typeof iconButtonVariants> &
  NamedIconButton & {
    /** Render into the child element instead of a `<button>`. */
    asChild?: boolean;
    /** Show a spinner and mark the control as busy. */
    loading?: boolean;
    /** The icon to render. Sized automatically by variant. */
    icon?: ReactNode;
    /** Alternative to `icon`: pass a single element as child. */
    children?: ReactNode;
  };

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      className,
      variant,
      size,
      asChild,
      loading,
      disabled,
      icon,
      children,
      type,
      onPointerMove,
      onPointerLeave,
      ...rest
    },
    ref,
  ) {
    const Comp = asChild ? Slot : "button";

    // Cursor-tracked halo — mutates CSS vars, no re-render.
    const handlePointerMove = useCallback(
      (e: ReactPointerEvent<HTMLButtonElement>) => {
        const el = e.currentTarget;
        const r = el.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 100;
        const y = ((e.clientY - r.top) / r.height) * 100;
        el.style.setProperty("--nova-x", `${x}%`);
        el.style.setProperty("--nova-y", `${y}%`);
        onPointerMove?.(e);
      },
      [onPointerMove],
    );
    const handlePointerLeave = useCallback(
      (e: ReactPointerEvent<HTMLButtonElement>) => {
        const el = e.currentTarget;
        el.style.setProperty("--nova-x", `50%`);
        el.style.setProperty("--nova-y", `50%`);
        onPointerLeave?.(e);
      },
      [onPointerLeave],
    );

    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : (type ?? "button")}
        data-slot="root"
        data-loading={loading ? "" : undefined}
        aria-busy={loading || undefined}
        disabled={disabled || loading}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className={cn(iconButtonVariants({ variant, size }), className)}
        {...rest}
      >
        {loading ? <Spinner size="inherit" /> : (icon ?? children)}
      </Comp>
    );
  },
);

export { iconButtonVariants };

