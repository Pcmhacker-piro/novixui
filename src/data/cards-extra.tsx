import type { ReactNode } from "react";
import type { CardItem } from "./cards";

/* =============================================================
   Cards · Extras (89 variants across 12 premium families)
   Each family exposes real 3D depth + hover-driven animation.
   ============================================================= */

type Palette = {
  key: string;
  name: string;
  a: string;  // primary
  b: string;  // secondary
  c: string;  // accent/glow
  ink?: string; // text tint
};

const PALETTES: Palette[] = [
  { key: "aurora",   name: "Aurora",     a: "#7c3aed", b: "#22d3ee", c: "#ec4899" },
  { key: "sunset",   name: "Sunset",     a: "#f97316", b: "#ec4899", c: "#a855f7" },
  { key: "mint",     name: "Mint",       a: "#10b981", b: "#22d3ee", c: "#84cc16" },
  { key: "cobalt",   name: "Cobalt",     a: "#3b82f6", b: "#6366f1", c: "#8b5cf6" },
  { key: "amber",    name: "Amber",      a: "#f59e0b", b: "#ef4444", c: "#f97316" },
  { key: "iris",     name: "Iris",       a: "#8b5cf6", b: "#ec4899", c: "#f472b6" },
  { key: "ocean",    name: "Ocean",      a: "#0ea5e9", b: "#2563eb", c: "#22d3ee" },
  { key: "moss",     name: "Moss",       a: "#166534", b: "#65a30d", c: "#22c55e" },
  { key: "rose",     name: "Rose",       a: "#e11d48", b: "#f43f5e", c: "#fb7185" },
  { key: "slate",    name: "Slate",      a: "#334155", b: "#64748b", c: "#94a3b8" },
  { key: "coral",    name: "Coral",      a: "#fb7185", b: "#f97316", c: "#facc15" },
  { key: "plum",     name: "Plum",       a: "#7e22ce", b: "#a21caf", c: "#c026d3" },
  { key: "cyber",    name: "Cyber",      a: "#22d3ee", b: "#a855f7", c: "#facc15" },
  { key: "ember",    name: "Ember",      a: "#dc2626", b: "#f97316", c: "#facc15" },
  { key: "arctic",   name: "Arctic",     a: "#e0f2fe", b: "#7dd3fc", c: "#38bdf8", ink: "#0f172a" },
  { key: "matcha",   name: "Matcha",     a: "#84cc16", b: "#10b981", c: "#facc15" },
  { key: "berry",    name: "Berry",      a: "#be185d", b: "#7c3aed", c: "#ec4899" },
  { key: "toxic",    name: "Toxic",      a: "#a3e635", b: "#22d3ee", c: "#ec4899" },
  { key: "sand",     name: "Sand",       a: "#d6a76a", b: "#a16207", c: "#f59e0b" },
  { key: "steel",    name: "Steel",      a: "#475569", b: "#94a3b8", c: "#38bdf8" },
];

const SHELL =
  "relative h-44 w-64 overflow-hidden rounded-2xl border border-white/10 p-4 transition-transform duration-500 [transform-style:preserve-3d]";

/* ---------- Family 1 · Gradient Glass (8) ---------- */
function GradientGlass({ p, title, sub }: { p: Palette; title: string; sub: string }) {
  return (
    <div
      className={SHELL + " backdrop-blur-xl group-hover:[transform:perspective(900px)_rotateX(6deg)_translateY(-4px)]"}
      style={{ background: `linear-gradient(135deg, ${p.a}22, ${p.b}18, ${p.c}12)` }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-16 opacity-70 blur-3xl transition-transform duration-700 group-hover:[transform:translate3d(20px,-10px,0)_rotate(15deg)]"
        style={{ background: `conic-gradient(from 90deg at 30% 30%, ${p.a}, ${p.b}, ${p.c}, ${p.a})` }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-70"
        style={{ background: `linear-gradient(90deg, transparent, ${p.c}bb, transparent)` }}
      />
      <div className="relative text-white">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/70">{p.name}</p>
        <h4 className="mt-1 text-lg font-semibold">{title}</h4>
        <p className="mt-2 text-[12px] leading-relaxed text-white/75">{sub}</p>
      </div>
    </div>
  );
}
const GG_META = [
  { title: "Aurora glow",   sub: "Ambient conic drift behind frosted glass." },
  { title: "Ember burst",   sub: "Warm color field warms up on hover." },
  { title: "Neon frost",    sub: "Cold gradient with radiant edge highlight." },
  { title: "Prism pass",    sub: "Multi-hue conic sweep, subtle 3D lift." },
  { title: "Signal bloom",  sub: "Radial glow gently drifts on cursor entry." },
  { title: "Chroma haze",   sub: "Muted palette with sharp moon-edge accent." },
  { title: "Halo mist",     sub: "Diffused conic wash with pastel gradient." },
  { title: "Twilight sheen",sub: "Deep base + cool highlight, subtle tilt." },
];

/* ---------- Family 2 · Layered Depth (8) ---------- */
function LayeredDepth({ p, title, sub }: { p: Palette; title: string; sub: string }) {
  return (
    <div className="relative h-44 w-64 [perspective:1000px]">
      <div
        className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 p-4 transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateX(10deg)_rotateY(-14deg)]"
        style={{ background: `linear-gradient(160deg, ${p.a}18, #050510)` }}
      >
        <div className="absolute inset-4 rounded-xl bg-white/[0.04] [transform:translateZ(20px)]" />
        <div
          aria-hidden
          className="absolute right-5 top-5 h-14 w-14 rounded-xl shadow-[0_10px_30px_-6px_rgba(0,0,0,0.6)] transition-transform duration-500 [transform:translateZ(40px)] group-hover:[transform:translateZ(70px)_rotate(10deg)]"
          style={{ background: `linear-gradient(135deg, ${p.b}, ${p.c})` }}
        />
        <div className="absolute inset-x-4 bottom-4 [transform:translateZ(50px)]">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: p.c + "cc" }}>{p.name}</p>
          <h4 className="mt-1 text-lg font-semibold text-white">{title}</h4>
          <p className="mt-1 text-[11px] text-white/70">{sub}</p>
        </div>
      </div>
    </div>
  );
}
const LD_META = [
  { title: "Parallax scene", sub: "Layers lift as you tilt the surface." },
  { title: "Floating chip",  sub: "Front layer elevates on hover." },
  { title: "Depth stack",    sub: "Three planes fan across Z-axis." },
  { title: "Hovering tile",  sub: "Content plate floats above base." },
  { title: "Slab lift",      sub: "Rigid slab rises with cursor entry." },
  { title: "Panel drift",    sub: "Subtle parallax on cursor movement." },
  { title: "Perspective card",sub: "Deep tilt reveals stacked layers." },
  { title: "Volume study",   sub: "Layered geometry over dark ground." },
];

/* ---------- Family 3 · Neon Border Trace (7) ---------- */
function NeonBorder({ p, title, sub }: { p: Palette; title: string; sub: string; k: number }) {
  return (
    <div className="relative h-44 w-64 rounded-2xl bg-[#050505] p-[1.5px] transition-transform duration-500 group-hover:-translate-y-1">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-60 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `conic-gradient(from 0deg, ${p.a}, ${p.b}, ${p.c}, ${p.a})`,
          animation: "nb-spin 4s linear infinite",
        }}
      />
      <div className="relative h-full w-full overflow-hidden rounded-2xl bg-[#0a0a0f] p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/60">{p.name}</p>
        <h4 className="mt-1 text-lg font-semibold text-white">{title}</h4>
        <p className="mt-2 text-[12px] text-white/70">{sub}</p>
      </div>
      <style>{`@keyframes nb-spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
const NB_META = [
  { title: "Live edge",    sub: "Conic border loop, boosted on hover." },
  { title: "Circuit ring", sub: "Continuously rotating perimeter light." },
  { title: "Halo trace",   sub: "Bright ring encircles a matte core." },
  { title: "Aurora ring",  sub: "Multi-color ring with soft outer bloom." },
  { title: "Pulse frame",  sub: "Amps up when the cursor arrives." },
  { title: "Signal loop",  sub: "Radiant border loop with dark interior." },
  { title: "Prism edge",   sub: "Full-spectrum trim, quiet core content." },
];

/* ---------- Family 4 · Pricing / Product (7) ---------- */
function PricingCard({ p, title, price, cta }: { p: Palette; title: string; price: string; cta: string }) {
  return (
    <div className="relative h-44 w-64 overflow-hidden rounded-2xl border border-white/10 p-4 [perspective:800px]"
      style={{ background: `linear-gradient(140deg, ${p.a}25, #0a0a18 60%)` }}>
      <div className="relative z-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: p.c }}>{p.name} · {title}</p>
        <h4 className="mt-1 text-lg font-semibold text-white">
          {price}<span className="text-[11px] font-normal text-white/50"> /mo</span>
        </h4>
        <button className="mt-3 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-black transition-transform duration-300 group-hover:scale-105">
          {cta}
        </button>
      </div>
      <div
        aria-hidden
        className="absolute -right-8 -bottom-6 h-32 w-32 rounded-2xl border border-white/15 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6)] transition-transform duration-700 [transform:rotate(18deg)] group-hover:[transform:rotate(4deg)_translateY(-8px)_translateZ(30px)]"
        style={{ background: `linear-gradient(135deg, ${p.a}, ${p.b}, ${p.c})` }}
      />
    </div>
  );
}
const PR_META = [
  { title: "Starter",    price: "$9",   cta: "Start free" },
  { title: "Pro",        price: "$29",  cta: "Upgrade" },
  { title: "Team",       price: "$49",  cta: "Invite" },
  { title: "Business",   price: "$99",  cta: "Contact us" },
  { title: "Studio",     price: "$149", cta: "Book demo" },
  { title: "Enterprise", price: "$299", cta: "Talk to sales" },
  { title: "Scale",      price: "$499", cta: "Get started" },
];

/* ---------- Family 5 · Stat / Metric (8) ---------- */
function StatCard({ p, label, value, delta }: { p: Palette; label: string; value: string; delta: string }) {
  return (
    <div className={SHELL + " group-hover:-translate-y-1"} style={{ background: `linear-gradient(180deg, #0a0a12, #050510)` }}>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30 transition-opacity duration-500 group-hover:opacity-70"
        style={{ background: `radial-gradient(120% 60% at 100% 0%, ${p.a}55, transparent 60%)` }}
      />
      <div className="relative flex h-full flex-col justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/60">{label}</p>
          <h4 className="mt-2 text-3xl font-semibold text-white tabular-nums">{value}</h4>
        </div>
        <div className="flex items-end justify-between">
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
            style={{ background: p.a + "33", color: p.c }}
          >
            {delta}
          </span>
          <svg width="70" height="30" viewBox="0 0 70 30" fill="none">
            <path d="M0 22 L10 18 L20 20 L30 12 L40 15 L50 8 L60 10 L70 4" stroke={p.c} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}
const ST_META = [
  { label: "Revenue",    value: "$48.2K", delta: "+12.4%" },
  { label: "Users",      value: "12,904", delta: "+8.1%" },
  { label: "Signups",    value: "1,342",  delta: "+22%"  },
  { label: "Sessions",   value: "88.7K",  delta: "+4.3%" },
  { label: "Retention",  value: "94.2%",  delta: "+1.8%" },
  { label: "MRR",        value: "$120K",  delta: "+9.6%" },
  { label: "NPS",        value: "72",     delta: "+6" },
  { label: "Churn",      value: "1.2%",   delta: "-0.4%" },
];

/* ---------- Family 6 · Music / Media (7) ---------- */
function MediaCard({ p, title, artist }: { p: Palette; title: string; artist: string }) {
  return (
    <div className={SHELL + " group-hover:[transform:perspective(900px)_rotateX(4deg)_rotateY(-4deg)]"} style={{ background: "#08080e" }}>
      <div
        aria-hidden
        className="absolute -top-6 -right-6 h-28 w-28 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.7)] transition-transform duration-700 group-hover:rotate-6"
        style={{ background: `linear-gradient(135deg, ${p.a}, ${p.b}, ${p.c})` }}
      />
      <div className="absolute inset-x-4 bottom-3 flex items-center gap-3">
        <button
          className="grid h-9 w-9 place-items-center rounded-full text-black shadow-[0_8px_20px_-4px_rgba(0,0,0,0.6)] transition-transform group-hover:scale-110"
          style={{ background: p.c }}
          aria-label="Play"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold text-white">{title}</p>
          <p className="truncate text-[11px] text-white/60">{artist}</p>
        </div>
      </div>
    </div>
  );
}
const MD_META = [
  { title: "Midnight Drive",  artist: "Nova Wave" },
  { title: "Skyline",         artist: "Aster & Oak" },
  { title: "Neon Rain",       artist: "The Prism" },
  { title: "Halogen",         artist: "Ember Field" },
  { title: "Aurora Nights",   artist: "Kite Signals" },
  { title: "Pale Blue",       artist: "Slow Motion" },
  { title: "Deep Signal",     artist: "Console FM" },
];

/* ---------- Family 7 · Notification (7) ---------- */
function NotifCard({ p, title, body, tag }: { p: Palette; title: string; body: string; tag: string }) {
  return (
    <div className={SHELL + " group-hover:translate-y-[-3px]"} style={{ background: `linear-gradient(180deg, #0b0b14, #050510)` }}>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-[3px]"
        style={{ background: `linear-gradient(180deg, ${p.a}, ${p.c})` }}
      />
      <div className="flex items-start gap-3">
        <span
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-white"
          style={{ background: `linear-gradient(135deg, ${p.a}, ${p.b})` }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></svg>
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[13px] font-semibold text-white">{title}</p>
            <span className="rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide" style={{ background: p.c + "22", color: p.c }}>{tag}</span>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-white/70">{body}</p>
        </div>
      </div>
      <div className="absolute inset-x-4 bottom-3 flex gap-2">
        <button className="rounded-md bg-white/[0.06] px-2 py-1 text-[10px] text-white/80 transition-colors group-hover:bg-white/[0.1]">Dismiss</button>
        <button className="rounded-md px-2 py-1 text-[10px] font-semibold text-black transition-transform group-hover:scale-105" style={{ background: p.c }}>View</button>
      </div>
    </div>
  );
}
const NT_META = [
  { title: "Deploy succeeded", body: "novixui.com went live in 24s.",       tag: "Deploy" },
  { title: "New comment",      body: "Ada replied to your PR review.",       tag: "PR" },
  { title: "Payment received", body: "$29.00 from Acme Studio · Pro plan.", tag: "Billing" },
  { title: "Build ready",      body: "Preview URL is available for review.", tag: "CI" },
  { title: "Server healthy",   body: "All checks green across 3 regions.",    tag: "Ops" },
  { title: "Signup spike",     body: "128 new accounts in the last hour.",    tag: "Growth" },
  { title: "Backup complete",  body: "Snapshot stored in 3 availability zones.", tag: "DB" },
];

/* ---------- Family 8 · Profile / Team (7) ---------- */
function ProfileCard({ p, name, role, init }: { p: Palette; name: string; role: string; init: string }) {
  return (
    <div className={SHELL + " group-hover:-translate-y-1"} style={{ background: `radial-gradient(120% 90% at 0% 0%, ${p.a}22, #060610)` }}>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${p.c}aa, transparent)` }}
      />
      <div className="flex items-center gap-3">
        <div
          className="grid h-12 w-12 place-items-center rounded-full text-[15px] font-semibold text-white shadow-[0_10px_25px_-8px_rgba(0,0,0,0.7)] transition-transform group-hover:scale-105"
          style={{ background: `linear-gradient(135deg, ${p.a}, ${p.b}, ${p.c})` }}
        >
          {init}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold text-white">{name}</p>
          <p className="truncate text-[11px] text-white/60">{role}</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        {["Posts", "Followers", "Following"].map((l, i) => (
          <div key={l} className="rounded-lg bg-white/[0.04] py-1">
            <p className="text-[11px] font-semibold text-white tabular-nums">{[128, 12400, 342][i].toLocaleString()}</p>
            <p className="text-[9px] uppercase tracking-wider text-white/50">{l}</p>
          </div>
        ))}
      </div>
      <button className="absolute inset-x-4 bottom-3 rounded-md py-1 text-[11px] font-semibold text-black transition-transform group-hover:scale-[1.02]" style={{ background: p.c }}>
        Follow
      </button>
    </div>
  );
}
const PF_META = [
  { name: "Ada Lovelace",     role: "Computer Scientist", init: "AL" },
  { name: "Grace Hopper",     role: "Rear Admiral",        init: "GH" },
  { name: "Alan Turing",      role: "Cryptanalyst",        init: "AT" },
  { name: "Katherine Johnson",role: "NASA Mathematician",  init: "KJ" },
  { name: "Linus Torvalds",   role: "Kernel Engineer",     init: "LT" },
  { name: "Margaret Hamilton",role: "Software Pioneer",    init: "MH" },
  { name: "Dennis Ritchie",   role: "Language Designer",   init: "DR" },
];

/* ---------- Family 9 · Weather (7) ---------- */
function WeatherCard({ p, city, temp, cond }: { p: Palette; city: string; temp: string; cond: string }) {
  return (
    <div className={SHELL} style={{ background: `linear-gradient(160deg, ${p.a}, ${p.b} 60%, #050510)` }}>
      <span
        aria-hidden
        className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/25 blur-2xl transition-transform duration-700 group-hover:scale-110"
      />
      <div className="relative flex h-full flex-col justify-between text-white">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/80">{city}</p>
          <p className="mt-1 text-[11px] text-white/70">{cond}</p>
        </div>
        <div className="flex items-end justify-between">
          <h4 className="text-4xl font-light tabular-nums drop-shadow">{temp}<span className="text-lg align-top">°</span></h4>
          <div className="text-right text-[10px] text-white/70">
            <p>H: 24° L: 12°</p>
            <p>Wind 8 km/h</p>
          </div>
        </div>
      </div>
    </div>
  );
}
const WT_META = [
  { city: "Reykjavik", temp: "6",  cond: "Snow flurries" },
  { city: "Kyoto",     temp: "14", cond: "Cloudy · rain later" },
  { city: "Lisbon",    temp: "21", cond: "Clear sky" },
  { city: "Cape Town", temp: "27", cond: "Sunny · light wind" },
  { city: "Seoul",     temp: "9",  cond: "Overcast" },
  { city: "Havana",    temp: "31", cond: "Humid · thunder" },
  { city: "Ushuaia",   temp: "3",  cond: "Windy · flurries" },
];

/* ---------- Family 10 · Testimonial (6) ---------- */
function QuoteCard({ p, quote, name, role }: { p: Palette; quote: string; name: string; role: string }) {
  return (
    <div className={SHELL + " group-hover:[transform:perspective(900px)_rotateX(4deg)_translateY(-3px)]"} style={{ background: `linear-gradient(180deg, #0b0b12, #050510)` }}>
      <span
        aria-hidden
        className="pointer-events-none absolute -top-4 left-3 text-6xl font-serif leading-none"
        style={{ color: p.c + "40" }}
      >“</span>
      <p className="relative mt-3 text-[12px] leading-relaxed text-white/85">{quote}</p>
      <div className="absolute inset-x-4 bottom-3 flex items-center gap-2">
        <span className="h-7 w-7 rounded-full" style={{ background: `linear-gradient(135deg, ${p.a}, ${p.c})` }} />
        <div>
          <p className="text-[11px] font-semibold text-white">{name}</p>
          <p className="text-[9px] uppercase tracking-wide text-white/50">{role}</p>
        </div>
      </div>
    </div>
  );
}
const QT_META = [
  { quote: "Ships faster than any kit we've tried. The 3D depth is unreal.", name: "Mira Chen",   role: "Design Lead · Northwind" },
  { quote: "Every component just… feels right. Weight, motion, contrast.",   name: "Ravi Patel",  role: "Staff Engineer · Fielder" },
  { quote: "It's the closest thing to Linear + Raycast in a single library.", name: "Sam Ortega",  role: "Founder · Slate" },
  { quote: "Our onboarding time dropped in half after we switched over.",     name: "Jules Kim",   role: "Head of Product · Loop" },
  { quote: "Beautiful defaults, but every knob is where you'd expect it.",    name: "Nora Vale",   role: "PM · Highline" },
  { quote: "Feels engineered by people who obsess over pixel-level craft.",   name: "Theo Brandt", role: "CTO · Field Notes" },
];

/* ---------- Family 11 · Chart Card (6) ---------- */
function ChartCard({ p, title, ratio }: { p: Palette; title: string; ratio: number }) {
  const bars = Array.from({ length: 12 }, (_, i) => 20 + Math.abs(Math.sin(i * ratio)) * 60);
  return (
    <div className={SHELL} style={{ background: "linear-gradient(180deg, #0b0b12, #050510)" }}>
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/60">{title}</p>
      <div className="absolute inset-x-4 bottom-4 flex h-24 items-end gap-1">
        {bars.map((h, i) => (
          <span
            key={i}
            className="flex-1 rounded-t-md opacity-80 transition-all duration-500 group-hover:opacity-100"
            style={{
              height: `${h}%`,
              background: `linear-gradient(180deg, ${p.c}, ${p.a})`,
              transform: `translateZ(0)`,
              animation: `ch-bar 2.4s ease-in-out ${i * 0.06}s infinite alternate`,
            }}
          />
        ))}
      </div>
      <style>{`@keyframes ch-bar{from{transform:scaleY(0.85)}to{transform:scaleY(1.05)}}`}</style>
    </div>
  );
}
const CH_META = [
  { title: "Weekly signups",  ratio: 0.7 },
  { title: "Revenue · 30d",   ratio: 1.1 },
  { title: "Active sessions", ratio: 0.5 },
  { title: "API calls",       ratio: 1.4 },
  { title: "Server load",     ratio: 0.9 },
  { title: "Deploys · 7d",    ratio: 1.7 },
];

/* ---------- Family 12 · Feature Tile (11) ---------- */
function FeatureTile({ p, title, sub, icon }: { p: Palette; title: string; sub: string; icon: ReactNode }) {
  return (
    <div className={SHELL + " group-hover:[transform:perspective(900px)_rotateX(5deg)_rotateY(-5deg)_translateY(-3px)]"} style={{ background: `radial-gradient(120% 100% at 100% 100%, ${p.a}20, #060610)` }}>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-70"
        style={{ background: `linear-gradient(90deg, transparent, ${p.c}bb, transparent)` }}
      />
      <div className="flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-xl text-white shadow-[0_10px_25px_-8px_rgba(0,0,0,0.7)]" style={{ background: `linear-gradient(135deg, ${p.a}, ${p.b}, ${p.c})` }}>
          {icon}
        </span>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: p.c }}>{p.name}</p>
      </div>
      <h4 className="mt-3 text-lg font-semibold text-white">{title}</h4>
      <p className="mt-1 text-[12px] leading-relaxed text-white/70">{sub}</p>
    </div>
  );
}
const Icon = {
  bolt:   <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" /></svg>,
  shield: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2 4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6z" /></svg>,
  cloud:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 18a4 4 0 0 0 0-8 6 6 0 0 0-11.7 2A4 4 0 0 0 6 18z" /></svg>,
  cpu:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /></svg>,
  spark:  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M15 15l4 4M19 5l-4 4M9 15l-4 4" stroke="currentColor" strokeWidth="1.5" /></svg>,
  globe:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" /></svg>,
  layers: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>,
  lock:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>,
  play:   <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>,
  spark2: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 2.5 7L22 11l-6 4 2 8-6-4-6 4 2-8-6-4 7.5-2z" /></svg>,
  heart:  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7-4.5-9-9c-1.6-3.6 1-8 5-8 2 0 3 1 4 3 1-2 2-3 4-3 4 0 6.6 4.4 5 8-2 4.5-9 9-9 9z" /></svg>,
};
const FT_META: { title: string; sub: string; icon: ReactNode }[] = [
  { title: "Instant deploys",     sub: "Ship to global edge in under 30 seconds.",       icon: Icon.bolt },
  { title: "Zero-trust auth",     sub: "Every request signed, verified, and traced.",     icon: Icon.shield },
  { title: "Managed cloud",       sub: "Databases, storage, edge — one dashboard.",       icon: Icon.cloud },
  { title: "Compute nodes",       sub: "Serverless workers scale to millions of req.",     icon: Icon.cpu },
  { title: "Realtime signals",    sub: "Broadcast state across clients in under 40ms.",    icon: Icon.spark },
  { title: "Global CDN",          sub: "42 edge locations · 8ms median latency.",          icon: Icon.globe },
  { title: "Composable layers",   sub: "Design tokens, primitives, patterns — stackable.", icon: Icon.layers },
  { title: "Encrypted at rest",   sub: "AES-256 + rotated keys · SOC-2 ready.",            icon: Icon.lock },
  { title: "Streaming media",     sub: "Adaptive playback with per-viewer analytics.",     icon: Icon.play },
  { title: "AI copilots",         sub: "Prompted actions embedded in every surface.",      icon: Icon.spark2 },
  { title: "Loved by teams",      sub: "Rated 4.9/5 across 12,000 seat installs.",         icon: Icon.heart },
];

/* ============================================================ */
/* Assemble 89 cards                                             */
/* ============================================================ */

function pick<T>(arr: T[], i: number): T { return arr[i % arr.length]; }

const CODE_STUB = (family: string) =>
  `// Novix UI · Cards · ${family}\n// See src/data/cards-extra.tsx for the full source.\n// Every card ships with real 3D depth + hover animation.\n<${family} palette={palette} {...content} />`;

export const CARDS_EXTRA: CardItem[] = [
  ...GG_META.map((m, i): CardItem => {
    const p = pick(PALETTES, i);
    return { id: `gg-${p.key}-${i}`, name: `Aurora · ${m.title}`, render: () => <GradientGlass p={p} {...m} />, code: CODE_STUB("GradientGlass") };
  }),
  ...LD_META.map((m, i): CardItem => {
    const p = pick(PALETTES, i + 3);
    return { id: `ld-${p.key}-${i}`, name: `Depth · ${m.title}`, render: () => <LayeredDepth p={p} {...m} />, code: CODE_STUB("LayeredDepth") };
  }),
  ...NB_META.map((m, i): CardItem => {
    const p = pick(PALETTES, i + 6);
    return { id: `nb-${p.key}-${i}`, name: `Neon · ${m.title}`, render: () => <NeonBorder p={p} k={i} {...m} />, code: CODE_STUB("NeonBorder") };
  }),
  ...PR_META.map((m, i): CardItem => {
    const p = pick(PALETTES, i + 9);
    return { id: `pr-${p.key}-${i}`, name: `Pricing · ${m.title}`, render: () => <PricingCard p={p} {...m} />, code: CODE_STUB("PricingCard") };
  }),
  ...ST_META.map((m, i): CardItem => {
    const p = pick(PALETTES, i + 2);
    return { id: `st-${p.key}-${i}`, name: `Stat · ${m.label}`, render: () => <StatCard p={p} {...m} />, code: CODE_STUB("StatCard") };
  }),
  ...MD_META.map((m, i): CardItem => {
    const p = pick(PALETTES, i + 5);
    return { id: `md-${p.key}-${i}`, name: `Media · ${m.title}`, render: () => <MediaCard p={p} {...m} />, code: CODE_STUB("MediaCard") };
  }),
  ...NT_META.map((m, i): CardItem => {
    const p = pick(PALETTES, i + 8);
    return { id: `nt-${p.key}-${i}`, name: `Notify · ${m.title}`, render: () => <NotifCard p={p} {...m} />, code: CODE_STUB("NotifCard") };
  }),
  ...PF_META.map((m, i): CardItem => {
    const p = pick(PALETTES, i + 11);
    return { id: `pf-${p.key}-${i}`, name: `Profile · ${m.name}`, render: () => <ProfileCard p={p} {...m} />, code: CODE_STUB("ProfileCard") };
  }),
  ...WT_META.map((m, i): CardItem => {
    const p = pick(PALETTES, i + 14);
    return { id: `wt-${p.key}-${i}`, name: `Weather · ${m.city}`, render: () => <WeatherCard p={p} {...m} />, code: CODE_STUB("WeatherCard") };
  }),
  ...QT_META.map((m, i): CardItem => {
    const p = pick(PALETTES, i + 4);
    return { id: `qt-${p.key}-${i}`, name: `Quote · ${m.name.split(" ")[0]}`, render: () => <QuoteCard p={p} {...m} />, code: CODE_STUB("QuoteCard") };
  }),
  ...CH_META.map((m, i): CardItem => {
    const p = pick(PALETTES, i + 7);
    return { id: `ch-${p.key}-${i}`, name: `Chart · ${m.title}`, render: () => <ChartCard p={p} {...m} />, code: CODE_STUB("ChartCard") };
  }),
  ...FT_META.map((m, i): CardItem => {
    const p = pick(PALETTES, i + 1);
    return { id: `ft-${p.key}-${i}`, name: `Feature · ${m.title}`, render: () => <FeatureTile p={p} {...m} />, code: CODE_STUB("FeatureTile") };
  }),
];
