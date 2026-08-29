import { forwardRef } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "../utils";

export const Slider = forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
  const values = props.value ?? props.defaultValue ?? [0];
  const thumbCount = Array.isArray(values) ? values.length : 1;

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        "data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-subtle border border-border/40">
        <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-primary to-accent shadow-[0_0_12px_-2px_color-mix(in_oklab,var(--primary)_60%,transparent)]" />
      </SliderPrimitive.Track>
      {Array.from({ length: thumbCount }).map((_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          className={cn(
            "block h-5 w-5 rounded-full bg-white border border-border/40",
            "shadow-[0_1px_2px_rgba(0,0,0,0.3),0_4px_10px_-2px_rgba(0,0,0,0.2)]",
            "transition-transform duration-200 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]",
            "hover:scale-110 active:scale-95",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          )}
        />
      ))}
    </SliderPrimitive.Root>
  );
});
Slider.displayName = "Slider";
