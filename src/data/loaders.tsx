import { useEffect, useRef, type ReactNode, type CSSProperties } from "react";

export type LoaderItem = {
  id: string;
  name: string;
  render: () => ReactNode;
  code: string;
};

/* Shared stage — hover on the tile pumps a `data-active` boost that individual loaders can react to. */
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
    <div ref={ref} data-active="false" className="nova-ld-stage relative grid place-items-center" style={style}>
      {children}
    </div>
  );
}

/* Tiny palette helper */
const G = {
  nebula: "linear-gradient(135deg,#7c3aed,#c026d3,#ec4899)",
  lagoon: "linear-gradient(135deg,#06b6d4,#14b8a6,#a3e635)",
  sunset: "linear-gradient(135deg,#f97316,#f43f5e,#d946ef)",
  cosmic: "linear-gradient(135deg,#3b82f6,#6366f1,#a855f7)",
  aurora: "linear-gradient(135deg,#22d3ee,#a78bfa,#f472b6)",
  ember:  "linear-gradient(135deg,#f59e0b,#ef4444,#b91c1c)",
  mint:   "linear-gradient(135deg,#10b981,#22d3ee,#0ea5e9)",
};

/* 1 — Orbit Ring */
function OrbitRing() {
  return (
    <Stage>
      <div className="relative h-16 w-16" style={{ animation: "nova-ld-spin 1.2s linear infinite" }}>
        <div className="absolute inset-0 rounded-full" style={{ background: `conic-gradient(from 0deg, transparent, #a78bfa, #ec4899, transparent)`, mask: "radial-gradient(circle, transparent 60%, #000 62%)" }} />
        <div className="absolute inset-2 rounded-full bg-[#0a0a0b]" />
      </div>
    </Stage>
  );
}

/* 2 — Dual Arcs */
function DualArcs() {
  return (
    <Stage>
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-2 border-transparent" style={{ borderTopColor: "#22d3ee", borderRightColor: "#22d3ee", animation: "nova-ld-spin 1s linear infinite" }} />
        <div className="absolute inset-2 rounded-full border-2 border-transparent" style={{ borderBottomColor: "#f472b6", borderLeftColor: "#f472b6", animation: "nova-ld-spin 0.7s linear infinite reverse" }} />
      </div>
    </Stage>
  );
}

/* 3 — Pulse Core */
function PulseCore() {
  return (
    <Stage>
      <div className="relative grid h-16 w-16 place-items-center">
        <span className="absolute inset-0 rounded-full" style={{ background: G.nebula, opacity: 0.3, animation: "nova-ld-pulse 1.4s ease-out infinite" }} />
        <span className="absolute inset-2 rounded-full" style={{ background: G.nebula, opacity: 0.5, animation: "nova-ld-pulse 1.4s ease-out infinite .2s" }} />
        <span className="relative h-6 w-6 rounded-full" style={{ background: G.nebula, boxShadow: "0 0 20px rgba(192,38,211,.7)" }} />
      </div>
    </Stage>
  );
}

/* 4 — Bouncing Dots */
function BouncingDots() {
  return (
    <Stage>
      <div className="flex items-end gap-2">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-3 w-3 rounded-full" style={{ background: G.aurora, animation: `nova-ld-bounce 0.9s ${i * 0.12}s ease-in-out infinite` }} />
        ))}
      </div>
    </Stage>
  );
}

/* 5 — Wave Bars */
function WaveBars() {
  return (
    <Stage>
      <div className="flex h-14 items-center gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className="w-1.5 rounded-full" style={{ background: G.mint, animation: `nova-ld-wave 1s ${i * 0.09}s ease-in-out infinite`, height: "40%" }} />
        ))}
      </div>
    </Stage>
  );
}

/* 6 — Cube Flip 3D */
function CubeFlip() {
  return (
    <Stage style={{ perspective: 400 }}>
      <div className="relative h-12 w-12" style={{ transformStyle: "preserve-3d", animation: "nova-ld-cube 2s ease-in-out infinite" }}>
        <div className="absolute inset-0 rounded-md" style={{ background: G.cosmic, boxShadow: "inset 0 0 12px rgba(255,255,255,.2)" }} />
      </div>
    </Stage>
  );
}

/* 7 — Ring Gradient Sweep */
function RingSweep() {
  return (
    <Stage>
      <div className="relative h-16 w-16 rounded-full" style={{ background: `conic-gradient(from 0deg, #06b6d4, #a78bfa, #ec4899, #06b6d4)`, animation: "nova-ld-spin 1.2s linear infinite", mask: "radial-gradient(circle, transparent 55%, #000 57%)" }} />
    </Stage>
  );
}

/* 8 — Sonar Ripples */
function SonarRipples() {
  return (
    <Stage>
      <div className="relative h-16 w-16 grid place-items-center">
        {[0, 1, 2].map((i) => (
          <span key={i} className="absolute inset-0 rounded-full border-2 border-cyan-400/60" style={{ animation: `nova-ld-sonar 2s ${i * 0.5}s ease-out infinite` }} />
        ))}
        <span className="relative h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(34,211,238,.9)]" />
      </div>
    </Stage>
  );
}

/* 9 — Orbit Planet */
function OrbitPlanet() {
  return (
    <Stage>
      <div className="relative h-16 w-16">
        <span className="absolute inset-0 rounded-full border border-white/15" />
        <div className="absolute inset-0" style={{ animation: "nova-ld-spin 1.4s linear infinite" }}>
          <span className="absolute left-1/2 top-0 -translate-x-1/2 h-3 w-3 rounded-full" style={{ background: G.sunset, boxShadow: "0 0 12px #f43f5e" }} />
        </div>
        <span className="absolute inset-[38%] rounded-full" style={{ background: G.ember }} />
      </div>
    </Stage>
  );
}

/* 10 — Progress Bar */
function ProgressBar() {
  return (
    <Stage>
      <div className="h-2 w-40 overflow-hidden rounded-full bg-white/10">
        <span className="block h-full w-1/3 rounded-full" style={{ background: G.aurora, animation: "nova-ld-slide 1.6s ease-in-out infinite" }} />
      </div>
    </Stage>
  );
}

/* 11 — Spiral Dots */
function SpiralDots() {
  return (
    <Stage>
      <div className="relative h-14 w-14" style={{ animation: "nova-ld-spin 1.1s linear infinite" }}>
        {[0, 60, 120, 180, 240, 300].map((a, i) => (
          <span key={a} className="absolute h-2 w-2 rounded-full" style={{ background: G.nebula, top: "50%", left: "50%", transform: `rotate(${a}deg) translate(20px) rotate(-${a}deg)`, opacity: 0.3 + i * 0.12 }} />
        ))}
      </div>
    </Stage>
  );
}

/* 12 — Yin Yang Spin */
function YinYang() {
  return (
    <Stage>
      <div className="h-14 w-14 rounded-full" style={{ background: `conic-gradient(from 0deg, #22d3ee 0deg 180deg, #f472b6 180deg 360deg)`, animation: "nova-ld-spin 1s linear infinite", filter: "drop-shadow(0 0 8px rgba(167,139,250,.4))" }} />
    </Stage>
  );
}

/* 13 — Heart Beat */
function HeartBeat() {
  return (
    <Stage>
      <div className="relative">
        <div className="h-8 w-8 rotate-45" style={{ background: G.sunset, boxShadow: "0 0 20px rgba(244,63,94,.6)", animation: "nova-ld-heart 1.1s ease-in-out infinite" }} />
        <div className="absolute -top-2 left-0 h-8 w-8 rounded-full" style={{ background: G.sunset, animation: "nova-ld-heart 1.1s ease-in-out infinite" }} />
        <div className="absolute -top-2 -right-0 h-8 w-8 rounded-full" style={{ background: G.sunset, animation: "nova-ld-heart 1.1s ease-in-out infinite" }} />
      </div>
    </Stage>
  );
}

/* 14 — DNA Helix */
function DnaHelix() {
  return (
    <Stage>
      <div className="relative h-16 w-20">
        {[...Array(6)].map((_, i) => (
          <span key={i} className="absolute h-2 w-2 rounded-full" style={{ background: G.cosmic, top: "50%", left: `${i * 16}%`, animation: `nova-ld-helix 1.4s ${i * 0.1}s ease-in-out infinite alternate` }} />
        ))}
      </div>
    </Stage>
  );
}

/* 15 — Star Burst */
function StarBurst() {
  return (
    <Stage>
      <div className="relative h-16 w-16" style={{ animation: "nova-ld-spin 3s linear infinite" }}>
        {[0, 45, 90, 135].map((a) => (
          <span key={a} className="absolute inset-0 grid place-items-center" style={{ transform: `rotate(${a}deg)` }}>
            <span className="h-14 w-0.5 rounded-full" style={{ background: G.aurora }} />
          </span>
        ))}
        <span className="absolute inset-[35%] rounded-full bg-white shadow-[0_0_24px_rgba(255,255,255,.9)]" />
      </div>
    </Stage>
  );
}

/* 16 — Loading Text Shimmer */
function TextShimmer() {
  return (
    <Stage>
      <span className="font-display text-lg font-bold tracking-[0.2em]" style={{ backgroundImage: "linear-gradient(90deg,#fff 0%, #fff 40%, #a78bfa 50%, #fff 60%, #fff 100%)", backgroundSize: "200% 100%", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", animation: "nova-ld-shine 2s linear infinite" }}>
        LOADING
      </span>
    </Stage>
  );
}

/* 17 — Circular Progress w/ percent */
function CircPercent() {
  return (
    <Stage>
      <div className="relative h-16 w-16">
        <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
          <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="3" />
          <circle cx="18" cy="18" r="15" fill="none" stroke="url(#g17)" strokeWidth="3" strokeLinecap="round" strokeDasharray="94" strokeDashoffset="30" style={{ animation: "nova-ld-spin 2s linear infinite", transformOrigin: "center" }} />
          <defs><linearGradient id="g17"><stop offset="0%" stopColor="#22d3ee" /><stop offset="100%" stopColor="#a78bfa" /></linearGradient></defs>
        </svg>
      </div>
    </Stage>
  );
}

/* 18 — Cascading Squares */
function CascadeSquares() {
  return (
    <Stage>
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="h-4 w-4 rounded-sm" style={{ background: G.ember, animation: `nova-ld-flip 1s ${i * 0.15}s ease-in-out infinite` }} />
        ))}
      </div>
    </Stage>
  );
}

/* 19 — Triple Orbit */
function TripleOrbit() {
  return (
    <Stage>
      <div className="relative h-16 w-16">
        {[["#22d3ee", 1.2, 0], ["#a78bfa", 1.6, 0.2], ["#f472b6", 2.0, 0.4]].map(([c, d, del], i) => (
          <span key={i} className="absolute inset-0 rounded-full border-2 border-transparent" style={{ borderTopColor: c as string, animation: `nova-ld-spin ${d}s ${del}s linear infinite`, transform: `scale(${1 - i * 0.2})` }} />
        ))}
      </div>
    </Stage>
  );
}

/* 20 — Comet Trail */
function CometTrail() {
  return (
    <Stage>
      <div className="relative h-16 w-16" style={{ animation: "nova-ld-spin 1s linear infinite" }}>
        <div className="absolute top-0 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-white shadow-[0_0_16px_#fff]" />
        <div className="absolute top-0 left-1/2 h-8 w-0.5 -translate-x-1/2 origin-top" style={{ background: "linear-gradient(#fff,transparent)" }} />
      </div>
    </Stage>
  );
}

/* 21 — Squircle Morph */
function SquircleMorph() {
  return (
    <Stage>
      <div className="h-12 w-12" style={{ background: G.aurora, animation: "nova-ld-morph 2s ease-in-out infinite" }} />
    </Stage>
  );
}

/* 22 — Hexagon Grid Pulse */
function HexPulse() {
  return (
    <Stage>
      <div className="grid grid-cols-3 gap-1">
        {[...Array(9)].map((_, i) => (
          <span key={i} className="h-3 w-3" style={{ background: G.mint, clipPath: "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)", animation: `nova-ld-pulse 1.2s ${(i % 3) * 0.15}s ease-in-out infinite` }} />
        ))}
      </div>
    </Stage>
  );
}

/* 23 — Loading Line */
function LoadingLine() {
  return (
    <Stage>
      <div className="relative h-0.5 w-40 overflow-hidden bg-white/10">
        <span className="absolute inset-y-0 w-1/2" style={{ background: G.aurora, animation: "nova-ld-track 1.5s ease-in-out infinite" }} />
      </div>
    </Stage>
  );
}

/* 24 — Radar Sweep */
function RadarSweep() {
  return (
    <Stage>
      <div className="relative h-16 w-16 rounded-full border border-emerald-400/30" style={{ background: "radial-gradient(circle,rgba(16,185,129,.15),transparent 70%)" }}>
        <div className="absolute inset-0 rounded-full" style={{ background: "conic-gradient(from 0deg, transparent 270deg, rgba(52,211,153,.6) 360deg)", animation: "nova-ld-spin 1.6s linear infinite" }} />
      </div>
    </Stage>
  );
}

/* 25 — Loading Dots Grow */
function DotsGrow() {
  return (
    <Stage>
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-2 w-2 rounded-full" style={{ background: G.nebula, animation: `nova-ld-grow 1.2s ${i * 0.2}s ease-in-out infinite` }} />
        ))}
      </div>
    </Stage>
  );
}

/* 26 — Flip Card */
function FlipCard() {
  return (
    <Stage style={{ perspective: 500 }}>
      <div className="h-12 w-16 rounded-md" style={{ background: G.sunset, animation: "nova-ld-flipy 1.4s ease-in-out infinite", transformStyle: "preserve-3d" }} />
    </Stage>
  );
}

/* 27 — Ring w Gap */
function RingGap() {
  return (
    <Stage>
      <div className="h-14 w-14 rounded-full border-4 border-cyan-400/80 border-r-transparent" style={{ animation: "nova-ld-spin 0.8s linear infinite" }} />
    </Stage>
  );
}

/* 28 — Bouncing Ball */
function BouncingBall() {
  return (
    <Stage>
      <div className="relative h-16 w-8">
        <span className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 rounded-full" style={{ background: G.ember, animation: "nova-ld-ball 0.9s ease-in-out infinite" }} />
        <span className="absolute bottom-0 left-1/2 h-1 w-6 -translate-x-1/2 rounded-full bg-white/20" />
      </div>
    </Stage>
  );
}

/* 29 — Spinner Segments */
function SegSpinner() {
  return (
    <Stage>
      <div className="relative h-14 w-14" style={{ animation: "nova-ld-spin 1s steps(8) infinite" }}>
        {[...Array(8)].map((_, i) => (
          <span key={i} className="absolute left-1/2 top-0 h-3 w-0.5 origin-[50%_28px] rounded-full bg-white" style={{ transform: `translateX(-50%) rotate(${i * 45}deg)`, opacity: (i + 1) / 8 }} />
        ))}
      </div>
    </Stage>
  );
}

/* 30 — Squircle Glow Orbit */
function GlowOrbit() {
  return (
    <Stage>
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full opacity-60 blur-xl" style={{ background: G.cosmic, animation: "nova-ld-pulse 1.6s ease-in-out infinite" }} />
        <div className="absolute inset-2 rounded-full" style={{ background: G.cosmic, animation: "nova-ld-spin 1.2s linear infinite", mask: "radial-gradient(circle,transparent 55%,#000 57%)" }} />
      </div>
    </Stage>
  );
}

/* --- Registry --- */
type Entry = { id: string; name: string; C: () => ReactNode };
const ENTRIES: Entry[] = [
  { id: "ld-01", name: "Orbit Ring", C: OrbitRing },
  { id: "ld-02", name: "Dual Arcs", C: DualArcs },
  { id: "ld-03", name: "Pulse Core", C: PulseCore },
  { id: "ld-04", name: "Bouncing Dots", C: BouncingDots },
  { id: "ld-05", name: "Wave Bars", C: WaveBars },
  { id: "ld-06", name: "Cube Flip 3D", C: CubeFlip },
  { id: "ld-07", name: "Ring Sweep", C: RingSweep },
  { id: "ld-08", name: "Sonar Ripples", C: SonarRipples },
  { id: "ld-09", name: "Orbit Planet", C: OrbitPlanet },
  { id: "ld-10", name: "Progress Bar", C: ProgressBar },
  { id: "ld-11", name: "Spiral Dots", C: SpiralDots },
  { id: "ld-12", name: "Yin Yang", C: YinYang },
  { id: "ld-13", name: "Heart Beat", C: HeartBeat },
  { id: "ld-14", name: "DNA Helix", C: DnaHelix },
  { id: "ld-15", name: "Star Burst", C: StarBurst },
  { id: "ld-16", name: "Text Shimmer", C: TextShimmer },
  { id: "ld-17", name: "Circ Percent", C: CircPercent },
  { id: "ld-18", name: "Cascade Squares", C: CascadeSquares },
  { id: "ld-19", name: "Triple Orbit", C: TripleOrbit },
  { id: "ld-20", name: "Comet Trail", C: CometTrail },
  { id: "ld-21", name: "Squircle Morph", C: SquircleMorph },
  { id: "ld-22", name: "Hex Pulse", C: HexPulse },
  { id: "ld-23", name: "Loading Line", C: LoadingLine },
  { id: "ld-24", name: "Radar Sweep", C: RadarSweep },
  { id: "ld-25", name: "Dots Grow", C: DotsGrow },
  { id: "ld-26", name: "Flip Card", C: FlipCard },
  { id: "ld-27", name: "Ring Gap", C: RingGap },
  { id: "ld-28", name: "Bouncing Ball", C: BouncingBall },
  { id: "ld-29", name: "Seg Spinner", C: SegSpinner },
  { id: "ld-30", name: "Glow Orbit", C: GlowOrbit },
];

export const LOADERS: LoaderItem[] = ENTRIES.map((e) => ({
  id: e.id,
  name: e.name,
  render: () => <e.C />,
  code: `// ${e.name} — Novix UI premium loader\n// Full source available in /src/data/loaders.tsx`,
}));
