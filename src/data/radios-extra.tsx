import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import type { RadioItem } from "@/data/radios";

/* Hover-preview cycler — reuses the data-rd-hover-host attribute */
function useHoverCycle(current: number, setCurrent: (i: number) => void, total: number) {
  const ref = useRef<HTMLDivElement>(null);
  const orig = useRef(current);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const host = (el.closest("[data-rd-hover-host]") as HTMLElement | null) ?? el;
    let timer: ReturnType<typeof setInterval> | null = null;
    let cycling = false;
    const enter = () => {
      if (cycling) return;
      cycling = true;
      orig.current = current;
      let i = (current + 1) % total;
      setCurrent(i);
      timer = setInterval(() => { i = (i + 1) % total; setCurrent(i); }, 900);
    };
    const leave = () => {
      cycling = false;
      if (timer) clearInterval(timer);
      setCurrent(orig.current);
    };
    host.addEventListener("mouseenter", enter);
    host.addEventListener("mouseleave", leave);
    return () => {
      if (timer) clearInterval(timer);
      host.removeEventListener("mouseenter", enter);
      host.removeEventListener("mouseleave", leave);
    };
  }, [current, setCurrent, total]);
  return ref;
}

function Group({ current, setCurrent, total, children, className = "", style }: {
  current: number; setCurrent: (i: number) => void; total: number;
  children: ReactNode; className?: string; style?: CSSProperties;
}) {
  const ref = useHoverCycle(current, setCurrent, total);
  return (
    <div ref={ref} role="radiogroup" className={`nova-rd-x relative inline-flex ${className}`} style={style}>
      {children}
    </div>
  );
}

/* --- Palettes --- */
const grads = [
  "linear-gradient(135deg,#7c3aed,#ec4899)",
  "linear-gradient(135deg,#06b6d4,#3b82f6)",
  "linear-gradient(135deg,#10b981,#22d3ee)",
  "linear-gradient(135deg,#f97316,#ef4444)",
  "linear-gradient(135deg,#eab308,#f97316)",
  "linear-gradient(135deg,#8b5cf6,#22d3ee)",
  "linear-gradient(135deg,#ec4899,#f59e0b)",
  "linear-gradient(135deg,#22c55e,#84cc16)",
  "linear-gradient(135deg,#0ea5e9,#a855f7)",
  "linear-gradient(135deg,#f472b6,#a78bfa)",
];
const solids = ["#22d3ee", "#a855f7", "#ec4899", "#10b981", "#f59e0b", "#3b82f6", "#f472b6", "#22c55e"];
const g = (i: number) => grads[i % grads.length];
const s = (i: number) => solids[i % solids.length];

const OPTS = ["Free", "Pro", "Team"];
const OPTS4 = ["S", "M", "L", "XL"];

/* ================================================================ */
/*  TEMPLATE FACTORIES                                              */
/* ================================================================ */

// A · Classic Dot (10)
const ClassicDot = (i: number) => () => {
  const [c, sC] = useState(0);
  return (
    <Group current={c} setCurrent={sC} total={3} className="flex-col gap-2.5">
      {OPTS.map((o, idx) => (
        <button key={o} role="radio" aria-checked={c === idx} onClick={() => sC(idx)} className="group flex items-center gap-3 text-left">
          <span className="grid h-5 w-5 place-items-center rounded-full border-2 transition-all" style={{ borderColor: c === idx ? s(i) : "rgba(255,255,255,0.25)" }}>
            <span className="h-2 w-2 rounded-full transition-all" style={{ background: c === idx ? s(i) : "transparent", transform: c === idx ? "scale(1)" : "scale(0)", boxShadow: c === idx ? `0 0 10px ${s(i)}` : "none" }} />
          </span>
          <span className={`text-[13px] ${c === idx ? "text-white" : "text-white/60"}`}>{o}</span>
        </button>
      ))}
    </Group>
  );
};

// B · Gradient Pill Segmented (10)
const PillSeg = (i: number) => () => {
  const [c, sC] = useState(1);
  return (
    <Group current={c} setCurrent={sC} total={3} className="rounded-full border border-white/10 bg-white/[0.03] p-1">
      {OPTS.map((o, idx) => (
        <button key={o} role="radio" aria-checked={c === idx} onClick={() => sC(idx)}
          className={`relative rounded-full px-4 py-1.5 text-[12px] font-medium transition-colors ${c === idx ? "text-white" : "text-white/50 hover:text-white/80"}`}>
          {c === idx && <span className="absolute inset-0 -z-0 rounded-full" style={{ background: g(i), boxShadow: `0 6px 20px -8px ${s(i)}99` }} />}
          <span className="relative">{o}</span>
        </button>
      ))}
    </Group>
  );
};

// C · Card Radio (10)
const CardR = (i: number) => () => {
  const [c, sC] = useState(0);
  return (
    <Group current={c} setCurrent={sC} total={3} className="flex-col gap-2">
      {OPTS.map((o, idx) => (
        <button key={o} role="radio" aria-checked={c === idx} onClick={() => sC(idx)}
          className="flex w-44 items-center justify-between rounded-xl border px-3 py-2 text-left transition-all"
          style={c === idx
            ? { borderColor: "transparent", background: g(i), color: "white", boxShadow: `0 12px 30px -12px ${s(i)}88` }
            : { borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.75)" }}>
          <span className="text-[12.5px] font-medium">{o}</span>
          <span className="grid h-4 w-4 place-items-center rounded-full ring-1 ring-white/40">
            <span className="h-1.5 w-1.5 rounded-full bg-white" style={{ opacity: c === idx ? 1 : 0 }} />
          </span>
        </button>
      ))}
    </Group>
  );
};

// D · Neon Ring (8)
const NeonRing = (i: number) => () => {
  const [c, sC] = useState(1);
  return (
    <Group current={c} setCurrent={sC} total={4} className="gap-3">
      {OPTS4.map((o, idx) => (
        <button key={o} role="radio" aria-checked={c === idx} onClick={() => sC(idx)}
          className="grid h-10 w-10 place-items-center rounded-full text-[11.5px] font-semibold transition-all"
          style={c === idx
            ? { color: "white", background: "rgba(0,0,0,.55)", boxShadow: `0 0 0 2px ${s(i)}, 0 0 18px ${s(i)}88` }
            : { color: "rgba(255,255,255,.55)", background: "rgba(255,255,255,.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.1)" }}>
          {o}
        </button>
      ))}
    </Group>
  );
};

// E · Icon Squares (8)
const IconSq = (i: number) => () => {
  const [c, sC] = useState(0);
  const icons = ["◆", "★", "●", "▲"];
  return (
    <Group current={c} setCurrent={sC} total={4} className="gap-2">
      {icons.map((ic, idx) => (
        <button key={idx} role="radio" aria-checked={c === idx} onClick={() => sC(idx)}
          className="grid h-11 w-11 place-items-center rounded-xl text-lg transition-all"
          style={c === idx
            ? { background: g(i), color: "white", boxShadow: `0 10px 24px -10px ${s(i)}77, inset 0 1px 0 rgba(255,255,255,.25)` }
            : { background: "rgba(255,255,255,.05)", color: "rgba(255,255,255,.55)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.08)" }}>
          {ic}
        </button>
      ))}
    </Group>
  );
};

// F · Underline Tabs (8)
const Underline = (i: number) => () => {
  const [c, sC] = useState(0);
  return (
    <Group current={c} setCurrent={sC} total={3} className="gap-1 border-b border-white/10 pb-1">
      {OPTS.map((o, idx) => (
        <button key={o} role="radio" aria-checked={c === idx} onClick={() => sC(idx)}
          className={`relative px-3 py-1.5 text-[12.5px] font-medium transition-colors ${c === idx ? "text-white" : "text-white/50 hover:text-white/80"}`}>
          {o}
          {c === idx && <span className="absolute -bottom-1 left-1 right-1 h-[2px] rounded-full" style={{ background: g(i), boxShadow: `0 0 12px ${s(i)}88` }} />}
        </button>
      ))}
    </Group>
  );
};

// G · Glass Chip (8)
const GlassChip = (i: number) => () => {
  const [c, sC] = useState(0);
  return (
    <Group current={c} setCurrent={sC} total={3} className="gap-2">
      {OPTS.map((o, idx) => (
        <button key={o} role="radio" aria-checked={c === idx} onClick={() => sC(idx)}
          className="rounded-full px-3.5 py-1.5 text-[12px] font-medium backdrop-blur-md transition-all"
          style={c === idx
            ? { background: `${s(i)}33`, color: "white", boxShadow: `inset 0 0 0 1px ${s(i)}88, 0 8px 22px -10px ${s(i)}66` }
            : { background: "rgba(255,255,255,.04)", color: "rgba(255,255,255,.6)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.08)" }}>
          {o}
        </button>
      ))}
    </Group>
  );
};

// H · 3D Punch (8)
const Punch3D = (i: number) => () => {
  const [c, sC] = useState(1);
  return (
    <Group current={c} setCurrent={sC} total={3} className="gap-3">
      {OPTS.map((o, idx) => (
        <button key={o} role="radio" aria-checked={c === idx} onClick={() => sC(idx)}
          className="rounded-xl px-4 py-2 text-[12px] font-semibold text-white transition-all"
          style={c === idx
            ? { background: g(i), transform: "translateY(2px)", boxShadow: `0 2px 0 rgba(0,0,0,.5), inset 0 -2px 0 rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.3)` }
            : { background: "rgba(255,255,255,.06)", color: "rgba(255,255,255,.7)", boxShadow: "0 6px 0 rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.15)" }}>
          {o}
        </button>
      ))}
    </Group>
  );
};

// I · Star rating (6)
const Stars = (i: number) => () => {
  const [c, sC] = useState(2);
  return (
    <Group current={c} setCurrent={sC} total={5} className="gap-1">
      {[0, 1, 2, 3, 4].map((idx) => (
        <button key={idx} role="radio" aria-checked={c === idx} onClick={() => sC(idx)}
          className="grid h-8 w-8 place-items-center text-lg transition-transform"
          style={{ color: idx <= c ? s(i) : "rgba(255,255,255,0.25)", filter: idx <= c ? `drop-shadow(0 0 8px ${s(i)}88)` : "none", transform: idx === c ? "scale(1.15)" : "scale(1)" }}>
          ★
        </button>
      ))}
    </Group>
  );
};

// J · Progress Steps (6)
const Steps = (i: number) => () => {
  const [c, sC] = useState(1);
  return (
    <Group current={c} setCurrent={sC} total={4} className="items-center gap-1">
      {[0, 1, 2, 3].map((idx) => (
        <div key={idx} className="flex items-center gap-1">
          <button role="radio" aria-checked={c === idx} onClick={() => sC(idx)}
            className="grid h-7 w-7 place-items-center rounded-full text-[11px] font-bold transition-all"
            style={idx <= c
              ? { background: g(i), color: "white", boxShadow: `0 6px 16px -6px ${s(i)}77` }
              : { background: "rgba(255,255,255,.06)", color: "rgba(255,255,255,.5)" }}>
            {idx + 1}
          </button>
          {idx < 3 && <div className="h-[2px] w-6 rounded-full" style={{ background: idx < c ? s(i) : "rgba(255,255,255,.1)" }} />}
        </div>
      ))}
    </Group>
  );
};

// K · Squircle Grid (6)
const Squircle = (i: number) => () => {
  const [c, sC] = useState(0);
  return (
    <Group current={c} setCurrent={sC} total={4} className="grid grid-cols-2 gap-2">
      {OPTS4.map((o, idx) => (
        <button key={o} role="radio" aria-checked={c === idx} onClick={() => sC(idx)}
          className="grid h-12 w-16 place-items-center rounded-2xl text-[13px] font-semibold transition-all"
          style={c === idx
            ? { background: g(i), color: "white", boxShadow: `0 10px 24px -10px ${s(i)}77, inset 0 1px 0 rgba(255,255,255,.25)` }
            : { background: "rgba(255,255,255,.04)", color: "rgba(255,255,255,.6)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.08)" }}>
          {o}
        </button>
      ))}
    </Group>
  );
};

// L · Halo Glow (6)
const HaloGlow = (i: number) => () => {
  const [c, sC] = useState(1);
  return (
    <Group current={c} setCurrent={sC} total={3} className="gap-4">
      {OPTS.map((o, idx) => (
        <button key={o} role="radio" aria-checked={c === idx} onClick={() => sC(idx)}
          className="relative grid h-12 w-12 place-items-center rounded-full text-[11px] font-semibold text-white/85 transition-all"
          style={c === idx ? { background: `radial-gradient(circle, ${s(i)}55, transparent 65%)`, color: "white" } : {}}>
          {c === idx && <span className="absolute inset-0 rounded-full" style={{ boxShadow: `0 0 0 2px ${s(i)}, 0 0 22px ${s(i)}88` }} />}
          {o}
        </button>
      ))}
    </Group>
  );
};

// M · Vertical Bar (6)
const VBar = (i: number) => () => {
  const [c, sC] = useState(0);
  return (
    <Group current={c} setCurrent={sC} total={3} className="flex-col rounded-xl border border-white/10 bg-white/[0.03] p-1">
      {OPTS.map((o, idx) => (
        <button key={o} role="radio" aria-checked={c === idx} onClick={() => sC(idx)}
          className={`relative rounded-lg px-4 py-1.5 text-left text-[12px] font-medium transition-colors ${c === idx ? "text-white" : "text-white/55"}`}>
          {c === idx && <span className="absolute inset-y-1 left-0 w-[3px] rounded-full" style={{ background: g(i), boxShadow: `0 0 10px ${s(i)}` }} />}
          <span className="ml-2">{o}</span>
        </button>
      ))}
    </Group>
  );
};

// N · Emoji Circles (6)
const EmojiC = (i: number) => () => {
  const [c, sC] = useState(2);
  const em = ["😞","😐","🙂","😍","🤩"];
  return (
    <Group current={c} setCurrent={sC} total={5} className="gap-1.5">
      {em.map((e, idx) => (
        <button key={idx} role="radio" aria-checked={c === idx} onClick={() => sC(idx)}
          className="grid h-9 w-9 place-items-center rounded-full text-base transition-all"
          style={c === idx ? { background: g(i), boxShadow: `0 8px 20px -8px ${s(i)}77`, transform: "scale(1.12)" } : { background: "rgba(255,255,255,.05)" }}>
          {e}
        </button>
      ))}
    </Group>
  );
};

// O · Toggle Grid 2x2 (4)
const Grid2 = (i: number) => () => {
  const [c, sC] = useState(0);
  return (
    <Group current={c} setCurrent={sC} total={4} className="grid grid-cols-2 gap-2">
      {["Auto", "Dark", "Light", "Sync"].map((o, idx) => (
        <button key={o} role="radio" aria-checked={c === idx} onClick={() => sC(idx)}
          className="rounded-xl px-4 py-2.5 text-[11.5px] font-medium transition-all"
          style={c === idx
            ? { background: g(i), color: "white", boxShadow: `0 10px 22px -10px ${s(i)}88` }
            : { background: "rgba(255,255,255,.05)", color: "rgba(255,255,255,.7)" }}>
          {o}
        </button>
      ))}
    </Group>
  );
};

// P · Slider dot (4)
const SliderR = (i: number) => () => {
  const [c, sC] = useState(1);
  return (
    <Group current={c} setCurrent={sC} total={3} className="items-center">
      <div className="relative h-8 w-44 rounded-full bg-white/[0.05] ring-1 ring-white/10">
        <span className="absolute top-1 h-6 w-14 rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1.2,0.36,1)]"
          style={{ left: `${c * 60 + 4}px`, background: g(i), boxShadow: `0 8px 18px -8px ${s(i)}88` }} />
        {OPTS.map((o, idx) => (
          <button key={o} role="radio" aria-checked={c === idx} onClick={() => sC(idx)}
            className={`relative z-10 grid h-8 w-14 place-items-center text-[11px] font-semibold transition-colors ${c === idx ? "text-white" : "text-white/55"}`}
            style={{ display: "inline-grid" }}>
            {o}
          </button>
        ))}
      </div>
    </Group>
  );
};

// Q · Concentric ring (4)
const Concentric = (i: number) => () => {
  const [c, sC] = useState(1);
  return (
    <Group current={c} setCurrent={sC} total={3} className="gap-4">
      {OPTS.map((o, idx) => (
        <button key={o} role="radio" aria-checked={c === idx} onClick={() => sC(idx)} className="flex flex-col items-center gap-1.5">
          <span className="relative grid h-7 w-7 place-items-center rounded-full transition-all" style={{ boxShadow: c === idx ? `0 0 0 2px ${s(i)}, inset 0 0 0 5px rgba(255,255,255,.9)` : "0 0 0 1px rgba(255,255,255,.2)" }} />
          <span className={`text-[11px] ${c === idx ? "text-white" : "text-white/55"}`}>{o}</span>
        </button>
      ))}
    </Group>
  );
};

// R · Row tick (4)
const RowTick = (i: number) => () => {
  const [c, sC] = useState(0);
  return (
    <Group current={c} setCurrent={sC} total={3} className="flex-col gap-1.5">
      {OPTS.map((o, idx) => (
        <button key={o} role="radio" aria-checked={c === idx} onClick={() => sC(idx)}
          className="flex w-40 items-center justify-between rounded-lg px-3 py-1.5 text-left text-[12px] transition-all"
          style={c === idx ? { background: `${s(i)}22`, color: "white", boxShadow: `inset 0 0 0 1px ${s(i)}66` } : { background: "rgba(255,255,255,.04)", color: "rgba(255,255,255,.7)" }}>
          <span>{o}</span>
          <span style={{ opacity: c === idx ? 1 : 0, color: s(i) }}>✓</span>
        </button>
      ))}
    </Group>
  );
};

/* ================================================================ */
/*  Registry                                                        */
/* ================================================================ */

const groups = [
  { label: "Dot", make: ClassicDot, n: 10 },
  { label: "Pill", make: PillSeg, n: 10 },
  { label: "Card", make: CardR, n: 10 },
  { label: "Neon Ring", make: NeonRing, n: 8 },
  { label: "Icon Squares", make: IconSq, n: 8 },
  { label: "Underline", make: Underline, n: 8 },
  { label: "Glass Chip", make: GlassChip, n: 8 },
  { label: "3D Punch", make: Punch3D, n: 8 },
  { label: "Stars", make: Stars, n: 6 },
  { label: "Steps", make: Steps, n: 6 },
  { label: "Squircle", make: Squircle, n: 6 },
  { label: "Halo", make: HaloGlow, n: 6 },
  { label: "Vertical", make: VBar, n: 6 },
  { label: "Emoji", make: EmojiC, n: 6 },
  { label: "Grid", make: Grid2, n: 4 },
  { label: "Slider", make: SliderR, n: 4 },
  { label: "Concentric", make: Concentric, n: 4 },
  { label: "Row Tick", make: RowTick, n: 4 },
];

const items: RadioItem[] = [];
let idx = 0;
for (const gr of groups) {
  for (let k = 0; k < gr.n; k++) {
    const Comp = gr.make(idx);
    const name = `${gr.label} ${k + 1}`;
    items.push({
      id: `rd-ex-${idx + 1}`,
      name,
      render: () => <Comp />,
      code: `// ${name} — Novix UI premium radio group\n// Full source in src/data/radios-extra.tsx`,
    });
    idx++;
  }
}

export const RADIOS_EXTRA: RadioItem[] = items;
