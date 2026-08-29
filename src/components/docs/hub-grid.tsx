import { type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/nova";
import { cn } from "@/nova/utils";

/**
 * Nova docs · Hub card — shared surface used across Recipes, Templates,
 * and Migration index pages. Keeps the docs visually consistent and one
 * import per hub page.
 */
export type HubEntry = {
  title: string;
  description: string;
  href: string;
  badge?: string;
  eyebrow?: string;
  icon?: ReactNode;
};

export function HubGrid({ entries, columns = 2 }: { entries: HubEntry[]; columns?: 1 | 2 | 3 }) {
  return (
    <div
      className={cn(
        "mt-8 grid gap-4",
        columns === 1 && "grid-cols-1",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-2 lg:grid-cols-3",
      )}
    >
      {entries.map((e) => (
        <Link
          key={e.href}
          to={e.href}
          className="nova-card-surface group relative flex flex-col rounded-2xl p-5 transition hover:-translate-y-0.5"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {e.icon ? (
                <span className="flex size-10 items-center justify-center rounded-xl border border-border/70 bg-subtle/40 text-accent">
                  {e.icon}
                </span>
              ) : null}
              <div>
                {e.eyebrow ? (
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {e.eyebrow}
                  </p>
                ) : null}
                <p className="text-[15px] font-semibold">{e.title}</p>
              </div>
            </div>
            <ArrowUpRight
              aria-hidden
              className="size-4 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
            />
          </div>
          <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">{e.description}</p>
          {e.badge ? (
            <div className="mt-4">
              <Badge variant="outline" size="sm">
                {e.badge}
              </Badge>
            </div>
          ) : null}
        </Link>
      ))}
    </div>
  );
}
