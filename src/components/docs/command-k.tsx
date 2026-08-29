import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Clock,
  Command,
  FileText,
  LayoutGrid,
  Palette,
  Play,
  Search,
  Sparkles,
  Terminal,
} from "lucide-react";
import { Kbd } from "@/nova";
import { DOCS_NAV, FLAT_DOCS, type DocLink } from "./nav-data";
import { cn } from "@/nova/utils";

/**
 * Nova docs · Command palette (⌘K)
 *
 * • ⌘K / Ctrl+K opens; Esc closes.
 * • ↑ / ↓ navigate; Enter selects.
 * • Fuzzy character-subsequence match over title + keywords + href.
 * • Results are grouped by section (Getting started, Components, Tokens…).
 * • Recently visited pages persist to localStorage and float to the top
 *   when the query is empty.
 */

const RECENTS_KEY = "nova.docs.recents";
const MAX_RECENTS = 6;

export function useRecents() {
  const [recents, setRecents] = useState<DocLink[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENTS_KEY);
      if (raw) setRecents(JSON.parse(raw));
    } catch {
      /* noop */
    }
  }, []);

  const push = useCallback((doc: DocLink) => {
    setRecents((cur) => {
      const next = [doc, ...cur.filter((d) => d.href !== doc.href)].slice(0, MAX_RECENTS);
      try {
        localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
      } catch {
        /* noop */
      }
      return next;
    });
  }, []);

  return { recents, push };
}

function iconFor(href: string) {
  if (href.startsWith("/docs/components")) return LayoutGrid;
  if (href.startsWith("/docs/tokens")) return Palette;
  if (href.startsWith("/docs/cli")) return Terminal;
  if (href.startsWith("/docs/playground") || href === "/docs/motion") return Play;
  return FileText;
}

/** Character-subsequence score — returns null if no match. */
function fuzzyScore(query: string, target: string): number | null {
  if (!query) return 0;
  let ti = 0;
  let score = 0;
  let streak = 0;
  const t = target.toLowerCase();
  const q = query.toLowerCase();
  for (let qi = 0; qi < q.length; qi++) {
    const ch = q[qi];
    const found = t.indexOf(ch, ti);
    if (found === -1) return null;
    // Bonus for consecutive matches and word boundaries.
    if (found === ti) streak += 2;
    else streak = 0;
    if (found === 0 || /[\s/.-]/.test(t[found - 1])) score += 4;
    score += 2 + streak;
    ti = found + 1;
  }
  // Prefer shorter targets.
  return score - Math.floor(t.length / 8);
}

/** Highlight the subsequence of `query` inside `target`. */
function highlightMatch(target: string, query: string) {
  if (!query) return target;
  const t = target;
  const q = query.toLowerCase();
  const parts: Array<{ text: string; hit: boolean }> = [];
  let qi = 0;
  let buf = "";
  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    if (qi < q.length && ch.toLowerCase() === q[qi]) {
      if (buf) {
        parts.push({ text: buf, hit: false });
        buf = "";
      }
      parts.push({ text: ch, hit: true });
      qi++;
    } else {
      buf += ch;
    }
  }
  if (buf) parts.push({ text: buf, hit: false });
  return parts.map((p, i) =>
    p.hit ? (
      <mark key={i} className="rounded-[3px] bg-accent/25 px-[1px] text-accent">
        {p.text}
      </mark>
    ) : (
      <span key={i}>{p.text}</span>
    ),
  );
}

export function CommandK() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { recents, push } = useRecents();

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

  /** Grouped results — [sectionLabel, items][]. */
  const groups = useMemo<Array<[string, DocLink[]]>>(() => {
    const q = query.trim();
    if (!q) {
      const out: Array<[string, DocLink[]]> = [];
      if (recents.length > 0) out.push(["Recent", recents]);
      for (const s of DOCS_NAV) out.push([s.label, s.items.slice(0, 6)]);
      return out;
    }
    // Score every entry.
    const scored = FLAT_DOCS.map((d) => {
      const hay = [d.title, ...(d.keywords ?? []), d.href].join(" ");
      return { d, score: fuzzyScore(q, hay) };
    })
      .filter((r): r is { d: DocLink; score: number } => r.score !== null)
      .sort((a, b) => b.score - a.score)
      .map((r) => r.d);

    // Regroup by section.
    const grouped = new Map<string, DocLink[]>();
    for (const item of scored) {
      const sec = DOCS_NAV.find((s) => s.items.some((i) => i.href === item.href));
      const label = sec?.label ?? "Results";
      if (!grouped.has(label)) grouped.set(label, []);
      grouped.get(label)!.push(item);
    }
    return Array.from(grouped.entries()).map(([k, v]) => [k, v.slice(0, 6)]);
  }, [query, recents]);

  const flat = useMemo(() => groups.flatMap(([, items]) => items), [groups]);

  useEffect(() => setIndex(0), [query]);

  const go = (href: string) => {
    const link = FLAT_DOCS.find((d) => d.href === href);
    if (link) push(link);
    setOpen(false);
    navigate({ to: href });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="cmdk"
          role="dialog"
          aria-modal="true"
          aria-label="Search Novix UI"
          className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[14vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <div
            aria-hidden
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="nova-glass relative w-full max-w-xl overflow-hidden rounded-2xl border border-border/70"
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setIndex((i) => Math.min(i + 1, flat.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setIndex((i) => Math.max(i - 1, 0));
              } else if (e.key === "Enter") {
                e.preventDefault();
                const r = flat[index];
                if (r) go(r.href);
              }
            }}
          >
            <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3">
              <Search size={15} className="text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search components, tokens, CLI…"
                className="flex-1 bg-transparent text-[15px] text-foreground outline-none placeholder:text-muted-foreground"
              />
              <Kbd size="sm">Esc</Kbd>
            </div>

            <div className="max-h-[52vh] overflow-y-auto p-1.5">
              {flat.length === 0 && (
                <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
                  <span className="grid size-10 place-items-center rounded-full bg-subtle text-muted-foreground">
                    <Search size={16} />
                  </span>
                  <p className="text-sm font-medium text-foreground">No matches</p>
                  <p className="text-[12.5px] text-muted-foreground">
                    Nothing found for &ldquo;{query}&rdquo;. Try a component, token, or CLI name.
                  </p>
                </div>
              )}
              {groups.map(([label, items]) => (
                <div key={label} className="mb-1.5">
                  <div className="flex items-center gap-1.5 px-3 pb-1 pt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/80">
                    {label === "Recent" && <Clock size={10} />}
                    {label}
                  </div>
                  <ul>
                    {items.map((r) => {
                      const i = flat.indexOf(r);
                      const active = i === index;
                      const Icon = iconFor(r.href);
                      return (
                        <li key={r.href}>
                          <button
                            type="button"
                            onMouseEnter={() => setIndex(i)}
                            onClick={() => go(r.href)}
                            className={cn(
                              "flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors",
                              active
                                ? "bg-accent/15 text-foreground"
                                : "text-muted-foreground hover:bg-subtle hover:text-foreground",
                            )}
                          >
                            <span className="flex items-center gap-3">
                              <Icon
                                size={13}
                                className={active ? "text-accent" : "text-muted-foreground/70"}
                              />
                              <span>{highlightMatch(r.title, query)}</span>
                              {r.status === "new" && (
                                <span className="rounded-full bg-accent/15 px-1.5 py-[1px] text-[10px] font-mono uppercase tracking-wider text-accent">
                                  new
                                </span>
                              )}
                              {r.status === "soon" && (
                                <span className="rounded-full border border-border/60 px-1.5 py-[1px] text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                                  soon
                                </span>
                              )}
                            </span>
                            <span className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground/80">
                              {r.href}
                              <ArrowRight size={12} className={active ? "text-accent" : ""} />
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-border/60 px-4 py-2 text-[11px] font-mono text-muted-foreground">
              <span className="flex items-center gap-2">
                <Kbd size="sm">↑</Kbd>
                <Kbd size="sm">↓</Kbd>
                to navigate
              </span>
              <span className="flex items-center gap-2">
                <Command size={11} className="opacity-70" />
                <Sparkles size={11} className="opacity-70" />
                <Kbd size="sm">↵</Kbd>
                to open
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Button that opens the palette — shown in the docs header. */
export function CommandKTrigger() {
  const [mac, setMac] = useState(true);
  useEffect(() => {
    setMac(/Mac|iPod|iPhone|iPad/.test(navigator.platform));
  }, []);
  return (
    <button
      type="button"
      onClick={() => {
        const ev = new KeyboardEvent("keydown", {
          key: "k",
          metaKey: true,
          ctrlKey: !navigator.platform.startsWith("Mac"),
        });
        window.dispatchEvent(ev);
      }}
      className="nova-focus-ring group inline-flex h-8 min-w-[220px] items-center justify-between gap-3 rounded-md border border-border bg-surface/60 px-2.5 text-[13px] text-muted-foreground transition hover:border-border-strong hover:bg-subtle"
      aria-label="Search documentation"
    >
      <span className="flex items-center gap-2">
        <Search size={13} />
        Search…
      </span>
      <Kbd size="sm">{mac ? "⌘K" : "Ctrl K"}</Kbd>
    </button>
  );
}
