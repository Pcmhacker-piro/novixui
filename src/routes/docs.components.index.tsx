import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Clock, Search, Star, X } from "lucide-react";
import { Badge, Button, Card } from "@/nova";
import { cn } from "@/nova/utils";
import { DocsShell } from "@/components/docs/docs-shell";
import { FLAT_DOCS, type DocLink } from "@/components/docs/nav-data";

export const Route = createFileRoute("/docs/components/")({
  component: ComponentsGallery,
  head: () => ({
    meta: [
      { title: "Components · Novix UI" },
      {
        name: "description",
        content:
          "Browse every Novix UI primitive. Search by name, tag, or category. Favorite what you use most.",
      },
      { property: "og:title", content: "Components · Novix UI" },
      {
        property: "og:description",
        content:
          "Every Novix UI primitive in one place. Fuzzy search, categories, favorites, and recently viewed.",
      },
    ],
  }),
});

const FAV_KEY = "nova.docs.favorites";
const RECENT_KEY = "nova.docs.recents";

const COMPONENT_DOCS: DocLink[] = FLAT_DOCS.filter(
  (d) => d.href.startsWith("/docs/components/") && d.category,
);

const CATEGORIES = ["All", ...Array.from(new Set(COMPONENT_DOCS.map((c) => c.category!)))];

function ComponentsGallery() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [favs, setFavs] = useState<string[]>([]);
  const [recent, setRecent] = useState<DocLink[]>([]);
  const [cursor, setCursor] = useState(0);

  useEffect(() => {
    try {
      const f = localStorage.getItem(FAV_KEY);
      if (f) setFavs(JSON.parse(f));
      const r = localStorage.getItem(RECENT_KEY);
      if (r) setRecent(JSON.parse(r));
    } catch {
      /* noop */
    }
  }, []);

  const toggleFav = (href: string) =>
    setFavs((cur) => {
      const next = cur.includes(href) ? cur.filter((h) => h !== href) : [...cur, href];
      try {
        localStorage.setItem(FAV_KEY, JSON.stringify(next));
      } catch {
        /* noop */
      }
      return next;
    });

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return COMPONENT_DOCS.filter((c) => {
      if (cat !== "All" && c.category !== cat) return false;
      if (!query) return true;
      const hay = [c.title, c.category, ...(c.tags ?? []), ...(c.keywords ?? [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(query);
    });
  }, [q, cat]);

  // Keyboard navigation over the visible grid.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "/"].includes(e.key)) {
        if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
          e.preventDefault();
          const el = document.getElementById("gallery-search");
          el?.focus();
          return;
        }
        if (document.activeElement?.tagName === "INPUT") return;
        e.preventDefault();
        setCursor((c) => {
          if (e.key === "ArrowDown" || e.key === "ArrowRight")
            return Math.min(c + 1, filtered.length - 1);
          return Math.max(c - 1, 0);
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [filtered.length]);

  useEffect(() => setCursor(0), [q, cat]);

  const favComponents = COMPONENT_DOCS.filter((c) => favs.includes(c.href));
  const recentComponents = recent.filter((r) => r.href.startsWith("/docs/components/"));

  return (
    <DocsShell
      eyebrow="Explore"
      title="Components"
      description="Every Novix UI primitive. Search, filter, and favorite what you use."
    >
      {/* Toolbar */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            id="gallery-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder='Search by name, tag, or category — press "/" to focus'
            className="nova-focus-ring h-11 w-full rounded-lg border border-border bg-surface/60 pl-9 pr-9 text-[14px] outline-none transition placeholder:text-muted-foreground focus:border-border-strong"
          />
          {q && (
            <button
              onClick={() => setQ("")}
              aria-label="Clear"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-subtle hover:text-foreground"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 rounded-lg bg-subtle/50 p-1">
          {CATEGORIES.map((c) => {
            const active = cat === c;
            return (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={cn(
                  "nova-focus-ring relative rounded-md px-3 py-1.5 text-[12.5px] font-medium transition-colors",
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="gallery-pill"
                    className="absolute inset-0 -z-0 rounded-md bg-background shadow-[0_1px_0_0_color-mix(in_oklab,white_25%,transparent)_inset,0_1px_2px_0_color-mix(in_oklab,var(--foreground)_10%,transparent)]"
                    transition={{ type: "spring", stiffness: 480, damping: 34 }}
                  />
                )}
                <span className="relative z-10">{c}</span>
                <span className="relative z-10 ml-1.5 text-[10.5px] font-mono text-muted-foreground/70">
                  {c === "All"
                    ? COMPONENT_DOCS.length
                    : COMPONENT_DOCS.filter((d) => d.category === c).length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {favComponents.length > 0 && (
        <Row title="Favorites" icon={<Star size={12} className="text-amber-300" />}>
          {favComponents.map((c) => (
            <GalleryCard key={c.href} doc={c} favorite onFav={toggleFav} />
          ))}
        </Row>
      )}

      {recentComponents.length > 0 && !q && cat === "All" && (
        <Row title="Recently viewed" icon={<Clock size={12} />}>
          {recentComponents.slice(0, 4).map((c) => (
            <GalleryCard key={c.href} doc={c} favorite={favs.includes(c.href)} onFav={toggleFav} />
          ))}
        </Row>
      )}

      <Row title={`All components · ${filtered.length}`}>
        <AnimatePresence mode="popLayout">
          {filtered.map((c, i) => (
            <motion.div
              key={c.href}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <GalleryCard
                doc={c}
                favorite={favs.includes(c.href)}
                onFav={toggleFav}
                highlighted={i === cursor}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-border/60 p-10 text-center text-sm text-muted-foreground">
            No components match. Try clearing the filters.
          </div>
        )}
      </Row>
    </DocsShell>
  );
}

function Row({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <div className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        {icon}
        {title}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </section>
  );
}

function GalleryCard({
  doc,
  favorite,
  onFav,
  highlighted,
}: {
  doc: DocLink;
  favorite?: boolean;
  onFav: (href: string) => void;
  highlighted?: boolean;
}) {
  const disabled = doc.status === "soon";
  return (
    <Card
      interactive={!disabled}
      className={cn(
        "group relative flex h-full flex-col justify-between p-5",
        highlighted && "ring-2 ring-accent/50",
        disabled && "opacity-70",
      )}
    >
      <button
        type="button"
        aria-label={favorite ? "Unfavorite" : "Favorite"}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onFav(doc.href);
        }}
        className={cn(
          "absolute right-3 top-3 z-10 grid size-7 place-items-center rounded-md transition",
          favorite
            ? "bg-amber-500/15 text-amber-300"
            : "text-muted-foreground/60 opacity-0 hover:bg-subtle hover:text-foreground group-hover:opacity-100",
        )}
      >
        <Star size={13} fill={favorite ? "currentColor" : "none"} />
      </button>

      {disabled ? (
        <div className="flex-1">
          <GalleryContent doc={doc} />
        </div>
      ) : (
        <Link to={doc.href} className="flex flex-1 flex-col">
          <GalleryContent doc={doc} />
          <div className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-accent">
            View docs
            <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
          </div>
        </Link>
      )}
    </Card>
  );
}

function GalleryContent({ doc }: { doc: DocLink }) {
  return (
    <>
      <div className="mb-1 flex items-center gap-2">
        <p className="font-display text-[17px] font-semibold tracking-tight">{doc.title}</p>
        {doc.status === "stable" && (
          <Badge variant="success" size="sm" dot>
            stable
          </Badge>
        )}
        {doc.status === "new" && (
          <Badge variant="accent" size="sm">
            new
          </Badge>
        )}
        {doc.status === "soon" && (
          <Badge variant="outline" size="sm">
            soon
          </Badge>
        )}
      </div>
      <p className="text-[12.5px] text-muted-foreground">{doc.category}</p>
      {doc.tags && (
        <div className="mt-3 flex flex-wrap gap-1">
          {doc.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-border/60 px-2 py-[2px] text-[10.5px] font-mono text-muted-foreground/80"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </>
  );
}
