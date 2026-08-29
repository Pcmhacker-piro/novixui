import { forwardRef, Fragment, type HTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

/**
 * Nova UI · Kbd
 *
 * A keyboard key cap. Renders semantic `<kbd>` markup for screen readers and
 * a physical key-cap visual for sighted users. Sequences render with a
 * separator and stable spacing so `⌘K` always looks like `⌘K`.
 *
 * Platform detection: pass `keys={{ mac: ["⌘", "K"], other: ["Ctrl", "K"] }}`
 * or the standalone `<KbdSequence>` helper for cross-platform shortcuts.
 */

const kbdVariants = cva(
  [
    "inline-flex items-center justify-center align-middle select-none",
    "font-mono font-medium leading-none tabular-nums",
    "bg-surface text-foreground",
    "border border-border",
    "shadow-[inset_0_-1px_0_0_var(--border)]",
    "transition-transform duration-100",
  ].join(" "),
  {
    variants: {
      size: {
        xs: "min-w-4 h-4 px-1 text-[10px] rounded-[4px]",
        sm: "min-w-5 h-5 px-1.5 text-[11px] rounded-[5px]",
        md: "min-w-6 h-6 px-1.5 text-xs rounded-md",
        lg: "min-w-7 h-7 px-2 text-sm rounded-md",
      },
      tone: {
        default: "bg-surface text-foreground",
        subtle: "bg-subtle text-muted-foreground",
        inverted:
          "bg-foreground text-background border-transparent shadow-[inset_0_-1px_0_0_color-mix(in_oklab,var(--background)_20%,transparent)]",
      },
      pressed: {
        true: "translate-y-px shadow-none",
        false: "",
      },
    },
    defaultVariants: { size: "md", tone: "default", pressed: false },
  },
);

export interface KbdProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof kbdVariants> {}

export const Kbd = forwardRef<HTMLElement, KbdProps>(function Kbd(
  { className, size, tone, pressed, children, ...rest },
  ref,
) {
  return (
    <kbd
      ref={ref}
      data-slot="root"
      className={cn(kbdVariants({ size, tone, pressed }), className)}
      {...rest}
    >
      {children}
    </kbd>
  );
});

/**
 * Render a shortcut sequence as chained `<kbd>` elements with visual and
 * semantic separators. The visual `+` is decorative; screen readers hear
 * "Command K" rather than "Command plus K".
 */
export interface KbdSequenceProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "children">,
    Pick<KbdProps, "size" | "tone"> {
  /** Ordered key labels, e.g. `["⌘", "K"]` or `["Ctrl", "Shift", "P"]`. */
  keys: ReadonlyArray<ReactNode>;
  /** Visual separator between keys. Defaults to a hair-space. */
  separator?: ReactNode;
}

export const KbdSequence = forwardRef<HTMLSpanElement, KbdSequenceProps>(
  function KbdSequence(
    { className, keys, size, tone, separator, ...rest },
    ref,
  ) {
    return (
      <span
        ref={ref}
        data-slot="root"
        className={cn("inline-flex items-center gap-1", className)}
        {...rest}
      >
        {keys.map((key, i) => (
          <Fragment key={i}>
            {i > 0 && separator && (
              <span aria-hidden className="text-muted-foreground">
                {separator}
              </span>
            )}
            <Kbd size={size} tone={tone}>
              {key}
            </Kbd>
          </Fragment>
        ))}
      </span>
    );
  },
);

export { kbdVariants };
