import { useEffect, useId, useRef, useState, type ReactNode, type CSSProperties } from "react";

export type ToggleItem = {
  id: string;
  name: string;
  render: () => ReactNode;
  code: string;
};

/* Palettes — 3-stop mixes so no toggle feels mono-hued */
type Hue = { from: string; via: string; to: string; ink: string };
const NEBULA: Hue = { from: "#7c3aed", via: "#c026d3", to: "#ec4899", ink: "#fdf4ff" };
const LAGOON: Hue = { from: "#06b6d4", via: "#14b8a6", to: "#a3e635", ink: "#ecfeff" };
const SUNSET: Hue = { from: "#f97316", via: "#f43f5e", to: "#d946ef", ink: "#fff7ed" };
const COSMIC: Hue = { from: "#3b82f6", via: "#6366f1", to: "#a855f7", ink: "#eff6ff" };
const AURORA: Hue = { from: "#22d3ee", via: "#a78bfa", to: "#f472b6", ink: "#f5f3ff" };
const EMBER:  Hue = { from: "#f59e0b", via: "#ef4444", to: "#b91c1c", ink: "#fff1f2" };
const MINT:   Hue = { from: "#10b981", via: "#22d3ee", to: "#0ea5e9", ink: "#ecfdf5" };

/* -------- Root: shared controlled toggle + hover preview -------- */
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
  style?: CSSProperties;
  ariaLabel?: string;
}) {
  const id = useId();
  const ref = useRef<HTMLLabelElement>(null);
  const originalRef = useRef(checked);
  const hoveringRef = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const host = (el.closest("[data-tg-hover-host]") as HTMLElement | null) ?? el;
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
      ref={ref}
      htmlFor={id}
      className={`relative inline-flex cursor-pointer select-none items-center gap-3 ${className}`}
      style={style}
      role="switch"
      aria-checked={checked}
    >
      <input
        id={id}
        type="checkbox"
        aria-label={ariaLabel}
        checked={checked}
        onChange={(e) => {
          originalRef.current = e.target.checked;
          onChange(e.target.checked);
        }}
        className="peer sr-only"
      />
      {children}
    </label>
  );
}

const grad = (h: Hue) => `linear-gradient(135deg, ${h.from}, ${h.via}, ${h.to})`;

/* ============================================================
   50 UNIQUE PREMIUM TOGGLES
   Each variant owns its own state, palette, structure & motion.
   ============================================================ */

/* 1 — Aurora Pill: classic slide with animated gradient track */
function AuroraPill() {
  const [on, set] = useState(true);
  return (
    <Root checked={on} onChange={set} ariaLabel="Aurora">
      <span
        aria-hidden
        className="relative h-8 w-16 rounded-full transition-colors duration-500"
        style={{
          background: on ? grad(AURORA) : "linear-gradient(135deg,#1a1a1c,#0a0a0b)",
          boxShadow: on
            ? "inset 0 1px 0 rgba(255,255,255,.25), 0 8px 24px -12px rgba(167,139,250,.7)"
            : "inset 0 1px 0 rgba(255,255,255,.06), 0 4px 14px -6px rgba(0,0,0,.6)",
        }}
      >
        <span
          className="absolute top-1 left-1 grid h-6 w-6 place-items-center rounded-full bg-white shadow-[0_4px_10px_rgba(0,0,0,.35)] transition-transform duration-500 ease-[cubic-bezier(.22,1.2,.36,1)]"
          style={{ transform: on ? "translateX(32px)" : "translateX(0)" }}
        />
      </span>
    </Root>
  );
}

/* 2 — Sun · Moon: rotating sky disc */
function SunMoon() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Sun moon">
      <span
        aria-hidden
        className="relative h-9 w-[74px] overflow-hidden rounded-full transition-colors duration-700"
        style={{
          background: on
            ? "linear-gradient(180deg,#050916,#0b1428)"
            : "linear-gradient(180deg,#87c8ff,#3b82f6)",
        }}
      >
        {/* stars */}
        <span className="absolute inset-0 opacity-0 transition-opacity duration-700" style={{ opacity: on ? 1 : 0 }}>
          <span className="absolute left-2 top-2 h-0.5 w-0.5 rounded-full bg-white" />
          <span className="absolute left-5 top-5 h-0.5 w-0.5 rounded-full bg-white/80" />
          <span className="absolute left-8 top-1.5 h-[3px] w-[3px] rounded-full bg-white" />
        </span>
        <span
          className="absolute top-1 left-1 h-7 w-7 rounded-full transition-transform duration-700 ease-[cubic-bezier(.22,1.2,.36,1)]"
          style={{
            transform: on ? "translateX(38px) rotate(180deg)" : "translateX(0) rotate(0deg)",
            background: on
              ? "radial-gradient(circle at 30% 30%,#f8fafc,#cbd5e1)"
              : "radial-gradient(circle at 30% 30%,#fff7c2,#f59e0b)",
            boxShadow: on
              ? "inset -4px -2px 0 #94a3b8, 0 0 12px rgba(226,232,240,.5)"
              : "0 0 12px rgba(245,158,11,.7)",
          }}
        />
      </span>
    </Root>
  );
}

/* 3 — Cube Flip 3D: cube face rotates ON/OFF */
function CubeFlip3D() {
  const [on, set] = useState(true);
  return (
    <Root checked={on} onChange={set} ariaLabel="Cube flip">
      <span aria-hidden className="relative h-10 w-10" style={{ perspective: "700px" }}>
        <span
          className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(.22,1.2,.36,1)]"
          style={{ transformStyle: "preserve-3d", transform: on ? "rotateY(180deg)" : "rotateY(0deg)" }}
        >
          <span
            className="absolute inset-0 grid place-items-center rounded-xl border border-white/10 bg-[#0d0d10] text-[11px] font-bold text-white/50"
            style={{ backfaceVisibility: "hidden" }}
          >
            OFF
          </span>
          <span
            className="absolute inset-0 grid place-items-center rounded-xl text-[11px] font-bold text-white shadow-[0_10px_28px_-10px_rgba(124,58,237,.8)]"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: grad(NEBULA) }}
          >
            ON
          </span>
        </span>
      </span>
    </Root>
  );
}

/* 4 — Power Ring: circular power button with rotating conic border */
function PowerRing() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Power">
      <span
        aria-hidden
        className="relative grid h-11 w-11 place-items-center rounded-full transition-all duration-500"
        style={{
          background: on
            ? `conic-gradient(from 0deg, ${COSMIC.from}, ${COSMIC.via}, ${COSMIC.to}, ${COSMIC.from})`
            : "conic-gradient(from 0deg,#222,#111,#222)",
          animation: on ? "nova-tg-spin 3s linear infinite" : "none",
          boxShadow: on ? "0 0 24px rgba(99,102,241,.55)" : "inset 0 1px 0 rgba(255,255,255,.06)",
        }}
      >
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[#0a0a0b]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={on ? COSMIC.ink : "#666"} strokeWidth="2.4" strokeLinecap="round">
            <path d="M12 3v9" />
            <path d="M6.3 7.7a8 8 0 1 0 11.4 0" />
          </svg>
        </span>
      </span>
    </Root>
  );
}

/* 5 — Lightbulb: rays radiate on */
function Lightbulb() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Lightbulb">
      <span aria-hidden className="relative grid h-11 w-11 place-items-center">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <span
            key={a}
            className="absolute h-3 w-0.5 rounded-full bg-amber-300 transition-all duration-500"
            style={{
              transform: `rotate(${a}deg) translateY(${on ? -18 : -12}px)`,
              opacity: on ? 1 : 0,
              boxShadow: on ? "0 0 6px #fbbf24" : "none",
            }}
          />
        ))}
        <span
          className="relative h-6 w-6 rounded-full transition-all duration-500"
          style={{
            background: on
              ? "radial-gradient(circle at 35% 30%,#fff9c2,#f59e0b)"
              : "radial-gradient(circle at 35% 30%,#3a3a3a,#161616)",
            boxShadow: on ? "0 0 22px rgba(251,191,36,.8)" : "inset 0 -2px 6px rgba(0,0,0,.5)",
          }}
        />
      </span>
    </Root>
  );
}

/* 6 — Rocker Switch: retro flip with light indicator */
function RockerSwitch() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Rocker">
      <span aria-hidden className="relative h-9 w-16 rounded-md border border-white/10 bg-[#0d0d10] p-1" style={{ perspective: "500px" }}>
        <span
          className="grid h-full w-full grid-cols-2 items-center rounded-sm transition-transform duration-300 ease-out"
          style={{ transformStyle: "preserve-3d", transform: on ? "rotateX(0)" : "rotateX(0)" }}
        >
          <span
            className="grid h-full items-center justify-center rounded-l-sm text-[10px] font-bold transition-all duration-300"
            style={{
              background: on ? "#0a0a0b" : "linear-gradient(180deg,#2a2a2c,#151516)",
              color: on ? "#444" : "#eee",
              transform: on ? "rotateY(-25deg) translateZ(-2px)" : "rotateY(0)",
              transformOrigin: "right",
              boxShadow: on ? "inset 2px 0 4px rgba(0,0,0,.6)" : "inset 0 1px 0 rgba(255,255,255,.15)",
            }}
          >
            OFF
          </span>
          <span
            className="grid h-full items-center justify-center rounded-r-sm text-[10px] font-bold transition-all duration-300"
            style={{
              background: on ? grad(EMBER) : "#0a0a0b",
              color: on ? "#fff" : "#444",
              transform: on ? "rotateY(0)" : "rotateY(25deg) translateZ(-2px)",
              transformOrigin: "left",
              boxShadow: on ? "inset 0 1px 0 rgba(255,255,255,.2), 0 0 12px rgba(239,68,68,.5)" : "inset -2px 0 4px rgba(0,0,0,.6)",
            }}
          >
            ON
          </span>
        </span>
      </span>
    </Root>
  );
}

/* 7 — Neon Tube: fluorescent flicker on activation */
function NeonTube() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Neon tube">
      <span
        aria-hidden
        className="relative flex h-8 w-20 items-center justify-center rounded-full border border-white/10 bg-[#050505] text-[10px] font-bold tracking-[0.3em] transition-all duration-300"
        style={{
          color: on ? "#f0abfc" : "#333",
          textShadow: on ? "0 0 8px #e879f9,0 0 16px #c026d3" : "none",
          boxShadow: on
            ? "inset 0 0 12px rgba(232,121,249,.4), 0 0 20px rgba(192,38,211,.55)"
            : "inset 0 0 6px rgba(0,0,0,.6)",
          animation: on ? "nova-tg-flicker .9s ease-in-out 1" : "none",
        }}
      >
        NEON
      </span>
    </Root>
  );
}

/* 8 — Liquid Fill Track: liquid sweeps across track */
function LiquidTrack() {
  const [on, set] = useState(true);
  return (
    <Root checked={on} onChange={set} ariaLabel="Liquid">
      <span aria-hidden className="relative h-8 w-16 overflow-hidden rounded-full border border-white/10 bg-[#0d0d10]">
        <span
          className="absolute inset-0 transition-transform duration-500 ease-out"
          style={{
            transform: on ? "translateX(0)" : "translateX(-100%)",
            background: grad(LAGOON),
          }}
        />
        <span
          className="absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow-[0_4px_10px_rgba(0,0,0,.45)] transition-transform duration-500 ease-[cubic-bezier(.22,1.2,.36,1)]"
          style={{ transform: on ? "translateX(32px)" : "translateX(0)" }}
        />
      </span>
    </Root>
  );
}

/* 9 — Squircle Slide: iOS-inspired squircle thumb */
function SquircleSlide() {
  const [on, set] = useState(true);
  return (
    <Root checked={on} onChange={set} ariaLabel="Squircle">
      <span
        aria-hidden
        className="relative flex h-9 w-16 items-center rounded-[14px] p-1 transition-colors duration-400"
        style={{ background: on ? grad(MINT) : "#26262a" }}
      >
        <span
          className="h-7 w-7 rounded-[10px] bg-white shadow-[0_4px_10px_rgba(0,0,0,.35),inset_0_1px_0_rgba(255,255,255,.6)] transition-all duration-400 ease-[cubic-bezier(.34,1.56,.64,1)]"
          style={{ transform: on ? "translateX(28px) scaleX(1.15)" : "translateX(0) scaleX(1.15)" }}
        />
      </span>
    </Root>
  );
}

/* 10 — Padlock: shackle springs open */
function Padlock() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Padlock">
      <span aria-hidden className="relative grid h-11 w-9 place-items-end">
        <span
          className="absolute left-1/2 top-0 h-5 w-6 -translate-x-1/2 rounded-t-[10px] border-[2.5px] border-b-0 border-current transition-all duration-500 ease-[cubic-bezier(.22,1.2,.36,1)]"
          style={{
            color: on ? "#22d3ee" : "#666",
            transform: on ? "translate(-70%,-3px) rotate(-18deg)" : "translate(-50%,0)",
          }}
        />
        <span
          className="grid h-7 w-9 place-items-center rounded-md transition-all duration-500"
          style={{
            background: on ? grad(LAGOON) : "#141416",
            boxShadow: on ? "0 8px 20px -10px rgba(34,211,238,.7)" : "inset 0 1px 0 rgba(255,255,255,.05)",
          }}
        >
          <span className="h-2 w-2 rounded-full bg-white/80" />
        </span>
      </span>
    </Root>
  );
}

/* 11 — Wifi Fan: arcs cascade in */
function WifiFan() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Wifi">
      <span aria-hidden className="relative grid h-10 w-11 place-items-end">
        {[3, 2, 1].map((n, i) => (
          <span
            key={n}
            className="absolute bottom-1 left-1/2 rounded-t-full border-current transition-all duration-500"
            style={{
              color: on ? COSMIC.via : "#333",
              borderTopWidth: 3,
              borderLeftWidth: 3,
              borderRightWidth: 3,
              borderBottom: 0,
              width: 8 + n * 8,
              height: 5 + n * 4,
              transform: `translateX(-50%) scale(${on ? 1 : 0.4})`,
              opacity: on ? 1 : 0.15,
              transitionDelay: `${(2 - i) * 90}ms`,
              filter: on ? "drop-shadow(0 0 4px rgba(99,102,241,.6))" : "none",
            }}
          />
        ))}
        <span className="relative bottom-0 h-1.5 w-1.5 rounded-full transition-colors duration-300" style={{ background: on ? COSMIC.via : "#333" }} />
      </span>
    </Root>
  );
}

/* 12 — Battery: fills as current flows */
function BatteryFill() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Battery">
      <span aria-hidden className="relative flex h-6 w-14 items-center">
        <span className="relative h-full w-full overflow-hidden rounded-md border border-white/25 bg-[#0d0d10] p-[3px]">
          <span
            className="block h-full rounded-sm transition-[width] duration-700 ease-out"
            style={{ width: on ? "100%" : "12%", background: on ? grad(MINT) : "#ef4444" }}
          />
          {on && (
            <span className="absolute inset-0 grid place-items-center text-[11px] font-black text-white" style={{ textShadow: "0 1px 3px rgba(0,0,0,.5)" }}>
              ⚡
            </span>
          )}
        </span>
        <span className="ml-0.5 h-2.5 w-1 rounded-r-sm bg-white/25" />
      </span>
    </Root>
  );
}

/* 13 — Play · Pause morph */
function PlayPause() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Play pause">
      <span
        aria-hidden
        className="relative grid h-11 w-11 place-items-center rounded-full transition-all duration-400"
        style={{
          background: on ? grad(SUNSET) : "#141416",
          boxShadow: on ? "0 10px 24px -10px rgba(244,63,94,.7)" : "inset 0 1px 0 rgba(255,255,255,.05)",
        }}
      >
        <span className="flex items-center gap-[3px]">
          <span
            className="block bg-white transition-all duration-400 ease-out"
            style={{ width: 4, height: 14, borderRadius: 1, clipPath: on ? "polygon(0 0,100% 0,100% 100%,0 100%)" : "polygon(0 0,100% 50%,100% 50%,0 100%)", transform: on ? "translateX(0)" : "translateX(2px)" }}
          />
          <span
            className="block bg-white transition-all duration-400 ease-out"
            style={{ width: 4, height: 14, borderRadius: 1, opacity: on ? 1 : 0, transform: on ? "translateX(0)" : "translateX(-4px) scaleX(2.4) skewX(-30deg)" }}
          />
        </span>
      </span>
    </Root>
  );
}

/* 14 — Mute · Unmute: bars pulse */
function MuteToggle() {
  const [on, set] = useState(true);
  return (
    <Root checked={on} onChange={set} ariaLabel="Mute">
      <span aria-hidden className="relative flex h-10 w-12 items-end justify-center gap-1">
        {[8, 14, 20, 14, 8].map((h, i) => (
          <span
            key={i}
            className="w-1 rounded-sm transition-all duration-300"
            style={{
              height: on ? h : 3,
              background: on ? grad(AURORA) : "#333",
              animation: on ? `nova-tg-pulse 1.1s ease-in-out ${i * 0.1}s infinite` : "none",
            }}
          />
        ))}
      </span>
    </Root>
  );
}

/* 15 — Bell: ring animation on activation */
function BellToggle() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Bell">
      <span aria-hidden className="relative grid h-10 w-10 place-items-center">
        <span
          className="relative"
          style={{
            transformOrigin: "50% 0%",
            animation: on ? "nova-tg-swing .7s ease-in-out 2" : "none",
            color: on ? "#fbbf24" : "#555",
            filter: on ? "drop-shadow(0 0 6px rgba(251,191,36,.6))" : "none",
            transition: "color .3s",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a1 1 0 0 1 1 1v.6a6 6 0 0 1 5 5.9V13l1.7 3a1 1 0 0 1-.9 1.5H5.2a1 1 0 0 1-.9-1.5L6 13V9.5a6 6 0 0 1 5-5.9V3a1 1 0 0 1 1-1zm-2 17h4a2 2 0 1 1-4 0z" />
          </svg>
        </span>
        {on && <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-rose-500 ring-2 ring-[#0a0a0b]" />}
      </span>
    </Root>
  );
}

/* 16 — Eye: iris opens / closes */
function EyeToggle() {
  const [on, set] = useState(true);
  return (
    <Root checked={on} onChange={set} ariaLabel="Eye">
      <span aria-hidden className="relative grid h-10 w-14 place-items-center overflow-hidden">
        <span
          className="relative h-7 w-12 rounded-[999px] transition-all duration-400"
          style={{
            background: on ? "linear-gradient(180deg,#e0e7ff,#c7d2fe)" : "#0d0d10",
            border: "1px solid rgba(255,255,255,.1)",
          }}
        >
          <span
            className="absolute inset-0 top-0 origin-top rounded-[999px] bg-[#0a0a0b] transition-transform duration-500 ease-[cubic-bezier(.22,1.2,.36,1)]"
            style={{ transform: on ? "scaleY(0)" : "scaleY(1)" }}
          />
          <span
            className="absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-500"
            style={{ background: `radial-gradient(circle at 35% 35%,${COSMIC.via},#0a0a0b)`, transform: `translate(-50%,-50%) scale(${on ? 1 : 0})` }}
          />
        </span>
      </span>
    </Root>
  );
}

/* 17 — Heart: beat scale */
function HeartToggle() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Heart">
      <span aria-hidden className="relative grid h-10 w-10 place-items-center">
        <svg width="26" height="26" viewBox="0 0 24 24" style={{ transition: "transform .35s cubic-bezier(.34,1.56,.64,1)", transform: on ? "scale(1.15)" : "scale(1)", animation: on ? "nova-tg-beat .6s ease-out 1" : "none" }}>
          <defs>
            <linearGradient id="tg-heart" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor={SUNSET.from} />
              <stop offset="50%" stopColor={SUNSET.via} />
              <stop offset="100%" stopColor={SUNSET.to} />
            </linearGradient>
          </defs>
          <path
            d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z"
            fill={on ? "url(#tg-heart)" : "transparent"}
            stroke={on ? "transparent" : "#555"}
            strokeWidth="1.6"
            style={{ filter: on ? "drop-shadow(0 6px 14px rgba(244,63,94,.55))" : "none", transition: "fill .3s,stroke .3s" }}
          />
        </svg>
      </span>
    </Root>
  );
}

/* 18 — Star bookmark */
function StarBookmark() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Star">
      <span aria-hidden className="relative grid h-10 w-10 place-items-center">
        <svg width="26" height="26" viewBox="0 0 24 24" style={{ transform: on ? "rotate(72deg)" : "rotate(0)", transition: "transform .6s cubic-bezier(.34,1.56,.64,1)" }}>
          <defs>
            <linearGradient id="tg-star" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#fde68a" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
          <path
            d="M12 2l2.9 6.9L22 10l-5.5 4.8L18 22l-6-3.6L6 22l1.5-7.2L2 10l7.1-1.1L12 2z"
            fill={on ? "url(#tg-star)" : "transparent"}
            stroke={on ? "transparent" : "#555"}
            strokeWidth="1.6"
            strokeLinejoin="round"
            style={{ filter: on ? "drop-shadow(0 4px 12px rgba(251,191,36,.7))" : "none", transition: "fill .3s,stroke .3s" }}
          />
        </svg>
      </span>
    </Root>
  );
}

/* 19 — Airplane Mode: paper plane slides up */
function AirplaneMode() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Airplane">
      <span aria-hidden className="relative flex h-9 w-16 items-center rounded-full border border-white/10 bg-[#0d0d10] p-1"
        style={{ background: on ? grad(COSMIC) : "#0d0d10", transition: "background .5s" }}
      >
        <span
          className="grid h-7 w-7 place-items-center rounded-full bg-white shadow-[0_4px_10px_rgba(0,0,0,.35)] transition-transform duration-500 ease-[cubic-bezier(.22,1.2,.36,1)]"
          style={{ transform: on ? "translateX(28px) rotate(45deg)" : "translateX(0) rotate(0)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={on ? COSMIC.via : "#666"}><path d="M22 2L11 22l-2-9-9-2L22 2z" /></svg>
        </span>
      </span>
    </Root>
  );
}

/* 20 — Flame Ignite */
function FlameIgnite() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Flame">
      <span aria-hidden className="relative grid h-11 w-9 place-items-end">
        <span
          className="relative h-9 w-6"
          style={{ transform: on ? "scaleY(1)" : "scaleY(0)", transformOrigin: "bottom", transition: "transform .5s cubic-bezier(.34,1.56,.64,1)" }}
        >
          <span className="absolute bottom-0 left-0 h-full w-full rounded-full" style={{ background: grad(EMBER), filter: "blur(2px)", animation: on ? "nova-tg-flame 1.1s ease-in-out infinite alternate" : "none" }} />
          <span className="absolute bottom-0 left-1 h-4 w-4 rounded-full bg-yellow-200 blur-[3px]" style={{ opacity: on ? 1 : 0 }} />
        </span>
        <span className="absolute bottom-0 h-1.5 w-9 rounded-full bg-[#0d0d10] border border-white/10" />
      </span>
    </Root>
  );
}

/* 21 — Yin · Yang: rotates on flip */
function YinYang() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Yin yang">
      <span
        aria-hidden
        className="relative grid h-10 w-10 place-items-center rounded-full transition-transform duration-700 ease-[cubic-bezier(.22,1.2,.36,1)]"
        style={{
          transform: on ? "rotate(180deg)" : "rotate(0)",
          background: "conic-gradient(#0a0a0b 0 50%,#fff 50% 100%)",
          border: "1px solid rgba(255,255,255,.15)",
          boxShadow: on ? "0 0 20px rgba(255,255,255,.25)" : "0 0 12px rgba(0,0,0,.5)",
        }}
      >
        <span className="absolute top-0 h-5 w-5 rounded-full bg-white" style={{ transform: "translateY(0%)" }} />
        <span className="absolute bottom-0 h-5 w-5 rounded-full bg-[#0a0a0b]" />
        <span className="absolute top-1 h-1.5 w-1.5 rounded-full bg-[#0a0a0b]" />
        <span className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-white" />
      </span>
    </Root>
  );
}

/* 22 — Rainbow Slide */
function RainbowSlide() {
  const [on, set] = useState(true);
  return (
    <Root checked={on} onChange={set} ariaLabel="Rainbow">
      <span
        aria-hidden
        className="relative h-8 w-20 overflow-hidden rounded-full border border-white/10"
        style={{
          background: on
            ? "linear-gradient(90deg,#ef4444,#f97316,#facc15,#22c55e,#3b82f6,#a855f7)"
            : "#0d0d10",
          transition: "background .6s",
          backgroundSize: on ? "200% 100%" : "100% 100%",
          animation: on ? "nova-tg-slide 3s linear infinite" : "none",
        }}
      >
        <span
          className="absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow-[0_4px_10px_rgba(0,0,0,.4)] transition-transform duration-500 ease-[cubic-bezier(.22,1.2,.36,1)]"
          style={{ transform: on ? "translateX(48px)" : "translateX(0)" }}
        />
      </span>
    </Root>
  );
}

/* 23 — Speed: dial rotates */
function SpeedDial() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Speed">
      <span aria-hidden className="relative h-10 w-10 rounded-full border border-white/10 bg-[#0d0d10]"
        style={{ background: `conic-gradient(from -90deg, ${MINT.from}, ${MINT.via}, ${MINT.to}, #0d0d10 ${on ? 100 : 20}%, #0d0d10 100%)`, transition: "background .5s" }}
      >
        <span
          className="absolute left-1/2 top-1/2 h-4 w-[2px] origin-bottom -translate-x-1/2 rounded-full bg-white transition-transform duration-500 ease-[cubic-bezier(.34,1.56,.64,1)]"
          style={{ transform: `translate(-50%,-100%) rotate(${on ? 135 : -135}deg)` }}
        />
        <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
      </span>
    </Root>
  );
}

/* 24 — Toggle Cube: 3D cube slides across */
function ToggleCube() {
  const [on, set] = useState(true);
  return (
    <Root checked={on} onChange={set} ariaLabel="Cube slide">
      <span aria-hidden className="relative h-9 w-16 rounded-lg border border-white/10 bg-[#0d0d10] p-1" style={{ perspective: "600px" }}>
        <span
          className="relative h-7 w-7 rounded-md transition-all duration-500 ease-[cubic-bezier(.22,1.2,.36,1)]"
          style={{
            transform: on ? "translateX(28px) rotateY(180deg)" : "translateX(0) rotateY(0)",
            transformStyle: "preserve-3d",
            background: on ? grad(NEBULA) : "#26262a",
            boxShadow: on ? "0 6px 16px -6px rgba(192,38,211,.6)" : "inset 0 1px 0 rgba(255,255,255,.08)",
          }}
        />
      </span>
    </Root>
  );
}

/* 25 — Snap Ring: outer ring snaps together */
function SnapRing() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Snap ring">
      <span aria-hidden className="relative grid h-11 w-11 place-items-center">
        <span className="absolute inset-0 rounded-full border-2 border-dashed transition-all duration-500"
          style={{ borderColor: on ? AURORA.via : "#333", transform: on ? "rotate(180deg) scale(1)" : "rotate(0) scale(1.15)", opacity: on ? 1 : 0.5 }}
        />
        <span
          className="grid h-7 w-7 place-items-center rounded-full transition-all duration-500"
          style={{ background: on ? grad(AURORA) : "#141416", boxShadow: on ? "0 0 16px rgba(167,139,250,.55)" : "none" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: on ? 1 : 0.3, transition: "opacity .3s" }}>
            <polyline points="4 12 10 18 20 6" />
          </svg>
        </span>
      </span>
    </Root>
  );
}

/* 26 — Segmented: two-pill segmented control */
function Segmented() {
  const [on, set] = useState(true);
  return (
    <Root checked={on} onChange={set} ariaLabel="Segmented">
      <span aria-hidden className="relative flex h-9 w-24 items-center rounded-lg border border-white/10 bg-[#0d0d10] p-1 text-[11px] font-semibold">
        <span
          className="absolute top-1 h-7 rounded-md transition-all duration-400 ease-[cubic-bezier(.34,1.56,.64,1)]"
          style={{ width: "calc(50% - 4px)", left: on ? "calc(50% + 0px)" : 4, background: grad(COSMIC), boxShadow: "0 4px 12px -4px rgba(99,102,241,.6)" }}
        />
        <span className="relative z-10 grid w-1/2 place-items-center" style={{ color: on ? "#666" : "#fff" }}>OFF</span>
        <span className="relative z-10 grid w-1/2 place-items-center" style={{ color: on ? "#fff" : "#666" }}>ON</span>
      </span>
    </Root>
  );
}

/* 27 — Marble in Tube */
function MarbleTube() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Marble">
      <span aria-hidden className="relative h-6 w-20 overflow-hidden rounded-full border border-white/10"
        style={{ background: "linear-gradient(180deg,#050505,#141418)", boxShadow: "inset 0 2px 4px rgba(0,0,0,.7)" }}
      >
        <span
          className="absolute top-1/2 left-1 h-5 w-5 -translate-y-1/2 rounded-full transition-all duration-600 ease-[cubic-bezier(.34,1.56,.64,1)]"
          style={{
            transform: on ? "translate(60px,-50%)" : "translate(0,-50%)",
            background: `radial-gradient(circle at 30% 30%,#fff,${on ? LAGOON.via : "#666"})`,
            boxShadow: on ? `0 0 12px ${LAGOON.via}` : "0 2px 4px rgba(0,0,0,.5)",
          }}
        />
      </span>
    </Root>
  );
}

/* 28 — Coin Flip */
function CoinFlipTg() {
  const [on, set] = useState(true);
  return (
    <Root checked={on} onChange={set} ariaLabel="Coin flip">
      <span aria-hidden className="relative h-10 w-10" style={{ perspective: "800px" }}>
        <span
          className="absolute inset-0 rounded-full transition-transform duration-700 ease-[cubic-bezier(.22,1.2,.36,1)]"
          style={{ transformStyle: "preserve-3d", transform: on ? "rotateY(720deg)" : "rotateY(0)" }}
        >
          <span className="absolute inset-0 grid place-items-center rounded-full border border-yellow-200/30 text-sm font-black text-yellow-900" style={{ backfaceVisibility: "hidden", background: "radial-gradient(circle at 30% 30%,#fef3c7,#f59e0b)" }}>1</span>
          <span className="absolute inset-0 grid place-items-center rounded-full text-sm font-black text-white" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "radial-gradient(circle at 30% 30%,#e5e7eb,#4b5563)" }}>0</span>
        </span>
      </span>
    </Root>
  );
}

/* 29 — Dominoes: pieces topple in sequence */
function Dominoes() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Dominoes">
      <span aria-hidden className="relative flex h-10 w-20 items-end justify-around">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="h-8 w-2 rounded-sm origin-bottom transition-transform ease-out"
            style={{
              background: on ? grad(NEBULA) : "linear-gradient(180deg,#2a2a2c,#141416)",
              transform: on ? "rotate(70deg)" : "rotate(0)",
              transitionDuration: `${400 + i * 80}ms`,
              transitionDelay: `${i * 100}ms`,
              boxShadow: on ? "0 4px 10px -4px rgba(192,38,211,.5)" : "inset 0 1px 0 rgba(255,255,255,.08)",
            }}
          />
        ))}
      </span>
    </Root>
  );
}

/* 30 — Piston: bar pushes across */
function Piston() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Piston">
      <span aria-hidden className="relative flex h-9 w-20 items-center overflow-hidden rounded-md border border-white/10 bg-[#0d0d10] p-1">
        <span
          className="h-6 rounded-sm transition-all duration-400 ease-out"
          style={{ width: on ? "100%" : "16px", background: grad(SUNSET), boxShadow: on ? "0 0 12px rgba(244,63,94,.55)" : "none" }}
        />
      </span>
    </Root>
  );
}

/* 31 — Gradient Sweep Track */
function GradientSweep() {
  const [on, set] = useState(true);
  return (
    <Root checked={on} onChange={set} ariaLabel="Gradient sweep">
      <span aria-hidden className="relative h-8 w-16 overflow-hidden rounded-full border border-white/10 bg-[#0d0d10]">
        <span
          className="absolute inset-0 transition-opacity duration-500"
          style={{ background: `linear-gradient(90deg,${NEBULA.from},${NEBULA.via},${NEBULA.to},${NEBULA.from})`, backgroundSize: "200% 100%", animation: on ? "nova-tg-slide 2.4s linear infinite" : "none", opacity: on ? 1 : 0 }}
        />
        <span
          className="absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow-[0_4px_10px_rgba(0,0,0,.4)] transition-transform duration-500 ease-[cubic-bezier(.22,1.2,.36,1)]"
          style={{ transform: on ? "translateX(32px)" : "translateX(0)" }}
        />
      </span>
    </Root>
  );
}

/* 32 — Skeuomorphic Metal Switch */
function MetalSwitch() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Metal">
      <span aria-hidden className="relative h-9 w-16 rounded-full border border-black/40 p-1"
        style={{ background: "linear-gradient(180deg,#2a2a2c,#0e0e10)", boxShadow: "inset 0 2px 4px rgba(0,0,0,.7),inset 0 -1px 0 rgba(255,255,255,.05)" }}
      >
        <span
          className="grid h-7 w-7 place-items-center rounded-full transition-all duration-500 ease-[cubic-bezier(.22,1.2,.36,1)]"
          style={{
            transform: on ? "translateX(28px)" : "translateX(0)",
            background: on
              ? "radial-gradient(circle at 30% 30%,#f0abfc,#a855f7,#6d28d9)"
              : "radial-gradient(circle at 30% 30%,#f5f5f5,#a1a1aa,#52525b)",
            boxShadow: on ? "0 3px 8px rgba(168,85,247,.55),inset 0 1px 0 rgba(255,255,255,.5)" : "0 3px 6px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.5)",
          }}
        />
      </span>
    </Root>
  );
}

/* 33 — Chip · Pill toggle with LED */
function ChipLED() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Chip">
      <span aria-hidden className="relative flex h-9 w-20 items-center gap-2 rounded-md border border-white/10 bg-[#0d0d10] px-2">
        <span className="text-[10px] font-mono font-bold tracking-wider" style={{ color: on ? MINT.via : "#555", transition: "color .3s" }}>PWR</span>
        <span className="ml-auto h-2 w-2 rounded-full transition-all duration-300"
          style={{ background: on ? MINT.via : "#333", boxShadow: on ? `0 0 8px ${MINT.via},0 0 16px ${MINT.via}` : "none" }}
        />
      </span>
    </Root>
  );
}

/* 34 — Rocker with tilt on/off */
function RockerTilt() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Rocker tilt">
      <span aria-hidden className="relative h-10 w-14 rounded-md border border-white/10 bg-[#0d0d10]" style={{ perspective: "600px" }}>
        <span
          className="absolute inset-1 rounded-sm transition-transform duration-400 ease-[cubic-bezier(.34,1.56,.64,1)]"
          style={{
            background: on ? grad(COSMIC) : "linear-gradient(180deg,#2a2a2c,#151517)",
            transformOrigin: "center",
            transform: on ? "rotateX(-25deg)" : "rotateX(25deg)",
            boxShadow: on ? "0 6px 14px -6px rgba(99,102,241,.6)" : "inset 0 1px 0 rgba(255,255,255,.08)",
          }}
        />
      </span>
    </Root>
  );
}

/* 35 — Fingerprint Scan */
function FingerprintScan() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Fingerprint">
      <span aria-hidden className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-full border border-white/10 bg-[#0d0d10]">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={on ? MINT.via : "#555"} strokeWidth="1.5" strokeLinecap="round" style={{ transition: "stroke .3s" }}>
          <path d="M12 3a9 9 0 0 0-9 9v2" />
          <path d="M12 6a6 6 0 0 0-6 6v3" />
          <path d="M12 9a3 3 0 0 0-3 3v4" />
          <path d="M15 12v2a3 3 0 0 1-3 3" />
          <path d="M18 12v2" />
          <path d="M21 12a9 9 0 0 0-4-7.5" />
        </svg>
        <span className="absolute inset-0" style={{ background: `linear-gradient(180deg,transparent,${MINT.via},transparent)`, opacity: on ? 0.8 : 0, animation: on ? "nova-tg-scan 1.4s ease-in-out 1" : "none" }} />
      </span>
    </Root>
  );
}

/* 36 — Loading Orbit around dot */
function LoadingOrbit() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Orbit">
      <span aria-hidden className="relative grid h-11 w-11 place-items-center">
        <span
          className="absolute inset-0 rounded-full border border-transparent"
          style={{ borderTopColor: on ? AURORA.via : "transparent", borderRightColor: on ? AURORA.via : "transparent", animation: on ? "nova-tg-spin .9s linear infinite" : "none", transition: "border-color .3s" }}
        />
        <span className="h-4 w-4 rounded-full transition-all duration-400" style={{ background: on ? grad(AURORA) : "#26262a", boxShadow: on ? "0 0 14px rgba(167,139,250,.55)" : "none" }} />
      </span>
    </Root>
  );
}

/* 37 — Ripple pool: circles expand */
function RipplePool() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Ripple">
      <span aria-hidden className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-full border border-white/10 bg-[#0a0f18]">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="absolute h-2 w-2 rounded-full"
            style={{
              background: on ? LAGOON.via : "transparent",
              animation: on ? `nova-tg-ripple 1.4s ease-out ${i * 0.4}s infinite` : "none",
              transition: "background .3s",
            }}
          />
        ))}
        <span className="relative h-2 w-2 rounded-full" style={{ background: on ? LAGOON.ink : "#333" }} />
      </span>
    </Root>
  );
}

/* 38 — Filter switch (bloom on) */
function FilterBloom() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Filter">
      <span aria-hidden className="relative flex h-9 w-16 items-center rounded-full p-1 transition-all duration-500"
        style={{ background: on ? grad(SUNSET) : "#151517", filter: on ? "saturate(1.4) brightness(1.05)" : "grayscale(1)", boxShadow: on ? "0 8px 22px -8px rgba(244,63,94,.6)" : "inset 0 1px 0 rgba(255,255,255,.05)" }}
      >
        <span
          className="grid h-7 w-7 place-items-center rounded-full bg-white text-[10px] font-black transition-transform duration-500 ease-[cubic-bezier(.22,1.2,.36,1)]"
          style={{ transform: on ? "translateX(28px)" : "translateX(0)", color: on ? SUNSET.via : "#333" }}
        >
          HD
        </span>
      </span>
    </Root>
  );
}

/* 39 — Diamond flip */
function DiamondFlip() {
  const [on, set] = useState(true);
  return (
    <Root checked={on} onChange={set} ariaLabel="Diamond">
      <span aria-hidden className="relative grid h-11 w-11 place-items-center" style={{ perspective: "700px" }}>
        <span
          className="h-7 w-7 transition-all duration-600 ease-[cubic-bezier(.22,1.2,.36,1)]"
          style={{
            transform: `rotate(45deg) ${on ? "rotateX(0deg)" : "rotateX(180deg)"}`,
            background: on ? grad(NEBULA) : "linear-gradient(135deg,#2a2a2c,#141416)",
            boxShadow: on ? "0 8px 20px -8px rgba(192,38,211,.7)" : "inset 0 1px 0 rgba(255,255,255,.08)",
            transformStyle: "preserve-3d",
          }}
        />
      </span>
    </Root>
  );
}

/* 40 — Vertical Elevator toggle */
function ElevatorTg() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Elevator">
      <span aria-hidden className="relative h-16 w-8 rounded-lg border border-white/10 bg-[#0d0d10] p-1">
        <span
          className="grid h-6 w-6 place-items-center rounded-md transition-all duration-500 ease-[cubic-bezier(.34,1.56,.64,1)]"
          style={{
            transform: on ? "translateY(0)" : "translateY(32px)",
            background: on ? grad(COSMIC) : "#26262a",
            boxShadow: on ? "0 6px 16px -6px rgba(99,102,241,.6)" : "inset 0 1px 0 rgba(255,255,255,.08)",
          }}
        >
          <span className="text-[9px] font-black text-white">{on ? "↑" : "↓"}</span>
        </span>
      </span>
    </Root>
  );
}

/* 41 — Track with typing "ON/OFF" scroll */
function TypingTrack() {
  const [on, set] = useState(true);
  return (
    <Root checked={on} onChange={set} ariaLabel="Typing">
      <span aria-hidden className="relative flex h-9 w-24 items-center overflow-hidden rounded-full border border-white/10 bg-[#0d0d10]">
        <span
          className="absolute inset-0 flex items-center text-[11px] font-black tracking-wider transition-transform duration-500 ease-[cubic-bezier(.34,1.56,.64,1)]"
          style={{ transform: on ? "translateX(0)" : "translateX(-50%)", width: "200%" }}
        >
          <span className="grid w-1/2 place-items-center" style={{ color: LAGOON.ink, background: grad(LAGOON) }}>ONLINE</span>
          <span className="grid w-1/2 place-items-center text-white/50">OFFLINE</span>
        </span>
      </span>
    </Root>
  );
}

/* 42 — Snowflake spin */
function SnowflakeSpin() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Snowflake">
      <span aria-hidden className="relative grid h-11 w-11 place-items-center">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke={on ? "#a5f3fc" : "#444"}
          strokeWidth="1.4"
          strokeLinecap="round"
          style={{
            transform: on ? "rotate(180deg) scale(1.15)" : "rotate(0) scale(1)",
            transition: "transform .7s cubic-bezier(.22,1.2,.36,1),stroke .3s",
            filter: on ? "drop-shadow(0 0 6px #67e8f9)" : "none",
          }}
        >
          <path d="M12 2v20M4.2 6l15.6 12M4.2 18l15.6-12" />
          <path d="M12 5l-2 2M12 5l2 2M12 19l-2-2M12 19l2-2" />
          <path d="M5 8l-1 2M5 8l2-1M19 16l1-2M19 16l-2 1M5 16l2 1M5 16l-1-2M19 8l-2-1M19 8l1 2" />
        </svg>
      </span>
    </Root>
  );
}

/* 43 — Ice · Fire dual state */
function IceFire() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Ice fire">
      <span aria-hidden className="relative flex h-9 w-16 items-center rounded-full border border-white/10 p-1 transition-colors duration-500"
        style={{ background: on ? grad(EMBER) : "linear-gradient(135deg,#0369a1,#22d3ee)" }}
      >
        <span
          className="grid h-7 w-7 place-items-center rounded-full bg-white text-sm transition-transform duration-500 ease-[cubic-bezier(.22,1.2,.36,1)]"
          style={{ transform: on ? "translateX(28px)" : "translateX(0)" }}
        >
          {on ? "🔥" : "❄"}
        </span>
      </span>
    </Root>
  );
}

/* 44 — Bookmark ribbon lifts */
function BookmarkRibbon() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Bookmark">
      <span aria-hidden className="relative grid h-11 w-8 place-items-start">
        <span
          className="h-9 w-6 transition-all duration-500 ease-[cubic-bezier(.34,1.56,.64,1)]"
          style={{
            background: on ? grad(SUNSET) : "#141416",
            clipPath: "polygon(0 0,100% 0,100% 100%,50% 75%,0 100%)",
            transform: on ? "translateY(-3px) scale(1.1)" : "translateY(0)",
            boxShadow: on ? "0 6px 18px -8px rgba(244,63,94,.65)" : "none",
          }}
        />
      </span>
    </Root>
  );
}

/* 45 — Retro CRT power dot */
function CRTPower() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="CRT">
      <span aria-hidden className="relative grid h-10 w-14 place-items-center overflow-hidden rounded-md border border-white/15 bg-[#050505]">
        <span
          className="h-full w-full transition-all duration-500"
          style={{
            background: on
              ? "radial-gradient(circle at 50% 50%,#a5f3fc,#0369a1 60%,#050505 100%)"
              : "#050505",
            transform: on ? "scale(1)" : "scale(0.02)",
            filter: on ? "blur(0)" : "blur(4px)",
          }}
        />
        <span className="absolute inset-0 pointer-events-none" style={{ background: "repeating-linear-gradient(0deg,rgba(255,255,255,.06) 0 1px,transparent 1px 3px)", opacity: on ? 0.5 : 0 }} />
      </span>
    </Root>
  );
}

/* 46 — Magnetic pull toggle */
function MagneticPull() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Magnetic">
      <span aria-hidden className="relative h-8 w-20 rounded-full border border-white/10 bg-[#0d0d10]">
        <span
          className="absolute top-1 h-6 w-6 rounded-full transition-all duration-500"
          style={{
            left: on ? "calc(100% - 28px)" : 4,
            background: on ? grad(NEBULA) : "#26262a",
            boxShadow: on ? "0 0 16px rgba(192,38,211,.7)" : "none",
          }}
        />
        <span
          className="absolute top-1 h-6 w-6 rounded-full transition-all duration-500"
          style={{
            left: on ? "calc(100% - 46px)" : 22,
            background: on ? grad(AURORA) : "#26262a",
            boxShadow: on ? "0 0 14px rgba(167,139,250,.55)" : "none",
          }}
        />
      </span>
    </Root>
  );
}

/* 47 — Envelope open */
function EnvelopeOpen() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Envelope">
      <span aria-hidden className="relative h-9 w-12 rounded-sm border border-white/15 bg-[#141416] overflow-hidden">
        <span
          className="absolute inset-0 origin-top transition-transform duration-500 ease-[cubic-bezier(.22,1.2,.36,1)]"
          style={{
            clipPath: "polygon(0 0,100% 0,50% 60%)",
            background: on ? grad(EMBER) : "#26262a",
            transform: on ? "rotateX(180deg)" : "rotateX(0)",
            transformStyle: "preserve-3d",
          }}
        />
        <span className="absolute inset-x-0 bottom-0 h-2/3 grid place-items-center text-[10px] font-bold" style={{ background: on ? "#fff" : "#0d0d10", color: on ? "#111" : "#444", transition: "background .3s,color .3s" }}>
          {on ? "★" : ""}
        </span>
      </span>
    </Root>
  );
}

/* 48 — Puzzle piece snap */
function PuzzleSnap() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Puzzle">
      <span aria-hidden className="relative flex h-9 w-20 items-center justify-center overflow-hidden rounded-md border border-white/10 bg-[#0d0d10]">
        <span
          className="absolute left-1 h-7 w-9 rounded-l-md transition-transform duration-500 ease-[cubic-bezier(.34,1.56,.64,1)]"
          style={{
            background: on ? grad(COSMIC) : "#26262a",
            transform: on ? "translateX(0)" : "translateX(-30px)",
            clipPath: "polygon(0 0,100% 0,100% 30%,88% 40%,88% 60%,100% 70%,100% 100%,0 100%)",
          }}
        />
        <span
          className="absolute right-1 h-7 w-9 rounded-r-md transition-transform duration-500 ease-[cubic-bezier(.34,1.56,.64,1)]"
          style={{
            background: on ? grad(COSMIC) : "#26262a",
            transform: on ? "translateX(0)" : "translateX(30px)",
            clipPath: "polygon(0 0,100% 0,100% 100%,0 100%,0 70%,12% 60%,12% 40%,0 30%)",
          }}
        />
      </span>
    </Root>
  );
}

/* 49 — Waveform Active */
function WaveformActive() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Waveform">
      <span aria-hidden className="relative flex h-10 w-16 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-[#0d0d10] px-2">
        <svg width="52" height="20" viewBox="0 0 52 20" fill="none">
          <path
            d="M2 10 Q7 2 12 10 T22 10 T32 10 T42 10 T52 10"
            stroke={on ? MINT.via : "#333"}
            strokeWidth="2"
            strokeLinecap="round"
            style={{
              strokeDasharray: 120,
              strokeDashoffset: on ? 0 : 120,
              transition: "stroke-dashoffset .8s ease,stroke .3s",
              filter: on ? `drop-shadow(0 0 4px ${MINT.via})` : "none",
            }}
          />
        </svg>
      </span>
    </Root>
  );
}

/* 50 — Portal Warp: swirling conic reveals check */
function PortalWarp() {
  const [on, set] = useState(false);
  return (
    <Root checked={on} onChange={set} ariaLabel="Portal">
      <span aria-hidden className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-full border border-white/10 bg-[#050505]">
        <span
          className="absolute inset-0 transition-all duration-700"
          style={{
            background: `conic-gradient(from 0deg,${AURORA.from},${AURORA.via},${AURORA.to},${AURORA.from})`,
            transform: on ? "scale(1) rotate(360deg)" : "scale(0) rotate(0)",
            filter: "blur(2px)",
            opacity: on ? 1 : 0,
          }}
        />
        <span
          className="relative grid h-7 w-7 place-items-center rounded-full bg-[#0a0a0b] transition-all duration-500"
          style={{ transform: on ? "scale(1)" : "scale(0)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 12 10 18 20 6" />
          </svg>
        </span>
      </span>
    </Root>
  );
}

/* ---------- registry ---------- */
const ITEMS: { id: string; name: string; Comp: () => ReactNode }[] = [
  { id: "aurora-pill",     name: "Aurora Pill",     Comp: AuroraPill },
  { id: "tg-sun-moon",     name: "Sun · Moon",      Comp: SunMoon },
  { id: "cube-flip-3d",    name: "Cube Flip 3D",    Comp: CubeFlip3D },
  { id: "power-ring",      name: "Power Ring",      Comp: PowerRing },
  { id: "lightbulb",       name: "Lightbulb",       Comp: Lightbulb },
  { id: "rocker-switch",   name: "Rocker Switch",   Comp: RockerSwitch },
  { id: "neon-tube",       name: "Neon Tube",       Comp: NeonTube },
  { id: "liquid-track",    name: "Liquid Track",    Comp: LiquidTrack },
  { id: "squircle-slide",  name: "Squircle Slide",  Comp: SquircleSlide },
  { id: "tg-padlock",      name: "Padlock",         Comp: Padlock },
  { id: "wifi-fan",        name: "Wifi Fan",        Comp: WifiFan },
  { id: "tg-battery-fill", name: "Battery Fill",    Comp: BatteryFill },
  { id: "play-pause",      name: "Play · Pause",    Comp: PlayPause },
  { id: "mute-toggle",     name: "Mute · Unmute",   Comp: MuteToggle },
  { id: "bell-toggle",     name: "Bell Ring",       Comp: BellToggle },
  { id: "eye-toggle",      name: "Eye Reveal",      Comp: EyeToggle },
  { id: "heart-toggle",    name: "Heart Beat",      Comp: HeartToggle },
  { id: "star-bookmark",   name: "Star Bookmark",   Comp: StarBookmark },
  { id: "airplane-mode",   name: "Airplane Mode",   Comp: AirplaneMode },
  { id: "tg-flame-ignite", name: "Flame Ignite",    Comp: FlameIgnite },
  { id: "yin-yang",        name: "Yin · Yang",      Comp: YinYang },
  { id: "rainbow-slide",   name: "Rainbow Slide",   Comp: RainbowSlide },
  { id: "speed-dial",      name: "Speed Dial",      Comp: SpeedDial },
  { id: "toggle-cube",     name: "Toggle Cube",     Comp: ToggleCube },
  { id: "snap-ring",       name: "Snap Ring",       Comp: SnapRing },
  { id: "segmented",       name: "Segmented",       Comp: Segmented },
  { id: "marble-tube",     name: "Marble Tube",     Comp: MarbleTube },
  { id: "tg-coin-flip",    name: "Coin Flip",       Comp: CoinFlipTg },
  { id: "dominoes",        name: "Dominoes",        Comp: Dominoes },
  { id: "piston",          name: "Piston",          Comp: Piston },
  { id: "gradient-sweep",  name: "Gradient Sweep",  Comp: GradientSweep },
  { id: "metal-switch",    name: "Metal Switch",    Comp: MetalSwitch },
  { id: "chip-led",        name: "Chip LED",        Comp: ChipLED },
  { id: "rocker-tilt",     name: "Rocker Tilt",     Comp: RockerTilt },
  { id: "tg-fingerprint",  name: "Fingerprint",     Comp: FingerprintScan },
  { id: "loading-orbit",   name: "Loading Orbit",   Comp: LoadingOrbit },
  { id: "ripple-pool",     name: "Ripple Pool",     Comp: RipplePool },
  { id: "filter-bloom",    name: "Filter Bloom",    Comp: FilterBloom },
  { id: "diamond-flip",    name: "Diamond Flip",    Comp: DiamondFlip },
  { id: "elevator-tg",     name: "Elevator",        Comp: ElevatorTg },
  { id: "typing-track",    name: "Typing Track",    Comp: TypingTrack },
  { id: "snowflake-spin",  name: "Snowflake Spin",  Comp: SnowflakeSpin },
  { id: "ice-fire",        name: "Ice · Fire",      Comp: IceFire },
  { id: "bookmark-ribbon", name: "Bookmark Ribbon", Comp: BookmarkRibbon },
  { id: "crt-power",       name: "CRT Power",       Comp: CRTPower },
  { id: "magnetic-pull",   name: "Magnetic Pull",   Comp: MagneticPull },
  { id: "envelope-open",   name: "Envelope Open",   Comp: EnvelopeOpen },
  { id: "tg-puzzle-snap",  name: "Puzzle Snap",     Comp: PuzzleSnap },
  { id: "waveform-active", name: "Waveform",        Comp: WaveformActive },
  { id: "tg-portal-warp",  name: "Portal Warp",     Comp: PortalWarp },
];

export const TOGGLES: ToggleItem[] = ITEMS.map(({ id, name, Comp }) => ({
  id,
  name,
  render: () => <Comp />,
  code: `// ${name} — Novix UI premium toggle\n// A controlled <input type="checkbox" role="switch"> visually driven by a 3D animated surface.\n// See source: src/data/toggles.tsx (component: ${Comp.name})`,
}));
