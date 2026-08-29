import type { ReactNode } from "react";

export type KitItem = {
  id: string;
  name: string;
  tagline: string;
  render: () => ReactNode;
  code: string;
};

/* Hover host attribute: data-kt-hover-host */

/* ---------- 01 · SaaS Dashboard ---------- */
function SaasDashboard() {
  return (
    <div className="relative h-full w-full [perspective:1400px]">
      <div className="absolute inset-4 rounded-2xl border border-white/10 bg-gradient-to-br from-[#0d0d18] to-[#050510] p-4 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateX(6deg)_rotateY(-10deg)_translateZ(20px)]">
        {/* sidebar */}
        <div className="absolute left-4 top-4 bottom-4 w-16 rounded-xl border border-white/10 bg-white/[0.03] p-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={`mb-2 block h-6 w-6 rounded-md ${i === 1 ? "bg-violet-500" : "bg-white/10"} transition-transform group-hover:scale-110`}
              style={{ transitionDelay: `${i * 40}ms` }}
            />
          ))}
        </div>
        {/* topbar */}
        <div className="ml-20 flex items-center justify-between border-b border-white/8 pb-2">
          <div className="h-4 w-32 rounded bg-white/10" />
          <div className="flex gap-1.5">
            <span className="h-4 w-4 rounded-full bg-fuchsia-400/70" />
            <span className="h-4 w-4 rounded-full bg-cyan-400/70" />
          </div>
        </div>
        {/* stats row */}
        <div className="ml-20 mt-3 grid grid-cols-3 gap-2">
          {["12.4k", "$8.2k", "94%"].map((v, i) => (
            <div
              key={i}
              className="rounded-lg border border-white/10 bg-white/[0.04] p-2 transition-all duration-500 group-hover:-translate-y-1"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="text-[9px] uppercase tracking-wider text-white/50">Metric</div>
              <div className="mt-0.5 text-[13px] font-semibold text-white">{v}</div>
            </div>
          ))}
        </div>
        {/* chart */}
        <div className="ml-20 mt-3 h-24 rounded-lg border border-white/10 bg-white/[0.02] p-2">
          <svg viewBox="0 0 200 80" className="h-full w-full">
            <defs>
              <linearGradient id="kg1" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0 60 L30 45 L60 55 L90 30 L120 40 L150 20 L180 28 L200 15"
              stroke="#a78bfa"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M0 60 L30 45 L60 55 L90 30 L120 40 L150 20 L180 28 L200 15 L200 80 L0 80 Z"
              fill="url(#kg1)"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ---------- 02 · AI Chat ---------- */
function AiChat() {
  return (
    <div className="relative h-full w-full [perspective:1200px]">
      <div className="absolute inset-6 rounded-2xl border border-white/10 bg-[#0a0a12] p-4 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(-8deg)_translateZ(20px)]">
        <div className="mb-3 flex items-center gap-2 border-b border-white/8 pb-2">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-500 text-[10px] font-bold text-white">N</span>
          <span className="text-[11px] font-semibold text-white">Novix AI</span>
          <span className="ml-auto h-2 w-2 rounded-full bg-emerald-400" />
        </div>
        <div className="space-y-2">
          <div className="ml-auto max-w-[70%] rounded-2xl rounded-tr-sm bg-violet-500/90 px-3 py-2 text-[11px] text-white opacity-0 [animation:kt-fadeup_.5s_ease-out_.1s_forwards] group-hover:[animation-play-state:running]">
            Design me a hero
          </div>
          <div className="max-w-[80%] rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.05] px-3 py-2 text-[11px] text-white/80 opacity-0 [animation:kt-fadeup_.5s_ease-out_.4s_forwards]">
            Sure! Aurora gradient with a spotlight beam?
          </div>
          <div className="ml-auto max-w-[60%] rounded-2xl rounded-tr-sm bg-violet-500/90 px-3 py-2 text-[11px] text-white opacity-0 [animation:kt-fadeup_.5s_ease-out_.8s_forwards]">
            Perfect ✨
          </div>
        </div>
        <div className="absolute inset-x-4 bottom-4 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5">
          <span className="text-[10px] text-white/40">Ask Nova anything…</span>
          <span className="ml-auto h-5 w-5 rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-500" />
        </div>
      </div>
      <style>{`@keyframes kt-fadeup{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

/* ---------- 03 · E-commerce ---------- */
function EcomKit() {
  return (
    <div className="relative h-full w-full [perspective:1200px]">
      <div className="absolute inset-4 rounded-2xl border border-white/10 bg-gradient-to-br from-[#12121a] to-[#050505] p-4 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] transition-transform duration-700 group-hover:[transform:rotateX(4deg)_rotateY(6deg)]">
        <div className="flex items-center justify-between border-b border-white/8 pb-2">
          <span className="font-display text-[12px] font-semibold text-white">ATLAS · Shop</span>
          <span className="text-[10px] text-white/50">Cart · 2</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {[
            { c: "from-rose-500 to-orange-400", n: "Halo 01", p: "$129" },
            { c: "from-cyan-400 to-emerald-400", n: "Prism 02", p: "$149" },
            { c: "from-violet-500 to-fuchsia-500", n: "Aurora 03", p: "$179" },
            { c: "from-amber-400 to-rose-500", n: "Ember 04", p: "$99" },
          ].map((it, i) => (
            <div
              key={i}
              className="group/prod overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] transition-all duration-500 hover:-translate-y-1 hover:border-white/20"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className={`relative h-14 bg-gradient-to-br ${it.c}`}>
                <span className="absolute inset-0 opacity-0 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-100" style={{ background: "linear-gradient(115deg,transparent 40%,#fff,transparent 60%)" }} />
              </div>
              <div className="flex items-center justify-between px-2 py-1.5">
                <span className="text-[10px] text-white/80">{it.n}</span>
                <span className="text-[10px] font-semibold text-white">{it.p}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- 04 · Landing Page ---------- */
function LandingKit() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <span aria-hidden className="pointer-events-none absolute -inset-16 opacity-60 blur-3xl transition-opacity duration-700 group-hover:opacity-100" style={{ background: "conic-gradient(from 90deg at 30% 20%, #7c3aed, #22d3ee, #ec4899, #7c3aed)" }} />
      <div className="absolute inset-6 rounded-2xl border border-white/10 bg-black/60 p-5 backdrop-blur-xl shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] transition-transform duration-700 group-hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <span className="font-display text-[12px] font-bold text-white">nova<span className="text-fuchsia-400">ui</span></span>
          <div className="flex gap-3 text-[9px] text-white/60">
            <span>Docs</span><span>Pricing</span><span>Blog</span>
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="mx-auto inline-block rounded-full border border-white/15 bg-white/[0.05] px-2.5 py-0.5 text-[9px] uppercase tracking-widest text-white/70">New · v2</p>
          <h3 className="mt-2 font-display text-[18px] font-bold leading-tight tracking-tight text-white">
            Build interfaces <br />that feel alive.
          </h3>
          <div className="mt-3 flex justify-center gap-2">
            <span className="rounded-full bg-white px-3 py-1 text-[10px] font-semibold text-black">Start free</span>
            <span className="rounded-full border border-white/15 px-3 py-1 text-[10px] text-white/80">Watch demo</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- 05 · Analytics ---------- */
function AnalyticsKit() {
  return (
    <div className="relative h-full w-full [perspective:1400px]">
      <div className="absolute inset-4 rounded-2xl border border-white/10 bg-gradient-to-br from-[#0e0e18] to-[#050510] p-4 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateX(8deg)_translateZ(20px)]">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[9px] uppercase tracking-widest text-white/50">Revenue</div>
            <div className="mt-0.5 text-[16px] font-bold text-white">$142,890</div>
          </div>
          <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-semibold text-emerald-300">+18.2%</span>
        </div>
        {/* bars */}
        <div className="mt-4 flex h-20 items-end gap-1.5">
          {[40, 65, 30, 80, 55, 90, 45, 70, 60, 85, 50, 95].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t bg-gradient-to-t from-violet-600 to-fuchsia-400 transition-all duration-700"
              style={{
                height: `${h * 0.6}%`,
                transitionDelay: `${i * 40}ms`,
                transform: "scaleY(0.3)",
                transformOrigin: "bottom",
                animation: `kt-bar 1.2s ease-out ${i * 40}ms forwards`,
              }}
            />
          ))}
        </div>
        {/* legend */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          {["Sessions", "Signups", "Retention"].map((l, i) => (
            <div key={l} className="rounded border border-white/10 bg-white/[0.03] px-2 py-1">
              <div className="text-[8px] text-white/50">{l}</div>
              <div className="text-[10px] font-semibold text-white">{["8.2k", "1.4k", "72%"][i]}</div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes kt-bar{to{transform:scaleY(1)}}`}</style>
    </div>
  );
}

/* ---------- 06 · Music Player ---------- */
function MusicKit() {
  return (
    <div className="relative h-full w-full [perspective:1400px]">
      <div className="absolute inset-4 rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a0b2e] via-[#0f0620] to-[#050510] p-4 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(-10deg)_rotateX(4deg)_translateZ(20px)]">
        <div className="flex items-center gap-3">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-fuchsia-500 via-rose-500 to-orange-400 shadow-[0_10px_30px_-5px_rgba(236,72,153,0.6)]">
            <span aria-hidden className="absolute inset-0 opacity-0 mix-blend-overlay transition-opacity duration-700 group-hover:opacity-100" style={{ background: "conic-gradient(from 0deg,#fff,transparent 40%,#fff)" }} />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-semibold text-white">Aurora Bloom</div>
            <div className="text-[10px] text-white/50">Nova · Signals EP</div>
          </div>
          <span className="ml-auto grid h-8 w-8 place-items-center rounded-full bg-white text-black transition-transform duration-300 group-hover:scale-110">▶</span>
        </div>
        {/* waveform */}
        <div className="mt-4 flex h-14 items-center gap-[3px]">
          {Array.from({ length: 40 }).map((_, i) => (
            <span
              key={i}
              className="flex-1 rounded-full bg-gradient-to-t from-fuchsia-500 to-cyan-300"
              style={{
                height: `${20 + Math.abs(Math.sin(i * 0.6)) * 80}%`,
                animation: `kt-wave 1.4s ease-in-out ${i * 30}ms infinite alternate`,
              }}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[9px] tabular-nums text-white/50">
          <span>1:24</span><span>3:47</span>
        </div>
      </div>
      <style>{`@keyframes kt-wave{from{transform:scaleY(.4)}to{transform:scaleY(1)}}`}</style>
    </div>
  );
}

/* ---------- 07 · Crypto Wallet ---------- */
function CryptoKit() {
  return (
    <div className="relative h-full w-full [perspective:1400px]">
      <div className="absolute inset-4 rounded-2xl border border-white/10 bg-gradient-to-br from-[#001a1a] to-[#000508] p-4 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateX(6deg)_rotateY(-8deg)_translateZ(20px)]">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-widest text-emerald-300/70">Portfolio</span>
          <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-semibold text-emerald-300">+4.28%</span>
        </div>
        <div className="mt-1 font-display text-[22px] font-bold text-white tracking-tight">$48,392.14</div>
        <div className="mt-3 space-y-1.5">
          {[
            { s: "BTC", n: "Bitcoin", v: "$28,140", c: "from-orange-400 to-amber-500", up: true },
            { s: "ETH", n: "Ethereum", v: "$14,820", c: "from-indigo-400 to-violet-500", up: true },
            { s: "SOL", n: "Solana", v: "$5,432", c: "from-fuchsia-400 to-cyan-400", up: false },
          ].map((t, i) => (
            <div
              key={t.s}
              className="flex items-center gap-2 rounded-lg border border-white/8 bg-white/[0.03] p-2 transition-all duration-500 group-hover:translate-x-1"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <span className={`grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br ${t.c} text-[9px] font-bold text-white`}>{t.s}</span>
              <div className="min-w-0">
                <div className="text-[10px] font-semibold text-white">{t.n}</div>
                <div className="text-[9px] text-white/50">{t.v}</div>
              </div>
              <span className={`ml-auto text-[10px] font-semibold ${t.up ? "text-emerald-300" : "text-rose-300"}`}>{t.up ? "▲" : "▼"} 2.4%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- 08 · Kanban Board ---------- */
function KanbanKit() {
  const cols = [
    { t: "To do", n: 4, c: "bg-white/10" },
    { t: "Doing", n: 2, c: "bg-violet-500/30" },
    { t: "Done", n: 6, c: "bg-emerald-500/30" },
  ];
  return (
    <div className="relative h-full w-full [perspective:1200px]">
      <div className="absolute inset-4 rounded-2xl border border-white/10 bg-[#0a0a12] p-3 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateX(4deg)_translateZ(15px)]">
        <div className="grid h-full grid-cols-3 gap-2">
          {cols.map((col, ci) => (
            <div key={col.t} className="flex flex-col rounded-lg border border-white/10 bg-white/[0.02] p-1.5">
              <div className="mb-1.5 flex items-center justify-between px-1">
                <span className="text-[9px] font-semibold uppercase tracking-wider text-white/70">{col.t}</span>
                <span className={`grid h-4 w-4 place-items-center rounded text-[9px] font-bold text-white ${col.c}`}>{col.n}</span>
              </div>
              <div className="space-y-1.5">
                {Array.from({ length: col.n > 3 ? 3 : col.n }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-md border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-1.5 shadow-sm transition-all duration-500 group-hover:-translate-y-0.5"
                    style={{ transitionDelay: `${(ci * 3 + i) * 40}ms` }}
                  >
                    <div className="mb-1 h-1 w-8 rounded-full bg-gradient-to-r from-fuchsia-400 to-violet-400" />
                    <div className="h-1.5 w-full rounded bg-white/20" />
                    <div className="mt-1 h-1.5 w-2/3 rounded bg-white/10" />
                    <div className="mt-1.5 flex -space-x-1">
                      <span className="h-3 w-3 rounded-full bg-cyan-400 ring-1 ring-black" />
                      <span className="h-3 w-3 rounded-full bg-fuchsia-400 ring-1 ring-black" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- 09 · Calendar ---------- */
function CalendarKit() {
  return (
    <div className="relative h-full w-full [perspective:1400px]">
      <div className="absolute inset-4 rounded-2xl border border-white/10 bg-gradient-to-br from-[#0f0f1a] to-[#050510] p-4 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(8deg)_translateZ(20px)]">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-white/50">March</div>
            <div className="font-display text-[16px] font-bold text-white">2026</div>
          </div>
          <div className="flex gap-1">
            <span className="grid h-5 w-5 place-items-center rounded border border-white/10 text-[10px] text-white/70">‹</span>
            <span className="grid h-5 w-5 place-items-center rounded border border-white/10 text-[10px] text-white/70">›</span>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[8px] text-white/40">
          {["S","M","T","W","T","F","S"].map((d, i) => <span key={i}>{d}</span>)}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {Array.from({ length: 28 }).map((_, i) => {
            const isToday = i === 14;
            const hasEvt = [3, 8, 12, 19, 22].includes(i);
            return (
              <div
                key={i}
                className={`relative grid aspect-square place-items-center rounded text-[9px] transition-all duration-300 ${
                  isToday
                    ? "bg-gradient-to-br from-fuchsia-500 to-violet-500 font-bold text-white shadow-[0_4px_12px_rgba(168,85,247,0.5)] group-hover:scale-110"
                    : "text-white/60 hover:bg-white/[0.06]"
                }`}
              >
                {i + 1}
                {hasEvt && !isToday && <span className="absolute bottom-0.5 h-0.5 w-0.5 rounded-full bg-cyan-400" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------- 10 · Pricing ---------- */
function PricingKit() {
  return (
    <div className="relative h-full w-full [perspective:1400px]">
      <div className="absolute inset-4 flex items-center justify-center gap-2">
        {[
          { n: "Starter", p: "9", c: "border-white/10 bg-white/[0.03]", h: false },
          { n: "Pro", p: "29", c: "border-violet-400/40 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/10", h: true },
          { n: "Team", p: "79", c: "border-white/10 bg-white/[0.03]", h: false },
        ].map((t, i) => (
          <div
            key={t.n}
            className={`relative flex-1 rounded-xl border ${t.c} p-3 transition-all duration-700 [transform-style:preserve-3d] ${t.h ? "scale-110 shadow-[0_20px_50px_-15px_rgba(168,85,247,0.6)]" : ""} group-hover:[transform:translateZ(${i === 1 ? 30 : 10}px)_rotateY(${(i - 1) * 6}deg)]`}
          >
            {t.h && <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-500 px-2 py-0.5 text-[8px] font-bold text-white">POPULAR</span>}
            <div className="text-[10px] font-semibold text-white/70">{t.n}</div>
            <div className="mt-1 flex items-baseline gap-0.5">
              <span className="text-[9px] text-white/50">$</span>
              <span className="font-display text-[20px] font-bold text-white">{t.p}</span>
              <span className="text-[8px] text-white/40">/mo</span>
            </div>
            <div className="mt-2 space-y-1">
              {[1,2,3].map((k) => (
                <div key={k} className="flex items-center gap-1">
                  <span className="grid h-2.5 w-2.5 place-items-center rounded-full bg-emerald-500/30 text-[7px] text-emerald-300">✓</span>
                  <span className="h-1 flex-1 rounded bg-white/10" />
                </div>
              ))}
            </div>
            <div className={`mt-3 rounded-md py-1 text-center text-[9px] font-semibold ${t.h ? "bg-white text-black" : "border border-white/10 text-white/80"}`}>Choose</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- 11 · Inbox ---------- */
function InboxKit() {
  const msgs = [
    { n: "Elena Cruz", s: "Design review ready", t: "2m", c: "from-fuchsia-500 to-rose-500", u: true },
    { n: "Marcus Lee", s: "Re: Sprint planning", t: "18m", c: "from-cyan-400 to-emerald-400", u: true },
    { n: "Ava Patel", s: "Shipped new tokens", t: "1h", c: "from-violet-500 to-indigo-500", u: false },
    { n: "GitHub", s: "PR #482 merged", t: "3h", c: "from-slate-400 to-slate-600", u: false },
  ];
  return (
    <div className="relative h-full w-full [perspective:1200px]">
      <div className="absolute inset-4 rounded-2xl border border-white/10 bg-[#0a0a12] p-3 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(-6deg)_translateZ(15px)]">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="text-[11px] font-semibold text-white">Inbox <span className="ml-1 rounded-full bg-fuchsia-500/20 px-1.5 py-0.5 text-[8px] text-fuchsia-300">2</span></div>
          <span className="text-[9px] text-white/40">All caught up ✨</span>
        </div>
        <div className="mt-2 space-y-1">
          {msgs.map((m, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-lg p-1.5 transition-all duration-500 hover:bg-white/[0.05] group-hover:translate-x-1"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <span className={`grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br ${m.c} text-[9px] font-bold text-white`}>{m.n[0]}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <span className={`truncate text-[10px] ${m.u ? "font-semibold text-white" : "text-white/60"}`}>{m.n}</span>
                  {m.u && <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />}
                </div>
                <div className="truncate text-[9px] text-white/40">{m.s}</div>
              </div>
              <span className="text-[8px] text-white/40">{m.t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- 12 · Video Call ---------- */
function VideoCallKit() {
  return (
    <div className="relative h-full w-full [perspective:1400px]">
      <div className="absolute inset-4 rounded-2xl border border-white/10 bg-[#050510] p-3 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateX(6deg)_translateZ(20px)]">
        <div className="grid h-[calc(100%-32px)] grid-cols-2 gap-1.5">
          {[
            "from-violet-600 to-fuchsia-600",
            "from-cyan-500 to-blue-600",
            "from-emerald-500 to-teal-600",
            "from-orange-500 to-rose-600",
          ].map((c, i) => (
            <div
              key={i}
              className={`relative overflow-hidden rounded-lg bg-gradient-to-br ${c} shadow-inner transition-all duration-500 group-hover:scale-[1.02]`}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <span aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.35),transparent_50%)]" />
              <span className="absolute bottom-1 left-1.5 text-[8px] font-semibold text-white/90">{["You","Marcus","Ava","Elena"][i]}</span>
              {i === 0 && <span className="absolute right-1 top-1 grid h-3 w-3 place-items-center rounded-full bg-rose-500 text-[7px] font-bold text-white">●</span>}
            </div>
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1.5">
          {["🎤","📹","🖥","👋"].map((e, i) => (
            <span key={i} className="grid h-6 w-6 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-[10px] backdrop-blur transition-transform hover:scale-110">{e}</span>
          ))}
          <span className="grid h-6 w-6 place-items-center rounded-full bg-rose-500 text-[10px] text-white shadow-[0_4px_12px_rgba(244,63,94,0.5)]">✕</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- 13 · Onboarding ---------- */
function OnboardingKit() {
  return (
    <div className="relative h-full w-full [perspective:1400px]">
      <div className="absolute inset-6 rounded-2xl border border-white/10 bg-gradient-to-br from-[#0f0620] to-[#050510] p-5 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(-6deg)_translateZ(20px)]">
        <div className="flex items-center gap-1.5">
          {[0,1,2,3].map((i) => (
            <span key={i} className={`h-1 flex-1 rounded-full ${i <= 1 ? "bg-gradient-to-r from-fuchsia-500 to-violet-500" : "bg-white/10"}`} />
          ))}
        </div>
        <div className="mt-3 text-[9px] font-mono uppercase tracking-widest text-white/40">Step 2 of 4</div>
        <h3 className="mt-2 font-display text-[15px] font-bold leading-tight text-white">Pick your workspace vibe</h3>
        <p className="mt-1 text-[10px] text-white/60">Choose the aesthetic that fits your team best.</p>
        <div className="mt-3 grid grid-cols-3 gap-1.5">
          {[
            { n: "Aurora", c: "from-fuchsia-500 to-cyan-400", sel: true },
            { n: "Sunset", c: "from-orange-400 to-rose-500", sel: false },
            { n: "Forest", c: "from-emerald-500 to-teal-600", sel: false },
          ].map((v, i) => (
            <div
              key={v.n}
              className={`overflow-hidden rounded-lg border-2 transition-all duration-500 ${v.sel ? "border-white shadow-[0_8px_20px_-6px_rgba(255,255,255,0.3)] scale-105" : "border-transparent"} group-hover:[transform:translateY(-2px)]`}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className={`h-10 bg-gradient-to-br ${v.c}`} />
              <div className="bg-white/[0.04] py-1 text-center text-[9px] font-semibold text-white">{v.n}</div>
            </div>
          ))}
        </div>
        <div className="absolute inset-x-5 bottom-4 flex justify-between">
          <span className="text-[10px] text-white/50">Back</span>
          <span className="rounded-full bg-white px-3 py-1 text-[10px] font-semibold text-black shadow-[0_4px_12px_rgba(255,255,255,0.2)]">Continue →</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- 14 · File Manager ---------- */
function FilesKit() {
  const files = [
    { n: "Brand kit.fig", s: "12.4 MB", c: "bg-fuchsia-500/30 text-fuchsia-300", e: "F" },
    { n: "Q4 report.pdf", s: "3.1 MB", c: "bg-rose-500/30 text-rose-300", e: "P" },
    { n: "hero-video.mp4", s: "48.2 MB", c: "bg-violet-500/30 text-violet-300", e: "V" },
    { n: "tokens.json", s: "8 KB", c: "bg-cyan-500/30 text-cyan-300", e: "{ }" },
  ];
  return (
    <div className="relative h-full w-full [perspective:1200px]">
      <div className="absolute inset-4 rounded-2xl border border-white/10 bg-[#0a0a12] p-3 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(6deg)_translateZ(15px)]">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-1 text-[10px] text-white/60"><span>Home</span><span>/</span><span className="text-white">Projects</span></div>
          <span className="text-[9px] text-white/40">4 items</span>
        </div>
        <div className="mt-2 space-y-1">
          {files.map((f, i) => (
            <div
              key={f.n}
              className="flex items-center gap-2 rounded-lg border border-transparent p-1.5 transition-all duration-500 hover:border-white/10 hover:bg-white/[0.04] group-hover:translate-x-1"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <span className={`grid h-8 w-8 place-items-center rounded-lg text-[9px] font-bold ${f.c}`}>{f.e}</span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[10px] font-semibold text-white">{f.n}</div>
                <div className="text-[8px] text-white/40">{f.s} · edited 2h ago</div>
              </div>
              <span className="text-[10px] text-white/40">⋯</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- 15 · Profile ---------- */
function ProfileKit() {
  return (
    <div className="relative h-full w-full [perspective:1400px]">
      <div className="absolute inset-4 overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a12] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateX(6deg)_rotateY(-6deg)_translateZ(20px)]">
        {/* cover */}
        <div className="relative h-16 bg-gradient-to-br from-fuchsia-500 via-violet-500 to-cyan-400">
          <span aria-hidden className="absolute inset-0 opacity-0 mix-blend-overlay transition-opacity duration-700 group-hover:opacity-100" style={{ background: "conic-gradient(from 45deg,transparent,#fff,transparent)" }} />
        </div>
        <div className="relative px-4">
          <div className="-mt-6 flex items-end justify-between">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 ring-4 ring-[#0a0a12] shadow-lg" />
            <span className="rounded-full border border-white/15 bg-white/[0.06] px-2 py-0.5 text-[9px] font-semibold text-white backdrop-blur">Follow</span>
          </div>
          <div className="mt-1.5">
            <div className="text-[12px] font-bold text-white">Elena Cruz</div>
            <div className="text-[9px] text-white/50">Product Designer · Novix UI</div>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 rounded-lg border border-white/10 bg-white/[0.02] p-2">
            {[["1.2k","Followers"],["842","Following"],["48","Projects"]].map(([v,l]) => (
              <div key={l} className="text-center">
                <div className="text-[11px] font-bold text-white">{v}</div>
                <div className="text-[8px] uppercase tracking-wider text-white/40">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const codeFor = (name: string) => `// ${name} — Novix UI premium kit\n// Full source in src/data/kits.tsx\nexport function ${name.replace(/\s+/g, "")}Kit() {\n  return (/* see live preview */);\n}\n`;

export const KITS: KitItem[] = [
  { id: "saas-dashboard", name: "SaaS Dashboard", tagline: "Sidebar · stats · chart", render: () => <SaasDashboard />, code: codeFor("SaaS Dashboard") },
  { id: "ai-chat", name: "AI Chat", tagline: "Streaming assistant UI", render: () => <AiChat />, code: codeFor("AI Chat") },
  { id: "ecommerce", name: "E-commerce", tagline: "Product grid with shine", render: () => <EcomKit />, code: codeFor("E-commerce") },
  { id: "landing", name: "Landing Page", tagline: "Aurora hero with CTA", render: () => <LandingKit />, code: codeFor("Landing Page") },
  { id: "analytics", name: "Analytics", tagline: "Revenue + bar chart", render: () => <AnalyticsKit />, code: codeFor("Analytics") },
  { id: "music-player", name: "Music Player", tagline: "Waveform + album art", render: () => <MusicKit />, code: codeFor("Music Player") },
  { id: "crypto-wallet", name: "Crypto Wallet", tagline: "Portfolio + tokens", render: () => <CryptoKit />, code: codeFor("Crypto Wallet") },
  { id: "kanban", name: "Kanban Board", tagline: "Drag-ready task columns", render: () => <KanbanKit />, code: codeFor("Kanban Board") },
  { id: "calendar", name: "Calendar", tagline: "Month view with events", render: () => <CalendarKit />, code: codeFor("Calendar") },
  { id: "pricing", name: "Pricing Table", tagline: "3-tier with popular flag", render: () => <PricingKit />, code: codeFor("Pricing Table") },
  { id: "inbox", name: "Inbox", tagline: "Threaded messages", render: () => <InboxKit />, code: codeFor("Inbox") },
  { id: "video-call", name: "Video Call", tagline: "Grid + controls", render: () => <VideoCallKit />, code: codeFor("Video Call") },
  { id: "onboarding", name: "Onboarding", tagline: "Stepper + theme picker", render: () => <OnboardingKit />, code: codeFor("Onboarding") },
  { id: "files", name: "File Manager", tagline: "Browse + previews", render: () => <FilesKit />, code: codeFor("File Manager") },
  { id: "profile", name: "Profile Card", tagline: "Cover · avatar · stats", render: () => <ProfileKit />, code: codeFor("Profile Card") },
];
