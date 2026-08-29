import type { ReactNode } from "react";
import { CARDS_EXTRA } from "./cards-extra";

export type CardItem = {
  id: string;
  name: string;
  render: () => ReactNode;
  code: string;
};

/* ---------- 01 · Aurora Glass ---------- */
function AuroraGlass() {
  return (
    <div
      className="relative h-44 w-64 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl transition-transform duration-500 [transform:perspective(900px)_rotateX(0deg)] group-hover:[transform:perspective(900px)_rotateX(6deg)_translateY(-4px)]"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-16 opacity-70 blur-3xl transition-transform duration-1000 ease-out group-hover:[transform:translate3d(20px,-10px,0)_rotate(15deg)]"
        style={{
          background:
            "conic-gradient(from 90deg at 30% 30%, #7c3aed, #22d3ee, #ec4899, #7c3aed)",
        }}
      />
      <div className="relative">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">Aurora</p>
        <h4 className="mt-1 text-lg font-semibold text-white">Northern glow</h4>
        <p className="mt-2 text-[12px] leading-relaxed text-white/75">
          Ambient conic gradient drifting behind a frosted glass surface.
        </p>
      </div>
    </div>
  );
}

/* ---------- 02 · Holographic Foil ---------- */
function HoloFoil() {
  return (
    <div className="relative h-44 w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b12] p-4 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-[-1.5deg]">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen transition-opacity duration-500 group-hover:opacity-90"
        style={{
          background:
            "linear-gradient(115deg, transparent 20%, #ff2bd6 35%, #22d3ee 50%, #a3e635 65%, transparent 80%)",
          backgroundSize: "200% 100%",
          animation: "hf-shine 3.5s linear infinite",
        }}
      />
      <div className="relative">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">Foil · 01</p>
        <h4 className="mt-1 text-lg font-semibold text-white">Prism pass</h4>
        <p className="mt-2 text-[12px] text-white/70">Holographic sweep on hover.</p>
      </div>
      <style>{`@keyframes hf-shine{0%{background-position:0% 0}100%{background-position:200% 0}}`}</style>
    </div>
  );
}

/* ---------- 03 · Layered Stack ---------- */
function LayeredStack() {
  return (
    <div className="relative h-44 w-64 [perspective:900px]">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute inset-0 rounded-2xl border border-white/10 bg-gradient-to-br from-[#141420] to-[#050510] p-4 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.9)] transition-all duration-500"
          style={{
            transform: `translateY(${i * 6}px) translateZ(${-i * 20}px) scale(${1 - i * 0.04})`,
            zIndex: 3 - i,
          }}
        >
          {i === 0 && (
            <div className="text-white">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">Stack</p>
              <h4 className="mt-1 text-lg font-semibold">Fan out</h4>
              <p className="mt-2 text-[12px] text-white/70">Three cards, one gesture.</p>
            </div>
          )}
        </div>
      ))}
      <style>{`.group:hover [style*="scale(0.96)"]{transform:translateY(-20px) translateX(24px) rotate(6deg) scale(0.96)!important}.group:hover [style*="scale(0.92)"]{transform:translateY(-8px) translateX(-24px) rotate(-6deg) scale(0.92)!important}`}</style>
    </div>
  );
}

/* ---------- 04 · Neon Border Trace ---------- */
function NeonTrace() {
  return (
    <div className="relative h-44 w-64 rounded-2xl bg-[#050505] p-[1.5px] transition-transform duration-500 group-hover:-translate-y-1">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-60 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "conic-gradient(from 0deg, #22d3ee, #a855f7, #ec4899, #22d3ee)",
          animation: "nt-spin 4s linear infinite",
        }}
      />
      <div className="relative h-full w-full rounded-2xl bg-[#0a0a0f] p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">Trace</p>
        <h4 className="mt-1 text-lg font-semibold text-white">Live edge</h4>
        <p className="mt-2 text-[12px] text-white/70">Conic border loop, boosted on hover.</p>
      </div>
      <style>{`@keyframes nt-spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

/* ---------- 05 · Tilted Product ---------- */
function TiltedProduct() {
  return (
    <div className="relative h-44 w-64 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a1030] via-[#0a0a18] to-[#050510] p-4 [perspective:800px]">
      <div className="relative z-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-fuchsia-300/80">Pro plan</p>
        <h4 className="mt-1 text-lg font-semibold text-white">$29 <span className="text-[11px] font-normal text-white/50">/mo</span></h4>
        <button className="mt-3 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-black transition-transform duration-300 group-hover:scale-105">
          Upgrade
        </button>
      </div>
      <div
        aria-hidden
        className="absolute -right-8 -bottom-6 h-32 w-32 rounded-2xl border border-white/15 bg-gradient-to-br from-fuchsia-500 via-purple-500 to-cyan-400 shadow-[0_20px_40px_-10px_rgba(168,85,247,0.6)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] [transform:rotate(18deg)_translateZ(0)] group-hover:[transform:rotate(4deg)_translateY(-8px)_translateZ(30px)]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(60% 60% at 80% 90%, rgba(168,85,247,0.35), transparent 70%)",
        }}
      />
    </div>
  );
}

const CODE_AURORA = `<div className="group relative h-44 w-64 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl transition-transform duration-500 group-hover:[transform:perspective(900px)_rotateX(6deg)_translateY(-4px)]">
  <span aria-hidden className="pointer-events-none absolute -inset-16 opacity-70 blur-3xl"
    style={{ background: "conic-gradient(from 90deg at 30% 30%, #7c3aed, #22d3ee, #ec4899, #7c3aed)" }} />
  <div className="relative text-white">
    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">Aurora</p>
    <h4 className="mt-1 text-lg font-semibold">Northern glow</h4>
    <p className="mt-2 text-[12px] leading-relaxed text-white/75">Ambient conic gradient behind frosted glass.</p>
  </div>
</div>`;

const CODE_FOIL = `<div className="group relative h-44 w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b12] p-4">
  <span aria-hidden className="pointer-events-none absolute inset-0 mix-blend-screen opacity-40 group-hover:opacity-90 transition-opacity"
    style={{ background: "linear-gradient(115deg, transparent 20%, #ff2bd6 35%, #22d3ee 50%, #a3e635 65%, transparent 80%)",
             backgroundSize: "200% 100%", animation: "hf-shine 3.5s linear infinite" }} />
  <div className="relative text-white">
    <h4 className="text-lg font-semibold">Prism pass</h4>
    <p className="text-[12px] text-white/70">Holographic sweep on hover.</p>
  </div>
  <style>{\`@keyframes hf-shine{0%{background-position:0% 0}100%{background-position:200% 0}}\`}</style>
</div>`;

const CODE_STACK = `<div className="group relative h-44 w-64 [perspective:900px]">
  {[0,1,2].map(i => (
    <div key={i} className="absolute inset-0 rounded-2xl border border-white/10 bg-gradient-to-br from-[#141420] to-[#050510] p-4 transition-all duration-500"
      style={{ transform: \`translateY(\${i*6}px) translateZ(\${-i*20}px) scale(\${1-i*0.04})\`, zIndex: 3-i }}>
      {i===0 && <h4 className="text-white text-lg font-semibold">Fan out</h4>}
    </div>
  ))}
</div>`;

const CODE_NEON = `<div className="group relative h-44 w-64 rounded-2xl bg-[#050505] p-[1.5px]">
  <span aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl opacity-60 group-hover:opacity-100 transition-opacity"
    style={{ background: "conic-gradient(from 0deg, #22d3ee, #a855f7, #ec4899, #22d3ee)", animation: "nt-spin 4s linear infinite" }} />
  <div className="relative h-full w-full rounded-2xl bg-[#0a0a0f] p-4 text-white">
    <h4 className="text-lg font-semibold">Live edge</h4>
  </div>
  <style>{\`@keyframes nt-spin{to{transform:rotate(360deg)}}\`}</style>
</div>`;

const CODE_PRODUCT = `<div className="group relative h-44 w-64 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a1030] via-[#0a0a18] to-[#050510] p-4 [perspective:800px]">
  <div className="relative z-10 text-white">
    <h4 className="text-lg font-semibold">$29<span className="text-[11px] text-white/50">/mo</span></h4>
    <button className="mt-3 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-black group-hover:scale-105 transition-transform">Upgrade</button>
  </div>
  <div aria-hidden className="absolute -right-8 -bottom-6 h-32 w-32 rounded-2xl bg-gradient-to-br from-fuchsia-500 via-purple-500 to-cyan-400 transition-transform duration-700 [transform:rotate(18deg)] group-hover:[transform:rotate(4deg)_translateY(-8px)_translateZ(30px)]" />
</div>`;

/* ---------- 06 · Starfield Night ---------- */
function rand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}
function makeShadow(count: number, seed: number, size: number) {
  const r = rand(seed);
  const parts: string[] = [];
  for (let i = 0; i < count; i++) {
    const x = Math.floor(r() * 800);
    const y = Math.floor(r() * 600);
    parts.push(`${x}px ${y}px ${size === 1 ? "#fff" : "rgba(255,255,255,0.85)"}`);
  }
  return parts.join(",");
}
const STAR_S1 = makeShadow(160, 11, 1);
const STAR_S2 = makeShadow(70, 37, 2);
const STAR_S3 = makeShadow(30, 73, 3);

function StarfieldNight() {
  return (
    <div className="relative h-44 w-64 overflow-hidden rounded-2xl border border-white/10 [background:radial-gradient(ellipse_at_bottom,#1b2735_0%,#090a0f_100%)] transition-transform duration-500 group-hover:-translate-y-1">
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-px w-px bg-transparent"
        style={{ boxShadow: STAR_S1, animation: "sf-star 60s linear infinite" }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-[2px] w-[2px] bg-transparent"
        style={{ boxShadow: STAR_S2, animation: "sf-star 100s linear infinite" }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-[3px] w-[3px] bg-transparent"
        style={{ boxShadow: STAR_S3, animation: "sf-star 150s linear infinite" }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/60">Cosmos</p>
        <h4 className="mt-1 bg-gradient-to-b from-white to-[#38495a] bg-clip-text text-xl font-light tracking-[0.25em] text-transparent">
          STARS
        </h4>
      </div>
      <style>{`@keyframes sf-star { from { transform: translateY(0) } to { transform: translateY(-600px) } }`}</style>
    </div>
  );
}

const CODE_STARFIELD = `// Compact starfield: procedurally generated box-shadow stars
// on a radial-gradient night sky, drifting upward.
<div className="relative h-44 w-64 overflow-hidden rounded-2xl
  [background:radial-gradient(ellipse_at_bottom,#1b2735_0%,#090a0f_100%)]">
  <span className="absolute h-px w-px" style={{ boxShadow: STAR_S1, animation: "sf 60s linear infinite" }} />
  <span className="absolute h-[2px] w-[2px]" style={{ boxShadow: STAR_S2, animation: "sf 100s linear infinite" }} />
  <span className="absolute h-[3px] w-[3px]" style={{ boxShadow: STAR_S3, animation: "sf 150s linear infinite" }} />
  <h4 className="absolute inset-0 grid place-items-center bg-gradient-to-b from-white to-[#38495a] bg-clip-text text-transparent">STARS</h4>
  <style>{\`@keyframes sf{to{transform:translateY(-600px)}}\`}</style>
</div>`;

/* ---------- 07 · Liquid Metal ---------- */
function LiquidMetal() {
  return (
    <div className="relative h-44 w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#08080c] p-4 transition-transform duration-500 group-hover:-translate-y-1">
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-8 opacity-80 blur-2xl transition-transform duration-1000 group-hover:scale-125"
        style={{
          background:
            "conic-gradient(from 0deg at 50% 50%, #64748b, #e2e8f0, #94a3b8, #0f172a, #cbd5e1, #64748b)",
          animation: "lm-spin 8s linear infinite",
        }}
      />
      <div className="relative">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/70">Chrome</p>
        <h4 className="mt-1 text-lg font-semibold text-white drop-shadow">Liquid metal</h4>
        <p className="mt-2 text-[12px] text-white/75">Molten conic sheen with silver depth.</p>
      </div>
      <style>{`@keyframes lm-spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

/* ---------- 08 · Glow Orb ---------- */
function GlowOrb() {
  return (
    <div className="relative h-44 w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#05060a] p-4">
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-700 group-hover:h-56 group-hover:w-56"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(56,189,248,0.9), rgba(139,92,246,0.5) 45%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-sky-300 to-violet-500 shadow-[inset_0_-10px_30px_rgba(0,0,0,0.4),0_20px_40px_-10px_rgba(139,92,246,0.8)] transition-transform duration-500 group-hover:scale-110"
      />
      <div className="relative z-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/70">Nucleus</p>
      </div>
      <div className="absolute inset-x-0 bottom-3 text-center text-[11px] text-white/70">
        Pulsing plasma core
      </div>
    </div>
  );
}

/* ---------- 09 · Grid Flip ---------- */
function GridFlip() {
  return (
    <div className="relative h-44 w-64 [perspective:1000px]">
      <div className="relative h-full w-full rounded-2xl transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        <div className="absolute inset-0 overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a12] p-4 [backface-visibility:hidden]">
          <div
            aria-hidden
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
              maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
            }}
          />
          <p className="relative font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-300/80">Front</p>
          <h4 className="relative mt-1 text-lg font-semibold text-white">System status</h4>
          <p className="relative mt-2 text-[12px] text-white/70">All services operational.</p>
        </div>
        <div className="absolute inset-0 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-4 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/80">Back</p>
          <h4 className="mt-1 text-lg font-semibold text-white">99.99% uptime</h4>
          <p className="mt-2 text-[12px] text-white/85">Zero incidents this quarter.</p>
        </div>
      </div>
    </div>
  );
}

/* ---------- 10 · Ripple Wave ---------- */
function RippleWave() {
  return (
    <div className="relative h-44 w-64 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#0b1220] to-[#050810] p-4">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/60"
          style={{
            animation: `rw-ripple 3s ease-out ${i * 1}s infinite`,
          }}
        />
      ))}
      <div className="relative">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-300/80">Sonar</p>
        <h4 className="mt-1 text-lg font-semibold text-white">Signal ping</h4>
      </div>
      <div className="absolute inset-x-0 bottom-3 text-center text-[11px] text-white/60">
        Expanding radar rings
      </div>
      <style>{`@keyframes rw-ripple{0%{transform:translate(-50%,-50%) scale(0.5);opacity:0.9}100%{transform:translate(-50%,-50%) scale(6);opacity:0}}`}</style>
    </div>
  );
}

/* ---------- 11 · Depth Layers ---------- */
function DepthLayers() {
  return (
    <div className="relative h-44 w-64 [perspective:1000px]">
      <div className="relative h-full w-full rounded-2xl border border-white/10 bg-gradient-to-br from-[#0f0a1f] via-[#0a0a18] to-[#050510] p-4 transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateX(8deg)_rotateY(-12deg)]">
        <div className="absolute inset-4 rounded-xl bg-white/[0.04] [transform:translateZ(20px)]" />
        <div
          aria-hidden
          className="absolute right-6 top-6 h-14 w-14 rounded-lg bg-gradient-to-br from-amber-400 to-rose-500 shadow-[0_10px_30px_-5px_rgba(244,63,94,0.6)] transition-transform duration-500 [transform:translateZ(40px)] group-hover:[transform:translateZ(60px)_rotate(8deg)]"
        />
        <div className="absolute left-4 bottom-4 [transform:translateZ(50px)]">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-amber-300/80">Depth</p>
          <h4 className="mt-1 text-lg font-semibold text-white">Parallax scene</h4>
          <p className="mt-1 text-[11px] text-white/70">Layers lift on hover.</p>
        </div>
      </div>
    </div>
  );
}

const CODE_METAL = `<div className="group relative h-44 w-64 overflow-hidden rounded-2xl bg-[#08080c] p-4">
  <span className="absolute -inset-8 blur-2xl opacity-80"
    style={{ background:"conic-gradient(from 0deg,#64748b,#e2e8f0,#94a3b8,#0f172a,#cbd5e1,#64748b)", animation:"spin 8s linear infinite" }}/>
  <h4 className="relative text-lg font-semibold text-white">Liquid metal</h4>
</div>`;

const CODE_ORB = `<div className="group relative h-44 w-64 overflow-hidden rounded-2xl bg-[#05060a] p-4">
  <span className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl transition-all group-hover:h-56 group-hover:w-56"
    style={{ background:"radial-gradient(circle,rgba(56,189,248,0.9),rgba(139,92,246,0.5) 45%,transparent 70%)" }}/>
  <span className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-sky-300 to-violet-500 shadow-[inset_0_-10px_30px_rgba(0,0,0,0.4)] group-hover:scale-110 transition-transform"/>
</div>`;

const CODE_FLIP = `<div className="group h-44 w-64 [perspective:1000px]">
  <div className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
    <div className="absolute inset-0 rounded-2xl bg-[#0a0a12] p-4 [backface-visibility:hidden]">Front</div>
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 p-4 [backface-visibility:hidden] [transform:rotateY(180deg)]">Back</div>
  </div>
</div>`;

const CODE_RIPPLE = `<div className="relative h-44 w-64 overflow-hidden rounded-2xl bg-gradient-to-b from-[#0b1220] to-[#050810] p-4">
  {[0,1,2].map(i => (
    <span key={i} className="absolute left-1/2 top-1/2 h-8 w-8 rounded-full border border-cyan-400/60"
      style={{ animation: \`ripple 3s ease-out \${i}s infinite\` }}/>
  ))}
  <style>{\`@keyframes ripple{0%{transform:translate(-50%,-50%) scale(0.5);opacity:.9}100%{transform:translate(-50%,-50%) scale(6);opacity:0}}\`}</style>
</div>`;

const CODE_DEPTH = `<div className="group h-44 w-64 [perspective:1000px]">
  <div className="relative h-full w-full rounded-2xl bg-gradient-to-br from-[#0f0a1f] to-[#050510] p-4 [transform-style:preserve-3d] transition-transform duration-700 group-hover:[transform:rotateX(8deg)_rotateY(-12deg)]">
    <div className="absolute right-6 top-6 h-14 w-14 rounded-lg bg-gradient-to-br from-amber-400 to-rose-500 [transform:translateZ(40px)] group-hover:[transform:translateZ(60px)_rotate(8deg)] transition-transform"/>
    <div className="absolute left-4 bottom-4 text-white [transform:translateZ(50px)]"><h4 className="text-lg font-semibold">Parallax</h4></div>
  </div>
</div>`;

export const CARDS: CardItem[] = [
  { id: "aurora-glass",  name: "Aurora Glass",      render: () => <AuroraGlass />,    code: CODE_AURORA },
  { id: "holo-foil",     name: "Holographic Foil",  render: () => <HoloFoil />,       code: CODE_FOIL },
  { id: "layered-stack", name: "Layered Stack",     render: () => <LayeredStack />,   code: CODE_STACK },
  { id: "neon-trace",    name: "Neon Border Trace", render: () => <NeonTrace />,      code: CODE_NEON },
  { id: "tilted-product",name: "Tilted Product",    render: () => <TiltedProduct />,  code: CODE_PRODUCT },
  { id: "starfield",     name: "Starfield Night",   render: () => <StarfieldNight />, code: CODE_STARFIELD },
  { id: "liquid-metal",  name: "Liquid Metal",      render: () => <LiquidMetal />,    code: CODE_METAL },
  { id: "glow-orb",      name: "Glow Orb",          render: () => <GlowOrb />,        code: CODE_ORB },
  { id: "grid-flip",     name: "Grid Flip",         render: () => <GridFlip />,       code: CODE_FLIP },
  { id: "ripple-wave",   name: "Ripple Wave",       render: () => <RippleWave />,     code: CODE_RIPPLE },
  { id: "depth-layers",  name: "Depth Layers",      render: () => <DepthLayers />,    code: CODE_DEPTH },
  ...CARDS_EXTRA,
];


