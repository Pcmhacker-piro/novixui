import { Fragment, useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";

export type RadioItem = {
  id: string;
  name: string;
  render: () => ReactNode;
  code: string;
};

/* Hover-preview: temporarily cycles the selected index while cursor is on the tile. */
function useHoverCycle(current: number, setCurrent: (i: number) => void, total: number) {
  const ref = useRef<HTMLDivElement>(null);
  const originalRef = useRef(current);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const host = (el.closest("[data-rd-hover-host]") as HTMLElement | null) ?? el;
    let timer: ReturnType<typeof setInterval> | null = null;
    let cycling = false;
    const enter = () => {
      if (cycling) return;
      cycling = true;
      originalRef.current = current;
      let i = (current + 1) % total;
      setCurrent(i);
      timer = setInterval(() => {
        i = (i + 1) % total;
        setCurrent(i);
      }, 900);
    };
    const leave = () => {
      cycling = false;
      if (timer) clearInterval(timer);
      setCurrent(originalRef.current);
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

/* Reusable Group wrapper */
function Group({
  current, setCurrent, total, children, className = "", style,
}: {
  current: number; setCurrent: (i: number) => void; total: number;
  children: ReactNode; className?: string; style?: CSSProperties;
}) {
  const ref = useHoverCycle(current, setCurrent, total);
  return (
    <div ref={ref} role="radiogroup" className={`nova-rd relative inline-flex ${className}`} style={style}>
      {children}
    </div>
  );
}

const OPTS = ["Free", "Pro", "Team"];

/* 1 — Classic Orbit */
function ClassicOrbit() {
  const [i, setI] = useState(0);
  return (
    <Group current={i} setCurrent={setI} total={3} className="flex-col gap-3">
      {OPTS.map((o, idx) => (
        <button key={o} role="radio" aria-checked={i === idx} onClick={() => setI(idx)} className="group flex items-center gap-3 text-left">
          <span className={`grid h-5 w-5 place-items-center rounded-full border-2 transition-all ${i === idx ? "border-cyan-400" : "border-white/25 group-hover:border-white/50"}`}>
            <span className={`h-2 w-2 rounded-full transition-all ${i === idx ? "scale-100 bg-cyan-400 shadow-[0_0_10px_#22d3ee]" : "scale-0 bg-transparent"}`} />
          </span>
          <span className={`text-[13px] ${i === idx ? "text-white" : "text-white/60"}`}>{o}</span>
        </button>
      ))}
    </Group>
  );
}

/* 2 — Gradient Pill */
function GradientPill() {
  const [i, setI] = useState(1);
  return (
    <Group current={i} setCurrent={setI} total={3} className="rounded-full border border-white/10 bg-white/[0.03] p-1">
      {OPTS.map((o, idx) => (
        <button key={o} role="radio" aria-checked={i === idx} onClick={() => setI(idx)} className={`relative rounded-full px-4 py-1.5 text-[12px] font-medium transition-colors ${i === idx ? "text-white" : "text-white/50 hover:text-white/80"}`}>
          {i === idx && <span className="absolute inset-0 -z-0 rounded-full" style={{ background: "linear-gradient(135deg,#7c3aed,#ec4899)", boxShadow: "0 6px 20px -8px rgba(236,72,153,.6)" }} />}
          <span className="relative">{o}</span>
        </button>
      ))}
    </Group>
  );
}

/* 3 — Card Radio */
function CardRadio() {
  const [i, setI] = useState(0);
  return (
    <Group current={i} setCurrent={setI} total={3} className="flex-col gap-2">
      {OPTS.map((o, idx) => (
        <button key={o} onClick={() => setI(idx)} className={`flex w-40 items-center justify-between rounded-xl border px-3 py-2 text-left transition-all ${i === idx ? "border-violet-400/60 bg-violet-500/10 shadow-[0_8px_24px_-14px_rgba(139,92,246,.6)]" : "border-white/8 bg-white/[0.02] hover:border-white/15"}`}>
          <span className="text-[13px] font-medium text-white">{o}</span>
          <span className={`h-3 w-3 rounded-full ${i === idx ? "bg-violet-400" : "bg-white/15"}`} />
        </button>
      ))}
    </Group>
  );
}

/* 4 — Neon Ring */
function NeonRing() {
  const [i, setI] = useState(2);
  return (
    <Group current={i} setCurrent={setI} total={3} className="gap-4">
      {OPTS.map((o, idx) => (
        <button key={o} onClick={() => setI(idx)} className="flex flex-col items-center gap-2">
          <span className={`relative grid h-8 w-8 place-items-center rounded-full border-2 transition-all ${i === idx ? "border-fuchsia-400 shadow-[0_0_18px_rgba(232,121,249,.7)]" : "border-white/20"}`}>
            <span className={`h-3 w-3 rounded-full transition-transform ${i === idx ? "scale-100 bg-fuchsia-400" : "scale-0"}`} />
          </span>
          <span className="text-[11px] text-white/70">{o}</span>
        </button>
      ))}
    </Group>
  );
}

/* 5 — Underline Tabs */
function UnderlineTabs() {
  const [i, setI] = useState(0);
  return (
    <Group current={i} setCurrent={setI} total={3} className="gap-6 border-b border-white/10 pb-1">
      {OPTS.map((o, idx) => (
        <button key={o} onClick={() => setI(idx)} className={`relative pb-2 text-[12.5px] font-medium transition-colors ${i === idx ? "text-white" : "text-white/50 hover:text-white/80"}`}>
          {o}
          {i === idx && <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full" style={{ background: "linear-gradient(90deg,#22d3ee,#a78bfa)" }} />}
        </button>
      ))}
    </Group>
  );
}

/* 6 — Segmented Control (Apple) */
function Segmented() {
  const [i, setI] = useState(1);
  return (
    <Group current={i} setCurrent={setI} total={3} className="rounded-lg bg-white/[0.06] p-0.5">
      {OPTS.map((o, idx) => (
        <button key={o} onClick={() => setI(idx)} className={`relative rounded-md px-4 py-1 text-[12px] transition-colors ${i === idx ? "text-black" : "text-white/60 hover:text-white/80"}`}>
          {i === idx && <span className="absolute inset-0 rounded-md bg-white shadow-[0_2px_8px_rgba(0,0,0,.2)]" />}
          <span className="relative font-medium">{o}</span>
        </button>
      ))}
    </Group>
  );
}

/* 7 — Icon Squares */
function IconSquares() {
  const [i, setI] = useState(0);
  return (
    <Group current={i} setCurrent={setI} total={3} className="gap-2">
      {OPTS.map((o, idx) => (
        <button key={o} onClick={() => setI(idx)} className={`grid h-16 w-16 place-items-center rounded-xl border transition-all ${i === idx ? "border-emerald-400 bg-emerald-400/10" : "border-white/10 bg-white/[0.02] hover:border-white/20"}`}>
          <span className={`h-6 w-6 rounded-md ${i === idx ? "bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,.7)]" : "bg-white/20"}`} />
        </button>
      ))}
    </Group>
  );
}

/* 8 — 3D Punch */
function Punch3D() {
  const [i, setI] = useState(1);
  return (
    <Group current={i} setCurrent={setI} total={3} className="flex-col gap-2">
      {OPTS.map((o, idx) => (
        <button key={o} onClick={() => setI(idx)} className="flex items-center gap-3">
          <span className={`relative grid h-6 w-6 place-items-center rounded-full transition-all duration-300 ${i === idx ? "translate-y-[1px]" : ""}`} style={{ background: i === idx ? "radial-gradient(circle at 30% 25%,#a78bfa,#4c1d95)" : "linear-gradient(180deg,#1a1a1c,#0a0a0b)", boxShadow: i === idx ? "inset 0 2px 3px rgba(255,255,255,.3), 0 4px 10px -4px rgba(139,92,246,.7)" : "inset 0 1px 0 rgba(255,255,255,.06), 0 2px 6px rgba(0,0,0,.5)" }}>
            {i === idx && <span className="h-2 w-2 rounded-full bg-white" />}
          </span>
          <span className="text-[12.5px] text-white/80">{o}</span>
        </button>
      ))}
    </Group>
  );
}

/* 9 — Rocker Switch */
function RockerSwitch() {
  const [i, setI] = useState(0);
  return (
    <Group current={i} setCurrent={setI} total={3} className="flex-col gap-2">
      {OPTS.map((o, idx) => (
        <button key={o} onClick={() => setI(idx)} className={`flex items-center gap-3 rounded-lg border px-3 py-1.5 transition-all ${i === idx ? "border-rose-400/60 bg-rose-500/10" : "border-white/8"}`}>
          <span className={`h-4 w-4 rotate-45 ${i === idx ? "bg-rose-400 shadow-[0_0_10px_#fb7185]" : "bg-white/15"}`} />
          <span className="text-[12.5px] text-white/80">{o}</span>
        </button>
      ))}
    </Group>
  );
}

/* 10 — Glass Chip */
function GlassChip() {
  const [i, setI] = useState(2);
  return (
    <Group current={i} setCurrent={setI} total={3} className="gap-2">
      {OPTS.map((o, idx) => (
        <button key={o} onClick={() => setI(idx)} className={`rounded-full px-3.5 py-1.5 text-[12px] backdrop-blur transition-all ${i === idx ? "bg-white/15 text-white ring-1 ring-white/40" : "bg-white/[0.04] text-white/60 hover:text-white"}`}>
          {o}
        </button>
      ))}
    </Group>
  );
}

/* 11 — Star Rating (5) */
function StarRating() {
  const [i, setI] = useState(3);
  return (
    <Group current={i} setCurrent={setI} total={5} className="gap-1">
      {[0, 1, 2, 3, 4].map((idx) => (
        <button key={idx} onClick={() => setI(idx)} className="text-2xl transition-transform hover:scale-110" style={{ color: idx <= i ? "#fbbf24" : "rgba(255,255,255,.15)", filter: idx <= i ? "drop-shadow(0 0 6px rgba(251,191,36,.5))" : "none" }}>
          ★
        </button>
      ))}
    </Group>
  );
}

/* 12 — Progress Steps */
function ProgressSteps() {
  const [i, setI] = useState(1);
  return (
    <Group current={i} setCurrent={setI} total={4} className="items-center gap-0">
      {[0, 1, 2, 3].map((idx) => (
        <Fragment key={idx}>
          <button onClick={() => setI(idx)} className={`grid h-7 w-7 place-items-center rounded-full text-[11px] font-bold transition-all ${idx <= i ? "bg-gradient-to-br from-cyan-400 to-violet-500 text-white shadow-[0_0_14px_rgba(139,92,246,.5)]" : "bg-white/10 text-white/40"}`}>
            {idx + 1}
          </button>
          {idx < 3 && <span className={`h-0.5 w-6 ${idx < i ? "bg-gradient-to-r from-cyan-400 to-violet-500" : "bg-white/10"}`} />}
        </Fragment>
      ))}
    </Group>
  );
}

/* 13 — Dot Ladder */
function DotLadder() {
  const [i, setI] = useState(0);
  return (
    <Group current={i} setCurrent={setI} total={3} className="flex-col gap-3">
      {OPTS.map((o, idx) => (
        <button key={o} onClick={() => setI(idx)} className="flex items-center gap-4">
          <span className="relative grid h-5 w-5 place-items-center">
            <span className="absolute h-5 w-5 rounded-full border border-white/15" />
            <span className={`h-3 w-3 rounded-full transition-all ${i === idx ? "scale-100 bg-gradient-to-br from-orange-400 to-rose-500 shadow-[0_0_12px_rgba(244,63,94,.6)]" : "scale-0"}`} />
          </span>
          <span className={`text-[12.5px] ${i === idx ? "font-medium text-white" : "text-white/50"}`}>{o}</span>
        </button>
      ))}
    </Group>
  );
}

/* 14 — Icon Row w Label */
function IconRow() {
  const [i, setI] = useState(1);
  return (
    <Group current={i} setCurrent={setI} total={3} className="gap-3">
      {OPTS.map((o, idx) => (
        <button key={o} onClick={() => setI(idx)} className={`flex flex-col items-center gap-1.5 rounded-xl border px-4 py-3 transition-all ${i === idx ? "border-cyan-400/60 bg-cyan-500/5" : "border-white/8 hover:border-white/15"}`}>
          <span className={`h-4 w-4 rounded ${i === idx ? "bg-cyan-400" : "bg-white/15"}`} />
          <span className="text-[11px] text-white/70">{o}</span>
        </button>
      ))}
    </Group>
  );
}

/* 15 — Pill Stack */
function PillStack() {
  const [i, setI] = useState(0);
  return (
    <Group current={i} setCurrent={setI} total={3} className="flex-col gap-2">
      {OPTS.map((o, idx) => (
        <button key={o} onClick={() => setI(idx)} className={`rounded-full border px-4 py-1.5 text-[12px] transition-all ${i === idx ? "border-amber-400/60 bg-amber-400/10 text-amber-300" : "border-white/10 text-white/60 hover:text-white"}`}>
          {o}
        </button>
      ))}
    </Group>
  );
}

/* 16 — Glow Halo */
function GlowHalo() {
  const [i, setI] = useState(1);
  return (
    <Group current={i} setCurrent={setI} total={3} className="gap-4">
      {OPTS.map((o, idx) => (
        <button key={o} onClick={() => setI(idx)} className="relative grid h-10 w-10 place-items-center">
          {i === idx && <span className="absolute inset-0 rounded-full blur-md" style={{ background: "radial-gradient(circle,#a78bfa,transparent 70%)" }} />}
          <span className={`relative h-5 w-5 rounded-full transition-all ${i === idx ? "bg-white shadow-[0_0_14px_#fff]" : "bg-white/20"}`} />
        </button>
      ))}
    </Group>
  );
}

/* 17 — Toggle Grid */
function ToggleGrid() {
  const [i, setI] = useState(2);
  return (
    <Group current={i} setCurrent={setI} total={4} className="grid grid-cols-2 gap-2">
      {["S", "M", "L", "XL"].map((o, idx) => (
        <button key={o} onClick={() => setI(idx)} className={`grid h-12 w-12 place-items-center rounded-lg border font-mono text-[13px] transition-all ${i === idx ? "border-emerald-400 bg-emerald-500/10 text-emerald-300 shadow-[0_0_14px_rgba(52,211,153,.4)]" : "border-white/10 text-white/50 hover:text-white"}`}>
          {o}
        </button>
      ))}
    </Group>
  );
}

/* 18 — Slider Radio (labels below track) */
function SliderRadio() {
  const [i, setI] = useState(1);
  return (
    <Group current={i} setCurrent={setI} total={3} className="flex-col items-stretch">
      <div className="relative h-1 w-40 rounded-full bg-white/10">
        <span className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all" style={{ width: `${(i / 2) * 100}%` }} />
        <span className="absolute -top-1.5 h-4 w-4 -translate-x-1/2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,.6)] transition-all" style={{ left: `${(i / 2) * 100}%` }} />
      </div>
      <div className="mt-3 flex justify-between text-[11px] text-white/60">
        {OPTS.map((o, idx) => (
          <button key={o} onClick={() => setI(idx)} className={i === idx ? "text-white" : ""}>{o}</button>
        ))}
      </div>
    </Group>
  );
}

/* 19 — Emoji Circles */
function EmojiCircles() {
  const [i, setI] = useState(0);
  const items = ["😍", "🚀", "🔥"];
  return (
    <Group current={i} setCurrent={setI} total={3} className="gap-3">
      {items.map((o, idx) => (
        <button key={idx} onClick={() => setI(idx)} className={`grid h-12 w-12 place-items-center rounded-full text-xl transition-all ${i === idx ? "scale-110 bg-white/10 ring-2 ring-white/40" : "bg-white/[0.03] hover:bg-white/[0.06]"}`}>
          {o}
        </button>
      ))}
    </Group>
  );
}

/* 20 — Neon Diamond */
function NeonDiamond() {
  const [i, setI] = useState(1);
  return (
    <Group current={i} setCurrent={setI} total={3} className="gap-4">
      {OPTS.map((o, idx) => (
        <button key={o} onClick={() => setI(idx)} className="flex flex-col items-center gap-2">
          <span className={`h-4 w-4 rotate-45 transition-all ${i === idx ? "bg-fuchsia-400 shadow-[0_0_14px_#e879f9]" : "border border-white/25"}`} />
          <span className="text-[10.5px] uppercase tracking-wider text-white/60">{o}</span>
        </button>
      ))}
    </Group>
  );
}

/* 21 — Vertical Bar */
function VerticalBar() {
  const [i, setI] = useState(0);
  return (
    <Group current={i} setCurrent={setI} total={3} className="items-stretch">
      <div className="relative w-1 rounded-full bg-white/10">
        <span className="absolute h-1/3 w-full rounded-full bg-gradient-to-b from-cyan-400 to-violet-500 transition-all" style={{ top: `${(i / 3) * 100}%` }} />
      </div>
      <div className="ml-4 flex flex-col gap-2 text-[12px]">
        {OPTS.map((o, idx) => (
          <button key={o} onClick={() => setI(idx)} className={i === idx ? "text-white" : "text-white/50"}>{o}</button>
        ))}
      </div>
    </Group>
  );
}

/* 22 — Squircle Grid Select */
function SquircleGrid() {
  const [i, setI] = useState(0);
  return (
    <Group current={i} setCurrent={setI} total={3} className="gap-2">
      {OPTS.map((o, idx) => (
        <button key={o} onClick={() => setI(idx)} className={`grid h-14 w-14 place-items-center rounded-2xl transition-all ${i === idx ? "bg-gradient-to-br from-orange-400 to-pink-500 text-white shadow-[0_10px_24px_-10px_rgba(244,63,94,.7)]" : "bg-white/[0.04] text-white/50"}`}>
            <span className="text-[11.5px] font-semibold">{o}</span>
        </button>
      ))}
    </Group>
  );
}

/* 23 — Radio Chips w/ Check */
function CheckChips() {
  const [i, setI] = useState(1);
  return (
    <Group current={i} setCurrent={setI} total={3} className="gap-2">
      {OPTS.map((o, idx) => (
        <button key={o} onClick={() => setI(idx)} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] transition-all ${i === idx ? "border-emerald-400 bg-emerald-500/10 text-emerald-200" : "border-white/10 text-white/50"}`}>
          {i === idx && <span>✓</span>}{o}
        </button>
      ))}
    </Group>
  );
}

/* 24 — Card w Description */
function CardDesc() {
  const [i, setI] = useState(0);
  const desc = ["1 project", "10 projects", "Unlimited"];
  return (
    <Group current={i} setCurrent={setI} total={3} className="flex-col gap-2">
      {OPTS.map((o, idx) => (
        <button key={o} onClick={() => setI(idx)} className={`flex w-48 items-start justify-between rounded-xl border p-3 text-left transition-all ${i === idx ? "border-cyan-400/60 bg-cyan-400/5" : "border-white/8"}`}>
          <div>
            <div className="text-[12.5px] font-medium text-white">{o}</div>
            <div className="text-[10.5px] text-white/50">{desc[idx]}</div>
          </div>
          <span className={`mt-1 grid h-4 w-4 place-items-center rounded-full border ${i === idx ? "border-cyan-400" : "border-white/20"}`}>
            {i === idx && <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />}
          </span>
        </button>
      ))}
    </Group>
  );
}

/* 25 — Toggle Bar 3D */
function ToggleBar3D() {
  const [i, setI] = useState(1);
  return (
    <Group current={i} setCurrent={setI} total={3} className="rounded-2xl p-1" style={{ background: "linear-gradient(180deg,#050505,#111)", boxShadow: "inset 0 2px 6px rgba(0,0,0,.6)" }}>
      {OPTS.map((o, idx) => (
        <button key={o} onClick={() => setI(idx)} className={`relative rounded-xl px-4 py-1.5 text-[12px] font-medium transition-all ${i === idx ? "text-white" : "text-white/50"}`}>
          {i === idx && <span className="absolute inset-0 rounded-xl" style={{ background: "linear-gradient(180deg,#3b3b3d,#1a1a1c)", boxShadow: "inset 0 1px 0 rgba(255,255,255,.15), 0 2px 6px rgba(0,0,0,.5)" }} />}
          <span className="relative">{o}</span>
        </button>
      ))}
    </Group>
  );
}

/* 26 — Concentric Rings */
function ConcentricRings() {
  const [i, setI] = useState(2);
  return (
    <Group current={i} setCurrent={setI} total={3} className="gap-4">
      {OPTS.map((o, idx) => (
        <button key={o} onClick={() => setI(idx)} className="grid h-10 w-10 place-items-center">
          <span className={`relative grid place-items-center rounded-full transition-all ${i === idx ? "h-8 w-8 ring-2 ring-fuchsia-400" : "h-6 w-6 ring-1 ring-white/20"}`}>
            <span className={`rounded-full transition-all ${i === idx ? "h-3 w-3 bg-fuchsia-400" : "h-2 w-2 bg-white/20"}`} />
          </span>
        </button>
      ))}
    </Group>
  );
}

/* 27 — Row Tick */
function RowTick() {
  const [i, setI] = useState(0);
  return (
    <Group current={i} setCurrent={setI} total={3} className="flex-col gap-1">
      {OPTS.map((o, idx) => (
        <button key={o} onClick={() => setI(idx)} className={`flex w-40 items-center justify-between rounded-lg px-3 py-2 transition-all ${i === idx ? "bg-white/[0.06] text-white" : "text-white/60 hover:bg-white/[0.03]"}`}>
          <span className="text-[12.5px]">{o}</span>
          {i === idx && <span className="text-emerald-400">✓</span>}
        </button>
      ))}
    </Group>
  );
}

/* 28 — Bulb Row */
function BulbRow() {
  const [i, setI] = useState(1);
  return (
    <Group current={i} setCurrent={setI} total={3} className="gap-3">
      {OPTS.map((o, idx) => (
        <button key={o} onClick={() => setI(idx)} className="flex flex-col items-center gap-1.5">
          <span className={`grid h-8 w-8 place-items-center rounded-full transition-all ${i === idx ? "bg-yellow-300/90 shadow-[0_0_24px_rgba(253,224,71,.7)]" : "bg-white/[0.04] ring-1 ring-white/10"}`}>
            <span className={`h-3 w-3 rounded-full ${i === idx ? "bg-white" : "bg-white/20"}`} />
          </span>
          <span className="text-[10.5px] text-white/60">{o}</span>
        </button>
      ))}
    </Group>
  );
}

/* 29 — Stacked Cards Pick */
function StackedPick() {
  const [i, setI] = useState(1);
  return (
    <Group current={i} setCurrent={setI} total={3} className="gap-2">
      {OPTS.map((o, idx) => (
        <button key={o} onClick={() => setI(idx)} className={`grid h-16 w-16 place-items-center rounded-xl transition-transform duration-500 ${i === idx ? "-translate-y-1" : ""}`} style={{ background: i === idx ? "linear-gradient(135deg,#22d3ee,#a78bfa)" : "linear-gradient(180deg,#1a1a1c,#0a0a0b)", boxShadow: i === idx ? "0 12px 24px -10px rgba(139,92,246,.7)" : "0 4px 12px -6px rgba(0,0,0,.6)" }}>
          <span className={`text-[11.5px] font-semibold ${i === idx ? "text-white" : "text-white/60"}`}>{o}</span>
        </button>
      ))}
    </Group>
  );
}

/* 30 — Split Ring */
function SplitRing() {
  const [i, setI] = useState(0);
  return (
    <Group current={i} setCurrent={setI} total={3} className="flex-col gap-2">
      {OPTS.map((o, idx) => (
        <button key={o} onClick={() => setI(idx)} className="flex items-center gap-3">
          <span className="relative grid h-6 w-6 place-items-center rounded-full" style={{ background: i === idx ? "conic-gradient(from 0deg,#22d3ee,#a78bfa,#ec4899,#22d3ee)" : "rgba(255,255,255,.08)" }}>
            <span className="grid h-4.5 w-4.5 place-items-center rounded-full bg-[#0a0a0b]">
              {i === idx && <span className="h-2 w-2 rounded-full bg-white" />}
            </span>
          </span>
          <span className="text-[12.5px] text-white/80">{o}</span>
        </button>
      ))}
    </Group>
  );
}

/* --- Registry --- */
type Entry = { id: string; name: string; C: () => ReactNode };
const ENTRIES: Entry[] = [
  { id: "rd-01", name: "Classic Orbit", C: ClassicOrbit },
  { id: "rd-02", name: "Gradient Pill", C: GradientPill },
  { id: "rd-03", name: "Card Radio", C: CardRadio },
  { id: "rd-04", name: "Neon Ring", C: NeonRing },
  { id: "rd-05", name: "Underline Tabs", C: UnderlineTabs },
  { id: "rd-06", name: "Segmented", C: Segmented },
  { id: "rd-07", name: "Icon Squares", C: IconSquares },
  { id: "rd-08", name: "3D Punch", C: Punch3D },
  { id: "rd-09", name: "Rocker Switch", C: RockerSwitch },
  { id: "rd-10", name: "Glass Chip", C: GlassChip },
  { id: "rd-11", name: "Star Rating", C: StarRating },
  { id: "rd-12", name: "Progress Steps", C: ProgressSteps },
  { id: "rd-13", name: "Dot Ladder", C: DotLadder },
  { id: "rd-14", name: "Icon Row", C: IconRow },
  { id: "rd-15", name: "Pill Stack", C: PillStack },
  { id: "rd-16", name: "Glow Halo", C: GlowHalo },
  { id: "rd-17", name: "Toggle Grid", C: ToggleGrid },
  { id: "rd-18", name: "Slider Radio", C: SliderRadio },
  { id: "rd-19", name: "Emoji Circles", C: EmojiCircles },
  { id: "rd-20", name: "Neon Diamond", C: NeonDiamond },
  { id: "rd-21", name: "Vertical Bar", C: VerticalBar },
  { id: "rd-22", name: "Squircle Grid", C: SquircleGrid },
  { id: "rd-23", name: "Check Chips", C: CheckChips },
  { id: "rd-24", name: "Card w/ Desc", C: CardDesc },
  { id: "rd-25", name: "Toggle Bar 3D", C: ToggleBar3D },
  { id: "rd-26", name: "Concentric Rings", C: ConcentricRings },
  { id: "rd-27", name: "Row Tick", C: RowTick },
  { id: "rd-28", name: "Bulb Row", C: BulbRow },
  { id: "rd-29", name: "Stacked Pick", C: StackedPick },
  { id: "rd-30", name: "Split Ring", C: SplitRing },
];

export const RADIOS: RadioItem[] = ENTRIES.map((e) => ({
  id: e.id,
  name: e.name,
  render: () => <e.C />,
  code: `// ${e.name} — Novix UI premium radio group\n// Full source available in /src/data/radios.tsx`,
}));
