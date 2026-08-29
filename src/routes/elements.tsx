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
  ToggleRight,
  Waves,
  Filter,
} from "lucide-react";
import { Badge } from "@/nova";
import { CREATIONS, CreationTile, MOSAIC_TILES, type Category, type Creation } from "./index";
import { z } from "zod";

const elementsSearchSchema = z.object({
  category: z.string().default("All"),
  tag: z.enum(["All", "React", "CSS", "Tailwind"]).default("All"),
  q: z.string().default(""),
  sort: z.enum(["Featured", "Name A–Z", "Name Z–A", "Newest"]).default("Featured"),
  tile: z.string().default(""),
  item: z.string().default(""),
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


function ElementsPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const active = search.category as SidebarKey;
  const tag = search.tag;
  const q = search.q;
  const sort = search.sort;
  const itemId = search.item;

  const setSearch = (patch: Record<string, unknown>) =>
    navigate({ search: (p: Record<string, unknown>) => ({ ...p, ...patch }) });

  const clearItem = () => setSearch({ item: "" });

  // Chip toggles the query — click to filter, click again to clear.
  const toggleChip = (chip: string) =>
    setSearch({ q: q.trim().toLowerCase() === chip ? "" : chip });

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
                  search={(prev: Record<string, unknown>) => ({ ...prev, category: label })}
                  className={
                    "flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-[14px] transition-all duration-200 " +
                    (isActive
                      ? "bg-white/[0.06] text-white ring-1 ring-white/10"
                      : "text-white/70 hover:bg-white/[0.04] hover:text-white")
                  }
                >
                  <span className="flex items-center gap-3">
                    <Icon size={17} className={isActive ? "text-accent" : "text-white/60"} />
                    <span className="font-medium">{label}</span>
                  </span>
                  {badge ? (
                    <span className="text-[12px] font-semibold text-rose-400">{badge}</span>
                  ) : count !== undefined ? (
                    <span className="text-[12px] tabular-nums text-white/40">
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
          <header className="mb-6">
            <h1 className="font-display text-3xl font-semibold tracking-[-0.02em] md:text-4xl">
              {active === "All" ? "Browse all" : active}
            </h1>
            <p className="mt-2 text-[14px] text-white/60">
              Open-source UI elements crafted with React, CSS, and Tailwind.
            </p>
          </header>



          {/* Filter bar */}
          <div className="mb-8 flex flex-col gap-3 rounded-2xl border border-white/8 bg-white/[0.02] p-3 md:flex-row md:items-center md:justify-between">
            <div />

            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] text-white/60">
                <Filter size={12} />
                <span>Sort:</span>
                <select
                  value={sort}
                  onChange={(e) => setSearch({ sort: e.target.value as SortKey })}
                  className="cursor-pointer appearance-none bg-transparent text-white focus:outline-none"
                >
                  {SORTS.map((s) => (
                    <option key={s} value={s} className="bg-[#0f0f10]">{s}</option>
                  ))}
                </select>
              </label>
              <div className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] text-white/60 md:flex">
                <SearchIcon size={12} />
                <input
                  value={q}
                  onChange={(e) => setSearch({ q: e.target.value })}
                  placeholder="Search name or id…"
                  className="w-56 bg-transparent text-[12px] text-white placeholder:text-white/40 focus:outline-none"
                />
                {q && (
                  <button
                    onClick={() => setSearch({ q: "" })}
                    aria-label="Clear search"
                    className="text-white/40 transition-colors hover:text-white"
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

/* 3D tilt wrapper — subtle premium parallax */
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
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.5, delay: (index % 8) * 0.03, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: "1200px" }}
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
    </motion.div>
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
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] py-24 text-center">
      <Sparkles size={22} className="text-accent" />
      <h3 className="mt-4 font-display text-xl font-semibold">No {label.toLowerCase()} yet</h3>
      <p className="mt-2 max-w-sm text-[13px] text-white/55">
        This section is on the way. Explore the rest of the gallery while we craft it.
      </p>
      <Link
        to="/elements"
        search={{ category: "All", tag: "All", q: "" }}
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-[13px] font-semibold text-white transition-transform hover:-translate-y-0.5"
      >
        Browse all elements
      </Link>
    </div>
  );
}

function NoResults({ q }: { q: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">
      <SearchIcon size={22} className="text-accent" />
      <h3 className="mt-4 font-display text-xl font-semibold">No matches</h3>
      <p className="mt-2 max-w-sm text-[13px] text-white/55">
        {q ? <>Nothing matches “{q}”. Try a different query or clear filters.</> : "Try a different filter."}
      </p>
    </div>
  );
}


function ElementsHeader() {
  const [q, setQ] = useState("");
  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-background/70 backdrop-blur-xl dark:bg-[#050505]/70">
      <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 pl-1 md:pl-2">
          <span className="font-display text-[21px] font-bold tracking-tight">
            novix<span className="text-accent">ui</span>
          </span>
        </Link>
        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 md:flex">
          <SearchIcon size={13} className="text-white/50" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search elements"
            className="w-72 bg-transparent text-[13px] text-white placeholder:text-white/40 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-[13px] text-white/70 transition-colors hover:text-white"
          >
            Back to home
          </Link>
          <Badge variant="outline" size="sm" className="hidden sm:inline-flex">
            v2.4
          </Badge>
        </div>
      </div>
    </header>
  );
}

/* ---------- Buttons Gallery (100 3D premium buttons + code modal) ---------- */
function ButtonsGallery({ q, sort, mosaic, deepLinkId, onClearDeepLink }: { q: string; sort: SortKey; mosaic?: ReactNode; deepLinkId?: string; onClearDeepLink?: () => void }) {
  const [open, setOpen] = useState<ButtonItem | null>(null);
  const items = useMemo(() => applyFilterSort(BUTTONS, q, sort, "button"), [q, sort]);
  useDeepLink(BUTTONS, deepLinkId, setOpen);
  if (items.length === 0) return <NoResults q={q} />;
  return (
    <>
      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">{mosaic}
        {items.map((b, i) => (
          <TiltWrap key={b.id} index={i}>
            <ButtonCard item={b} onOpen={() => setOpen(b)} />
          </TiltWrap>
        ))}
      </div>
      {open && <CodeModal item={open} shareCategory="Buttons" preview={<ButtonCard item={open} onOpen={() => undefined} />} onClose={() => { setOpen(null); onClearDeepLink?.(); }} />}
    </>
  );
}

/* ---------- Checkboxes Gallery ---------- */
function CheckboxesGallery({ q, sort, mosaic, deepLinkId, onClearDeepLink }: { q: string; sort: SortKey; mosaic?: ReactNode; deepLinkId?: string; onClearDeepLink?: () => void }) {
  const [open, setOpen] = useState<CheckboxItem | null>(null);
  const items = useMemo(() => applyFilterSort(CHECKBOXES, q, sort, "checkbox"), [q, sort]);
  useDeepLink(CHECKBOXES, deepLinkId, setOpen);
  if (items.length === 0) return <NoResults q={q} />;
  return (
    <>
      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">{mosaic}
        {items.map((c, i) => (
          <TiltWrap key={c.id} index={i}>
            <CheckboxCard item={c} onOpen={() => setOpen(c)} />
          </TiltWrap>
        ))}
      </div>
      {open && <CodeModal item={open} shareCategory="Checkboxes" hostAttr="data-cb-hover-host" preview={<CheckboxCard item={open} onOpen={() => undefined} />} onClose={() => { setOpen(null); onClearDeepLink?.(); }} />}
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
        <button
          type="button"
          onClick={onOpen}
          aria-label={`${item.name} — view code`}
          className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-white/[0.06] px-2 py-1 text-[10.5px] font-mono text-white/60 opacity-0 transition-all duration-300 hover:bg-white/[0.12] hover:text-white focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 group-hover:opacity-100"
        >
          {"</>"} Get code
        </button>
      </div>
    </div>
  );
}

/* ---------- Toggles Gallery ---------- */
function TogglesGallery({ q, sort, mosaic, deepLinkId, onClearDeepLink }: { q: string; sort: SortKey; mosaic?: ReactNode; deepLinkId?: string; onClearDeepLink?: () => void }) {
  const [open, setOpen] = useState<ToggleItem | null>(null);
  const items = useMemo(() => applyFilterSort(TOGGLES, q, sort, "toggle"), [q, sort]);
  useDeepLink(TOGGLES, deepLinkId, setOpen);
  if (items.length === 0) return <NoResults q={q} />;
  return (
    <>
      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">{mosaic}
        {items.map((t, i) => (
          <TiltWrap key={t.id} index={i}>
            <ToggleCard item={t} onOpen={() => setOpen(t)} />
          </TiltWrap>
        ))}
      </div>
      {open && <CodeModal item={open} shareCategory="Toggles" hostAttr="data-tg-hover-host" preview={<ToggleCard item={open} onOpen={() => undefined} />} onClose={() => { setOpen(null); onClearDeepLink?.(); }} />}
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
        <button
          type="button"
          onClick={onOpen}
          aria-label={`${item.name} — view code`}
          className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-white/[0.06] px-2 py-1 text-[10.5px] font-mono text-white/60 opacity-0 transition-all duration-300 hover:bg-white/[0.12] hover:text-white focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 group-hover:opacity-100"
        >
          {"</>"} Get code
        </button>
      </div>
    </div>
  );
}

/* ---------- Shared MiniGallery for Loaders / Radios / Tooltips / Inputs ---------- */
type MiniItem = { id: string; name: string; render: () => ReactNode; code: string };
function MiniGallery({ items, hostAttr, q, sort, mosaic, categoryKey, deepLinkId, onClearDeepLink, shareCategory }: { items: MiniItem[]; hostAttr: string; q: string; sort: SortKey; mosaic?: ReactNode; categoryKey?: string; deepLinkId?: string; onClearDeepLink?: () => void; shareCategory?: string }) {
  const [open, setOpen] = useState<MiniItem | null>(null);
  const filtered = useMemo(() => applyFilterSort(items, q, sort, categoryKey), [items, q, sort, categoryKey]);
  useDeepLink(items, deepLinkId, setOpen);

  if (filtered.length === 0) return <NoResults q={q} />;
  return (
    <>
      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">{mosaic}
        {filtered.map((it, i) => (
          <TiltWrap key={it.id} index={i}>
            <MiniTile item={it} hostAttr={hostAttr} onOpen={() => setOpen(it)} />
          </TiltWrap>
        ))}
      </div>
      {open && <CodeModal item={open} shareCategory={shareCategory} hostAttr={hostAttr} preview={<MiniTile item={open} hostAttr={hostAttr} onOpen={() => undefined} />} onClose={() => { setOpen(null); onClearDeepLink?.(); }} />}
    </>
  );
}

/* ---------- UI Kits Gallery (large 2-col tiles) ---------- */
function KitsGallery({ q, sort, mosaic, deepLinkId, onClearDeepLink }: { q: string; sort: SortKey; mosaic?: ReactNode; deepLinkId?: string; onClearDeepLink?: () => void }) {
  const [open, setOpen] = useState<KitItem | null>(null);
  const items = useMemo(() => applyFilterSort(KITS, q, sort, "kit"), [q, sort]);
  useDeepLink(KITS, deepLinkId, setOpen);
  if (items.length === 0) return <NoResults q={q} />;
  return (
    <>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">{mosaic}
        {items.map((k, i) => (
          <TiltWrap key={k.id} index={i}>
            <KitCard item={k} onOpen={() => setOpen(k)} />
          </TiltWrap>
        ))}
      </div>
      {open && <CodeModal item={open} shareCategory="UI Kits" hostAttr="data-kt-hover-host" preview={<KitCard item={open} onOpen={() => undefined} />} onClose={() => { setOpen(null); onClearDeepLink?.(); }} />}
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
          <div className="truncate text-[13px] font-semibold text-white">{item.name}</div>
          <div className="truncate text-[11px] text-white/50">{item.tagline}</div>
        </div>
        <button
          type="button"
          onClick={onOpen}
          aria-label={`${item.name} — view code`}
          className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-white/[0.06] px-2.5 py-1.5 text-[11px] font-mono text-white/70 opacity-0 transition-all duration-300 hover:bg-white/[0.12] hover:text-white focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 group-hover:opacity-100"
        >
          {"</>"} Get code
        </button>
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
    { key: "UI Kits", title: "UI Kits", total: KITS.length, node: <KitsGallery q={q} sort={sort} /> },
    { key: "Buttons", title: "Buttons", total: BUTTONS.length, node: <ButtonsGallery q={q} sort={sort} /> },
    { key: "Checkboxes", title: "Checkboxes", total: CHECKBOXES.length, node: <CheckboxesGallery q={q} sort={sort} /> },
    { key: "Toggles", title: "Toggles", total: TOGGLES.length, node: <TogglesGallery q={q} sort={sort} /> },
    { key: "Cards", title: "Cards", total: CARDS.length, node: <MiniGallery items={CARDS} hostAttr="data-cd-hover-host" categoryKey="card" q={q} sort={sort} /> },
    { key: "Loaders", title: "Loaders", total: LOADERS.length, node: <MiniGallery items={LOADERS} hostAttr="data-ld-hover-host" categoryKey="loader" q={q} sort={sort} /> },
    { key: "Radio buttons", title: "Radio buttons", total: RADIOS.length, node: <MiniGallery items={RADIOS} hostAttr="data-rd-hover-host" categoryKey="radio" q={q} sort={sort} /> },
    { key: "Tooltips", title: "Tooltips", total: TOOLTIPS.length, node: <MiniGallery items={TOOLTIPS} hostAttr="data-tp-hover-host" categoryKey="tooltip" q={q} sort={sort} /> },
    { key: "Inputs", title: "Inputs", total: INPUTS.length, node: <MiniGallery items={INPUTS} hostAttr="data-in-hover-host" categoryKey="input" q={q} sort={sort} /> },
    { key: "Forms", title: "Forms", total: FORMS.length, node: <MiniGallery items={FORMS} hostAttr="data-fm-hover-host" categoryKey="form" q={q} sort={sort} /> },
    { key: "Patterns", title: "Patterns", total: PATTERNS.length, node: <MiniGallery items={PATTERNS} hostAttr="data-pt-hover-host" categoryKey="pattern" q={q} sort={sort} /> },

  ];

  return (
    <div className="space-y-14">
      {sections.map((s) => (
        <section key={s.key} aria-labelledby={`sec-${s.key}`}>
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <h2
                id={`sec-${s.key}`}
                className="font-display text-2xl font-semibold tracking-[-0.02em]"
              >
                {s.title}
                <span className="ml-2 align-middle text-[12px] font-medium tabular-nums text-white/40">
                  {s.total}
                </span>
              </h2>
            </div>
            <button
              onClick={() => onJump(s.key)}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] text-white/70 transition-colors hover:border-white/20 hover:text-white"
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
        <button
          type="button"
          onClick={onOpen}
          aria-label={`${item.name} — view code`}
          className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-white/[0.06] px-2 py-1 text-[10.5px] font-mono text-white/70 transition-all duration-300 hover:bg-accent/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
        >
          {"</>"} Get code
        </button>
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
        <button
          type="button"
          onClick={onOpen}
          aria-label={`${item.name} — view code`}
          className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-white/[0.06] px-2 py-1 text-[10.5px] font-mono text-white/70 opacity-0 transition-all duration-300 hover:bg-white/[0.12] hover:text-white focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 group-hover:opacity-100"
        >
          {"</>"} Get code
        </button>
      </div>
    </div>
  );

}


export type CodeModalItem = { id: string; name: string; render: () => ReactNode; code: string };

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

export function CodeModal({ item, onClose, shareCategory, hostAttr, preview }: { item: CodeModalItem; onClose: () => void; shareCategory?: string; hostAttr?: string; preview?: ReactNode }) {
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [tab, setTab] = useState<"react" | "css">("react");
  const [light, setLight] = useState(false);
  const [saved, setSaved] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const previewFrameRef = useRef<HTMLDivElement | null>(null);
  const titleId = useMemo(() => `code-modal-title-${item.id}`, [item.id]);
  const prefersReducedMotion = useReducedMotion();

  // Many data files ship a placeholder `code` string that only points at the
  // source file. Detect that and regenerate real, copy-pasteable markup from
  // the rendered React tree so the code pane always matches the preview.
  const reactCode = useMemo(() => {
    const raw = (item.code ?? "").trim();
    const isPlaceholder =
      !raw ||
      /Full source (available )?in|See source:|no source available/i.test(raw);
    if (!isPlaceholder) return item.code;
    return extractSnippet({ name: item.name, render: item.render });
  }, [item.code, item.name, item.render]);

  useEffect(() => {
    if (!exportOpen) return;
    const onDown = (e: globalThis.MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) setExportOpen(false);
    };
    // Defer to next frame so the click that opened the menu doesn't immediately close it.
    const raf = requestAnimationFrame(() => document.addEventListener("mousedown", onDown));
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("mousedown", onDown);
    };
  }, [exportOpen]);

  const download = (kind: "react" | "css" | "html") => {
    const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const ext = kind === "react" ? "tsx" : kind === "css" ? "css" : "html";
    const body =
      kind === "html"
        ? `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8" />\n<title>${item.name} — Novix UI</title>\n<script src="https://cdn.tailwindcss.com"></script>\n</head>\n<body class="bg-neutral-950 min-h-screen grid place-items-center">\n<!-- ${item.name} -->\n${reactCode}\n</body>\n</html>\n`
        : (kind === "react" ? reactCode : source);
    const blob = new Blob([body], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug}.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setExportOpen(false);
  };

  // Escape handling + scroll lock + focus save/restore + Tab focus trap.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const getFocusable = (): HTMLElement[] => {
      const root = dialogRef.current;
      if (!root) return [];
      const nodes = root.querySelectorAll<HTMLElement>(
        'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])',
      );
      return Array.from(nodes).filter((el) => !el.hasAttribute("aria-hidden") && el.offsetParent !== null);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        if (exportOpen) {
          setExportOpen(false);
          return;
        }
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = getFocusable();
      if (focusables.length === 0) {
        e.preventDefault();
        dialogRef.current?.focus();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (active === first || !dialogRef.current?.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);

    // Body scroll lock: preserve scroll position, compensate for scrollbar
    // width to avoid layout shift, and prevent iOS rubber-band scrolling.
    const scrollY = window.scrollY;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const prev = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      width: document.body.style.width,
      paddingRight: document.body.style.paddingRight,
      htmlOverscroll: document.documentElement.style.overscrollBehavior,
    };
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.documentElement.style.overscrollBehavior = "none";

    // Initial focus MUST land on the Close button so Escape/Tab affordance is obvious.
    // Retry across a few frames in case the ref isn't committed yet (entrance
    // animation, conditional subtree). Fall back to the first focusable node
    // inside the dialog so focus never escapes to the page behind.
    let attempts = 0;
    let rafId = 0;
    let timeoutId: number | undefined;
    const focusClose = () => {
      const btn = closeBtnRef.current;
      if (btn && document.contains(btn)) {
        btn.focus();
        if (document.activeElement === btn) return;
      }
      if (attempts++ < 5) {
        rafId = requestAnimationFrame(focusClose);
        return;
      }
      // Last-resort fallback: first focusable inside the dialog.
      const dialog = dialogRef.current;
      if (dialog) {
        const [first] = getFocusable();
        first?.focus();
      }
    };
    rafId = requestAnimationFrame(focusClose);
    // Belt-and-suspenders: after entrance animation, ensure focus is inside.
    timeoutId = window.setTimeout(() => {
      const dialog = dialogRef.current;
      if (dialog && !dialog.contains(document.activeElement)) {
        closeBtnRef.current?.focus();
      }
    }, 200);

    return () => {
      cancelAnimationFrame(rafId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev.overflow;
      document.body.style.position = prev.position;
      document.body.style.top = prev.top;
      document.body.style.left = prev.left;
      document.body.style.right = prev.right;
      document.body.style.width = prev.width;
      document.body.style.paddingRight = prev.paddingRight;
      document.documentElement.style.overscrollBehavior = prev.htmlOverscroll;
      window.scrollTo(0, scrollY);
      // Restore focus to whatever opened the modal.
      previouslyFocused?.focus?.();
    };
  }, [onClose, exportOpen]);


  // Fake but consistent stats per item (stable across renders)
  const stats = useMemo(() => {
    let h = 0;
    for (let i = 0; i < item.id.length; i++) h = (h * 31 + item.id.charCodeAt(i)) >>> 0;
    const views = 4 + (h % 42); // 4K–45K
    const saves = 1 + ((h >> 5) % 6); // 1K–6K
    return { views: `${views}K`, saves: `${saves}K` };
  }, [item.id]);

  const cssSnippet =
    `/* ${item.name} — Novix UI\n * Wire-up hint: this component uses Tailwind utilities and inline styles.\n * The .tsx tab has the full source you can drop into your project.\n */\n.nova-btn {\n  position: relative;\n  isolation: isolate;\n  border-radius: 12px;\n  transition: transform .2s cubic-bezier(0.16,1,0.3,1),\n              box-shadow .3s ease;\n}\n.nova-btn:hover  { transform: translateY(-1px); }\n.nova-btn:active { transform: translateY(1px); }\n@media (prefers-reduced-motion: reduce) {\n  .nova-btn { transition: none; transform: none !important; }\n}`;

  const source = tab === "react" ? reactCode : cssSnippet;

  const naturalPreviewSize = useMemo(
    () => (hostAttr === "data-kt-hover-host" ? { width: 720, height: 420 } : { width: 420, height: 288 }),
    [hostAttr],
  );
  const [previewScale, setPreviewScale] = useState(1);

  useEffect(() => {
    const frame = previewFrameRef.current;
    if (!frame) return;

    const updateScale = () => {
      const styles = window.getComputedStyle(frame);
      const horizontalPadding = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
      const verticalPadding = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
      const availableWidth = Math.max(1, frame.clientWidth - horizontalPadding);
      const availableHeight = Math.max(1, frame.clientHeight - verticalPadding);
      const nextScale = Math.min(
        1,
        availableWidth / naturalPreviewSize.width,
        availableHeight / naturalPreviewSize.height,
      );
      setPreviewScale(Number.isFinite(nextScale) ? nextScale : 1);
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(frame);
    window.addEventListener("resize", updateScale);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, [naturalPreviewSize.height, naturalPreviewSize.width]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(source);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {}
  };

  if (typeof document === "undefined") return null;
  return createPortal(
    <div
      className={`fixed inset-0 z-[100] grid place-items-center overflow-y-auto overscroll-contain bg-background/70 p-3 backdrop-blur-xl sm:p-6 ${prefersReducedMotion ? "" : "animate-in fade-in duration-200"}`}
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="nova-glass relative flex max-h-[calc(100dvh-1.5rem)] w-[min(100%,88rem)] min-w-0 flex-col overflow-hidden rounded-2xl border border-border/70 bg-background text-foreground shadow-[0_40px_120px_-20px_color-mix(in_oklab,var(--foreground)_35%,transparent)] focus:outline-none sm:max-h-[calc(100dvh-3rem)]"
        style={prefersReducedMotion ? undefined : { animation: "nova-modal-in .3s cubic-bezier(0.16,1,0.3,1) both" }}
      >
        <h2 id={titleId} className="sr-only">{item.name} — code and preview</h2>
        {/* Header */}
        <div className="grid shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border/60 px-4 py-3 sm:flex sm:flex-wrap sm:justify-between sm:px-5">
          <button
            onClick={onClose}
            className="inline-flex min-w-0 items-center gap-2 rounded-md px-2 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-subtle hover:text-foreground"
          >
            <span aria-hidden>←</span> Go back
          </button>
          <div className="flex shrink-0 items-center gap-2 text-[12px] text-muted-foreground sm:gap-4">
            <div className="hidden items-center gap-2 sm:flex">
              <span className="text-muted-foreground/80">Element by</span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
                <span
                  aria-hidden
                  className="grid size-5 place-items-center rounded-md text-[10px] font-bold text-white"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#ec4899)" }}
                >
                  N
                </span>
                novix-ui
              </span>
            </div>
            <span className="inline-flex items-center gap-1">
              <span aria-hidden>👁</span> {stats.views}
            </span>
            <button
              onClick={() => setSaved((s) => !s)}
              className={`inline-flex items-center gap-1 transition-colors ${saved ? "text-fuchsia-400" : "hover:text-foreground"}`}
              aria-pressed={saved}
              aria-label="Save to favorites"
            >
              <span aria-hidden>{saved ? "★" : "☆"}</span> {stats.saves}
            </button>
            {shareCategory && (
              <button
                onClick={async () => {
                  try {
                    const url = new URL(window.location.href);
                    url.pathname = "/elements";
                    url.search = "";
                    url.searchParams.set("category", shareCategory);
                    url.searchParams.set("item", item.id);
                    await navigator.clipboard.writeText(url.toString());
                    setLinkCopied(true);
                    setTimeout(() => setLinkCopied(false), 1400);
                  } catch {}
                }}
                className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-subtle/40 px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-subtle hover:text-foreground"
                aria-label="Copy deep link to this element"
              >
                {linkCopied ? <><Check size={11} aria-hidden /> Link copied</> : <><span aria-hidden>🔗</span> Copy link</>}
              </button>
            )}
            <button
              ref={closeBtnRef}
              onClick={onClose}
              className="nova-focus-ring grid size-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-subtle hover:text-foreground"
              aria-label="Close dialog"
            >
              <X size={16} aria-hidden />
            </button>
          </div>
        </div>

        {/* Split body */}
        <div className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto lg:grid-cols-2 lg:overflow-hidden">
          {/* Preview pane */}
          <div className="relative flex min-h-[min(340px,56dvh)] min-w-0 items-center justify-center overflow-hidden border-b border-border/60 lg:min-h-0 lg:border-b-0 lg:border-r">
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background: light
                  ? "radial-gradient(120% 80% at 50% 0%, #f5f5f5, #e8e8e8 70%)"
                  : "radial-gradient(120% 80% at 50% 0%, #121212, #050505 70%)",
                transition: "background .35s ease",
              }}
            />
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
                backgroundSize: "28px 28px",
                color: light ? "#000" : "#fff",
                maskImage: "radial-gradient(60% 55% at 50% 50%, #000, transparent 75%)",
              }}
            />
            <div className="pointer-events-none absolute left-4 top-3 z-30 font-mono text-[11px] text-muted-foreground">
              {light ? "#e8e8e8" : "#0a0a0a"}
            </div>
            <div role="group" aria-label="Preview theme" className="absolute right-4 top-3 z-30 inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/80 p-0.5 shadow-lg backdrop-blur">
              <button
                type="button"
                onClick={() => setLight(false)}
                className={`grid size-6 place-items-center rounded-full text-[11px] transition-colors ${!light ? "bg-subtle text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                aria-label="Dark preview"
                aria-pressed={!light}
              >
                <span aria-hidden>☾</span>
              </button>
              <button
                type="button"
                onClick={() => setLight(true)}
                className={`grid size-6 place-items-center rounded-full text-[11px] transition-colors ${light ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
                aria-label="Light preview"
                aria-pressed={light}
              >
                <span aria-hidden>☀</span>
              </button>
            </div>
            <div
              ref={previewFrameRef}
              className={[
                "relative z-10 flex h-full min-h-0 w-full justify-start overflow-auto overscroll-contain max-h-[min(56dvh,620px)] lg:max-h-none",
                // When a real card is passed as `preview`, render it flush so its own
                // border / padding / shadow ARE the wrapper — matches the gallery 1:1.
                // Only the fallback branch needs extra breathing room.
                preview ? "p-3 sm:justify-center sm:p-4" : "p-4 sm:justify-center sm:p-6",
              ].join(" ")}
            >
              <div
                className="mx-auto shrink-0"
                style={{
                  width: naturalPreviewSize.width,
                  height: naturalPreviewSize.height * previewScale,
                }}
              >
                <div
                  className="origin-top-left [&>*]:w-full"
                  style={{
                    width: naturalPreviewSize.width,
                    transform: `scale(${previewScale})`,
                  }}
                >
                  {preview ?? (
                    <div
                      {...(hostAttr ? { [hostAttr]: "" } : {})}
                      className={[
                        "group relative flex min-h-72 w-full items-center justify-center rounded-2xl border px-6 py-8",
                        light
                          ? "border-black/10 bg-gradient-to-b from-white to-neutral-100 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.25)]"
                          : "border-white/8 bg-gradient-to-b from-[#0f0f10] to-[#050505] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.7)]",
                      ].join(" ")}
                    >
                      {!light && (
                        <span
                          aria-hidden
                          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
                        />
                      )}
                      {item.render()}
                    </div>
                  )}
                  </div>
                </div>
              </div>

          </div>

          {/* Code pane */}
          <div className="relative flex min-h-[min(300px,46dvh)] min-w-0 flex-col bg-[#07070a] text-zinc-100 [color-scheme:dark] lg:min-h-0">
            <div className="grid shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b border-white/10 bg-white/[0.03] px-3 py-2">
              <div role="tablist" aria-label="Source language" className="flex items-center gap-1">
                <button
                  type="button"
                  role="tab"
                  aria-selected={tab === "react"}
                  aria-controls="nova-code-panel"
                  id="nova-code-tab-react"
                  onClick={() => setTab("react")}
                  className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-colors ${tab === "react" ? "bg-white/10 text-white font-semibold shadow-xs" : "text-zinc-400 hover:text-zinc-200"}`}
                >
                  <span aria-hidden className="text-cyan-400">⚛</span> React
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={tab === "css"}
                  aria-controls="nova-code-panel"
                  id="nova-code-tab-css"
                  onClick={() => setTab("css")}
                  className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-colors ${tab === "css" ? "bg-white/10 text-white font-semibold shadow-xs" : "text-zinc-400 hover:text-zinc-200"}`}
                >
                  <span aria-hidden className="text-sky-400">◐</span> CSS
                </button>
              </div>
              <button
                type="button"
                onClick={copy}
                aria-label={copied ? "Code copied to clipboard" : "Copy code to clipboard"}
                className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-2.5 py-1.5 text-[11.5px] font-medium text-zinc-300 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white cursor-pointer"
              >
                {copied ? <Check size={12} aria-hidden className="text-emerald-400" /> : <Copy size={12} aria-hidden />}
                <span aria-hidden>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <div className="relative min-h-0 flex-1 overflow-hidden bg-[#07070a]">
              <pre id="nova-code-panel" tabIndex={0} role="region" aria-labelledby={tab === "react" ? "nova-code-tab-react" : "nova-code-tab-css"} aria-label={`${item.name} source code`} className="h-full min-h-[220px] overflow-auto p-5 font-mono text-[12px] leading-relaxed text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-500/40 lg:min-h-0">
                <code>{source}</code>
              </pre>
              <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#07070a] to-transparent" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="grid shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-t border-border/60 bg-subtle/40 px-4 py-3 sm:flex sm:flex-wrap sm:px-5">
          <button
            type="button"
            onClick={() => setSaved((s) => !s)}
            aria-pressed={saved}
            aria-label={saved ? "Remove from favorites" : "Save to favorites"}
            className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-background/60 px-3 py-1.5 text-[12.5px] font-medium text-foreground/85 transition-colors hover:border-border hover:bg-subtle"
          >
            <span aria-hidden>{saved ? "★" : "☆"}</span>
            <span aria-hidden>{saved ? "Saved" : "Save to favorites"}</span>
          </button>
          <button
            type="button"
            onClick={copy}
            aria-label={copied ? "Snippet copied to clipboard" : "Copy snippet to clipboard"}
            className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-background/60 px-3 py-1.5 text-[12.5px] font-medium text-foreground/85 transition-colors hover:border-border hover:bg-subtle"
          >
            <Copy size={12} aria-hidden /> <span aria-hidden>Copy snippet</span>
          </button>
          <div ref={exportRef} className="relative ml-auto">
            <button
              type="button"
              onClick={() => setExportOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={exportOpen}
              aria-label={`Export as ${tab === "react" ? "React" : "CSS"}`}
              className="inline-flex items-center overflow-hidden rounded-lg border border-border/60 bg-gradient-to-r from-fuchsia-500/80 via-violet-500/80 to-cyan-500/80 p-[1px] transition-transform hover:scale-[1.02] active:scale-[.98]"
            >
              <span className="inline-flex items-center gap-2 rounded-[7px] bg-background px-3 py-1.5 text-[12.5px] font-semibold text-foreground">
                <span aria-hidden>Export</span> <span aria-hidden className={`text-muted-foreground transition-transform ${exportOpen ? "rotate-180" : ""}`}>▾</span>
                <span aria-hidden className="ml-1 rounded-md bg-subtle px-1.5 py-0.5 text-[10.5px] text-muted-foreground">
                  {tab === "react" ? "React" : "CSS"}
                </span>
              </span>
            </button>
            {exportOpen && (
              <div
                role="menu"
                className="nova-glass absolute bottom-full right-0 mb-2 w-52 overflow-hidden rounded-lg border border-border/60 bg-background p-1 shadow-[0_20px_50px_-10px_color-mix(in_oklab,var(--foreground)_25%,transparent)] animate-in fade-in slide-in-from-bottom-1 duration-150"
              >
                <button role="menuitem" onClick={() => download("react")} className="flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-[12.5px] text-foreground/90 transition-colors hover:bg-subtle">
                  <span className="inline-flex items-center gap-2"><span className="text-cyan-400">⚛</span> React (.tsx)</span>
                  <span className="text-[10px] text-muted-foreground">JSX</span>
                </button>
                <button role="menuitem" onClick={() => download("css")} className="flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-[12.5px] text-foreground/90 transition-colors hover:bg-subtle">
                  <span className="inline-flex items-center gap-2"><span className="text-sky-400">◐</span> CSS (.css)</span>
                  <span className="text-[10px] text-muted-foreground">stylesheet</span>
                </button>
                <button role="menuitem" onClick={() => download("html")} className="flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-[12.5px] text-foreground/90 transition-colors hover:bg-subtle">
                  <span className="inline-flex items-center gap-2"><span className="text-orange-400">◧</span> Standalone (.html)</span>
                  <span className="text-[10px] text-muted-foreground">demo</span>
                </button>
                <div className="my-1 h-px bg-border/60" />
                <button role="menuitem" onClick={copy} className="flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-[12.5px] text-foreground/90 transition-colors hover:bg-subtle">
                  <span className="inline-flex items-center gap-2"><Copy size={12} /> Copy current tab</span>
                  <span className="text-[10px] text-muted-foreground">{tab === "react" ? "React" : "CSS"}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes nova-modal-in {
          from { opacity: 0; transform: translateY(12px) scale(.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>,
    document.body,
  );
}
