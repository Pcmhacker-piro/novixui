import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { CodeModal } from "@/components/elements/code-modal";
import { Category, Creation, CATEGORIES, CREATIONS, MOSAIC_TILES, CreationTile } from "@/data/landing-creations";
import { extractSnippet } from "@/lib/snippet";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckSquare,
  ChevronDown,
  CircleDot,
  ClipboardList,
  Copy,
  FileText,
  Github,
  Heart,
  HelpCircle,
  LayoutGrid,
  Loader2,
  Menu,
  Moon,
  MousePointer2,
  Plus,
  Rocket,
  Search,
  Sparkles,
  Sun,
  ToggleRight,
  Users,
  Waves,
  X,
  ArrowUpRight,
} from "lucide-react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  IconButton,
  KbdSequence,
  Separator,
  fadeRise,
  stagger,
  useTheme,
} from "@/nova";
import { useAuth } from "@/context/auth-context";
import { UserMenu } from "@/components/auth/user-menu";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-accent/30">
      <TopNav />
      <main>
        <Hero />
        <Reveal>
          <ElementsMosaic />
        </Reveal>
        <Reveal>
          <CreationsGallery />
        </Reveal>
        <Reveal>
          <CommunityStrip />
        </Reveal>
        <Reveal>
          <CallToCreate />
        </Reveal>
      </main>
      <Footer />
    </div>
  );
}

/* ────────────────────────────── Reveal wrapper ────────────────────────────── */

function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 32, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/* ────────────────────────────── Nav ────────────────────────────── */

const ELEMENT_CATEGORIES: {
  label: string;
  icon: typeof BookOpen;
  count?: number;
  badge?: string;
}[] = [
  { label: "All", icon: BookOpen },
  { label: "UI Kits", icon: LayoutGrid, badge: "New" },
  { label: "Buttons", icon: MousePointer2, count: 2649 },
  { label: "Checkboxes", icon: CheckSquare, count: 331 },
  { label: "Toggle switches", icon: ToggleRight, count: 450 },
  { label: "Cards", icon: FileText, count: 1488 },
  { label: "Loaders", icon: Loader2, count: 1195 },
  { label: "Inputs", icon: Search, count: 363 },
  { label: "Radio buttons", icon: CircleDot, count: 204 },
  { label: "Forms", icon: ClipboardList, count: 252 },
  { label: "Patterns", icon: Waves, count: 281 },
  { label: "Tooltips", icon: HelpCircle, count: 136 },
];

function ElementsMenu() {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 220);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        aria-expanded={open}
        onFocus={() => {
          cancelClose();
          setOpen(true);
        }}
        className="inline-flex items-center gap-1 rounded-md px-3.5 py-2 text-[14px] text-muted-foreground transition-colors hover:bg-subtle hover:text-foreground"
      >
        Elements
        <ChevronDown
          size={14}
          className={`opacity-70 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
        className={`absolute left-1/2 top-full z-50 w-[640px] -translate-x-1/2 pt-3 transition-all duration-200 ${
          open ? "pointer-events-auto opacity-100 translate-y-0" : "pointer-events-none opacity-0 -translate-y-1"
        }`}
      >
        <div
          className="rounded-2xl border border-border/80 bg-background/95 p-3 shadow-2xl backdrop-blur-xl ring-1 ring-border/50 dark:border-white/10 dark:bg-[#0b0b0b]/95 dark:ring-white/5"
          style={{
            backgroundImage:
              "radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,0.05), transparent 60%)",
          }}
        >
          <div className="grid grid-cols-2 gap-2">
            {ELEMENT_CATEGORIES.map(({ label, icon: Icon, count, badge }) => (
              <Link
                key={label}
                to="/elements"
                search={{ category: label, tag: "All", q: "" }}
                onClick={() => setOpen(false)}
                className="group/item flex items-center justify-between gap-3 rounded-xl border border-transparent bg-subtle/50 px-4 py-3 text-[14px] text-foreground transition-all duration-200 hover:border-border hover:bg-subtle hover:-translate-y-px dark:border-transparent dark:bg-white/[0.02] dark:text-white/90 dark:hover:border-white/10 dark:hover:bg-white/[0.06]"
              >
                <span className="flex items-center gap-3">
                  <Icon
                    size={18}
                    className="text-muted-foreground transition-colors group-hover/item:text-foreground dark:text-white/70 dark:group-hover/item:text-white"
                  />
                  <span className="font-medium">{label}</span>
                </span>
                {badge ? (
                  <span className="text-[13px] font-medium text-rose-500 dark:text-rose-400">{badge}</span>
                ) : count !== undefined ? (
                  <span className="text-[13px] tabular-nums text-muted-foreground/80 dark:text-white/45">
                    {count.toLocaleString()}
                  </span>
                ) : null}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TopNav() {
  const { resolvedTheme, toggle } = useTheme();
  const { isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={
        "sticky top-0 z-40 transition-[background,border-color,backdrop-filter] duration-300 " +
        (scrolled || mobileMenuOpen
          ? "border-b border-border/60 bg-background/90 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent")
      }
    >
      <div className="mx-auto flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:max-w-none lg:px-8">
        {/* Left — wordmark */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            window.location.assign("/");
          }}
          className="group flex items-center gap-2 pl-1 md:pl-2"
          title="Novix UI Home"
        >
          <span className="font-display text-[21px] font-bold tracking-tight">
            novix<span className="text-accent">ui</span>
          </span>
        </a>

        {/* Center — primary nav (desktop) */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 transition-[gap,padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:flex lg:gap-2 xl:gap-4 [&>a]:transition-[padding,font-size,background-color,color] [&>a]:duration-500 [&>a]:ease-[cubic-bezier(0.16,1,0.3,1)]">
          <ElementsMenu />

          <Link
            to="/challenges"
            className="rounded-md px-2.5 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-subtle hover:text-foreground lg:px-3 lg:text-[14px] xl:px-3.5"
          >
            Challenges
          </Link>
          <a
            href="#blog"
            className="rounded-md px-2.5 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-subtle hover:text-foreground lg:px-3 lg:text-[14px] xl:px-3.5"
          >
            Blog
          </a>
          <Link
            to="/design"
            className="rounded-md px-2.5 py-2 text-[13px] font-medium text-foreground transition-colors hover:bg-subtle lg:px-3 lg:text-[14px] xl:px-3.5"
          >
            Design
          </Link>
        </nav>

        {/* Right — actions */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
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
          <Button
            size="sm"
            variant="accent"
            leadingIcon={<Plus />}
            className="rounded-full hidden sm:inline-flex"
            asChild
          >
            <Link to="/docs">Create</Link>
          </Button>

          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <Button
              size="sm"
              variant="secondary"
              leadingIcon={<Users />}
              className="rounded-full text-xs sm:text-sm px-2.5 sm:px-3.5 border border-border/80 shadow-xs bg-surface-elevated text-foreground hover:bg-subtle"
              asChild
            >
              <Link to="/auth" search={{ mode: "signup" }}>
                <span>Join<span className="hidden sm:inline"> the Community</span></span>
              </Link>
            </Button>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="grid size-9 place-items-center rounded-lg border border-border/60 bg-subtle/50 text-foreground md:hidden hover:bg-subtle transition-colors shrink-0"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown panel */}
      {mobileMenuOpen && (
        <div className="border-t border-border/50 bg-background/95 backdrop-blur-xl px-4 py-4 md:hidden shadow-2xl flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <Link
            to="/elements"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-foreground hover:bg-subtle transition-colors"
          >
            <span>Elements & Primitives</span>
            <ArrowRight size={14} className="text-muted-foreground" />
          </Link>
          <Link
            to="/challenges"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-foreground hover:bg-subtle transition-colors"
          >
            <span>Weekly Challenges</span>
            <ArrowRight size={14} className="text-muted-foreground" />
          </Link>
          <Link
            to="/docs"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-foreground hover:bg-subtle transition-colors"
          >
            <span>Documentation & Setup</span>
            <ArrowRight size={14} className="text-muted-foreground" />
          </Link>
          <Link
            to="/design"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-foreground hover:bg-subtle transition-colors"
          >
            <span>Design Studio</span>
            <ArrowRight size={14} className="text-muted-foreground" />
          </Link>
          <a
            href="#blog"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-foreground hover:bg-subtle transition-colors"
          >
            <span>Blog & Updates</span>
            <ArrowRight size={14} className="text-muted-foreground" />
          </a>
          {!isAuthenticated && (
            <div className="mt-2 pt-2 border-t border-border/40">
              <Link
                to="/auth"
                search={{ mode: "signin" }}
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground shadow-md transition-all active:scale-[0.99]"
              >
                Sign In to Novix UI
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

function NovaMark() {
  return (
    <div
      aria-hidden
      className="grid size-7 place-items-center rounded-[9px] nova-orb text-white shadow-sm"
    >
      <Sparkles size={13} className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]" />
    </div>
  );
}

/* ────────────────────────────── Hero ────────────────────────────── */

function Hero() {
  const reduce = useReducedMotion();
  const categories = ["Buttons", "Loaders", "Inputs", "Cards", "Toggles"];
  return (
    <section className="relative overflow-hidden bg-background text-foreground dark:text-zinc-100">
      {/* Theme-aware base gradient — soft light wash in light mode, deep vignette in dark */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_0%,#f5f5f7_0%,#fafafa_55%,#ffffff_100%)] dark:bg-[radial-gradient(ellipse_90%_60%_at_50%_0%,#141414_0%,#0a0a0a_55%,#050505_100%)]"
      />
      {/* Deep vignette — dark only */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden dark:block bg-[#050505]" style={{ maskImage: "radial-gradient(ellipse 80% 70% at 50% 20%, transparent 40%, #000 100%)", WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 20%, transparent 40%, #000 100%)" }} />
      {/* Slow drifting aurora #1 */}
      <div aria-hidden className="pointer-events-none absolute -top-32 left-1/4 h-[480px] w-[720px] rounded-full opacity-30 blur-[140px] dark:opacity-40" style={{ background: "radial-gradient(circle, rgba(56,189,248,0.22), transparent 70%)", animation: reduce ? undefined : "nova-hero-drift-a 22s ease-in-out infinite" }} />
      {/* Slow drifting aurora #2 */}
      <div aria-hidden className="pointer-events-none absolute top-20 right-1/4 h-[420px] w-[620px] rounded-full opacity-25 blur-[140px] dark:opacity-30" style={{ background: "radial-gradient(circle, rgba(168,85,247,0.18), transparent 70%)", animation: reduce ? undefined : "nova-hero-drift-b 28s ease-in-out infinite" }} />
      {/* Technical grid backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] dark:opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "34px 34px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, #000 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, #000 40%, transparent 100%)",
          color: "var(--foreground)",
        }}
      />
      {/* Subtle grain — dark only (looks noisy on white) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden dark:block opacity-[0.05] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")" }} />
      <style>{`
        @keyframes nova-hero-drift-a { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(40px,20px) scale(1.08); } }
      `}</style>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger(0.08, 0.09)}
        className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 pb-20 pt-24 text-center md:pt-32"
      >
        {/* Badge */}
        <motion.div variants={fadeRise} className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.04]">
            <span className="relative flex h-2 w-2">
              {!reduce && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-500 opacity-60" />
              )}
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
            </span>
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-600 dark:text-zinc-400">
              v2.4.0 · Live Elements
            </span>
          </div>

        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeRise}
          className="max-w-3xl text-balance font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-zinc-900 dark:text-white md:text-6xl"
        >
          The Largest Library of
          <br />
          <span className="bg-gradient-to-b from-zinc-900 to-zinc-500 bg-clip-text text-transparent dark:from-white dark:to-zinc-500">
            Premium UI Elements
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={fadeRise}
          className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-zinc-600 dark:text-zinc-400 md:text-lg"
        >
          A community-crafted ecosystem of 2,000+ copy-paste React components.
          Designed for speed, built for developers.
        </motion.p>

        {/* Search / Command Palette */}
        <motion.div variants={fadeRise} className="group relative mt-10 w-full max-w-2xl">
          <div
            aria-hidden
            className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-0 blur transition duration-500 group-focus-within:opacity-100"
          />
          <div className="relative flex items-center gap-3 rounded-xl border border-black/10 bg-white p-2 pl-5 shadow-xl transition-colors duration-300 group-focus-within:border-cyan-500/50 dark:border-white/10 dark:bg-[#121212] dark:shadow-2xl">
            <Search size={18} className="shrink-0 text-zinc-500" />
            <input
              type="text"
              placeholder="Search 2,000+ components (e.g. glassmorphism buttons)"
              className="h-10 flex-1 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-500 dark:text-white dark:placeholder:text-zinc-600 md:text-base"
            />
            <div className="hidden items-center gap-1.5 md:flex">
              <kbd className="rounded border border-black/10 bg-zinc-100 px-2 py-1 font-mono text-[10px] text-zinc-600 dark:border-white/10 dark:bg-[#1a1a1a] dark:text-zinc-500">
                CMD
              </kbd>
              <kbd className="rounded border border-black/10 bg-zinc-100 px-2 py-1 font-mono text-[10px] text-zinc-600 dark:border-white/10 dark:bg-[#1a1a1a] dark:text-zinc-500">
                K
              </kbd>
            </div>
            <Link
              to="/docs"
              className="ml-1 hidden items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 sm:inline-flex"
            >
              Search
              <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>

        {/* Category pills */}
        <motion.div
          variants={fadeRise}
          className="mt-8 flex flex-wrap items-center justify-center gap-2"
        >
          {categories.map((c) => (
            <button
              key={c}
              className="cursor-pointer rounded-lg border border-black/10 bg-black/[0.03] px-4 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-black/[0.06] hover:text-zinc-900 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
            >
              {c}
            </button>
          ))}
          <button className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-medium text-cyan-700 transition-colors hover:bg-cyan-500/20 dark:border-cyan-500/20 dark:text-cyan-400">
            <span className="h-1 w-1 rounded-full bg-cyan-500 dark:bg-cyan-400" />
            Newest Elements
          </button>
        </motion.div>


        {/* Bottom density lead-in — premium mini previews without any obscuring masks */}
        <motion.div
          variants={fadeRise}
          className="mt-14 grid w-full grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6"
        >
          {[
            // 1. Orbit dot
            (<div className="relative size-6"><span className="absolute inset-0 rounded-full border border-cyan-400/40" /><span className="absolute left-1/2 top-0 -ml-1 size-2 rounded-full bg-cyan-300 shadow-[0_0_10px_#22d3ee] motion-safe:animate-[nova-lead-orbit_3s_linear_infinite]" style={{ transformOrigin: "0 12px" }} /></div>),
            // 2. Aurora orb
            (<div className="relative size-7 rounded-full overflow-hidden ring-1 ring-white/15"><span className="absolute inset-0 motion-safe:animate-[nova-lead-spin_5s_linear_infinite]" style={{ background: "conic-gradient(from 0deg, #22d3ee, #a78bfa, #f472b6, #22d3ee)" }} /><span className="absolute inset-[3px] rounded-full bg-[#0b0b0b]" /><span className="absolute inset-0 rounded-full shadow-[inset_0_0_10px_rgba(255,255,255,0.15)]" /></div>),
            // 3. Pulse ring
            (<div className="relative size-6"><span className="absolute inset-0 rounded-full bg-emerald-400/20 motion-safe:animate-[nova-lead-pulse_2s_ease-out_infinite]" /><span className="absolute inset-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" /></div>),
            // 4. Sparkline — 3D floating chart
            (
              <div className="relative h-8 w-12 [perspective:220px]">
                <div
                  className="relative h-full w-full motion-safe:animate-[nova-lead-tilt_5.2s_ease-in-out_infinite]"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <span
                    aria-hidden
                    className="absolute inset-x-1 -bottom-0.5 h-1 rounded-full bg-cyan-400/30 blur-[3px] motion-safe:animate-[nova-lead-glow_5.2s_ease-in-out_infinite]"
                  />
                  <svg viewBox="0 0 40 20" className="absolute inset-0 h-full w-full overflow-visible drop-shadow-[0_2px_6px_rgba(34,211,238,0.35)]">
                    <defs>
                      <linearGradient id="lead-g" x1="0" x2="1">
                        <stop offset="0" stopColor="#22d3ee" />
                        <stop offset="1" stopColor="#a78bfa" />
                      </linearGradient>
                      <linearGradient id="lead-g-fill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0" stopColor="#a78bfa" stopOpacity="0.35" />
                        <stop offset="1" stopColor="#22d3ee" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M0 14 L8 8 L16 12 L24 4 L32 10 L40 6 L40 20 L0 20 Z" fill="url(#lead-g-fill)" />
                    <path
                      d="M0 14 L8 8 L16 12 L24 4 L32 10 L40 6"
                      fill="none"
                      stroke="url(#lead-g)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="60"
                      strokeDashoffset="60"
                      className="motion-safe:animate-[nova-lead-draw_3.6s_ease-in-out_infinite]"
                    />
                    <circle r="1.4" fill="#fff" className="motion-safe:animate-[nova-lead-trace_3.6s_ease-in-out_infinite]">
                      <animateMotion dur="3.6s" repeatCount="indefinite" path="M0 14 L8 8 L16 12 L24 4 L32 10 L40 6" />
                    </circle>
                  </svg>
                </div>
              </div>
            ),
            // 5. Toggle
            (<span className="inline-flex h-3.5 w-7 items-center rounded-full bg-white/10 p-0.5"><span className="size-2.5 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.6)] motion-safe:animate-[nova-lead-toggle_2.8s_ease-in-out_infinite]" /></span>),
            // 6. Caret
            (<span className="inline-flex items-center gap-0.5 font-mono text-[10px] text-zinc-300">Novix<span className="ml-0.5 inline-block h-3 w-[2px] bg-cyan-300 motion-safe:animate-[nova-lead-caret_1s_steps(1)_infinite]" /></span>),
          ].map((el, i) => (
            <div
              key={i}
              className="group relative flex h-14 items-center justify-center overflow-hidden rounded-xl border border-black/10 bg-zinc-950 text-white shadow-md transition-all duration-300 hover:border-cyan-400/50 hover:shadow-[0_0_20px_-4px_rgba(34,211,238,0.35)] dark:border-white/10 dark:bg-[#0b0b0b]"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -inset-x-full top-0 h-full -translate-x-full bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.08),transparent)] transition-transform duration-1000 group-hover:translate-x-full"
              />
              {el}
            </div>
          ))}
        </motion.div>
        <style>{`
          @keyframes nova-lead-orbit { to { transform: rotate(360deg); } }
          @keyframes nova-lead-spin { to { transform: rotate(360deg); } }
          @keyframes nova-lead-eq { 0%,100% { height: 25%; } 50% { height: 95%; } }
          @keyframes nova-lead-pulse { 0% { transform: scale(0.6); opacity: 0.8; } 100% { transform: scale(2); opacity: 0; } }
          @keyframes nova-lead-toggle { 0%,100% { transform: translateX(0); } 50% { transform: translateX(14px); } }
          @keyframes nova-lead-caret { 0%,50% { opacity: 1; } 51%,100% { opacity: 0; } }
          @keyframes nova-lead-tilt {
            0%,100% { transform: rotateX(18deg) rotateY(-16deg) translateZ(0); }
            50% { transform: rotateX(10deg) rotateY(18deg) translateZ(6px); }
          }
          @keyframes nova-lead-draw {
            0% { stroke-dashoffset: 60; }
            60%,100% { stroke-dashoffset: 0; }
          }
          @keyframes nova-lead-glow {
            0%,100% { opacity: 0.35; transform: scaleX(0.9); }
            50% { opacity: 0.7; transform: scaleX(1.1); }
          }
        `}</style>
      </motion.div>
    </section>
  );
}


function PreviewTile({ children, label }: { children: ReactNode; label: string }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group relative flex h-40 flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border border-border/70 bg-surface/60 p-4 backdrop-blur-xl shadow-[0_1px_0_0_color-mix(in_oklab,var(--foreground)_6%,transparent)_inset,0_20px_50px_-20px_rgba(0,0,0,0.35)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-foreground/30 to-transparent"
      />
      <div className="flex flex-1 items-center justify-center">{children}</div>
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
    </motion.div>
  );
}

function BentoTile({
  children,
  className = "",
  tone,
}: {
  children: ReactNode;
  className?: string;
  tone?: "accent";
}) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={
        "group relative overflow-hidden rounded-2xl border border-border/70 bg-surface/70 p-4 backdrop-blur-xl " +
        "shadow-[0_1px_0_0_color-mix(in_oklab,var(--foreground)_6%,transparent)_inset,0_20px_50px_-20px_rgba(0,0,0,0.35)] " +
        className
      }
    >
      {tone === "accent" && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(120% 80% at 100% 0%, color-mix(in oklab, var(--accent) 22%, transparent), transparent 60%)",
          }}
        />
      )}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-foreground/30 to-transparent"
      />
      <div className="relative h-full">{children}</div>
    </motion.div>
  );
}

function OrbitDot() {
  const reduce = useReducedMotion();
  return (
    <div className="relative size-20">
      <div className="absolute inset-0 rounded-full border border-border/70" />
      <div className="absolute inset-2 rounded-full border border-border/50" />
      <motion.div
        aria-hidden
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 2.4, ease: "linear", repeat: Infinity }}
        className="absolute inset-0"
      >
        <span className="absolute left-1/2 top-0 size-2.5 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_18px_var(--accent)]" />
      </motion.div>
      <motion.div
        aria-hidden
        animate={reduce ? undefined : { rotate: -360 }}
        transition={{ duration: 3.6, ease: "linear", repeat: Infinity }}
        className="absolute inset-2"
      >
        <span className="absolute left-1/2 top-0 size-1.5 -translate-x-1/2 rounded-full bg-foreground/70" />
      </motion.div>
    </div>
  );
}

function NeonSwitch() {
  const [on, setOn] = useState(true);
  return (
    <button
      onClick={() => setOn((v) => !v)}
      aria-pressed={on}
      className={
        "relative h-9 w-16 rounded-full border transition-colors duration-300 " +
        (on
          ? "border-accent/60 bg-accent/20 shadow-[0_0_28px_-6px_var(--accent)]"
          : "border-border bg-subtle")
      }
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={
          "absolute top-1 size-7 rounded-full " +
          (on
            ? "left-8 bg-accent shadow-[0_0_18px_var(--accent)]"
            : "left-1 bg-foreground/80")
        }
      />
    </button>
  );
}

function HeroSearch() {
  return (
    <div className="group relative flex h-11 w-full max-w-sm items-center gap-2 rounded-md border border-border bg-surface/70 pl-3 pr-1.5 backdrop-blur transition-all duration-200 focus-within:border-accent focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--accent)_18%,transparent)] hover:-translate-y-px">
      <Search size={15} className="text-muted-foreground" />
      <input
        type="text"
        placeholder="Search 12,480 elements…"
        className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
      />
      <KbdSequence keys={["⌘", "K"]} />
    </div>
  );
}

function Sparkline() {
  const reduce = useReducedMotion();
  const points =
    "0,44 20,38 40,42 60,30 80,34 100,22 120,26 140,14 160,20 180,10 200,16 220,6";
  const coords = points.split(" ").map((p) => p.split(",").map(Number) as [number, number]);
  const last = coords[coords.length - 1];

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const springCfg = { stiffness: 180, damping: 18, mass: 0.4 };
  const rotateX = useSpring(rx, springCfg);
  const rotateY = useSpring(ry, springCfg);
  const glowX = useTransform(ry, [-12, 12], ["30%", "70%"]);
  const glowY = useTransform(rx, [-12, 12], ["70%", "30%"]);

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * 18);
    rx.set(-py * 12);
  };
  const handleLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{ perspective: 900, transformStyle: "preserve-3d" }}
      className="relative"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative"
      >
        <motion.div
          aria-hidden
          style={{
            background: useTransform(
              [glowX, glowY] as never,
              ([x, y]: [string, string]) =>
                `radial-gradient(60% 60% at ${x} ${y}, color-mix(in oklab, var(--accent) 40%, transparent), transparent 70%)`,
            ),
            transform: "translateZ(-20px)",
          }}
          className="pointer-events-none absolute inset-0 rounded-md opacity-70 blur-2xl"
        />

        <svg
          viewBox="0 0 220 60"
          className="relative h-24 w-full"
          style={{ transform: "translateZ(30px)" }}
        >
          <defs>
            <linearGradient id="nv-line" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.25" />
              <stop offset="50%" stopColor="var(--accent)" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.35" />
            </linearGradient>
            <linearGradient id="nv-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.42" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="nv-sheen" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="50%" stopColor="white" stopOpacity="0.9" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <filter id="nv-glow" x="-20%" y="-40%" width="140%" height="180%">
              <feGaussianBlur stdDeviation="2.4" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <pattern id="nv-grid" width="20" height="15" patternUnits="userSpaceOnUse">
              <path
                d="M20 0H0V15"
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.08"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect x="0" y="0" width="220" height="60" fill="url(#nv-grid)" className="text-foreground" />
          <motion.polyline
            initial={{ opacity: 0 }}
            animate={{ opacity: reduce ? 0 : 0.35 }}
            transition={{ duration: 1.2, delay: 1 }}
            fill="none"
            stroke="var(--accent)"
            strokeOpacity="0.25"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
            style={{ filter: "blur(4px)", transform: "translate(0px, 4px)" }}
          />
          <motion.polygon
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 1.4 }}
            fill="url(#nv-fill)"
            points={`${points} 220,60 0,60`}
          />
          <motion.polyline
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
            fill="none"
            stroke="url(#nv-line)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
            filter="url(#nv-glow)"
          />
          {!reduce && (
            <motion.polyline
              fill="none"
              stroke="url(#nv-sheen)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
              strokeDasharray="24 260"
              initial={{ strokeDashoffset: 300 }}
              animate={{ strokeDashoffset: -300 }}
              transition={{ duration: 3.4, repeat: Infinity, ease: "linear", delay: 2 }}
            />
          )}
          <motion.circle
            cx={last[0]}
            cy={last[1]}
            r="3.5"
            fill="var(--accent)"
            filter="url(#nv-glow)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 2.2, type: "spring", stiffness: 260, damping: 14 }}
          />
          {!reduce && (
            <motion.circle
              cx={last[0]}
              cy={last[1]}
              r="3.5"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1.2"
              initial={{ opacity: 0.7, scale: 1 }}
              animate={{ opacity: 0, scale: 3.2 }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 2.4 }}
            />
          )}
        </svg>
      </motion.div>
    </motion.div>
  );
}








function ElementsMosaic() {
  const navigate = useNavigate();

  return (
    <section
      id="mosaic"
      className="relative border-t border-border/60 bg-background text-foreground dark:bg-[#050505] dark:text-white"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60 dark:opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklab, currentColor 6%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, currentColor 6%, transparent) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse at center, black 50%, transparent 85%)",
        }}
      />
      {/* subtle aurora accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-16 h-[420px] opacity-40 motion-safe:animate-[nova-mosaic-drift_18s_ease-in-out_infinite]"
        style={{
          background:
            "radial-gradient(60% 60% at 20% 30%, color-mix(in oklab, var(--accent) 14%, transparent), transparent 60%), radial-gradient(50% 50% at 80% 20%, color-mix(in oklab, var(--primary) 12%, transparent), transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 py-20">

        <div className="relative grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
          {MOSAIC_TILES.map((t, i) => (
            <div
              key={t.id}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate({ to: "/elements", search: { category: t.category, tile: t.id } });
                }
              }}
              onClick={(e) => {
                const el = e.currentTarget;
                const rect = el.getBoundingClientRect();
                el.style.setProperty("--rx", `${e.clientX - rect.left}px`);
                el.style.setProperty("--ry", `${e.clientY - rect.top}px`);
                el.classList.remove("is-active", "is-pressed");
                void el.offsetWidth;
                el.classList.add("is-active", "is-pressed");
                window.setTimeout(() => el.classList.remove("is-pressed"), 260);
                window.setTimeout(() => {
                  el.classList.remove("is-active");
                  navigate({ to: "/elements", search: { category: t.category, tile: t.id } });
                }, 260);
              }}

              className="group is-hoverable cursor-pointer relative flex h-40 items-center justify-center overflow-hidden rounded-2xl bg-[#0b0b0b] text-left ring-1 ring-white/10 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1 hover:ring-accent/50 hover:shadow-[0_24px_60px_-20px_color-mix(in_oklab,var(--accent)_65%,transparent)] [&.is-active]:-translate-y-1 [&.is-active]:ring-accent/60 [&.is-active]:shadow-[0_24px_60px_-20px_color-mix(in_oklab,var(--accent)_65%,transparent)] [&.is-pressed]:!translate-y-0 [&.is-pressed]:!scale-[.97] motion-safe:animate-[nova-mosaic-rise_.7s_ease-out_both] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              style={{ animationDelay: `${(i % 14) * 40}ms` }}
            >
              {/* subtle inner gradient for depth (both themes) */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-70"
                style={{
                  background:
                    "radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,0.06), transparent 60%)",
                }}
              />
              {/* halo on hover / click */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-[.is-active]:opacity-100"
                style={{
                  background:
                    "radial-gradient(60% 60% at 50% 40%, color-mix(in oklab, var(--accent) 28%, transparent), transparent 70%)",
                }}
              />
              {/* shimmer sweep */}
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-x-8 -top-1 h-full -translate-x-full skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full group-[.is-active]:translate-x-full"
              />
              {/* click ripple emanating from cursor */}
              <span
                aria-hidden
                className="pointer-events-none absolute left-[var(--rx,50%)] top-[var(--ry,50%)] block h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 group-[.is-active]:opacity-100 group-[.is-active]:motion-safe:animate-[nova-mosaic-ripple_.9s_ease-out_forwards]"
                style={{
                  background:
                    "radial-gradient(circle, color-mix(in oklab, var(--accent) 70%, transparent) 0%, color-mix(in oklab, var(--accent) 30%, transparent) 40%, transparent 70%)",
                  boxShadow: "0 0 30px color-mix(in oklab, var(--accent) 60%, transparent)",
                }}
              />
              {/* moon-edge top highlight */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />

              <div className="relative transition-transform duration-500 group-hover:scale-[1.06] group-[.is-active]:scale-[1.06]">
                {t.render()}
              </div>

              {/* Get code — bottom-right hover/active reveal */}
              <span
                aria-hidden
                className="pointer-events-none absolute bottom-2 right-2 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium text-white/85 opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-[.is-active]:opacity-100 group-[.is-active]:translate-y-0"
              >
                <span className="font-mono text-white/70">{"</>"}</span>
                Get code
              </span>
            </div>

          ))}
        </div>


        {/* Browse all elements CTA */}
        <div className="relative mt-8 flex justify-center">
          <Link
            to="/elements"
            search={{ category: "All", tag: "All", q: "", sort: "Featured", tile: "" }}
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_50px_-15px_color-mix(in_oklab,var(--accent)_70%,transparent)] transition-transform hover:-translate-y-0.5"
            style={{
              backgroundImage:
                "linear-gradient(120deg, color-mix(in oklab, var(--accent) 100%, transparent), color-mix(in oklab, var(--primary) 90%, transparent), color-mix(in oklab, var(--accent) 100%, transparent))",
              backgroundSize: "200% 100%",
              animation: "nova-mosaic-shine 5s linear infinite",
            }}
          >
            <Rocket size={16} className="transition-transform duration-500 group-hover:rotate-[-12deg] group-hover:translate-x-0.5" />
            Browse all elements
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"
            />
          </Link>
        </div>
      </div>

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
        @keyframes nova-mosaic-shine {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes nova-mosaic-words {
          0%, 16%   { transform: translateY(0); }
          20%, 36%  { transform: translateY(-100%); }
          40%, 56%  { transform: translateY(-200%); }
          60%, 76%  { transform: translateY(-300%); }
          80%, 100% { transform: translateY(-400%); }
        }
        @keyframes nova-mosaic-drift {
          0%, 100% { transform: translate3d(0,0,0); }
          50% { transform: translate3d(0,-10px,0); }
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
          [style*="nova-mosaic-shine"], [style*="nova-mosaic-drift"], [style*="nova-neon-pulse"] { animation: none !important; }
        }

      `}</style>
    </section>
  );
}


/* ────────────────────────────── Creations Gallery (uiverse-style) ────────────────────────────── */

function CreationsGallery() {
  const [active, setActive] = useState<Category>("All");
  const items = useMemo(
    () => (active === "All" ? CREATIONS : CREATIONS.filter((c) => c.category === active)),
    [active],
  );
  return (
    <section id="elements" className="relative border-t border-white/5 bg-background text-foreground dark:bg-[#050505] dark:text-white">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
              Elements · Community
            </p>
            <h2 className="mt-3 text-balance font-display text-3xl font-semibold leading-tight tracking-[-0.02em] md:text-4xl">
              Copy the one you love. Remix the rest.
            </h2>
            <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
              Every tile is a real, working element. Hover to interact. Tap copy and
              paste it into your project.
            </p>
          </div>
          <div className="flex flex-nowrap gap-1.5 overflow-x-auto rounded-full border border-border/60 bg-surface/40 p-1 backdrop-blur">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={
                  "relative rounded-full px-3 py-1.5 text-xs font-medium transition-colors " +
                  (active === c
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground")
                }
              >
                {active === c && (
                  <motion.span
                    layoutId="cat-pill"
                    className="absolute inset-0 rounded-full bg-accent/15 ring-1 ring-accent/40"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">{c}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((c, i) => (
            <CreationTile key={c.id} creation={c} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────── Community strip ────────────────────────────── */

function CommunityStrip() {
  const stats = [
    { value: "12,480", label: "Elements", accent: "from-fuchsia-500/40 via-pink-500/20 to-transparent", glyph: "◈" },
    { value: "3,240", label: "Creators", accent: "from-violet-500/40 via-indigo-500/20 to-transparent", glyph: "✦" },
    { value: "182K", label: "Monthly copies", accent: "from-cyan-400/40 via-sky-500/20 to-transparent", glyph: "❖" },
    { value: "MIT", label: "Free forever", accent: "from-amber-400/40 via-orange-500/20 to-transparent", glyph: "✺" },
  ];
  const sectionRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [scrollP, setScrollP] = useState(0); // -1..1 based on viewport center

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setVisible(true)),
      { threshold: 0.2 }
    );
    io.observe(el);
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        const center = r.top + r.height / 2;
        const p = Math.max(-1, Math.min(1, (center - vh / 2) / (vh / 2)));
        setScrollP(p);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="community"
      className="relative overflow-hidden bg-background text-foreground dark:bg-[#050505] dark:text-white"
      style={{ perspective: "1400px" }}
    >
      {/* Ambient scroll-parallax aurora */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(60% 50% at 20% 40%, rgba(236,72,153,0.10), transparent 60%), radial-gradient(50% 45% at 80% 60%, rgba(99,102,241,0.12), transparent 60%), radial-gradient(40% 40% at 50% 20%, rgba(56,189,248,0.08), transparent 60%)",
          transform: `translate3d(0, ${scrollP * -30}px, 0)`,
          transition: "transform 120ms linear",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-6 py-24">
        <div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(${scrollP * 6}deg)`,
            transition: "transform 200ms ease-out",
          }}
        >
          {stats.map((s, i) => {
            const delay = i * 90;
            const depth = 20 + i * 6;
            return (
              <div
                key={s.label}
                className="group relative"
                style={{
                  transformStyle: "preserve-3d",
                  transform: visible
                    ? `translate3d(0, ${scrollP * -depth}px, 0) rotateY(${scrollP * (i % 2 === 0 ? 4 : -4)}deg)`
                    : "translate3d(0, 40px, -60px) rotateX(-14deg)",
                  opacity: visible ? 1 : 0,
                  transition: `transform 900ms cubic-bezier(.2,.8,.2,1) ${delay}ms, opacity 700ms ease-out ${delay}ms`,
                  willChange: "transform",
                }}
              >
                {/* Halo shadow behind card */}
                <div
                  aria-hidden
                  className={`absolute -inset-2 -z-10 rounded-3xl bg-gradient-to-br ${s.accent} blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500`}
                />
                <div
                  className="relative h-full overflow-hidden rounded-2xl border border-border/60 bg-background/80 p-6 backdrop-blur-xl"
                  style={{
                    boxShadow:
                      "0 1px 0 rgba(255,255,255,0.06) inset, 0 20px 40px -20px rgba(0,0,0,0.5), 0 8px 24px -12px rgba(0,0,0,0.4)",
                  }}
                >
                  {/* Moon-edge top highlight */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent dark:via-white/40"
                  />
                  {/* Sheen sweep on hover */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full"
                  />
                  {/* Floating glyph */}
                  <div
                    aria-hidden
                    className="absolute right-4 top-4 select-none font-display text-3xl text-foreground/10 transition-transform duration-500 group-hover:scale-110"
                    style={{ transform: `translateZ(30px)` }}
                  >
                    {s.glyph}
                  </div>
                  <div
                    className="font-display text-4xl font-semibold tracking-tight md:text-5xl"
                    style={{ transform: "translateZ(40px)" }}
                  >
                    <span className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                      {s.value}
                    </span>
                  </div>
                  <div
                    className="mt-3 text-sm text-muted-foreground"
                    style={{ transform: "translateZ(20px)" }}
                  >
                    {s.label}
                  </div>
                  {/* Bottom accent bar */}
                  <div
                    aria-hidden
                    className={`pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r ${s.accent}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


/* ────────────────────────────── CTA ────────────────────────────── */

function CallToCreate() {
  return (
    <section id="challenges" className="border-t border-border/60">
      <div className="mx-auto max-w-4xl px-6 py-24 text-center">
        <Badge variant="accent" dot className="font-mono">
          Weekly challenge · #042
        </Badge>
        <h2 className="mt-6 text-balance font-display text-4xl font-semibold tracking-[-0.02em] md:text-5xl">
          Design the button of the week.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
          Submit your creation. The community votes. The winner ships on the home page
          and earns a spot in the Hall of Craft.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" leadingIcon={<Sparkles />} asChild>
            <Link to="/challenges">Submit an element</Link>
          </Button>
          <Button size="lg" variant="secondary" trailingIcon={<ArrowRight />} asChild>
            <Link to="/challenges">Browse challenges</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}




/* ────────────────────────────── Footer ────────────────────────────── */

function Footer() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail("");
      setSubscribed(false);
    }, 4000);
  };

  const cols: {
    title: string;
    links: { label: string; href: string; badge?: string; external?: boolean }[];
  }[] = [
    {
      title: "Product",
      links: [
        { label: "Components", href: "/docs/components" },
        { label: "Elements gallery", href: "/elements", badge: "365" },
        { label: "Templates", href: "/docs/templates" },
        { label: "Recipes", href: "/docs/recipes" },
        { label: "Effects", href: "/docs/effects" },
        { label: "Showcase", href: "/docs/showcase" },
      ],
    },
    {
      title: "Docs",
      links: [
        { label: "Introduction", href: "/docs" },
        { label: "Installation", href: "/docs/installation" },
        { label: "Quick start", href: "/docs/quick-start" },
        { label: "Theming", href: "/docs/theming" },
        { label: "Design tokens", href: "/docs/tokens/colors" },
        { label: "Motion", href: "/docs/motion" },
        { label: "CLI", href: "/docs/cli", badge: "beta" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Design principles", href: "/docs/design-principles" },
        { label: "Accessibility", href: "/docs/accessibility" },
        { label: "Playground", href: "/docs/playground" },
        { label: "Migration guides", href: "/docs/migration" },
        { label: "Roadmap", href: "/docs/roadmap" },
        { label: "Changelog", href: "/docs/changelog" },
        { label: "FAQ", href: "/docs/faq" },
      ],
    },
    {
      title: "Community",
      links: [
        { label: "GitHub", href: "https://github.com", external: true },
        { label: "Discord", href: "https://discord.com", external: true },
        { label: "Twitter / X", href: "https://x.com", external: true },
        { label: "Discussions", href: "https://github.com", external: true },
        { label: "Contribute", href: "/docs/guides" },
        { label: "Report a bug", href: "https://github.com", external: true },
      ],
    },
  ];

  const frameworks = [
    { name: "React 19", href: "/docs/quick-start" },
    { name: "Next.js", href: "/docs/installation" },
    { name: "Remix", href: "/docs/installation" },
    { name: "Vite", href: "/docs/installation" },
    { name: "Astro", href: "/docs/installation" },
    { name: "TanStack", href: "/docs/installation" },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-background text-foreground dark:bg-[#050505] dark:text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[80%] -translate-x-1/2 opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in oklab, var(--accent) 30%, transparent), transparent 70%)",
        }}
      />

      {/* Newsletter / CTA strip */}
      <div className="relative border-b border-white/5">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-12 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400">
              <Sparkles className="size-3" />
              The changelog
            </div>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
              New components, every week.
            </h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-400">
              Get a hand-picked drop of premium primitives, effects and templates delivered to your inbox. No spam, unsubscribe anytime.
            </p>
          </div>
          <form
            onSubmit={handleSubscribe}
            className="flex w-full flex-col gap-2 sm:flex-row"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <div className="relative flex-1">
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white placeholder:text-zinc-500 outline-none transition-colors focus:border-white/25 focus:bg-white/[0.05]"
              />
            </div>
            <Button type="submit" size="md" trailingIcon={subscribed ? undefined : <ArrowRight />}>
              {subscribed ? "Subscribed 🎉" : "Subscribe"}
            </Button>
          </form>
        </div>
      </div>

      {/* Main grid */}
      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-10 px-6 py-16 md:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div className="col-span-2 md:col-span-1">
          <div className="-ml-1 flex items-center">
            <Link to="/" className="font-display text-base font-bold tracking-tight hover:opacity-90 transition-opacity">
              novix<span className="text-accent">ui</span>
            </Link>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-400">
            The universe of premium React elements. Open source, community-crafted, obsessively polished.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Button asChild variant="secondary" size="sm" trailingIcon={<ArrowRight />}>
              <Link to="/docs">Read docs</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" leadingIcon={<Github />}>
              <a href="https://github.com" target="_blank" rel="noreferrer noopener">
                Star on GitHub
              </a>
            </Button>
          </div>
          <div className="mt-6">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              Works with
            </div>
            <div className="flex flex-wrap gap-1.5">
              {frameworks.map((f) => (
                <Link
                  key={f.name}
                  to={f.href}
                  className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-[10px] text-zinc-400 transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                >
                  {f.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">
              {col.title}
            </div>
            <ul className="space-y-2">
              {col.links.map((l) => {
                const content = (
                  <span className="inline-flex items-center gap-1.5">
                    <span>{l.label}</span>
                    {l.badge && (
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-zinc-400">
                        {l.badge}
                      </span>
                    )}
                  </span>
                );
                return (
                  <li key={l.label}>
                    {l.external ? (
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-sm text-zinc-400 transition-colors hover:text-white"
                      >
                        {content}
                      </a>
                    ) : (
                      <Link
                        to={l.href}
                        className="text-sm text-zinc-400 transition-colors hover:text-white"
                      >
                        {content}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Wordmark band */}
      <div
        aria-hidden
        className="relative select-none overflow-hidden border-t border-white/5"
      >
        <div className="pointer-events-none mx-auto max-w-[1400px] px-6 py-8">
          <div
            className="bg-clip-text text-center text-[18vw] font-semibold leading-none tracking-tighter text-transparent md:text-[13rem]"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 60%, transparent 100%)",
            }}
          >
            novix<span className="text-accent">ui</span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-6 py-6 text-xs text-zinc-500 md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span>© {new Date().getFullYear()} Novix UI</span>
            <Link to="/docs" className="transition-colors hover:text-zinc-300">
              MIT License
            </Link>
            <Link to="/docs/accessibility" className="transition-colors hover:text-zinc-300">
              Accessibility
            </Link>
            <Link to="/docs/faq" className="transition-colors hover:text-zinc-300">
              Privacy
            </Link>
            <Link to="/docs/faq" className="transition-colors hover:text-zinc-300">
              Terms
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="inline-flex items-center gap-1.5">
              Made with <Heart className="size-3 fill-rose-400 text-rose-400" /> by the community
            </span>
            <span className="hidden text-zinc-700 md:inline">·</span>
            <Link
              to="/docs/changelog"
              className="font-mono transition-colors hover:text-zinc-300"
            >
              v2.4.0
            </Link>
            <span className="hidden text-zinc-700 md:inline">·</span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-zinc-300"
            >
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              </span>
              All systems normal
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
