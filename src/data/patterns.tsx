import type { ReactNode } from "react";

export type PatternItem = {
  id: string;
  name: string;
  render: () => ReactNode;
  code: string;
};

/* Hover host attribute: data-pt-hover-host */

const Frame = ({ children, style }: { children?: ReactNode; style?: React.CSSProperties }) => (
  <div
    className="relative h-44 w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#050505] transition-transform duration-500 group-hover:-translate-y-1 group-hover:[transform:perspective(900px)_rotateX(6deg)]"
    style={style}
  >
    {children}
  </div>
);

/* 01 · Aurora Mesh */
function AuroraMesh() {
  return (
    <Frame>
      <span
        aria-hidden
        className="absolute -inset-16 opacity-70 blur-3xl transition-transform duration-1000 group-hover:scale-125"
        style={{ background: "conic-gradient(from 90deg at 30% 30%, #7c3aed, #22d3ee, #ec4899, #7c3aed)" }}
      />
    </Frame>
  );
}

/* 02 · Dot Grid */
function DotGrid() {
  return (
    <Frame
      style={{
        backgroundImage: "radial-gradient(rgba(255,255,255,0.25) 1px, transparent 1px)",
        backgroundSize: "14px 14px",
      }}
    >
      <span
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#050505_80%)]"
      />
    </Frame>
  );
}

/* 03 · Grid Lines */
function GridLines() {
  return (
    <Frame
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <span aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.4),transparent_60%)] transition-opacity duration-700 group-hover:opacity-70" />
    </Frame>
  );
}

/* 04 · Diagonal Stripes */
function DiagonalStripes() {
  return (
    <Frame
      style={{
        backgroundImage:
          "repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0 10px, transparent 10px 20px)",
      }}
    >
      <span
        aria-hidden
        className="absolute -inset-16 opacity-50 blur-3xl transition-transform duration-700 group-hover:translate-x-8"
        style={{ background: "radial-gradient(circle, #22d3ee, transparent 60%)" }}
      />
    </Frame>
  );
}

/* 05 · Noise Grain */
function NoiseGrain() {
  return (
    <Frame
      style={{
        background: "linear-gradient(135deg, #1e1b4b, #0b0b12)",
      }}
    >
      <svg className="absolute inset-0 h-full w-full opacity-40 mix-blend-overlay" xmlns="http://www.w3.org/2000/svg">
        <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" /></filter>
        <rect width="100%" height="100%" filter="url(#n)" />
      </svg>
    </Frame>
  );
}

/* 06 · Starfield */
function Starfield() {
  const stars = Array.from({ length: 40 }, (_, i) => {
    const x = (i * 97) % 100;
    const y = (i * 53) % 100;
    const s = ((i * 31) % 3) + 1;
    return `${x}% ${y}% / ${s}px ${s}px`;
  });
  return (
    <Frame style={{ background: "radial-gradient(ellipse at bottom, #1b2735 0%, #050510 100%)" }}>
      {stars.map((_, i) => (
        <span
          key={i}
          className="absolute h-[2px] w-[2px] rounded-full bg-white opacity-80 transition-transform duration-1000 group-hover:scale-150"
          style={{
            left: `${(i * 97) % 100}%`,
            top: `${(i * 53) % 100}%`,
            animation: `pt-twinkle ${1.5 + (i % 5) * 0.3}s ease-in-out infinite`,
            animationDelay: `${(i % 6) * 0.2}s`,
          }}
        />
      ))}
      <style>{`@keyframes pt-twinkle{0%,100%{opacity:.2}50%{opacity:1}}`}</style>
    </Frame>
  );
}

/* 07 · Aurora Waves */
function AuroraWaves() {
  return (
    <Frame>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="absolute inset-x-[-20%] bottom-[-30%] h-[70%] rounded-[50%] opacity-60 blur-2xl"
          style={{
            background: ["#7c3aed", "#22d3ee", "#ec4899"][i],
            transform: `translateY(${i * 8}px)`,
            animation: `pt-wave 6s ease-in-out ${i * 0.6}s infinite`,
          }}
        />
      ))}
      <style>{`@keyframes pt-wave{0%,100%{transform:translateY(20px)}50%{transform:translateY(-10px)}}`}</style>
    </Frame>
  );
}

/* 08 · Hex Grid */
function HexGrid() {
  return (
    <Frame
      style={{
        backgroundColor: "#050510",
        backgroundImage:
          "radial-gradient(circle at 50% 50%, rgba(124,58,237,0.15) 8px, transparent 9px), radial-gradient(circle at 0 0, rgba(34,211,238,0.12) 8px, transparent 9px)",
        backgroundSize: "28px 48px",
      }}
    />
  );
}

/* 09 · Radial Bloom */
function RadialBloom() {
  return (
    <Frame>
      <span
        aria-hidden
        className="absolute inset-0 transition-transform duration-1000 group-hover:scale-125"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, #f472b6, transparent 40%), radial-gradient(circle at 70% 70%, #38bdf8, transparent 40%), radial-gradient(circle at 50% 50%, #a78bfa, transparent 60%)",
        }}
      />
    </Frame>
  );
}

/* 10 · Circuit Lines */
function CircuitLines() {
  return (
    <Frame style={{ background: "#050510" }}>
      <svg className="absolute inset-0 h-full w-full text-emerald-400/50" viewBox="0 0 200 120" fill="none">
        {[10, 40, 70, 100].map((y, i) => (
          <path
            key={i}
            d={`M0 ${y} L60 ${y} L80 ${y + 12} L140 ${y + 12} L160 ${y} L200 ${y}`}
            stroke="currentColor"
            strokeWidth="0.8"
            style={{ strokeDasharray: 4, strokeDashoffset: 100, animation: `pt-dash 4s linear ${i * 0.3}s infinite` }}
          />
        ))}
        <style>{`@keyframes pt-dash{to{stroke-dashoffset:0}}`}</style>
      </svg>
    </Frame>
  );
}

/* 11 · Blueprint */
function Blueprint() {
  return (
    <Frame
      style={{
        background: "#0b1e3a",
        backgroundImage:
          "linear-gradient(rgba(147,197,253,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(147,197,253,0.15) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <div className="absolute inset-6 rounded-lg border border-cyan-300/40" />
      <div className="absolute left-6 top-6 h-1 w-16 bg-cyan-300/60" />
    </Frame>
  );
}

/* 12 · Isometric Cubes */
function IsoCubes() {
  return (
    <Frame style={{ background: "#050510" }}>
      <div className="absolute inset-0 [perspective:600px]">
        <div className="absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 grid-cols-3 gap-2 [transform:rotateX(55deg)_rotateZ(45deg)] transition-transform duration-700 group-hover:[transform:rotateX(55deg)_rotateZ(45deg)_translateY(-6px)]">
          {Array.from({ length: 9 }).map((_, i) => (
            <span
              key={i}
              className="block h-6 w-6 bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-[0_6px_0_#4c1d95]"
              style={{ animation: `pt-lift 3s ease-in-out ${i * 0.1}s infinite` }}
            />
          ))}
        </div>
      </div>
      <style>{`@keyframes pt-lift{0%,100%{transform:translateZ(0)}50%{transform:translateZ(8px)}}`}</style>
    </Frame>
  );
}

/* 13 · Concentric Rings */
function ConcentricRings() {
  return (
    <Frame style={{ background: "radial-gradient(circle at center, #1e1b4b, #050510)" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
          style={{
            width: `${i * 40}px`,
            height: `${i * 40}px`,
            animation: `pt-pulse 3s ease-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
      <style>{`@keyframes pt-pulse{0%{opacity:.6;transform:translate(-50%,-50%) scale(.8)}100%{opacity:0;transform:translate(-50%,-50%) scale(1.2)}}`}</style>
    </Frame>
  );
}

/* 14 · Topographic */
function Topographic() {
  return (
    <Frame style={{ background: "#050510" }}>
      <svg className="absolute inset-0 h-full w-full text-amber-300/40" viewBox="0 0 200 120" fill="none">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path
            key={i}
            d={`M-10 ${20 + i * 15} Q 50 ${5 + i * 15} 100 ${25 + i * 15} T 210 ${20 + i * 15}`}
            stroke="currentColor"
            strokeWidth="0.6"
            fill="none"
          />
        ))}
      </svg>
      <span aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#050510_90%)]" />
    </Frame>
  );
}

/* 15 · Bokeh Particles */
function BokehParticles() {
  return (
    <Frame style={{ background: "linear-gradient(135deg, #1a1033, #050510)" }}>
      {Array.from({ length: 14 }).map((_, i) => (
        <span
          key={i}
          className="absolute rounded-full blur-md"
          style={{
            left: `${(i * 71) % 100}%`,
            top: `${(i * 43) % 100}%`,
            width: `${8 + (i % 4) * 6}px`,
            height: `${8 + (i % 4) * 6}px`,
            background: ["#f472b6", "#a78bfa", "#38bdf8", "#f59e0b"][i % 4],
            opacity: 0.5,
            animation: `pt-float 5s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
      <style>{`@keyframes pt-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}`}</style>
    </Frame>
  );
}

const codeFor = (name: string) => `// ${name} — Novix UI premium pattern\n// Full source in src/data/patterns.tsx\nexport function ${name.replace(/\s+/g, "")}Pattern() {\n  return (/* see live preview */);\n}\n`;

export const PATTERNS: PatternItem[] = [
  { id: "aurora-mesh", name: "Aurora Mesh", render: () => <AuroraMesh />, code: codeFor("Aurora Mesh") },
  { id: "dot-grid", name: "Dot Grid", render: () => <DotGrid />, code: codeFor("Dot Grid") },
  { id: "grid-lines", name: "Grid Lines", render: () => <GridLines />, code: codeFor("Grid Lines") },
  { id: "diagonal-stripes", name: "Diagonal Stripes", render: () => <DiagonalStripes />, code: codeFor("Diagonal Stripes") },
  { id: "noise-grain", name: "Noise Grain", render: () => <NoiseGrain />, code: codeFor("Noise Grain") },
  { id: "pattern-starfield", name: "Starfield", render: () => <Starfield />, code: codeFor("Starfield") },
  { id: "aurora-waves", name: "Aurora Waves", render: () => <AuroraWaves />, code: codeFor("Aurora Waves") },
  { id: "hex-grid", name: "Hex Grid", render: () => <HexGrid />, code: codeFor("Hex Grid") },
  { id: "radial-bloom", name: "Radial Bloom", render: () => <RadialBloom />, code: codeFor("Radial Bloom") },
  { id: "circuit-lines", name: "Circuit Lines", render: () => <CircuitLines />, code: codeFor("Circuit Lines") },
  { id: "blueprint", name: "Blueprint", render: () => <Blueprint />, code: codeFor("Blueprint") },
  { id: "iso-cubes", name: "Isometric Cubes", render: () => <IsoCubes />, code: codeFor("Isometric Cubes") },
  { id: "concentric-rings", name: "Concentric Rings", render: () => <ConcentricRings />, code: codeFor("Concentric Rings") },
  { id: "topographic", name: "Topographic", render: () => <Topographic />, code: codeFor("Topographic") },
  { id: "bokeh-particles", name: "Bokeh Particles", render: () => <BokehParticles />, code: codeFor("Bokeh Particles") },
];
