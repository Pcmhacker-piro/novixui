import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { DocsShell, DocLead } from "@/components/docs/docs-shell";
import { Badge, Card, Input } from "@/nova";
import { cn } from "@/nova/utils/cn";

export const Route = createFileRoute("/docs/showcase")({
  component: ShowcasePage,
  head: () => ({
    meta: [
      { title: "Showcase · Novix UI" },
      {
        name: "description",
        content:
          "A gallery of products, dashboards, and experiences crafted with Novix UI — filter by category, industry, and surface.",
      },
      { property: "og:title", content: "Showcase · Novix UI" },
      {
        property: "og:description",
        content:
          "See how teams ship SaaS, AI, and dashboard products with Novix UI's premium components.",
      },
    ],
  }),
});

// --------------------------------------------------------------------------
// Original showcase entries — fictional example products built on Nova.
// Visuals are generated in-page as SVG so no third-party assets are used.
// --------------------------------------------------------------------------

type Entry = {
  slug: string;
  name: string;
  tagline: string;
  category: "SaaS" | "AI" | "Dashboard" | "Marketing" | "Docs" | "Fintech";
  industry: string;
  surface: "Web app" | "Landing page" | "Console" | "Mobile web";
  palette: [string, string, string]; // three OKLCH-ish CSS colors
  glyph: "grid" | "orbit" | "wave" | "prism" | "spark" | "flow";
  featured?: boolean;
};

const ENTRIES: Entry[] = [
  {
    slug: "helios",
    name: "Helios Analytics",
    tagline: "Realtime product analytics with an AI copilot.",
    category: "AI",
    industry: "Developer tools",
    surface: "Web app",
    palette: ["oklch(0.72 0.18 55)", "oklch(0.58 0.22 25)", "oklch(0.32 0.05 260)"],
    glyph: "orbit",
    featured: true,
  },
  {
    slug: "ledgerline",
    name: "Ledgerline",
    tagline: "Treasury console for modern finance teams.",
    category: "Fintech",
    industry: "Finance",
    surface: "Console",
    palette: ["oklch(0.78 0.14 155)", "oklch(0.52 0.16 200)", "oklch(0.24 0.03 240)"],
    glyph: "grid",
    featured: true,
  },
  {
    slug: "northwind",
    name: "Northwind Cloud",
    tagline: "Infra dashboard for distributed teams.",
    category: "Dashboard",
    industry: "Infrastructure",
    surface: "Web app",
    palette: ["oklch(0.7 0.15 250)", "oklch(0.55 0.2 290)", "oklch(0.22 0.04 260)"],
    glyph: "wave",
  },
  {
    slug: "kairo",
    name: "Kairo Docs",
    tagline: "Documentation platform with a live playground.",
    category: "Docs",
    industry: "Developer tools",
    surface: "Landing page",
    palette: ["oklch(0.82 0.1 100)", "oklch(0.6 0.17 130)", "oklch(0.28 0.04 220)"],
    glyph: "prism",
  },
  {
    slug: "mercer",
    name: "Mercer Studio",
    tagline: "Design ops console for enterprise brands.",
    category: "SaaS",
    industry: "Design",
    surface: "Web app",
    palette: ["oklch(0.78 0.12 30)", "oklch(0.52 0.18 355)", "oklch(0.24 0.04 320)"],
    glyph: "flow",
    featured: true,
  },
  {
    slug: "aperture",
    name: "Aperture AI",
    tagline: "Visual prompting studio for creative teams.",
    category: "AI",
    industry: "Creative",
    surface: "Web app",
    palette: ["oklch(0.8 0.16 300)", "oklch(0.55 0.22 260)", "oklch(0.22 0.05 280)"],
    glyph: "spark",
  },
  {
    slug: "atlas",
    name: "Atlas Routing",
    tagline: "Fleet operations for last-mile logistics.",
    category: "Dashboard",
    industry: "Logistics",
    surface: "Console",
    palette: ["oklch(0.76 0.14 200)", "oklch(0.5 0.16 230)", "oklch(0.22 0.03 240)"],
    glyph: "grid",
  },
  {
    slug: "sable",
    name: "Sable Commerce",
    tagline: "Headless storefront with premium theming.",
    category: "SaaS",
    industry: "Commerce",
    surface: "Landing page",
    palette: ["oklch(0.82 0.11 70)", "oklch(0.56 0.16 40)", "oklch(0.24 0.03 30)"],
    glyph: "wave",
  },
  {
    slug: "prism-pay",
    name: "Prism Pay",
    tagline: "Global payouts in a single dashboard.",
    category: "Fintech",
    industry: "Payments",
    surface: "Console",
    palette: ["oklch(0.78 0.14 190)", "oklch(0.52 0.2 310)", "oklch(0.22 0.05 270)"],
    glyph: "prism",
  },
  {
    slug: "vellum",
    name: "Vellum Notes",
    tagline: "Editorial CMS with real-time collaboration.",
    category: "SaaS",
    industry: "Publishing",
    surface: "Web app",
    palette: ["oklch(0.82 0.08 90)", "oklch(0.58 0.14 60)", "oklch(0.24 0.03 40)"],
    glyph: "flow",
  },
  {
    slug: "beacon",
    name: "Beacon Support",
    tagline: "AI-assisted helpdesk with routing intelligence.",
    category: "AI",
    industry: "Customer success",
    surface: "Web app",
    palette: ["oklch(0.8 0.12 160)", "oklch(0.54 0.18 200)", "oklch(0.24 0.04 210)"],
    glyph: "orbit",
  },
  {
    slug: "meridian",
    name: "Meridian",
    tagline: "Marketing site for a data infrastructure company.",
    category: "Marketing",
    industry: "Data",
    surface: "Landing page",
    palette: ["oklch(0.82 0.1 240)", "oklch(0.5 0.2 280)", "oklch(0.2 0.04 260)"],
    glyph: "spark",
  },
];

const CATEGORIES = ["All", "SaaS", "AI", "Dashboard", "Fintech", "Docs", "Marketing"] as const;
const SURFACES = ["All surfaces", "Web app", "Console", "Landing page", "Mobile web"] as const;

// --------------------------------------------------------------------------
// SVG "hero" visual — pure computation, deterministic per entry
// --------------------------------------------------------------------------

function EntryVisual({ entry }: { entry: Entry }) {
  const [a, b, c] = entry.palette;
  const gid = `g-${entry.slug}`;
  const rid = `r-${entry.slug}`;
  return (
    <svg
      viewBox="0 0 400 260"
      className="absolute inset-0 h-full w-full"
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={a} />
          <stop offset="55%" stopColor={b} />
          <stop offset="100%" stopColor={c} />
        </linearGradient>
        <radialGradient id={rid} cx="30%" cy="20%" r="80%">
          <stop offset="0%" stopColor="white" stopOpacity="0.28" />
          <stop offset="60%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="260" fill={`url(#${gid})`} />
      <rect width="400" height="260" fill={`url(#${rid})`} />

      {entry.glyph === "grid" && (
        <g stroke="white" strokeOpacity="0.22" strokeWidth="1">
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={"h" + i} x1="0" y1={26 * i + 10} x2="400" y2={26 * i + 10} />
          ))}
          {Array.from({ length: 16 }).map((_, i) => (
            <line key={"v" + i} x1={26 * i + 8} y1="0" x2={26 * i + 8} y2="260" />
          ))}
          <rect x="60" y="60" width="120" height="80" rx="10" fill="white" fillOpacity="0.14" />
          <rect x="200" y="60" width="150" height="140" rx="12" fill="white" fillOpacity="0.10" />
        </g>
      )}

      {entry.glyph === "orbit" && (
        <g fill="none" stroke="white" strokeWidth="1.25">
          <ellipse cx="200" cy="130" rx="170" ry="60" strokeOpacity="0.35" />
          <ellipse cx="200" cy="130" rx="120" ry="42" strokeOpacity="0.45" />
          <ellipse cx="200" cy="130" rx="70" ry="24" strokeOpacity="0.55" />
          <circle cx="200" cy="130" r="18" fill="white" fillOpacity="0.9" stroke="none" />
          <circle cx="330" cy="118" r="5" fill="white" stroke="none" />
          <circle cx="88" cy="150" r="4" fill="white" stroke="none" />
        </g>
      )}

      {entry.glyph === "wave" && (
        <g fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
          <path d="M0 180 Q80 120 160 170 T320 160 T480 150" strokeOpacity="0.75" />
          <path d="M0 210 Q80 160 160 200 T320 190 T480 180" strokeOpacity="0.5" />
          <path d="M0 150 Q80 90 160 140 T320 130 T480 120" strokeOpacity="0.35" />
        </g>
      )}

      {entry.glyph === "prism" && (
        <g>
          <polygon points="200,40 320,220 80,220" fill="white" fillOpacity="0.18" />
          <polygon points="200,40 320,220 200,220" fill="white" fillOpacity="0.10" />
          <polygon points="200,40 200,220 80,220" fill="white" fillOpacity="0.06" />
        </g>
      )}

      {entry.glyph === "spark" && (
        <g stroke="white" strokeWidth="1.5" strokeLinecap="round">
          {Array.from({ length: 14 }).map((_, i) => {
            const angle = (i / 14) * Math.PI * 2;
            const x1 = 200 + Math.cos(angle) * 30;
            const y1 = 130 + Math.sin(angle) * 30;
            const x2 = 200 + Math.cos(angle) * (70 + (i % 3) * 22);
            const y2 = 130 + Math.sin(angle) * (70 + (i % 3) * 22);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeOpacity={0.55} />;
          })}
          <circle cx="200" cy="130" r="22" fill="white" fillOpacity="0.9" />
        </g>
      )}

      {entry.glyph === "flow" && (
        <g fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
          {Array.from({ length: 12 }).map((_, i) => (
            <path
              key={i}
              d={`M ${-20 + i * 40} 260 C ${40 + i * 40} 180, ${80 + i * 40} 120, ${140 + i * 40} 0`}
              strokeOpacity={0.14 + (i % 4) * 0.08}
            />
          ))}
        </g>
      )}

      <rect x="0" y="0" width="400" height="260" fill="black" fillOpacity="0" />
    </svg>
  );
}

// --------------------------------------------------------------------------
// 3D tilt card
// --------------------------------------------------------------------------

function ShowcaseCard({ entry }: { entry: Entry }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${(0.5 - y) * 8}deg`);
    el.style.setProperty("--ry", `${(x - 0.5) * 10}deg`);
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="group relative [perspective:1200px] motion-reduce:[perspective:none]"
    >
      <Card
        className={cn(
          "relative overflow-hidden p-0 transition-[transform,box-shadow] duration-300 ease-out",
          "[transform:rotateX(var(--rx,0))_rotateY(var(--ry,0))] [transform-style:preserve-3d]",
          "motion-reduce:transform-none",
          "hover:shadow-[0_30px_80px_-30px_color-mix(in_oklab,var(--foreground)_30%,transparent)]",
        )}
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <EntryVisual entry={entry} />
          {/* halo */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(220px circle at var(--mx,50%) var(--my,50%), color-mix(in oklab, white 22%, transparent), transparent 65%)",
            }}
          />
          {entry.featured && (
            <div className="absolute left-3 top-3 [transform:translateZ(30px)]">
              <Badge variant="success">Featured</Badge>
            </div>
          )}
          <div className="absolute right-3 top-3 [transform:translateZ(24px)]">
            <Badge variant="neutral">{entry.category}</Badge>
          </div>
        </div>

        <div className="space-y-3 p-5 [transform:translateZ(20px)]">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-lg font-semibold tracking-tight">{entry.name}</h3>
            <span className="text-xs text-muted-foreground">{entry.surface}</span>
          </div>
          <p className="text-sm text-muted-foreground">{entry.tagline}</p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            <Badge variant="outline">{entry.industry}</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}

// --------------------------------------------------------------------------
// Page
// --------------------------------------------------------------------------

function ShowcasePage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
  const [surface, setSurface] = useState<(typeof SURFACES)[number]>("All surfaces");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return ENTRIES.filter((e) => {
      if (cat !== "All" && e.category !== cat) return false;
      if (surface !== "All surfaces" && e.surface !== surface) return false;
      if (!needle) return true;
      return (
        e.name.toLowerCase().includes(needle) ||
        e.tagline.toLowerCase().includes(needle) ||
        e.industry.toLowerCase().includes(needle)
      );
    });
  }, [q, cat, surface]);

  const featured = ENTRIES.filter((e) => e.featured);

  return (
    <DocsShell
      eyebrow="Showcase"
      title="Built with Nova"
      description="A gallery of products, dashboards, and experiences crafted with Novix UI."
      toc={[
        { id: "featured", label: "Featured" },
        { id: "gallery", label: "Gallery" },
        { id: "submit", label: "Submit yours" },
      ]}
    >
      <DocLead>
        Real-world compositions using Nova primitives — filter by category or surface to see
        how teams ship premium interfaces without abandoning craft.
      </DocLead>

      {/* Featured strip */}
      <section id="featured" className="mt-8 space-y-4">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Featured</h2>
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            Editors' picks
          </span>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {featured.map((e) => (
            <ShowcaseCard key={e.slug} entry={e} />
          ))}
        </div>
      </section>

      {/* Filters */}
      <section id="gallery" className="mt-14 space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/50 p-4 backdrop-blur md:flex-row md:items-center md:justify-between">
          <div className="w-full md:max-w-xs">
            <Input
              placeholder="Search by name, industry…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Search showcase"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition",
                  cat === c
                    ? "border-foreground/40 bg-foreground text-background"
                    : "border-border/60 text-muted-foreground hover:text-foreground",
                )}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {SURFACES.map((s) => (
              <button
                key={s}
                onClick={() => setSurface(s)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition",
                  surface === s
                    ? "border-foreground/40 bg-foreground text-background"
                    : "border-border/60 text-muted-foreground hover:text-foreground",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <Card className="p-10 text-center text-sm text-muted-foreground">
            No showcase entries match those filters yet.
          </Card>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((e) => (
              <ShowcaseCard key={e.slug} entry={e} />
            ))}
          </div>
        )}
      </section>

      {/* Submit */}
      <section id="submit" className="mt-14">
        <Card className="relative overflow-hidden p-8">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(600px circle at 20% 0%, color-mix(in oklab, var(--primary) 18%, transparent), transparent 60%)",
            }}
          />
          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Ship something with Nova?</h2>
              <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                Submit your product and we'll consider it for the featured strip. Real screenshots,
                a short description, and a public URL are all we need.
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                to="/docs/quick-start"
                className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90"
              >
                Start building
              </Link>
              <a
                href="mailto:showcase@novix-ui.dev"
                className="rounded-full border border-border/60 px-4 py-2 text-sm font-medium transition hover:border-foreground/40"
              >
                Submit your app
              </a>
            </div>
          </div>
        </Card>
      </section>
    </DocsShell>
  );
}
