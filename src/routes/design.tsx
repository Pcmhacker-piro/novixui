import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import JSZip from "jszip";
import { System, SYSTEMS, buildServiceSite } from "@/data/design-systems";
import {
  ChevronDown,
  ChevronsLeftRight,
  Code2,
  Download,
  Github,
  MessageSquare,
  Quote,
  Sparkles,
  Twitter,
  X as XIcon,
  Check as CheckIcon,
  Menu,
  Sun,
  Moon,
} from "lucide-react";
import { IconButton, useTheme } from "@/nova";

export const Route = createFileRoute("/design")({
  head: () => ({
    meta: [
      { title: "Design — Framework-agnostic design systems for AI-assisted products · Novix UI" },
      {
        name: "description",
        content:
          "Drop a design system into any codebase and your coding agent instantly knows how to build consistent, polished interfaces.",
      },
      { property: "og:title", content: "Novix UI Design — AI-first design systems" },
      {
        property: "og:description",
        content:
          "Framework-agnostic design systems with portable CSS, DESIGN.md guidance, and components. Built for AI-assisted workflows.",
      },
    ],
  }),
  component: DesignPage,
});

/* ─────────────────────────── data ─────────────────────────── */

const TESTIMONIALS: { quote: string; name: string; org?: string; avatar: string }[] = [
  { quote: "Finally a cohesive design system that's easy to implement — I'm really enjoying the kits.", name: "david-humos", org: "Humos", avatar: "https://i.pravatar.cc/80?img=12" },
  { quote: "Amazing systems. Super helpful for collaborative coding with AI on both personal and commercial work.", name: "Emma.", avatar: "https://i.pravatar.cc/80?img=45" },
  { quote: "AI used to output ugly UIs — this finally makes them look properly professional.", name: "nick", avatar: "https://i.pravatar.cc/80?img=15" },
  { quote: "The taste is felt in every template. A beautiful, visionary project.", name: "Dahir Soriano", org: "DMXStudio", avatar: "https://i.pravatar.cc/80?img=32" },
  { quote: "As a UI designer myself, these look very professional.", name: "Marc", avatar: "https://i.pravatar.cc/80?img=8" },
  { quote: "Love the variety — excited to see how the library grows!", name: "serenaengquist", avatar: "https://i.pravatar.cc/80?img=47" },
  { quote: "Chose a bold system and the output came out surprisingly close to the template. Top!", name: "Tom B.", avatar: "https://i.pravatar.cc/80?img=52" },
  { quote: "Excellent references for building out your own UI library.", name: "David P.", avatar: "https://i.pravatar.cc/80?img=68" },
  { quote: "Really cool UI — helped me a lot.", name: "Carlos Navarro", avatar: "https://i.pravatar.cc/80?img=17" },
  { quote: "Stunned by how modern the designs are. Clean, easy to follow, simple to use.", name: "Sahil V", avatar: "https://i.pravatar.cc/80?img=22" },
  { quote: "Always looking for assets that make my life easier — this is the partner for that.", name: "Mike Lucero", org: "LPG Holdings", avatar: "https://i.pravatar.cc/80?img=36" },
  { quote: "With these systems, AI brings me closer to my final design and frees up my time.", name: "Daren Narváez", org: "HaikHosting", avatar: "https://i.pravatar.cc/80?img=41" },
  { quote: "Took our site from looking like $1 to $1M. 10/10 recommend.", name: "Seb", org: "Seicho", avatar: "https://i.pravatar.cc/80?img=59" },
];



const FAQ = [
  { q: "Does it work with front-end frameworks?", a: "Yes — everything is portable CSS plus a DESIGN.md, so it drops into React, Vue, Svelte, Astro, TanStack Start, or plain HTML without ceremony." },
  { q: "Is this a React component library?", a: "The systems are framework-agnostic tokens and guidance. Novix UI ships the accompanying React implementation, but you can wire the tokens to any framework." },
  { q: "How does it work with AI coding agents?", a: "Point Claude, Cursor, Codex or Copilot at the DESIGN.md and the tokens file. The agent instantly has a house style and stops producing generic AI slop." },
  { q: "What is included in a purchase?", a: "Design tokens, DESIGN.md, sample components, cover imagery, and a small starter kit for the front-end of your choice." },
  { q: "Can I use it in client and commercial work?", a: "Yes. License permits unlimited internal and commercial projects. Redistribution as a competing product is not allowed." },
  { q: "Do I get updates after I buy?", a: "Every system gets rolling updates for a year. Existing systems get quality passes; new systems are added regularly." },
];

/* ─────────────────────────── page ─────────────────────────── */

function DesignPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-900 antialiased dark:bg-[#050505] dark:text-white">
      <Header />
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6">
        <Hero />
        <TestimonialsMarquee />
        <SystemsGrid />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}

/* ─────────────────────────── header ─────────────────────────── */

function Header() {
  const { resolvedTheme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      className={
        "sticky top-0 z-40 w-full transition-[background,border-color,backdrop-filter] duration-300 " +
        (scrolled
          ? "border-b border-border/60 bg-background/70 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent")
      }
    >
      <div className="mx-auto flex h-16 w-full items-center justify-between px-6 lg:max-w-none lg:px-8">
        {/* Left — wordmark + Design tag */}
        <div className="flex items-center gap-2 pl-1 md:pl-2">
          <Link
            to="/"
            className="flex items-center gap-2"
          >
            <span className="font-display text-[21px] font-bold tracking-tight text-foreground">
              novix<span className="text-accent">ui</span>
            </span>
            <span
              className="ml-0.5 rounded-md bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-400 bg-clip-text px-1.5 py-0.5 font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-transparent ring-1 ring-inset ring-violet-400/30"
            >
              Design
            </span>
          </Link>
        </div>

        {/* Center — primary nav */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex lg:gap-2 xl:gap-4">
          <a
            href="#systems"
            className="rounded-md px-2.5 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-subtle hover:text-foreground lg:px-3 lg:text-[14px] xl:px-3.5"
          >
            What is DESIGN.md?
          </a>
          <a
            href="#faq"
            className="rounded-md px-2.5 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-subtle hover:text-foreground lg:px-3 lg:text-[14px] xl:px-3.5"
          >
            How to use
          </a>
          <Link
            to="/challenges"
            className="rounded-md px-2.5 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-subtle hover:text-foreground lg:px-3 lg:text-[14px] xl:px-3.5"
          >
            Challenges
          </Link>
          <Link
            to="/docs"
            className="rounded-md px-2.5 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-subtle hover:text-foreground lg:px-3 lg:text-[14px] xl:px-3.5"
          >
            Docs
          </Link>
          <Link
            to="/elements"
            className="rounded-md px-2.5 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-subtle hover:text-foreground lg:px-3 lg:text-[14px] xl:px-3.5"
          >
            Elements
          </Link>
        </nav>

        {/* Right — actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <IconButton
            aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "night"} mode`}
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
          <Link
            to="/auth"
            className="hidden h-9 items-center justify-center rounded-full border border-border/60 bg-surface/60 px-4 text-[13px] font-medium text-foreground transition-colors hover:bg-subtle sm:inline-flex"
          >
            Log in / Sign up
          </Link>
          <Link
            to="/auth"
            className="inline-flex h-9 items-center justify-center rounded-full bg-accent px-4 text-[13px] font-semibold text-accent-foreground shadow-[0_8px_24px_-8px_hsl(var(--accent)/0.6)] transition-transform hover:-translate-y-0.5 sm:hidden"
          >
            Log in
          </Link>
          <button
            className="inline-flex size-9 items-center justify-center rounded-full border border-border/60 bg-surface/60 transition-colors hover:bg-subtle md:hidden"
            aria-label="Open menu"
          >
            <Menu className="size-4" />
          </button>
        </div>
      </div>
    </header>
  );
}


/* ─────────────────────────── hero ─────────────────────────── */

function Hero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);

  useEffect(() => {
    const move = (clientX: number) => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const p = ((clientX - rect.left) / rect.width) * 100;
      setPos(Math.max(0, Math.min(100, p)));
    };
    const onMove = (e: MouseEvent) => dragging.current && move(e.clientX);
    const onTouch = (e: TouchEvent) => dragging.current && e.touches[0] && move(e.touches[0].clientX);
    const up = () => (dragging.current = false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouch);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchend", up);
    };
  }, []);

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-neutral-200/80 bg-white/90 px-6 py-10 shadow-2xl shadow-neutral-900/5 md:px-12 md:py-14 dark:border-white/10 dark:bg-black dark:shadow-black/40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70 dark:hidden"
        style={{
          backgroundImage:
            "radial-gradient(60% 40% at 15% 0%, rgba(139,92,246,0.14), transparent 60%), radial-gradient(50% 40% at 90% 20%, rgba(236,72,153,0.1), transparent 60%), radial-gradient(60% 50% at 50% 120%, rgba(56,189,248,0.08), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden opacity-70 dark:block"
        style={{
          backgroundImage:
            "radial-gradient(60% 40% at 15% 0%, rgba(139,92,246,0.28), transparent 60%), radial-gradient(50% 40% at 90% 20%, rgba(236,72,153,0.18), transparent 60%), radial-gradient(60% 50% at 50% 120%, rgba(56,189,248,0.14), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04] dark:hidden"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.6) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden opacity-[0.04] dark:block"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col items-start py-4 text-left text-neutral-900 dark:text-white">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-100/90 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-700 shadow-xs dark:border-white/15 dark:bg-white/[0.04] dark:text-white/70">
            <Sparkles className="size-3 text-violet-500 dark:text-white/70" /> Featured on Nova
          </div>

          <h1 className="text-[clamp(2.8rem,5.5vw,4.8rem)] max-w-[600px] font-semibold leading-[0.95] tracking-tight text-pretty text-neutral-950 dark:text-white">
            AI-first design
            <br />
            <span className="bg-[linear-gradient(110deg,#4f46e5_0%,#7c3aed_45%,#db2777_100%)] bg-clip-text text-transparent dark:bg-[linear-gradient(110deg,#c9d4ff_0%,#e0d4ff_45%,#f5d4e8_100%)]">
              systems
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-neutral-600 md:text-lg dark:text-white/70">
            Drop a design system into any codebase and your coding agent instantly knows how to build consistent, polished interfaces.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3 text-neutral-600 dark:text-white/70">
              <span className="font-mono text-sm text-neutral-900 dark:text-white">Works with</span>
              <div className="flex -space-x-2">
                {["C", "K", "X", "G"].map((c, i) => (
                  <span
                    key={c}
                    className="grid size-8 place-items-center rounded-full font-mono text-xs font-semibold text-white shadow-md shadow-neutral-900/10 ring-1 ring-black/10 dark:ring-white/15 dark:shadow-black/30"
                    style={{
                      background: [
                        "linear-gradient(135deg,#d97757,#8b3a1f)",
                        "linear-gradient(135deg,#ffffff,#d1d5db)",
                        "linear-gradient(135deg,#111,#333)",
                        "linear-gradient(135deg,#8b5cf6,#ec4899)",
                      ][i],
                      color: i === 1 ? "#000" : "#fff",
                    }}
                  >
                    {c}
                  </span>
                ))}
                <span className="grid size-8 place-items-center rounded-full border border-neutral-200 bg-neutral-100 font-mono text-[10px] font-semibold text-neutral-800 shadow-md ring-1 ring-black/5 dark:border-transparent dark:bg-white/10 dark:text-white dark:ring-white/15">
                  +10
                </span>
              </div>
            </div>
            <a href="#faq" className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-5 py-2.5 font-mono text-sm font-medium text-neutral-900 transition hover:bg-neutral-100 shadow-xs dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:bg-white/15">
              <Code2 className="size-4 text-neutral-600 dark:text-white/80" />
              How to use
            </a>
          </div>

          <div className="mt-8 flex flex-col items-start gap-3">
            <button className="inline-flex items-center gap-3 rounded-lg border border-neutral-900/10 bg-neutral-950 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-neutral-900/15 transition-all hover:bg-neutral-800 hover:shadow-2xl active:scale-[0.99] sm:text-base dark:border-white/20 dark:bg-[linear-gradient(110deg,#c9d4ff_0%,#e0d4ff_45%,#f5d4e8_100%)] dark:text-black dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_1px_2px_rgba(80,60,120,0.15)] dark:hover:brightness-105">
              <Sparkles className="size-5 text-amber-300 dark:text-black" />
              Claim Early Adopter Access
            </button>
            <span className="text-xs tracking-wide text-neutral-500 dark:text-white/55">50% discount applied at checkout</span>
          </div>
        </div>

        {/* Before / After compare */}
        <div className="relative">
          <div
            ref={wrapRef}
            className="group relative aspect-[4/3] w-full touch-none select-none overflow-hidden rounded-2xl border border-neutral-200/80 bg-[#050505] shadow-2xl shadow-neutral-900/10 dark:border-white/10 dark:shadow-black/60"
          >
            {/* Shared grid backdrop */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.18]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
                backgroundSize: "34px 34px",
              }}
            />

            {/* After (base) — green fintech mock */}
            <div className="absolute inset-0">
              <div
                aria-hidden
                className="absolute -right-24 -top-24 size-[420px] rounded-full opacity-30 blur-3xl"
                style={{ background: "radial-gradient(circle,#22c55e 0%,transparent 60%)" }}
              />
              {/* nav */}
              <div className="absolute inset-x-0 top-0 flex items-center justify-between px-8 pt-6">
                <div className="flex items-center gap-6 text-[11px] text-white/70">
                  <span>Features</span>
                  <span>How it works</span>
                  <span>Pricing</span>
                  <span>Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="grid size-7 place-items-center rounded-full border border-white/15 text-white/70">📞</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400 px-3 py-1.5 text-[11px] font-semibold text-black">
                    Let's Talk ↗
                  </span>
                </div>
              </div>
              {/* headline */}
              <div className="absolute left-8 right-8 top-[26%]">
                <h3 className="text-[clamp(1.4rem,3vw,2.2rem)] font-bold leading-[1.05] text-white">
                  seamless<br />smart tools
                </h3>
                <div className="mt-2 inline-block rounded-md bg-emerald-400 px-2.5 py-1 text-[clamp(1.3rem,2.8vw,2rem)] font-bold leading-none text-black">
                  modern users
                </div>
                <p className="mt-4 max-w-[85%] text-[11px] leading-relaxed text-white/60">
                  Track, save and grow savings — all from one app for everyday financial success.
                </p>
                <button className="mt-4 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-[11px] font-medium text-white">
                  See How It Works
                </button>
              </div>
              {/* stat card */}
              <div className="absolute right-6 top-[22%] w-32 rounded-xl border border-emerald-500/30 bg-black/60 p-3">
                <div className="flex items-center justify-between text-[9px] text-emerald-400">
                  <span className="inline-flex items-center gap-1"><span className="size-1.5 rounded-full bg-emerald-400" />NET INFLOW</span>
                  <span>👛</span>
                </div>
                <div className="mt-1 text-xl font-bold text-white">$24<span className="text-xs text-white/60">.8k</span></div>
                <svg viewBox="0 0 100 30" className="mt-1 h-6 w-full">
                  <path d="M0,22 L15,18 L30,20 L45,10 L60,14 L75,6 L100,8" fill="none" stroke="#22c55e" strokeWidth="1.5" />
                  <path d="M0,22 L15,18 L30,20 L45,10 L60,14 L75,6 L100,8 L100,30 L0,30 Z" fill="url(#gg)" opacity="0.4" />
                  <defs><linearGradient id="gg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#22c55e" /><stop offset="1" stopColor="transparent" /></linearGradient></defs>
                </svg>
                <div className="mt-1 text-[9px] text-emerald-400">↗ +8.6%</div>
              </div>
              {/* stats row */}
              <div className="absolute inset-x-6 bottom-16 flex items-center justify-around rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
                <div>
                  <div className="text-lg font-bold text-white">$1.8M</div>
                  <div className="text-[8px] uppercase tracking-widest text-white/50">Saved monthly</div>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div>
                  <div className="text-lg font-bold text-white">200+</div>
                  <div className="text-[8px] uppercase tracking-widest text-white/50">Countries available</div>
                </div>
              </div>
              {/* logos */}
              <div className="absolute inset-x-8 bottom-5 flex items-center justify-between text-[10px] text-white/40">
                <span>Newsweek</span>
                <span>S&amp;P <em>Global</em></span>
                <span>Bloomberg</span>
              </div>
            </div>

            {/* Before (overlay) — purple showcase mock */}
            <div
              className="absolute inset-0"
              style={{ clipPath: `polygon(0 0, ${pos}% 0, ${pos}% 100%, 0 100%)` }}
            >
              <div className="absolute inset-0 bg-[#0a0614]" />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-25"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                  backgroundSize: "34px 34px",
                }}
              />
              <div
                aria-hidden
                className="absolute -bottom-20 -left-24 size-[420px] rounded-full opacity-40 blur-3xl"
                style={{ background: "radial-gradient(circle,#8b5cf6 0%,transparent 60%)" }}
              />
              {/* logo */}
              <div className="absolute left-8 top-6 flex items-center gap-2 text-white">
                <span className="text-amber-300">✦</span>
                <span className="text-sm font-semibold">Showcase</span>
              </div>
              {/* pill */}
              <div className="absolute left-1/2 top-[22%] -translate-x-1/2 rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-[10px] text-violet-200">
                🎉 Now open to creators
              </div>
              {/* headline */}
              <div className="absolute left-8 right-8 top-[30%] text-center">
                <h3 className="text-[clamp(1.6rem,3.4vw,2.4rem)] font-bold leading-[1] text-white">
                  Put your best<br />
                  <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">spotlight</span>
                </h3>
                <p className="mx-auto mt-3 max-w-[80%] text-[10px] leading-relaxed text-white/60">
                  Showcase is the platform for designers who want their projects seen — by a community that cares.
                </p>
                <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-violet-500 to-violet-700 px-5 py-2 text-[11px] font-semibold text-white shadow-lg shadow-violet-900/50">
                  Start for free 💜
                </button>
              </div>
              {/* stats */}
              <div className="absolute inset-x-8 bottom-16 flex items-center justify-around text-center">
                <div>
                  <div className="mb-1 text-base">🌍</div>
                  <div className="text-lg font-bold text-violet-300">12k+</div>
                  <div className="text-[8px] uppercase tracking-widest text-white/50">Creators worldwide</div>
                </div>
                <div className="h-10 w-px bg-white/10" />
                <div>
                  <div className="mb-1 text-base">📁</div>
                  <div className="text-lg font-bold text-violet-300">4k+</div>
                  <div className="text-[8px] uppercase tracking-widest text-white/50">Monthly</div>
                </div>
              </div>
            </div>

            {/* Handle */}
            <div
              role="slider"
              tabIndex={0}
              aria-label="Drag to compare before and after"
              aria-valuenow={Math.round(pos)}
              className="absolute inset-y-0 z-30 flex w-12 -translate-x-1/2 cursor-ew-resize items-center justify-center outline-none"
              style={{ left: `${pos}%` }}
              onMouseDown={() => (dragging.current = true)}
              onTouchStart={() => (dragging.current = true)}
            >
              <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white shadow-[0_0_12px_rgba(255,255,255,0.4)]" />
              <div className="relative grid size-12 place-items-center rounded-full bg-white text-black shadow-2xl shadow-black/60 ring-4 ring-white/10 transition active:scale-95">
                <Code2 className="size-4" />
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between px-2">
            <span className="inline-flex flex-1 items-center justify-center gap-2 font-mono text-sm font-semibold tracking-wide text-rose-600 dark:text-red-400">
              <XIcon className="size-4" /> Before
            </span>
            <span className="inline-flex flex-1 items-center justify-center gap-2 font-mono text-sm font-semibold tracking-wide text-emerald-600 dark:text-emerald-400">
              <CheckIcon className="size-4" /> After
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── testimonials marquee ─────────────────────────── */

function TestimonialsMarquee() {
  const row = [...TESTIMONIALS, ...TESTIMONIALS];
  return (
    <section className="relative mt-16 overflow-hidden py-4">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#fafafa] to-transparent dark:from-[#050505]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#fafafa] to-transparent dark:from-[#050505]"
      />
      <div className="flex w-max gap-5 [animation:nova-marquee_60s_linear_infinite] hover:[animation-play-state:paused]">
        {row.map((t, i) => (
          <figure
            key={i}
            className="flex w-80 shrink-0 flex-col rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-white/[0.02]"
          >
            <Quote className="mb-3 size-5 rotate-180 text-neutral-400 dark:text-white/40" />
            <blockquote className="flex-1 text-sm leading-relaxed">{t.quote}</blockquote>
            <figcaption className="mt-5 flex items-center gap-3 border-t border-black/5 pt-4 dark:border-white/5">
              <img
                src={t.avatar}
                alt={t.name}
                loading="lazy"
                className="size-10 shrink-0 rounded-full object-cover ring-1 ring-black/10 dark:ring-white/10"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{t.name}</p>
                {t.org && (
                  <p className="truncate text-xs text-neutral-500 dark:text-white/50">{t.org}</p>
                )}
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
      <style>{`@keyframes nova-marquee { from { transform: translate3d(0,0,0);} to { transform: translate3d(-50%,0,0);} }`}</style>
    </section>
  );
}

/* ─────────────────────────── systems grid ─────────────────────────── */

function SystemsGrid() {
  return (
    <section id="systems" className="mt-16 scroll-mt-16">
      <div className="mb-8 flex items-end justify-between gap-6">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 dark:text-white/50">
            10 systems
          </div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Framework-agnostic design systems
          </h2>
          <p className="mt-2 max-w-xl text-sm text-neutral-500 dark:text-white/60">
            Each system ships portable CSS tokens, a DESIGN.md brief and cover imagery — ready for any coding agent.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {SYSTEMS.map((s) => (
          <SystemCard key={s.slug} system={s} />
        ))}
      </div>
    </section>
  );
}

function SystemSitePreview({ system }: { system: System }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0a0a12] p-4 text-white select-none">
      {/* Background ambient glow */}
      <div
        className="pointer-events-none absolute -top-12 -right-12 h-44 w-44 rounded-full opacity-45 blur-2xl"
        style={{ background: system.gradient }}
      />

      {/* Top window bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-md shadow-sm" style={{ background: system.gradient }} />
          <span className="text-[11px] font-semibold tracking-tight text-white">{system.name}</span>
        </div>
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[9px] font-medium text-white/70">
          Design System
        </span>
      </div>

      {/* Hero content */}
      <div className="mt-3.5 space-y-1.5">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[8.5px] text-white/70">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span>v2.0 · AI-Ready</span>
        </div>
        <h4 className="font-display text-[15px] font-semibold leading-snug tracking-tight text-white line-clamp-2">
          Crafted for <span className="bg-clip-text text-transparent" style={{ backgroundImage: system.gradient }}>{system.name}</span> interfaces.
        </h4>
        <p className="text-[10px] leading-relaxed text-white/50 line-clamp-2">
          {system.desc}
        </p>
      </div>

      {/* Mini interactive UI preview bar */}
      <div className="mt-3 flex items-center gap-2">
        <div className="flex items-center gap-1 rounded-md bg-white px-2.5 py-1 text-[9px] font-semibold text-black shadow-sm">
          <span>Live Site</span>
          <span>→</span>
        </div>
        <div className="rounded-md border border-white/10 bg-white/[0.05] px-2 py-1 text-[9px] font-mono text-white/60">
          DESIGN.md
        </div>
      </div>

      {/* Mini stats footer */}
      <div className="absolute inset-x-3 bottom-2.5 flex items-center justify-between rounded-lg border border-white/8 bg-white/[0.02] px-2.5 py-1 text-[8px] text-white/40">
        <span className="truncate">{system.meta.split("·")[0]}</span>
        <span className="font-mono text-[8px] uppercase tracking-wider text-white/60">{system.slug}</span>
      </div>
    </div>
  );
}

function SystemCardThumbnail({ system }: { system: System }) {
  const [imgError, setImgError] = useState(false);
  const imageSrc = system.image || (system.externalUrl ? `/thumbnails/${system.slug}.png` : null);

  if (imgError || !imageSrc) {
    return <SystemSitePreview system={system} />;
  }

  return (
    <div className="relative h-full w-full bg-[#0a0a12]">
      <img
        src={imageSrc}
        alt={`${system.name} official social cover`}
        loading="eager"
        decoding="async"
        onError={() => setImgError(true)}
        className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
        draggable={false}
      />
    </div>
  );
}

function SystemCard({ system }: { system: System }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const html = useMemo(() => buildServiceSite(system), [system]);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("--rx", `${(-y * 8).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(x * 12).toFixed(2)}deg`);
    el.style.setProperty("--mx", `${(x * 40).toFixed(1)}%`);
    el.style.setProperty("--my", `${(y * 40).toFixed(1)}%`);
  };
  const onMouseLeave = () => {
    const el = wrapRef.current;
    if (!el) return;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
  };

  return (
    <>
      <div
        ref={wrapRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="group relative h-full [perspective:1200px]"
      >
        <div
          className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-black/10 transition-transform duration-300 ease-out will-change-transform dark:bg-white/[0.02] dark:ring-white/10"
          style={{
            transform:
              "rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)) translateZ(0)",
            transformStyle: "preserve-3d",
          }}
        >

          {/* Official social image thumbnail: fast, high-res, zero-delay */}
          <div className="relative aspect-[16/10] overflow-hidden">
            <div className="absolute inset-0" style={{ backgroundImage: system.gradient }} />

            <div
              className="absolute inset-0 overflow-hidden"
              style={{ containerType: "inline-size", transform: "translateZ(30px)" }}
            >
              <SystemCardThumbnail system={system} />
            </div>

            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-75"
              style={{
                background:
                  "radial-gradient(420px circle at calc(50% + var(--mx,0%)) calc(50% + var(--my,0%)), rgba(255,255,255,0.2), transparent 55%)",
              }}
            />

            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-px"
              style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.6),transparent)" }}
            />

            <div className="absolute bottom-3 left-3 rounded-md bg-black/60 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-white backdrop-blur shadow-sm">
              {system.slug}
            </div>
          </div>


          <div className="space-y-3 p-6 pt-4">
            <div>
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-medium tracking-tight">{system.name}</h3>
                <span
                  className={`relative z-20 inline-flex shrink-0 items-center gap-1 rounded border px-2 py-0.5 text-xs font-medium ${
                    system.tag === "Free"
                      ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "border-black/10 bg-black/[0.03] text-neutral-500 dark:border-white/10 dark:bg-white/5 dark:text-white/60"
                  }`}
                >
                  {system.tag}
                </span>
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-neutral-500 dark:text-white/60">{system.desc}</p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-neutral-500 dark:text-white/50">{system.meta}</p>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (system.externalUrl) {
                    window.open(system.externalUrl, "_blank", "noopener,noreferrer");
                  } else {
                    setOpen(true);
                  }
                }}
                className="relative z-20 rounded-md border border-black/10 bg-white px-2.5 py-1 text-[11px] font-semibold text-neutral-700 shadow-sm transition hover:bg-black/[0.04] dark:border-white/10 dark:bg-white/[0.04] dark:text-white/80 dark:hover:bg-white/[0.08]"
              >
                Get code
              </button>
            </div>
          </div>
          {system.externalUrl ? (
            <a
              href={system.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 z-10 outline-none"
              aria-label={`Open the ${system.name} website`}
            />
          ) : (
            <Link
              to="/design/$slug"
              params={{ slug: system.slug }}
              className="absolute inset-0 z-10 outline-none"
              aria-label={`Open the ${system.name} website`}
            />
          )}
        </div>
      </div>
      {open && <SystemPreviewModal system={system} onClose={() => setOpen(false)} />}
    </>
  );
}



function buildReadme(system: System) {
  return `# ${system.name} Studio — Services website

A single-file, production-ready services template from the **${system.name}** design system by Novix UI.

## Files
- \`index.html\` — full markup + styles (single-file, no build step)
- \`DESIGN.md\` — design brief for AI-assisted workflows
- \`tokens.css\` — portable CSS variables you can drop into any framework

## Quick start
Open \`index.html\` in a browser — that's it. No install, no build.

To use in a framework, copy \`tokens.css\` into your project and reference the
variables (\`--bg\`, \`--fg\`, \`--accent\`, …) from your components.

## License
MIT · © Novix UI
`;
}

function buildDesignMd(system: System) {
  return `# ${system.name} — DESIGN.md

${system.desc}

## Palette
Primary gradient: \`${system.gradient}\`
Surface: #0a0a12 · Foreground: #f6f4ee · Muted: rgba(246,244,238,.62)

## Typography
- Display: Instrument Serif (italic for emphasis)
- UI: Inter 400 / 500 / 600 / 700

## Motion
- Hover lift: translateY(-1px), 150ms ease-out
- Section fade: 300ms ease-out

## Voice
Confident, quiet, specific. No adjectives that a competitor could also claim.
`;
}

function buildTokensCss(system: System) {
  return `:root {
  --bg: #0a0a12;
  --fg: #f6f4ee;
  --muted: rgba(246, 244, 238, 0.62);
  --line: rgba(246, 244, 238, 0.10);
  --accent: #c4b5fd;
  --gradient-primary: ${system.gradient};
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-xl: 28px;
}
`;
}

function SystemPreviewModal({ system, onClose }: { system: System; onClose: () => void }) {
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const html = buildServiceSite(system);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const copy = async () => {
    await navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const downloadZip = async () => {
    setDownloading(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder(`${system.slug}-studio`)!;
      folder.file("index.html", html);
      folder.file("README.md", buildReadme(system));
      folder.file("DESIGN.md", buildDesignMd(system));
      folder.file("tokens.css", buildTokensCss(system));
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${system.slug}-studio.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in"
      style={{ background: "rgba(5,5,5,0.82)", backdropFilter: "blur(14px)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex h-[92vh] w-full max-w-[1320px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a12] text-white shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)] animate-scale-in"
      >
        {/* header */}
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-3">
          <div className="flex items-center gap-3">
            <div
              className="size-8 shrink-0 rounded-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_6px_14px_-4px_rgba(0,0,0,0.5)]"
              style={{ backgroundImage: system.gradient }}
            />
            <div>
              <div className="text-sm font-semibold">{system.name} Studio · Services site</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-white/50">
                Real website · inspiration & copy-ready code
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-white/10 bg-white/[0.03] p-1 text-xs">
              {(["preview", "code"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`rounded-md px-3 py-1.5 font-medium capitalize transition ${
                    tab === t ? "bg-white text-black" : "text-white/60 hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <button
              onClick={copy}
              className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/10"
            >
              {copied ? "Copied ✓" : "Copy HTML"}
            </button>
            <button
              onClick={downloadZip}
              disabled={downloading}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-black transition hover:bg-white/90 disabled:opacity-60"
            >
              <Download className="size-3.5" />
              {downloading ? "Zipping…" : "Download .zip"}
            </button>
            <button
              onClick={onClose}
              className="grid size-8 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-white/70 transition hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <XIcon className="size-4" />
            </button>
          </div>
        </div>

        {/* body */}
        <div className="relative flex-1 overflow-hidden bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.12),transparent_60%)]">
          {tab === "preview" ? (
            <div className="flex h-full items-start justify-center overflow-auto p-6">
              <div className="relative w-full max-w-[1200px]">
                {/* window chrome — straight, no tilt */}
                <div className="overflow-hidden rounded-xl border border-white/15 bg-[#0a0a12] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.04)_inset]">
                  <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.04] px-4 py-2.5">
                    <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                    <span className="size-2.5 rounded-full bg-[#febc2e]" />
                    <span className="size-2.5 rounded-full bg-[#28c840]" />
                    <div className="mx-auto rounded-md bg-black/40 px-3 py-1 font-mono text-[10px] text-white/60">
                      {system.slug}.studio
                    </div>
                  </div>
                  <iframe
                    title={`${system.name} preview`}
                    srcDoc={html}
                    className="block h-[78vh] w-full bg-black"
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-2 font-mono text-[10px] uppercase tracking-widest text-white/50">
                <span>{system.slug}-studio / index.html</span>
                <span>Includes: index.html · README.md · DESIGN.md · tokens.css</span>
              </div>
              <pre className="flex-1 overflow-auto bg-[#050510] p-6 font-mono text-[12px] leading-relaxed text-white/80">
                <code>{html}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



/* ─────────────────────────── faq ─────────────────────────── */

function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="mt-20 scroll-mt-16 border-t border-black/10 pt-16 pb-12 dark:border-white/5">
      <div className="mx-auto max-w-2xl px-2">
        <h2 className="text-center text-2xl font-medium tracking-tight md:text-3xl">
          Frequently asked questions
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-sm text-neutral-500 dark:text-white/60">
          Quick answers about what you get and how to use it.
        </p>
        <div className="mt-10 flex w-full flex-col divide-y divide-black/10 dark:divide-white/10">
          {FAQ.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="py-4">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between text-left text-base font-medium transition-colors hover:opacity-80"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`ml-auto size-4 shrink-0 text-neutral-500 transition-transform dark:text-white/60 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid overflow-hidden text-sm leading-relaxed text-neutral-500 transition-all dark:text-white/60 ${
                    isOpen ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="min-h-0">{item.a}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── footer ─────────────────────────── */

function Footer() {
  return (
    <footer className="relative border-t border-black/10 bg-white dark:border-white/5 dark:bg-[#050505]">
      <div className="relative mx-auto w-full max-w-7xl px-6 py-16 md:px-10 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.8fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-5">
            <Link to="/" className="flex items-center gap-3">
              <span className="font-display text-[21px] font-bold tracking-tight text-foreground">
                novix<span className="text-accent">ui</span>
              </span>
              <span
                className="ml-0.5 rounded-md bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-400 bg-clip-text px-1.5 py-0.5 font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-transparent ring-1 ring-inset ring-violet-400/30"
              >
                Design
              </span>

            </Link>

            <p className="max-w-sm text-sm leading-6 text-neutral-500 dark:text-white/60">
              Framework-agnostic design systems with portable CSS, DESIGN.md guidance, and components. Built for AI-assisted workflows.
            </p>
            <div className="flex items-center gap-2">
              {[
                { href: "https://github.com", label: "GitHub", icon: Github },
                { href: "https://x.com", label: "X", icon: Twitter },
                { href: "https://discord.com", label: "Discord", icon: MessageSquare },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={s.label}
                  className="grid size-9 place-items-center rounded-full border border-black/10 bg-black/[0.02] text-neutral-500 transition-colors hover:border-black/25 hover:text-neutral-900 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/60 dark:hover:border-white/25 dark:hover:text-white"
                >
                  <s.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {[
            {
              title: "Product",
              links: [
                { l: "Design systems", to: "/design" },
                { l: "Elements", to: "/elements" },
                { l: "Components", to: "/docs/components" },
                { l: "Effects", to: "/docs/effects" },
              ],
            },
            {
              title: "Resources",
              links: [
                { l: "Documentation", to: "/docs" },
                { l: "Setup tutorial", to: "/docs/installation" },
                { l: "Recipes", to: "/docs/recipes" },
                { l: "Changelog", to: "/docs/changelog" },
              ],
            },
            {
              title: "Company",
              links: [
                { l: "Terms of service", to: "/docs" },
                { l: "Privacy policy", to: "/docs" },
                { l: "Accessibility", to: "/docs/accessibility" },
              ],
            },
          ].map((col) => (
            <div key={col.title} className="flex flex-col gap-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em]">{col.title}</h3>
              <ul className="flex flex-col gap-3">
                {col.links.map((l) => (
                  <li key={l.l}>
                    <Link to={l.to} className="text-sm text-neutral-500 transition-colors hover:text-neutral-900 dark:text-white/60 dark:hover:text-white">
                      {l.l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-black/10 pt-6 text-xs text-neutral-500 dark:border-white/5 dark:text-white/50 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Novix UI. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link to="/docs" className="transition-colors hover:text-neutral-900 dark:hover:text-white">Terms</Link>
            <Link to="/docs" className="transition-colors hover:text-neutral-900 dark:hover:text-white">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
