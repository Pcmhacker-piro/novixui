import type { ReactNode } from "react";

export type CheckboxItem = {
  id: string;
  name: string;
  render: () => ReactNode;
  code: string;
};

/* Palette blends (3-stop mixes so nothing feels mono-hued) */
type Hue = { from: string; via: string; to: string; ink: string };
const NEBULA: Hue = { from: "#7c3aed", via: "#c026d3", to: "#ec4899", ink: "#fdf4ff" };
const LAGOON: Hue = { from: "#06b6d4", via: "#14b8a6", to: "#a3e635", ink: "#ecfeff" };
const SUNSET: Hue = { from: "#f97316", via: "#f43f5e", to: "#d946ef", ink: "#fff7ed" };
const COSMIC: Hue = { from: "#3b82f6", via: "#6366f1", to: "#a855f7", ink: "#eff6ff" };
const AURORA: Hue = { from: "#22d3ee", via: "#a78bfa", to: "#f472b6", ink: "#f5f3ff" };

/* Small controlled checkbox helper — every variant owns its own state */
import { useEffect, useId, useRef, useState } from "react";

function Root({
  checked,
  onChange,
  className = "",
  children,
  style,
  ariaLabel = "Toggle",
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  className?: string;
  children: ReactNode;
  style?: React.CSSProperties;
  ariaLabel?: string;
}) {
  const id = useId();
  const labelRef = useRef<HTMLLabelElement>(null);
  // Hover preview: on enter we flip the *real* state so each variant plays
  // its full animation, then on leave we restore whatever the user actually
  // chose. If the user clicks while hovered, the click commits the new value
  // and leave becomes a no-op.
  const originalRef = useRef(checked);
  const hoveringRef = useRef(false);
  useEffect(() => {
    const el = labelRef.current;
    if (!el) return;
    const host = (el.closest("[data-cb-hover-host]") as HTMLElement | null) ?? el;
    const enter = () => {
      if (hoveringRef.current) return;
      hoveringRef.current = true;
      originalRef.current = checked;
      onChange(!checked);
    };
    const leave = () => {
      if (!hoveringRef.current) return;
      hoveringRef.current = false;
      if (checked !== originalRef.current) onChange(originalRef.current);
    };
    host.addEventListener("mouseenter", enter);
    host.addEventListener("mouseleave", leave);
    return () => {
      host.removeEventListener("mouseenter", enter);
      host.removeEventListener("mouseleave", leave);
    };
  }, [checked, onChange]);
  return (
    <label
      ref={labelRef}
      htmlFor={id}
      className={`relative inline-flex cursor-pointer select-none items-center gap-3 ${className}`}
      style={style}
    >
      <input
        id={id}
        type="checkbox"
        aria-label={ariaLabel}
        checked={checked}
        onChange={(e) => {
          // Click commits: adopt the new value as the "original" so
          // mouseleave won't revert it back.
          originalRef.current = e.target.checked;
          onChange(e.target.checked);
        }}
        className="peer sr-only"
      />
      {children}
    </label>
  );
}

/* ----- 20 unique premium checkboxes ----- */

/* 1 — Cube Flip: 3d cube rotates between empty face and check face */
function CubeFlip() {
  const [on, set] = useState(true);
  return (
    <Root checked={on} onChange={set} ariaLabel="Cube flip">
      <span
        aria-hidden
        className="relative h-8 w-8"
        style={{ perspective: "600px" }}
      >
        <span
          className="absolute inset-0 transition-transform duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: on ? "rotateX(180deg)" : "rotateX(0deg)",
          }}
        >
          <span
            className="absolute inset-0 rounded-lg border border-white/15 bg-white/[0.04]"
            style={{ backfaceVisibility: "hidden" }}
          />
          <span
            className="absolute inset-0 grid place-items-center rounded-lg text-white shadow-[0_10px_24px_-10px_rgba(124,58,237,0.7)]"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateX(180deg)",
              background: `linear-gradient(135deg, ${NEBULA.from}, ${NEBULA.via}, ${NEBULA.to})`,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4 4 10-10" /></svg>
          </span>
        </span>
      </span>
      <span className="text-[13px] font-medium text-white/85">Cube flip</span>
    </Root>
  );
}

/* 2 — Liquid Fill: gradient inks in from bottom with wave clip */
function LiquidFill() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Liquid fill">
      <span className="relative grid h-8 w-8 place-items-center overflow-hidden rounded-lg border border-white/15 bg-white/[0.03]">
        <span
          className="absolute inset-x-0 bottom-0 transition-[height,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            height: on ? "100%" : "0%",
            background: `linear-gradient(180deg, ${LAGOON.from}, ${LAGOON.via}, ${LAGOON.to})`,
          }}
        />
        <span
          aria-hidden
          className="absolute -top-1 left-0 h-3 w-[200%] opacity-80 transition-opacity duration-500"
          style={{
            transform: on ? "translateY(0)" : "translateY(120%)",
            backgroundImage: "radial-gradient(circle at 25% 100%, transparent 6px, #a3e635 6.5px), radial-gradient(circle at 75% 100%, transparent 6px, #14b8a6 6.5px)",
            backgroundSize: "24px 12px",
            filter: "blur(1px)",
            opacity: on ? 0.4 : 0,
          }}
        />
        <svg className="relative z-10" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={on ? "#052e2b" : "transparent"} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4 4 10-10" /></svg>
      </span>
      <span className="text-[13px] font-medium text-white/85">Liquid fill</span>
    </Root>
  );
}

/* 3 — Neon Draw: SVG check draws stroke-dashoffset */
function NeonDraw() {
  const [on, set] = useState(true);
  return (
    <Root checked={on} onChange={set} ariaLabel="Neon draw">
      <span className="relative grid h-8 w-8 place-items-center rounded-lg border border-white/15 bg-[#0b0b12]">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-lg transition-opacity duration-500"
          style={{
            opacity: on ? 1 : 0,
            boxShadow: `inset 0 0 12px ${COSMIC.via}, 0 0 18px -4px ${COSMIC.to}`,
          }}
        />
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COSMIC.ink} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12l4 4 10-10" style={{ strokeDasharray: 24, strokeDashoffset: on ? 0 : 24, transition: "stroke-dashoffset 500ms cubic-bezier(0.22,1,0.36,1)", filter: `drop-shadow(0 0 4px ${COSMIC.to})` }} />
        </svg>
      </span>
      <span className="text-[13px] font-medium text-white/85">Neon draw</span>
    </Root>
  );
}

/* 4 — Press Dome: physical dome with press-in sink */
function PressDome() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Press dome">
      <span
        className="relative grid h-9 w-9 place-items-center rounded-full transition-transform duration-300 active:scale-95"
        style={{
          background: on
            ? `radial-gradient(circle at 30% 25%, ${SUNSET.ink}55, ${SUNSET.from} 40%, ${SUNSET.to})`
            : "radial-gradient(circle at 30% 25%, #ffffff22, #1a1a1f 50%, #050505)",
          boxShadow: on
            ? `inset 0 -3px 6px rgba(0,0,0,0.4), 0 8px 18px -6px ${SUNSET.from}aa`
            : "inset 0 2px 4px rgba(255,255,255,0.06), inset 0 -3px 8px rgba(0,0,0,0.6), 0 6px 14px -6px #000",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={on ? "#3f0917" : "transparent"} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4 4 10-10" /></svg>
      </span>
      <span className="text-[13px] font-medium text-white/85">Press dome</span>
    </Root>
  );
}

/* 5 — Toggle Card: iOS-like switch with 3D thumb */
function ToggleCard() {
  const [on, set] = useState(true);
  return (
    <Root checked={on} onChange={set} ariaLabel="Toggle card">
      <span
        className="relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300"
        style={{
          background: on
            ? `linear-gradient(90deg, ${AURORA.from}, ${AURORA.via}, ${AURORA.to})`
            : "#1c1c22",
          boxShadow: on ? `0 6px 16px -6px ${AURORA.via}aa, inset 0 0 0 1px rgba(255,255,255,0.15)` : "inset 0 0 0 1px rgba(255,255,255,0.08)",
        }}
      >
        <span
          className="grid size-6 place-items-center rounded-full bg-white shadow-[0_4px_10px_rgba(0,0,0,0.35)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: on ? "translateX(22px)" : "translateX(2px)" }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={on ? AURORA.via : "#71717a"} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4 4 10-10" /></svg>
        </span>
      </span>
      <span className="text-[13px] font-medium text-white/85">Toggle card</span>
    </Root>
  );
}

/* 6 — Confetti Pop: small particles burst on check */
function ConfettiPop() {
  const [on, set] = useState(false);
  const [burst, setBurst] = useState(0);
  return (
    <Root
      checked={on}
      onChange={(v) => { set(v); if (v) setBurst((n) => n + 1); }}
      ariaLabel="Confetti pop"
    >
      <span className="relative grid h-8 w-8 place-items-center">
        <span
          className="grid size-8 place-items-center rounded-lg border transition-all duration-300"
          style={{
            borderColor: on ? "transparent" : "rgba(255,255,255,0.15)",
            background: on ? `linear-gradient(135deg, ${NEBULA.from}, ${SUNSET.to})` : "rgba(255,255,255,0.03)",
            transform: on ? "scale(1.02)" : "scale(1)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={on ? "#fff" : "transparent"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4 4 10-10" /></svg>
        </span>
        {on && (
          <span key={burst} className="pointer-events-none absolute inset-0">
            {[0, 60, 120, 180, 240, 300].map((deg, i) => (
              <span
                key={i}
                className="absolute left-1/2 top-1/2 size-1 rounded-full"
                style={{
                  background: [NEBULA.from, LAGOON.via, SUNSET.to, AURORA.via, COSMIC.to, LAGOON.to][i],
                  animation: `nova-cb-burst 640ms cubic-bezier(0.22,1,0.36,1) forwards`,
                  transform: `rotate(${deg}deg) translateY(-4px)`,
                }}
              />
            ))}
          </span>
        )}
      </span>
      <span className="text-[13px] font-medium text-white/85">Confetti pop</span>
      <style>{`@keyframes nova-cb-burst { 0%{ transform:translate(-50%,-50%) rotate(var(--r,0deg)) translateY(0); opacity:1 } 100%{ transform:translate(-50%,-50%) rotate(var(--r,0deg)) translateY(-22px); opacity:0 } }`}</style>
    </Root>
  );
}

/* 7 — Ribbon Fold: paper corner folds to reveal check */
function RibbonFold() {
  const [on, set] = useState(true);
  return (
    <Root checked={on} onChange={set} ariaLabel="Ribbon fold">
      <span className="relative grid h-8 w-8 overflow-hidden rounded-md border border-white/15 bg-white/[0.04]">
        <span
          className="absolute inset-0 grid place-items-center transition-opacity duration-300"
          style={{
            opacity: on ? 1 : 0,
            background: `linear-gradient(135deg, ${LAGOON.from}, ${LAGOON.via}, ${LAGOON.to})`,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#052e2b" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4 4 10-10" /></svg>
        </span>
        <span
          aria-hidden
          className="absolute right-0 top-0 h-0 w-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            borderStyle: "solid",
            borderWidth: on ? "0 0 0 0" : "0 32px 32px 0",
            borderColor: `transparent #0b0b12 transparent transparent`,
            filter: "drop-shadow(-2px 2px 2px rgba(0,0,0,0.4))",
          }}
        />
      </span>
      <span className="text-[13px] font-medium text-white/85">Ribbon fold</span>
    </Root>
  );
}

/* 8 — Ring Progress: conic progress fills around a dot */
function RingProgress() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Ring progress">
      <span
        className="grid size-8 place-items-center rounded-full transition-[background] duration-500"
        style={{
          background: on
            ? `conic-gradient(from 0deg, ${SUNSET.from}, ${SUNSET.via}, ${SUNSET.to}, ${SUNSET.from})`
            : `conic-gradient(from 0deg, rgba(255,255,255,0.15) 0deg, rgba(255,255,255,0.05) 0deg)`,
        }}
      >
        <span className="grid size-6 place-items-center rounded-full bg-[#0b0b12]">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={on ? SUNSET.to : "transparent"} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4 4 10-10" /></svg>
        </span>
      </span>
      <span className="text-[13px] font-medium text-white/85">Ring progress</span>
    </Root>
  );
}

/* 9 — Sticker Peel: hover-lift with adhesive shadow */
function StickerPeel() {
  const [on, set] = useState(true);
  return (
    <Root checked={on} onChange={set} ariaLabel="Sticker peel" className="group">
      <span
        className="grid size-9 place-items-center rounded-2xl text-white transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 group-hover:rotate-[-3deg]"
        style={{
          background: on
            ? `linear-gradient(140deg, ${AURORA.from}, ${AURORA.via}, ${AURORA.to})`
            : "linear-gradient(140deg, #26262c, #14141a)",
          boxShadow: on
            ? `0 10px 20px -8px ${AURORA.via}aa, inset 0 1px 0 rgba(255,255,255,0.3)`
            : "0 6px 14px -8px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={on ? "#1e1b4b" : "transparent"} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4 4 10-10" /></svg>
      </span>
      <span className="text-[13px] font-medium text-white/85">Sticker peel</span>
    </Root>
  );
}

/* 10 — Heart Beat: heart-shaped, pulses on check */
function HeartBeat() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Heart beat">
      <span className="grid size-8 place-items-center">
        <svg width="26" height="26" viewBox="0 0 24 24" style={{ animation: on ? "nova-cb-beat 700ms ease" : "none" }}>
          <defs>
            <linearGradient id="cb-heart" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor={SUNSET.from} />
              <stop offset="55%" stopColor={SUNSET.via} />
              <stop offset="100%" stopColor={SUNSET.to} />
            </linearGradient>
          </defs>
          <path
            d="M12 21s-7-4.5-9.5-9C.8 8.4 3 4 7 4c2 0 3.5 1.2 5 3 1.5-1.8 3-3 5-3 4 0 6.2 4.4 4.5 8-2.5 4.5-9.5 9-9.5 9z"
            fill={on ? "url(#cb-heart)" : "transparent"}
            stroke={on ? "transparent" : "rgba(255,255,255,0.35)"}
            strokeWidth="1.6"
            style={{ transition: "fill 300ms, stroke 300ms" }}
          />
        </svg>
      </span>
      <span className="text-[13px] font-medium text-white/85">Heart beat</span>
      <style>{`@keyframes nova-cb-beat { 0%{ transform:scale(1) } 30%{ transform:scale(1.25) } 60%{ transform:scale(0.95) } 100%{ transform:scale(1) } }`}</style>
    </Root>
  );
}

/* 11 — Star Bloom: 5-point star scales & sparkles */
function StarBloom() {
  const [on, set] = useState(true);
  return (
    <Root checked={on} onChange={set} ariaLabel="Star bloom">
      <span className="relative grid size-8 place-items-center">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          style={{ transition: "transform 400ms cubic-bezier(0.22,1,0.36,1)", transform: on ? "scale(1) rotate(0deg)" : "scale(0.85) rotate(-14deg)" }}
        >
          <defs>
            <linearGradient id="cb-star" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor={NEBULA.from} />
              <stop offset="50%" stopColor={NEBULA.via} />
              <stop offset="100%" stopColor={NEBULA.to} />
            </linearGradient>
          </defs>
          <path
            d="M12 2l2.9 6 6.6.6-5 4.6 1.5 6.5L12 16.9 5.9 19.7 7.5 13.2 2.5 8.6 9.1 8z"
            fill={on ? "url(#cb-star)" : "transparent"}
            stroke={on ? "transparent" : "rgba(255,255,255,0.35)"}
            strokeWidth="1.5"
            style={{ transition: "fill 300ms, stroke 300ms", filter: on ? `drop-shadow(0 4px 10px ${NEBULA.via}aa)` : "none" }}
          />
        </svg>
      </span>
      <span className="text-[13px] font-medium text-white/85">Star bloom</span>
    </Root>
  );
}

/* 12 — Slide Track: rectangular chip slides fill from left */
function SlideTrack() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Slide track">
      <span className="relative h-6 w-14 overflow-hidden rounded-md border border-white/12 bg-white/[0.03]">
        <span
          className="absolute inset-y-0 left-0 transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            width: on ? "100%" : "0%",
            background: `linear-gradient(90deg, ${COSMIC.from}, ${COSMIC.via}, ${COSMIC.to})`,
          }}
        />
        <span
          className="absolute inset-0 grid place-items-center text-[10px] font-semibold uppercase tracking-widest transition-colors duration-300"
          style={{ color: on ? "#fff" : "rgba(255,255,255,0.55)" }}
        >
          {on ? "On" : "Off"}
        </span>
      </span>
      <span className="text-[13px] font-medium text-white/85">Slide track</span>
    </Root>
  );
}

/* 13 — Origami Fold: two triangles fold to form a square with check */
function OrigamiFold() {
  const [on, set] = useState(true);
  return (
    <Root checked={on} onChange={set} ariaLabel="Origami fold">
      <span className="relative grid h-8 w-8 place-items-center" style={{ perspective: "500px" }}>
        <span
          className="absolute left-0 top-0 h-full w-full origin-left transition-transform duration-500"
          style={{
            background: `linear-gradient(45deg, ${LAGOON.from}, ${LAGOON.via})`,
            clipPath: "polygon(0 0, 100% 0, 0 100%)",
            transform: on ? "rotateY(0deg)" : "rotateY(-180deg)",
          }}
        />
        <span
          className="absolute right-0 bottom-0 h-full w-full origin-right transition-transform duration-500"
          style={{
            background: `linear-gradient(225deg, ${LAGOON.via}, ${LAGOON.to})`,
            clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
            transform: on ? "rotateY(0deg)" : "rotateY(180deg)",
          }}
        />
        <svg className="relative z-10" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={on ? "#062020" : "transparent"} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4 4 10-10" /></svg>
      </span>
      <span className="text-[13px] font-medium text-white/85">Origami fold</span>
    </Root>
  );
}

/* 14 — Glass Prism: frosted panel with rainbow refraction */
function GlassPrism() {
  const [on, set] = useState(true);
  return (
    <Root checked={on} onChange={set} ariaLabel="Glass prism">
      <span
        className="relative grid size-9 place-items-center overflow-hidden rounded-xl border border-white/20 backdrop-blur-xl"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02))",
          boxShadow: on ? `inset 0 0 20px ${AURORA.via}55, 0 8px 20px -8px ${AURORA.from}80` : "inset 0 1px 0 rgba(255,255,255,0.1)",
        }}
      >
        <span
          aria-hidden
          className="absolute -inset-2 opacity-70 transition-transform duration-700"
          style={{
            background: `conic-gradient(from 200deg, ${AURORA.from}, ${AURORA.via}, ${AURORA.to}, ${AURORA.from})`,
            filter: "blur(14px)",
            transform: on ? "rotate(0deg)" : "rotate(-120deg)",
            opacity: on ? 0.55 : 0,
          }}
        />
        <svg className="relative z-10" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: on ? 1 : 0, transition: "opacity 300ms" }}><path d="M5 12l4 4 10-10" /></svg>
      </span>
      <span className="text-[13px] font-medium text-white/85">Glass prism</span>
    </Root>
  );
}

/* 15 — Terminal Tick: monospaced [x] with caret blink */
function TerminalTick() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Terminal tick">
      <span className="inline-flex h-8 items-center gap-1 rounded-md border border-emerald-400/20 bg-black/60 px-2 font-mono text-[13px] text-emerald-300 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.15)]">
        <span className="opacity-60">[</span>
        <span className="relative w-3 text-center">
          <span style={{ opacity: on ? 1 : 0, transition: "opacity 200ms" }}>x</span>
          <span
            className="absolute inset-y-0 right-[-2px] w-[2px] bg-emerald-300"
            style={{ animation: on ? "none" : "nova-cb-caret 900ms steps(2) infinite" }}
          />
        </span>
        <span className="opacity-60">]</span>
      </span>
      <span className="text-[13px] font-medium text-white/85">Terminal tick</span>
      <style>{`@keyframes nova-cb-caret { 0%,50%{opacity:1} 50.01%,100%{opacity:0} }`}</style>
    </Root>
  );
}

/* 16 — Radar Scan: sweeping radial line on activation */
function RadarScan() {
  const [on, set] = useState(true);
  return (
    <Root checked={on} onChange={set} ariaLabel="Radar scan">
      <span className="relative grid size-9 place-items-center overflow-hidden rounded-full border border-white/12 bg-[#050a10]">
        <span
          className="absolute inset-0 origin-center"
          style={{
            background: `conic-gradient(from 0deg, ${LAGOON.from}00 0deg, ${LAGOON.from}88 30deg, transparent 60deg)`,
            animation: on ? "nova-cb-radar 1.6s linear infinite" : "none",
            opacity: on ? 1 : 0.15,
          }}
        />
        <span className="absolute inset-1 rounded-full border border-cyan-300/20" />
        <span className="absolute inset-2 rounded-full border border-cyan-300/15" />
        <svg className="relative z-10" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={on ? LAGOON.to : "transparent"} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4 4 10-10" /></svg>
      </span>
      <span className="text-[13px] font-medium text-white/85">Radar scan</span>
      <style>{`@keyframes nova-cb-radar { to { transform: rotate(360deg) } }`}</style>
    </Root>
  );
}

/* 17 — Ink Splash: mask-based ink blob grows from center */
function InkSplash() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Ink splash">
      <span className="relative grid size-8 place-items-center overflow-hidden rounded-lg border border-white/15 bg-white/[0.04]">
        <span
          className="absolute inset-1/2 rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            width: on ? "160%" : "0%",
            height: on ? "160%" : "0%",
            transform: "translate(-50%,-50%)",
            background: `radial-gradient(circle, ${SUNSET.to}, ${SUNSET.via}, ${SUNSET.from})`,
            filter: "blur(0.3px)",
          }}
        />
        <svg className="relative z-10" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: on ? 1 : 0, transition: "opacity 250ms 200ms" }}><path d="M5 12l4 4 10-10" /></svg>
      </span>
      <span className="text-[13px] font-medium text-white/85">Ink splash</span>
    </Root>
  );
}

/* 18 — Magnet Snap: check icon flies in from top-left, snaps into slot */
function MagnetSnap() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Magnet snap">
      <span className="relative grid size-8 place-items-center overflow-hidden rounded-lg border border-white/15" style={{ background: on ? `linear-gradient(135deg, ${COSMIC.from}, ${COSMIC.to})` : "rgba(255,255,255,0.03)" }}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            opacity: on ? 1 : 0,
            transform: on ? "translate(0,0) rotate(0deg)" : "translate(-14px,-14px) rotate(-45deg)",
            transition: "transform 400ms cubic-bezier(0.34,1.56,0.64,1), opacity 200ms",
          }}
        >
          <path d="M5 12l4 4 10-10" />
        </svg>
      </span>
      <span className="text-[13px] font-medium text-white/85">Magnet snap</span>
    </Root>
  );
}

/* 19 — Gradient Border: animated conic border sweeping around a card */
function GradientBorder() {
  const [on, set] = useState(true);
  return (
    <Root checked={on} onChange={set} ariaLabel="Gradient border">
      <span className="relative grid size-9 place-items-center rounded-xl p-[1.5px]" style={{
        background: on
          ? `conic-gradient(from var(--a,0deg), ${NEBULA.from}, ${NEBULA.via}, ${NEBULA.to}, ${NEBULA.from})`
          : "rgba(255,255,255,0.12)",
        animation: on ? "nova-cb-spin 3s linear infinite" : "none",
      } as React.CSSProperties}>
        <span className="grid size-full place-items-center rounded-[10px] bg-[#0b0b12]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={on ? NEBULA.to : "transparent"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4 4 10-10" /></svg>
        </span>
      </span>
      <span className="text-[13px] font-medium text-white/85">Gradient border</span>
      <style>{`@property --a { syntax:'<angle>'; inherits:false; initial-value:0deg } @keyframes nova-cb-spin { to { --a: 360deg } }`}</style>
    </Root>
  );
}

/* 20 — Domino Row: three tiny bars flip in sequence to spell a tick */
function DominoRow() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Domino row">
      <span className="inline-flex h-8 items-center gap-1" style={{ perspective: "500px" }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block h-6 w-2 rounded-sm transition-transform duration-500"
            style={{
              background: on
                ? `linear-gradient(180deg, ${SUNSET.from}, ${SUNSET.via}, ${SUNSET.to})`
                : "rgba(255,255,255,0.12)",
              transform: on ? `rotateX(360deg) translateY(${i === 1 ? "-2px" : "0"})` : "rotateX(0deg)",
              transitionDelay: `${i * 90}ms`,
              boxShadow: on ? `0 4px 10px -4px ${SUNSET.via}` : "none",
            }}
          />
        ))}
      </span>
      <span className="text-[13px] font-medium text-white/85">Domino row</span>
    </Root>
  );
}

/* =====================================================================
 * BATCH 2 — 20 additional 3D premium checkboxes (structure & motion vary)
 * ===================================================================== */

/* 21 — Bounce Ball: a marble drops into a cup and settles */
function BounceBall() {
  const [on, set] = useState(true);
  return (
    <Root checked={on} onChange={set} ariaLabel="Bounce ball">
      <span className="relative grid h-9 w-9 place-items-end justify-center overflow-hidden rounded-b-full border border-white/12 bg-gradient-to-b from-white/5 to-black/40">
        <span
          className="mb-1 block size-4 rounded-full transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          style={{
            background: `radial-gradient(circle at 30% 25%, #fff8, ${NEBULA.from} 45%, ${NEBULA.to})`,
            transform: on ? "translateY(0)" : "translateY(-28px)",
            boxShadow: on ? `0 4px 8px -2px ${NEBULA.via}aa` : "0 8px 12px -4px #000",
          }}
        />
      </span>
      <span className="text-[13px] font-medium text-white/85">Bounce ball</span>
    </Root>
  );
}

/* 22 — Card Flip 3D: full-card horizontal flip revealing check */
function CardFlip3D() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Card flip">
      <span className="relative h-9 w-14" style={{ perspective: "700px" }}>
        <span
          className="absolute inset-0 transition-transform duration-600"
          style={{
            transformStyle: "preserve-3d",
            transform: on ? "rotateY(180deg)" : "rotateY(0deg)",
            transitionDuration: "600ms",
          }}
        >
          <span className="absolute inset-0 grid place-items-center rounded-md border border-white/15 bg-white/[0.04] text-[10px] font-mono text-white/50" style={{ backfaceVisibility: "hidden" }}>OFF</span>
          <span
            className="absolute inset-0 grid place-items-center rounded-md text-[10px] font-mono font-bold text-white"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              background: `linear-gradient(135deg, ${LAGOON.from}, ${LAGOON.via}, ${LAGOON.to})`,
              boxShadow: `0 8px 20px -8px ${LAGOON.via}aa`,
            }}
          >ON</span>
        </span>
      </span>
      <span className="text-[13px] font-medium text-white/85">Card flip 3D</span>
    </Root>
  );
}

/* 23 — Pulse Wave: concentric wave rings expand outward */
function PulseWave() {
  const [on, set] = useState(true);
  return (
    <Root checked={on} onChange={set} ariaLabel="Pulse wave">
      <span className="relative grid size-9 place-items-center">
        {on && [0, 1, 2].map((i) => (
          <span
            key={i}
            className="absolute inset-0 rounded-full border"
            style={{
              borderColor: `${AURORA.via}80`,
              animation: `nova-cb-pulse 1.6s ease-out ${i * 0.5}s infinite`,
            }}
          />
        ))}
        <span
          className="grid size-5 place-items-center rounded-full transition-all duration-300"
          style={{
            background: on
              ? `radial-gradient(circle, ${AURORA.from}, ${AURORA.to})`
              : "rgba(255,255,255,0.08)",
            boxShadow: on ? `0 0 12px ${AURORA.via}` : "none",
          }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: on ? 1 : 0 }}><path d="M5 12l4 4 10-10" /></svg>
        </span>
      </span>
      <span className="text-[13px] font-medium text-white/85">Pulse wave</span>
      <style>{`@keyframes nova-cb-pulse { 0%{transform:scale(0.6);opacity:0.9} 100%{transform:scale(1.5);opacity:0} }`}</style>
    </Root>
  );
}

/* 24 — Emoji Morph: neutral face morphs to a happy face */
function EmojiMorph() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Emoji morph">
      <span
        className="grid size-9 place-items-center rounded-full text-lg transition-all duration-500"
        style={{
          background: on
            ? `linear-gradient(135deg, ${SUNSET.from}, ${SUNSET.via})`
            : "rgba(255,255,255,0.06)",
          transform: on ? "scale(1.05) rotate(6deg)" : "scale(1) rotate(0)",
          boxShadow: on ? `0 8px 20px -8px ${SUNSET.via}aa` : "inset 0 0 0 1px rgba(255,255,255,0.1)",
        }}
      >
        {on ? "😄" : "😐"}
      </span>
      <span className="text-[13px] font-medium text-white/85">Emoji morph</span>
    </Root>
  );
}

/* 25 — Zip Line: diagonal ribbon zips across an empty slot */
function ZipLine() {
  const [on, set] = useState(true);
  return (
    <Root checked={on} onChange={set} ariaLabel="Zip line">
      <span className="relative h-8 w-14 overflow-hidden rounded-md border border-white/12 bg-black/40">
        <span
          className="absolute top-1/2 h-1 w-full origin-left transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            transform: on ? "translateY(-50%) scaleX(1)" : "translateY(-50%) scaleX(0)",
            background: `linear-gradient(90deg, ${COSMIC.from}, ${COSMIC.via}, ${COSMIC.to})`,
            boxShadow: on ? `0 0 12px ${COSMIC.via}` : "none",
          }}
        />
        <span
          className="absolute top-1/2 size-3 -translate-y-1/2 rounded-full bg-white transition-[left] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ left: on ? "calc(100% - 14px)" : "2px", boxShadow: `0 0 10px ${COSMIC.via}` }}
        />
      </span>
      <span className="text-[13px] font-medium text-white/85">Zip line</span>
    </Root>
  );
}

/* 26 — Lego Stack: two blocks stack with tactile snap */
function LegoStack() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Lego stack">
      <span className="relative grid h-9 w-9 place-items-end justify-center pb-0.5" style={{ perspective: "400px" }}>
        <span
          className="absolute bottom-0 h-3 w-7 rounded-sm"
          style={{ background: `linear-gradient(180deg, ${NEBULA.via}, ${NEBULA.from})`, boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.3)" }}
        />
        <span
          className="absolute bottom-3 h-3 w-7 rounded-sm transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          style={{
            background: `linear-gradient(180deg, ${SUNSET.via}, ${SUNSET.from})`,
            boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.3)",
            transform: on ? "translateY(0) rotateX(0)" : "translateY(-14px) rotateX(-30deg)",
            opacity: on ? 1 : 0.4,
          }}
        />
      </span>
      <span className="text-[13px] font-medium text-white/85">Lego stack</span>
    </Root>
  );
}

/* 27 — Padlock: shackle swings up when unlocked */
function Padlock() {
  const [on, set] = useState(true);
  return (
    <Root checked={on} onChange={set} ariaLabel="Padlock">
      <span className="relative grid h-9 w-8 place-items-end justify-center">
        <span
          className="absolute top-0 h-4 w-5 origin-bottom-right rounded-t-full border-[2px] border-b-0 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          style={{
            borderColor: on ? LAGOON.via : "rgba(255,255,255,0.5)",
            transform: on ? "translateX(4px) rotate(-30deg)" : "rotate(0deg)",
          }}
        />
        <span
          className="mb-0 grid h-5 w-7 place-items-center rounded-md"
          style={{
            background: on
              ? `linear-gradient(180deg, ${LAGOON.from}, ${LAGOON.to})`
              : "linear-gradient(180deg, #3b3b45, #1a1a20)",
            boxShadow: on ? `0 6px 14px -6px ${LAGOON.via}aa` : "inset 0 0 0 1px rgba(255,255,255,0.1)",
          }}
        >
          <span className="size-1.5 rounded-full bg-white/70" />
        </span>
      </span>
      <span className="text-[13px] font-medium text-white/85">Padlock</span>
    </Root>
  );
}

/* 28 — Battery Fill: horizontal battery charges in segments */
function BatteryFill() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Battery fill">
      <span className="relative inline-flex h-6 items-center">
        <span className="flex h-6 w-12 items-center gap-0.5 rounded-md border border-white/25 bg-black/40 p-0.5">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="h-full flex-1 rounded-[2px] transition-all duration-300"
              style={{
                background: on
                  ? `linear-gradient(180deg, ${LAGOON.from}, ${LAGOON.via})`
                  : "rgba(255,255,255,0.06)",
                transitionDelay: `${i * 90}ms`,
                boxShadow: on ? `0 0 6px ${LAGOON.via}88` : "none",
              }}
            />
          ))}
        </span>
        <span className="h-3 w-0.5 rounded-r-sm bg-white/40" />
      </span>
      <span className="text-[13px] font-medium text-white/85">Battery fill</span>
    </Root>
  );
}

/* 29 — Notify Bell: bell rings and dot appears */
function NotifyBell() {
  const [on, set] = useState(true);
  return (
    <Root checked={on} onChange={set} ariaLabel="Notify bell">
      <span className="relative grid size-9 place-items-center">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill={on ? "url(#cb-bell)" : "transparent"}
          stroke={on ? "transparent" : "rgba(255,255,255,0.5)"}
          strokeWidth="1.6"
          style={{ transformOrigin: "top center", animation: on ? "nova-cb-ring 700ms ease" : "none" }}
        >
          <defs>
            <linearGradient id="cb-bell" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor={SUNSET.from} />
              <stop offset="60%" stopColor={SUNSET.via} />
              <stop offset="100%" stopColor={SUNSET.to} />
            </linearGradient>
          </defs>
          <path d="M12 2a6 6 0 0 0-6 6v4l-2 3h16l-2-3V8a6 6 0 0 0-6-6zM10 19a2 2 0 0 0 4 0" />
        </svg>
        <span
          className="absolute right-1 top-1 size-2 rounded-full transition-transform duration-300"
          style={{ background: SUNSET.to, transform: on ? "scale(1)" : "scale(0)", boxShadow: `0 0 6px ${SUNSET.to}` }}
        />
      </span>
      <span className="text-[13px] font-medium text-white/85">Notify bell</span>
      <style>{`@keyframes nova-cb-ring { 0%,100%{transform:rotate(0)} 20%{transform:rotate(15deg)} 40%{transform:rotate(-12deg)} 60%{transform:rotate(8deg)} 80%{transform:rotate(-4deg)} }`}</style>
    </Root>
  );
}

/* 30 — Diamond Cut: rotating diamond with facet shine */
function DiamondCut() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Diamond cut">
      <span
        className="grid size-9 place-items-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ transform: on ? "rotate(45deg) scale(1)" : "rotate(0deg) scale(0.9)" }}
      >
        <span
          className="grid size-6 place-items-center rounded-sm"
          style={{
            background: on
              ? `linear-gradient(135deg, ${AURORA.from}, ${AURORA.via} 40%, ${AURORA.to})`
              : "rgba(255,255,255,0.06)",
            boxShadow: on
              ? `inset -2px -2px 4px rgba(0,0,0,0.3), inset 2px 2px 4px rgba(255,255,255,0.4), 0 8px 20px -8px ${AURORA.via}aa`
              : "inset 0 0 0 1px rgba(255,255,255,0.1)",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" style={{ transform: "rotate(-45deg)", opacity: on ? 1 : 0 }}><path d="M5 12l4 4 10-10" /></svg>
        </span>
      </span>
      <span className="text-[13px] font-medium text-white/85">Diamond cut</span>
    </Root>
  );
}

/* 31 — Scan Line: retro CRT scanline sweeps top to bottom */
function ScanLine() {
  const [on, set] = useState(true);
  return (
    <Root checked={on} onChange={set} ariaLabel="Scan line">
      <span className="relative grid h-8 w-8 place-items-center overflow-hidden rounded-md border border-white/12 bg-[#02110a]">
        <span
          className="absolute inset-x-0 h-1"
          style={{
            background: `linear-gradient(180deg, transparent, ${LAGOON.to}, transparent)`,
            animation: on ? "nova-cb-scan 1.4s linear infinite" : "none",
            opacity: on ? 1 : 0,
          }}
        />
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={on ? LAGOON.to : "rgba(255,255,255,0.25)"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ filter: on ? `drop-shadow(0 0 4px ${LAGOON.to})` : "none" }}><path d="M5 12l4 4 10-10" /></svg>
      </span>
      <span className="text-[13px] font-medium text-white/85">Scan line</span>
      <style>{`@keyframes nova-cb-scan { 0%{top:-10%} 100%{top:110%} }`}</style>
    </Root>
  );
}

/* 32 — Sun & Moon: rotating disc swaps day/night */
function SunMoon() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Sun and moon">
      <span
        className="relative grid size-9 place-items-center overflow-hidden rounded-full transition-colors duration-500"
        style={{
          background: on
            ? `linear-gradient(160deg, ${SUNSET.from}, ${SUNSET.via})`
            : "linear-gradient(160deg, #0b1024, #1a1440)",
          boxShadow: on ? `0 6px 16px -6px ${SUNSET.via}aa` : `inset 0 0 12px #0006`,
        }}
      >
        <span
          className="absolute left-1/2 top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          style={{
            background: on ? "#fff8dc" : "#e5e7eb",
            transform: on ? "translate(-50%,-50%)" : "translate(30%,-70%)",
            boxShadow: on ? "0 0 12px #fff8dcaa" : "inset -4px -2px 0 #0b1024",
          }}
        />
      </span>
      <span className="text-[13px] font-medium text-white/85">Sun · Moon</span>
    </Root>
  );
}

/* 33 — Vote Stamp: rubber-stamp slams down with rotation */
function VoteStamp() {
  const [on, set] = useState(true);
  return (
    <Root checked={on} onChange={set} ariaLabel="Vote stamp">
      <span className="relative grid size-10 place-items-center">
        <span
          className="grid size-9 place-items-center rounded-md border-2 font-display text-[10px] font-black uppercase tracking-widest transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          style={{
            borderColor: on ? "#e11d48" : "rgba(255,255,255,0.15)",
            color: on ? "#e11d48" : "transparent",
            background: on ? "rgba(225,29,72,0.08)" : "transparent",
            transform: on ? "rotate(-8deg) scale(1)" : "rotate(-30deg) scale(1.6)",
            opacity: on ? 1 : 0.2,
          }}
        >
          OK
        </span>
      </span>
      <span className="text-[13px] font-medium text-white/85">Vote stamp</span>
    </Root>
  );
}

/* 34 — Loading Ring: spinner completes into a check */
function LoadingRing() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Loading ring">
      <span className="relative grid size-8 place-items-center">
        <svg width="28" height="28" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="12" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2.5" />
          <circle
            cx="16"
            cy="16"
            r="12"
            fill="none"
            stroke={COSMIC.to}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="75.4"
            strokeDashoffset={on ? 0 : 60}
            style={{ transition: "stroke-dashoffset 500ms cubic-bezier(0.22,1,0.36,1)", transform: "rotate(-90deg)", transformOrigin: "16px 16px", filter: on ? `drop-shadow(0 0 4px ${COSMIC.via})` : "none" }}
          />
          <path
            d="M11 16l4 4 7-8"
            fill="none"
            stroke={COSMIC.to}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ strokeDasharray: 20, strokeDashoffset: on ? 0 : 20, transition: "stroke-dashoffset 400ms 300ms" }}
          />
        </svg>
      </span>
      <span className="text-[13px] font-medium text-white/85">Loading ring</span>
    </Root>
  );
}

/* 35 — Shutter Iris: camera iris opens to expose a hue */
function ShutterIris() {
  const [on, set] = useState(true);
  return (
    <Root checked={on} onChange={set} ariaLabel="Shutter iris">
      <span className="relative grid size-9 place-items-center overflow-hidden rounded-full border border-white/12" style={{ background: `radial-gradient(circle, ${NEBULA.to}, ${NEBULA.from})` }}>
        {[0, 60, 120, 180, 240, 300].map((deg, i) => (
          <span
            key={i}
            className="absolute inset-0 origin-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              background: "#0a0a0a",
              clipPath: "polygon(50% 50%, 100% 0, 100% 100%)",
              transform: on ? `rotate(${deg}deg) scale(0.1)` : `rotate(${deg}deg) scale(1)`,
              transitionDelay: `${i * 30}ms`,
            }}
          />
        ))}
      </span>
      <span className="text-[13px] font-medium text-white/85">Shutter iris</span>
    </Root>
  );
}

/* 36 — Slot Machine: numbers roll to land on a check */
function SlotRoll() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Slot roll">
      <span className="relative grid h-8 w-8 place-items-center overflow-hidden rounded-md border border-white/15 bg-black/60 font-mono text-white">
        <span
          className="flex flex-col text-lg leading-8 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: on ? "translateY(-96px)" : "translateY(0)" }}
        >
          <span className="h-8 text-white/40">0</span>
          <span className="h-8 text-white/40">1</span>
          <span className="h-8 text-white/40">2</span>
          <span className="h-8 grid place-items-center" style={{ color: LAGOON.to }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4 4 10-10" /></svg>
          </span>
        </span>
      </span>
      <span className="text-[13px] font-medium text-white/85">Slot roll</span>
    </Root>
  );
}

/* 37 — Paint Brush: hand-drawn stroke sweeps across a tile */
function PaintBrush() {
  const [on, set] = useState(true);
  return (
    <Root checked={on} onChange={set} ariaLabel="Paint brush">
      <span className="relative grid h-8 w-8 place-items-center overflow-hidden rounded-md border border-white/15 bg-white/[0.03]">
        <svg width="32" height="32" viewBox="0 0 32 32" className="absolute inset-0">
          <path
            d="M2 22 C8 6, 22 26, 30 10"
            stroke={`url(#cb-brush)`}
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
            style={{ strokeDasharray: 60, strokeDashoffset: on ? 0 : 60, transition: "stroke-dashoffset 600ms cubic-bezier(0.22,1,0.36,1)" }}
          />
          <defs>
            <linearGradient id="cb-brush" x1="0" x2="1">
              <stop offset="0%" stopColor={SUNSET.from} />
              <stop offset="50%" stopColor={SUNSET.via} />
              <stop offset="100%" stopColor={SUNSET.to} />
            </linearGradient>
          </defs>
        </svg>
        <svg className="relative z-10" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: on ? 1 : 0, transition: "opacity 200ms 400ms" }}><path d="M5 12l4 4 10-10" /></svg>
      </span>
      <span className="text-[13px] font-medium text-white/85">Paint brush</span>
    </Root>
  );
}

/* 38 — Portal Warp: check appears through a swirling portal */
function PortalWarp() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Portal warp">
      <span className="relative grid size-9 place-items-center overflow-hidden rounded-full border border-white/15 bg-black">
        <span
          className="absolute inset-[-30%] transition-transform duration-700"
          style={{
            background: `conic-gradient(from 0deg, ${COSMIC.from}, ${NEBULA.via}, ${AURORA.to}, ${COSMIC.from})`,
            filter: "blur(6px)",
            transform: on ? "rotate(360deg) scale(1)" : "rotate(0deg) scale(0.2)",
            opacity: on ? 0.9 : 0.2,
          }}
        />
        <span className="absolute inset-1.5 rounded-full bg-black/60 backdrop-blur-sm" />
        <svg className="relative z-10" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: on ? 1 : 0, transform: on ? "scale(1)" : "scale(0.4)", transition: "all 400ms 200ms" }}><path d="M5 12l4 4 10-10" /></svg>
      </span>
      <span className="text-[13px] font-medium text-white/85">Portal warp</span>
    </Root>
  );
}

/* 39 — Barcode Scan: barcode bars scale in sequence */
function BarcodeScan() {
  const [on, set] = useState(true);
  const widths = [2, 1, 3, 1, 2, 4, 1, 2, 3, 1];
  return (
    <Root checked={on} onChange={set} ariaLabel="Barcode scan">
      <span className="relative flex h-8 items-end gap-0.5 rounded-sm bg-white/[0.03] px-1 py-1">
        {widths.map((w, i) => (
          <span
            key={i}
            className="block rounded-sm transition-all duration-300"
            style={{
              width: `${w}px`,
              height: on ? "100%" : "20%",
              background: on ? "#fff" : "rgba(255,255,255,0.3)",
              transitionDelay: `${i * 40}ms`,
              boxShadow: on ? "0 0 4px #fff8" : "none",
            }}
          />
        ))}
      </span>
      <span className="text-[13px] font-medium text-white/85">Barcode scan</span>
    </Root>
  );
}

/* 40 — Squircle Morph: rounded-square morphs into a circle with tick */
function SquircleMorph() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Squircle morph">
      <span
        className="grid size-8 place-items-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        style={{
          borderRadius: on ? "50%" : "10px",
          background: on
            ? `linear-gradient(135deg, ${LAGOON.from}, ${LAGOON.via}, ${LAGOON.to})`
            : "rgba(255,255,255,0.06)",
          boxShadow: on
            ? `0 10px 22px -8px ${LAGOON.via}aa, inset 0 1px 0 rgba(255,255,255,0.3)`
            : "inset 0 0 0 1px rgba(255,255,255,0.1)",
          transform: on ? "rotate(360deg)" : "rotate(0deg)",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={on ? "#052e2b" : "transparent"} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4 4 10-10" /></svg>
      </span>
      <span className="text-[13px] font-medium text-white/85">Squircle morph</span>
    </Root>
  );
}

/* ================= Batch 3 — 30 additional premium checkboxes ================= */

/* 41 — Coin Flip: metallic coin flips on Y axis to reveal check */
function CoinFlip() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Coin flip">
      <span className="relative grid h-8 w-8 place-items-center" style={{ perspective: 500 }}>
        <span
          className="relative h-8 w-8 rounded-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transformStyle: "preserve-3d", transform: on ? "rotateY(180deg)" : "rotateY(0deg)" }}
        >
          <span
            className="absolute inset-0 grid place-items-center rounded-full text-white/40"
            style={{ background: "linear-gradient(145deg,#3a3a44,#111116)", boxShadow: "inset 0 -3px 6px rgba(0,0,0,.6),inset 0 2px 3px rgba(255,255,255,.15)", backfaceVisibility: "hidden" }}
          >?</span>
          <span
            className="absolute inset-0 grid place-items-center rounded-full text-[#3f2b00]"
            style={{ background: `linear-gradient(145deg,${SUNSET.from},${SUNSET.via})`, boxShadow: "inset 0 -3px 6px rgba(120,60,0,.6),inset 0 2px 3px rgba(255,240,180,.6)", backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4 4 10-10" /></svg>
          </span>
        </span>
      </span>
      <span className="text-[13px] font-medium text-white/85">Coin flip</span>
    </Root>
  );
}

/* 42 — Rocket Launch: rocket lifts with exhaust trail */
function RocketLaunch() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Rocket launch">
      <span className="relative grid h-8 w-8 place-items-center overflow-hidden rounded-lg border border-white/15 bg-gradient-to-b from-[#0b1024] to-[#050914]">
        <span
          aria-hidden
          className="absolute left-1/2 bottom-0 w-[3px] -translate-x-1/2 rounded-full transition-[height,opacity] duration-500"
          style={{ height: on ? 22 : 0, opacity: on ? 0.9 : 0, background: `linear-gradient(180deg,${SUNSET.via},transparent)`, filter: "blur(1.5px)" }}
        />
        <span
          className="relative text-base transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: on ? "translateY(-14px)" : "translateY(4px)" }}
        >🚀</span>
        <span
          aria-hidden
          className="absolute inset-x-0 top-1 flex justify-around px-1 text-[6px] text-white/40 transition-opacity duration-500"
          style={{ opacity: on ? 1 : 0.15 }}
        >
          <span>·</span><span>✦</span><span>·</span>
        </span>
      </span>
      <span className="text-[13px] font-medium text-white/85">Rocket launch</span>
    </Root>
  );
}

/* 43 — Wax Seal: stamps down with imprint */
function WaxSeal() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Wax seal">
      <span className="relative grid h-8 w-8 place-items-center">
        <span
          className="grid h-8 w-8 place-items-center rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            background: on ? `radial-gradient(circle at 35% 30%, ${SUNSET.via}, ${SUNSET.from} 60%, #6b1a0e)` : "radial-gradient(circle at 35% 30%,#3a3a44,#151519 70%)",
            boxShadow: on ? "inset 0 -2px 4px rgba(0,0,0,.6),0 4px 10px -3px rgba(244,63,94,.6)" : "inset 0 -2px 4px rgba(0,0,0,.6)",
            transform: on ? "scale(1)" : "scale(0.85)",
          }}
        >
          <span
            className="text-[10px] font-black text-[#3b0a08] transition-opacity duration-300"
            style={{ opacity: on ? 1 : 0, textShadow: "0 1px 0 rgba(255,180,150,.4)" }}
          >★</span>
        </span>
      </span>
      <span className="text-[13px] font-medium text-white/85">Wax seal</span>
    </Root>
  );
}

/* 44 — Piano Key: key depresses with sound wave */
function PianoKey() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Piano key">
      <span className="relative grid h-8 w-8 place-items-end">
        <span
          className="h-full w-5 rounded-b-md rounded-t-sm border border-white/20 transition-all duration-200"
          style={{
            background: on ? `linear-gradient(180deg,${LAGOON.via},${LAGOON.from})` : "linear-gradient(180deg,#f6f6f8,#c9c9d0)",
            transform: on ? "rotateX(14deg) translateY(1px)" : "rotateX(0deg)",
            transformOrigin: "top",
            boxShadow: on ? `inset 0 -2px 3px rgba(0,0,0,.3),0 0 12px ${LAGOON.via}55` : "inset 0 -3px 3px rgba(0,0,0,.15)",
          }}
        />
        {[6, 10, 14].map((r, i) => (
          <span
            key={i}
            aria-hidden
            className="absolute left-1/2 top-1/2 rounded-full border transition-all duration-500"
            style={{
              width: r * 2, height: r * 2, marginLeft: -r, marginTop: -r,
              borderColor: LAGOON.via,
              opacity: on ? 0 : 0,
              animation: on ? `nova-cb-ping 900ms ease-out ${i * 120}ms 1` : "none",
            }}
          />
        ))}
      </span>
      <span className="text-[13px] font-medium text-white/85">Piano key</span>
    </Root>
  );
}

/* 45 — Coffee Fill: cup fills with steam on complete */
function CoffeeFill() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Coffee fill">
      <span className="relative grid h-8 w-8 place-items-end justify-center">
        <span aria-hidden className="absolute -top-1 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full text-[8px] transition-opacity duration-500" style={{ opacity: on ? 1 : 0 }}>
          <span className="absolute inset-0 flex justify-around text-white/50">〰〰</span>
        </span>
        <span className="relative h-6 w-6 overflow-hidden rounded-b-2xl rounded-t-sm border-2 border-white/70 bg-white/[0.04]">
          <span
            className="absolute inset-x-0 bottom-0 transition-[height] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ height: on ? "85%" : "0%", background: "linear-gradient(180deg,#6b3410,#3a1a08)" }}
          />
          <span
            className="absolute inset-x-1 top-[15%] h-[3px] rounded-full transition-opacity duration-500"
            style={{ opacity: on ? 0.7 : 0, background: "linear-gradient(90deg,#c9905a,#f2c48b,#c9905a)" }}
          />
        </span>
        <span className="absolute right-0 top-2 h-2 w-1.5 rounded-r-md border-2 border-l-0 border-white/70" />
      </span>
      <span className="text-[13px] font-medium text-white/85">Coffee fill</span>
    </Root>
  );
}

/* 46 — Hourglass Flip: rotates 180° with sand redistributing */
function HourglassFlip() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Hourglass flip">
      <span className="relative grid h-8 w-8 place-items-center">
        <span
          className="relative h-7 w-6 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: on ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <span aria-hidden className="absolute inset-x-0 top-0 h-[2px] rounded-full bg-white/70" />
          <span aria-hidden className="absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-white/70" />
          <span
            aria-hidden
            className="absolute left-1/2 top-[2px] h-3 w-4 -translate-x-1/2 origin-bottom"
            style={{ background: SUNSET.via, clipPath: "polygon(0 0,100% 0,50% 100%)", opacity: 0.9 }}
          />
          <span
            aria-hidden
            className="absolute left-1/2 bottom-[2px] h-3 w-4 -translate-x-1/2 origin-top"
            style={{ background: SUNSET.from, clipPath: "polygon(50% 0,100% 100%,0 100%)", opacity: 0.7 }}
          />
        </span>
      </span>
      <span className="text-[13px] font-medium text-white/85">Hourglass</span>
    </Root>
  );
}

/* 47 — Trap Door: two panels split apart to reveal check */
function TrapDoor() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Trap door">
      <span className="relative grid h-8 w-8 place-items-center overflow-hidden rounded-lg border border-white/15 bg-[#0b0b12]">
        <span
          aria-hidden
          className="absolute inset-0 grid place-items-center"
          style={{ background: `radial-gradient(circle,${COSMIC.via}55,transparent 70%)` }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={COSMIC.ink} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4 4 10-10" /></svg>
        </span>
        <span
          className="absolute inset-y-0 left-0 w-1/2 origin-left transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.3,1)]"
          style={{ background: "linear-gradient(90deg,#2a2a34,#151519)", transform: on ? "rotateY(-95deg)" : "rotateY(0deg)" }}
        />
        <span
          className="absolute inset-y-0 right-0 w-1/2 origin-right transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.3,1)]"
          style={{ background: "linear-gradient(-90deg,#2a2a34,#151519)", transform: on ? "rotateY(95deg)" : "rotateY(0deg)" }}
        />
      </span>
      <span className="text-[13px] font-medium text-white/85">Trap door</span>
    </Root>
  );
}

/* 48 — Zipper Up: chevrons zip closed */
function ZipperUp() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Zipper up">
      <span className="relative grid h-8 w-8 place-items-center overflow-hidden rounded-lg border border-white/15 bg-[#0b0b12]">
        <span className="flex flex-col gap-[1px]">
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className="flex gap-[3px]">
              <span
                className="h-1 w-2 rounded-sm transition-transform duration-500"
                style={{
                  background: on ? NEBULA.via : "#3a3a44",
                  transform: on ? "translateX(0)" : `translateX(-${6 + i * 2}px)`,
                  transitionDelay: `${i * 40}ms`,
                }}
              />
              <span
                className="h-1 w-2 rounded-sm transition-transform duration-500"
                style={{
                  background: on ? NEBULA.from : "#3a3a44",
                  transform: on ? "translateX(0)" : `translateX(${6 + i * 2}px)`,
                  transitionDelay: `${i * 40}ms`,
                }}
              />
            </span>
          ))}
        </span>
      </span>
      <span className="text-[13px] font-medium text-white/85">Zipper up</span>
    </Root>
  );
}

/* 49 — Puzzle Snap: piece slides in from right with satisfying snap */
function PuzzleSnap() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Puzzle snap">
      <span className="relative grid h-8 w-8 place-items-center overflow-hidden rounded-lg border border-dashed border-white/25 bg-white/[0.02]">
        <span
          className="h-6 w-6 transition-all duration-500 ease-[cubic-bezier(0.5,1.6,0.4,1)]"
          style={{
            background: on ? `linear-gradient(135deg,${LAGOON.from},${LAGOON.via})` : "transparent",
            clipPath: "polygon(0 20%,60% 20%,60% 0,100% 0,100% 40%,80% 40%,80% 80%,100% 80%,100% 100%,20% 100%,20% 60%,0 60%)",
            transform: on ? "translateX(0) scale(1)" : "translateX(14px) scale(0.6)",
            opacity: on ? 1 : 0,
            boxShadow: on ? `0 0 14px ${LAGOON.via}66` : "none",
          }}
        />
      </span>
      <span className="text-[13px] font-medium text-white/85">Puzzle snap</span>
    </Root>
  );
}

/* 50 — Gear Mesh: two gears rotate together */
function GearMesh() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Gear mesh">
      <span className="relative grid h-8 w-8 place-items-center">
        <span
          className="text-lg transition-all duration-500"
          style={{ color: on ? SUNSET.via : "#5a5a66", transform: on ? "rotate(90deg)" : "rotate(0deg)", filter: on ? `drop-shadow(0 0 6px ${SUNSET.via}88)` : "none" }}
        >⚙</span>
        <span
          className="absolute right-0 top-0 text-xs transition-all duration-500"
          style={{ color: on ? SUNSET.from : "#5a5a66", transform: on ? "rotate(-90deg)" : "rotate(0deg)" }}
        >⚙</span>
      </span>
      <span className="text-[13px] font-medium text-white/85">Gear mesh</span>
    </Root>
  );
}

/* 51 — Traffic Light: cycles amber then green */
function TrafficLight() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Traffic light">
      <span className="relative grid h-8 w-4 place-items-center rounded-md border border-white/20 bg-[#0b0b12] py-1">
        <span className="flex flex-col gap-[2px]">
          <span
            className="h-2 w-2 rounded-full transition-all duration-300"
            style={{ background: on ? "#3a1a1a" : "#ef4444", boxShadow: on ? "none" : "0 0 6px #ef4444", transitionDelay: on ? "0ms" : "300ms" }}
          />
          <span
            className="h-2 w-2 rounded-full transition-all duration-300"
            style={{ background: on ? "#3a2f10" : "#3a2f10", opacity: on ? 0.6 : 0.3 }}
          />
          <span
            className="h-2 w-2 rounded-full transition-all duration-300"
            style={{ background: on ? "#22c55e" : "#0f2a17", boxShadow: on ? "0 0 8px #22c55e" : "none", transitionDelay: on ? "300ms" : "0ms" }}
          />
        </span>
      </span>
      <span className="text-[13px] font-medium text-white/85">Traffic light</span>
    </Root>
  );
}

/* 52 — Fingerprint Scan: scan bar sweeps then unlocks */
function FingerprintScan() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Fingerprint scan">
      <span className="relative grid h-8 w-8 place-items-center overflow-hidden rounded-lg border border-white/15 bg-[#0a0f1a]">
        <span className="text-lg transition-colors duration-500" style={{ color: on ? "#22d3ee" : "#3a3a44" }}>◉</span>
        <span
          aria-hidden
          className="absolute inset-x-0 h-[2px] transition-all duration-700 ease-linear"
          style={{
            top: on ? "100%" : "0%",
            background: "linear-gradient(90deg,transparent,#22d3ee,transparent)",
            boxShadow: "0 0 8px #22d3ee",
            opacity: on ? 1 : 0,
          }}
        />
        <span
          aria-hidden
          className="absolute inset-0 rounded-lg transition-opacity duration-500"
          style={{ boxShadow: on ? "inset 0 0 10px #22d3ee88" : "none", opacity: on ? 1 : 0, transitionDelay: on ? "600ms" : "0ms" }}
        />
      </span>
      <span className="text-[13px] font-medium text-white/85">Fingerprint</span>
    </Root>
  );
}

/* 53 — Crystal Grow: hexagon scales in with facet shine */
function CrystalGrow() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Crystal grow">
      <span className="relative grid h-8 w-8 place-items-center">
        <span
          className="h-7 w-7 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          style={{
            background: on ? `linear-gradient(135deg,${AURORA.from},${AURORA.via} 50%,${AURORA.to})` : "#1a1a22",
            clipPath: "polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%)",
            transform: on ? "scale(1) rotate(0deg)" : "scale(0.3) rotate(-90deg)",
            filter: on ? `drop-shadow(0 0 8px ${AURORA.via})` : "none",
          }}
        />
        <span
          aria-hidden
          className="absolute h-3 w-[1.5px] rotate-45 rounded-full bg-white/80 transition-opacity duration-300"
          style={{ opacity: on ? 0.9 : 0, transitionDelay: on ? "400ms" : "0ms" }}
        />
      </span>
      <span className="text-[13px] font-medium text-white/85">Crystal grow</span>
    </Root>
  );
}

/* 54 — Flame Ignite: candle flame flickers on */
function FlameIgnite() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Flame ignite">
      <span className="relative grid h-8 w-8 place-items-end justify-center">
        <span
          aria-hidden
          className="absolute left-1/2 top-0 h-4 w-3 -translate-x-1/2 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          style={{
            background: `radial-gradient(ellipse at 50% 80%,${SUNSET.via} 20%,${SUNSET.from} 55%,transparent 75%)`,
            clipPath: "polygon(50% 0,90% 55%,75% 100%,25% 100%,10% 55%)",
            transform: on ? "scaleY(1) scaleX(1)" : "scaleY(0) scaleX(0.4)",
            transformOrigin: "bottom",
            filter: on ? `drop-shadow(0 0 6px ${SUNSET.via})` : "none",
          }}
        />
        <span className="h-4 w-1.5 rounded-b-sm bg-gradient-to-b from-[#f1e0b5] to-[#7d6438]" />
      </span>
      <span className="text-[13px] font-medium text-white/85">Flame ignite</span>
    </Root>
  );
}

/* 55 — Water Splash: droplet drops then splashes */
function WaterSplash() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Water splash">
      <span className="relative grid h-8 w-8 place-items-center overflow-hidden">
        <span
          aria-hidden
          className="absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full transition-all duration-500 ease-in"
          style={{ background: `linear-gradient(180deg,${LAGOON.from},${LAGOON.via})`, top: on ? "60%" : "0%", opacity: on ? 0 : 1 }}
        />
        {[0, 1, 2, 3, 4].map((i) => {
          const angle = (i / 5) * Math.PI - Math.PI / 2;
          const dx = Math.cos(angle) * 12;
          const dy = Math.sin(angle) * 8 + 4;
          return (
            <span
              key={i}
              aria-hidden
              className="absolute left-1/2 top-1/2 h-1 w-1 rounded-full transition-all duration-500 ease-out"
              style={{
                background: LAGOON.via,
                transform: on ? `translate(${dx}px,${dy}px)` : "translate(0,0)",
                opacity: on ? 0 : 0,
                transitionDelay: on ? "300ms" : "0ms",
              }}
            />
          );
        })}
        <span
          className="absolute inset-x-0 bottom-0 h-1 origin-center rounded-full transition-transform duration-500"
          style={{ background: `linear-gradient(90deg,transparent,${LAGOON.via},transparent)`, transform: on ? "scaleX(1)" : "scaleX(0)", transitionDelay: on ? "300ms" : "0ms" }}
        />
      </span>
      <span className="text-[13px] font-medium text-white/85">Water splash</span>
    </Root>
  );
}

/* 56 — Compass Spin: needle rotates to north */
function CompassSpin() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Compass spin">
      <span className="relative grid h-8 w-8 place-items-center rounded-full border-2 border-white/25 bg-[#0b0b12]">
        <span
          className="h-5 w-[2px] rounded-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            background: `linear-gradient(180deg,${SUNSET.from} 50%,#e5e7eb 50%)`,
            transform: on ? "rotate(0deg)" : "rotate(210deg)",
          }}
        />
        <span className="absolute left-1/2 top-1 -translate-x-1/2 text-[6px] font-bold text-white/60">N</span>
      </span>
      <span className="text-[13px] font-medium text-white/85">Compass</span>
    </Root>
  );
}

/* 57 — Dice Roll: dice tumbles to check face */
function DiceRoll() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Dice roll">
      <span className="relative grid h-8 w-8 place-items-center" style={{ perspective: 400 }}>
        <span
          className="grid h-7 w-7 place-items-center rounded-md border border-white/15 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            background: on ? `linear-gradient(135deg,${NEBULA.via},${NEBULA.from})` : "linear-gradient(135deg,#f5f5f7,#c5c5cc)",
            transform: on ? "rotateX(0deg) rotateY(0deg)" : "rotateX(-420deg) rotateY(360deg)",
            boxShadow: on ? `0 6px 14px -4px ${NEBULA.via}88` : "0 4px 8px rgba(0,0,0,.4)",
          }}
        >
          {on ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4 4 10-10" /></svg>
          ) : (
            <span className="grid grid-cols-3 gap-[2px] p-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="h-[3px] w-[3px] rounded-full bg-[#1a1a22]" style={{ visibility: [0, 2, 4, 6, 8].includes(i) ? "visible" : "hidden" }} />
              ))}
            </span>
          )}
        </span>
      </span>
      <span className="text-[13px] font-medium text-white/85">Dice roll</span>
    </Root>
  );
}

/* 58 — Vinyl Spin: record spins to reveal center check */
function VinylSpin() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Vinyl spin">
      <span className="relative grid h-8 w-8 place-items-center">
        <span
          className="grid h-8 w-8 place-items-center rounded-full transition-transform duration-1000 ease-linear"
          style={{
            background: "repeating-radial-gradient(circle,#0a0a0f 0 2px,#1a1a1f 2px 3px)",
            transform: on ? "rotate(720deg)" : "rotate(0deg)",
            boxShadow: on ? `0 0 12px ${AURORA.via}66` : "inset 0 0 6px rgba(0,0,0,.6)",
          }}
        >
          <span
            className="grid h-3 w-3 place-items-center rounded-full transition-colors duration-500"
            style={{ background: on ? AURORA.via : "#3a3a44" }}
          >
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: on ? 1 : 0, transition: "opacity 300ms" }}><path d="M5 12l4 4 10-10" /></svg>
          </span>
        </span>
      </span>
      <span className="text-[13px] font-medium text-white/85">Vinyl spin</span>
    </Root>
  );
}

/* 59 — Camera Aperture: blades open like a shutter */
function CameraAperture() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Camera aperture">
      <span className="relative grid h-8 w-8 place-items-center rounded-full border border-white/20 bg-[#050505]">
        {[0, 60, 120, 180, 240, 300].map((deg, i) => (
          <span
            key={i}
            aria-hidden
            className="absolute h-3 w-3 origin-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              background: `linear-gradient(135deg,${COSMIC.from},${COSMIC.via})`,
              clipPath: "polygon(0 0,100% 0,50% 100%)",
              transform: on ? `rotate(${deg}deg) translateY(-6px) scale(0.3)` : `rotate(${deg}deg) translateY(-1px) scale(1)`,
              transitionDelay: `${i * 30}ms`,
              opacity: on ? 0.4 : 0.95,
            }}
          />
        ))}
        <span
          className="relative h-2 w-2 rounded-full transition-all duration-300"
          style={{ background: on ? COSMIC.ink : "transparent", boxShadow: on ? `0 0 8px ${COSMIC.via}` : "none", transitionDelay: on ? "250ms" : "0ms" }}
        />
      </span>
      <span className="text-[13px] font-medium text-white/85">Aperture</span>
    </Root>
  );
}

/* 60 — Elevator Rise: cabin travels up shaft */
function ElevatorRise() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Elevator rise">
      <span className="relative grid h-8 w-6 place-items-center overflow-hidden rounded-md border border-white/15 bg-[#0b0b12]">
        <span aria-hidden className="absolute left-1/2 top-0 h-full w-[1px] -translate-x-1/2 bg-white/10" />
        <span
          className="absolute inset-x-1 grid h-3 place-items-center rounded-sm transition-[bottom] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            bottom: on ? "70%" : "5%",
            background: `linear-gradient(180deg,${LAGOON.via},${LAGOON.from})`,
            boxShadow: `0 2px 6px -1px ${LAGOON.via}77`,
          }}
        >
          <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: on ? 1 : 0, transition: "opacity 300ms 400ms" }}><path d="M5 12l4 4 10-10" /></svg>
        </span>
      </span>
      <span className="text-[13px] font-medium text-white/85">Elevator</span>
    </Root>
  );
}

/* 61 — Bubble Rise: three bubbles float up */
function BubbleRise() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Bubble rise">
      <span className="relative grid h-8 w-8 place-items-center overflow-hidden rounded-lg border border-white/15 bg-gradient-to-b from-[#0a1a2a] to-[#050914]">
        {[
          { x: 4, size: 4, delay: 0 },
          { x: 14, size: 6, delay: 120 },
          { x: 22, size: 3, delay: 60 },
        ].map((b, i) => (
          <span
            key={i}
            aria-hidden
            className="absolute rounded-full border transition-all duration-700 ease-out"
            style={{
              left: b.x, width: b.size, height: b.size,
              borderColor: `${LAGOON.via}88`, background: `${LAGOON.from}33`,
              bottom: on ? 30 : -4,
              opacity: on ? 0 : 0.9,
              transitionDelay: `${b.delay}ms`,
            }}
          />
        ))}
        <span
          className="absolute inset-x-0 top-1 text-center text-[10px] transition-opacity duration-300"
          style={{ color: LAGOON.via, opacity: on ? 1 : 0, transitionDelay: on ? "500ms" : "0ms" }}
        >✓</span>
      </span>
      <span className="text-[13px] font-medium text-white/85">Bubble rise</span>
    </Root>
  );
}

/* 62 — Umbrella Open: canopy unfolds from stick */
function UmbrellaOpen() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Umbrella open">
      <span className="relative grid h-8 w-8 place-items-end justify-center">
        <span
          className="absolute left-1/2 top-1 h-4 w-6 -translate-x-1/2 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          style={{
            background: `conic-gradient(from 180deg at 50% 100%,${SUNSET.from},${SUNSET.via},${NEBULA.from},${SUNSET.from})`,
            clipPath: "polygon(0 100%,50% 0,100% 100%,85% 90%,70% 100%,50% 90%,30% 100%,15% 90%)",
            transform: on ? "scale(1)" : "scale(0.2)",
            transformOrigin: "bottom",
            filter: on ? "drop-shadow(0 2px 4px rgba(0,0,0,.4))" : "none",
          }}
        />
        <span className="absolute left-1/2 top-2 h-5 w-[2px] -translate-x-1/2 rounded-full bg-white/70" />
        <span className="absolute left-1/2 top-7 h-1 w-2 -translate-x-[80%] rounded-full border-2 border-t-0 border-l-0 border-white/70" />
      </span>
      <span className="text-[13px] font-medium text-white/85">Umbrella</span>
    </Root>
  );
}

/* 63 — Curtain Reveal: two velvet drapes part */
function CurtainReveal() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Curtain reveal">
      <span className="relative grid h-8 w-8 place-items-center overflow-hidden rounded-lg border border-white/15 bg-black">
        <span
          className="absolute inset-0 grid place-items-center"
          style={{ background: `radial-gradient(circle,${SUNSET.via},transparent 70%)` }}
        >
          <span
            className="text-lg font-black transition-transform duration-500"
            style={{ color: SUNSET.ink, transform: on ? "scale(1)" : "scale(0)", transitionDelay: on ? "300ms" : "0ms" }}
          >★</span>
        </span>
        <span
          className="absolute inset-y-0 left-0 w-1/2 transition-transform duration-700 ease-[cubic-bezier(0.7,0,0.3,1)]"
          style={{ background: "repeating-linear-gradient(90deg,#7a1010,#a01a1a 3px,#7a1010 6px)", transform: on ? "translateX(-100%)" : "translateX(0)" }}
        />
        <span
          className="absolute inset-y-0 right-0 w-1/2 transition-transform duration-700 ease-[cubic-bezier(0.7,0,0.3,1)]"
          style={{ background: "repeating-linear-gradient(90deg,#a01a1a,#7a1010 3px,#a01a1a 6px)", transform: on ? "translateX(100%)" : "translateX(0)" }}
        />
      </span>
      <span className="text-[13px] font-medium text-white/85">Curtain</span>
    </Root>
  );
}

/* 64 — Fireworks: burst pattern of colored sparks */
function Fireworks() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Fireworks">
      <span className="relative grid h-8 w-8 place-items-center overflow-visible">
        <span
          className="grid h-6 w-6 place-items-center rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            background: on ? `radial-gradient(circle,${NEBULA.via},${NEBULA.from})` : "#1a1a22",
            transform: on ? "scale(1)" : "scale(0.6)",
            boxShadow: on ? `0 0 14px ${NEBULA.via}` : "none",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: on ? 1 : 0, transition: "opacity 200ms 200ms" }}><path d="M5 12l4 4 10-10" /></svg>
        </span>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
          <span
            key={i}
            aria-hidden
            className="absolute left-1/2 top-1/2 h-[2px] w-2 origin-left rounded-full transition-all duration-500 ease-out"
            style={{
              background: i % 2 ? SUNSET.via : LAGOON.via,
              transform: on ? `rotate(${deg}deg) translateX(10px)` : `rotate(${deg}deg) translateX(0)`,
              opacity: on ? 0 : 1,
              transitionDelay: on ? "150ms" : "0ms",
            }}
          />
        ))}
      </span>
      <span className="text-[13px] font-medium text-white/85">Fireworks</span>
    </Root>
  );
}

/* 65 — Rubber Band: elastic snaps in with overshoot */
function RubberBand() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Rubber band">
      <span className="relative grid h-8 w-8 place-items-center">
        <span
          className="grid h-7 w-7 place-items-center rounded-lg border-2 transition-all"
          style={{
            borderColor: on ? LAGOON.via : "#3a3a44",
            background: on ? `linear-gradient(135deg,${LAGOON.from}44,${LAGOON.via}44)` : "transparent",
            transform: on ? "scale(1)" : "scale(0.4)",
            transitionDuration: "600ms",
            transitionTimingFunction: "cubic-bezier(0.34,2.1,0.64,1)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={LAGOON.ink} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: on ? 1 : 0, transition: "opacity 300ms 200ms" }}><path d="M5 12l4 4 10-10" /></svg>
        </span>
      </span>
      <span className="text-[13px] font-medium text-white/85">Rubber band</span>
    </Root>
  );
}

/* 66 — Snowflake Bloom: crystallizes with 6-fold symmetry */
function SnowflakeBloom() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Snowflake bloom">
      <span className="relative grid h-8 w-8 place-items-center">
        {[0, 60, 120].map((deg) => (
          <span
            key={deg}
            aria-hidden
            className="absolute h-6 w-[1.5px] origin-center rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            style={{
              background: `linear-gradient(180deg,transparent,${AURORA.via},transparent)`,
              transform: `rotate(${deg}deg) scaleY(${on ? 1 : 0})`,
              boxShadow: on ? `0 0 4px ${AURORA.via}` : "none",
            }}
          />
        ))}
        <span
          className="relative h-1.5 w-1.5 rounded-full transition-transform duration-300"
          style={{ background: AURORA.ink, transform: on ? "scale(1)" : "scale(0)", transitionDelay: on ? "300ms" : "0ms", boxShadow: on ? `0 0 6px ${AURORA.via}` : "none" }}
        />
      </span>
      <span className="text-[13px] font-medium text-white/85">Snowflake</span>
    </Root>
  );
}

/* 67 — Anchor Drop: anchor plunges then chain settles */
function AnchorDrop() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Anchor drop">
      <span className="relative grid h-8 w-8 place-items-start justify-center overflow-hidden">
        <span
          aria-hidden
          className="absolute left-1/2 top-0 w-[1.5px] -translate-x-1/2 rounded-full transition-[height] duration-500 ease-out"
          style={{ height: on ? "70%" : "10%", background: "repeating-linear-gradient(180deg,#a3a3ac 0 3px,transparent 3px 5px)" }}
        />
        <span
          className="absolute left-1/2 -translate-x-1/2 text-base transition-all duration-500 ease-in"
          style={{ top: on ? "62%" : "-8%", color: on ? LAGOON.via : "#e5e7eb", filter: on ? `drop-shadow(0 0 6px ${LAGOON.via}88)` : "none" }}
        >⚓</span>
      </span>
      <span className="text-[13px] font-medium text-white/85">Anchor drop</span>
    </Root>
  );
}

/* 68 — Chess Knight: L-shaped jump onto the square */
function ChessKnight() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Chess knight">
      <span className="relative grid h-8 w-8 place-items-center overflow-hidden rounded-md border border-white/15 bg-[repeating-conic-gradient(#0f0f14_0_25%,#1a1a22_0_50%)] bg-[length:16px_16px]">
        <span
          className="relative text-base transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          style={{
            color: on ? "#f5f5f7" : "#5a5a66",
            transform: on ? "translate(0,0) rotate(0deg)" : "translate(-10px,10px) rotate(-20deg)",
            filter: on ? "drop-shadow(0 3px 4px rgba(0,0,0,.6))" : "none",
          }}
        >♞</span>
      </span>
      <span className="text-[13px] font-medium text-white/85">Chess knight</span>
    </Root>
  );
}

/* 69 — Loading Bar: bar fills then check pops */
function LoadingBar() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Loading bar">
      <span className="relative grid h-8 w-8 place-items-center">
        <span className="relative h-2.5 w-8 overflow-hidden rounded-full border border-white/20 bg-white/[0.04]">
          <span
            className="absolute inset-y-0 left-0 transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ width: on ? "100%" : "0%", background: `linear-gradient(90deg,${COSMIC.from},${COSMIC.via},${COSMIC.to})`, boxShadow: on ? `0 0 8px ${COSMIC.via}88` : "none" }}
          />
        </span>
        <span
          className="absolute right-0 top-0 grid h-3.5 w-3.5 place-items-center rounded-full transition-transform duration-300"
          style={{ background: COSMIC.via, transform: on ? "scale(1)" : "scale(0)", transitionDelay: on ? "500ms" : "0ms" }}
        >
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4 4 10-10" /></svg>
        </span>
      </span>
      <span className="text-[13px] font-medium text-white/85">Loading bar</span>
    </Root>
  );
}

/* 70 — Envelope Seal: flap closes and stamp appears */
function EnvelopeSeal() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Envelope seal">
      <span className="relative grid h-8 w-8 place-items-center" style={{ perspective: 400 }}>
        <span className="relative h-6 w-8 rounded-sm border border-white/25 bg-gradient-to-b from-[#1a1a22] to-[#0b0b12]">
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-3 origin-top transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              background: "linear-gradient(180deg,#25252d,#151519)",
              clipPath: "polygon(0 0,100% 0,50% 100%)",
              transform: on ? "rotateX(0deg)" : "rotateX(180deg)",
              borderBottom: "1px solid rgba(255,255,255,.1)",
            }}
          />
          <span
            className="absolute -right-1 -top-1 grid h-3 w-3 place-items-center rounded-full text-[7px] transition-all duration-300"
            style={{ background: SUNSET.via, color: SUNSET.ink, transform: on ? "scale(1) rotate(-12deg)" : "scale(0)", transitionDelay: on ? "400ms" : "0ms", boxShadow: `0 2px 4px -1px ${SUNSET.via}88` }}
          >✓</span>
        </span>
      </span>
      <span className="text-[13px] font-medium text-white/85">Envelope</span>
    </Root>
  );
}

/* ---------- Export ---------- */





const ITEMS: { id: string; name: string; Comp: () => ReactNode }[] = [
  { id: "cube-flip",       name: "Cube Flip",       Comp: CubeFlip },
  { id: "liquid-fill",     name: "Liquid Fill",     Comp: LiquidFill },
  { id: "neon-draw",       name: "Neon Draw",       Comp: NeonDraw },
  { id: "press-dome",      name: "Press Dome",      Comp: PressDome },
  { id: "toggle-card",     name: "Toggle Card",     Comp: ToggleCard },
  { id: "confetti-pop",    name: "Confetti Pop",    Comp: ConfettiPop },
  { id: "ribbon-fold",     name: "Ribbon Fold",     Comp: RibbonFold },
  { id: "ring-progress",   name: "Ring Progress",   Comp: RingProgress },
  { id: "sticker-peel",    name: "Sticker Peel",    Comp: StickerPeel },
  { id: "heart-beat",      name: "Heart Beat",      Comp: HeartBeat },
  { id: "star-bloom",      name: "Star Bloom",      Comp: StarBloom },
  { id: "slide-track",     name: "Slide Track",     Comp: SlideTrack },
  { id: "origami-fold",    name: "Origami Fold",    Comp: OrigamiFold },
  { id: "glass-prism",     name: "Glass Prism",     Comp: GlassPrism },
  { id: "terminal-tick",   name: "Terminal Tick",   Comp: TerminalTick },
  { id: "radar-scan",      name: "Radar Scan",      Comp: RadarScan },
  { id: "ink-splash",      name: "Ink Splash",      Comp: InkSplash },
  { id: "magnet-snap",     name: "Magnet Snap",     Comp: MagnetSnap },
  { id: "gradient-border", name: "Gradient Border", Comp: GradientBorder },
  { id: "domino-row",      name: "Domino Row",      Comp: DominoRow },
  { id: "bounce-ball",     name: "Bounce Ball",     Comp: BounceBall },
  { id: "card-flip-3d",    name: "Card Flip 3D",    Comp: CardFlip3D },
  { id: "pulse-wave",      name: "Pulse Wave",      Comp: PulseWave },
  { id: "emoji-morph",     name: "Emoji Morph",     Comp: EmojiMorph },
  { id: "zip-line",        name: "Zip Line",        Comp: ZipLine },
  { id: "lego-stack",      name: "Lego Stack",      Comp: LegoStack },
  { id: "padlock",         name: "Padlock",         Comp: Padlock },
  { id: "battery-fill",    name: "Battery Fill",    Comp: BatteryFill },
  { id: "notify-bell",     name: "Notify Bell",     Comp: NotifyBell },
  { id: "diamond-cut",     name: "Diamond Cut",     Comp: DiamondCut },
  { id: "scan-line",       name: "Scan Line",       Comp: ScanLine },
  { id: "sun-moon",        name: "Sun · Moon",      Comp: SunMoon },
  { id: "vote-stamp",      name: "Vote Stamp",      Comp: VoteStamp },
  { id: "loading-ring",    name: "Loading Ring",    Comp: LoadingRing },
  { id: "shutter-iris",    name: "Shutter Iris",    Comp: ShutterIris },
  { id: "slot-roll",       name: "Slot Roll",       Comp: SlotRoll },
  { id: "paint-brush",     name: "Paint Brush",     Comp: PaintBrush },
  { id: "portal-warp",     name: "Portal Warp",     Comp: PortalWarp },
  { id: "barcode-scan",    name: "Barcode Scan",    Comp: BarcodeScan },
  { id: "squircle-morph",  name: "Squircle Morph",  Comp: SquircleMorph },
  { id: "coin-flip",       name: "Coin Flip",       Comp: CoinFlip },
  { id: "rocket-launch",   name: "Rocket Launch",   Comp: RocketLaunch },
  { id: "wax-seal",        name: "Wax Seal",        Comp: WaxSeal },
  { id: "piano-key",       name: "Piano Key",       Comp: PianoKey },
  { id: "coffee-fill",     name: "Coffee Fill",     Comp: CoffeeFill },
  { id: "hourglass-flip",  name: "Hourglass",       Comp: HourglassFlip },
  { id: "trap-door",       name: "Trap Door",       Comp: TrapDoor },
  { id: "zipper-up",       name: "Zipper Up",       Comp: ZipperUp },
  { id: "puzzle-snap",     name: "Puzzle Snap",     Comp: PuzzleSnap },
  { id: "gear-mesh",       name: "Gear Mesh",       Comp: GearMesh },
  { id: "traffic-light",   name: "Traffic Light",   Comp: TrafficLight },
  { id: "fingerprint",     name: "Fingerprint",     Comp: FingerprintScan },
  { id: "crystal-grow",    name: "Crystal Grow",    Comp: CrystalGrow },
  { id: "flame-ignite",    name: "Flame Ignite",    Comp: FlameIgnite },
  { id: "water-splash",    name: "Water Splash",    Comp: WaterSplash },
  { id: "compass-spin",    name: "Compass",         Comp: CompassSpin },
  { id: "dice-roll",       name: "Dice Roll",       Comp: DiceRoll },
  { id: "vinyl-spin",      name: "Vinyl Spin",      Comp: VinylSpin },
  { id: "camera-aperture", name: "Aperture",        Comp: CameraAperture },
  { id: "elevator-rise",   name: "Elevator",        Comp: ElevatorRise },
  { id: "bubble-rise",     name: "Bubble Rise",     Comp: BubbleRise },
  { id: "umbrella-open",   name: "Umbrella",        Comp: UmbrellaOpen },
  { id: "curtain-reveal",  name: "Curtain",         Comp: CurtainReveal },
  { id: "fireworks",       name: "Fireworks",       Comp: Fireworks },
  { id: "rubber-band",     name: "Rubber Band",     Comp: RubberBand },
  { id: "snowflake-bloom", name: "Snowflake",       Comp: SnowflakeBloom },
  { id: "anchor-drop",     name: "Anchor Drop",     Comp: AnchorDrop },
  { id: "chess-knight",    name: "Chess Knight",    Comp: ChessKnight },
  { id: "loading-bar",     name: "Loading Bar",     Comp: LoadingBar },
  { id: "envelope-seal",   name: "Envelope",        Comp: EnvelopeSeal },
];

export const CHECKBOXES: CheckboxItem[] = ITEMS.map(({ id, name, Comp }) => ({
  id,
  name,
  render: () => <Comp />,
  code: `// ${name} — Novix UI premium checkbox\n// A controlled <input type="checkbox"> visually driven by a 3D animated surface.\n// See source: src/data/checkboxes.tsx (component: ${Comp.name})`,
}));

// (helpers useEffect/useRef are used above in Root)
