import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Command,
  FileText,
  Home,
  LayoutGrid,
  Moon,
  Palette,
  Search,
  Sparkles,
  Sun,
} from "lucide-react";
import { Kbd } from "@/nova";
import { cn } from "@/nova/utils";
import { useTheme } from "@/nova/themes/theme-provider";
import { DOCS_NAV, FLAT_DOCS } from "./docs/nav-data";
import { BUTTONS } from "@/data/buttons";
import { CHECKBOXES } from "@/data/checkboxes";
import { TOGGLES } from "@/data/toggles";
import { CARDS } from "@/data/cards";
import { LOADERS } from "@/data/loaders";
import { INPUTS } from "@/data/inputs";
import { RADIOS } from "@/data/radios";
import { FORMS } from "@/data/forms";
import { PATTERNS } from "@/data/patterns";
import { TOOLTIPS } from "@/data/tooltips";
import { KITS } from "@/data/kits";

type Entry = {
  id: string;
  title: string;
  hint?: string;
  group: string;
  keywords?: string[];
  icon?: typeof FileText;
  run: () => void;
};

function fuzzy(query: string, target: string): number | null {
  if (!query) return 0;
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  let ti = 0;
  let score = 0;
  let streak = 0;
  for (let qi = 0; qi < q.length; qi++) {
    const found = t.indexOf(q[qi], ti);
    if (found === -1) return null;
    if (found === ti) streak += 2;
    else streak = 0;
    if (found === 0 || /[\s/.-]/.test(t[found - 1])) score += 4;
    score += 2 + streak;
    ti = found + 1;
  }
  return score - Math.floor(t.length / 8);
}

function highlight(target: string, query: string) {
  if (!query) return target;
  const t = target;
  const q = query.toLowerCase();
  const nodes: Array<{ text: string; hit: boolean }> = [];
  let qi = 0;
  let buf = "";
  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    if (qi < q.length && ch.toLowerCase() === q[qi]) {
      if (buf) {
        nodes.push({ text: buf, hit: false });
        buf = "";
      }
      nodes.push({ text: ch, hit: true });
      qi++;
    } else buf += ch;
  }
  if (buf) nodes.push({ text: buf, hit: false });
  return nodes.map((n, i) =>
    n.hit ? (
      <mark key={i} className="rounded-[3px] bg-accent/25 px-[1px] text-accent">
        {n.text}
      </mark>
    ) : (
      <span key={i}>{n.text}</span>
    ),
  );
}

const ELEMENT_CATEGORIES = [
  "All",
  "UI Kits",
  "Buttons",
  "Checkboxes",
  "Toggles",
  "Cards",
  "Loaders",
  "Inputs",
  "Radio buttons",
  "Forms",
  "Patterns",
  "Tooltips",
];

export function GlobalCommandK() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { toggle, resolvedTheme } = useTheme();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };


    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);


  useEffect(() => {
    if (open) {
      setQuery("");
      setIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const close = useCallback(() => setOpen(false), []);
  const goto = useCallback(
    (to: string, search?: Record<string, string>) => {
      close();
      navigate({ to, search: search as never });
    },
    [close, navigate],
  );
  const setElementsCategory = useCallback(
    (cat: string) => {
      close();
      navigate({
        to: "/elements",
        search: { category: cat, tag: "All", q: "", sort: "Featured" } as never,
      });
    },
    [close, navigate],
  );

  const isElements = pathname.startsWith("/elements");
  const isDocs = pathname.startsWith("/docs");

  const entries = useMemo<Entry[]>(() => {
    const list: Entry[] = [];

    // Always-on: global nav + actions
    list.push(
      {
        id: "nav-home",
        title: "Go to Home",
        group: "Navigate",
        icon: Home,
        keywords: ["landing"],
        run: () => goto("/"),
      },
      {
        id: "nav-elements",
        title: "Browse Elements gallery",
        group: "Navigate",
        icon: LayoutGrid,
        keywords: ["components", "gallery"],
        run: () => goto("/elements"),
      },
      {
        id: "nav-docs",
        title: "Open Documentation",
        group: "Navigate",
        icon: BookOpen,
        keywords: ["guide"],
        run: () => goto("/docs"),
      },
      {
        id: "act-theme",
        title: `Toggle theme (${resolvedTheme === "dark" ? "→ Light" : "→ Dark"})`,
        group: "Actions",
        icon: resolvedTheme === "dark" ? Sun : Moon,
        keywords: ["dark", "light", "mode"],
        run: () => {
          toggle();
          close();
        },
      },
    );

    // Page-specific entries first, so they sort at the top when empty query.
    if (isElements) {
      // Categories
      for (const c of ELEMENT_CATEGORIES) {
        list.unshift({
          id: `cat-${c}`,
          title: `Filter · ${c}`,
          hint: "Elements",
          group: "Elements · Categories",
          icon: LayoutGrid,
          keywords: ["filter", "category", c],
          run: () => setElementsCategory(c),
        });
      }
      // Component instances — jump to their gallery.
      const src: Array<[string, { id: string; name: string }[]]> = [
        ["Buttons", BUTTONS],
        ["Checkboxes", CHECKBOXES],
        ["Toggles", TOGGLES],
        ["Cards", CARDS],
        ["Loaders", LOADERS],
        ["Inputs", INPUTS],
        ["Radio buttons", RADIOS],
        ["Forms", FORMS],
        ["Patterns", PATTERNS],
        ["Tooltips", TOOLTIPS],
        ["UI Kits", KITS],
      ];
      for (const [cat, items] of src) {
        for (const it of items) {
          list.push({
            id: `el-${cat}-${it.id}`,
            title: it.name,
            hint: cat,
            group: `Elements · ${cat}`,
            keywords: [cat, it.id],
            icon: Sparkles,
            run: () => setElementsCategory(cat),
          });
        }
      }
    }

    if (isDocs || !isElements) {
      // Docs pages
      for (const section of DOCS_NAV) {
        for (const item of section.items) {
          list.push({
            id: `doc-${item.href}`,
            title: item.title,
            hint: section.label,
            group: `Docs · ${section.label}`,
            keywords: item.keywords,
            icon: item.href.startsWith("/docs/components")
              ? LayoutGrid
              : item.href.startsWith("/docs/tokens")
                ? Palette
                : FileText,
            run: () => goto(item.href),
          });
        }
      }
      // Ensure FLAT_DOCS discoverable even when not on /docs
      void FLAT_DOCS;
    }

    return list;
  }, [isDocs, isElements, goto, setElementsCategory, close, resolvedTheme, toggle]);

  const groups = useMemo<Array<[string, Entry[]]>>(() => {
    const q = query.trim();
    const filtered = q
      ? entries
          .map((e) => {
            const hay = [e.title, e.hint ?? "", ...(e.keywords ?? [])].join(" ");
            return { e, score: fuzzy(q, hay) };
          })
          .filter((r): r is { e: Entry; score: number } => r.score !== null)
          .sort((a, b) => b.score - a.score)
          .map((r) => r.e)
      : entries;

    const map = new Map<string, Entry[]>();
    for (const e of filtered) {
      const arr = map.get(e.group) ?? [];
      if (arr.length < 8) arr.push(e);
      map.set(e.group, arr);
    }
    return Array.from(map.entries());
  }, [entries, query]);

  const flat = useMemo(() => groups.flatMap(([, xs]) => xs), [groups]);
  useEffect(() => setIndex(0), [query]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="gcmdk"
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          className="fixed inset-0 z-[200] flex items-start justify-center px-4 pt-[14vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div
            aria-hidden
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={close}
          />
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b12]/95 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl"
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setIndex((i) => Math.min(i + 1, flat.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setIndex((i) => Math.max(i - 1, 0));
              } else if (e.key === "Enter") {
                e.preventDefault();
                flat[index]?.run();
              }
            }}
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <Search size={15} className="text-white/50" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  isElements
                    ? "Search categories, buttons, cards, forms…"
                    : isDocs
                      ? "Search docs, components, tokens…"
                      : "Search Novix UI…"
                }
                className="flex-1 bg-transparent text-[15px] text-white outline-none placeholder:text-white/40"
              />
              <Kbd size="sm">Esc</Kbd>
            </div>

            <div className="max-h-[52vh] overflow-y-auto p-1.5">
              {flat.length === 0 && (
                <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
                  <span className="grid size-10 place-items-center rounded-full bg-white/[0.05] text-white/60">
                    <Search size={16} />
                  </span>
                  <p className="text-sm font-medium text-white">No matches</p>
                  <p className="text-[12.5px] text-white/50">
                    Nothing for &ldquo;{query}&rdquo;. Try a component or page name.
                  </p>
                </div>
              )}
              {groups.map(([label, items]) => (
                <div key={label} className="mb-1.5">
                  <div className="px-3 pb-1 pt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
                    {label}
                  </div>
                  <ul>
                    {items.map((r) => {
                      const i = flat.indexOf(r);
                      const active = i === index;
                      const Icon = r.icon ?? FileText;
                      return (
                        <li key={r.id}>
                          <button
                            type="button"
                            onMouseEnter={() => setIndex(i)}
                            onClick={() => r.run()}
                            className={cn(
                              "flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors",
                              active
                                ? "bg-white/[0.08] text-white"
                                : "text-white/70 hover:bg-white/[0.05] hover:text-white",
                            )}
                          >
                            <span className="flex min-w-0 items-center gap-3">
                              <Icon
                                size={13}
                                className={active ? "text-fuchsia-300" : "text-white/50"}
                              />
                              <span className="truncate">{highlight(r.title, query)}</span>
                            </span>
                            <span className="flex items-center gap-2 text-[11px] font-mono text-white/40">
                              {r.hint}
                              <ArrowRight size={12} className={active ? "text-fuchsia-300" : ""} />
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-white/10 px-4 py-2 text-[11px] font-mono text-white/50">
              <span className="flex items-center gap-2">
                <Kbd size="sm">↑</Kbd>
                <Kbd size="sm">↓</Kbd>
                navigate
              </span>
              <span className="flex items-center gap-2">
                <Command size={11} className="opacity-70" />
                <Kbd size="sm">↵</Kbd>
                run · context: {isElements ? "Elements" : isDocs ? "Docs" : "Global"}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
