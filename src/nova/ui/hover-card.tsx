import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { cn } from "../utils";

export const HoverCard = HoverCardPrimitive.Root;
export const HoverCardTrigger = HoverCardPrimitive.Trigger;

export const HoverCardContent = forwardRef<
  ElementRef<typeof HoverCardPrimitive.Content>,
  ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = "center", sideOffset = 8, ...props }, ref) => (
  <HoverCardPrimitive.Portal>
    <HoverCardPrimitive.Content ref={ref} align={align} sideOffset={sideOffset}
      className={cn(
        "z-50 w-64 rounded-lg border border-border bg-popover p-4 text-popover-foreground shadow-xl outline-none",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95",
        className,
      )}
      {...props} />
  </HoverCardPrimitive.Portal>
));
HoverCardContent.displayName = "HoverCardContent";
