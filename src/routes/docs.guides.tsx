import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Sparkles,
  Palette,
  Shapes,
  Keyboard,
  Rocket,
  Wand2,
  Layers,
  Gauge,
  Accessibility,
  Boxes,
  Terminal,
  Blocks,
  Zap,
  Compass,
  BookOpen,
  Search,
  Clock,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { DocsShell, DocLead } from "@/components/docs/docs-shell";
import { Badge, Card, Input } from "@/nova";
import { cn } from "@/nova/utils/cn";

export const Route = createFileRoute("/docs/guides")({
  component: GuidesPage,
  head: () => ({
    meta: [
      { title: "Guides · Novix UI" },
      {
        name: "description",
        content:
          "Practical, opinionated guides for building premium interfaces with Novix UI — theming, motion, accessibility, performance, and more.",
      },
      { property: "og:title", content: "Guides · Novix UI" },
      {
        property: "og:description",
        content:
          "Practical, opinionated guides for shipping premium interfaces with Novix UI.",
      },
    ],
  }),
});

// --------------------------------------------------------------------------
// Guide entries — original content authored for Nova.
// --------------------------------------------------------------------------

type Level = "Beginner" | "Intermediate" | "Advanced";
type Topic =
  | "Foundations"
  | "Theming"
  | "Motion"
  | "Accessibility"
  | "Performance"
  | "Composition"
  | "Tooling"
  | "AI";

type Guide = {
  slug: string;
  title: string;
  summary: string;
  topic: Topic;
  level: Level;
  minutes: number;
  icon: LucideIcon;
  accent: string; // OKLCH color pair used in the visual
  href: string;
  featured?: boolean;
  updated: string;
};

const GUIDES: Guide[] = [
  {
    slug: "installing-nova",
    title: "Installing Nova in a fresh app",
    summary:
      "Wire Nova into Vite, Next, Remix, or Astro in under three minutes — including Tailwind v4 setup and the theme provider.",
    topic: "Foundations",
    level: "Beginner",
    minutes: 3,
    icon: Rocket,
    accent: "250 70",
    href: "/docs/installation",
    featured: true,
    updated: "2026-07-17",
  },
  {
    slug: "first-component",
    title: "Ship your first component",
    summary:
      "Compose a Card + Button + Badge, learn the polymorphic `asChild` pattern, and understand where variants live.",
    topic: "Foundations",
    level: "Beginner",
    minutes: 6,
    icon: Blocks,
    accent: "195 80",
    href: "/docs/quick-start",
    featured: true,
    updated: "2026-07-16",
  },
  {
    slug: "theming",
    title: "Theming with OKLCH tokens",
    summary:
      "Rebrand the entire library by editing a handful of CSS variables — plus the perceptual reasoning behind OKLCH.",
    topic: "Theming",
    level: "Intermediate",
    minutes: 9,
    icon: Palette,
    accent: "40 90",
    href: "/docs/theming",
    featured: true,
    updated: "2026-07-15",
  },
  {
    slug: "dark-mode",
    title: "Building a delightful dark mode",
    summary:
      "Cross-fade transitions, system detection, per-surface elevation, and the pitfalls of naïve inversion.",
    topic: "Theming",
    level: "Intermediate",
    minutes: 7,
    icon: Layers,
    accent: "260 55",
    href: "/docs/tokens/colors",
    updated: "2026-07-14",
  },
  {
    slug: "motion-language",
    title: "Nova's motion language",
    summary:
      "When to use `snap`, `soft`, and `glide` springs — and how signature effects (Halo Hover, Press Sink) compose.",
    topic: "Motion",
    level: "Intermediate",
    minutes: 8,
    icon: Wand2,
    accent: "300 60",
    href: "/docs/motion",
    updated: "2026-07-14",
  },
  {
    slug: "reduced-motion",
    title: "Respecting reduced motion",
    summary:
      "A pragmatic checklist: what to animate, what to disable, and how to still feel alive when motion is off.",
    topic: "Accessibility",
    level: "Intermediate",
    minutes: 5,
    icon: Sparkles,
    accent: "155 70",
    href: "/docs/accessibility",
    updated: "2026-07-13",
  },
  {
    slug: "keyboard",
    title: "Keyboard-first interfaces",
    summary:
      "Focus rings, roving tabindex, escape hatches, and the exact shortcuts users expect from every primitive.",
    topic: "Accessibility",
    level: "Intermediate",
    minutes: 6,
    icon: Keyboard,
    accent: "220 60",
    href: "/docs/accessibility",
    updated: "2026-07-13",
  },
  {
    slug: "a11y-audit",
    title: "Running an accessibility audit",
    summary:
      "How Nova ships WCAG AA by default — and how to run `axe`, keyboard, and screen-reader passes on your own compositions.",
    topic: "Accessibility",
    level: "Advanced",
    minutes: 10,
    icon: Accessibility,
    accent: "130 65",
    href: "/docs/accessibility",
    updated: "2026-07-12",
  },
  {
    slug: "bundle-budget",
    title: "Keeping your bundle small",
    summary:
      "Tree-shaking with `sideEffects: false`, avoiding barrel-file traps, and measuring per-component cost.",
    topic: "Performance",
    level: "Advanced",
    minutes: 8,
    icon: Gauge,
    accent: "20 90",
    href: "/docs/release",
    updated: "2026-07-11",
  },
  {
    slug: "composition-over-config",
    title: "Composition over configuration",
    summary:
      "Prefer slotting Nova primitives together over adding one more prop — with worked examples for Cards and Menus.",
    topic: "Composition",
    level: "Intermediate",
    minutes: 7,
    icon: Shapes,
    accent: "285 55",
    href: "/docs/design-principles",
    updated: "2026-07-10",
  },
  {
    slug: "dashboard-shell",
    title: "Assembling a dashboard shell",
    summary:
      "Sidebar, topbar, command palette, and a scroll-locked content area — the anatomy every SaaS app repeats.",
    topic: "Composition",
    level: "Intermediate",
    minutes: 12,
    icon: Boxes,
    accent: "205 70",
    href: "/docs/recipes/dashboard",
    featured: true,
    updated: "2026-07-10",
  },
  {
    slug: "command-palette",
    title: "Designing a great ⌘K experience",
    summary:
      "Scoring, recents, keyboard flow, and the tiny details that make a palette feel Raycast-fast.",
    topic: "Composition",
    level: "Advanced",
    minutes: 9,
    icon: Compass,
    accent: "170 65",
    href: "/docs/recipes/command-palette",
    updated: "2026-07-09",
  },
  {
    slug: "cli-workflow",
    title: "The Nova CLI workflow",
    summary:
      "`init`, `add`, `diff`, `doctor` — how to use the CLI to keep components healthy across releases.",
    topic: "Tooling",
    level: "Beginner",
    minutes: 5,
    icon: Terminal,
    accent: "230 55",
    href: "/docs/cli",
    updated: "2026-07-09",
  },
  {
    slug: "ai-surface",
    title: "Designing for AI surfaces",
    summary:
      "Streaming halos, thinking states, citations, and the ergonomics of a copilot that lives inside your app.",
    topic: "AI",
    level: "Advanced",
    minutes: 11,
    icon: Zap,
    accent: "310 70",
    href: "/docs/lab",
    featured: true,
    updated: "2026-07-08",
  },
];

const TOPICS = [
  "All",
  "Foundations",
  "Theming",
  "Motion",
  "Accessibility",
  "Performance",
  "Composition",
  "Tooling",
  "AI",
] as const;

const LEVELS = ["All levels", "Beginner", "Intermediate", "Advanced"] as const;

// --------------------------------------------------------------------------
// Visual
// --------------------------------------------------------------------------

function GuideCover({ guide }: { guide: Guide }) {
  const [h, c] = guide.accent.split(" ");
  const g = `guide-${guide.slug}`;
  const Icon = guide.icon;
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden">
      <svg viewBox="0 0 400 225" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <linearGradient id={g} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={`oklch(0.78 0.16 ${h})`} />
            <stop offset="60%" stopColor={`oklch(0.5 0.2 ${(Number(h) + Number(c) / 2) % 360})`} />
            <stop offset="100%" stopColor={`oklch(0.22 0.04 ${(Number(h) + 40) % 360})`} />
          </linearGradient>
        </defs>
        <rect width="400" height="225" fill={`url(#${g})`} />
        {Array.from({ length: 9 }).map((_, i) => (
          <circle
            key={i}
            cx={40 + i * 45}
            cy={120 + Math.sin(i) * 40}
            r={80 - i * 6}
            fill="white"
            fillOpacity={0.03 + (i % 3) * 0.02}
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md ring-1 ring-white/25 [transform:translateZ(20px)]">
          <Icon className="h-7 w-7 text-white" strokeWidth={1.75} aria-hidden />
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// Card
// --------------------------------------------------------------------------

function GuideCard({ guide }: { guide: Guide }) {
  return (
    <Link
      to={guide.href}
      className="group relative block [perspective:1200px] motion-reduce:[perspective:none]"
    >
      <Card
        className={cn(
          "relative overflow-hidden p-0 transition-[transform,box-shadow] duration-300 ease-out",
          "group-hover:-translate-y-1 group-hover:[transform:rotateX(3deg)_rotateY(-3deg)_translateY(-4px)] [transform-style:preserve-3d]",
          "motion-reduce:transform-none motion-reduce:group-hover:translate-y-0",
          "group-hover:shadow-[0_30px_80px_-30px_color-mix(in_oklab,var(--foreground)_28%,transparent)]",
        )}
      >
        <GuideCover guide={guide} />
        <div className="space-y-3 p-5 [transform:translateZ(15px)]">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline">{guide.topic}</Badge>
            <span className="text-border">•</span>
            <span>{guide.level}</span>
            <span className="text-border">•</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" aria-hidden />
              {guide.minutes} min
            </span>
          </div>
          <h3 className="text-lg font-semibold tracking-tight">{guide.title}</h3>
          <p className="text-sm text-muted-foreground">{guide.summary}</p>
          <div className="flex items-center gap-1 pt-1 text-sm font-medium text-foreground/80 transition-colors group-hover:text-foreground">
            Read guide
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
          </div>
        </div>
      </Card>
    </Link>
  );
}

// --------------------------------------------------------------------------
// Learning paths — curated sequences of guides
// --------------------------------------------------------------------------

const PATHS: Array<{ title: string; blurb: string; icon: LucideIcon; steps: string[]; accent: string }> = [
  {
    title: "Start with Nova",
    blurb: "From npm install to your first shipped screen.",
    icon: Rocket,
    accent: "250 70",
    steps: ["installing-nova", "first-component", "theming", "dashboard-shell"],
  },
  {
    title: "Accessibility, in depth",
    blurb: "Ship interfaces that everyone can use — by default.",
    icon: Accessibility,
    accent: "155 65",
    steps: ["keyboard", "reduced-motion", "a11y-audit"],
  },
  {
    title: "The premium feel",
    blurb: "The signatures that make Nova feel alive.",
    icon: Wand2,
    accent: "310 70",
    steps: ["motion-language", "composition-over-config", "command-palette", "ai-surface"],
  },
];

function PathCard({ path }: { path: (typeof PATHS)[number] }) {
  const [h, c] = path.accent.split(" ");
  const items = path.steps.map((s) => GUIDES.find((g) => g.slug === s)!).filter(Boolean);
  const Icon = path.icon;
  return (
    <Card className="relative overflow-hidden p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background: `radial-gradient(500px circle at 100% 0%, oklch(0.6 0.2 ${h} / 0.18), transparent 55%)`,
        }}
      />
      <div className="relative">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-border/60"
            style={{ background: `oklch(0.6 0.2 ${h} / 0.12)` }}
          >
            <Icon className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h3 className="text-base font-semibold tracking-tight">{path.title}</h3>
            <p className="text-xs text-muted-foreground">{path.blurb}</p>
          </div>
        </div>
        <ol className="mt-5 space-y-2">
          {items.map((g, i) => (
            <li key={g.slug}>
              <Link
                to={g.href}
                className="group flex items-start gap-3 rounded-lg p-2 -mx-2 transition-colors hover:bg-muted/60"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border/70 text-[11px] tabular-nums text-muted-foreground">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{g.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {g.minutes} min · {g.level}
                  </div>
                </div>
                <ArrowUpRight className="mt-1 h-4 w-4 opacity-0 transition group-hover:opacity-100" aria-hidden />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </Card>
  );
}

// --------------------------------------------------------------------------
// Page
// --------------------------------------------------------------------------

function GuidesPage() {
  const [q, setQ] = useState("");
  const [topic, setTopic] = useState<(typeof TOPICS)[number]>("All");
  const [level, setLevel] = useState<(typeof LEVELS)[number]>("All levels");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return GUIDES.filter((g) => {
      if (topic !== "All" && g.topic !== topic) return false;
      if (level !== "All levels" && g.level !== level) return false;
      if (!needle) return true;
      return (
        g.title.toLowerCase().includes(needle) ||
        g.summary.toLowerCase().includes(needle) ||
        g.topic.toLowerCase().includes(needle)
      );
    });
  }, [q, topic, level]);

  const featured = GUIDES.filter((g) => g.featured);

  return (
    <DocsShell
      eyebrow="Guides"
      title="Guides for shipping premium UI"
      description="Practical, opinionated walkthroughs for building with Nova."
      toc={[
        { id: "featured", label: "Featured" },
        { id: "paths", label: "Learning paths" },
        { id: "all", label: "All guides" },
      ]}
    >
      <DocLead>
        Every guide is written to be finished in one sitting. Pick a topic, follow the code,
        and end with something you can ship.
      </DocLead>

      {/* Featured */}
      <section id="featured" className="mt-8 space-y-4">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Featured</h2>
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            Editors' picks
          </span>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((g) => (
            <GuideCard key={g.slug} guide={g} />
          ))}
        </div>
      </section>

      {/* Paths */}
      <section id="paths" className="mt-14 space-y-4">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Learning paths</h2>
          <Link to="/docs/learn" className="text-xs text-muted-foreground hover:text-foreground">
            View all paths →
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {PATHS.map((p) => (
            <PathCard key={p.title} path={p} />
          ))}
        </div>
      </section>

      {/* All */}
      <section id="all" className="mt-14 space-y-6">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">All guides</h2>
          <span className="text-xs text-muted-foreground tabular-nums">
            {filtered.length} of {GUIDES.length}
          </span>
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/50 p-4 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search guides…"
              aria-label="Search guides"
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {TOPICS.map((t) => (
              <button
                key={t}
                onClick={() => setTopic(t)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition",
                  topic === t
                    ? "border-foreground/40 bg-foreground text-background"
                    : "border-border/60 text-muted-foreground hover:text-foreground",
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {LEVELS.map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition",
                  level === l
                    ? "border-foreground/40 bg-foreground text-background"
                    : "border-border/60 text-muted-foreground hover:text-foreground",
                )}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <Card className="p-10 text-center text-sm text-muted-foreground">
            No guides match those filters yet.
          </Card>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((g) => (
              <GuideCard key={g.slug} guide={g} />
            ))}
          </div>
        )}

        <Card className="relative mt-8 overflow-hidden p-6">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(500px circle at 0% 100%, color-mix(in oklab, var(--primary) 14%, transparent), transparent 60%)",
            }}
          />
          <div className="relative flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                <BookOpen className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <h3 className="text-base font-semibold tracking-tight">Have a guide idea?</h3>
                <p className="text-sm text-muted-foreground">
                  Open a request and we'll consider it for the next docs pass.
                </p>
              </div>
            </div>
            <a
              href="mailto:guides@novix-ui.dev"
              className="rounded-full border border-border/60 px-4 py-2 text-sm font-medium transition hover:border-foreground/40"
            >
              Suggest a guide
            </a>
          </div>
        </Card>
      </section>
    </DocsShell>
  );
}
