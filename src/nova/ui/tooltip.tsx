import { forwardRef } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "../utils";

export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export const TooltipContent = forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 6, children, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 overflow-hidden rounded-md px-2.5 py-1.5 text-xs font-medium",
        "bg-foreground text-background border border-white/5",
        "shadow-[0_1px_0_0_color-mix(in_oklab,white_18%,transparent)_inset,0_10px_30px_-10px_rgba(0,0,0,0.5)]",
        "data-[state=delayed-open]:animate-fade-in data-[state=closed]:animate-fade-out",
        "data-[side=top]:origin-bottom data-[side=bottom]:origin-top data-[side=left]:origin-right data-[side=right]:origin-left",
        className,
      )}
      {...props}
    >
      {children}
      <TooltipPrimitive.Arrow className="fill-foreground" width={10} height={5} />
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = "TooltipContent";
