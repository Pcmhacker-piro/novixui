import type { ReactNode } from "react";
import type { KitItem } from "@/data/kits";

/* ============================================================
   100 Premium 3D UI Kits — Novix UI
   Each kit fills a 420px card; parent card supplies hover host.
   Shared visual grammar: perspective wrapper + group-hover tilt.
   ============================================================ */

type Palette = { a: string; b: string; c: string; ink: string; name: string };
const PAL: Palette[] = [
  { name: "Nebula", a: "#7c3aed", b: "#c026d3", c: "#ec4899", ink: "#fdf4ff" },
  { name: "Lagoon", a: "#06b6d4", b: "#14b8a6", c: "#a3e635", ink: "#ecfeff" },
  { name: "Sunset", a: "#f97316", b: "#f43f5e", c: "#d946ef", ink: "#fff7ed" },
  { name: "Cosmic", a: "#3b82f6", b: "#6366f1", c: "#a855f7", ink: "#eff6ff" },
  { name: "Aurora", a: "#22d3ee", b: "#a78bfa", c: "#f472b6", ink: "#f5f3ff" },
  { name: "Ember", a: "#f59e0b", b: "#ef4444", c: "#b91c1c", ink: "#fff1f2" },
  { name: "Mint", a: "#10b981", b: "#22d3ee", c: "#0ea5e9", ink: "#ecfdf5" },
  { name: "Royal", a: "#4338ca", b: "#7c3aed", c: "#db2777", ink: "#eef2ff" },
  { name: "Peach", a: "#fb923c", b: "#f472b6", c: "#a78bfa", ink: "#fff7ed" },
  { name: "Forest", a: "#059669", b: "#65a30d", c: "#eab308", ink: "#f0fdf4" },
];
const grad = (p: Palette) => `linear-gradient(135deg, ${p.a}, ${p.b}, ${p.c})`;

/* ---------- Frame: perspective + hover 3D tilt shell ---------- */
function Frame({ children }: { children: ReactNode; tilt?: string }) {
  return (
    <div className="relative h-full w-full [perspective:1200px]">
      <div
        className="absolute inset-3 rounded-2xl border border-white/10 bg-gradient-to-br from-[#0d0d18] to-[#050510] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] transition-all duration-500 ease-out group-hover:[transform:translateY(-4px)_rotateX(3deg)_rotateY(-4deg)] group-hover:border-white/20 group-hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9)]"
      >
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}

/* Small primitives */
const Bar = ({ w = "w-24", op = "bg-white/15", h = "h-3", cls = "" }: { w?: string; op?: string; h?: string; cls?: string }) => (
  <span className={`inline-block rounded-full ${w} ${h} ${op} ${cls}`} />
);
const Dot = ({ c }: { c: string }) => <span className="h-2 w-2 rounded-full" style={{ background: c }} />;
const Chip = ({ text, p }: { text: string; p: Palette }) => (
  <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold" style={{ background: `${p.a}22`, color: p.ink, boxShadow: `inset 0 0 0 1px ${p.a}55` }}>{text}</span>
);

/* ============================================================
   TEMPLATE FACTORIES — 10 templates × 10 palettes = 100 kits
   Each template is a distinct product surface.
   ============================================================ */

/* T1 · Analytics Dashboard */
const T1 = (p: Palette, label: string) => () => (
  <Frame>
    <div className="absolute inset-0 rounded-2xl border border-white/10 bg-[#08080c] p-3">
      <div className="flex items-center justify-between border-b border-white/8 pb-2">
        <div className="flex items-center gap-2">
          <span className="h-5 w-5 rounded-md" style={{ background: grad(p) }} />
          <span className="text-[11px] font-semibold text-white">{label}</span>
        </div>
        <Chip text="Live" p={p} />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[["MRR", "$48.2k", "+12%"], ["Users", "12,847", "+3.4%"], ["Churn", "1.9%", "-0.2%"]].map(([k, v, d]) => (
          <div key={k} className="rounded-lg border border-white/8 bg-white/[0.03] p-2">
            <div className="text-[8px] uppercase tracking-wider text-white/50">{k}</div>
            <div className="text-[13px] font-bold text-white">{v}</div>
            <div className="text-[8px]" style={{ color: p.b }}>{d}</div>
          </div>
        ))}
      </div>
      <div className="relative mt-3 h-24 rounded-lg border border-white/8 bg-white/[0.02] p-2">
        <svg viewBox="0 0 200 60" className="h-full w-full">
          <defs>
            <linearGradient id={`g${p.name}1`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor={p.a} stopOpacity="0.6" />
              <stop offset="1" stopColor={p.a} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0,45 L20,38 L40,42 L60,25 L80,30 L100,18 L120,22 L140,10 L160,15 L180,8 L200,12 L200,60 L0,60 Z" fill={`url(#g${p.name}1)`} />
          <path d="M0,45 L20,38 L40,42 L60,25 L80,30 L100,18 L120,22 L140,10 L160,15 L180,8 L200,12" stroke={p.b} strokeWidth="1.5" fill="none" />
        </svg>
      </div>
      <div className="mt-2 flex items-center justify-between text-[9px] text-white/50">
        <span>Last 7 days</span>
        <span className="flex gap-2"><Dot c={p.a} />Signups <Dot c={p.c} />Revenue</span>
      </div>
    </div>
  </Frame>
);

/* T2 · Music Player */
const T2 = (p: Palette, label: string) => () => (
  <Frame>
    <div className="absolute inset-0 rounded-2xl bg-[#08080c] p-3">
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-3">
          <div className="h-16 w-16 rounded-xl shadow-lg" style={{ background: grad(p), boxShadow: `0 20px 40px -15px ${p.a}` }} />
          <div className="flex-1">
            <div className="text-[11px] font-bold text-white">{label}</div>
            <div className="text-[9px] text-white/60">Nebula Sessions · Vol. 3</div>
            <div className="mt-2 flex gap-1">
              <Chip text="Ambient" p={p} />
              <Chip text="Chill" p={p} />
            </div>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {["Aurora Drift", "Silent Bloom", "Ember Rise", "Midnight Ion"].map((t, i) => (
            <div key={t} className="flex items-center justify-between rounded-md px-2 py-1.5 text-[10px]" style={{ background: i === 1 ? `${p.a}22` : "transparent" }}>
              <div className="flex items-center gap-2">
                <span className="w-3 text-white/40">{i + 1}</span>
                <span className={i === 1 ? "font-semibold text-white" : "text-white/70"}>{t}</span>
              </div>
              <span className="text-white/40">{["3:24", "4:12", "2:58", "5:03"][i]}</span>
            </div>
          ))}
        </div>
        <div className="mt-auto">
          <div className="h-1 rounded-full bg-white/10">
            <div className="h-full rounded-full" style={{ width: "42%", background: grad(p) }} />
          </div>
          <div className="mt-2 flex items-center justify-center gap-4 text-white/80">
            <span className="text-[14px]">⏮</span>
            <span className="grid h-8 w-8 place-items-center rounded-full text-[12px] text-black" style={{ background: grad(p) }}>▶</span>
            <span className="text-[14px]">⏭</span>
          </div>
        </div>
      </div>
    </div>
  </Frame>
);

/* T3 · Chat / AI Console */
const T3 = (p: Palette, label: string) => () => (
  <Frame>
    <div className="absolute inset-0 rounded-2xl bg-[#08080c] p-3">
      <div className="flex items-center gap-2 border-b border-white/8 pb-2">
        <span className="h-5 w-5 rounded-md" style={{ background: grad(p) }} />
        <span className="text-[11px] font-semibold text-white">{label}</span>
        <span className="ml-auto text-[9px] text-white/40">gpt-4o · 2.1k ctx</span>
      </div>
      <div className="mt-3 space-y-2">
        <div className="ml-auto max-w-[75%] rounded-2xl rounded-tr-sm px-3 py-2 text-[10px] text-white" style={{ background: grad(p) }}>
          Draft a launch email for our new pricing tier.
        </div>
        <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-white/[0.06] px-3 py-2 text-[10px] text-white/85">
          Here's a warm, direct draft focused on value. Adjust tone as needed.
          <div className="mt-2 rounded-md border border-white/10 bg-black/40 p-2 font-mono text-[9px] text-white/70">
            Subject: A smarter way to scale ✨<br />Hi {"{name}"} — we just rolled out…
          </div>
        </div>
        <div className="max-w-[60%] rounded-2xl rounded-tl-sm bg-white/[0.06] px-3 py-2 text-[10px] text-white/85 flex items-center gap-1">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: p.b }} />
          Typing…
        </div>
      </div>
      <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
        <span className="text-white/40 text-[10px]">Ask anything…</span>
        <span className="ml-auto grid h-6 w-6 place-items-center rounded-md text-[10px] text-black" style={{ background: grad(p) }}>↵</span>
      </div>
    </div>
  </Frame>
);

/* T4 · E-commerce Product */
const T4 = (p: Palette, label: string) => () => (
  <Frame>
    <div className="absolute inset-0 rounded-2xl bg-[#08080c] p-3">
      <div className="grid h-full grid-cols-2 gap-3">
        <div className="relative overflow-hidden rounded-xl" style={{ background: grad(p) }}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.4),transparent_50%)]" />
          <div className="absolute bottom-2 left-2 rounded-md bg-black/40 px-2 py-0.5 text-[9px] text-white backdrop-blur">-25%</div>
        </div>
        <div className="flex flex-col">
          <div className="text-[10px] uppercase tracking-widest text-white/50">{p.name} Ed.</div>
          <div className="text-[13px] font-bold text-white">{label}</div>
          <div className="mt-1 text-[9px] text-white/60">Handcrafted, limited run.</div>
          <div className="mt-2 flex gap-1">
            {["S", "M", "L", "XL"].map((s, i) => (
              <span key={s} className="grid h-6 w-6 place-items-center rounded-md border text-[9px]" style={{ borderColor: i === 1 ? p.b : "rgba(255,255,255,0.15)", color: i === 1 ? p.ink : "rgba(255,255,255,0.7)", background: i === 1 ? `${p.a}22` : "transparent" }}>{s}</span>
            ))}
          </div>
          <div className="mt-auto">
            <div className="text-[16px] font-bold text-white">$189<span className="ml-1 text-[10px] text-white/40 line-through">$249</span></div>
            <button className="mt-2 w-full rounded-lg py-1.5 text-[10px] font-semibold text-black" style={{ background: grad(p), boxShadow: `0 8px 20px -8px ${p.a}` }}>Add to cart</button>
          </div>
        </div>
      </div>
    </div>
  </Frame>
);

/* T5 · Kanban Board */
const T5 = (p: Palette, label: string) => () => (
  <Frame>
    <div className="absolute inset-0 rounded-2xl bg-[#08080c] p-3">
      <div className="flex items-center justify-between border-b border-white/8 pb-2">
        <span className="text-[11px] font-semibold text-white">{label}</span>
        <Chip text="Sprint 24" p={p} />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          { t: "To do", n: 4, tasks: ["Refactor auth", "Design tokens"] },
          { t: "In progress", n: 2, tasks: ["Payments", "Onboarding"] },
          { t: "Done", n: 6, tasks: ["Analytics", "SSO login"] },
        ].map((col, ci) => (
          <div key={col.t} className="rounded-lg border border-white/8 bg-white/[0.02] p-1.5">
            <div className="flex items-center justify-between px-1 pb-1 text-[9px] uppercase tracking-wider text-white/50">
              <span>{col.t}</span><span>{col.n}</span>
            </div>
            <div className="space-y-1.5">
              {col.tasks.map((task, i) => (
                <div key={task} className="rounded-md border border-white/8 bg-[#0d0d15] p-1.5 shadow-sm">
                  <div className="text-[9px] text-white/85">{task}</div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="rounded px-1 py-px text-[7px]" style={{ background: `${[p.a, p.b, p.c][ci]}33`, color: p.ink }}>NX-{100 + ci * 3 + i}</span>
                    <span className="h-3 w-3 rounded-full" style={{ background: grad(p) }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </Frame>
);

/* T6 · Calendar / Schedule */
const T6 = (p: Palette, label: string) => () => (
  <Frame>
    <div className="absolute inset-0 rounded-2xl bg-[#08080c] p-3">
      <div className="flex items-center justify-between border-b border-white/8 pb-2">
        <span className="text-[11px] font-semibold text-white">{label}</span>
        <span className="text-[9px] text-white/50">March 2026</span>
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1 text-[9px]">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <div key={i} className="text-center text-white/40">{d}</div>)}
        {Array.from({ length: 28 }).map((_, i) => {
          const isToday = i === 15;
          const hasEvent = [3, 8, 15, 21].includes(i);
          return (
            <div key={i} className="grid h-6 place-items-center rounded text-white/70 transition" style={{ background: isToday ? grad(p) : hasEvent ? "rgba(255,255,255,0.04)" : "transparent", color: isToday ? "#000" : undefined, fontWeight: isToday ? 700 : 400 }}>
              {i + 1}
            </div>
          );
        })}
      </div>
      <div className="mt-3 space-y-1.5">
        {[["09:00", "Standup", p.a], ["11:30", "Design review", p.b], ["14:00", "Ship 2.0 release", p.c]].map(([t, e, c]) => (
          <div key={e} className="flex items-center gap-2 rounded-md border-l-2 bg-white/[0.03] px-2 py-1.5" style={{ borderColor: c }}>
            <span className="w-10 text-[9px] font-mono text-white/60">{t}</span>
            <span className="text-[10px] text-white">{e}</span>
          </div>
        ))}
      </div>
    </div>
  </Frame>
);

/* T7 · Auth / Login card */
const T7 = (p: Palette, label: string) => () => (
  <Frame>
    <div className="absolute inset-0 rounded-2xl bg-[#08080c] p-4">
      <div className="mx-auto flex h-full max-w-[240px] flex-col items-center">
        <span className="grid h-10 w-10 place-items-center rounded-xl text-[16px] font-bold text-black" style={{ background: grad(p), boxShadow: `0 12px 30px -8px ${p.a}` }}>N</span>
        <div className="mt-3 text-[13px] font-bold text-white">Welcome back</div>
        <div className="text-[10px] text-white/50">Sign in to {label}</div>
        <div className="mt-4 w-full space-y-2">
          <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-[10px] text-white/60">you@studio.dev</div>
          <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-[10px] text-white/60">••••••••••</div>
          <button className="w-full rounded-lg py-2 text-[10px] font-semibold text-black" style={{ background: grad(p) }}>Continue</button>
        </div>
        <div className="my-3 flex w-full items-center gap-2 text-[8px] text-white/40">
          <span className="h-px flex-1 bg-white/10" />OR<span className="h-px flex-1 bg-white/10" />
        </div>
        <div className="grid w-full grid-cols-3 gap-2">
          {["G", "", "GH"].map((g, i) => <button key={i} className="rounded-lg border border-white/10 bg-white/[0.03] py-1.5 text-[10px] text-white/70">{g}</button>)}
        </div>
      </div>
    </div>
  </Frame>
);

/* T8 · Pricing table */
const T8 = (p: Palette, label: string) => () => (
  <Frame>
    <div className="absolute inset-0 rounded-2xl bg-[#08080c] p-3">
      <div className="mb-2 text-center">
        <div className="text-[11px] font-semibold text-white">{label}</div>
        <div className="text-[9px] text-white/50">Simple, transparent pricing</div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { t: "Starter", pr: "$9", f: ["1 project", "Email support"] },
          { t: "Pro", pr: "$29", f: ["Unlimited", "Priority", "API access"], hi: true },
          { t: "Team", pr: "$79", f: ["Everything", "SSO", "SLA"] },
        ].map((tier) => (
          <div key={tier.t} className="rounded-lg border p-2" style={{
            borderColor: tier.hi ? p.b : "rgba(255,255,255,0.08)",
            background: tier.hi ? `linear-gradient(180deg, ${p.a}22, transparent)` : "rgba(255,255,255,0.02)",
            boxShadow: tier.hi ? `0 20px 40px -20px ${p.a}88` : "none",
          }}>
            <div className="text-[10px] font-semibold text-white">{tier.t}</div>
            <div className="mt-1 text-[16px] font-bold text-white">{tier.pr}<span className="text-[9px] text-white/50">/mo</span></div>
            <ul className="mt-2 space-y-1 text-[8px] text-white/60">
              {tier.f.map((x) => <li key={x} className="flex items-center gap-1"><span style={{ color: p.b }}>✓</span>{x}</li>)}
            </ul>
            <button className="mt-2 w-full rounded-md py-1 text-[9px] font-semibold" style={{ background: tier.hi ? grad(p) : "rgba(255,255,255,0.06)", color: tier.hi ? "#000" : "#fff" }}>{tier.hi ? "Get Pro" : "Choose"}</button>
          </div>
        ))}
      </div>
    </div>
  </Frame>
);

/* T9 · Wallet / Finance */
const T9 = (p: Palette, label: string) => () => (
  <Frame>
    <div className="absolute inset-0 rounded-2xl bg-[#08080c] p-3">
      <div className="relative overflow-hidden rounded-xl p-3" style={{ background: grad(p), boxShadow: `0 20px 40px -15px ${p.a}` }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.35),transparent_50%)]" />
        <div className="relative flex items-start justify-between">
          <div>
            <div className="text-[9px] uppercase text-white/70">{label}</div>
            <div className="mt-1 text-[9px] font-mono text-white/85">•••• •••• •••• 2947</div>
          </div>
          <div className="flex h-6 w-10 items-end justify-end">
            <span className="h-4 w-4 rounded-full bg-white/40" />
            <span className="-ml-2 h-4 w-4 rounded-full bg-white/70" />
          </div>
        </div>
        <div className="relative mt-4 flex items-end justify-between">
          <div>
            <div className="text-[8px] text-white/70">Balance</div>
            <div className="text-[16px] font-bold text-white">$12,847.29</div>
          </div>
          <div className="text-[8px] text-white/80">08/28</div>
        </div>
      </div>
      <div className="mt-3 space-y-1.5">
        {[["Stripe payout", "+$4,290", p.b], ["Figma Pro", "-$45", "#ef4444"], ["Vercel", "-$120", "#ef4444"]].map(([n, v, c]) => (
          <div key={n} className="flex items-center justify-between rounded-md bg-white/[0.03] px-2 py-1.5 text-[10px]">
            <div className="flex items-center gap-2"><span className="h-6 w-6 rounded-md" style={{ background: `${c}33` }} /><span className="text-white/85">{n}</span></div>
            <span className="font-mono" style={{ color: c }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  </Frame>
);

/* T10 · Landing / Hero */
const T10 = (p: Palette, label: string) => () => (
  <Frame>
    <div className="absolute inset-0 overflow-hidden rounded-2xl bg-[#08080c] p-3">
      <div className="absolute -top-16 left-1/2 h-48 w-[140%] -translate-x-1/2 rounded-full opacity-40 blur-3xl" style={{ background: grad(p) }} />
      <div className="relative flex items-center justify-between text-[10px]">
        <span className="flex items-center gap-1"><span className="h-4 w-4 rounded-md" style={{ background: grad(p) }} /><span className="font-semibold text-white">{label}</span></span>
        <span className="hidden gap-3 text-white/60 sm:flex"><span>Product</span><span>Docs</span><span>Pricing</span></span>
        <span className="rounded-md px-2 py-1 text-[9px] font-semibold text-black" style={{ background: grad(p) }}>Start</span>
      </div>
      <div className="relative mt-8 text-center">
        <Chip text="✨ New · v2.0" p={p} />
        <div className="mx-auto mt-3 max-w-[280px] text-[18px] font-bold leading-tight text-white">Ship interfaces that feel <span style={{ backgroundImage: grad(p), WebkitBackgroundClip: "text", color: "transparent" }}>alive</span>.</div>
        <div className="mx-auto mt-2 max-w-[240px] text-[10px] text-white/60">A premium component system for teams who care about the last 5%.</div>
        <div className="mt-3 flex items-center justify-center gap-2">
          <button className="rounded-lg px-3 py-1.5 text-[10px] font-semibold text-black" style={{ background: grad(p), boxShadow: `0 10px 24px -8px ${p.a}` }}>Get started</button>
          <button className="rounded-lg border border-white/15 bg-white/[0.04] px-3 py-1.5 text-[10px] text-white">Live demo</button>
        </div>
      </div>
      <div className="absolute inset-x-4 bottom-3 flex items-center justify-around opacity-60">
        {["ACME", "GLIDE", "NORTH", "AXIS"].map((b) => <span key={b} className="text-[9px] font-bold tracking-wider text-white/50">{b}</span>)}
      </div>
    </div>
  </Frame>
);

/* ============================================================
   Templates + Names — build 100 kits
   ============================================================ */

type Template = { key: string; tagline: string; names: string[]; make: (p: Palette, label: string) => () => ReactNode };

const TEMPLATES: Template[] = [
  { key: "Dashboard", tagline: "Metrics, charts and live KPIs.", make: T1, names: ["Pulse Analytics", "OrbitOps", "Beacon Metrics", "Signal Board", "Delta Insights", "Vertex OS", "Northlight", "Compass HQ", "Prism Console", "Atlas Room"] },
  { key: "Music",     tagline: "Player with playlist + controls.",  make: T2, names: ["Waveform", "Sonar Player", "Loopline", "Aria Player", "Frequency", "Nocturne", "Reverb One", "Tempo Deck", "Chord Studio", "Drift Radio"] },
  { key: "AI Chat",   tagline: "Assistant console + composer.",     make: T3, names: ["Cortex Chat", "Sage Console", "Beacon AI", "Threadline", "Muse Copilot", "Halo Chat", "Prompt Deck", "Ion Assistant", "Loop AI", "Kairos"] },
  { key: "Commerce",  tagline: "Product card + variant picker.",    make: T4, names: ["Boutique", "Marché", "Cove Store", "Atelier 6", "Northshop", "Halo Goods", "Ember Shop", "Meridian", "Luxa", "Fable Store"] },
  { key: "Kanban",    tagline: "Board with columns and cards.",     make: T5, names: ["Stride Board", "Sprintly", "Cadence", "Flowline", "Delta Board", "Runway Ops", "Orbit Tasks", "Momentum", "Baseline", "Groundwork"] },
  { key: "Calendar",  tagline: "Month grid + upcoming events.",     make: T6, names: ["Kairos Cal", "Almanac", "Planr", "Timelight", "Horizon Cal", "Meridian Days", "Cycle", "North Days", "Rhythm", "Cadence Cal"] },
  { key: "Auth",      tagline: "Sign-in with SSO providers.",       make: T7, names: ["Keyring", "Passkey", "Vaultgate", "Sesame", "Guardline", "Threshold", "Northgate", "Anchor Auth", "Ember Login", "Prism Sign-in"] },
  { key: "Pricing",   tagline: "3-tier plan comparison.",           make: T8, names: ["Meter", "Tiers", "Priceframe", "Fairline", "Levels", "PlanDeck", "Halo Plans", "Stack Pricing", "Runway Plans", "Baseline Plans"] },
  { key: "Wallet",    tagline: "Card + recent transactions.",       make: T9, names: ["Vault Card", "Ledger", "Northbank", "Halo Pay", "Ember Card", "Ion Wallet", "Meridian Bank", "Boughtly", "Cove Pay", "Anchor Pay"] },
  { key: "Landing",   tagline: "Hero + CTA + trust bar.",           make: T10, names: ["Launchframe", "Halo Site", "Prism Site", "Orbit Landing", "Beacon Site", "Northland", "Meridian Site", "Ember Page", "Anchor Site", "Ion Landing"] },
];

const items: KitItem[] = [];
let n = 0;
for (const t of TEMPLATES) {
  for (let i = 0; i < 10; i++) {
    n++;
    const p = PAL[i % PAL.length];
    const label = t.names[i] ?? `${t.key} ${i + 1}`;
    items.push({
      id: `kit-ex-${n}`,
      name: `${label}`,
      tagline: `${t.key} · ${p.name} · ${t.tagline}`,
      render: t.make(p, label),
      code: `// ${label} — Novix UI premium ${t.key} kit\n// Full source in src/data/kits-extra.tsx`,
    });
  }
}

export const KITS_EXTRA: KitItem[] = items;
