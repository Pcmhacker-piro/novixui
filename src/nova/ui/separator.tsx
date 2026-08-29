import { forwardRef } from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "../utils";

type SeparatorProps = React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> & {
  /** Optional inline label. When set, renders centered text with rules on both sides. */
  label?: string;
};

export const Separator = forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(function Separator(
  { className, orientation = "horizontal", decorative = true, label, ...rest },
  ref,
) {
  if (label && orientation === "horizontal") {
    return (
      <div
        role={decorative ? "none" : "separator"}
        aria-orientation="horizontal"
        className={cn("flex items-center gap-3 text-xs text-muted-foreground", className)}
      >
        <span className="h-px flex-1 bg-border" />
        <span className="uppercase tracking-wider">{label}</span>
        <span className="h-px flex-1 bg-border" />
      </div>
    );
  }

  return (
    <SeparatorPrimitive.Root
      ref={ref}
      orientation={orientation}
      decorative={decorative}
      className={cn(
        "bg-border shrink-0",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      )}
      {...rest}
    />
  );
});
