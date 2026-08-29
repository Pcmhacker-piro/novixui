import type { ReactNode, CSSProperties } from "react";
import type { PatternItem } from "@/data/patterns";

/* Shared 3D-tilt frame */
const Frame = ({ children, style, bg = "#050505" }: { children?: ReactNode; style?: CSSProperties; bg?: string }) => (
  <div
    className="relative h-44 w-64 overflow-hidden rounded-2xl border border-white/10 transition-transform duration-500 group-hover:-translate-y-1 group-hover:[transform:perspective(900px)_rotateX(6deg)]"
    style={{ background: bg, ...style }}
  >
    {children}
    <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
  </div>
);

/* Global keyframes injected once */
function PatternKeyframes() {
  return (
    <style>{`
      @keyframes px-drift { 0%{background-position:0 0} 100%{background-position:200% 0} }
      @keyframes px-drift-y { 0%{background-position:0 0} 100%{background-position:0 200%} }
      @keyframes px-spin-slow { to { transform: rotate(360deg); } }
      @keyframes px-pulse { 0%,100%{opacity:.55;transform:scale(1)} 50%{opacity:1;transform:scale(1.08)} }
      @keyframes px-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
      @keyframes px-sweep { 0%{transform:translateX(-120%)} 100%{transform:translateX(120%)} }
      @keyframes px-hue { to { filter: hue-rotate(360deg); } }
      @keyframes px-scan { 0%{transform:translateY(-100%)} 100%{transform:translateY(200%)} }
      @keyframes px-orbit { to { transform: rotate(360deg); } }
      @keyframes px-blink { 0%,100%{opacity:.2} 50%{opacity:1} }
    `}</style>
  );
}

/* Palette helpers */
const palettes = [
  ["#7c3aed", "#22d3ee", "#ec4899"],
  ["#06b6d4", "#3b82f6", "#a855f7"],
  ["#10b981", "#22d3ee", "#84cc16"],
  ["#f97316", "#ef4444", "#eab308"],
  ["#f472b6", "#a78bfa", "#38bdf8"],
  ["#22c55e", "#0ea5e9", "#a855f7"],
  ["#e11d48", "#f59e0b", "#f472b6"],
  ["#0ea5e9", "#22d3ee", "#67e8f9"],
  ["#8b5cf6", "#ec4899", "#f59e0b"],
  ["#14b8a6", "#22d3ee", "#818cf8"],
];
const p = (i: number) => palettes[i % palettes.length];

/* === Generators === */

// A. Conic aurora with hue rotation
const ConicAurora = (i: number) => () => {
  const [a, b, c] = p(i);
  return (
    <Frame>
      <span aria-hidden className="absolute -inset-16 opacity-70 blur-3xl transition-transform duration-1000 group-hover:scale-125"
        style={{ background: `conic-gradient(from ${i * 33}deg at ${20 + (i % 5) * 10}% ${30 + (i % 4) * 15}%, ${a}, ${b}, ${c}, ${a})`, animation: `px-hue ${12 + (i % 5)}s linear infinite` }} />
    </Frame>
  );
};

// B. Animated grid with drift
const DriftGrid = (i: number) => () => (
  <Frame style={{
    backgroundImage: "linear-gradient(rgba(255,255,255,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.09) 1px, transparent 1px)",
    backgroundSize: `${18 + (i % 5) * 4}px ${18 + (i % 5) * 4}px`,
    animation: `px-drift ${18 + (i % 6)}s linear infinite`,
  }}>
    <span aria-hidden className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 60%, ${p(i)[0]}55, transparent 60%)` }} />
  </Frame>
);

// C. Dot grid with color pulse
const PulseDots = (i: number) => () => {
  const [a] = p(i);
  return (
    <Frame style={{
      backgroundImage: `radial-gradient(${a} 1.4px, transparent 1.6px)`,
      backgroundSize: `${14 + (i % 4) * 4}px ${14 + (i % 4) * 4}px`,
    }}>
      <span aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(circle at center, transparent 30%, #050505 82%)", animation: "px-pulse 4s ease-in-out infinite" }} />
    </Frame>
  );
};

// D. Diagonal stripes with sweep
const StripeSweep = (i: number) => () => {
  const [a, b] = p(i);
  return (
    <Frame style={{
      backgroundImage: `repeating-linear-gradient(${45 + (i % 4) * 20}deg, ${a}22 0 8px, transparent 8px 20px)`,
    }}>
      <span aria-hidden className="absolute -inset-x-10 top-1/2 h-24 -translate-y-1/2 blur-2xl" style={{ background: `linear-gradient(90deg, transparent, ${b}77, transparent)`, animation: `px-sweep ${6 + (i % 4)}s ease-in-out infinite` }} />
    </Frame>
  );
};

// E. Radial bloom stack
const RadialBloom = (i: number) => () => {
  const [a, b, c] = p(i);
  return (
    <Frame>
      <span aria-hidden className="absolute inset-0" style={{
        background: `radial-gradient(circle at 30% 30%, ${a}55, transparent 45%), radial-gradient(circle at 70% 70%, ${b}55, transparent 45%), radial-gradient(circle at 50% 50%, ${c}44, transparent 60%)`,
        animation: "px-pulse 6s ease-in-out infinite",
      }} />
    </Frame>
  );
};

// F. Concentric rings
const Rings = (i: number) => () => {
  const [a] = p(i);
  return (
    <Frame>
      {Array.from({ length: 8 }).map((_, k) => (
        <span key={k} aria-hidden className="absolute rounded-full border" style={{
          inset: `${k * 8}px`,
          borderColor: `${a}${(90 - k * 10).toString(16).padStart(2, "0")}`,
          animation: `px-pulse ${5 + k * 0.2}s ease-in-out ${k * 0.15}s infinite`,
        }} />
      ))}
    </Frame>
  );
};

// G. Scanline
const Scanline = (i: number) => () => {
  const [a] = p(i);
  return (
    <Frame style={{
      backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0 2px, transparent 2px 4px)",
    }}>
      <span aria-hidden className="absolute inset-x-0 h-24 blur-md" style={{ background: `linear-gradient(180deg, transparent, ${a}66, transparent)`, animation: `px-scan ${4 + (i % 3)}s linear infinite` }} />
    </Frame>
  );
};

// H. Floating orbs
const Orbs = (i: number) => () => {
  const cols = p(i);
  return (
    <Frame>
      {Array.from({ length: 10 }).map((_, k) => (
        <span key={k} aria-hidden className="absolute rounded-full blur-lg" style={{
          left: `${(k * 61 + i * 7) % 95}%`,
          top: `${(k * 37 + i * 11) % 90}%`,
          width: `${14 + (k % 4) * 8}px`,
          height: `${14 + (k % 4) * 8}px`,
          background: cols[k % cols.length],
          opacity: 0.55,
          animation: `px-float ${5 + (k % 4)}s ease-in-out ${k * 0.25}s infinite`,
        }} />
      ))}
    </Frame>
  );
};

// I. Mesh gradient
const MeshGrad = (i: number) => () => {
  const [a, b, c] = p(i);
  return (
    <Frame style={{ background: `linear-gradient(135deg, ${a}, ${b}, ${c})` }}>
      <span aria-hidden className="absolute inset-0 mix-blend-overlay" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
    </Frame>
  );
};

// J. Orbit
const Orbit = (i: number) => () => {
  const [a, b] = p(i);
  return (
    <Frame>
      <span aria-hidden className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: `radial-gradient(circle, ${a}88, transparent 70%)` }} />
      {Array.from({ length: 3 }).map((_, k) => (
        <span key={k} aria-hidden className="absolute left-1/2 top-1/2 rounded-full border" style={{
          width: `${80 + k * 40}px`, height: `${80 + k * 40}px`, marginLeft: `-${40 + k * 20}px`, marginTop: `-${40 + k * 20}px`,
          borderColor: `${b}55`, animation: `px-orbit ${10 + k * 4}s linear ${k % 2 ? "reverse" : ""} infinite`,
        }}>
          <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full" style={{ background: b }} />
        </span>
      ))}
    </Frame>
  );
};

// K. Noise mesh
const NoiseMesh = (i: number) => () => {
  const [a, b] = p(i);
  return (
    <Frame style={{ background: `radial-gradient(circle at 30% 30%, ${a}88, transparent 60%), radial-gradient(circle at 70% 70%, ${b}88, transparent 60%), #050505` }}>
      <span aria-hidden className="absolute inset-0 opacity-30 mix-blend-overlay" style={{
        backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.5'/></svg>\")",
      }} />
    </Frame>
  );
};

// L. Beam split
const Beams = (i: number) => () => {
  const [a, b, c] = p(i);
  return (
    <Frame>
      {[a, b, c].map((col, k) => (
        <span key={k} aria-hidden className="absolute inset-y-0 w-24 blur-2xl" style={{
          left: `${10 + k * 30}%`,
          background: `linear-gradient(180deg, transparent, ${col}88, transparent)`,
          transform: `rotate(${-12 + k * 4}deg)`,
          animation: `px-float ${5 + k}s ease-in-out ${k * 0.4}s infinite`,
        }} />
      ))}
    </Frame>
  );
};

// M. Blueprint variant
const Blueprint = (i: number) => () => {
  const [a] = p(i);
  return (
    <Frame bg="#03131f" style={{
      backgroundImage: `linear-gradient(${a}33 1px, transparent 1px), linear-gradient(90deg, ${a}33 1px, transparent 1px), linear-gradient(${a}18 1px, transparent 1px), linear-gradient(90deg, ${a}18 1px, transparent 1px)`,
      backgroundSize: "60px 60px, 60px 60px, 12px 12px, 12px 12px",
    }}>
      <span aria-hidden className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 50%, transparent 40%, #03131faa 100%)` }} />
    </Frame>
  );
};

// N. Wave lines (SVG)
const WaveLines = (i: number) => () => {
  const [a, b] = p(i);
  return (
    <Frame>
      <svg viewBox="0 0 400 200" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`px-wave-${i}`} x1="0" x2="1"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient>
        </defs>
        {Array.from({ length: 6 }).map((_, k) => (
          <path key={k} d={`M0 ${40 + k * 25} Q 100 ${20 + k * 25} 200 ${40 + k * 25} T 400 ${40 + k * 25}`} fill="none" stroke={`url(#px-wave-${i})`} strokeWidth={1} opacity={0.6 - k * 0.06} />
        ))}
      </svg>
    </Frame>
  );
};

// O. Hex mask
const Hex = (i: number) => () => {
  const [a] = p(i);
  return (
    <Frame style={{
      backgroundColor: "#050505",
      backgroundImage: `radial-gradient(${a}44 2px, transparent 2px), radial-gradient(${a}22 2px, transparent 2px)`,
      backgroundSize: "28px 28px, 28px 28px",
      backgroundPosition: "0 0, 14px 14px",
    }}>
      <span aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(circle at center, transparent 30%, #050505 85%)" }} />
    </Frame>
  );
};

// P. Circuit lines
const Circuit = (i: number) => () => {
  const [a] = p(i);
  return (
    <Frame>
      <svg viewBox="0 0 200 140" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        {Array.from({ length: 6 }).map((_, k) => (
          <g key={k} stroke={a} strokeWidth="0.6" fill="none" opacity={0.55}>
            <path d={`M${10 + k * 30} 10 L${10 + k * 30} ${40 + k * 8} L${60 + k * 20} ${40 + k * 8} L${60 + k * 20} 130`} />
            <circle cx={10 + k * 30} cy={10} r="1.6" fill={a} />
            <circle cx={60 + k * 20} cy={130} r="1.6" fill={a} />
          </g>
        ))}
      </svg>
    </Frame>
  );
};

// Q. Starfield twinkle
const Stars = (i: number) => () => (
  <Frame>
    {Array.from({ length: 40 }).map((_, k) => (
      <span key={k} aria-hidden className="absolute h-[2px] w-[2px] rounded-full bg-white" style={{
        left: `${(k * 53 + i * 7) % 100}%`,
        top: `${(k * 91 + i * 13) % 100}%`,
        opacity: 0.35 + ((k * 7) % 10) / 20,
        animation: `px-blink ${2 + (k % 4)}s ease-in-out ${k * 0.1}s infinite`,
      }} />
    ))}
    <span aria-hidden className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 60%, ${p(i)[0]}33, transparent 60%)` }} />
  </Frame>
);

/* Registry generator */

const generators = [
  { key: "aurora", label: "Aurora", make: ConicAurora, n: 10 },
  { key: "grid", label: "Drift Grid", make: DriftGrid, n: 8 },
  { key: "dots", label: "Pulse Dots", make: PulseDots, n: 8 },
  { key: "stripes", label: "Stripe Sweep", make: StripeSweep, n: 8 },
  { key: "bloom", label: "Radial Bloom", make: RadialBloom, n: 8 },
  { key: "rings", label: "Rings", make: Rings, n: 8 },
  { key: "scan", label: "Scanline", make: Scanline, n: 6 },
  { key: "orbs", label: "Floating Orbs", make: Orbs, n: 8 },
  { key: "mesh", label: "Mesh Gradient", make: MeshGrad, n: 8 },
  { key: "orbit", label: "Orbit", make: Orbit, n: 6 },
  { key: "noise", label: "Noise Mesh", make: NoiseMesh, n: 6 },
  { key: "beams", label: "Beam Split", make: Beams, n: 6 },
  { key: "blueprint", label: "Blueprint", make: Blueprint, n: 4 },
  { key: "waves", label: "Wave Lines", make: WaveLines, n: 4 },
  { key: "hex", label: "Hex Mask", make: Hex, n: 4 },
  { key: "circuit", label: "Circuit", make: Circuit, n: 4 },
  { key: "stars", label: "Starfield", make: Stars, n: 4 },
];

const items: PatternItem[] = [];
let globalIdx = 0;
for (const g of generators) {
  for (let k = 0; k < g.n; k++) {
    const idx = globalIdx++;
    const Comp = g.make(idx);
    const name = `${g.label} ${k + 1}`;
    items.push({
      id: `pt-ex-${idx + 1}`,
      name,
      render: () => (
        <>
          {idx === 0 && <PatternKeyframes />}
          <Comp />
        </>
      ),
      code: `// ${name} — Novix UI premium pattern\n// Full source in src/data/patterns-extra.tsx`,
    });
  }
}

export const PATTERNS_EXTRA: PatternItem[] = items;
