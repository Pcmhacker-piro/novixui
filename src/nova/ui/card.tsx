import {
  forwardRef,
  useCallback,
  useRef,
  type HTMLAttributes,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

/**
 * Nova UI · Card
 *
 * The Nova signature surface. Layered ambient + key shadows create real depth,
 * a moon-edge highlight traces the top inner border as if lit from above, and
 * — when `interactive` is true — a soft accent halo tracks the cursor across
 * the surface. Corners are tuned to feel squircle-ish; motion respects
 * `prefers-reduced-motion`.
 *
 * The cursor tracker mutates two CSS custom properties (`--nova-x`, `--nova-y`)
 * directly on the DOM node — no React state, no re-renders.
 *
 * @signatures NovaShadow, MoonEdge, HaloHover, SquircleCorner
 */

const cardVariants = cva(
  [
    "nova-card-surface nova-card-moon-edge",
    "text-card-foreground",
    "rounded-xl",
  ].join(" "),
  {
    variants: {
      variant: {
        /** Default resting surface with the full Nova shadow stack. */
        default: "",
        /** Slightly lifted resting elevation; feels one layer closer. */
        elevated:
          "shadow-none [box-shadow:0_0_0_1px_color-mix(in_oklab,var(--foreground)_6%,transparent),0_2px_4px_-1px_color-mix(in_oklab,var(--foreground)_8%,transparent),0_8px_16px_-4px_color-mix(in_oklab,var(--foreground)_10%,transparent),0_24px_48px_-16px_color-mix(in_oklab,var(--foreground)_18%,transparent)]",
        /** Flat, borderless — for embedding inside another Nova surface. */
        ghost:
          "shadow-none [box-shadow:none] bg-transparent [&::after]:hidden",
        /** Stronger outline, no shadow — for dense layouts and tables. */
        outline:
          "shadow-none [box-shadow:inset_0_0_0_1px_var(--border-strong)] bg-transparent [&::after]:hidden",
      },
      padding: {
        none: "",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
      interactive: {
        true: "nova-card-halo nova-card-interactive focus-visible:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]",
        false: "",
      },
    },
    defaultVariants: { variant: "default", padding: "md", interactive: false },
  },
);

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    className,
    variant,
    padding,
    interactive,
    onPointerMove,
    onPointerLeave,
    ...rest
  },
  ref,
) {
  const localRef = useRef<HTMLDivElement | null>(null);

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      localRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    },
    [ref],
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      onPointerMove?.(event);
      if (!interactive) return;
      const el = localRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty("--nova-x", `${x}%`);
      el.style.setProperty("--nova-y", `${y}%`);
    },
    [interactive, onPointerMove],
  );

  const handlePointerLeave = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      onPointerLeave?.(event);
      if (!interactive) return;
      const el = localRef.current;
      if (!el) return;
      el.style.setProperty("--nova-x", "50%");
      el.style.setProperty("--nova-y", "-20%");
    },
    [interactive, onPointerLeave],
  );

  return (
    <div
      ref={setRefs}
      data-slot="root"
      data-interactive={interactive ? "" : undefined}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn(cardVariants({ variant, padding, interactive }), className)}
      {...rest}
    />
  );
});

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardHeader({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="header"
        className={cn("flex flex-col gap-1.5", className)}
        {...rest}
      />
    );
  },
);

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  function CardTitle({ className, ...rest }, ref) {
    return (
      <h3
        ref={ref}
        data-slot="title"
        className={cn(
          "text-base font-semibold leading-tight tracking-[-0.01em] text-foreground",
          className,
        )}
        {...rest}
      />
    );
  },
);

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(function CardDescription({ className, ...rest }, ref) {
  return (
    <p
      ref={ref}
      data-slot="description"
      className={cn("text-sm text-muted-foreground leading-relaxed", className)}
      {...rest}
    />
  );
});

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardContent({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="content"
        className={cn("mt-4", className)}
        {...rest}
      />
    );
  },
);

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardFooter({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="footer"
        className={cn("mt-6 flex items-center gap-2", className)}
        {...rest}
      />
    );
  },
);

export { cardVariants };
