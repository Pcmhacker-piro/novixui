import { forwardRef } from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

const switchVariants = cva(
  [
    "peer relative inline-flex shrink-0 cursor-pointer items-center rounded-full",
    "border border-border/60 isolate overflow-hidden",
    "transition-[background,box-shadow,border-color] duration-300 [transition-timing-function:var(--ease-swift)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "data-[state=unchecked]:bg-subtle",
    "data-[state=checked]:bg-primary data-[state=checked]:border-transparent",
    "data-[state=checked]:shadow-[0_0_0_1px_color-mix(in_oklab,white_20%,transparent)_inset,0_8px_20px_-6px_color-mix(in_oklab,var(--primary)_60%,transparent)]",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "h-[18px] w-[30px]",
        md: "h-[22px] w-[38px]",
        lg: "h-[26px] w-[46px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const thumbVariants = cva(
  [
    "pointer-events-none block rounded-full bg-white",
    "shadow-[0_1px_2px_0_rgba(0,0,0,0.35),0_2px_6px_-2px_rgba(0,0,0,0.25)]",
    "transition-transform duration-300 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]",
    "data-[state=unchecked]:translate-x-[3px]",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "h-3 w-3 data-[state=checked]:translate-x-[15px]",
        md: "h-4 w-4 data-[state=checked]:translate-x-[19px]",
        lg: "h-5 w-5 data-[state=checked]:translate-x-[23px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,
    VariantProps<typeof switchVariants> {}

export const Switch = forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, size, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={cn(switchVariants({ size }), className)}
    {...props}
  >
    <SwitchPrimitive.Thumb className={cn(thumbVariants({ size }))} />
  </SwitchPrimitive.Root>
));
Switch.displayName = "Switch";
