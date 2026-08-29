import { forwardRef, type ComponentPropsWithoutRef } from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

/**
 * Nova UI · Label
 *
 * The Nova label. Pairs with any form control via `htmlFor`. When `required`
 * is true, renders a discreet asterisk with a screen-reader-only "required"
 * announcement — never the naked "*" character as the only signal.
 *
 * Built on Radix Label to inherit its click-forwarding behavior.
 */

const labelVariants = cva(
  [
    "inline-flex items-center gap-1 select-none",
    "text-foreground font-medium leading-none tracking-tight",
    "peer-disabled:cursor-not-allowed peer-disabled:opacity-60",
    "data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-60",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-[15px]",
      },
      tone: {
        default: "text-foreground",
        muted: "text-muted-foreground",
        invalid: "text-danger",
      },
    },
    defaultVariants: { size: "md", tone: "default" },
  },
);

export interface LabelProps
  extends Omit<ComponentPropsWithoutRef<typeof LabelPrimitive.Root>, "color">,
    VariantProps<typeof labelVariants> {
  /** Renders a required asterisk plus an SR-only "required" announcement. */
  required?: boolean;
  /** Renders a tertiary "(optional)" hint after the label text. */
  optional?: boolean;
  /** Disable-styled label; use when the paired control is disabled. */
  disabled?: boolean;
}

export const Label = forwardRef<
  React.ComponentRef<typeof LabelPrimitive.Root>,
  LabelProps
>(function Label(
  { className, size, tone, required, optional, disabled, children, ...rest },
  ref,
) {
  return (
    <LabelPrimitive.Root
      ref={ref}
      data-slot="root"
      data-disabled={disabled || undefined}
      className={cn(labelVariants({ size, tone }), className)}
      {...rest}
    >
      <span data-slot="text">{children}</span>
      {required && (
        <>
          <span
            aria-hidden="true"
            data-slot="required-indicator"
            className="text-danger"
          >
            *
          </span>
          <span className="sr-only">(required)</span>
        </>
      )}
      {optional && !required && (
        <span
          data-slot="optional-indicator"
          className="text-muted-foreground font-normal"
        >
          (optional)
        </span>
      )}
    </LabelPrimitive.Root>
  );
});

export { labelVariants };
