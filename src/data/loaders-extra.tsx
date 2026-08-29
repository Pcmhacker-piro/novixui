import { useEffect, useRef, type ReactNode, type CSSProperties } from "react";
import type { LoaderItem } from "@/data/loaders";

function Stage({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const host = (el.closest("[data-ld-hover-host]") as HTMLElement | null) ?? el;
    const on = () => el.setAttribute("data-active", "true");
    const off = () => el.setAttribute("data-active", "false");
    host.addEventListener("mouseenter", on);
    host.addEventListener("mouseleave", off);
    return () => {
      host.removeEventListener("mouseenter", on);
      host.removeEventListener("mouseleave", off);
    };
  }, []);
  return (
    <div ref={ref} data-active="false" className="nova-ld-stage-x relative grid place-items-center" style={style}>
      {children}
    </div>
  );
}

/* Global keyframes for the extra loaders — injected once */
const KEYS_ID = "nova-ld-x-keys";
function useKeys() {
  useEffect(() => {
    if (document.getElementById(KEYS_ID)) return;
    const s = document.createElement("style");
    s.id = KEYS_ID;
    s.textContent = `
@keyframes ldx-spin { to { transform: rotate(360deg); } }
@keyframes ldx-spin-rev { to { transform: rotate(-360deg); } }
@keyframes ldx-pulse { 0%,100% { transform: scale(1); opacity:.65 } 50% { transform: scale(1.35); opacity:1 } }
@keyframes ldx-bounce { 0%,80%,100% { transform: translateY(0) scale(.85); opacity:.5 } 40% { transform: translateY(-10px) scale(1); opacity:1 } }
@keyframes ldx-bar { 0% { transform: translateX(-100%) } 100% { transform: translateX(400%) } }
@keyframes ldx-shimmer { 0% { background-position: -200% 0 } 100% { background-position: 200% 0 } }
@keyframes ldx-orbit { to { transform: rotate(360deg) translateX(22px) rotate(-360deg) } }
@keyframes ldx-orbit-sm { to { transform: rotate(360deg) translateX(14px) rotate(-360deg) } }
@keyframes ldx-wave { 0%,100% { transform: scaleY(.35) } 50% { transform: scaleY(1) } }
@keyframes ldx-flip { 0% { transform: perspective(120px) rotateX(0) rotateY(0) } 50% { transform: perspective(120px) rotateX(180deg) rotateY(0) } 100% { transform: perspective(120px) rotateX(180deg) rotateY(180deg) } }
@keyframes ldx-morph { 0%,100% { border-radius: 40% 60% 55% 45% / 50% 40% 60% 50% } 50% { border-radius: 60% 40% 45% 55% / 40% 60% 45% 55% } }
@keyframes ldx-conic { to { --a: 360deg } }
@keyframes ldx-tick { 0%,100% { transform: translateX(-8px) } 50% { transform: translateX(8px) } }
@keyframes ldx-fade { 0%,100% { opacity: .2 } 50% { opacity: 1 } }
@keyframes ldx-drop { 0% { transform: translateY(-18px); opacity: 0 } 30% { opacity:1 } 60% { transform: translateY(14px); opacity: 1 } 100% { transform: translateY(14px); opacity: 0 } }
@keyframes ldx-ripple { 0% { transform: scale(0); opacity: .8 } 100% { transform: scale(2.4); opacity: 0 } }
@keyframes ldx-typing { 0%,60%,100% { transform: translateY(0); opacity:.4 } 30% { transform: translateY(-6px); opacity: 1 } }
@keyframes ldx-flow { 0% { stroke-dashoffset: 260 } 100% { stroke-dashoffset: 0 } }
@keyframes ldx-sweep { 0% { transform: translateX(-140%) skewX(-18deg) } 100% { transform: translateX(240%) skewX(-18deg) } }
@keyframes ldx-grid-fade { 0%,100% { opacity: .15 } 50% { opacity: 1 } }
@keyframes ldx-3d-cube { 0% { transform: rotateX(0) rotateY(0) } 50% { transform: rotateX(180deg) rotateY(0) } 100% { transform: rotateX(180deg) rotateY(180deg) } }
@property --a { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
`;
    document.head.appendChild(s);
  }, []);
}

/* Palettes */
const G = [
  ["#7c3aed", "#ec4899"], ["#06b6d4", "#3b82f6"], ["#10b981", "#22d3ee"],
  ["#f97316", "#ef4444"], ["#eab308", "#f97316"], ["#8b5cf6", "#22d3ee"],
  ["#ec4899", "#f59e0b"], ["#22c55e", "#84cc16"], ["#0ea5e9", "#a855f7"],
  ["#f472b6", "#a78bfa"], ["#14b8a6", "#0ea5e9"], ["#e11d48", "#7c3aed"],
];
const grad = (i: number) => `linear-gradient(135deg, ${G[i % G.length][0]}, ${G[i % G.length][1]})`;
const c1 = (i: number) => G[i % G.length][0];
const c2 = (i: number) => G[i % G.length][1];

/* ============ FACTORIES ============ */

// A · Ring spinner (10)
const Ring = (i: number) => () => { useKeys(); return (
  <Stage>
    <div className="relative h-12 w-12 rounded-full" style={{ border: `3px solid ${c1(i)}22`, borderTopColor: c1(i), animation: "ldx-spin 0.9s linear infinite", boxShadow: `0 0 22px -4px ${c1(i)}88` }} />
  </Stage>
); };

// B · Dual ring (10)
const DualRing = (i: number) => () => { useKeys(); return (
  <Stage>
    <div className="relative h-14 w-14">
      <div className="absolute inset-0 rounded-full" style={{ border: `2px solid ${c1(i)}22`, borderTopColor: c1(i), animation: "ldx-spin 1s linear infinite" }} />
      <div className="absolute inset-1.5 rounded-full" style={{ border: `2px solid ${c2(i)}22`, borderBottomColor: c2(i), animation: "ldx-spin-rev 1.4s linear infinite" }} />
    </div>
  </Stage>
); };

// C · Conic sweep (8)
const Conic = (i: number) => () => { useKeys(); return (
  <Stage>
    <div className="grid h-12 w-12 place-items-center rounded-full" style={{ background: `conic-gradient(from 0deg, transparent, ${c1(i)})`, animation: "ldx-spin 1s linear infinite" }}>
      <div className="h-9 w-9 rounded-full bg-[#0a0a0a]" />
    </div>
  </Stage>
); };

// D · Dots row (8)
const Dots = (i: number) => () => { useKeys(); return (
  <Stage>
    <div className="flex items-end gap-1.5">
      {[0, 1, 2].map((k) => (
        <span key={k} className="h-2.5 w-2.5 rounded-full" style={{ background: grad(i), animation: `ldx-bounce 1.1s ${k * 0.16}s ease-in-out infinite`, boxShadow: `0 0 12px -2px ${c1(i)}88` }} />
      ))}
    </div>
  </Stage>
); };

// E · Wave bars (8)
const Wave = (i: number) => () => { useKeys(); return (
  <Stage>
    <div className="flex h-10 items-center gap-1">
      {[0, 1, 2, 3, 4].map((k) => (
        <span key={k} className="w-1.5 rounded-full" style={{ height: 30, background: grad(i), transformOrigin: "center", animation: `ldx-wave 1s ${k * 0.12}s ease-in-out infinite`, boxShadow: `0 0 10px -2px ${c1(i)}77` }} />
      ))}
    </div>
  </Stage>
); };

// F · Progress bar (8)
const Bar = (i: number) => () => { useKeys(); return (
  <Stage>
    <div className="relative h-1.5 w-32 overflow-hidden rounded-full bg-white/[0.06]">
      <span className="absolute inset-y-0 w-1/4 rounded-full" style={{ background: grad(i), animation: "ldx-bar 1.4s ease-in-out infinite", boxShadow: `0 0 12px -2px ${c1(i)}` }} />
    </div>
  </Stage>
); };

// G · Shimmer skeleton (8)
const Shimmer = (i: number) => () => { useKeys(); return (
  <Stage>
    <div className="w-40 space-y-2">
      {[16, 10, 12].map((w, k) => (
        <div key={k} className="h-2 rounded-full" style={{
          width: `${w * 8}px`,
          background: `linear-gradient(90deg, rgba(255,255,255,0.05), ${c1(i)}66, rgba(255,255,255,0.05))`,
          backgroundSize: "200% 100%",
          animation: `ldx-shimmer 1.6s linear ${k * 0.15}s infinite`,
        }} />
      ))}
    </div>
  </Stage>
); };

// H · Orbit (6)
const Orbit = (i: number) => () => { useKeys(); return (
  <Stage>
    <div className="relative grid h-14 w-14 place-items-center">
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: c1(i), boxShadow: `0 0 12px ${c1(i)}` }} />
      {[0, 0.4, 0.8].map((d, k) => (
        <span key={k} className="absolute h-2 w-2 rounded-full" style={{ background: c2(i), animation: `ldx-orbit 1.2s ${d}s linear infinite`, boxShadow: `0 0 8px ${c2(i)}` }} />
      ))}
    </div>
  </Stage>
); };

// I · Pulse (6)
const Pulse = (i: number) => () => { useKeys(); return (
  <Stage>
    <div className="relative h-12 w-12">
      <span className="absolute inset-0 rounded-full" style={{ background: grad(i), animation: "ldx-pulse 1.4s ease-in-out infinite", boxShadow: `0 0 24px -4px ${c1(i)}` }} />
      <span className="absolute inset-2 rounded-full" style={{ background: "#0a0a0a" }} />
      <span className="absolute inset-3.5 rounded-full" style={{ background: grad(i) }} />
    </div>
  </Stage>
); };

// J · Ripple (6)
const Ripple = (i: number) => () => { useKeys(); return (
  <Stage>
    <div className="relative grid h-14 w-14 place-items-center">
      {[0, 0.6].map((d, k) => (
        <span key={k} className="absolute h-4 w-4 rounded-full" style={{ boxShadow: `0 0 0 2px ${c1(i)}`, animation: `ldx-ripple 1.6s ${d}s ease-out infinite` }} />
      ))}
      <span className="h-3 w-3 rounded-full" style={{ background: grad(i), boxShadow: `0 0 14px ${c1(i)}` }} />
    </div>
  </Stage>
); };

// K · Typing dots (6)
const Typing = (i: number) => () => { useKeys(); return (
  <Stage>
    <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2">
      {[0, 1, 2].map((k) => (
        <span key={k} className="h-1.5 w-1.5 rounded-full" style={{ background: c1(i), animation: `ldx-typing 1.1s ${k * 0.14}s ease-in-out infinite` }} />
      ))}
    </div>
  </Stage>
); };

// L · Flip square (6)
const Flip = (i: number) => () => { useKeys(); return (
  <Stage>
    <div className="h-9 w-9 rounded-md" style={{ background: grad(i), animation: "ldx-flip 1.6s ease-in-out infinite", boxShadow: `0 8px 22px -8px ${c1(i)}` }} />
  </Stage>
); };

// M · Blob morph (6)
const Blob = (i: number) => () => { useKeys(); return (
  <Stage>
    <div className="h-12 w-12" style={{ background: grad(i), animation: "ldx-morph 2.4s ease-in-out infinite, ldx-spin 6s linear infinite", boxShadow: `0 0 26px -6px ${c1(i)}` }} />
  </Stage>
); };

// N · Conic border card (6)
const ConicCard = (i: number) => () => { useKeys(); return (
  <Stage>
    <div className="relative h-16 w-24 rounded-xl p-[2px]" style={{ background: `conic-gradient(from var(--a), ${c1(i)}, ${c2(i)}, ${c1(i)})`, animation: "ldx-conic 2s linear infinite" } as CSSProperties}>
      <div className="grid h-full w-full place-items-center rounded-[10px] bg-[#0a0a0a] text-[10px] font-medium text-white/70">Loading…</div>
    </div>
  </Stage>
); };

// O · Drop dots (4)
const Drop = (i: number) => () => { useKeys(); return (
  <Stage>
    <div className="relative h-14 w-16">
      {[0, 0.25, 0.5].map((d, k) => (
        <span key={k} className="absolute left-0 h-2 w-2 rounded-full" style={{ background: c1(i), top: 0, left: `${k * 24}px`, animation: `ldx-drop 1.2s ${d}s ease-in infinite`, boxShadow: `0 0 10px ${c1(i)}` }} />
      ))}
    </div>
  </Stage>
); };

// P · Grid fade (4)
const Grid = (i: number) => () => { useKeys(); return (
  <Stage>
    <div className="grid grid-cols-3 gap-1">
      {Array.from({ length: 9 }).map((_, k) => (
        <span key={k} className="h-2.5 w-2.5 rounded-sm" style={{ background: grad(i), animation: `ldx-grid-fade 1.4s ${(k % 5) * 0.12}s ease-in-out infinite`, boxShadow: `0 0 8px -2px ${c1(i)}` }} />
      ))}
    </div>
  </Stage>
); };

// Q · Sweep pill (4)
const Sweep = (i: number) => () => { useKeys(); return (
  <Stage>
    <div className="relative h-8 w-36 overflow-hidden rounded-full border border-white/10 bg-white/[0.03]">
      <span className="absolute -inset-1 w-1/3 rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${c1(i)}88, transparent)`, animation: "ldx-sweep 1.4s ease-in-out infinite" }} />
    </div>
  </Stage>
); };

// R · 3D cube (4)
const Cube = (i: number) => () => { useKeys(); return (
  <Stage>
    <div className="h-8 w-8 rounded-md" style={{ background: grad(i), animation: "ldx-3d-cube 1.6s ease-in-out infinite", boxShadow: `0 6px 20px -4px ${c1(i)}88, inset 0 1px 0 rgba(255,255,255,0.3)` }} />
  </Stage>
); };

// S · Percent counter ring (2)
const Percent = (i: number) => () => { useKeys(); return (
  <Stage>
    <div className="relative grid h-14 w-14 place-items-center rounded-full" style={{ background: `conic-gradient(${c1(i)} 240deg, rgba(255,255,255,0.06) 0)`, animation: "ldx-spin 2.4s linear infinite" }}>
      <div className="grid h-10 w-10 place-items-center rounded-full bg-[#0a0a0a] text-[10px] font-semibold text-white">67%</div>
    </div>
  </Stage>
); };

/* ============ Registry ============ */

const items: LoaderItem[] = [];
let id = 0;
const add = (name: string, Comp: React.ComponentType) => {
  const idx = ++id;
  items.push({
    id: `ld-ex-${idx}`,
    name: `${name} ${idx}`,
    render: () => <Comp />,
    code: `// ${name} — Novix UI premium loader\n// Full source in src/data/loaders-extra.tsx`,
  });
};

const specs: [string, (i: number) => React.ComponentType, number][] = [
  ["Ring", Ring, 10],
  ["Dual Ring", DualRing, 10],
  ["Conic", Conic, 8],
  ["Bouncing Dots", Dots, 8],
  ["Wave Bars", Wave, 8],
  ["Progress Bar", Bar, 8],
  ["Shimmer", Shimmer, 8],
  ["Orbit", Orbit, 6],
  ["Pulse", Pulse, 6],
  ["Ripple", Ripple, 6],
  ["Typing", Typing, 6],
  ["Flip Square", Flip, 6],
  ["Blob Morph", Blob, 6],
  ["Conic Card", ConicCard, 6],
  ["Drop", Drop, 4],
  ["Grid Fade", Grid, 4],
  ["Sweep Pill", Sweep, 4],
  ["3D Cube", Cube, 4],
  ["Percent", Percent, 2],
];

let idx = 0;
for (const [label, make, n] of specs) {
  for (let k = 0; k < n; k++) {
    add(label, make(idx));
    idx++;
  }
}

export const LOADERS_EXTRA: LoaderItem[] = items;
