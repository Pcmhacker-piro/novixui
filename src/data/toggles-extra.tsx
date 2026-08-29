import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { ToggleItem } from "@/data/toggles";

/* ---- Root: shared controlled toggle with hover-preview ---- */
function Root({ checked, onChange, className = "", children, style, ariaLabel = "Toggle" }: {
  checked: boolean; onChange: (v: boolean) => void; className?: string;
  children: ReactNode; style?: CSSProperties; ariaLabel?: string;
}) {
  const id = useId();
  const ref = useRef<HTMLLabelElement>(null);
  const orig = useRef(checked);
  const hovering = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const host = (el.closest("[data-tg-hover-host]") as HTMLElement | null) ?? el;
    const enter = () => { if (hovering.current) return; hovering.current = true; orig.current = checked; onChange(!checked); };
    const leave = () => { if (!hovering.current) return; hovering.current = false; if (checked !== orig.current) onChange(orig.current); };
    host.addEventListener("mouseenter", enter);
    host.addEventListener("mouseleave", leave);
    return () => { host.removeEventListener("mouseenter", enter); host.removeEventListener("mouseleave", leave); };
  }, [checked, onChange]);
  return (
    <label ref={ref} htmlFor={id} className={`relative inline-flex cursor-pointer select-none items-center gap-3 ${className}`} style={style} role="switch" aria-checked={checked}>
      <input id={id} type="checkbox" aria-label={ariaLabel} checked={checked}
        onChange={(e) => { orig.current = e.target.checked; onChange(e.target.checked); }}
        className="peer sr-only" />
      {children}
    </label>
  );
}

/* Global keyframes injected once */
const KEYS_ID = "nova-tg-x-keys";
function useKeys() {
  useEffect(() => {
    if (document.getElementById(KEYS_ID)) return;
    const s = document.createElement("style");
    s.id = KEYS_ID;
    s.textContent = `
@keyframes tgx-spin { to { transform: rotate(360deg); } }
@keyframes tgx-shimmer { 0% { background-position: -200% 0 } 100% { background-position: 200% 0 } }
@keyframes tgx-pulse { 0%,100% { opacity:.6; transform: scale(1) } 50% { opacity:1; transform: scale(1.06) } }
@keyframes tgx-orbit { to { transform: rotate(360deg) translateX(10px) rotate(-360deg) } }
@property --tgx-a { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
@keyframes tgx-conic { to { --tgx-a: 360deg } }
`;
    document.head.appendChild(s);
  }, []);
}

/* Palettes */
const P = [
  ["#7c3aed", "#ec4899"], ["#06b6d4", "#3b82f6"], ["#10b981", "#22d3ee"],
  ["#f97316", "#ef4444"], ["#eab308", "#f97316"], ["#8b5cf6", "#22d3ee"],
  ["#ec4899", "#f59e0b"], ["#22c55e", "#84cc16"], ["#0ea5e9", "#a855f7"],
  ["#f472b6", "#a78bfa"], ["#14b8a6", "#0ea5e9"], ["#e11d48", "#7c3aed"],
];
const grad = (i: number) => `linear-gradient(135deg, ${P[i % P.length][0]}, ${P[i % P.length][1]})`;
const c1 = (i: number) => P[i % P.length][0];
const c2 = (i: number) => P[i % P.length][1];

/* ============ FACTORIES ============ */

// A · Classic Pill (12)
const Pill = (i: number) => () => {
  const [on, set] = useState(true);
  return (
    <Root checked={on} onChange={set}>
      <span className="relative h-8 w-16 rounded-full transition-all duration-500" style={{
        background: on ? grad(i) : "linear-gradient(135deg,#1a1a1c,#0a0a0b)",
        boxShadow: on ? `inset 0 1px 0 rgba(255,255,255,.25), 0 8px 24px -12px ${c1(i)}aa` : "inset 0 1px 0 rgba(255,255,255,.06)",
      }}>
        <span className="absolute top-1 left-1 h-6 w-6 rounded-full bg-white transition-transform duration-500 ease-[cubic-bezier(.22,1.2,.36,1)]"
          style={{ transform: on ? "translateX(32px)" : "translateX(0)", boxShadow: "0 4px 10px rgba(0,0,0,.35)" }} />
      </span>
    </Root>
  );
};

// B · Track w/ label ON/OFF (10)
const LabelTrack = (i: number) => () => {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set}>
      <span className="relative flex h-8 w-20 items-center rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-500"
        style={{ background: on ? grad(i) : "#111", color: on ? "white" : "rgba(255,255,255,.55)", boxShadow: on ? `0 10px 24px -10px ${c1(i)}88` : "inset 0 0 0 1px rgba(255,255,255,.08)" }}>
        <span className="absolute inset-y-1 w-6 rounded-full bg-white shadow-md transition-all duration-500 ease-[cubic-bezier(.22,1.2,.36,1)]" style={{ left: on ? "calc(100% - 26px)" : "4px" }} />
        <span className="absolute left-2" style={{ opacity: on ? 1 : 0 }}>On</span>
        <span className="absolute right-2" style={{ opacity: on ? 0 : 1 }}>Off</span>
      </span>
    </Root>
  );
};

// C · Neon Ring (10)
const Neon = (i: number) => () => {
  const [on, set] = useState(true);
  return (
    <Root checked={on} onChange={set}>
      <span className="relative h-8 w-16 rounded-full transition-all duration-500" style={{
        background: on ? "rgba(0,0,0,.45)" : "#0d0d0f",
        boxShadow: on ? `inset 0 0 0 1.5px ${c1(i)}, 0 0 20px ${c1(i)}77` : "inset 0 0 0 1.5px rgba(255,255,255,.12)",
      }}>
        <span className="absolute top-1 left-1 h-6 w-6 rounded-full transition-all duration-500" style={{
          background: on ? grad(i) : "rgba(255,255,255,.15)",
          transform: on ? "translateX(32px)" : "translateX(0)",
          boxShadow: on ? `0 0 14px ${c1(i)}` : "none",
        }} />
      </span>
    </Root>
  );
};

// D · Segmented ON/OFF (8)
const Seg = (i: number) => () => {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set}>
      <span className="relative flex h-8 rounded-lg border border-white/10 bg-white/[0.03] p-1 text-[11px] font-semibold">
        <span className="absolute inset-1 w-[calc(50%-4px)] rounded-md transition-all duration-500 ease-[cubic-bezier(.22,1.2,.36,1)]" style={{
          background: grad(i), transform: on ? "translateX(100%)" : "translateX(0)", boxShadow: `0 6px 14px -6px ${c1(i)}88`,
        }} />
        <span className="relative z-10 grid w-14 place-items-center transition-colors" style={{ color: on ? "rgba(255,255,255,.55)" : "white" }}>Off</span>
        <span className="relative z-10 grid w-14 place-items-center transition-colors" style={{ color: on ? "white" : "rgba(255,255,255,.55)" }}>On</span>
      </span>
    </Root>
  );
};

// E · 3D Punch (8)
const Punch = (i: number) => () => {
  const [on, set] = useState(true);
  return (
    <Root checked={on} onChange={set}>
      <span className="relative h-8 w-16 rounded-full transition-all duration-500" style={{
        background: on ? grad(i) : "#111",
        boxShadow: on
          ? `inset 0 -3px 0 rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.3), 0 8px 20px -8px ${c1(i)}88`
          : "inset 0 -3px 0 rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.08)",
      }}>
        <span className="absolute top-1 left-1 h-6 w-6 rounded-full bg-gradient-to-b from-white to-[#d8d8dc] transition-all duration-500 ease-[cubic-bezier(.22,1.2,.36,1)]"
          style={{ transform: on ? "translateX(32px)" : "translateX(0)", boxShadow: "0 3px 6px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.6)" }} />
      </span>
    </Root>
  );
};

// F · Icon inside knob (Sun/Moon style; 8)
const IconKnob = (i: number) => () => {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set}>
      <span className="relative h-9 w-[68px] rounded-full transition-all duration-500" style={{
        background: on ? grad(i) : "linear-gradient(180deg,#0b1226,#050914)",
        boxShadow: on ? `0 8px 22px -10px ${c1(i)}88` : "inset 0 0 0 1px rgba(255,255,255,.08)",
      }}>
        <span className="absolute top-1 left-1 grid h-7 w-7 place-items-center rounded-full text-[13px] transition-all duration-500 ease-[cubic-bezier(.22,1.2,.36,1)]"
          style={{ background: on ? "#fff" : "#f5d47a", transform: on ? "translateX(32px)" : "translateX(0)", boxShadow: "0 3px 8px rgba(0,0,0,.4)" }}>
          {on ? "🌙" : "☀"}
        </span>
      </span>
    </Root>
  );
};

// G · Glass Pill (8)
const Glass = (i: number) => () => {
  const [on, set] = useState(true);
  return (
    <Root checked={on} onChange={set}>
      <span className="relative h-8 w-16 overflow-hidden rounded-full backdrop-blur-md transition-all duration-500" style={{
        background: on ? `${c1(i)}33` : "rgba(255,255,255,.05)",
        boxShadow: on ? `inset 0 0 0 1px ${c1(i)}88, 0 8px 20px -8px ${c1(i)}77` : "inset 0 0 0 1px rgba(255,255,255,.1)",
      }}>
        <span className="absolute top-1 left-1 h-6 w-6 rounded-full bg-white/90 backdrop-blur transition-transform duration-500 ease-[cubic-bezier(.22,1.2,.36,1)]"
          style={{ transform: on ? "translateX(32px)" : "translateX(0)" }} />
      </span>
    </Root>
  );
};

// H · Shimmer track (8)
const Shimmer = (i: number) => () => {
  useKeys();
  const [on, set] = useState(true);
  return (
    <Root checked={on} onChange={set}>
      <span className="relative h-8 w-16 rounded-full transition-colors duration-500" style={{
        background: on ? `linear-gradient(90deg, ${c1(i)}, ${c2(i)}, ${c1(i)})` : "#111",
        backgroundSize: on ? "200% 100%" : "auto",
        animation: on ? "tgx-shimmer 2.4s linear infinite" : "none",
        boxShadow: on ? `0 8px 20px -8px ${c1(i)}88` : "inset 0 0 0 1px rgba(255,255,255,.08)",
      }}>
        <span className="absolute top-1 left-1 h-6 w-6 rounded-full bg-white transition-transform duration-500 ease-[cubic-bezier(.22,1.2,.36,1)]"
          style={{ transform: on ? "translateX(32px)" : "translateX(0)" }} />
      </span>
    </Root>
  );
};

// I · Check mark knob (6)
const CheckKnob = (i: number) => () => {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set}>
      <span className="relative h-8 w-16 rounded-full transition-all duration-500" style={{
        background: on ? grad(i) : "#111", boxShadow: on ? `0 8px 22px -10px ${c1(i)}` : "inset 0 0 0 1px rgba(255,255,255,.08)",
      }}>
        <span className="absolute top-1 left-1 grid h-6 w-6 place-items-center rounded-full bg-white text-[11px] font-bold transition-all duration-500 ease-[cubic-bezier(.22,1.2,.36,1)]"
          style={{ transform: on ? "translateX(32px)" : "translateX(0)", color: on ? c1(i) : "transparent" }}>
          ✓
        </span>
      </span>
    </Root>
  );
};

// J · Notch square (6)
const Square = (i: number) => () => {
  const [on, set] = useState(true);
  return (
    <Root checked={on} onChange={set}>
      <span className="relative h-8 w-16 rounded-lg transition-all duration-500" style={{
        background: on ? grad(i) : "#0f0f11", boxShadow: on ? `0 8px 20px -8px ${c1(i)}` : "inset 0 0 0 1px rgba(255,255,255,.08)",
      }}>
        <span className="absolute top-1 left-1 h-6 w-6 rounded-md bg-white transition-transform duration-500 ease-[cubic-bezier(.22,1.2,.36,1)]"
          style={{ transform: on ? "translateX(32px)" : "translateX(0)" }} />
      </span>
    </Root>
  );
};

// K · Split label rail (6)
const Rail = (i: number) => () => {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set}>
      <span className="flex items-center gap-2">
        <span className={`text-[11px] font-medium transition-colors`} style={{ color: on ? "rgba(255,255,255,.5)" : "white" }}>Off</span>
        <span className="relative h-6 w-11 rounded-full transition-all duration-500" style={{
          background: on ? grad(i) : "#151517", boxShadow: on ? `0 6px 16px -6px ${c1(i)}` : "inset 0 0 0 1px rgba(255,255,255,.08)",
        }}>
          <span className="absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform duration-500" style={{ transform: on ? "translateX(20px)" : "translateX(0)" }} />
        </span>
        <span className={`text-[11px] font-medium transition-colors`} style={{ color: on ? "white" : "rgba(255,255,255,.5)" }}>On</span>
      </span>
    </Root>
  );
};

// L · Glow orbit knob (6)
const OrbitKnob = (i: number) => () => {
  useKeys();
  const [on, set] = useState(true);
  return (
    <Root checked={on} onChange={set}>
      <span className="relative h-9 w-[68px] rounded-full transition-all duration-500" style={{
        background: on ? "rgba(0,0,0,.5)" : "#0d0d0f",
        boxShadow: on ? `inset 0 0 0 1.5px ${c1(i)}, 0 0 20px ${c1(i)}66` : "inset 0 0 0 1.5px rgba(255,255,255,.08)",
      }}>
        <span className="absolute top-1 h-7 w-7 rounded-full transition-all duration-500" style={{
          background: on ? grad(i) : "rgba(255,255,255,.15)",
          left: on ? "calc(100% - 32px)" : "4px",
        }}>
          {on && <span className="absolute inset-0 rounded-full" style={{ animation: "tgx-pulse 1.6s ease-in-out infinite", boxShadow: `0 0 12px ${c1(i)}` }} />}
        </span>
      </span>
    </Root>
  );
};

// M · Track with dots (6)
const DotTrack = (i: number) => () => {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set}>
      <span className="relative flex h-8 w-16 items-center justify-around rounded-full transition-all duration-500" style={{
        background: on ? grad(i) : "#111",
      }}>
        {[0, 1, 2].map((k) => <span key={k} className="h-1 w-1 rounded-full bg-white/40" />)}
        <span className="absolute top-1 h-6 w-6 rounded-full bg-white transition-all duration-500" style={{ left: on ? "calc(100% - 28px)" : "4px" }} />
      </span>
    </Root>
  );
};

// N · Progress fill (6)
const ProgFill = (i: number) => () => {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set}>
      <span className="relative h-8 w-20 overflow-hidden rounded-full border border-white/10 bg-white/[0.03]">
        <span className="absolute inset-y-0 left-0 transition-all duration-700 ease-[cubic-bezier(.22,1.2,.36,1)]"
          style={{ width: on ? "100%" : "0%", background: grad(i), boxShadow: `0 0 18px ${c1(i)}55` }} />
        <span className="absolute top-1 h-6 w-6 rounded-full bg-white transition-all duration-700 ease-[cubic-bezier(.22,1.2,.36,1)]"
          style={{ left: on ? "calc(100% - 28px)" : "4px", boxShadow: "0 3px 6px rgba(0,0,0,.4)" }} />
      </span>
    </Root>
  );
};

// O · iOS-classic (4)
const IOS = (i: number) => () => {
  const [on, set] = useState(true);
  return (
    <Root checked={on} onChange={set}>
      <span className="relative h-8 w-[56px] rounded-full transition-colors duration-300" style={{
        background: on ? c1(i) : "#39393d",
      }}>
        <span className="absolute top-0.5 left-0.5 h-7 w-7 rounded-full bg-white transition-transform duration-300 ease-[cubic-bezier(.22,1.2,.36,1)]"
          style={{ transform: on ? "translateX(24px)" : "translateX(0)", boxShadow: "0 3px 8px rgba(0,0,0,.35)" }} />
      </span>
    </Root>
  );
};

// P · Conic border (4)
const ConicBorder = (i: number) => () => {
  useKeys();
  const [on, set] = useState(true);
  return (
    <Root checked={on} onChange={set}>
      <span className="relative rounded-full p-[2px] transition-all" style={{
        background: on ? `conic-gradient(from var(--tgx-a), ${c1(i)}, ${c2(i)}, ${c1(i)})` : "rgba(255,255,255,.08)",
        animation: on ? "tgx-conic 2s linear infinite" : "none",
      } as CSSProperties}>
        <span className="relative flex h-7 w-14 items-center rounded-full bg-[#0a0a0a]">
          <span className="h-5 w-5 rounded-full bg-white transition-transform duration-500" style={{ transform: on ? "translateX(32px)" : "translateX(4px)" }} />
        </span>
      </span>
    </Root>
  );
};

// Q · Tick Chip (4)
const TickChip = (i: number) => () => {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set}>
      <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-all duration-500" style={{
        background: on ? grad(i) : "rgba(255,255,255,.05)",
        color: on ? "white" : "rgba(255,255,255,.7)",
        boxShadow: on ? `0 8px 22px -10px ${c1(i)}88` : "inset 0 0 0 1px rgba(255,255,255,.08)",
      }}>
        <span className="grid h-4 w-4 place-items-center rounded-full bg-white/90 text-[10px] font-bold" style={{ color: c1(i), opacity: on ? 1 : 0.3 }}>{on ? "✓" : "○"}</span>
        {on ? "Enabled" : "Disabled"}
      </span>
    </Root>
  );
};

/* ============ Registry ============ */

const items: ToggleItem[] = [];
let id = 0;
const add = (name: string, Comp: React.ComponentType) => {
  const idx = ++id;
  items.push({
    id: `tg-ex-${idx}`,
    name: `${name} ${idx}`,
    render: () => <Comp />,
    code: `// ${name} — Novix UI premium toggle\n// Full source in src/data/toggles-extra.tsx`,
  });
};

const specs: [string, (i: number) => React.ComponentType, number][] = [
  ["Pill", Pill, 12],
  ["Label Track", LabelTrack, 10],
  ["Neon Ring", Neon, 10],
  ["Segmented", Seg, 8],
  ["3D Punch", Punch, 8],
  ["Icon Knob", IconKnob, 8],
  ["Glass Pill", Glass, 8],
  ["Shimmer Track", Shimmer, 8],
  ["Check Knob", CheckKnob, 6],
  ["Square", Square, 6],
  ["Rail", Rail, 6],
  ["Orbit Knob", OrbitKnob, 6],
  ["Dot Track", DotTrack, 6],
  ["Progress Fill", ProgFill, 6],
  ["iOS", IOS, 4],
  ["Conic Border", ConicBorder, 4],
  ["Tick Chip", TickChip, 4],
];

let idx = 0;
for (const [label, make, n] of specs) {
  for (let k = 0; k < n; k++) {
    add(label, make(idx));
    idx++;
  }
}

export const TOGGLES_EXTRA: ToggleItem[] = items;
