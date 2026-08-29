import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import JSZip from "jszip";
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
} from "lucide-react";

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

export type System = {
  slug: string;
  name: string;
  tag: "Free" | "Premium";
  desc: string;
  meta: string;
  gradient: string;
  externalUrl?: string;
  image?: string;
};

export const SYSTEMS: System[] = [
  { slug: "halo",           name: "Halo",           tag: "Free",    desc: "A modern, minimal dark system pairing an architectural near-black canvas with precise typography and a tight palette of vibrant signal colors.", meta: "5 files · 12 components · 2 fonts · 10 colors", gradient: "linear-gradient(135deg,#0b0f1a 0%,#141a2b 55%,#1e2749 100%)", externalUrl: "https://linear.app/", image: "/thumbnails/halo.png" },
  { slug: "aether",         name: "Aether",         tag: "Premium", desc: "An editorial dark system where brutalist grids and oversized italic serifs collide with prismatic chromatic glass.", meta: "5 files · 1 logo · 8 components · 3 fonts · 9 colors", gradient: "linear-gradient(135deg,#0e0b1a 0%,#2a1e5e 45%,#7a3fbf 100%)", externalUrl: "/design/aether" },
  { slug: "chamfer",        name: "Chamfer",        tag: "Premium", desc: "A warm paper-and-ink interface system where every corner is cut at 45°. Layered stationery, notched tabs, serif headlines.", meta: "5 files · 1 logo · 2 fonts · 7 colors", gradient: "linear-gradient(135deg,#f5efe3 0%,#e5d9c1 60%,#c9a97a 100%)", externalUrl: "/design/chamfer" },
  { slug: "meadowlark",     name: "Meadowlark",     tag: "Premium", desc: "A light, breathable system built around botanical illustrations and warm cream surfaces with a coral-teal-marigold palette.", meta: "5 files · 1 logo · 2 fonts · 8 colors", gradient: "linear-gradient(135deg,#fff4e6 0%,#ffd1a3 45%,#ff8f6a 100%)", externalUrl: "https://stripe.com/", image: "/thumbnails/meadowlark.png" },
  { slug: "raster-sentinel",name: "Raster Sentinel",tag: "Premium", desc: "A hard-edged dark system for machine intelligence and security. Ink-black panels, dithered bitmap imagery, ultramarine strike color.", meta: "5 files · 1 logo · 2 fonts · 6 colors", gradient: "linear-gradient(135deg,#050505 0%,#0e1226 55%,#1e37ff 100%)", externalUrl: "https://vercel.com/", image: "/thumbnails/raster-sentinel.png" },
  { slug: "meridian",       name: "Meridian",       tag: "Premium", desc: "An editorial system for frontier AI, pairing warm paper surfaces and high-contrast serif display type with a pastel spectrum moment.", meta: "5 files · 1 logo · 2 fonts · 8 colors", gradient: "linear-gradient(135deg,#f8f2ea 0%,#f2d7de 55%,#cdb4e5 100%)", externalUrl: "https://www.framer.com/", image: "/thumbnails/meridian.png" },
  { slug: "forge",          name: "Forge",          tag: "Premium", desc: "An industrial-grade dark system where ember-orange ignition heats a graphite-black workspace, tuned for dense technical surfaces.", meta: "5 files · 8 components · 3 fonts · 8 colors", gradient: "linear-gradient(135deg,#0a0908 0%,#1c1712 55%,#e0621b 100%)", externalUrl: "https://railway.app/", image: "/thumbnails/forge.png" },
  { slug: "boldface",       name: "Boldface",       tag: "Premium", desc: "An editorial dark-mode system for design-led studios. Heavy display sans with elegant serif italic, deep cocoa stage, tomato accent.", meta: "5 files · 1 logo · 2 fonts · 8 colors", gradient: "linear-gradient(135deg,#1a1210 0%,#2a1a17 55%,#e64b32 100%)", externalUrl: "https://resend.com/", image: "/thumbnails/boldface.png" },
  { slug: "cirrus",         name: "Cirrus",         tag: "Premium", desc: "A minimalist, light-as-air SaaS system built around a cloudy sky background, pill controls, and a single italic serif accent.", meta: "5 files · 1 logo · 12 components · 3 fonts · 9 colors", gradient: "linear-gradient(135deg,#eaf2fb 0%,#c9dcf3 55%,#9cb9e0 100%)", externalUrl: "https://www.raycast.com/", image: "/thumbnails/cirrus.png" },
  { slug: "cairn",          name: "Cairn",          tag: "Premium", desc: "A grounded, tactile system stacked from warm stone surfaces and monolithic type — quiet, deliberate, load-bearing.", meta: "5 files · 1 logo · 2 fonts · 7 colors", gradient: "linear-gradient(135deg,#2b2622 0%,#3f342c 55%,#8a6a4f 100%)", externalUrl: "https://arc.net/", image: "/thumbnails/cairn.png" },
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
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            window.location.assign("/");
          }}
          className="flex items-center gap-2 pl-1 md:pl-2"
        >
          <span className="font-display text-[21px] font-bold tracking-tight text-foreground">
            novix<span className="text-accent">ui</span>
          </span>
          <span
            className="ml-0.5 rounded-md bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-400 bg-clip-text px-1.5 py-0.5 font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-transparent ring-1 ring-inset ring-violet-400/30"
          >
            Design
          </span>
        </a>

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
          <button className="hidden h-9 items-center justify-center rounded-full border border-border/60 bg-surface/60 px-4 text-[13px] font-medium text-foreground transition-colors hover:bg-subtle sm:inline-flex">
            Log in / Sign up
          </button>
          <button className="inline-flex h-9 items-center justify-center rounded-full bg-accent px-4 text-[13px] font-semibold text-accent-foreground shadow-[0_8px_24px_-8px_hsl(var(--accent)/0.6)] transition-transform hover:-translate-y-0.5 sm:hidden">
            Log in
          </button>
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


/* ─────────────────────────── premium services website preview ─────────────────────────── */

export function buildServiceSite(system: System) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${system.name} Studio — Design & Engineering Services</title>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  :root { --bg:#0a0a12; --fg:#f6f4ee; --muted:rgba(246,244,238,.62); --line:rgba(246,244,238,.10); --accent:#c4b5fd; }
  *{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{background:var(--bg);color:var(--fg);font-family:Inter,system-ui,sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden}
  a{color:inherit}
  .wrap{max-width:1120px;margin:0 auto;padding:0 32px}

  .nav{display:flex;align-items:center;justify-content:space-between;padding:18px 32px;position:sticky;top:0;background:rgba(10,10,18,.72);backdrop-filter:blur(14px);border-bottom:1px solid var(--line);z-index:20}
  .brand{display:flex;align-items:center;gap:10px;font-weight:600;letter-spacing:-.01em;cursor:pointer}
  .mark{width:28px;height:28px;border-radius:8px;background:${system.gradient};box-shadow:inset 0 1px 0 rgba(255,255,255,.4),0 6px 14px -4px rgba(0,0,0,.5)}
  .menu{display:flex;gap:28px;font-size:14px;color:var(--muted)}
  .menu a{text-decoration:none;transition:color .2s;cursor:pointer} .menu a:hover{color:var(--fg)}
  .cta{padding:9px 16px;border-radius:999px;background:var(--fg);color:#0a0a12;font-size:13px;font-weight:600;text-decoration:none;border:0;cursor:pointer;font-family:inherit}
  .burger{display:none;background:transparent;border:1px solid var(--line);border-radius:8px;padding:8px 10px;color:var(--fg);cursor:pointer}

  .hero{padding:96px 0 72px;position:relative;overflow:hidden}
  .hero::before{content:"";position:absolute;inset:-20% -10% auto -10%;height:520px;background:${system.gradient};filter:blur(90px);opacity:.35;z-index:0}
  .eyebrow{display:inline-flex;align-items:center;gap:8px;padding:6px 12px;border:1px solid var(--line);border-radius:999px;font-size:12px;color:var(--muted);position:relative;z-index:1}
  .eyebrow .dot{width:6px;height:6px;border-radius:50%;background:#4ade80;box-shadow:0 0 12px #4ade80;animation:pulse 2s infinite}
  @keyframes pulse{50%{opacity:.4}}
  h1{font-family:'Instrument Serif',serif;font-size:clamp(48px,7vw,92px);line-height:.98;letter-spacing:-.02em;margin:22px 0 20px;position:relative;z-index:1;max-width:900px}
  h1 em{font-style:italic;background:${system.gradient};-webkit-background-clip:text;background-clip:text;color:transparent}
  .lede{font-size:18px;color:var(--muted);max-width:560px;line-height:1.6;position:relative;z-index:1}
  .actions{display:flex;gap:12px;margin-top:32px;position:relative;z-index:1;flex-wrap:wrap}
  .btn{padding:14px 22px;border-radius:12px;font-size:14px;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:8px;transition:transform .15s, box-shadow .2s;cursor:pointer;border:0;font-family:inherit}
  .btn:hover{transform:translateY(-1px)}
  .btn:active{transform:translateY(0) scale(.98)}
  .btn-primary{background:var(--fg);color:#0a0a12;box-shadow:0 10px 30px -8px rgba(255,255,255,.25)}
  .btn-ghost{border:1px solid var(--line);color:var(--fg);background:transparent}

  .metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;padding:56px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);margin-top:80px}
  .metric .n{font-family:'Instrument Serif',serif;font-size:44px;letter-spacing:-.02em}
  .metric .l{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.14em;margin-top:6px}

  .section{padding:96px 0}
  .kicker{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.18em}
  .h2{font-family:'Instrument Serif',serif;font-size:clamp(36px,4.6vw,58px);letter-spacing:-.02em;margin:10px 0 32px;max-width:720px}

  .tabs{display:inline-flex;gap:4px;padding:4px;border:1px solid var(--line);border-radius:999px;margin-bottom:36px}
  .tab{padding:8px 16px;border-radius:999px;font-size:13px;color:var(--muted);background:transparent;border:0;cursor:pointer;transition:all .2s;font-family:inherit}
  .tab.active{background:var(--fg);color:#0a0a12}

  .services{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
  .svc{padding:28px;border:1px solid var(--line);border-radius:20px;background:linear-gradient(180deg,rgba(255,255,255,.03),rgba(255,255,255,.01));transition:transform .3s, border-color .3s;position:relative;overflow:hidden;cursor:pointer}
  .svc::after{content:"";position:absolute;inset:auto -30% -60% auto;width:220px;height:220px;background:${system.gradient};filter:blur(60px);opacity:0;transition:opacity .4s}
  .svc:hover{transform:translateY(-4px);border-color:rgba(246,244,238,.22)}
  .svc:hover::after{opacity:.35}
  .svc .ico{width:44px;height:44px;border-radius:12px;background:${system.gradient};display:grid;place-items:center;font-size:20px;margin-bottom:20px;position:relative}
  .svc h3{font-size:20px;letter-spacing:-.01em;margin-bottom:10px;position:relative}
  .svc p{color:var(--muted);font-size:14px;line-height:1.65;position:relative}
  .svc.hidden{display:none}

  .process{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:start}
  .steps{display:flex;flex-direction:column;gap:2px}
  .step{padding:24px 0;border-top:1px solid var(--line);display:grid;grid-template-columns:60px 1fr;gap:20px}
  .step:last-child{border-bottom:1px solid var(--line)}
  .step .num{font-family:'Instrument Serif',serif;font-size:32px;color:var(--muted)}
  .step h4{font-size:18px;margin-bottom:6px}
  .step p{color:var(--muted);font-size:14px;line-height:1.6}

  .faq{max-width:720px;margin:0 auto}
  .qa{border-top:1px solid var(--line);padding:20px 0}
  .qa:last-child{border-bottom:1px solid var(--line)}
  .qa summary{cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center;font-size:17px;font-weight:500}
  .qa summary::-webkit-details-marker{display:none}
  .qa summary::after{content:"+";font-size:22px;color:var(--muted);transition:transform .3s}
  .qa[open] summary::after{transform:rotate(45deg)}
  .qa p{color:var(--muted);font-size:14px;line-height:1.7;margin-top:12px;max-width:560px}

  .cta-band{margin:0 32px 48px;padding:64px 48px;border-radius:28px;background:${system.gradient};position:relative;overflow:hidden;text-align:center}
  .cta-band h3{font-family:'Instrument Serif',serif;font-size:clamp(32px,4vw,52px);color:#0a0a12;letter-spacing:-.02em;max-width:640px;margin:0 auto 24px}
  .cta-band button{background:#0a0a12;color:var(--fg);padding:14px 28px;border-radius:999px;text-decoration:none;font-weight:600;font-size:14px;border:0;cursor:pointer;font-family:inherit}

  footer{padding:40px 32px;border-top:1px solid var(--line);display:flex;justify-content:space-between;color:var(--muted);font-size:13px;flex-wrap:wrap;gap:12px}

  /* modal */
  .mask{position:fixed;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(10px);display:none;align-items:center;justify-content:center;padding:20px;z-index:100;animation:fadeIn .2s ease-out}
  .mask.open{display:flex}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  .modal{background:#141420;border:1px solid var(--line);border-radius:20px;padding:32px;max-width:460px;width:100%;position:relative;animation:pop .25s ease-out}
  @keyframes pop{from{transform:scale(.94);opacity:0}to{transform:scale(1);opacity:1}}
  .modal h3{font-family:'Instrument Serif',serif;font-size:32px;margin-bottom:8px;letter-spacing:-.01em}
  .modal p.sub{color:var(--muted);font-size:14px;margin-bottom:24px}
  .field{margin-bottom:14px}
  .field label{display:block;font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.12em;margin-bottom:6px}
  .field input,.field textarea{width:100%;background:rgba(255,255,255,.03);border:1px solid var(--line);border-radius:10px;padding:11px 14px;color:var(--fg);font-family:inherit;font-size:14px;transition:border-color .2s}
  .field input:focus,.field textarea:focus{outline:0;border-color:var(--accent)}
  .field textarea{resize:vertical;min-height:90px}
  .close{position:absolute;top:14px;right:14px;background:transparent;border:0;color:var(--muted);cursor:pointer;font-size:20px;line-height:1}
  .toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(20px);background:#141420;border:1px solid var(--line);padding:12px 18px;border-radius:12px;font-size:13px;opacity:0;transition:all .3s;z-index:101;pointer-events:none}
  .toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
  .toast::before{content:"✓";color:#4ade80;margin-right:8px;font-weight:700}

  @media(max-width:820px){
    .services,.process,.metrics{grid-template-columns:1fr 1fr}
    .menu{display:none} .burger{display:block}
    .menu.mobile{display:flex;position:absolute;top:100%;left:0;right:0;background:rgba(10,10,18,.96);flex-direction:column;padding:20px 32px;border-bottom:1px solid var(--line);gap:16px}
  }
  @media(max-width:520px){.services,.process,.metrics{grid-template-columns:1fr}h1{font-size:44px}}
</style>
</head>
<body>
  <nav class="nav">
    <div class="brand" data-scroll="top"><div class="mark"></div>${system.name} Studio</div>
    <div class="menu" id="menu">
      <a data-scroll="services">Services</a>
      <a data-scroll="process">Process</a>
      <a data-scroll="faq">FAQ</a>
      <a data-scroll="contact">Contact</a>
    </div>
    <button class="cta" data-open-modal>Start a project ↗</button>
    <button class="burger" id="burger" aria-label="Menu">☰</button>
  </nav>

  <header class="hero" id="top">
    <div class="wrap">
      <div class="eyebrow"><span class="dot"></span> Booking Q3 · 2 slots remaining</div>
      <h1>Design and engineering<br/>for teams that ship <em>rare</em> products.</h1>
      <p class="lede">${system.name} Studio partners with founders and product leaders to build interfaces that feel obvious, fast, and worth talking about.</p>
      <div class="actions">
        <button class="btn btn-primary" data-open-modal>Book intro call →</button>
        <button class="btn btn-ghost" data-scroll="services">View services</button>
      </div>
      <div class="metrics">
        <div class="metric"><div class="n" data-count="42">0</div><div class="l">Products shipped</div></div>
        <div class="metric"><div class="n" data-count="7" data-suffix="yr">0</div><div class="l">Median partnership</div></div>
        <div class="metric"><div class="n" data-count="98" data-suffix="%">0</div><div class="l">Repeat clients</div></div>
        <div class="metric"><div class="n" data-count="1.2" data-prefix="$" data-suffix="B">0</div><div class="l">Client raise</div></div>
      </div>
    </div>
  </header>

  <section class="section" id="services">
    <div class="wrap">
      <div class="kicker">What we do</div>
      <h2 class="h2">A tight scope, executed at the level of the best product teams in the world.</h2>
      <div class="tabs" role="tablist">
        <button class="tab active" data-filter="all">All</button>
        <button class="tab" data-filter="design">Design</button>
        <button class="tab" data-filter="brand">Brand</button>
        <button class="tab" data-filter="build">Engineering</button>
      </div>
      <div class="services" id="services-grid">
        <div class="svc" data-cat="design"><div class="ico">◈</div><h3>Product Design</h3><p>End-to-end interface design — from zero-to-one exploration to weekly ship cycles with your engineering team.</p></div>
        <div class="svc" data-cat="brand"><div class="ico">✦</div><h3>Brand Systems</h3><p>Identity, typography, motion, and voice — codified into a design system your team can grow into for years.</p></div>
        <div class="svc" data-cat="build"><div class="ico">◐</div><h3>Front-end Engineering</h3><p>React, TypeScript, Motion. Pixel-honest builds tuned for performance and accessibility from day one.</p></div>
        <div class="svc" data-cat="design"><div class="ico">◆</div><h3>Design Systems</h3><p>Component libraries, tokens, and documentation your team can extend without breaking the visual language.</p></div>
        <div class="svc" data-cat="brand"><div class="ico">✧</div><h3>Motion & Identity</h3><p>Signature animation and micro-interaction language that makes your product recognizable in a screenshot.</p></div>
        <div class="svc" data-cat="build"><div class="ico">◑</div><h3>Prototype Sprints</h3><p>One-week high-fidelity prototypes to de-risk decisions before an engineering team touches production.</p></div>
      </div>
    </div>
  </section>

  <section class="section" id="process" style="padding-top:0">
    <div class="wrap">
      <div class="kicker">Process</div>
      <h2 class="h2">How a project unfolds.</h2>
      <div class="process">
        <div>
          <p style="color:var(--muted);line-height:1.7;max-width:420px">Every engagement is a 6-week block. Fixed scope, weekly demos, one design lead and one engineer. No account managers, no decks that go nowhere.</p>
        </div>
        <div class="steps">
          <div class="step"><div class="num">01</div><div><h4>Discovery week</h4><p>Immersion into your product, users, and constraints. We come out with a written brief.</p></div></div>
          <div class="step"><div class="num">02</div><div><h4>Design sprints</h4><p>Two-week loops. Daily Loom updates. Every artifact lives in one shared file.</p></div></div>
          <div class="step"><div class="num">03</div><div><h4>Build & handoff</h4><p>We ship the front-end alongside your team, with docs and a system your engineers own.</p></div></div>
        </div>
      </div>
    </div>
  </section>

  <section class="section" id="faq" style="padding-top:0">
    <div class="wrap">
      <div class="kicker" style="text-align:center">Answers</div>
      <h2 class="h2" style="text-align:center;margin-left:auto;margin-right:auto">Frequently asked.</h2>
      <div class="faq">
        <details class="qa" open><summary>What does an engagement cost?</summary><p>A 6-week block starts at $48k. Scope is fixed; we quote based on the outcome, not hours.</p></details>
        <details class="qa"><summary>Do you work with in-house teams?</summary><p>Almost always. We embed alongside your design and engineering leads and hand back a system your team owns.</p></details>
        <details class="qa"><summary>Can you sign an NDA?</summary><p>Yes. We'll counter-sign your standard NDA within a business day.</p></details>
        <details class="qa"><summary>Where are you based?</summary><p>Remote-first across EU and US timezones. We overlap 4+ hours with your team.</p></details>
      </div>
    </div>
  </section>

  <div class="cta-band" id="contact">
    <h3>Have a product worth building beautifully?</h3>
    <button data-open-modal>Start a conversation →</button>
  </div>

  <footer>
    <div>© ${system.name} Studio, 2026</div>
    <div>hello@${system.slug}.studio</div>
  </footer>

  <div class="mask" id="mask" role="dialog" aria-modal="true">
    <div class="modal">
      <button class="close" data-close aria-label="Close">×</button>
      <h3>Start a project</h3>
      <p class="sub">Tell us about your product. We reply within one business day.</p>
      <form id="contact-form">
        <div class="field"><label>Name</label><input required name="name" placeholder="Jane Doe" /></div>
        <div class="field"><label>Email</label><input required type="email" name="email" placeholder="jane@company.com" /></div>
        <div class="field"><label>What are you building?</label><textarea required name="msg" placeholder="A brief overview of your product and timeline…"></textarea></div>
        <button class="btn btn-primary" type="submit" style="width:100%;justify-content:center">Send message</button>
      </form>
    </div>
  </div>

  <div class="toast" id="toast">Message sent — talk soon.</div>

<script>
(function(){
  var d=document;
  var $=function(s,r){return (r||d).querySelector(s)};
  var $$=function(s,r){return Array.prototype.slice.call((r||d).querySelectorAll(s))};

  // smooth scroll
  $$('[data-scroll]').forEach(function(el){
    el.addEventListener('click',function(e){
      e.preventDefault();
      var t=el.getAttribute('data-scroll');
      if(t==='top'){window.scrollTo({top:0,behavior:'smooth'});return}
      var n=d.getElementById(t);
      if(n)n.scrollIntoView({behavior:'smooth',block:'start'});
      $('#menu').classList.remove('mobile');
    });
  });

  // mobile menu
  var burger=$('#burger');
  if(burger)burger.addEventListener('click',function(){$('#menu').classList.toggle('mobile')});

  // modal
  var mask=$('#mask');
  $$('[data-open-modal]').forEach(function(b){b.addEventListener('click',function(){mask.classList.add('open')})});
  $$('[data-close]').forEach(function(b){b.addEventListener('click',function(){mask.classList.remove('open')})});
  mask.addEventListener('click',function(e){if(e.target===mask)mask.classList.remove('open')});
  d.addEventListener('keydown',function(e){if(e.key==='Escape')mask.classList.remove('open')});

  // form
  var form=$('#contact-form');
  form.addEventListener('submit',function(e){
    e.preventDefault();
    mask.classList.remove('open');
    var toast=$('#toast');
    toast.classList.add('show');
    setTimeout(function(){toast.classList.remove('show')},2400);
    form.reset();
  });

  // service filter
  $$('.tab').forEach(function(t){
    t.addEventListener('click',function(){
      $$('.tab').forEach(function(x){x.classList.remove('active')});
      t.classList.add('active');
      var f=t.getAttribute('data-filter');
      $$('.svc').forEach(function(c){
        c.classList.toggle('hidden', f!=='all' && c.getAttribute('data-cat')!==f);
      });
    });
  });

  // counters
  function animate(el){
    var target=parseFloat(el.getAttribute('data-count'));
    var pre=el.getAttribute('data-prefix')||'';
    var suf=el.getAttribute('data-suffix')||'';
    var dur=1400, start=performance.now(), dec=(target%1!==0)?1:0;
    function tick(now){
      var p=Math.min(1,(now-start)/dur);
      var eased=1-Math.pow(1-p,3);
      el.textContent=pre+(target*eased).toFixed(dec)+suf;
      if(p<1)requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var seen=new WeakSet();
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting && !seen.has(e.target)){seen.add(e.target);animate(e.target)}
    });
  },{threshold:.4});
  $$('[data-count]').forEach(function(el){io.observe(el)});
})();
</script>
</body>
</html>`;
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
