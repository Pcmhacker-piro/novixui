import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import {
  ArrowRight,
  ArrowUp,
  ChevronRight,
  Clock,
  Github,
  History,
  Menu,
  Moon,
  Sparkles,
  Sun,
  X,
} from "lucide-react";
import { Badge, Button, IconButton, useTheme } from "@/nova";
import { cn } from "@/nova/utils";
import { DOCS_NAV, FLAT_DOCS } from "./nav-data";
import { CommandK, CommandKTrigger, useRecents } from "./command-k";
import { useAuth } from "@/context/auth-context";
import { UserMenu } from "@/components/auth/user-menu";

/**
 * Nova docs shell — 3-column layout:
 *   [ sticky sidebar ][ article ][ optional table of contents ]
 * Mobile: sidebar collapses into a slide-in sheet.
 */
export function DocsShell({
  children,
  toc,
  title,
  eyebrow,
  description,
  lastUpdated,
  readingTime,
}: {
  children: ReactNode;
  toc?: { id: string; label: string }[];
  title: string;
  eyebrow?: string;
  description?: string;
  lastUpdated?: string;
  readingTime?: string;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile nav on route change.
  useEffect(() => setMobileOpen(false), [pathname]);

  // Track recent pages (fed to ⌘K).
  const { push } = useRecents();
  const current = FLAT_DOCS.find((d) => d.href === pathname);
  useEffect(() => {
    if (current) push(current);
  }, [current, push]);

  // Prev/next inside the flat doc list.
  const idx = FLAT_DOCS.findIndex((d) => d.href === pathname);
  const prev = idx > 0 ? FLAT_DOCS[idx - 1] : null;
  const next = idx >= 0 && idx < FLAT_DOCS.length - 1 ? FLAT_DOCS[idx + 1] : null;

  // Reading-progress bar (scroll-linked, respects reduced motion via spring).
  const articleRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: articleRef, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 22, mass: 0.4 });

  // Breadcrumb crumbs — derived from pathname + nav data for section label.
  const crumbs = useMemo(() => buildCrumbs(pathname), [pathname]);

  // Active TOC section — driven by IntersectionObserver on <section id="...">.
  const activeId = useActiveHeading(toc);

  // Back-to-top button visibility.
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 640);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const reduce = useReducedMotion();

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-accent/30">
      {/* Global ⌘K palette is mounted in __root.tsx */}
      <DocsHeader onOpenMobile={() => setMobileOpen(true)} />

      {/* Reading progress bar */}
      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="fixed left-0 right-0 top-14 z-40 h-[2px] origin-left bg-gradient-to-r from-accent via-primary to-accent shadow-[0_0_12px_var(--accent)]"
      />

      <div className="mx-auto flex w-full max-w-[92rem] gap-8 px-4 md:px-6">
        {/* Sidebar (desktop) */}
        <aside className="sticky top-[65px] hidden h-[calc(100vh-65px)] w-60 shrink-0 overflow-y-auto py-8 pr-2 lg:block">
          <Sidebar pathname={pathname} />
        </aside>

        {/* Article + TOC */}
        <div className="min-w-0 flex-1 py-10 lg:py-12">
          <div className="mx-auto grid max-w-4xl gap-10 xl:max-w-none xl:grid-cols-[minmax(0,1fr)_14rem]">
            <article ref={articleRef} className="min-w-0">
              {crumbs.length > 0 && <Breadcrumbs crumbs={crumbs} />}
              {(eyebrow || title) && (
                <header className="mb-10">
                  {eyebrow && (
                    <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                      {eyebrow}
                    </p>
                  )}
                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="font-display text-[40px] font-semibold leading-[1.1] tracking-[-0.028em]"
                  >
                    {title}
                  </motion.h1>
                  {description && (
                    <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                      {description}
                    </p>
                  )}
                </header>
              )}

              {(readingTime || lastUpdated) && (
                <div className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-muted-foreground">
                  {readingTime && (
                    <span className="inline-flex items-center gap-1.5">
                      <Clock size={12} className="opacity-70" />
                      {readingTime} read
                    </span>
                  )}
                  {lastUpdated && (
                    <span className="inline-flex items-center gap-1.5">
                      <History size={12} className="opacity-70" />
                      Updated {lastUpdated}
                    </span>
                  )}
                </div>
              )}

              <motion.div
                key={pathname}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="prose-nova"
              >
                {children}
              </motion.div>

              {(prev || next) && (
                <nav
                  aria-label="Pager"
                  className="mt-16 flex items-center justify-between gap-4 border-t border-border/60 pt-8"
                >
                  {prev ? (
                    <Link
                      to={prev.href}
                      className="group inline-flex flex-col items-start gap-1 rounded-md p-2 transition hover:bg-subtle"
                    >
                      <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
                        Previous
                      </span>
                      <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                        <ArrowRight
                          size={14}
                          className="rotate-180 transition-transform group-hover:-translate-x-0.5"
                        />
                        {prev.title}
                      </span>
                    </Link>
                  ) : (
                    <span />
                  )}
                  {next && (
                    <Link
                      to={next.href}
                      className="group inline-flex flex-col items-end gap-1 rounded-md p-2 text-right transition hover:bg-subtle"
                    >
                      <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
                        Next
                      </span>
                      <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                        {next.title}
                        <ArrowRight
                          size={14}
                          className="transition-transform group-hover:translate-x-0.5"
                        />
                      </span>
                    </Link>
                  )}
                </nav>
              )}
            </article>

            {toc && toc.length > 0 && (
              <aside className="hidden xl:block">
                <div className="sticky top-[100px]">
                  <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    On this page
                  </p>
                  <ul className="relative space-y-1 border-l border-border/60 text-sm">
                    {toc.map((t) => {
                      const active = activeId === t.id;
                      return (
                        <li key={t.id} className="relative">
                          {active && (
                            <motion.span
                              layoutId="nova-toc-rail"
                              className="absolute -left-px top-1 h-5 w-[2px] rounded-full bg-accent shadow-[0_0_8px_var(--accent)]"
                              transition={{ type: "spring", stiffness: 380, damping: 32 }}
                            />
                          )}
                          <a
                            href={`#${t.id}`}
                            className={cn(
                              "block rounded-r-md py-1 pl-3 pr-2 transition-colors",
                              active
                                ? "text-foreground"
                                : "text-muted-foreground hover:text-foreground",
                            )}
                          >
                            {t.label}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>

      {/* Back to top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            key="back-to-top"
            type="button"
            aria-label="Back to top"
            onClick={() => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="nova-glass nova-focus-ring fixed bottom-5 right-5 z-40 inline-flex size-10 items-center justify-center rounded-full text-foreground shadow-lg hover:text-accent"
          >
            <ArrowUp size={16} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mobile sheet */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            aria-hidden
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="nova-glass absolute inset-y-0 left-0 w-72 overflow-y-auto border-r border-border/60 p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-semibold">Menu</span>
              <IconButton
                aria-label="Close menu"
                variant="ghost"
                size="sm"
                icon={<X />}
                onClick={() => setMobileOpen(false)}
              />
            </div>
            <Sidebar pathname={pathname} />
          </motion.div>
        </div>
      )}
    </div>
  );
}

function DocsHeader({ onOpenMobile }: { onOpenMobile: () => void }) {
  const { resolvedTheme, toggle } = useTheme();
  const { isAuthenticated, openAuthModal } = useAuth();
  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-[92rem] items-center gap-3 px-4 md:px-6">
        <button
          type="button"
          aria-label="Open menu"
          onClick={onOpenMobile}
          className="nova-focus-ring inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-subtle lg:hidden"
        >
          <Menu size={16} />
        </button>
        <Link
          to="/"
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-subtle hover:text-foreground"
        >
          <span className="font-semibold tracking-tight text-foreground">
            novix<span className="text-accent">ui</span>
          </span>
          <Badge variant="outline" size="sm" className="ml-1 font-mono">
            v0.1
          </Badge>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 md:flex">
          <HeaderLink to="/docs">Docs</HeaderLink>
          <HeaderLink to="/docs/components/button">Components</HeaderLink>
          <HeaderLink to="/docs/theming">Theming</HeaderLink>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden md:block">
            <CommandKTrigger />
          </div>
          <IconButton
            aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
            onClick={toggle}
            variant="ghost"
            icon={
              resolvedTheme === "dark" ? (
                <Sun size={16} className="text-amber-400" />
              ) : (
                <Moon size={16} className="text-indigo-600" />
              )
            }
            className="border border-border/80 bg-subtle/80 text-foreground transition-colors hover:bg-muted dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
          />
          <IconButton
            aria-label="GitHub"
            variant="ghost"
            icon={<Github size={16} />}
            className="border border-border/80 bg-subtle/80 text-foreground transition-colors hover:bg-muted dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
          />
          <Button size="sm" trailingIcon={<ArrowRight />} asChild>
            <Link to="/docs/installation">Install</Link>
          </Button>
          {isAuthenticated ? (
            <div className="ml-1">
              <UserMenu />
            </div>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="ml-1 hidden sm:inline-flex rounded-full text-xs"
              asChild
            >
              <Link to="/auth" search={{ mode: "signup" }}>
                Join
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

function HeaderLink({ to, children }: { to: string; children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active = pathname === to || (to !== "/docs" && pathname.startsWith(to));
  return (
    <Link
      to={to}
      className={cn(
        "rounded-md px-3 py-1.5 text-sm transition-colors",
        active ? "text-foreground" : "text-muted-foreground hover:bg-subtle hover:text-foreground",
      )}
    >
      {children}
    </Link>
  );
}

function Sidebar({ pathname }: { pathname: string }) {
  return (
    <nav aria-label="Docs navigation" className="space-y-7">
      {DOCS_NAV.map((section) => (
        <div key={section.label}>
          <div className="mb-2 flex items-center justify-between px-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {section.label}
            </p>
            {section.eyebrow && (
              <span className="text-[10px] font-mono text-muted-foreground/70">
                {section.eyebrow}
              </span>
            )}
          </div>
          <ul className="space-y-0.5">
            {section.items.map((item) => {
              const active = pathname === item.href;
              const disabled = item.status === "soon";
              const body = (
                <span className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2">
                    {active && (
                      <motion.span
                        layoutId="nova-sidebar-dot"
                        className="size-1 rounded-full bg-accent shadow-[0_0_10px_var(--accent)]"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span className={cn(active && "ml-0", !active && "ml-3")}>{item.title}</span>
                  </span>
                  {item.status === "soon" && (
                    <span className="rounded-full border border-border/60 px-1.5 py-[1px] text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                      soon
                    </span>
                  )}
                  {item.status === "new" && (
                    <span className="rounded-full bg-accent/15 px-1.5 py-[1px] text-[10px] font-mono uppercase tracking-wider text-accent">
                      new
                    </span>
                  )}
                </span>
              );
              const cls = cn(
                "block rounded-md px-2 py-1.5 text-[13.5px] transition-colors",
                active
                  ? "bg-accent/10 font-medium text-foreground"
                  : disabled
                    ? "cursor-not-allowed text-muted-foreground/60"
                    : "text-muted-foreground hover:bg-subtle hover:text-foreground",
              );
              return (
                <li key={item.href}>
                  {disabled ? (
                    <span className={cls}>{body}</span>
                  ) : (
                    <Link to={item.href} className={cls}>
                      {body}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

/* ────────────────────────────── Prose helpers ────────────────────────────── */

export function DocSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  const activate = () => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard
      ?.writeText(url)
      .then(() => {
        toast.success("Link copied", { description: title, duration: 2200 });
      })
      .catch(() => {
        toast.error("Couldn't copy link", { duration: 2200 });
      });
  };

  return (
    <section id={id} className="scroll-mt-24 space-y-4 pt-10 first:pt-0">
      <h2 className="group relative flex items-center gap-2 font-display text-2xl font-semibold tracking-[-0.02em]">
        <a
          href={`#${id}`}
          onClick={(e) => {
            // Stop bubbling so any parent handler (cards, 3D tilt wrappers,
            // command-k listeners) can't swallow or re-interpret the click.
            e.preventDefault();
            e.stopPropagation();
            activate();
          }}
          onPointerDown={(e) => {
            // Guarantee the anchor wins the pointer over any decorative
            // sibling that might otherwise claim the gesture.
            e.stopPropagation();
          }}
          onKeyDown={(e) => {
            // Native anchors handle Enter but not Space — add Space parity so
            // keyboard users get the same scroll + copy behavior as click.
            if (e.key === " " || e.key === "Spacebar") {
              e.preventDefault();
              e.stopPropagation();
              activate();
            }
          }}
          className="nova-focus-ring relative z-10 inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md opacity-0 transition-opacity [pointer-events:auto] focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background group-hover:opacity-100"
          aria-label={`Copy link to ${title}`}
          title="Copy link to section"
        >
          <ChevronRight size={16} aria-hidden className="pointer-events-none text-muted-foreground" />
        </a>
        {title}
      </h2>
      {children}
    </section>
  );
}

export function DocLead({ children }: { children: ReactNode }) {
  return <p className="text-base leading-relaxed text-muted-foreground">{children}</p>;
}

export function DocParagraph({ children }: { children: ReactNode }) {
  return <p className="leading-relaxed text-muted-foreground">{children}</p>;
}

/* ────────────────────────────── Breadcrumbs ────────────────────────────── */

type Crumb = { label: string; href?: string };

function buildCrumbs(pathname: string): Crumb[] {
  if (pathname === "/" || pathname === "") return [];
  const link = FLAT_DOCS.find((d) => d.href === pathname);
  const section = DOCS_NAV.find((s) => s.items.some((i) => i.href === pathname));
  const crumbs: Crumb[] = [{ label: "Home", href: "/" }];
  if (pathname.startsWith("/docs")) crumbs.push({ label: "Docs", href: "/docs" });
  if (section && section.label !== "Getting started") crumbs.push({ label: section.label });
  if (link && link.href !== "/docs") crumbs.push({ label: link.title });
  return crumbs;
}

function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-6 flex items-center gap-1.5 text-[12.5px] text-muted-foreground"
    >
      {crumbs.map((c, i) => {
        const last = i === crumbs.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            {c.href && !last ? (
              <Link to={c.href} className="rounded px-1 hover:bg-subtle hover:text-foreground">
                {c.label}
              </Link>
            ) : (
              <span className={cn("px-1", last && "text-foreground")}>{c.label}</span>
            )}
            {!last && <ChevronRight size={12} className="opacity-50" />}
          </span>
        );
      })}
    </nav>
  );
}

/* ────────────────────────────── Active heading ────────────────────────────── */

function useActiveHeading(toc?: { id: string; label: string }[]) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (!toc || toc.length === 0) return;
    const els = toc
      .map((t) => document.getElementById(t.id))
      .filter((el): el is HTMLElement => !!el);
    if (els.length === 0) return;
    setActive(els[0].id);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-88px 0px -70% 0px", threshold: [0, 1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [toc]);
  return active;
}
