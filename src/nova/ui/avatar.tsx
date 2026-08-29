import { forwardRef, useMemo, type ComponentPropsWithoutRef } from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

/**
 * Nova UI · Avatar
 *
 * A person or entity portrait. Built on Radix Avatar for the image-loading
 * state machine; adds Nova's ring, size scale, and status dot.
 *
 * Fallbacks are computed from `name` when no children are provided,
 * yielding stable initials without ever exposing raw email addresses.
 */

const avatarVariants = cva(
  [
    "relative inline-flex shrink-0 overflow-hidden align-middle",
    "bg-subtle text-foreground",
    "select-none",
  ].join(" "),
  {
    variants: {
      size: {
        xs: "h-6 w-6 text-[10px]",
        sm: "h-8 w-8 text-xs",
        md: "h-10 w-10 text-sm",
        lg: "h-12 w-12 text-base",
        xl: "h-16 w-16 text-lg",
        "2xl": "h-20 w-20 text-xl",
      },
      shape: {
        circle: "rounded-full",
        squircle: "rounded-[28%]",
      },
      ring: {
        none: "",
        subtle:
          "ring-1 ring-inset ring-[color-mix(in_oklab,var(--foreground)_10%,transparent)]",
        strong:
          "ring-2 ring-background outline outline-1 outline-border-strong",
        accent:
          "ring-2 ring-background outline outline-2 outline-accent",
      },
    },
    defaultVariants: { size: "md", shape: "circle", ring: "subtle" },
  },
);

const STATUS_COLOR: Record<AvatarStatus, string> = {
  online: "bg-success",
  offline: "bg-muted-foreground/60",
  busy: "bg-danger",
  away: "bg-warning",
};

const STATUS_LABEL: Record<AvatarStatus, string> = {
  online: "Online",
  offline: "Offline",
  busy: "Busy",
  away: "Away",
};

export type AvatarStatus = "online" | "offline" | "busy" | "away";

export interface AvatarProps
  extends Omit<
      ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
      "children"
    >,
    VariantProps<typeof avatarVariants> {
  /** Image source. Renders the fallback while loading and on error. */
  src?: string;
  /** Descriptive alt text for the image (required for a11y when `src` set). */
  alt?: string;
  /**
   * Display name. Used to compute initials when no `children` are provided,
   * and as the fallback `alt` when `alt` is omitted.
   */
  name?: string;
  /** Custom fallback content. Overrides computed initials. */
  children?: React.ReactNode;
  /** Presence indicator, rendered at the bottom-right. */
  status?: AvatarStatus;
}

/** Deterministic 1–2 char initials from a display name. Never emails. */
export function getInitials(name?: string): string {
  if (!name) return "";
  const cleaned = name.includes("@") ? name.split("@")[0] : name;
  const parts = cleaned.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const Avatar = forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(function Avatar(
  {
    className,
    size,
    shape,
    ring,
    src,
    alt,
    name,
    status,
    children,
    ...rest
  },
  ref,
) {
  const initials = useMemo(
    () => (children ? null : getInitials(name)),
    [children, name],
  );
  const accessibleAlt = alt ?? name ?? "";

  return (
    <AvatarPrimitive.Root
      ref={ref}
      data-slot="root"
      className={cn(avatarVariants({ size, shape, ring }), className)}
      {...rest}
    >
      {src && (
        <AvatarPrimitive.Image
          data-slot="image"
          src={src}
          alt={accessibleAlt}
          className="aspect-square h-full w-full object-cover"
        />
      )}
      <AvatarPrimitive.Fallback
        data-slot="fallback"
        delayMs={src ? 200 : 0}
        className="flex h-full w-full items-center justify-center font-medium leading-none text-muted-foreground"
      >
        {children ?? initials}
      </AvatarPrimitive.Fallback>
      {status && (
        <span
          data-slot="status"
          data-status={status}
          className={cn(
            "absolute bottom-0 right-0 block rounded-full ring-2 ring-background",
            STATUS_COLOR[status],
            size === "xs" || size === "sm" ? "size-2" : "size-2.5",
          )}
          role="status"
          aria-label={STATUS_LABEL[status]}
        />
      )}
    </AvatarPrimitive.Root>
  );
});

/**
 * A stacked cluster of avatars. Overlaps siblings and adds a "+N" chip when
 * exceeding `max`. Purely presentational — order matches DOM order.
 */
export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Maximum avatars to render before collapsing into "+N". */
  max?: number;
  /** Group size — cascades to children that don't set their own. */
  size?: AvatarProps["size"];
  /** Horizontal overlap in pixels. */
  spacing?: number;
}

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  function AvatarGroup(
    { className, max, spacing = 8, children, style, ...rest },
    ref,
  ) {
    const items = Array.isArray(children) ? children : [children];
    const visible = max ? items.slice(0, max) : items;
    const overflow = max ? Math.max(0, items.length - max) : 0;

    return (
      <div
        ref={ref}
        data-slot="root"
        role="group"
        className={cn("isolate inline-flex items-center", className)}
        style={{ ...style }}
        {...rest}
      >
        {visible.map((child, i) => (
          <div
            key={i}
            className="relative"
            style={{ marginLeft: i === 0 ? 0 : -spacing, zIndex: 20 - i }}
          >
            {child}
          </div>
        ))}
        {overflow > 0 && (
          <div
            className="relative grid h-10 min-w-10 place-items-center rounded-full bg-subtle px-2 text-xs font-medium text-muted-foreground ring-2 ring-background"
            style={{ marginLeft: -spacing, zIndex: 0 }}
            aria-label={`${overflow} more`}
          >
            +{overflow}
          </div>
        )}
      </div>
    );
  },
);

export { avatarVariants };
