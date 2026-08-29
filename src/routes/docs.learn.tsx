import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowRight,
  BookOpen,
  Check,
  Clock,
  Compass,
  Palette,
  Sparkles,
  Wand2,
} from "lucide-react";
import { Badge, Card } from "@/nova";
import { cn } from "@/nova/utils";
import { DocsShell, DocLead, DocSection } from "@/components/docs/docs-shell";

export const Route = createFileRoute("/docs/learn")({
  component: LearnPage,
  head: () => ({
    meta: [
      { title: "Learning paths · Novix UI" },
      {
        name: "description",
        content:
          "Guided journeys through Novix UI — from your first component to advanced theming, motion, and accessibility.",
      },
      { property: "og:title", content: "Learning paths · Novix UI" },
      {
        property: "og:description",
        content: "Follow a curated path from Getting Started to Advanced Components.",
      },
    ],
  }),
});

type Step = { title: string; href: string; minutes: number };
type Path = {
  id: string;
  title: string;
  tagline: string;
  icon: React.ComponentType<{ size?: number }>;
  level: "Beginner" | "Intermediate" | "Advanced";
  steps: Step[];
};

const PATHS: Path[] = [
  {
    id: "getting-started",
    title: "Getting started",
    tagline: "Install Nova, ship a page, and understand the foundations.",
    icon: Compass,
    level: "Beginner",
    steps: [
      { title: "Introduction", href: "/docs", minutes: 3 },
      { title: "Installation", href: "/docs/installation", minutes: 5 },
      { title: "Quick start", href: "/docs/quick-start", minutes: 8 },
      { title: "Button", href: "/docs/components/button", minutes: 6 },
    ],
  },
  {
    id: "first-ui",
    title: "Build your first UI",
    tagline: "Compose primitives into a real product surface.",
    icon: Sparkles,
    level: "Beginner",
    steps: [
      { title: "Card", href: "/docs/components/card", minutes: 5 },
      { title: "Input", href: "/docs/components/input", minutes: 5 },
      { title: "Badge", href: "/docs/components/badge", minutes: 4 },
      { title: "Playground", href: "/docs/playground", minutes: 6 },
    ],
  },
  {
    id: "theming",
    title: "Theming",
    tagline: "Tokens, dark mode, and shaping Nova to your brand.",
    icon: Palette,
    level: "Intermediate",
    steps: [
      { title: "Colors", href: "/docs/tokens/colors", minutes: 7 },
      { title: "Typography", href: "/docs/tokens/typography", minutes: 5 },
      { title: "Theming guide", href: "/docs/theming", minutes: 8 },
    ],
  },
  {
    id: "motion",
    title: "Motion",
    tagline: "Spring physics, choreography, and reduced-motion.",
    icon: Wand2,
    level: "Intermediate",
    steps: [
      { title: "Motion tokens", href: "/docs/tokens/motion", minutes: 6 },
      { title: "Motion showcase", href: "/docs/motion", minutes: 8 },
    ],
  },
  {
    id: "a11y",
    title: "Accessibility",
    tagline: "Ship interfaces every person can use, keyboard-first.",
    icon: BookOpen,
    level: "Advanced",
    steps: [
      { title: "Accessibility guide", href: "/docs/accessibility", minutes: 10 },
      { title: "Button", href: "/docs/components/button", minutes: 4 },
      { title: "Input", href: "/docs/components/input", minutes: 4 },
    ],
  },
];

const PROGRESS_KEY = "nova.docs.learn.progress";

function LearnPage() {
  const [visited, setVisited] = useState<string[]>([]);

  useEffect(() => {
    try {
      const rec = JSON.parse(localStorage.getItem("nova.docs.recents") ?? "[]") as {
        href: string;
      }[];
      setVisited(rec.map((r) => r.href));
    } catch {
      /* noop */
    }
    try {
      const p = localStorage.getItem(PROGRESS_KEY);
      if (p) setVisited((cur) => Array.from(new Set([...cur, ...(JSON.parse(p) as string[])])));
    } catch {
      /* noop */
    }
  }, []);

  return (
    <DocsShell
      eyebrow="Learn"
      title="Learning paths"
      description="Guided journeys through Novix UI. Each path stacks the docs in an order that actually teaches — with time estimates and progress."
      toc={PATHS.map((p) => ({ id: p.id, label: p.title }))}
    >
      <DocLead>
        Reading time is honest — measured, not aspirational. Progress is saved locally in your
        browser.
      </DocLead>

      {PATHS.map((path) => (
        <DocSection key={path.id} id={path.id} title={path.title}>
          <PathCard path={path} visited={visited} />
        </DocSection>
      ))}
    </DocsShell>
  );
}

function PathCard({ path, visited }: { path: Path; visited: string[] }) {
  const done = path.steps.filter((s) => visited.includes(s.href)).length;
  const total = path.steps.length;
  const pct = Math.round((done / total) * 100);
  const totalMin = path.steps.reduce((a, s) => a + s.minutes, 0);
  const Icon = path.icon;

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="grid size-10 place-items-center rounded-lg bg-accent/10 text-accent">
            <Icon size={18} />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-display text-[17px] font-semibold tracking-tight">{path.title}</p>
              <Badge variant="outline" size="sm">
                {path.level}
              </Badge>
            </div>
            <p className="mt-0.5 text-[13.5px] text-muted-foreground">{path.tagline}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            {done}/{total} · {totalMin} min
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-subtle">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className="h-full rounded-full bg-gradient-to-r from-accent to-primary shadow-[0_0_10px_var(--accent)]"
        />
      </div>

      {/* Steps */}
      <ol className="mt-5 space-y-1.5">
        {path.steps.map((s, i) => {
          const complete = visited.includes(s.href);
          return (
            <li key={s.href}>
              <Link
                to={s.href}
                className={cn(
                  "group flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  "hover:bg-subtle",
                )}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={cn(
                      "grid size-6 place-items-center rounded-full border text-[11px] font-mono",
                      complete
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                        : "border-border/60 text-muted-foreground",
                    )}
                  >
                    {complete ? <Check size={11} /> : i + 1}
                  </span>
                  <span
                    className={complete ? "text-muted-foreground line-through" : "text-foreground"}
                  >
                    {s.title}
                  </span>
                </span>
                <span className="flex items-center gap-2 text-[11.5px] font-mono text-muted-foreground">
                  <Clock size={11} />
                  {s.minutes} min
                  <ArrowRight
                    size={12}
                    className="opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                  />
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
