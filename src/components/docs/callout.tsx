import type { ReactNode } from "react";
import {
  Accessibility,
  CheckCircle2,
  Info,
  Lightbulb,
  Sparkles,
  Star,
  TriangleAlert,
} from "lucide-react";
import { cn } from "@/nova/utils";

/**
 * Nova docs · Callout
 *
 * Consistent, subtle, semantic call-outs used across every doc page.
 * Each variant gets a unique icon, tint, and subtle left-rail treatment —
 * never a shouty full-color banner.
 */

export type CalloutVariant =
  | "tip"
  | "note"
  | "warning"
  | "success"
  | "best-practice"
  | "accessibility"
  | "pro-tip";

const VARIANTS: Record<
  CalloutVariant,
  {
    label: string;
    Icon: typeof Info;
    tint: string; // tailwind classes for icon and rail color
    ring: string; // subtle background wash
  }
> = {
  tip: {
    label: "Tip",
    Icon: Lightbulb,
    tint: "text-amber-500 [--rail:oklch(0.82_0.14_75)]",
    ring: "bg-amber-500/[0.04]",
  },
  note: {
    label: "Note",
    Icon: Info,
    tint: "text-accent [--rail:var(--accent)]",
    ring: "bg-accent/[0.04]",
  },
  warning: {
    label: "Warning",
    Icon: TriangleAlert,
    tint: "text-warning [--rail:var(--warning)]",
    ring: "bg-warning/[0.05]",
  },
  success: {
    label: "Success",
    Icon: CheckCircle2,
    tint: "text-success [--rail:var(--success)]",
    ring: "bg-success/[0.05]",
  },
  "best-practice": {
    label: "Best practice",
    Icon: Star,
    tint: "text-primary [--rail:var(--primary)]",
    ring: "bg-primary/[0.04]",
  },
  accessibility: {
    label: "Accessibility",
    Icon: Accessibility,
    tint: "text-accent [--rail:var(--accent)]",
    ring: "bg-accent/[0.04]",
  },
  "pro-tip": {
    label: "Pro tip",
    Icon: Sparkles,
    tint: "text-accent [--rail:var(--accent)]",
    ring: "bg-gradient-to-br from-accent/[0.06] to-primary/[0.05]",
  },
};

export function Callout({
  variant = "note",
  title,
  children,
  className,
}: {
  variant?: CalloutVariant;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  const v = VARIANTS[variant];
  const Icon = v.Icon;
  const heading = title ?? v.label;
  return (
    <aside
      role="note"
      aria-label={heading}
      className={cn(
        "relative my-5 overflow-hidden rounded-xl border border-border/60 pl-4 pr-4 py-3.5",
        "before:absolute before:inset-y-2 before:left-0 before:w-[3px] before:rounded-full",
        "before:bg-[var(--rail)] before:opacity-80",
        v.ring,
        v.tint,
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className="mt-[2px] grid size-6 shrink-0 place-items-center rounded-md bg-background/70 shadow-[0_1px_0_0_color-mix(in_oklab,white_15%,transparent)_inset,0_1px_2px_-1px_color-mix(in_oklab,black_25%,transparent)]"
        >
          <Icon size={13} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="mb-0.5 text-[12.5px] font-semibold tracking-[-0.005em] text-foreground">
            {heading}
          </p>
          <div className="text-[13.5px] leading-relaxed text-muted-foreground [&_a]:text-accent [&_a]:underline-offset-2 [&_a:hover]:underline [&_code]:rounded [&_code]:bg-subtle [&_code]:px-1 [&_code]:font-mono [&_code]:text-[12px] [&_code]:text-foreground">
            {children}
          </div>
        </div>
      </div>
    </aside>
  );
}
