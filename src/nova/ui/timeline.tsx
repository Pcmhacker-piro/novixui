import { forwardRef, type ReactNode } from "react";
import { cn } from "../utils";

export interface TimelineItem {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  time?: ReactNode;
  icon?: ReactNode;
  status?: "complete" | "current" | "upcoming";
}

export interface TimelineProps extends React.HTMLAttributes<HTMLOListElement> {
  items: TimelineItem[];
}

export const Timeline = forwardRef<HTMLOListElement, TimelineProps>(
  ({ items, className, ...props }, ref) => (
    <ol ref={ref} className={cn("relative", className)} {...props}>
      {items.map((item, idx) => {
        const status = item.status ?? (idx === 0 ? "current" : "upcoming");
        const isLast = idx === items.length - 1;
        return (
          <li key={item.id} className="relative flex gap-4 pb-6 last:pb-0">
            {!isLast && (
              <span
                aria-hidden
                className={cn(
                  "absolute left-[11px] top-6 bottom-0 w-px",
                  status === "complete"
                    ? "bg-gradient-to-b from-primary to-primary/20"
                    : "bg-border/60",
                )}
              />
            )}
            <span
              className={cn(
                "relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px]",
                status === "complete" &&
                  "border-transparent bg-primary text-primary-foreground shadow-[0_0_0_3px_color-mix(in_oklab,var(--primary)_20%,transparent),0_0_16px_-2px_color-mix(in_oklab,var(--primary)_60%,transparent)]",
                status === "current" &&
                  "border-primary/70 bg-background text-primary shadow-[0_0_0_3px_color-mix(in_oklab,var(--primary)_18%,transparent)] before:absolute before:inset-1 before:rounded-full before:bg-primary before:animate-pulse",
                status === "upcoming" && "border-border bg-surface text-muted-foreground",
              )}
            >
              {item.icon}
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-medium text-foreground">{item.title}</p>
                {item.time && (
                  <span className="text-xs text-muted-foreground tabular-nums">{item.time}</span>
                )}
              </div>
              {item.description && (
                <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  ),
);
Timeline.displayName = "Timeline";
