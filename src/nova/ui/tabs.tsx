import { forwardRef, useState, useRef, useEffect, useCallback } from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion } from "motion/react";
import { cn } from "../utils";

export const Tabs = TabsPrimitive.Root;

export const TabsList = forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "relative inline-flex h-10 items-center rounded-lg border border-border/60 bg-subtle/50 p-1 backdrop-blur",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = "TabsList";

/**
 * TabsTrigger with a shared animated pill background using motion layoutId.
 * All triggers in the same TabsList must share the same layoutId group.
 */
export const TabsTrigger = forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    layoutGroup?: string;
  }
>(({ className, children, layoutGroup = "nova-tabs", ...props }, ref) => {
  const innerRef = useRef<HTMLButtonElement | null>(null);
  const [active, setActive] = useState(false);

  const setRefs = useCallback(
    (node: HTMLButtonElement | null) => {
      innerRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
    },
    [ref],
  );

  useEffect(() => {
    const node = innerRef.current;
    if (!node) return;
    const update = () => setActive(node.getAttribute("data-state") === "active");
    update();
    const obs = new MutationObserver(update);
    obs.observe(node, { attributes: true, attributeFilter: ["data-state"] });
    return () => obs.disconnect();
  }, []);

  return (
    <TabsPrimitive.Trigger
      ref={setRefs}
      className={cn(
        "group relative z-10 inline-flex items-center justify-center gap-2 rounded-md px-3.5 py-1.5 text-sm font-medium",
        "text-muted-foreground transition-colors duration-200",
        "hover:text-foreground data-[state=active]:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        "active:scale-[0.96] transition-transform",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-md opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-data-[state=active]:opacity-0 bg-[radial-gradient(80%_120%_at_50%_0%,color-mix(in_oklab,var(--foreground)_8%,transparent),transparent)]"
      />
      {active && (
        <motion.span
          layoutId={layoutGroup}
          className="absolute inset-0 -z-10 rounded-md bg-gradient-to-b from-surface to-subtle border border-border/70 shadow-[0_1px_0_0_color-mix(in_oklab,white_60%,transparent)_inset,0_-1px_0_0_color-mix(in_oklab,black_10%,transparent)_inset,0_4px_12px_-4px_color-mix(in_oklab,var(--accent)_40%,transparent),0_2px_8px_-2px_color-mix(in_oklab,black_25%,transparent)]"
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
        >
          <span
            aria-hidden
            className="absolute inset-x-2 -top-px h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent"
          />
        </motion.span>
      )}
      <span className="relative">{children}</span>
    </TabsPrimitive.Trigger>
  );
});
TabsTrigger.displayName = "TabsTrigger";

export const TabsContent = forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-4 focus-visible:outline-none data-[state=active]:animate-fade-in",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = "TabsContent";
