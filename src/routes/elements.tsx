import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { BUTTONS, type ButtonItem } from "@/data/buttons";
import { CHECKBOXES, type CheckboxItem } from "@/data/checkboxes";
import { TOGGLES as TOGGLES_BASE, type ToggleItem } from "@/data/toggles";
import { TOGGLES_EXTRA } from "@/data/toggles-extra";
const TOGGLES: ToggleItem[] = [...TOGGLES_BASE, ...TOGGLES_EXTRA];
import { LOADERS as LOADERS_BASE, type LoaderItem } from "@/data/loaders";
import { LOADERS_EXTRA } from "@/data/loaders-extra";
const LOADERS: LoaderItem[] = [...LOADERS_BASE, ...LOADERS_EXTRA];
import { RADIOS as RADIOS_BASE, type RadioItem } from "@/data/radios";
import { RADIOS_EXTRA } from "@/data/radios-extra";
const RADIOS: RadioItem[] = [...RADIOS_BASE, ...RADIOS_EXTRA];
import { TOOLTIPS as TOOLTIPS_BASE, type TooltipItem } from "@/data/tooltips";
import { TOOLTIPS_EXTRA } from "@/data/tooltips-extra";
const TOOLTIPS: TooltipItem[] = [...TOOLTIPS_BASE, ...TOOLTIPS_EXTRA];
import { INPUTS as INPUTS_BASE, type InputItem } from "@/data/inputs";
import { INPUTS_EXTRA } from "@/data/inputs-extra";
const INPUTS: InputItem[] = [...INPUTS_BASE, ...INPUTS_EXTRA];
import { CARDS, type CardItem } from "@/data/cards";
import { FORMS as FORMS_BASE } from "@/data/forms";
import { FORMS_EXTRA } from "@/data/forms-extra";
const FORMS = [...FORMS_BASE, ...FORMS_EXTRA];
import { PATTERNS as PATTERNS_BASE } from "@/data/patterns";
import { PATTERNS_EXTRA } from "@/data/patterns-extra";
const PATTERNS = [...PATTERNS_BASE, ...PATTERNS_EXTRA];
import { KITS as KITS_BASE, type KitItem } from "@/data/kits";
import { KITS_EXTRA } from "@/data/kits-extra";
const KITS: KitItem[] = [...KITS_BASE, ...KITS_EXTRA];
import { getVariant, variantToCssVars } from "@/data/button-variants";
import { Check, Copy, X } from "lucide-react";
import { extractSnippet } from "@/lib/snippet";

import { motion, useReducedMotion } from "motion/react";
import {
  BookOpen,
  CheckSquare,
  CircleDot,
  ClipboardList,
  FileText,
  HelpCircle,
  LayoutGrid,
  Loader2,
  MousePointer2,
  Search as SearchIcon,
  Sparkles,
  Sliders,
  ToggleRight,
  Waves,
  Filter,
  Grid3X3,
  SlidersHorizontal,
  Sun,
  Moon,
} from "lucide-react";
import { Badge, IconButton, useTheme } from "@/nova";
import { CREATIONS, CreationTile, MOSAIC_TILES, type Category, type Creation } from "@/data/landing-creations";
import { CodeModal, type CodeModalItem } from "@/components/elements/code-modal";
import { z } from "zod";

const elementsSearchSchema = z.object({
  category: z.string().optional(),
  tag: z.enum(["All", "React", "CSS", "Tailwind"]).optional(),
  q: z.string().optional(),
  sort: z.enum(["Featured", "Name A–Z", "Name Z–A", "Newest"]).optional(),
  tile: z.string().optional(),
  item: z.string().optional(),
});

export type ElementsSearch = z.infer<typeof elementsSearchSchema>;


export const Route = createFileRoute("/elements")({
  validateSearch: elementsSearchSchema,
  head: () => ({
    meta: [
      { title: "Browse elements — Novix UI" },
      {
        name: "description",
        content:
          "Open-source UI elements — buttons, loaders, toggles, cards, inputs, tooltips — made with React, CSS, and Tailwind.",
      },
      { property: "og:title", content: "Browse elements — Novix UI" },
      {
        property: "og:description",
        content: "Explore the Novix UI element gallery: 3D previews, copy-ready code, endless remixes.",
      },
    ],
  }),
  component: ElementsPage,
});

/* Sidebar categories (maps to Creation.category values) */
type SidebarKey =
  | "All"
  | "UI Kits"
  | "Buttons"
  | "Checkboxes"
  | "Toggles"
  | "Cards"
  | "Loaders"
  | "Inputs"
  | "Radio buttons"
  | "Forms"
  | "Patterns"
  | "Tooltips";

const SIDEBAR: {
  label: SidebarKey;
  icon: typeof BookOpen;
  count?: number;
  badge?: string;
}[] = [
  { label: "All", icon: BookOpen, count: KITS.length + BUTTONS.length + CHECKBOXES.length + TOGGLES.length + CARDS.length + LOADERS.length + INPUTS.length + RADIOS.length + FORMS.length + PATTERNS.length + TOOLTIPS.length },
  { label: "UI Kits", icon: LayoutGrid, count: KITS.length },
  { label: "Buttons", icon: MousePointer2, count: BUTTONS.length },
  { label: "Checkboxes", icon: CheckSquare, count: CHECKBOXES.length },
  { label: "Toggles", icon: ToggleRight, count: TOGGLES.length },
  { label: "Cards", icon: FileText, count: CARDS.length },
  { label: "Loaders", icon: Loader2, count: LOADERS.length },
  { label: "Inputs", icon: SearchIcon, count: INPUTS.length },
  { label: "Radio buttons", icon: CircleDot, count: RADIOS.length },
  { label: "Forms", icon: ClipboardList, count: FORMS.length },
  { label: "Patterns", icon: Waves, count: PATTERNS.length },
  { label: "Tooltips", icon: HelpCircle, count: TOOLTIPS.length },
];

const TAGS = ["All", "Tailwind", "CSS", "React"] as const;
const SORTS = ["Featured", "Name A–Z", "Name Z–A", "Newest"] as const;
type SortKey = (typeof SORTS)[number];
const STYLE_CHIPS = ["neumorphism", "3d", "gradient", "glass", "outline"] as const;

// Category aliases so a query like "btn" matches buttons, "input" matches inputs, etc.
// Keep lowercase — the matcher lowercases the needle.
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  button:    ["button", "buttons", "btn", "cta", "action"],
  checkbox:  ["checkbox", "checkboxes", "check", "tick", "select"],
  toggle:    ["toggle", "toggles", "switch", "switches", "on off"],
  card:      ["card", "cards", "tile", "panel"],
  loader:    ["loader", "loaders", "loading", "spinner", "progress"],
  radio:     ["radio", "radios", "radio button", "option"],
  tooltip:   ["tooltip", "tooltips", "hint", "popover"],
  input:     ["input", "inputs", "field", "textbox", "textfield", "form field"],
  form:      ["form", "forms", "login", "signup", "signin", "auth"],
  pattern:   ["pattern", "patterns", "background", "bg", "grid"],
  kit:       ["kit", "kits", "ui kit", "template", "layout"],
};

function itemKeywords<T extends { id: string; name: string; code?: string; tagline?: string }>(
  it: T,
): string {
  // The code string carries every class token (e.g. "gradient", "neon", "glass",
  // "shadow", "ring", color names) — searching it makes intent-based queries work.
  return [
    it.name,
    it.id,
    it.tagline ?? "",
    it.code ?? "",
  ].join(" ").toLowerCase();
}

function applyFilterSort<T extends { id: string; name: string; code?: string; tagline?: string }>(
  items: T[],
  q: string,
  sort: SortKey,
  categoryKey?: string,
): T[] {
  let list = items;
  const needle = q.trim().toLowerCase();
  if (needle) {
    const aliases = categoryKey ? CATEGORY_KEYWORDS[categoryKey] ?? [] : [];
    const categoryMatchesNeedle = aliases.some(
      (a) => a.includes(needle) || needle.includes(a),
    );
    list = list.filter((it) => {
      if (categoryMatchesNeedle) return true;
      return itemKeywords(it).includes(needle);
    });
  }
  if (sort === "Name A–Z") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
  else if (sort === "Name Z–A") list = [...list].sort((a, b) => b.name.localeCompare(a.name));
  else if (sort === "Newest") list = [...list].reverse();
  return list;
}


function cleanSearch(patch: Record<string, unknown>, current: Record<string, unknown> = {}) {
  const next: Record<string, unknown> = { ...current, ...patch };
  if (!next.category || next.category === "All") delete next.category;
  if (!next.tag || next.tag === "All") delete next.tag;
  if (!next.q || (typeof next.q === "string" && !next.q.trim())) delete next.q;
  if (!next.sort || next.sort === "Featured") delete next.sort;
  if (!next.tile) delete next.tile;
  if (!next.item) delete next.item;
  return next;
}

function ElementsPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const active = (search.category || "All") as SidebarKey;
  const tag = search.tag || "All";
  const q = search.q || "";
  const sort = (search.sort || "Featured") as SortKey;
  const itemId = search.item || "";

  const setSearch = (patch: Record<string, unknown>) =>
    navigate({ search: (p: Record<string, unknown>) => cleanSearch(patch, p) });

  const clearItem = () => setSearch({ item: undefined });

  // Chip toggles the query — click to filter, click again to clear.
  const toggleChip = (chip: string) =>
    setSearch({ q: q.trim().toLowerCase() === chip ? undefined : chip });

  // Categories in CREATIONS: Buttons, Loaders, Toggles, Checkboxes, Cards, Inputs, Tooltips.
  // Unmapped sidebar entries (UI Kits, Radio buttons, Forms, Patterns) show a friendly empty state.
  const filtered = useMemo<Creation[]>(() => {
    let list: Creation[] = CREATIONS;
    if (active && active !== "All") {
      list = list.filter((c) => c.category === (active as unknown as Category));
    }
    if (tag !== "All") list = list.filter((c) => c.tag === tag);
    if (q.trim()) {
      const needle = q.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(needle) ||
          c.author.toLowerCase().includes(needle) ||
          c.category.toLowerCase().includes(needle),
      );
    }
    if (sort === "Name A–Z") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "Name Z–A") list = [...list].sort((a, b) => b.name.localeCompare(a.name));
    else if (sort === "Newest") list = [...list].reverse();
    return list;
  }, [active, tag, q, sort]);

  // For dedicated galleries, tag isn't meaningful — surface that in the UI.
  const galleryCategories: SidebarKey[] = [
    "Buttons", "Checkboxes", "Toggles", "Cards", "Loaders", "Radio buttons", "Tooltips", "Inputs",
  ];
  const tagDisabled = galleryCategories.includes(active);

  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-[#050505] dark:text-white">
      <MosaicAnimationStyles />
      <ElementsHeader />

      <div className="mx-auto flex w-full max-w-[1400px] gap-8 px-6 py-8 lg:px-8">
        {/* Sidebar */}
        <aside className="hidden w-60 shrink-0 md:block">
          <nav className="sticky top-24 space-y-1">
            {SIDEBAR.map(({ label, icon: Icon, count, badge }) => {
              const isActive = active === label;
              return (
                <Link
                  key={label}
                  to="/elements"
                  search={(prev: Record<string, unknown>) =>
                    cleanSearch({ category: label === "All" ? undefined : label }, prev)
                  }
                  className={
                    "flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-all duration-200 " +
                    (isActive
                      ? "bg-accent/15 text-accent font-semibold ring-1 ring-accent/30 dark:bg-white/[0.06] dark:text-white dark:ring-white/10"
                      : "text-muted-foreground hover:bg-subtle hover:text-foreground dark:text-white/70 dark:hover:bg-white/[0.04] dark:hover:text-white")
                  }
                >
                  <span className="flex items-center gap-3">
                    <Icon size={17} className={isActive ? "text-accent" : "text-muted-foreground dark:text-white/60"} />
                    <span>{label}</span>
                  </span>
                  {badge ? (
                    <span className="text-[12px] font-semibold text-rose-500 dark:text-rose-400">{badge}</span>
                  ) : count !== undefined ? (
                    <span className="text-[12px] tabular-nums text-muted-foreground/80 dark:text-white/40">
                      {count.toLocaleString()}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <section className="min-w-0 flex-1">
          {/* Mobile category navigation bar */}
          <div className="flex md:hidden items-center gap-1.5 overflow-x-auto pb-3 mb-6 no-scrollbar">
            {SIDEBAR.map(({ label, icon: Icon, count }) => {
              const isActive = active === label;
              return (
                <Link
                  key={label}
                  to="/elements"
                  search={(prev: Record<string, unknown>) =>
                    cleanSearch({ category: label === "All" ? undefined : label }, prev)
                  }
                  className={
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors border " +
                    (isActive
                      ? "border-accent/40 bg-accent/15 text-accent font-semibold dark:border-white/20 dark:bg-white/10 dark:text-white"
                      : "border-border/80 bg-subtle/80 text-muted-foreground hover:bg-subtle hover:text-foreground dark:border-white/10 dark:bg-white/[0.03] dark:text-white/70")
                  }
                >
                  <Icon size={13} className={isActive ? "text-accent" : "text-muted-foreground dark:text-white/60"} />
                  <span>{label}</span>
                  {count !== undefined && (
                    <span className="text-[10px] opacity-70">
                      {count}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <header className="mb-6">
            <h1 className="font-display text-3xl font-semibold tracking-[-0.02em] md:text-4xl text-foreground">
              {active === "All" ? "Browse all" : active}
            </h1>
            <p className="mt-2 text-[14px] text-muted-foreground dark:text-white/60">
              Open-source UI elements crafted with React, CSS, and Tailwind.
            </p>
          </header>

          {/* Filter bar */}
          <div className="mb-8 flex flex-col gap-3 rounded-2xl border border-border bg-subtle/40 p-3 md:flex-row md:items-center md:justify-between dark:border-white/8 dark:bg-white/[0.02]">
            <div />

            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-[12px] text-muted-foreground dark:border-white/10 dark:bg-white/[0.03] dark:text-white/60">
                <Filter size={12} />
                <span>Sort:</span>
                <select
                  value={sort}
                  onChange={(e) => setSearch({ sort: e.target.value as SortKey })}
                  className="cursor-pointer appearance-none bg-transparent text-foreground focus:outline-none dark:text-white"
                >
                  {SORTS.map((s) => (
                    <option key={s} value={s} className="bg-background text-foreground dark:bg-[#0f0f10] dark:text-white">{s}</option>
                  ))}
                </select>
              </label>
              <div className="hidden items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-[12px] text-muted-foreground md:flex dark:border-white/10 dark:bg-white/[0.03] dark:text-white/60">
                <SearchIcon size={12} />
                <input
                  value={q}
                  onChange={(e) => setSearch({ q: e.target.value })}
                  placeholder="Search name or id…"
                  className="w-56 bg-transparent text-[12px] text-foreground placeholder:text-muted-foreground focus:outline-none dark:text-white dark:placeholder:text-white/40"
                />
                {q && (
                  <button
                    onClick={() => setSearch({ q: "" })}
                    aria-label="Clear search"
                    className="text-muted-foreground transition-colors hover:text-foreground dark:text-white/40 dark:hover:text-white"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Grid */}
          {active === "All" ? (
            <AllGalleries
              q={q}
              sort={sort}
              onJump={(cat) => setSearch({ category: cat })}
            />
          ) : active === "UI Kits" ? (
            <KitsGallery q={q} sort={sort} deepLinkId={itemId} onClearDeepLink={clearItem} mosaic={<MosaicCards category={active} highlightId={search.tile} />} />
          ) : active === "Buttons" ? (
            <ButtonsGallery q={q} sort={sort} deepLinkId={itemId} onClearDeepLink={clearItem} mosaic={<MosaicCards category={active} highlightId={search.tile} />} />
          ) : active === "Checkboxes" ? (
            <CheckboxesGallery q={q} sort={sort} deepLinkId={itemId} onClearDeepLink={clearItem} mosaic={<MosaicCards category={active} highlightId={search.tile} />} />
          ) : active === "Toggles" ? (
            <TogglesGallery q={q} sort={sort} deepLinkId={itemId} onClearDeepLink={clearItem} mosaic={<MosaicCards category={active} highlightId={search.tile} />} />
          ) : active === "Cards" ? (
            <MiniGallery items={CARDS} hostAttr="data-cd-hover-host" categoryKey="card" q={q} sort={sort} deepLinkId={itemId} onClearDeepLink={clearItem} shareCategory="Cards" mosaic={<MosaicCards category={active} highlightId={search.tile} />} />
          ) : active === "Loaders" ? (
            <MiniGallery items={LOADERS} hostAttr="data-ld-hover-host" categoryKey="loader" q={q} sort={sort} deepLinkId={itemId} onClearDeepLink={clearItem} shareCategory="Loaders" mosaic={<MosaicCards category={active} highlightId={search.tile} />} />
          ) : active === "Radio buttons" ? (
            <MiniGallery items={RADIOS} hostAttr="data-rd-hover-host" categoryKey="radio" q={q} sort={sort} deepLinkId={itemId} onClearDeepLink={clearItem} shareCategory="Radio buttons" mosaic={<MosaicCards category={active} highlightId={search.tile} />} />
          ) : active === "Tooltips" ? (
            <MiniGallery items={TOOLTIPS} hostAttr="data-tp-hover-host" categoryKey="tooltip" q={q} sort={sort} deepLinkId={itemId} onClearDeepLink={clearItem} shareCategory="Tooltips" mosaic={<MosaicCards category={active} highlightId={search.tile} />} />
          ) : active === "Inputs" ? (
            <MiniGallery items={INPUTS} hostAttr="data-in-hover-host" categoryKey="input" q={q} sort={sort} deepLinkId={itemId} onClearDeepLink={clearItem} shareCategory="Inputs" mosaic={<MosaicCards category={active} highlightId={search.tile} />} />
          ) : active === "Forms" ? (
            <MiniGallery items={FORMS} hostAttr="data-fm-hover-host" categoryKey="form" q={q} sort={sort} deepLinkId={itemId} onClearDeepLink={clearItem} shareCategory="Forms" mosaic={<MosaicCards category={active} highlightId={search.tile} />} />
          ) : active === "Patterns" ? (
            <MiniGallery items={PATTERNS} hostAttr="data-pt-hover-host" categoryKey="pattern" q={q} sort={sort} deepLinkId={itemId} onClearDeepLink={clearItem} shareCategory="Patterns" mosaic={<MosaicCards category={active} highlightId={search.tile} />} />


          ) : filtered.length === 0 ? (
            <EmptyState label={active} />
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((c, i) => (
                <TiltWrap key={c.id} index={i}>
                  <CreationTile creation={c} index={i} />
                </TiltWrap>
              ))}
            </div>
          )}

        </section>
      </div>
    </div>
  );
}

function MosaicAnimationStyles() {
  return (
    <style>{`
      @keyframes nova-mosaic-rise {
        0% { opacity: 0; transform: translateY(14px) scale(.98); }
        100% { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes nova-mosaic-ripple {
        0%   { transform: translate(-50%, -50%) scale(.4); opacity: .9; }
        70%  { opacity: .35; }
        100% { transform: translate(-50%, -50%) scale(22); opacity: 0; }
      }
      @keyframes nova-mosaic-words {
        0%, 16%   { transform: translateY(0); }
        20%, 36%  { transform: translateY(-100%); }
        40%, 56%  { transform: translateY(-200%); }
        60%, 76%  { transform: translateY(-300%); }
        80%, 100% { transform: translateY(-400%); }
      }
      @keyframes nova-caret {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
      @keyframes nova-bob {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-4px); }
      }
      @keyframes nova-stairs-scroll {
        0% { transform: translate3d(0, 0, 0); }
        100% { transform: translate3d(-16px, 10px, 0); }
      }
      @keyframes nova-ball-hop {
        0%, 100% { transform: translate3d(0, 0, 18px) scale3d(1.08, .86, 1); }
        10% { transform: translate3d(0, 0, 18px) scale3d(.86, 1.14, 1); }
        42% { transform: translate3d(6px, -22px, 34px) scale3d(.96, 1.04, 1); }
        68% { transform: translate3d(2px, -8px, 26px) scale3d(1, 1, 1); }
        82% { transform: translate3d(0, 0, 18px) scale3d(1.16, .78, 1); }
      }
      @keyframes nova-ball-shadow {
        0%, 100% { opacity: .6; transform: translate3d(0, 0, 0) scaleX(1); }
        42% { opacity: .18; transform: translate3d(6px, 4px, 0) scaleX(.55); }
        82% { opacity: .72; transform: translate3d(0, 0, 0) scaleX(1.15); }
      }
      @keyframes nova-rec {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: .35; transform: scale(.85); }
      }
      @keyframes nova-eq {
        0%, 100% { height: 30%; }
        50% { height: 90%; }
      }
      @keyframes nova-neon-pulse {
        0%, 100% { box-shadow: 0 0 20px -4px #d946ef; }
        50% { box-shadow: 0 0 34px -2px #d946ef, 0 0 60px -8px #d946ef; }
      }
      @keyframes nova-zap {
        0%, 100% { transform: translateY(0) rotate(0); filter: drop-shadow(0 0 0 rgba(250,204,21,0)); }
        40% { transform: translateY(-2px) rotate(-8deg); filter: drop-shadow(0 0 6px rgba(250,204,21,.9)); }
        60% { transform: translateY(1px) rotate(6deg); filter: drop-shadow(0 0 4px rgba(250,204,21,.7)); }
      }
      @media (prefers-reduced-motion: reduce) {
        [style*="nova-neon-pulse"] { animation: none !important; }
      }
    `}</style>
  );
}

/* 3D tilt wrapper — subtle premium parallax with CSS content-visibility optimization */
function TiltWrap({ children, index }: { children: React.ReactNode; index: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${(-py * 6).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(px * 8).toFixed(2)}deg`);
    el.style.setProperty("--gx", `${(px * 100 + 50).toFixed(1)}%`);
    el.style.setProperty("--gy", `${(py * 100 + 50).toFixed(1)}%`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
  };

  return (
    <div
      style={{
        perspective: "1200px",
        contentVisibility: "auto",
        containIntrinsicSize: "320px 300px",
      }}
      className="transition-all duration-300"
    >
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="relative transition-transform duration-300 ease-out will-change-transform"
        style={{
          transform:
            "rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)) translateZ(0)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* halo glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-1 -z-10 rounded-3xl opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(60% 60% at var(--gx,50%) var(--gy,50%), color-mix(in oklab, var(--accent) 45%, transparent), transparent 70%)",
          }}
        />
        {children}
      </div>
    </div>
  );
}

/* Category → mosaic key (Radios sidebar label differs from mosaic key) */
const MOSAIC_CATEGORY_MAP: Record<string, string> = { "Radio buttons": "Radios" };
function mosaicTilesFor(category: string) {
  const key = MOSAIC_CATEGORY_MAP[category] ?? category;
  return MOSAIC_TILES.filter((t) => t.category === key);
}

/* Mosaic tile rendered inside the same premium 3D card frame as gallery items */
function MosaicCard({ tile, highlight }: { tile: (typeof MOSAIC_TILES)[number]; highlight?: boolean }) {
  const [openCode, setOpenCode] = useState(false);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y / rect.height) - 0.5) * -8;
    const ry = ((x / rect.width) - 0.5) * 10;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
    el.style.setProperty("--tilt-x", `${rx.toFixed(2)}deg`);
    el.style.setProperty("--tilt-y", `${ry.toFixed(2)}deg`);
  };
  const onLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.style.setProperty("--tilt-x", `0deg`);
    el.style.setProperty("--tilt-y", `0deg`);
  };
  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
    el.classList.remove("is-active", "is-pressed");
    void el.offsetWidth;
    el.classList.add("is-active", "is-pressed");
    window.setTimeout(() => el.classList.remove("is-pressed"), 260);
    window.setTimeout(() => el.classList.remove("is-active"), 900);
    window.setTimeout(() => setOpenCode(true), 180);
  };
  return (
    <div style={{ perspective: "1200px" }}>
      <div
        data-tile-id={tile.id}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onClick={onClick}
        style={{
          transform: "rotateX(var(--tilt-x,0deg)) rotateY(var(--tilt-y,0deg)) translateZ(0)",
          transformStyle: "preserve-3d",
        }}
        className={[
          "group is-hoverable relative flex h-72 flex-col overflow-hidden cursor-pointer",
          "rounded-2xl border border-white/8 bg-gradient-to-b from-[#0f0f10] to-[#050505]",
          "shadow-[0_14px_40px_-18px_rgba(0,0,0,0.7)]",
          "transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform",
          "hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_28px_70px_-20px_color-mix(in_oklab,var(--accent)_55%,transparent)]",
          "[&.is-active]:-translate-y-1 [&.is-active]:border-accent/60 [&.is-active]:shadow-[0_28px_70px_-20px_color-mix(in_oklab,var(--accent)_70%,transparent)]",
          "[&.is-pressed]:!translate-y-0 [&.is-pressed]:!scale-[.98]",
          highlight
            ? "ring-2 ring-accent motion-safe:animate-[nova-mosaic-rise_.7s_ease-out_both]"
            : "",
        ].join(" ")}
      >
        <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{ background: "radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,0.06), transparent 60%)" }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-[.is-active]:opacity-100 motion-reduce:hidden"
          style={{
            background:
              "radial-gradient(220px circle at var(--mx,50%) var(--my,50%), color-mix(in oklab, var(--accent) 28%, transparent), transparent 60%)",
          }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-20 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100 group-[.is-active]:opacity-100 motion-reduce:hidden"
          style={{
            background:
              "radial-gradient(40% 40% at 50% 45%, color-mix(in oklab, var(--accent) 35%, transparent), transparent 70%)",
          }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-x-8 -top-1 h-full -translate-x-full skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full group-[.is-active]:translate-x-full"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute left-[var(--mx,50%)] top-[var(--my,50%)] block h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 group-[.is-active]:opacity-100 group-[.is-active]:motion-safe:animate-[nova-mosaic-ripple_.9s_ease-out_forwards]"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--accent) 70%, transparent) 0%, color-mix(in oklab, var(--accent) 30%, transparent) 40%, transparent 70%)",
            boxShadow: "0 0 30px color-mix(in oklab, var(--accent) 60%, transparent)",
          }}
        />
        <div className="relative flex flex-1 items-center justify-center px-6 py-8" style={{ transform: "translateZ(30px)" }}>
          <div className="transition-transform duration-500 group-hover:scale-[1.08] group-hover:-translate-y-0.5 group-[.is-active]:scale-[1.08] drop-shadow-[0_10px_24px_rgba(0,0,0,0.5)]">
            {tile.render()}
          </div>
        </div>
        <div className="relative flex items-center justify-between gap-3 border-t border-white/8 bg-white/[0.02] px-4 py-2.5" style={{ transform: "translateZ(20px)" }}>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-[12px] font-medium text-white/70">From the mosaic</span>
            <span className="font-mono text-[10.5px] text-white/40">#{tile.id}</span>
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setOpenCode(true); }}
            className="shrink-0 rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-white/80 transition-colors hover:border-accent/50 hover:bg-accent/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
          >
            Get code
          </button>
        </div>
      </div>
      {openCode && (
        <CodeModal
          item={{ id: tile.id, name: tile.id, render: tile.render, code: extractSnippet({ name: tile.id, render: tile.render }) }}
          onClose={() => setOpenCode(false)}
        />
      )}
    </div>
  );
}


/* Grid-child list of mosaic cards, wrapped with the same tilt/halo used by gallery items */
function MosaicCards({ category, highlightId }: { category: string; highlightId?: string }) {
  const tiles = useMemo(() => mosaicTilesFor(category), [category]);
  const firstRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!highlightId) return;
    const el = document.querySelector(`[data-tile-id="${highlightId}"]`) as HTMLElement | null;
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [highlightId, tiles.length]);
  if (tiles.length === 0) return null;
  return (
    <>
      {tiles.map((t, i) => (
        <TiltWrap key={`mosaic-${t.id}`} index={i}>
          <div ref={i === 0 ? firstRef : undefined}>
            <MosaicCard tile={t} highlight={highlightId === t.id} />
          </div>
        </TiltWrap>
      ))}
    </>
  );
}


function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-subtle/40 py-24 text-center dark:border-white/10 dark:bg-white/[0.02]">
      <Sparkles size={22} className="text-accent" />
      <h3 className="mt-4 font-display text-xl font-semibold text-foreground dark:text-white">No {label.toLowerCase()} yet</h3>
      <p className="mt-2 max-w-sm text-[13px] text-muted-foreground dark:text-white/60">
        This section is on the way. Explore the rest of the gallery while we craft it.
      </p>
      <Link
        to="/elements"
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-[13px] font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5"
      >
        Browse all elements
      </Link>
    </div>
  );
}

function NoResults({ q }: { q: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-subtle/40 p-10 text-center dark:border-white/10 dark:bg-white/[0.02]">
      <SearchIcon size={22} className="text-accent" />
      <h3 className="mt-4 font-display text-xl font-semibold text-foreground dark:text-white">No matches</h3>
      <p className="mt-2 max-w-sm text-[13px] text-muted-foreground dark:text-white/60">
        {q ? <>Nothing matches “{q}”. Try a different query or clear filters.</> : "Try a different filter."}
      </p>
    </div>
  );
}


function ElementsHeader() {
  const [q, setQ] = useState("");
  const { resolvedTheme, toggle } = useTheme();
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-xl shadow-xs dark:border-white/8 dark:bg-[#050505]/80">
      <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between px-6 lg:px-8">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-[21px] font-bold tracking-tight text-foreground dark:text-white">
              novix<span className="text-accent">ui</span>
            </span>
          </Link>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-border bg-subtle/60 px-3 py-1.5 md:flex focus-within:border-accent focus-within:bg-background dark:border-white/10 dark:bg-white/[0.03]">
          <SearchIcon size={13} className="text-muted-foreground dark:text-white/50" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search elements"
            className="w-72 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none dark:text-white dark:placeholder:text-white/40"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <IconButton
            aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "night"} mode`}
            onClick={toggle}
            variant="ghost"
            icon={resolvedTheme === "dark" ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-indigo-600" />}
            className="border border-border bg-subtle/80 text-foreground hover:bg-muted dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
          />
          <Badge variant="outline" size="sm" className="hidden sm:inline-flex border-border text-foreground font-medium">
            v2.4
          </Badge>
        </div>
      </div>
    </header>
  );
}

/* ---------- Progressive Loading Hook for high-performance instant gallery rendering ---------- */
function useProgressiveItems<T>(items: T[], limit?: number, pageSize: number = 24) {
  const [count, setCount] = useState(limit ?? pageSize);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setCount(limit ?? pageSize);
  }, [limit, items.length, pageSize]);

  useEffect(() => {
    if (limit || count >= items.length) return;
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setCount((c) => Math.min(c + pageSize, items.length));
        }
      },
      { rootMargin: "600px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [limit, count, items.length, pageSize]);

  const visibleItems = limit ? items.slice(0, limit) : items.slice(0, count);
  const hasMore = !limit && count < items.length;
  const loadMore = () => setCount((c) => Math.min(c + pageSize, items.length));

  return { visibleItems, hasMore, loadMore, sentinelRef, total: items.length };
}

/* ---------- Buttons Gallery (100 3D premium buttons + code modal) ---------- */
function ButtonsGallery({
  q,
  sort,
  mosaic,
  deepLinkId,
  onClearDeepLink,
  limit,
}: {
  q: string;
  sort: SortKey;
  mosaic?: ReactNode;
  deepLinkId?: string;
  onClearDeepLink?: () => void;
  limit?: number;
}) {
  const [open, setOpen] = useState<ButtonItem | null>(null);
  const items = useMemo(() => applyFilterSort(BUTTONS, q, sort, "button"), [q, sort]);
  useDeepLink(BUTTONS, deepLinkId, setOpen);
  const { visibleItems, hasMore, loadMore, sentinelRef, total } = useProgressiveItems(items, limit);

  if (items.length === 0) return <NoResults q={q} />;
  return (
    <>
      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
        {mosaic}
        {visibleItems.map((b, i) => (
          <TiltWrap key={b.id} index={i}>
            <ButtonCard item={b} onOpen={() => setOpen(b)} />
          </TiltWrap>
        ))}
      </div>
      {hasMore && (
        <div className="mt-8 flex flex-col items-center justify-center gap-2">
          <div ref={sentinelRef} className="h-4 w-full" />
          <button
            type="button"
            onClick={loadMore}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-subtle/80 px-5 py-2 text-xs font-medium text-foreground transition-all hover:bg-muted hover:border-border-strong active:scale-95 shadow-xs"
          >
            <span>Load more buttons</span>
            <span className="text-[11px] text-muted-foreground">({visibleItems.length} of {total})</span>
          </button>
        </div>
      )}
      {open && (
        <CodeModal
          item={open}
          shareCategory="Buttons"
          preview={<ButtonCard item={open} onOpen={() => undefined} />}
          onClose={() => {
            setOpen(null);
            onClearDeepLink?.();
          }}
        />
      )}
    </>
  );
}

/* ---------- Checkboxes Gallery ---------- */
function CheckboxesGallery({
  q,
  sort,
  mosaic,
  deepLinkId,
  onClearDeepLink,
  limit,
}: {
  q: string;
  sort: SortKey;
  mosaic?: ReactNode;
  deepLinkId?: string;
  onClearDeepLink?: () => void;
  limit?: number;
}) {
  const [open, setOpen] = useState<CheckboxItem | null>(null);
  const items = useMemo(() => applyFilterSort(CHECKBOXES, q, sort, "checkbox"), [q, sort]);
  useDeepLink(CHECKBOXES, deepLinkId, setOpen);
  const { visibleItems, hasMore, loadMore, sentinelRef, total } = useProgressiveItems(items, limit);

  if (items.length === 0) return <NoResults q={q} />;
  return (
    <>
      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
        {mosaic}
        {visibleItems.map((c, i) => (
          <TiltWrap key={c.id} index={i}>
            <CheckboxCard item={c} onOpen={() => setOpen(c)} />
          </TiltWrap>
        ))}
      </div>
      {hasMore && (
        <div className="mt-8 flex flex-col items-center justify-center gap-2">
          <div ref={sentinelRef} className="h-4 w-full" />
          <button
            type="button"
            onClick={loadMore}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-subtle/80 px-5 py-2 text-xs font-medium text-foreground transition-all hover:bg-muted hover:border-border-strong active:scale-95 shadow-xs"
          >
            <span>Load more checkboxes</span>
            <span className="text-[11px] text-muted-foreground">({visibleItems.length} of {total})</span>
          </button>
        </div>
      )}
      {open && (
        <CodeModal
          item={open}
          shareCategory="Checkboxes"
          hostAttr="data-cb-hover-host"
          preview={<CheckboxCard item={open} onOpen={() => undefined} />}
          onClose={() => {
            setOpen(null);
            onClearDeepLink?.();
          }}
        />
      )}
    </>
  );
}

function CheckboxCard({ item, onOpen }: { item: CheckboxItem; onOpen: () => void }) {
  return (
    <div
      data-cb-hover-host
      className={[
        "nova-cb-tile group relative flex h-72 flex-col overflow-hidden",
        "rounded-2xl border border-white/8 bg-gradient-to-b from-[#0f0f10] to-[#050505]",
        "shadow-[0_14px_40px_-18px_rgba(0,0,0,0.7)]",
        "transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "hover:-translate-y-0.5 hover:border-white/15 [&:hover_[role=tooltip]]:opacity-100",
      ].join(" ")}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-20 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100 motion-reduce:hidden"
        style={{
          background:
            "radial-gradient(40% 40% at 50% 45%, color-mix(in oklab, var(--accent) 35%, transparent), transparent 70%)",
        }}
      />
      <div className="relative flex flex-1 items-center justify-center px-6 py-8">
        {item.render()}
      </div>
      <div className="flex items-center justify-between border-t border-white/8 bg-white/[0.02] px-4 py-2.5">
        <span className="truncate text-[12px] font-medium text-white/70">{item.name}</span>
        <div className="flex items-center gap-1.5 opacity-0 transition-all duration-300 group-hover:opacity-100 focus-within:opacity-100">
          <button
            type="button"
            onClick={onOpen}
            aria-label={`${item.name} — customize`}
            className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-accent/15 px-2 py-1 text-[10.5px] font-medium text-accent hover:bg-accent/25 hover:text-white transition-colors"
          >
            <Sliders size={11} aria-hidden /> Customize
          </button>
          <button
            type="button"
            onClick={onOpen}
            aria-label={`${item.name} — view code`}
            className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-white/[0.06] px-2 py-1 text-[10.5px] font-mono text-white/70 hover:bg-white/[0.12] hover:text-white transition-colors"
          >
            {"</>"} Code
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Toggles Gallery ---------- */
function TogglesGallery({
  q,
  sort,
  mosaic,
  deepLinkId,
  onClearDeepLink,
  limit,
}: {
  q: string;
  sort: SortKey;
  mosaic?: ReactNode;
  deepLinkId?: string;
  onClearDeepLink?: () => void;
  limit?: number;
}) {
  const [open, setOpen] = useState<ToggleItem | null>(null);
  const items = useMemo(() => applyFilterSort(TOGGLES, q, sort, "toggle"), [q, sort]);
  useDeepLink(TOGGLES, deepLinkId, setOpen);
  const { visibleItems, hasMore, loadMore, sentinelRef, total } = useProgressiveItems(items, limit);

  if (items.length === 0) return <NoResults q={q} />;
  return (
    <>
      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
        {mosaic}
        {visibleItems.map((t, i) => (
          <TiltWrap key={t.id} index={i}>
            <ToggleCard item={t} onOpen={() => setOpen(t)} />
          </TiltWrap>
        ))}
      </div>
      {hasMore && (
        <div className="mt-8 flex flex-col items-center justify-center gap-2">
          <div ref={sentinelRef} className="h-4 w-full" />
          <button
            type="button"
            onClick={loadMore}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-subtle/80 px-5 py-2 text-xs font-medium text-foreground transition-all hover:bg-muted hover:border-border-strong active:scale-95 shadow-xs"
          >
            <span>Load more toggles</span>
            <span className="text-[11px] text-muted-foreground">({visibleItems.length} of {total})</span>
          </button>
        </div>
      )}
      {open && (
        <CodeModal
          item={open}
          shareCategory="Toggles"
          hostAttr="data-tg-hover-host"
          preview={<ToggleCard item={open} onOpen={() => undefined} />}
          onClose={() => {
            setOpen(null);
            onClearDeepLink?.();
          }}
        />
      )}
    </>
  );
}

function ToggleCard({ item, onOpen }: { item: ToggleItem; onOpen: () => void }) {
  return (
    <div
      data-tg-hover-host
      className={[
        "nova-tg-tile group relative flex h-72 flex-col overflow-hidden",
        "rounded-2xl border border-white/8 bg-gradient-to-b from-[#0f0f10] to-[#050505]",
        "shadow-[0_14px_40px_-18px_rgba(0,0,0,0.7)]",
        "transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "hover:-translate-y-0.5 hover:border-white/15",
      ].join(" ")}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-20 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100 motion-reduce:hidden"
        style={{
          background:
            "radial-gradient(40% 40% at 50% 45%, color-mix(in oklab, var(--accent) 35%, transparent), transparent 70%)",
        }}
      />
      <div className="relative flex flex-1 items-center justify-center px-6 py-8">
        {item.render()}
      </div>
      <div className="flex items-center justify-between border-t border-white/8 bg-white/[0.02] px-4 py-2.5">
        <span className="truncate text-[12px] font-medium text-white/70">{item.name}</span>
        <div className="flex items-center gap-1.5 opacity-0 transition-all duration-300 group-hover:opacity-100 focus-within:opacity-100">
          <button
            type="button"
            onClick={onOpen}
            aria-label={`${item.name} — customize`}
            className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-accent/15 px-2 py-1 text-[10.5px] font-medium text-accent hover:bg-accent/25 hover:text-white transition-colors"
          >
            <Sliders size={11} aria-hidden /> Customize
          </button>
          <button
            type="button"
            onClick={onOpen}
            aria-label={`${item.name} — view code`}
            className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-white/[0.06] px-2 py-1 text-[10.5px] font-mono text-white/70 hover:bg-white/[0.12] hover:text-white transition-colors"
          >
            {"</>"} Code
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Shared MiniGallery for Loaders / Radios / Tooltips / Inputs ---------- */
type MiniItem = { id: string; name: string; render: () => ReactNode; code: string };
function MiniGallery({
  items,
  hostAttr,
  q,
  sort,
  mosaic,
  categoryKey,
  deepLinkId,
  onClearDeepLink,
  shareCategory,
  limit,
}: {
  items: MiniItem[];
  hostAttr: string;
  q: string;
  sort: SortKey;
  mosaic?: ReactNode;
  categoryKey?: string;
  deepLinkId?: string;
  onClearDeepLink?: () => void;
  shareCategory?: string;
  limit?: number;
}) {
  const [open, setOpen] = useState<MiniItem | null>(null);
  const filtered = useMemo(() => applyFilterSort(items, q, sort, categoryKey), [items, q, sort, categoryKey]);
  useDeepLink(items, deepLinkId, setOpen);
  const { visibleItems, hasMore, loadMore, sentinelRef, total } = useProgressiveItems(filtered, limit);

  if (filtered.length === 0) return <NoResults q={q} />;
  return (
    <>
      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
        {mosaic}
        {visibleItems.map((it, i) => (
          <TiltWrap key={it.id} index={i}>
            <MiniTile item={it} hostAttr={hostAttr} onOpen={() => setOpen(it)} />
          </TiltWrap>
        ))}
      </div>
      {hasMore && (
        <div className="mt-8 flex flex-col items-center justify-center gap-2">
          <div ref={sentinelRef} className="h-4 w-full" />
          <button
            type="button"
            onClick={loadMore}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-subtle/80 px-5 py-2 text-xs font-medium text-foreground transition-all hover:bg-muted hover:border-border-strong active:scale-95 shadow-xs"
          >
            <span>Load more elements</span>
            <span className="text-[11px] text-muted-foreground">({visibleItems.length} of {total})</span>
          </button>
        </div>
      )}
      {open && (
        <CodeModal
          item={open}
          shareCategory={shareCategory}
          hostAttr={hostAttr}
          preview={<MiniTile item={open} hostAttr={hostAttr} onOpen={() => undefined} />}
          onClose={() => {
            setOpen(null);
            onClearDeepLink?.();
          }}
        />
      )}
    </>
  );
}

/* ---------- UI Kits Gallery (large 2-col tiles) ---------- */
function KitsGallery({
  q,
  sort,
  mosaic,
  deepLinkId,
  onClearDeepLink,
  limit,
}: {
  q: string;
  sort: SortKey;
  mosaic?: ReactNode;
  deepLinkId?: string;
  onClearDeepLink?: () => void;
  limit?: number;
}) {
  const [open, setOpen] = useState<KitItem | null>(null);
  const items = useMemo(() => applyFilterSort(KITS, q, sort, "kit"), [q, sort]);
  useDeepLink(KITS, deepLinkId, setOpen);
  const { visibleItems, hasMore, loadMore, sentinelRef, total } = useProgressiveItems(items, limit, 12);

  if (items.length === 0) return <NoResults q={q} />;
  return (
    <>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {mosaic}
        {visibleItems.map((k, i) => (
          <TiltWrap key={k.id} index={i}>
            <KitCard item={k} onOpen={() => setOpen(k)} />
          </TiltWrap>
        ))}
      </div>
      {hasMore && (
        <div className="mt-8 flex flex-col items-center justify-center gap-2">
          <div ref={sentinelRef} className="h-4 w-full" />
          <button
            type="button"
            onClick={loadMore}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-subtle/80 px-5 py-2 text-xs font-medium text-foreground transition-all hover:bg-muted hover:border-border-strong active:scale-95 shadow-xs"
          >
            <span>Load more UI Kits</span>
            <span className="text-[11px] text-muted-foreground">({visibleItems.length} of {total})</span>
          </button>
        </div>
      )}
      {open && (
        <CodeModal
          item={open}
          shareCategory="UI Kits"
          hostAttr="data-kt-hover-host"
          preview={<KitCard item={open} onOpen={() => undefined} />}
          onClose={() => {
            setOpen(null);
            onClearDeepLink?.();
          }}
        />
      )}
    </>
  );
}

function KitCard({ item, onOpen }: { item: KitItem; onOpen: () => void }) {
  return (
    <div
      data-kt-hover-host
      className={[
        "group relative flex h-[420px] flex-col overflow-hidden",
        "rounded-3xl border border-white/8 bg-gradient-to-b from-[#0f0f10] to-[#050505]",
        "shadow-[0_30px_70px_-30px_rgba(0,0,0,0.9)]",
        "transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "hover:-translate-y-1 hover:border-white/20",
      ].join(" ")}
    >
      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      <div className="relative flex-1 overflow-hidden">{item.render()}</div>
      <div className="flex items-center justify-between border-t border-white/8 bg-white/[0.02] px-5 py-3">
        <div className="min-w-0">
          <div data-kt-title className="truncate text-[13px] font-semibold text-white">{item.name}</div>
          <div className="truncate text-[11px] text-white/50">{item.tagline}</div>
        </div>
        <div className="flex items-center gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100 focus-within:opacity-100">
          <button
            type="button"
            onClick={onOpen}
            aria-label={`${item.name} — customize kit`}
            className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-accent/15 px-2.5 py-1.5 text-[11px] font-medium text-accent hover:bg-accent/25 hover:text-white transition-colors"
          >
            <Sliders size={11} aria-hidden /> Customize
          </button>
          <button
            type="button"
            onClick={onOpen}
            aria-label={`${item.name} — view code`}
            className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-white/[0.06] px-2.5 py-1.5 text-[11px] font-mono text-white/70 hover:bg-white/[0.12] hover:text-white transition-colors"
          >
            {"</>"} Code
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- All: render every gallery stacked ---------- */
function AllGalleries({
  q,
  sort,
  onJump,
}: {
  q: string;
  sort: SortKey;
  onJump: (cat: SidebarKey) => void;
}) {
  const sections: {
    key: SidebarKey;
    title: string;
    node: ReactNode;
    total: number;
  }[] = [
    { key: "UI Kits", title: "UI Kits", total: KITS.length, node: <KitsGallery q={q} sort={sort} limit={4} /> },
    { key: "Buttons", title: "Buttons", total: BUTTONS.length, node: <ButtonsGallery q={q} sort={sort} limit={8} /> },
    { key: "Checkboxes", title: "Checkboxes", total: CHECKBOXES.length, node: <CheckboxesGallery q={q} sort={sort} limit={8} /> },
    { key: "Toggles", title: "Toggles", total: TOGGLES.length, node: <TogglesGallery q={q} sort={sort} limit={8} /> },
    { key: "Cards", title: "Cards", total: CARDS.length, node: <MiniGallery items={CARDS} hostAttr="data-cd-hover-host" categoryKey="card" q={q} sort={sort} limit={8} /> },
    { key: "Loaders", title: "Loaders", total: LOADERS.length, node: <MiniGallery items={LOADERS} hostAttr="data-ld-hover-host" categoryKey="loader" q={q} sort={sort} limit={8} /> },
    { key: "Radio buttons", title: "Radio buttons", total: RADIOS.length, node: <MiniGallery items={RADIOS} hostAttr="data-rd-hover-host" categoryKey="radio" q={q} sort={sort} limit={8} /> },
    { key: "Tooltips", title: "Tooltips", total: TOOLTIPS.length, node: <MiniGallery items={TOOLTIPS} hostAttr="data-tp-hover-host" categoryKey="tooltip" q={q} sort={sort} limit={8} /> },
    { key: "Inputs", title: "Inputs", total: INPUTS.length, node: <MiniGallery items={INPUTS} hostAttr="data-in-hover-host" categoryKey="input" q={q} sort={sort} limit={8} /> },
    { key: "Forms", title: "Forms", total: FORMS.length, node: <MiniGallery items={FORMS} hostAttr="data-fm-hover-host" categoryKey="form" q={q} sort={sort} limit={8} /> },
    { key: "Patterns", title: "Patterns", total: PATTERNS.length, node: <MiniGallery items={PATTERNS} hostAttr="data-pt-hover-host" categoryKey="pattern" q={q} sort={sort} limit={8} /> },
  ];

  return (
    <div className="space-y-14">
      {sections.map((s) => (
        <section key={s.key} aria-labelledby={`sec-${s.key}`}>
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <h2
                id={`sec-${s.key}`}
                className="font-display text-2xl font-semibold tracking-[-0.02em] text-foreground"
              >
                {s.title}
                <span className="ml-2 align-middle text-[12px] font-medium tabular-nums text-muted-foreground/80 dark:text-white/40">
                  {s.total}
                </span>
              </h2>
            </div>
            <button
              onClick={() => onJump(s.key)}
              className="rounded-full border border-border bg-subtle/60 px-3 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground dark:border-white/10 dark:bg-white/[0.03] dark:text-white/70 dark:hover:border-white/20 dark:hover:text-white"
            >
              View all →
            </button>
          </div>
          {s.node}
        </section>
      ))}
    </div>
  );
}

function MiniTile({ item, hostAttr, onOpen }: { item: MiniItem; hostAttr: string; onOpen: () => void }) {
  const hostProps: Record<string, string> = { [hostAttr]: "" };
  return (
    <div
      {...hostProps}
      className={[
        "group relative flex h-72 flex-col overflow-hidden",
        "rounded-2xl border border-white/8 bg-gradient-to-b from-[#0f0f10] to-[#050505]",
        "shadow-[0_14px_40px_-18px_rgba(0,0,0,0.7)]",
        "transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "hover:-translate-y-0.5 hover:border-white/15",
      ].join(" ")}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-20 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100 motion-reduce:hidden"
        style={{
          background:
            "radial-gradient(40% 40% at 50% 45%, color-mix(in oklab, var(--accent) 35%, transparent), transparent 70%)",
        }}
      />
      <div className="relative flex flex-1 items-center justify-center px-6 py-8">
        {item.render()}
      </div>
      <div className="flex items-center justify-between border-t border-white/8 bg-white/[0.02] px-4 py-2.5">
        <span className="truncate text-[12px] font-medium text-white/70">{item.name}</span>
        <div className="flex items-center gap-1.5 opacity-0 transition-all duration-300 group-hover:opacity-100 focus-within:opacity-100">
          <button
            type="button"
            onClick={onOpen}
            aria-label={`${item.name} — customize`}
            className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-accent/15 px-2 py-1 text-[10.5px] font-medium text-accent hover:bg-accent/25 hover:text-white transition-colors"
          >
            <Sliders size={11} aria-hidden /> Customize
          </button>
          <button
            type="button"
            onClick={onOpen}
            aria-label={`${item.name} — view code`}
            className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-white/[0.06] px-2 py-1 text-[10.5px] font-mono text-white/70 hover:bg-white/[0.12] hover:text-white transition-colors"
          >
            {"</>"} Code
          </button>
        </div>
      </div>
    </div>
  );
}




function ButtonCard({ item, onOpen }: { item: ButtonItem; onOpen: () => void }) {
  const variant = useMemo(
    () => getVariant(item.id, item.styleKey, item.hue),
    [item.id, item.styleKey, item.hue],
  );
  const cssVars = useMemo(() => variantToCssVars(variant), [variant]);

  return (
    <div
      style={{ perspective: "var(--nova-perspective)", ...cssVars }}
      className={[
        "nova-btn-tile group relative flex h-72 flex-col overflow-hidden",
        "rounded-2xl border border-white/8 bg-gradient-to-b from-[#0f0f10] to-[#050505]",
        "shadow-[0_14px_40px_-18px_rgba(0,0,0,0.7)]",
        "transition-[transform,box-shadow,border-color] duration-[var(--nova-duration)] [transition-timing-function:var(--nova-ease)]",
        "hover:[transform:translateY(var(--nova-lift-y))] hover:border-white/15",
        "hover:shadow-[0_var(--nova-shadow-y)_var(--nova-shadow-spread)_-24px_color-mix(in_oklab,var(--accent)_var(--nova-halo-mix),transparent)]",
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
      ].join(" ")}
    >
      {/* moon-edge top highlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
      />
      {/* ambient halo — hue mix + blur vary per button */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-24 opacity-0 transition-opacity duration-700 group-hover:opacity-100 motion-reduce:hidden"
        style={{
          filter: "blur(var(--nova-halo-blur))",
          background:
            "radial-gradient(40% 40% at 50% 40%, color-mix(in oklab, var(--accent) var(--nova-halo-mix), transparent), transparent 70%)",
        }}
      />
      {/* preview area — per-button 3D tilt, timing, origin */}
      <div className="relative flex flex-1 items-center justify-center px-6 py-8">
        <div
          className={[
            "nova-btn-tile-stage will-change-transform",
            "transition-transform duration-[var(--nova-duration)] [transition-timing-function:var(--nova-ease)]",
            "group-hover:[transform:rotateX(var(--nova-rotx))_rotateY(var(--nova-roty))_translateZ(var(--nova-z))_scale(var(--nova-scale))]",
            "motion-reduce:transition-none motion-reduce:group-hover:[transform:none]",
          ].join(" ")}
          style={{ transformStyle: "preserve-3d", transformOrigin: "var(--nova-origin)" }}
        >
          {item.render()}
        </div>
      </div>

      {/* meta bar */}
      <div className="flex items-center justify-between border-t border-white/8 bg-white/[0.02] px-4 py-2.5">
        <span className="truncate text-[12px] font-medium text-white/70">{item.name}</span>
        <div className="flex items-center gap-1.5 opacity-0 transition-all duration-300 group-hover:opacity-100 focus-within:opacity-100">
          <button
            type="button"
            onClick={onOpen}
            aria-label={`${item.name} — customize button`}
            className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-accent/15 px-2 py-1 text-[10.5px] font-medium text-accent hover:bg-accent/25 hover:text-white transition-colors"
          >
            <Sliders size={11} aria-hidden /> Customize
          </button>
          <button
            type="button"
            onClick={onOpen}
            aria-label={`${item.name} — view code`}
            className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-white/[0.06] px-2 py-1 text-[10.5px] font-mono text-white/70 hover:bg-white/[0.12] hover:text-white transition-colors"
          >
            {"</>"} Code
          </button>
        </div>
      </div>
    </div>
  );

}

/** Auto-open the CodeModal for the item whose id matches `deepLinkId`. */
function useDeepLink<T extends { id: string }>(
  items: T[],
  deepLinkId: string | undefined,
  setOpen: (item: T) => void,
) {
  useEffect(() => {
    if (!deepLinkId) return;
    const match = items.find((it) => it.id === deepLinkId);
    if (match) setOpen(match);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deepLinkId, items]);
}


