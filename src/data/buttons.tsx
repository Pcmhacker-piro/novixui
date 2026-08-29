import type { ReactNode } from "react";

export type ButtonItem = {
  id: string;
  name: string;
  styleKey: string;
  hue: string;
  render: () => ReactNode;
  code: string;
};

/* ---------- Palette ----------
 * Every "hue" is really a multi-color blend so buttons never look like
 * single-color recolors. `from` → `via` → `to` mix three distinct hues,
 * `ink` is the readable text color, `spark` is an accent used for dots/rings.
 */
type Hue = { key: string; from: string; via: string; to: string; ink: string; spark: string };
const HUES: Hue[] = [
  // Violet → Fuchsia → Pink
  { key: "Nebula",  from: "#7c3aed", via: "#c026d3", to: "#ec4899", ink: "#fdf4ff", spark: "#f0abfc" },
  // Cyan → Teal → Lime
  { key: "Lagoon",  from: "#06b6d4", via: "#14b8a6", to: "#a3e635", ink: "#ecfeff", spark: "#67e8f9" },
  // Orange → Rose → Magenta
  { key: "Sunset",  from: "#f97316", via: "#f43f5e", to: "#d946ef", ink: "#fff7ed", spark: "#fda4af" },
  // Blue → Indigo → Violet
  { key: "Cosmic",  from: "#3b82f6", via: "#6366f1", to: "#a855f7", ink: "#eff6ff", spark: "#93c5fd" },
];
const HUE_INDEX: Record<string, number> = { Nebula: 0, Lagoon: 1, Sunset: 2, Cosmic: 3 };


type StyleDef = {
  key: string;
  name: string;
  render: (h: Hue) => ReactNode;
  code: (h: Hue) => string;
};

/* Each style is original, subtly 3D, premium animated on hover. */
const STYLES: StyleDef[] = [
  /* 1 — Solid Lift with hard shadow drop (per-hue geometry + label) */
  {
    key: "lift", name: "Solid Lift",
    render: (h) => {
      const i = HUE_INDEX[h.key] ?? 0;
      const labels = ["Get started", "Deploy", "Continue", "Launch app"];
      const radii  = ["rounded-lg", "rounded-xl", "rounded-2xl", "rounded-full"];
      const pads   = ["px-5 py-2.5", "px-6 py-3", "px-7 py-3", "px-6 py-3.5"];
      const drops  = [4, 6, 8, 5]; // hard-shadow depth per hue
      const lifts  = ["hover:-translate-y-0.5", "hover:-translate-y-1", "hover:-translate-y-1.5", "hover:-translate-y-1"];
      return (
        <button
          className={`relative inline-flex items-center justify-center ${radii[i]} ${pads[i]} text-sm font-semibold transition-all duration-200 ease-out ${lifts[i]} active:translate-y-0.5`}
          style={{ color: h.ink, background: `linear-gradient(180deg, ${h.from}, ${h.via}, ${h.to})`, boxShadow: `0 ${drops[i]}px 0 0 color-mix(in oklab, ${h.from} 55%, #000), 0 14px 28px -8px ${h.from}80` }}
        >{labels[i]}</button>
      );
    },
    code: (h) => `<button style={{ background: "linear-gradient(180deg, ${h.from}, ${h.via}, ${h.to})", boxShadow: "0 6px 0 0 color-mix(in oklab, ${h.from} 55%, #000), 0 14px 28px -8px ${h.from}80" }} className="rounded-xl px-6 py-3 text-sm font-semibold hover:-translate-y-1 active:translate-y-0.5 transition-all">Get started</button>`,
  },


  /* 2 — Neon Glow ring */
  {
    key: "neon", name: "Neon Glow",
    render: (h) => (
      <button
        className="relative inline-flex items-center justify-center rounded-lg border px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-300 hover:scale-[1.04]"
        style={{ color: h.to, borderColor: `${h.to}66`, background: "rgba(255,255,255,0.02)", boxShadow: `inset 0 0 12px ${h.to}33, 0 0 22px ${h.to}55, 0 0 44px ${h.from}33`, textShadow: `0 0 8px ${h.to}aa` }}
      >Neon</button>
    ),
    code: (h) => `<button style={{ color: "${h.to}", borderColor: "${h.to}66", boxShadow: "inset 0 0 12px ${h.to}33, 0 0 22px ${h.to}55" }} className="rounded-lg border px-6 py-3 text-sm font-semibold hover:scale-[1.04] transition-all">Neon</button>`,
  },

  /* 3 — Glass Morphism */
  {
    key: "glass", name: "Glass",
    render: (h) => (
      <button
        className="relative inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:bg-white/[0.1]"
        style={{ boxShadow: `inset 0 1px 0 rgba(255,255,255,0.25), 0 12px 24px -12px ${h.from}80` }}
      >
        <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full" style={{ background: h.to, boxShadow: `0 0 8px ${h.to}` }} />
        Glass
      </button>
    ),
    code: (h) => `<button className="rounded-xl border border-white/15 bg-white/[0.06] px-6 py-3 text-white backdrop-blur-md">Glass</button>`,
  },

  /* 4 — Sheen sweep */
  {
    key: "sheen", name: "Sheen",
    render: (h) => (
      <button
        className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl px-6 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5"
        style={{ background: `linear-gradient(135deg, ${h.from}, ${h.via}, ${h.to})` }}
      >
        <span aria-hidden className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        <span className="relative">Sheen</span>
      </button>
    ),
    code: (h) => `<button style={{ background: "linear-gradient(135deg, ${h.from}, ${h.via}, ${h.to})" }} className="group relative overflow-hidden rounded-xl px-6 py-3 text-white">Sheen</button>`,
  },

  /* 5 — Gradient border ring */
  {
    key: "border", name: "Gradient Border",
    render: (h) => (
      <button
        className="group relative inline-flex items-center justify-center rounded-xl p-[1.5px] text-sm font-semibold text-white transition-transform duration-300 hover:scale-[1.03]"
        style={{ background: `linear-gradient(135deg, ${h.from}, ${h.via}, ${h.to})` }}
      >
        <span className="rounded-[10px] bg-[#0b0b0b] px-6 py-3 transition-colors duration-300 group-hover:bg-[#111]" style={{ boxShadow: `0 0 18px -6px ${h.to}80` }}>Outline</span>
      </button>
    ),
    code: (h) => `<button style={{ background: "linear-gradient(135deg, ${h.from}, ${h.via}, ${h.to})" }} className="p-[1.5px] rounded-xl"><span className="rounded-[10px] bg-[#0b0b0b] px-6 py-3">Outline</span></button>`,
  },

  /* 6 — Soft Press (light) */
  {
    key: "press", name: "Soft Press",
    render: (h) => (
      <button
        className="relative inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-semibold transition-all duration-200 active:scale-[.97]"
        style={{ color: "#0b0b0b", background: `linear-gradient(180deg, #fff, #f2f2f2)`, boxShadow: `0 1px 0 #fff inset, 0 -6px 12px -8px ${h.from}55 inset, 0 12px 22px -12px ${h.from}80` }}
      >Press</button>
    ),
    code: (h) => `<button style={{ background: "linear-gradient(180deg, #fff, #f2f2f2)", boxShadow: "0 12px 22px -12px ${h.from}80" }} className="rounded-2xl px-6 py-3 active:scale-[.97]">Press</button>`,
  },

  /* 7 — Holographic iridescence */
  {
    key: "holo", name: "Holographic",
    render: (h) => (
      <button
        className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl px-6 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5"
        style={{
          background: `conic-gradient(from 210deg at 50% 50%, ${h.from}, #22d3ee, ${h.to}, #f472b6, ${h.from})`,
          backgroundSize: "300% 300%",
          boxShadow: `0 12px 30px -14px ${h.from}`,
          animation: "nova-btn-holo 6s ease-in-out infinite",
        }}
      >
        <span aria-hidden className="pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay" style={{ background: "radial-gradient(120% 60% at 50% 0%, rgba(255,255,255,0.55), transparent 60%)" }} />
        <span className="relative drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]">Holographic</span>
      </button>
    ),
    code: (h) => `<button style={{ background: "conic-gradient(from 210deg, ${h.from}, #22d3ee, ${h.to}, #f472b6, ${h.from})", backgroundSize: "300% 300%", animation: "holo 6s ease-in-out infinite" }} className="rounded-xl px-6 py-3 text-white">Holographic</button>`,
  },


  /* 8 — Skew slide reveal */
  {
    key: "slide", name: "Slide Reveal",
    render: (h) => (
      <button
        className="group relative inline-flex h-11 items-center justify-center overflow-hidden rounded-md border px-6 text-sm font-semibold uppercase tracking-wider transition-colors duration-300"
        style={{ color: h.to, borderColor: `${h.to}80` }}
      >
        <span aria-hidden className="absolute inset-0 -translate-x-full skew-x-[-20deg] transition-transform duration-500 group-hover:translate-x-0" style={{ background: `linear-gradient(135deg, ${h.from}, ${h.via}, ${h.to})` }} />
        <span className="relative transition-colors duration-300 group-hover:text-white">Enter</span>
      </button>
    ),
    code: (h) => `<button className="group h-11 rounded-md border px-6 uppercase overflow-hidden relative">Enter</button>`,
  },

  /* 9 — Bevel metallic */
  {
    key: "bevel", name: "Bevel Metal",
    render: (h) => (
      <button
        className="relative inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition-transform duration-200 hover:-translate-y-0.5"
        style={{ background: `linear-gradient(180deg, ${h.to} 0%, ${h.from} 55%, color-mix(in oklab, ${h.from} 60%, #000) 100%)`, boxShadow: `inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -2px 0 rgba(0,0,0,0.3), 0 8px 18px -8px ${h.from}`, textShadow: "0 1px 1px rgba(0,0,0,0.35)" }}
      >Play</button>
    ),
    code: (h) => `<button style={{ background: "linear-gradient(180deg, ${h.to}, ${h.via}, ${h.from})" }} className="rounded-lg px-6 py-3 uppercase text-white">Play</button>`,
  },

  /* 10 — Halo ring */
  {
    key: "halo", name: "Halo Ring",
    render: (h) => (
      <button
        className="group relative inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:scale-[1.04]"
        style={{ background: `radial-gradient(120% 100% at 50% 0%, ${h.to}, ${h.from})` }}
      >
        <span aria-hidden className="pointer-events-none absolute -inset-2 rounded-2xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" style={{ background: `radial-gradient(50% 50% at 50% 50%, ${h.to}80, transparent 70%)` }} />
        <span className="relative">Continue</span>
      </button>
    ),
    code: (h) => `<button style={{ background: "radial-gradient(120% 100% at 50% 0%, ${h.to}, ${h.from})" }} className="rounded-xl px-6 py-3 text-white">Continue</button>`,
  },

  /* 11 — 3D cube with rotate on hover */
  {
    key: "cube", name: "3D Cube",
    render: (h) => (
      <div style={{ perspective: "600px" }}>
        <button
          className="group relative inline-flex items-center justify-center rounded-xl px-7 py-3 text-sm font-semibold text-white transition-transform duration-500 [transform-style:preserve-3d] hover:[transform:rotateX(15deg)_rotateY(-10deg)]"
          style={{ background: `linear-gradient(145deg, ${h.from}, ${h.via}, ${h.to})`, boxShadow: `-6px 6px 0 color-mix(in oklab, ${h.from} 60%, #000), 0 18px 30px -14px ${h.from}` }}
        >Rotate</button>
      </div>
    ),
    code: (h) => `<div style={{ perspective: 600 }}><button style={{ background: "linear-gradient(145deg, ${h.from}, ${h.via}, ${h.to})", boxShadow: "-6px 6px 0 color-mix(in oklab, ${h.from} 60%, #000)" }} className="rounded-xl px-7 py-3 text-white [transform-style:preserve-3d] hover:[transform:rotateX(15deg)_rotateY(-10deg)] transition-transform">Rotate</button></div>`,
  },

  /* 12 — Isometric face (two visible sides) */
  {
    key: "iso", name: "Isometric",
    render: (h) => (
      <div className="relative" style={{ perspective: "800px" }}>
        <button
          className="group relative inline-flex items-center justify-center rounded-lg px-7 py-3 text-sm font-bold uppercase tracking-wider text-white transition-transform duration-500 [transform-style:preserve-3d] [transform:rotateX(20deg)_rotateY(-24deg)] hover:[transform:rotateX(20deg)_rotateY(-24deg)_translateZ(6px)]"
          style={{ background: `linear-gradient(180deg, ${h.from}, ${h.via}, ${h.to})`, boxShadow: `0 20px 30px -18px #000` }}
        >
          <span aria-hidden className="pointer-events-none absolute inset-y-0 left-full w-3 rounded-r-lg [transform-origin:left_center] [transform:rotateY(90deg)]" style={{ background: `color-mix(in oklab, ${h.from} 55%, #000)` }} />
          <span aria-hidden className="pointer-events-none absolute inset-x-0 top-full h-3 rounded-b-lg [transform-origin:top_center] [transform:rotateX(-90deg)]" style={{ background: `color-mix(in oklab, ${h.to} 35%, #000)` }} />
          Iso
        </button>
      </div>
    ),
    code: (h) => `<div style={{ perspective: 800 }}><button style={{ background: "linear-gradient(180deg, ${h.from}, ${h.via}, ${h.to})", transform: "rotateX(20deg) rotateY(-24deg)", transformStyle: "preserve-3d" }} className="rounded-lg px-7 py-3 uppercase text-white">Iso</button></div>`,
  },


  /* 13 — Layered stack (double lift) */
  {
    key: "stack", name: "Layered Stack",
    render: (h) => (
      <button
        className="group relative inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-1"
        style={{ background: `linear-gradient(180deg, ${h.from}, ${h.via}, ${h.to})` }}
      >
        <span aria-hidden className="pointer-events-none absolute inset-0 -z-10 translate-x-1 translate-y-1 rounded-xl opacity-70 transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2" style={{ background: `color-mix(in oklab, ${h.from} 60%, #000)` }} />
        <span aria-hidden className="pointer-events-none absolute inset-0 -z-20 translate-x-2 translate-y-2 rounded-xl opacity-40 transition-transform duration-300 group-hover:translate-x-3.5 group-hover:translate-y-3.5" style={{ background: `color-mix(in oklab, ${h.from} 30%, #000)` }} />
        Layers
      </button>
    ),
    code: (h) => `<button style={{ background: "linear-gradient(180deg, ${h.from}, ${h.via}, ${h.to})" }} className="group relative rounded-xl px-6 py-3 text-white hover:-translate-y-1"><span className="absolute inset-0 -z-10 translate-x-1 translate-y-1 rounded-xl" style={{ background: "color-mix(in oklab, ${h.from} 60%, #000)" }} />Layers</button>`,
  },

  /* 14 — Aurora animated background */
  {
    key: "aurora", name: "Aurora",
    render: (h) => (
      <button
        className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl px-6 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:scale-[1.03]"
        style={{ background: "#0a0a0a", boxShadow: `0 12px 30px -14px ${h.from}` }}
      >
        <span aria-hidden className="pointer-events-none absolute -inset-1 opacity-70 blur-md transition-opacity duration-500 group-hover:opacity-100" style={{ background: `conic-gradient(from 0deg, ${h.from}, ${h.to}, ${h.from})`, animation: "nova-btn-spin 6s linear infinite" }} />
        <span className="relative rounded-[10px] bg-[#0a0a0a] px-5 py-2">Aurora</span>
      </button>
    ),
    code: (h) => `<button className="relative overflow-hidden rounded-xl bg-[#0a0a0a] text-white"><span className="absolute -inset-1 blur-md" style={{ background: "conic-gradient(from 0deg, ${h.from}, ${h.to}, ${h.from})", animation: "spin 6s linear infinite" }} /><span className="relative bg-[#0a0a0a] px-5 py-2 rounded-[10px]">Aurora</span></button>`,
  },

  /* 15 — Liquid fill (bottom rises) */
  {
    key: "liquid", name: "Liquid Fill",
    render: (h) => (
      <button
        className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl border px-6 py-3 text-sm font-semibold text-white transition-colors duration-300"
        style={{ borderColor: `${h.to}80`, background: "rgba(255,255,255,0.02)" }}
      >
        <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-0 transition-[height] duration-500 ease-out group-hover:h-full" style={{ background: `linear-gradient(0deg, ${h.from}, ${h.via}, ${h.to})` }} />
        <span className="relative">Fill up</span>
      </button>
    ),
    code: (h) => `<button style={{ borderColor: "${h.to}80" }} className="group relative overflow-hidden rounded-xl border px-6 py-3 text-white"><span className="absolute inset-x-0 bottom-0 h-0 group-hover:h-full transition-[height] duration-500" style={{ background: "linear-gradient(0deg, ${h.from}, ${h.via}, ${h.to})" }} />Fill up</button>`,
  },

  /* 16 — Magnet dots */
  {
    key: "dots", name: "Magnet Dots",
    render: (h) => (
      <button
        className="group relative inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#111]/80 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-white/25"
        style={{ backgroundImage: `radial-gradient(${h.to}22 1px, transparent 1px)`, backgroundSize: "10px 10px" }}
      >
        <span className="inline-block h-2 w-2 rounded-full transition-transform duration-300 group-hover:scale-125" style={{ background: h.to, boxShadow: `0 0 14px ${h.to}` }} />
        Magnetize
      </button>
    ),
    code: (h) => `<button style={{ backgroundImage: "radial-gradient(${h.to}22 1px, transparent 1px)", backgroundSize: "10px 10px" }} className="rounded-xl border border-white/10 px-5 py-3 text-white">Magnetize</button>`,
  },

  /* 17 — Radar ping */
  {
    key: "radar", name: "Radar Ping",
    render: (h) => (
      <button
        className="group relative inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white"
        style={{ background: "#0a0a0a", boxShadow: `inset 0 0 0 1px ${h.to}55, 0 10px 24px -14px ${h.from}` }}
      >
        <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full" style={{ boxShadow: `0 0 0 0 ${h.to}66`, animation: "nova-btn-ping 2.2s cubic-bezier(0,0,0.2,1) infinite" }} />
        <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full" style={{ boxShadow: `0 0 0 0 ${h.to}55`, animation: "nova-btn-ping 2.2s 0.9s cubic-bezier(0,0,0.2,1) infinite" }} />
        <span className="relative flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full" style={{ background: h.to, boxShadow: `0 0 10px ${h.to}` }} />Broadcast</span>
      </button>
    ),
    code: (h) => `<button style={{ boxShadow: "inset 0 0 0 1px ${h.to}55" }} className="relative rounded-full bg-[#0a0a0a] px-6 py-3 text-white"><span className="absolute inset-0 rounded-full" style={{ boxShadow: "0 0 0 0 ${h.to}66", animation: "ping 2.2s infinite" }} />Broadcast</button>`,
  },


  /* 18 — Text-swap on hover (vertical flip) */
  {
    key: "flip", name: "Text Flip",
    render: (h) => (
      <button
        className="group relative inline-flex h-11 items-center overflow-hidden rounded-xl px-6 text-sm font-semibold text-white"
        style={{ background: `linear-gradient(180deg, ${h.from}, ${h.via}, ${h.to})`, boxShadow: `0 10px 24px -10px ${h.from}` }}
      >
        <span className="block transition-transform duration-500 group-hover:-translate-y-full">Download</span>
        <span className="absolute inset-0 grid place-items-center translate-y-full transition-transform duration-500 group-hover:translate-y-0">Go →</span>
      </button>
    ),
    code: (h) => `<button style={{ background: "linear-gradient(180deg, ${h.from}, ${h.via}, ${h.to})" }} className="group relative h-11 overflow-hidden rounded-xl px-6 text-white"><span className="group-hover:-translate-y-full transition-transform">Download</span><span className="absolute inset-0 grid place-items-center translate-y-full group-hover:translate-y-0 transition-transform">Go →</span></button>`,
  },

  /* 19 — Card flip (front/back) */
  {
    key: "flipcard", name: "Card Flip",
    render: (h) => (
      <div style={{ perspective: "800px" }}>
        <button
          className="group relative inline-flex h-11 items-center justify-center rounded-xl text-sm font-semibold text-white transition-transform duration-700 [transform-style:preserve-3d] hover:[transform:rotateX(180deg)]"
          style={{ minWidth: 140 }}
        >
          <span className="absolute inset-0 grid place-items-center rounded-xl px-6 [backface-visibility:hidden]" style={{ background: `linear-gradient(180deg, ${h.from}, ${h.via}, ${h.to})`, boxShadow: `0 10px 24px -12px ${h.from}` }}>Preview</span>
          <span className="absolute inset-0 grid place-items-center rounded-xl px-6 [backface-visibility:hidden] [transform:rotateX(180deg)]" style={{ background: `linear-gradient(180deg, #111, #050505)`, boxShadow: `inset 0 0 0 1px ${h.to}55` }}>▶ Play</span>
        </button>
      </div>
    ),
    code: (h) => `<div style={{ perspective: 800 }}><button style={{ transformStyle: "preserve-3d" }} className="relative h-11 rounded-xl text-white hover:[transform:rotateX(180deg)] transition-transform duration-700"><span className="absolute inset-0 [backface-visibility:hidden]" style={{ background: "linear-gradient(180deg, ${h.from}, ${h.via}, ${h.to})" }}>Preview</span><span className="absolute inset-0 [backface-visibility:hidden] [transform:rotateX(180deg)]">▶ Play</span></button></div>`,
  },


  /* 20 — Depth panel with inner light */
  {
    key: "depth", name: "Depth Panel",
    render: (h) => (
      <button
        className="relative inline-flex items-center justify-center rounded-2xl px-7 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5"
        style={{
          background: `linear-gradient(180deg, #1a1a1c, #0a0a0b)`,
          boxShadow: `inset 0 1px 0 ${h.to}55, inset 0 -1px 0 rgba(0,0,0,0.6), 0 14px 30px -14px ${h.from}`,
        }}
      >
        <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full" style={{ background: h.to, boxShadow: `0 0 10px ${h.to}` }} />
        Deploy
      </button>
    ),
    code: (h) => `<button style={{ background: "linear-gradient(180deg, #1a1a1c, #0a0a0b)", boxShadow: "inset 0 1px 0 ${h.to}55, 0 14px 30px -14px ${h.from}" }} className="rounded-2xl px-7 py-3 text-white">Deploy</button>`,
  },

  /* 21 — Corner brackets (technical) */
  {
    key: "brackets", name: "Corner Brackets",
    render: (h) => (
      <button
        className="group relative inline-flex items-center justify-center rounded-md border border-white/10 bg-black/40 px-7 py-3 text-sm font-mono font-semibold uppercase tracking-widest text-white transition-colors duration-300 hover:border-white/25"
        style={{ color: h.to }}
      >
        {["-top-1 -left-1 border-t border-l", "-top-1 -right-1 border-t border-r", "-bottom-1 -left-1 border-b border-l", "-bottom-1 -right-1 border-b border-r"].map((c, i) => (
          <span key={i} aria-hidden className={`pointer-events-none absolute h-3 w-3 transition-all duration-300 group-hover:h-4 group-hover:w-4 ${c}`} style={{ borderColor: h.to }} />
        ))}
        Execute
      </button>
    ),
    code: (h) => `<button className="group relative rounded-md border border-white/10 bg-black/40 px-7 py-3 font-mono uppercase tracking-widest" style={{ color: "${h.to}" }}><span className="absolute -top-1 -left-1 h-3 w-3 border-t border-l" style={{ borderColor: "${h.to}" }} />Execute</button>`,
  },

  /* 22 — Ripple hover */
  {
    key: "ripple", name: "Ripple",
    render: (h) => (
      <button
        className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl px-6 py-3 text-sm font-semibold text-white"
        style={{ background: `linear-gradient(180deg, ${h.from}, ${h.via}, ${h.to})`, boxShadow: `0 10px 22px -10px ${h.from}` }}
      >
        <span aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-0 w-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/25 transition-all duration-500 group-hover:h-56 group-hover:w-56" />
        <span className="relative">Tap</span>
      </button>
    ),
    code: (h) => `<button style={{ background: "linear-gradient(180deg, ${h.from}, ${h.via}, ${h.to})" }} className="group relative overflow-hidden rounded-xl px-6 py-3 text-white"><span className="absolute left-1/2 top-1/2 h-0 w-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/25 group-hover:h-56 group-hover:w-56 transition-all" />Tap</button>`,
  },

  /* 23 — Loading dots (idle premium) */
  {
    key: "dots3", name: "Live Dots",
    render: (h) => (
      <button
        className="relative inline-flex items-center gap-2.5 rounded-xl border border-white/10 bg-[#0f0f10] px-5 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:border-white/25"
        style={{ boxShadow: `0 10px 24px -14px ${h.from}` }}
      >
        <span className="inline-flex gap-1">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-1.5 w-1.5 rounded-full" style={{ background: h.to, boxShadow: `0 0 8px ${h.to}`, animation: `nova-btn-bounce 1.4s ${i * 0.15}s ease-in-out infinite` }} />
          ))}
        </span>
        Streaming
      </button>
    ),
    code: (h) => `<button className="inline-flex items-center gap-2.5 rounded-xl border border-white/10 bg-[#0f0f10] px-5 py-3 text-white">Streaming</button>`,
  },

  /* 24 — Punch-out ghost */
  {
    key: "ghost", name: "Punch Ghost",
    render: (h) => (
      <button
        className="group relative inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 hover:text-white"
        style={{ color: h.to, background: "transparent", border: `1.5px dashed ${h.to}66` }}
      >
        <span aria-hidden className="pointer-events-none absolute inset-0 scale-90 rounded-xl opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100" style={{ background: `linear-gradient(135deg, ${h.from}, ${h.via}, ${h.to})` }} />
        <span className="relative">Ghost</span>
      </button>
    ),
    code: (h) => `<button style={{ color: "${h.to}", border: "1.5px dashed ${h.to}66" }} className="group relative rounded-xl px-6 py-3 hover:text-white">Ghost</button>`,
  },

  /* 25 — Command-K style */
  {
    key: "cmd", name: "Command Key",
    render: (h) => (
      <button
        className="group relative inline-flex items-center gap-2.5 rounded-lg border border-white/10 bg-[#0f0f11] px-4 py-2.5 text-sm font-medium text-white/90 transition-all duration-300 hover:border-white/25 hover:bg-[#151517]"
        style={{ boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 22px -14px ${h.from}` }}
      >
        <span>Search</span>
        <span className="inline-flex items-center gap-0.5">
          <kbd className="rounded-md border border-white/10 bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-mono" style={{ color: h.to }}>⌘</kbd>
          <kbd className="rounded-md border border-white/10 bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-mono" style={{ color: h.to }}>K</kbd>
        </span>
      </button>
    ),
    code: (h) => `<button className="inline-flex items-center gap-2.5 rounded-lg border border-white/10 bg-[#0f0f11] px-4 py-2.5 text-white/90">Search <kbd style={{ color: "${h.to}" }} className="rounded-md border border-white/10 bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-mono">⌘K</kbd></button>`,
  },
];

/* Build 100 items — 25 unique styles × 4 hues */
export const BUTTONS: ButtonItem[] = STYLES.flatMap((s) =>
  HUES.map((h) => ({
    id: `${s.key}-${h.key.toLowerCase()}`,
    name: `${s.name} · ${h.key}`,
    styleKey: s.key,
    hue: h.key,
    render: () => s.render(h),
    code: s.code(h),
  })),
);
