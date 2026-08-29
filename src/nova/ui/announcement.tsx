import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

const announcementVariants = cva(
  "group inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[12.5px] font-medium transition-colors",
  {
    variants: {
      variant: {
        neutral: "border-border bg-surface text-foreground hover:bg-subtle",
        accent:
          "border-transparent bg-[color-mix(in_oklab,var(--accent)_12%,var(--surface))] text-foreground hover:bg-[color-mix(in_oklab,var(--accent)_18%,var(--surface))]",
        outline: "border-border bg-transparent text-foreground hover:bg-subtle",
      },
    },
    defaultVariants: { variant: "accent" },
  },
);

export interface AnnouncementProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof announcementVariants> {
  /** Small leading pill, e.g. "New". */
  tag?: ReactNode;
  /** Trailing chevron/glyph. */
  trailing?: ReactNode;
}

/**
 * Announcement — compact top-of-page badge for launches, changelogs, links.
 */
export const Announcement = forwardRef<HTMLDivElement, AnnouncementProps>(
  function Announcement({ tag, trailing, variant, className, children, ...rest }, ref) {
    return (
      <div ref={ref} className={cn(announcementVariants({ variant }), className)} {...rest}>
        {tag && (
          <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-accent">
            {tag}
          </span>
        )}
        <span className="text-[12.5px] text-foreground">{children}</span>
        {trailing !== undefined ? (
          <span className="text-muted-foreground transition-transform group-hover:translate-x-0.5">
            {trailing}
          </span>
        ) : (
          <span aria-hidden className="text-muted-foreground transition-transform group-hover:translate-x-0.5">
            →
          </span>
        )}
      </div>
    );
  },
);

export { announcementVariants };
