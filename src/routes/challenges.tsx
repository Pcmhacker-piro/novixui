import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useRef, type ReactNode } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";
import {
  Trophy,
  Flame,
  Sparkles,
  Clock,
  Check,
  Copy,
  Heart,
  Share2,
  ArrowRight,
  Plus,
  ExternalLink,
  Code2,
  Users,
  Sun,
  Moon,
  CheckCircle2,
  Award,
  Crown,
  ChevronRight,
  ChevronDown,
  Layers,
  Zap,
  Eye,
  Sliders,
  Send,
  Calendar,
  Bell,
  HelpCircle,
  ShieldCheck,
  ArrowUpRight,
  RotateCw,
  Github,
  X as XIcon,
} from "lucide-react";
import {
  Badge,
  Button,
  IconButton,
  Card,
  Avatar,
  Marquee,
  useTheme,
  fadeRise,
  stagger,
} from "@/nova";

export const Route = createFileRoute("/challenges")({
  head: () => ({
    meta: [
      { title: "Challenges — Weekly UI Craft & Component Bounties · Novix UI" },
      {
        name: "description",
        content:
          "Weekly UI component design challenges for engineers and designers. Build cutting-edge React & Tailwind components, vote with the community, and win bounties.",
      },
      { property: "og:title", content: "Novix UI Challenges — Weekly Component Bounties" },
      {
        property: "og:description",
        content:
          "Compete in weekly UI challenges. Submit your creative React components and earn your spot in the Hall of Craft.",
      },
    ],
  }),
  component: ChallengesPage,
});

/* ─────────────────────────── Data & Types ─────────────────────────── */

interface ChallengeEntry {
  id: string;
  title: string;
  author: string;
  category: "Buttons" | "Toggles" | "Cards" | "Loaders" | "Checkboxes" | "Micro-Interactions";
  tag: "React" | "CSS" | "Tailwind" | "SVG";
  badge?: string;
  votes: number;
  code: string;
  render: () => ReactNode;
}

const PAST_ENTRIES: ChallengeEntry[] = [
  {
    id: "ch-1",
    title: "Holographic 3D Prismatic Card",
    author: "Alex Rivera",
    category: "Cards",
    tag: "React",
    badge: "🥇 Winner #042",
    votes: 3840,
    code: `export function Holographic3DCard() {
  const [rot, setRot] = useState({ x: 0, y: 0 });
  return (
    <div
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        setRot({ x: -y * 22, y: x * 22 });
      }}
      onMouseLeave={() => setRot({ x: 0, y: 0 })}
      style={{ perspective: 800 }}
      className="cursor-pointer"
    >
      <div
        style={{
          transform: \`rotateX(\${rot.x}deg) rotateY(\${rot.y}deg)\`,
          transformStyle: "preserve-3d",
        }}
        className="relative h-32 w-52 rounded-2xl border border-cyan-400/40 bg-gradient-to-br from-cyan-950/60 via-purple-950/40 to-black p-4 shadow-[0_10px_35px_rgba(6,182,212,0.3)] transition-transform duration-200"
      >
        <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.3),transparent_70%)]" />
        <div className="relative z-10 flex h-full flex-col justify-between" style={{ transform: "translateZ(20px)" }}>
          <div className="flex items-center justify-between">
            <span className="size-3 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] animate-pulse" />
            <span className="font-mono text-[10px] text-cyan-300">QUANTUM_SECURE</span>
          </div>
          <div>
            <div className="font-mono text-[11px] font-bold text-white">4096-BIT CYPHER</div>
            <div className="text-[10px] text-cyan-200/70">Neural Key Protocol</div>
          </div>
        </div>
      </div>
    </div>
  );
}`,
    render: () => {
      const [rot, setRot] = useState({ x: 0, y: 0 });
      return (
        <div
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            setRot({ x: -y * 22, y: x * 22 });
          }}
          onMouseLeave={() => setRot({ x: 0, y: 0 })}
          style={{ perspective: 800 }}
          className="cursor-pointer select-none"
        >
          <div
            style={{
              transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
              transformStyle: "preserve-3d",
            }}
            className="relative h-32 w-52 rounded-2xl border border-cyan-400/40 bg-gradient-to-br from-cyan-950/70 via-purple-950/50 to-black p-4 shadow-[0_10px_35px_rgba(6,182,212,0.35)] transition-transform duration-200"
          >
            <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.3),transparent_70%)]" />
            <div className="relative z-10 flex h-full flex-col justify-between" style={{ transform: "translateZ(24px)" }}>
              <div className="flex items-center justify-between">
                <span className="size-3 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee] animate-pulse" />
                <span className="font-mono text-[10px] font-semibold text-cyan-300">QUANTUM_SEC</span>
              </div>
              <div>
                <div className="font-mono text-xs font-bold text-white tracking-wider">4096-BIT CYPHER</div>
                <div className="text-[10px] text-cyan-200/80">Neural Key Protocol</div>
              </div>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    id: "ch-2",
    title: "Quantum Magnetic Flux Button",
    author: "Kaito Tanaka",
    category: "Buttons",
    tag: "React",
    badge: "🥇 Winner #041",
    votes: 3410,
    code: `export function QuantumButton() {
  return (
    <button className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-cyan-500/40 bg-zinc-950 px-7 py-3 text-sm font-medium text-cyan-300 shadow-[0_0_30px_-5px_rgba(6,182,212,0.5)] transition-all duration-300 hover:border-cyan-400 hover:shadow-[0_0_40px_rgba(6,182,212,0.8)] hover:scale-105 active:scale-95">
      <span className="absolute -inset-x-full top-0 h-full -translate-x-full bg-[linear-gradient(110deg,transparent,rgba(6,182,212,0.3),transparent)] transition-transform duration-700 group-hover:translate-x-full" />
      <span className="relative flex size-2.5">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan-400 opacity-75" />
        <span className="relative inline-flex size-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
      </span>
      <span className="font-mono tracking-wide">INITIALIZE FLUX</span>
    </button>
  );
}`,
    render: () => (
      <button className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-cyan-500/40 bg-zinc-950 px-6 py-2.5 text-sm font-medium text-cyan-300 shadow-[0_0_30px_-5px_rgba(6,182,212,0.5)] transition-all duration-300 hover:border-cyan-400 hover:shadow-[0_0_40px_rgba(6,182,212,0.8)] hover:scale-105 active:scale-95">
        <span className="absolute -inset-x-full top-0 h-full -translate-x-full bg-[linear-gradient(110deg,transparent,rgba(6,182,212,0.3),transparent)] transition-transform duration-700 group-hover:translate-x-full" />
        <span className="relative flex size-2.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex size-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
        </span>
        <span className="font-mono text-xs tracking-wider">INITIALIZE FLUX</span>
      </button>
    ),
  },
  {
    id: "ch-3",
    title: "Liquid Mercury Biometric Dial",
    author: "Elena Rostova",
    category: "Toggles",
    tag: "React",
    badge: "🥈 Runner Up #041",
    votes: 2950,
    code: `export function LiquidMercuryDial() {
  const [on, setOn] = useState(true);
  return (
    <button
      onClick={() => setOn(!on)}
      className={\`relative h-12 w-24 rounded-full border p-1 transition-all duration-500 \${
        on
          ? "border-emerald-400/60 bg-emerald-950/40 shadow-[0_0_30px_rgba(16,185,129,0.4)]"
          : "border-zinc-800 bg-zinc-900 shadow-inner"
      }\`}
    >
      <div
        className={\`size-10 rounded-full transition-all duration-500 flex items-center justify-center \${
          on
            ? "translate-x-12 bg-gradient-to-tr from-emerald-400 to-teal-200 shadow-[0_0_20px_#10b981]"
            : "translate-x-0 bg-zinc-700"
        }\`}
      >
        <span className={\`size-2.5 rounded-full \${on ? "bg-zinc-950 animate-pulse" : "bg-zinc-400"}\`} />
      </div>
    </button>
  );
}`,
    render: () => {
      const [on, setOn] = useState(true);
      return (
        <button
          type="button"
          onClick={() => setOn(!on)}
          className={`relative h-11 w-22 rounded-full border p-1 transition-all duration-500 ${
            on
              ? "border-emerald-400/60 bg-emerald-950/40 shadow-[0_0_30px_rgba(16,185,129,0.4)]"
              : "border-zinc-800 bg-zinc-900 shadow-inner"
          }`}
        >
          <div
            className={`size-9 rounded-full transition-all duration-500 flex items-center justify-center ${
              on
                ? "translate-x-11 bg-gradient-to-tr from-emerald-400 to-teal-200 shadow-[0_0_20px_#10b981]"
                : "translate-x-0 bg-zinc-700"
            }`}
          >
            <span className={`size-2 rounded-full ${on ? "bg-zinc-950 animate-pulse" : "bg-zinc-400"}`} />
          </div>
        </button>
      );
    },
  },
  {
    id: "ch-4",
    title: "Chrono Gyroscope 3D Core",
    author: "Marcus Vance",
    category: "Loaders",
    tag: "CSS",
    badge: "🥇 Winner #040",
    votes: 3120,
    code: `export function GyroscopeCore() {
  return (
    <div className="relative size-16 [perspective:600px] flex items-center justify-center">
      <div className="absolute inset-0 rounded-full border-2 border-amber-400/70 [animation:gyro-x_3s_linear_infinite]" />
      <div className="absolute inset-2 rounded-full border-2 border-cyan-400/70 [animation:gyro-y_2s_linear_infinite]" />
      <div className="size-4 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 shadow-[0_0_20px_#f59e0b] animate-ping" />
      <style>{\`
        @keyframes gyro-x { to { transform: rotateX(360deg) rotateY(180deg); } }
        @keyframes gyro-y { to { transform: rotateY(360deg) rotateX(180deg); } }
      \`}</style>
    </div>
  );
}`,
    render: () => (
      <div className="relative size-16 [perspective:600px] flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-amber-400/70 [animation:gyro-x_3s_linear_infinite]" />
        <div className="absolute inset-2 rounded-full border-2 border-cyan-400/70 [animation:gyro-y_2s_linear_infinite]" />
        <div className="size-3.5 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 shadow-[0_0_20px_#f59e0b] animate-ping" />
        <style>{`
          @keyframes gyro-x { to { transform: rotateX(360deg) rotateY(180deg); } }
          @keyframes gyro-y { to { transform: rotateY(360deg) rotateX(180deg); } }
        `}</style>
      </div>
    ),
  },
  {
    id: "ch-5",
    title: "Hyperdrive Warp Speed Button",
    author: "Sarah Chen",
    category: "Buttons",
    tag: "Tailwind",
    badge: "🔥 Top Rated",
    votes: 2780,
    code: `export function WarpSpeedButton() {
  return (
    <button className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-2xl border border-fuchsia-500/40 bg-zinc-950 px-7 py-3 font-mono text-xs font-bold text-fuchsia-300 shadow-[0_0_25px_rgba(217,70,239,0.35)] transition-all hover:scale-105 hover:border-fuchsia-400 hover:shadow-[0_0_40px_rgba(217,70,239,0.7)] active:scale-95">
      <span className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,70,239,0.2),transparent)] opacity-0 group-hover:opacity-100 transition-opacity" />
      <Sparkles size={15} className="text-fuchsia-400 animate-spin [animation-duration:3s]" />
      <span>WARP_SPEED :: 9.8</span>
      <ArrowRight size={14} className="transition-transform group-hover:translate-x-1.5" />
    </button>
  );
}`,
    render: () => (
      <button className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-2xl border border-fuchsia-500/40 bg-zinc-950 px-6 py-2.5 font-mono text-xs font-bold text-fuchsia-300 shadow-[0_0_25px_rgba(217,70,239,0.35)] transition-all hover:scale-105 hover:border-fuchsia-400 hover:shadow-[0_0_40px_rgba(217,70,239,0.7)] active:scale-95">
        <span className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,70,239,0.2),transparent)] opacity-0 group-hover:opacity-100 transition-opacity" />
        <Sparkles size={14} className="text-fuchsia-400 animate-spin [animation-duration:3s]" />
        <span>WARP_SPEED :: 9.8</span>
        <ArrowRight size={13} className="transition-transform group-hover:translate-x-1.5" />
      </button>
    ),
  },
  {
    id: "ch-6",
    title: "Cyberpunk Spatial Hex Keypad",
    author: "Zoe Kravitz",
    category: "Micro-Interactions",
    tag: "React",
    badge: "🥇 Winner #039",
    votes: 2650,
    code: `export function HexKeypad() {
  const [activeKey, setActiveKey] = useState<number | null>(null);
  return (
    <div className="grid grid-cols-3 gap-2 p-2 rounded-2xl border border-cyan-500/30 bg-zinc-950 shadow-2xl">
      {[1, 2, 3, 4, 5, 6].map((num) => (
        <button
          key={num}
          onClick={() => setActiveKey(num)}
          className={\`size-8 rounded-lg font-mono text-xs font-bold border transition-all duration-200 \${
            activeKey === num
              ? "border-cyan-400 bg-cyan-400 text-black shadow-[0_0_15px_#22d3ee] scale-95"
              : "border-white/10 bg-zinc-900 text-cyan-300 hover:border-cyan-500/50 hover:bg-zinc-800"
          }\`}
        >
          0{num}
        </button>
      ))}
    </div>
  );
}`,
    render: () => {
      const [activeKey, setActiveKey] = useState<number | null>(2);
      return (
        <div className="grid grid-cols-3 gap-2 p-2.5 rounded-2xl border border-cyan-500/30 bg-zinc-950 shadow-2xl select-none">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setActiveKey(num)}
              className={`size-8 rounded-lg font-mono text-xs font-bold border transition-all duration-200 ${
                activeKey === num
                  ? "border-cyan-400 bg-cyan-400 text-black shadow-[0_0_15px_#22d3ee] scale-95"
                  : "border-white/10 bg-zinc-900 text-cyan-300 hover:border-cyan-500/50 hover:bg-zinc-800"
              }`}
            >
              0{num}
            </button>
          ))}
        </div>
      );
    },
  },
  {
    id: "ch-7",
    title: "Bioluminescent Jellyfish Switch",
    author: "Liam Becker",
    category: "Toggles",
    tag: "React",
    badge: "🥇 Winner #038",
    votes: 2410,
    code: `export function BioJellyfishSwitch() {
  const [active, setActive] = useState(true);
  return (
    <button
      onClick={() => setActive(!active)}
      className={\`relative h-11 w-20 rounded-full border transition-all duration-500 flex items-center p-1 \${
        active
          ? "border-violet-400/60 bg-violet-950/50 shadow-[0_0_30px_rgba(167,139,250,0.5)]"
          : "border-zinc-800 bg-zinc-900"
      }\`}
    >
      <div
        className={\`size-9 rounded-full transition-all duration-500 flex items-center justify-center \${
          active
            ? "translate-x-9 bg-gradient-to-tr from-violet-400 via-fuchsia-400 to-cyan-300 shadow-[0_0_20px_#c084fc]"
            : "translate-x-0 bg-zinc-700"
        }\`}
      >
        <span className="size-2 rounded-full bg-white animate-ping" />
      </div>
    </button>
  );
}`,
    render: () => {
      const [active, setActive] = useState(true);
      return (
        <button
          type="button"
          onClick={() => setActive(!active)}
          className={`relative h-10 w-19 rounded-full border transition-all duration-500 flex items-center p-1 ${
            active
              ? "border-violet-400/60 bg-violet-950/50 shadow-[0_0_30px_rgba(167,139,250,0.5)]"
              : "border-zinc-800 bg-zinc-900"
          }`}
        >
          <div
            className={`size-8 rounded-full transition-all duration-500 flex items-center justify-center ${
              active
                ? "translate-x-9 bg-gradient-to-tr from-violet-400 via-fuchsia-400 to-cyan-300 shadow-[0_0_20px_#c084fc]"
                : "translate-x-0 bg-zinc-700"
            }`}
          >
            <span className="size-1.5 rounded-full bg-white animate-ping" />
          </div>
        </button>
      );
    },
  },
  {
    id: "ch-8",
    title: "Prismatic Wave Radar Core",
    author: "Sophia Wu",
    category: "Loaders",
    tag: "SVG",
    badge: "🥇 Winner #037",
    votes: 2180,
    code: `export function WaveRadar() {
  return (
    <div className="relative size-16 flex items-center justify-center">
      <span className="absolute inset-0 rounded-full border border-violet-500/30 animate-ping [animation-duration:2s]" />
      <span className="absolute inset-2 rounded-full border border-fuchsia-500/40 animate-pulse" />
      <div className="size-3.5 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-400 shadow-[0_0_15px_#c084fc]" />
    </div>
  );
}`,
    render: () => (
      <div className="relative size-14 flex items-center justify-center">
        <span className="absolute inset-0 rounded-full border border-violet-500/30 animate-ping [animation-duration:2s]" />
        <span className="absolute inset-2 rounded-full border border-fuchsia-500/40 animate-pulse" />
        <div className="size-3.5 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-400 shadow-[0_0_15px_#c084fc]" />
      </div>
    ),
  },
  {
    id: "ch-9",
    title: "Supernova Pulsar Spatial Toggle",
    author: "Dimitri Novak",
    category: "Toggles",
    tag: "React",
    badge: "🥇 Winner #036",
    votes: 1980,
    code: `export function PulsarToggle() {
  const [ignited, setIgnited] = useState(true);
  return (
    <button
      onClick={() => setIgnited(!ignited)}
      className={\`group relative flex h-11 w-24 items-center rounded-full border p-1 transition-all duration-500 \${
        ignited
          ? "border-amber-500/60 bg-amber-950/40 shadow-[0_0_30px_rgba(245,158,11,0.4)]"
          : "border-zinc-800 bg-zinc-900"
      }\`}
    >
      <div
        className={\`size-9 rounded-full transition-all duration-500 flex items-center justify-center \${
          ignited
            ? "translate-x-13 bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-500 shadow-[0_0_20px_#f59e0b]"
            : "translate-x-0 bg-zinc-700"
        }\`}
      >
        <Flame size={16} className={ignited ? "text-zinc-950 animate-bounce" : "text-zinc-400"} />
      </div>
    </button>
  );
}`,
    render: () => {
      const [ignited, setIgnited] = useState(true);
      return (
        <button
          type="button"
          onClick={() => setIgnited(!ignited)}
          className={`group relative flex h-10 w-22 items-center rounded-full border p-1 transition-all duration-500 ${
            ignited
              ? "border-amber-500/60 bg-amber-950/40 shadow-[0_0_30px_rgba(245,158,11,0.4)]"
              : "border-zinc-800 bg-zinc-900"
          }`}
        >
          <div
            className={`size-8 rounded-full transition-all duration-500 flex items-center justify-center ${
              ignited
                ? "translate-x-12 bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-500 shadow-[0_0_20px_#f59e0b]"
                : "translate-x-0 bg-zinc-700"
            }`}
          >
            <Flame size={15} className={ignited ? "text-zinc-950 animate-bounce" : "text-zinc-400"} />
          </div>
        </button>
      );
    },
  },
  {
    id: "ch-10",
    title: "Aero Glass Floating Segmented Slider",
    author: "Valerie Laurent",
    category: "Micro-Interactions",
    tag: "React",
    badge: "🥇 Winner #035",
    votes: 1890,
    code: `export function AeroSegmentedSlider() {
  const [seg, setSeg] = useState(1);
  return (
    <div className="flex items-center gap-1 rounded-2xl border border-cyan-500/30 bg-zinc-950/80 p-1.5 backdrop-blur-xl shadow-xl">
      {["01", "02", "03"].map((val, i) => (
        <button
          key={val}
          onClick={() => setSeg(i)}
          className={\`rounded-xl px-4 py-2 font-mono text-xs font-bold transition-all duration-300 \${
            seg === i
              ? "bg-cyan-400 text-black shadow-[0_0_15px_#22d3ee]"
              : "text-zinc-400 hover:text-white"
          }\`}
        >
          {val}
        </button>
      ))}
    </div>
  );
}`,
    render: () => {
      const [seg, setSeg] = useState(1);
      return (
        <div className="flex items-center gap-1 rounded-2xl border border-cyan-500/30 bg-zinc-950/80 p-1.5 backdrop-blur-xl shadow-xl select-none">
          {["01", "02", "03"].map((val, i) => (
            <button
              key={val}
              type="button"
              onClick={() => setSeg(i)}
              className={`rounded-xl px-3.5 py-1.5 font-mono text-xs font-bold transition-all duration-300 ${
                seg === i
                  ? "bg-cyan-400 text-black shadow-[0_0_15px_#22d3ee]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {val}
            </button>
          ))}
        </div>
      );
    },
  },
  {
    id: "ch-11",
    title: "Solar Flare Energy Orb Loader",
    author: "Kenji Takahashi",
    category: "Loaders",
    tag: "CSS",
    badge: "🥇 Winner #034",
    votes: 1750,
    code: `export function SolarOrbLoader() {
  return (
    <div className="relative size-14 flex items-center justify-center">
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 opacity-50 blur-md animate-pulse" />
      <div className="size-7 rounded-full bg-gradient-to-tr from-amber-300 via-orange-500 to-rose-600 shadow-[0_0_25px_#f97316] animate-spin" />
    </div>
  );
}`,
    render: () => (
      <div className="relative size-14 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 opacity-50 blur-md animate-pulse" />
        <div className="size-7 rounded-full bg-gradient-to-tr from-amber-300 via-orange-500 to-rose-600 shadow-[0_0_25px_#f97316] animate-spin" />
      </div>
    ),
  },
  {
    id: "ch-12",
    title: "Neuro-Synapse Hologram Status Pill",
    author: "Camille Moreau",
    category: "Cards",
    tag: "React",
    badge: "🥇 Winner #033",
    votes: 1620,
    code: `export function NeuroSynapsePill() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-cyan-500/40 bg-zinc-950/90 px-4 py-2.5 shadow-2xl backdrop-blur-xl">
      <span className="relative flex size-3">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan-400 opacity-80" />
        <span className="relative inline-flex size-3 rounded-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]" />
      </span>
      <span className="font-mono text-xs font-bold text-cyan-300">SYNAPSE_LINK :: OPTIMAL</span>
    </div>
  );
}`,
    render: () => (
      <div className="flex items-center gap-3 rounded-2xl border border-cyan-500/40 bg-zinc-950/90 px-4 py-2 shadow-2xl backdrop-blur-xl">
        <span className="relative flex size-2.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan-400 opacity-80" />
          <span className="relative inline-flex size-2.5 rounded-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]" />
        </span>
        <span className="font-mono text-[11px] font-bold text-cyan-300">SYNAPSE_LINK :: OPTIMAL</span>
      </div>
    ),
  },
];

const LEADERBOARD = [
  { rank: 1, name: "Kaito Tanaka", handle: "@kaito_fx", wins: 6, points: "4,850 XP", streak: "4 weeks", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" },
  { rank: 2, name: "Elena Rostova", handle: "@elena_motion", wins: 5, points: "4,120 XP", streak: "3 weeks", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80" },
  { rank: 3, name: "Alex Rivera", handle: "@arivera_ui", wins: 4, points: "3,780 XP", streak: "2 weeks", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" },
  { rank: 4, name: "Marcus Vance", handle: "@mvance_design", wins: 3, points: "3,250 XP", streak: "1 week", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" },
  { rank: 5, name: "Sarah Chen", handle: "@schen_ui", wins: 3, points: "2,940 XP", streak: "2 weeks", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80" },
  { rank: 6, name: "Zoe Kravitz", handle: "@zoe_particles", wins: 2, points: "2,650 XP", streak: "1 week", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" },
  { rank: 7, name: "Liam Becker", handle: "@lbecker_3d", wins: 2, points: "2,410 XP", streak: "2 weeks", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80" },
  { rank: 8, name: "Sophia Wu", handle: "@swu_craft", wins: 2, points: "2,180 XP", streak: "3 weeks", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80" },
];

/* ─────────────────────────── Component ─────────────────────────── */

function ChallengesPage() {
  const [selectedEntry, setSelectedEntry] = useState<ChallengeEntry | null>(null);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [voteMap, setVoteMap] = useState<Record<string, number>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const reduce = useReducedMotion();

  // Scroll Progress and Parallax Transforms matching Homepage
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28 });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0.45]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleVote = (id: string, initialVotes: number) => {
    const current = voteMap[id] ?? initialVotes;
    const isVoted = voteMap[id] !== undefined && voteMap[id] > initialVotes;
    const next = isVoted ? initialVotes : current + 1;
    setVoteMap((prev) => ({ ...prev, [id]: next }));
    showToast(isVoted ? "Vote removed" : "🎉 Upvoted! Added to community rankings.");
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground font-sans antialiased selection:bg-accent/30 dark:bg-[#050505] dark:text-zinc-100">
      {/* Top Scroll Indicator */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 inset-x-0 h-[3px] bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-400 z-50 origin-left shadow-[0_0_15px_rgba(6,182,212,0.8)]"
      />

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl border border-border/80 bg-surface/95 px-5 py-3.5 text-sm font-medium shadow-2xl backdrop-blur-xl"
          >
            <Sparkles size={16} className="text-accent animate-spin [animation-duration:4s]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <ChallengesHeader onSubmitClick={() => setSubmitModalOpen(true)} />

      <main className="relative z-10 pb-28">
        {/* ─── Hero Section with Homepage-Matching Background & Grid ─── */}
        <section className="relative overflow-hidden border-b border-border/40 bg-background text-foreground dark:text-zinc-100 px-4 sm:px-6 py-14 md:py-24">
          {/* Theme-aware base gradient matching home page */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_0%,#f5f5f7_0%,#fafafa_55%,#ffffff_100%)] dark:bg-[radial-gradient(ellipse_90%_60%_at_50%_0%,#141414_0%,#0a0a0a_55%,#050505_100%)]"
          />
          {/* Deep vignette — dark only */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 hidden dark:block bg-[#050505]"
            style={{
              maskImage: "radial-gradient(ellipse 80% 70% at 50% 20%, transparent 40%, #000 100%)",
              WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 20%, transparent 40%, #000 100%)",
            }}
          />
          {/* Slow drifting aurora #1 */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 left-1/4 h-[380px] sm:h-[480px] w-[90%] sm:w-[720px] rounded-full opacity-30 blur-[140px] dark:opacity-40"
            style={{
              background: "radial-gradient(circle, rgba(56,189,248,0.22), transparent 70%)",
              animation: reduce ? undefined : "nova-hero-drift-a 22s ease-in-out infinite",
            }}
          />
          {/* Slow drifting aurora #2 */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-20 right-1/4 h-[320px] sm:h-[420px] w-[80%] sm:w-[620px] rounded-full opacity-25 blur-[140px] dark:opacity-30"
            style={{
              background: "radial-gradient(circle, rgba(168,85,247,0.18), transparent 70%)",
              animation: reduce ? undefined : "nova-hero-drift-b 28s ease-in-out infinite",
            }}
          />
          {/* Technical grid backdrop matching home page */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.06] dark:opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
              backgroundSize: "34px 34px",
              maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, #000 40%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, #000 40%, transparent 100%)",
              color: "var(--foreground)",
            }}
          />
          <style>{`
            @keyframes nova-hero-drift-a { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(40px,20px) scale(1.08); } }
            @keyframes nova-hero-drift-b { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-30px,15px) scale(1.1); } }
          `}</style>

          <motion.div style={{ opacity: heroOpacity }} className="relative z-10 mx-auto max-w-5xl text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger(0.08, 0.09)}
              className="flex flex-col items-center"
            >
              {/* Badge */}
              <motion.div variants={fadeRise} className="mb-4 sm:mb-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-3.5 py-1 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.04]">
                  <span className="relative flex h-2 w-2">
                    {!reduce && (
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-500 opacity-60" />
                    )}
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
                  </span>
                  <span className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-600 dark:text-zinc-400">
                    Weekly Craft Challenges · Season 3
                  </span>
                </div>
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={fadeRise}
                className="max-w-3xl text-balance font-display text-3xl font-extrabold leading-[1.1] tracking-tight text-zinc-900 dark:text-white sm:text-4xl md:text-6xl"
              >
                Craft. Compete.
                <br />
                <span className="bg-gradient-to-b from-zinc-900 to-zinc-500 bg-clip-text text-transparent dark:from-white dark:to-zinc-500">
                  Get Featured in the Gallery.
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p
                variants={fadeRise}
                className="mx-auto mt-4 sm:mt-6 max-w-2xl text-pretty text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-base md:text-lg"
              >
                Weekly frontend challenges to push the boundary of modern web aesthetics.
                Submit copy-pasteable React & Tailwind components, vote with the community, and win monthly bounties.
              </motion.p>

              {/* Quick stats with interactive hover bounce */}
              <motion.div
                variants={fadeRise}
                className="mt-8 sm:mt-10 grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4 w-full max-w-3xl"
              >
                {[
                  { label: "Active Challenge", val: "#042 Live", color: "text-cyan-500" },
                  { label: "Total Submissions", val: "1,420+", color: "text-foreground" },
                  { label: "Community Votes", val: "38,500+", color: "text-foreground" },
                  { label: "Bounties Awarded", val: "$14,000", color: "text-amber-500" },
                ].map((s, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 160, damping: 22 }}
                    className="nova-card-surface flex flex-col items-center justify-center rounded-2xl p-3 sm:p-4 transition-colors hover:border-cyan-500/40 shadow-sm border border-border/70"
                  >
                    <span className={`font-display text-xl sm:text-2xl font-bold ${s.color}`}>{s.val}</span>
                    <span className="mt-1 font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground text-center">
                      {s.label}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div variants={fadeRise} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="accent"
                  leadingIcon={<Plus />}
                  onClick={() => setSubmitModalOpen(true)}
                  className="w-full sm:w-auto rounded-full shadow-lg shadow-accent/20 transition-all hover:scale-105"
                >
                  Submit Challenge Entry
                </Button>
                <Button size="lg" variant="secondary" leadingIcon={<Trophy />} asChild className="w-full sm:w-auto rounded-full">
                  <a href="#leaderboard">View Leaderboard</a>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>



        {/* ─── Leaderboard / Hall of Fame ─── */}
        <section id="leaderboard" className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 sm:pt-24">
          <ScrollReveal>
            <div className="mb-6 sm:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-accent">
                  <Crown size={14} className="animate-bounce [animation-duration:2s]" />
                  <span>Hall of Craft</span>
                </div>
                <h2 className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl text-foreground">
                  Season 3 Leaderboard
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
                Top creators who consistently craft award-winning UI elements and receive highest community upvotes.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <div className="relative -mx-4 px-4 sm:-mx-6 sm:px-6 overflow-hidden py-2">
              <Marquee speed={32} pauseOnHover={true} fade={true} gap={1.25} className="py-3">
                {LEADERBOARD.map((user) => {
                  const isFirst = user.rank === 1;
                  const isSecond = user.rank === 2;
                  const isThird = user.rank === 3;

                  return (
                    <motion.div
                      key={user.rank}
                      whileHover={{ y: -4, scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 160, damping: 22 }}
                      className={`group relative flex w-52 sm:w-56 shrink-0 flex-col items-center rounded-3xl p-4 sm:p-5 text-center transition-all duration-500 shadow-md hover:shadow-xl ${
                        isFirst
                          ? "border border-amber-500/40 bg-gradient-to-b from-amber-500/10 via-white to-zinc-50 dark:from-amber-500/10 dark:via-[#111114] dark:to-[#070709] hover:border-amber-400"
                          : "border border-black/10 bg-gradient-to-b from-white via-zinc-50 to-zinc-100/60 dark:border-white/10 dark:from-[#131316] dark:via-[#0c0c0e] dark:to-[#060608] hover:border-cyan-500/50"
                      }`}
                    >
                      {/* Rank Badge */}
                      <div
                        className={`absolute top-3 left-3 flex size-6 items-center justify-center rounded-full font-mono text-[11px] font-bold shadow-sm ${
                          isFirst
                            ? "bg-amber-400 text-zinc-950 shadow-[0_0_10px_rgba(251,191,36,0.6)]"
                            : isSecond
                              ? "bg-slate-300 text-zinc-950"
                              : isThird
                                ? "bg-amber-700/80 text-white"
                                : "border border-border/80 bg-surface text-muted-foreground"
                        }`}
                      >
                        #{user.rank}
                      </div>

                      {/* Avatar with Halo Ring */}
                      <div className="relative mt-2">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className={`size-12 sm:size-14 rounded-full object-cover shadow-sm transition-transform duration-500 group-hover:scale-105 ${
                            isFirst
                              ? "ring-2 ring-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.4)]"
                              : isSecond
                                ? "ring-2 ring-slate-300"
                                : isThird
                                    ? "ring-2 ring-amber-600/70"
                                    : "border border-border/80"
                          }`}
                        />
                        {isFirst && (
                          <span className="absolute -top-2 -right-1 text-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.8)]">
                            👑
                          </span>
                        )}
                      </div>

                      <h3 className="mt-3 font-display text-sm font-bold text-foreground">
                        {user.name}
                      </h3>
                      <span className="font-mono text-[10px] sm:text-[11px] text-muted-foreground">{user.handle}</span>

                      <div className="mt-3.5 w-full border-t border-black/5 dark:border-white/8 pt-2.5 flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 font-mono text-amber-500 font-semibold text-[11px]">
                          <Trophy size={12} /> {user.wins} Wins
                        </span>
                        <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400 text-xs">{user.points}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </Marquee>
            </div>
          </ScrollReveal>
        </section>

        {/* ─── Challenge Submissions & Gallery (Exact Match to Homepage CreationsGallery) ─── */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 sm:pt-24">
          <ScrollReveal>
            <div className="border-b border-border/60 pb-6">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
                Elements · Submissions
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl text-foreground">
                Copy the one you love. Remix the rest.
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground max-w-xl">
                Every tile is a real, working element with background lighting. Hover to interact. Tap to inspect and copy code.
              </p>
            </div>
          </ScrollReveal>

          {/* Grid of Cards with EXACT Homepage CreationTile Card & Background */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
            {PAST_ENTRIES.map((entry, index) => {
              const currentVotes = voteMap[entry.id] ?? entry.votes;
              const isUpvoted = voteMap[entry.id] !== undefined && voteMap[entry.id] > entry.votes;

              return (
                <ScrollReveal key={entry.id} delay={(index % 6) * 0.04}>
                  <Card padding="none" className="group overflow-hidden rounded-2xl border border-white/8 bg-[#0b0b0f]">
                    {/* Interactive Tile Stage with Technical Grid & Glow Background */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedEntry(entry)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedEntry(entry);
                        }
                      }}
                      className="relative flex h-56 cursor-pointer items-center justify-center overflow-hidden border-b border-white/5 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(255,255,255,0.04),transparent_70%),linear-gradient(180deg,#0a0a0a_0%,#050505_60%,#030303_100%)] transition-transform duration-300 group-hover:scale-[0.995]"
                    >
                      {/* Technical wireframe grid backdrop */}
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 opacity-40"
                        style={{
                          backgroundImage:
                            "linear-gradient(to right, color-mix(in oklab, var(--foreground) 6%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--foreground) 6%, transparent) 1px, transparent 1px)",
                          backgroundSize: "22px 22px",
                          maskImage:
                            "radial-gradient(ellipse at center, black 40%, transparent 80%)",
                        }}
                      />

                      {/* Moon-edge top hairline highlight */}
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      />

                      {/* Shimmer sweep on hover */}
                      <div
                        aria-hidden
                        className="pointer-events-none absolute -inset-x-8 -top-1 h-full -translate-x-full skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
                      />

                      {/* Halo accent bloom on hover */}
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        style={{
                          background:
                            "radial-gradient(50% 50% at 50% 50%, color-mix(in oklab, var(--accent) 22%, transparent), transparent 70%)",
                        }}
                      />

                      {/* Live rendered component */}
                      <div className="relative z-10 transition-transform duration-500 group-hover:scale-[1.05]">
                        {entry.render()}
                      </div>

                      {/* Top-left Tag Badge */}
                      <div className="absolute left-3 top-3 z-20">
                        <Badge size="sm" variant="outline" className="font-mono text-[10px]">
                          {entry.tag}
                        </Badge>
                      </div>

                      {/* Top-right Winner/Rank Badge (if applicable) */}
                      {entry.badge && (
                        <div className="absolute right-3 top-3 z-20">
                          <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-400">
                            {entry.badge}
                          </span>
                        </div>
                      )}

                      {/* Get code hint — bottom-right reveal on hover */}
                      <span
                        aria-hidden
                        className="pointer-events-none absolute bottom-2 right-2 z-20 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium text-white/85 opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"
                      >
                        <span className="font-mono text-white/70">{"</>"}</span>
                        Get code
                      </span>
                    </div>

                    {/* Bottom Author & Likes Bar */}
                    <div className="flex items-center justify-between px-4 py-3 bg-surface/50">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Avatar size="xs" name={entry.author} />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">{entry.title}</p>
                          <p className="truncate text-[11px] text-muted-foreground">
                            @{entry.author.toLowerCase().replace(/\s+/g, "")} · {entry.category}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVote(entry.id, entry.votes);
                          }}
                          className="nova-focus-ring inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-subtle hover:text-foreground"
                          aria-label="Like"
                        >
                          <Heart
                            size={13}
                            className={isUpvoted ? "fill-rose-500 text-rose-500" : ""}
                          />
                          <span className="tabular-nums font-mono text-xs">
                            {currentVotes.toLocaleString()}
                          </span>
                        </button>
                      </div>
                    </div>
                  </Card>
                </ScrollReveal>
              );
            })}
          </div>
        </section>

        {/* ─── Next-Gen 3D Interactive UI Elements Showcase ─── */}
        <Spatial3DElementsShowcase
          onSelectEntry={setSelectedEntry}
          onVote={handleVote}
          voteMap={voteMap}
        />

        {/* ─── Frequently Asked Questions (FAQ) ─── */}
        <ChallengesFaqSection />

        {/* ─── Creator Community CTA Banner ─── */}
        <ChallengesCtaSection onOpenSubmit={() => setSubmitModalOpen(true)} />
      </main>

      {/* ─── Challenges Footer ─── */}
      <ChallengesFooter />

      {/* ─── Code Modal Dialog ─── */}
      {selectedEntry && (
        <EntryCodeModal entry={selectedEntry} onClose={() => setSelectedEntry(null)} />
      )}

      {/* ─── Submit Challenge Entry Modal Dialog ─── */}
      {submitModalOpen && (
        <SubmitEntryModal
          onClose={() => setSubmitModalOpen(false)}
          onSuccess={(title) => {
            setSubmitModalOpen(false);
            showToast(`🚀 Entry submitted: "${title}"! It is now live in community review.`);
          }}
        />
      )}
    </div>
  );
}

/* ─────────────────────────── Scroll Reveal Wrapper ─────────────────────────── */

function ScrollReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, filter: "blur(1px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: Math.min(delay, 0.15) }}
      className={className}
    >
      {children}
    </motion.div>
  );
}



/* ─────────────────────────── Header Component (Aligned with TopNav) ─────────────────────────── */

function ChallengesHeader({ onSubmitClick }: { onSubmitClick: () => void }) {
  const { resolvedTheme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={
        "sticky top-0 z-40 w-full transition-[background,border-color,backdrop-filter] duration-300 " +
        (scrolled
          ? "border-b border-border/60 bg-background/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent")
      }
    >
      <div className="mx-auto flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:max-w-none lg:px-8">
        {/* Left — wordmark */}
        <Link to="/" className="flex items-center gap-1.5 sm:gap-2 pl-0.5 sm:pl-1 md:pl-2">
          <span className="font-display text-lg sm:text-[21px] font-bold tracking-tight">
            novix<span className="text-accent">ui</span>
          </span>
          <span
            className="rounded-md bg-gradient-to-r from-amber-500 via-fuchsia-500 to-cyan-400 bg-clip-text px-1.5 py-0.5 font-display text-[10px] sm:text-[12px] font-bold uppercase tracking-[0.12em] sm:tracking-[0.14em] text-transparent ring-1 ring-inset ring-amber-400/30"
          >
            Challenges
          </span>
        </Link>

        {/* Center — primary nav */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex lg:gap-2 xl:gap-4">
          <Link
            to="/elements"
            className="rounded-md px-2.5 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-subtle hover:text-foreground lg:px-3 lg:text-[14px] xl:px-3.5"
          >
            Elements
          </Link>
          <Link
            to="/challenges"
            className="rounded-md px-2.5 py-2 text-[13px] font-medium text-foreground transition-colors hover:bg-subtle lg:px-3 lg:text-[14px] xl:px-3.5"
          >
            Challenges
          </Link>
          <Link
            to="/design"
            className="rounded-md px-2.5 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-subtle hover:text-foreground lg:px-3 lg:text-[14px] xl:px-3.5"
          >
            Design
          </Link>
          <Link
            to="/docs"
            className="rounded-md px-2.5 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-subtle hover:text-foreground lg:px-3 lg:text-[14px] xl:px-3.5"
          >
            Docs
          </Link>
        </nav>

        {/* Right — actions */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
          <IconButton
            aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
            onClick={toggle}
            variant="ghost"
            icon={
              resolvedTheme === "dark" ? (
                <Sun size={16} className="text-amber-400" />
              ) : (
                <Moon size={16} className="text-indigo-600" />
              )
            }
            className="border border-border/80 bg-subtle/80 text-foreground transition-colors hover:bg-muted dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
          />
          <Button
            size="sm"
            variant="accent"
            leadingIcon={<Plus />}
            onClick={onSubmitClick}
            className="rounded-full text-xs sm:text-sm px-3 sm:px-4"
          >
            <span className="hidden xs:inline sm:inline">Submit</span> Entry
          </Button>
          <Button size="sm" variant="secondary" asChild className="hidden sm:inline-flex rounded-full border border-border/80 shadow-xs bg-surface-elevated text-foreground hover:bg-subtle">
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

/* ─────────────────────────── Code Modal Component ─────────────────────────── */

function EntryCodeModal({
  entry,
  onClose,
}: {
  entry: ChallengeEntry;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(entry.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative flex max-h-[92vh] w-[calc(100vw-1.5rem)] max-w-2xl flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-border/80 bg-surface shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border/60 px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <Avatar size="sm" name={entry.author} className="shrink-0 size-7 sm:size-8" />
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-semibold text-foreground truncate">{entry.title}</h3>
              <p className="font-mono text-[10px] sm:text-xs text-muted-foreground truncate">@{entry.author.toLowerCase().replace(/\s+/g, "")} · {entry.category}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid size-8 shrink-0 place-items-center rounded-lg border border-border/60 text-muted-foreground transition-colors hover:bg-subtle hover:text-foreground"
          >
            <XIcon size={16} />
          </button>
        </div>

        {/* Live Preview Bar */}
        <div className="relative flex h-40 sm:h-48 items-center justify-center border-b border-border/40 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(255,255,255,0.04),transparent_70%),linear-gradient(180deg,#0a0a0a_0%,#050505_60%,#030303_100%)] p-4 sm:p-6 text-white overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
              maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
            }}
          />
          <div className="relative z-10 scale-90 sm:scale-100">
            {entry.render()}
          </div>
        </div>

        {/* Code Content */}
        <div className="relative flex-1 overflow-y-auto p-3 sm:p-4 bg-zinc-950 font-mono text-[11px] sm:text-xs text-zinc-300">
          <div className="sticky top-0 right-0 z-10 flex justify-end mb-2">
            <button
              onClick={copyCode}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-zinc-900/90 px-3 py-1.5 text-xs text-zinc-200 shadow backdrop-blur transition-colors hover:bg-zinc-800"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy JSX</span>
                </>
              )}
            </button>
          </div>
          <pre className="overflow-x-auto p-1 leading-relaxed select-all">{entry.code}</pre>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border/60 px-4 sm:px-6 py-3 bg-surface/50">
          <span className="font-mono text-[10px] sm:text-xs text-muted-foreground truncate mr-2">Ready to use with Tailwind CSS + React</span>
          <Button size="sm" variant="secondary" onClick={onClose} className="shrink-0">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── Submit Entry Modal ─────────────────────────── */

function SubmitEntryModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (title: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [handle, setHandle] = useState("");
  const [category, setCategory] = useState("Buttons");
  const [code, setCode] = useState(`export function MyCustomElement() {\n  return (\n    <button className="px-6 py-2.5 rounded-full bg-accent text-accent-foreground font-medium shadow-lg hover:scale-105 transition-transform">\n      Click Me\n    </button>\n  );\n}`);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;
    onSuccess(title);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative flex max-h-[92vh] w-[calc(100vw-1.5rem)] max-w-xl flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-border/80 bg-surface shadow-2xl">
        <div className="flex items-center justify-between border-b border-border/60 px-4 sm:px-6 py-3.5 sm:py-4">
          <div className="flex items-center gap-2 min-w-0">
            <Sparkles size={18} className="text-accent shrink-0" />
            <h3 className="text-sm sm:text-base font-semibold text-foreground truncate">Submit Challenge Entry (#042)</h3>
          </div>
          <button
            onClick={onClose}
            className="grid size-8 shrink-0 place-items-center rounded-lg border border-border/60 text-muted-foreground transition-colors hover:bg-subtle hover:text-foreground"
          >
            <XIcon size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Element Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Holographic Quantum Switch"
              className="mt-1.5 w-full rounded-xl border border-border/80 bg-surface/70 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Author Name *
              </label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Alex Rivera"
                className="mt-1.5 w-full rounded-xl border border-border/80 bg-surface/70 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Social / GitHub Handle
              </label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="@username"
                className="mt-1.5 w-full rounded-xl border border-border/80 bg-surface/70 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border/80 bg-surface px-3.5 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none"
            >
              <option value="Buttons">Buttons</option>
              <option value="Toggles">Toggles</option>
              <option value="Cards">Cards</option>
              <option value="Loaders">Loaders</option>
              <option value="Checkboxes">Checkboxes</option>
              <option value="Micro-Interactions">Micro-Interactions</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              React Component Code (TSX/JSX) *
            </label>
            <textarea
              required
              rows={5}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="mt-1.5 w-full font-mono text-xs rounded-xl border border-border/80 bg-zinc-950 p-3 text-zinc-200 placeholder:text-zinc-600 focus:border-accent focus:outline-none"
            />
          </div>

          <div className="border-t border-border/60 pt-4 flex items-center justify-end gap-3">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="accent" leadingIcon={<Send />} className="rounded-full">
              Submit to Review
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─────────────────────────── Additional Sections ─────────────────────────── */

const SPATIAL_3D_ENTRIES: ChallengeEntry[] = [
  {
    id: "sp-1",
    title: "Holographic 3D Titanium Pass",
    author: "Alex Rivera",
    category: "Cards",
    tag: "React",
    badge: "🥇 Winner #042",
    votes: 4850,
    code: `export function HoloTitanium3DCard() {
  const [flipped, setFlipped] = useState(false);
  const [rot, setRot] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  return (
    <div
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        setRot({ x: -y * 22, y: x * 22 });
        setGlare({ x: (x + 0.5) * 100, y: (y + 0.5) * 100, opacity: 0.65 });
      }}
      onMouseLeave={() => {
        setRot({ x: 0, y: 0 });
        setGlare({ x: 50, y: 50, opacity: 0 });
      }}
      onClick={() => setFlipped(!flipped)}
      style={{ perspective: 1000 }}
      className="relative h-44 w-full max-w-[280px] cursor-pointer select-none"
    >
      <motion.div
        animate={{
          rotateX: rot.x,
          rotateY: (flipped ? 180 : 0) + rot.y,
        }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative size-full rounded-2xl border border-amber-400/40 bg-gradient-to-br from-[#1c1a16] via-[#101014] to-[#08080a] p-4 shadow-[0_15px_35px_rgba(251,191,36,0.25)]"
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            opacity: glare.opacity,
            background: \`radial-gradient(circle at \${glare.x}% \${glare.y}%, rgba(251, 191, 36, 0.45), rgba(56, 189, 248, 0.25), transparent 70%)\`,
          }}
        />
        <div style={{ transform: "translateZ(24px)", backfaceVisibility: "hidden" }} className={flipped ? "hidden" : "flex flex-col h-full justify-between"}>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] font-bold text-amber-300">TITANIUM VIP</span>
            <span className="font-mono text-[8px] text-amber-300 font-bold">042 // CRAFT</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="h-8 w-11 rounded border border-amber-400/70 bg-gradient-to-br from-amber-300 to-amber-600 p-0.5" />
            <div className="font-mono text-[11px] font-bold text-white">4,850 XP</div>
          </div>
          <div className="flex items-end justify-between font-mono text-[10px] text-white font-bold">
            <span>ALEX RIVERA</span>
            <span className="text-amber-400">NOVIX UI</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}`,
    render: () => <HoloTitanium3DCard />,
  },
  {
    id: "sp-2",
    title: "Quantum 3D Singularity Core",
    author: "Kaito Tanaka",
    category: "Loaders",
    tag: "CSS",
    badge: "⚡ Interactive Core",
    votes: 4210,
    code: `export function Quantum3DFluxCore() {
  const [mode, setMode] = useState("flux");
  const [rot, setRot] = useState({ x: 0, y: 0 });
  return (
    <div style={{ perspective: 1000 }} className="relative h-44 w-full max-w-[280px]">
      <motion.div
        animate={{ rotateX: rot.x, rotateY: rot.y }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative size-full rounded-2xl border border-cyan-400/40 bg-zinc-950 p-3.5 flex flex-col justify-between"
      >
        <div className="flex justify-between font-mono text-[9px] text-cyan-300">
          <span>SINGULARITY CORE</span>
          <span>4.8 GW</span>
        </div>
        <div style={{ transform: "translateZ(30px)", perspective: 600 }} className="relative my-auto flex h-20 items-center justify-center">
          <div className="absolute size-20 rounded-full border-2 border-cyan-400/80 animate-spin" />
          <div className="size-6 rounded-full bg-cyan-400 shadow-[0_0_30px_#22d3ee] animate-pulse" />
        </div>
      </motion.div>
    </div>
  );
}`,
    render: () => <Quantum3DFluxCore />,
  },
  {
    id: "sp-3",
    title: "Spatial Isometric Cypher Keypad",
    author: "Zoe Kravitz",
    category: "Micro-Interactions",
    tag: "React",
    badge: "✨ 3D Spatial",
    votes: 3950,
    code: `export function Spatial3DMatrixKeypad() {
  const [code, setCode] = useState("734");
  return (
    <div style={{ perspective: 1000 }} className="relative h-44 w-full max-w-[280px]">
      <div style={{ transform: "rotateX(14deg) rotateY(-6deg)", transformStyle: "preserve-3d" }} className="size-full rounded-2xl border border-cyan-500/30 bg-zinc-950 p-3.5 flex flex-col justify-between">
        <div className="rounded border border-cyan-500/40 bg-zinc-900 px-3 py-1 font-mono text-[10px] text-cyan-400 font-bold">
          PIN // {code.padEnd(6, "•")}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <button key={n} onClick={() => setCode((p) => p + n)} className="h-8 rounded bg-zinc-800 font-mono text-[10px] text-cyan-300 hover:bg-zinc-700">
              0{n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}`,
    render: () => <Spatial3DMatrixKeypad />,
  },
  {
    id: "sp-5",
    title: "Liquid Mercury Biometric Dial",
    author: "Elena Rostova",
    category: "Toggles",
    tag: "React",
    badge: "🧬 Touch Sensor",
    votes: 3420,
    code: `export function LiquidBiometric3DDial() {
  const [on, setOn] = useState(true);
  return (
    <div style={{ perspective: 1000 }} className="relative h-44 w-full max-w-[280px]">
      <div style={{ transform: "rotateX(14deg)", transformStyle: "preserve-3d" }} className="size-full rounded-2xl border border-cyan-500/30 bg-zinc-950 p-3.5 flex flex-col justify-between items-center">
        <span className="font-mono text-[9px] text-cyan-300">BIOMETRIC DIAL</span>
        <button onClick={() => setOn(!on)} className="relative flex h-11 w-22 items-center rounded-full border border-cyan-400/60 bg-cyan-950/50 p-1">
          <motion.div animate={{ x: on ? 44 : 0 }} className="size-8 rounded-full bg-cyan-400 shadow-[0_0_15px_#22d3ee]" />
        </button>
      </div>
    </div>
  );
}`,
    render: () => <LiquidBiometric3DDial />,
  },
  {
    id: "sp-6",
    title: "Aero Glass 3D Floating Dock",
    author: "Valerie Laurent",
    category: "Micro-Interactions",
    tag: "React",
    badge: "💎 Spatial Prism",
    votes: 3190,
    code: `export function AeroGlass3DFloatingDock() {
  return (
    <div style={{ perspective: 1000 }} className="relative h-44 w-full max-w-[280px]">
      <div style={{ transform: "rotateX(14deg) rotateY(-4deg)", transformStyle: "preserve-3d" }} className="size-full rounded-2xl border border-sky-500/30 bg-zinc-950 p-3.5 flex flex-col justify-between items-center">
        <span className="font-mono text-[9px] text-sky-400">AERO DOCK</span>
        <div className="flex gap-2 rounded-xl border border-white/10 bg-white/5 p-2 backdrop-blur-xl">
          <span className="size-8 rounded-lg bg-zinc-800 hover:scale-110 transition-transform" />
          <span className="size-8 rounded-lg bg-zinc-800 hover:scale-110 transition-transform" />
        </div>
      </div>
    </div>
  );
}`,
    render: () => <AeroGlass3DFloatingDock />,
  },
];

function Spatial3DElementsShowcase({
  onSelectEntry,
  onVote,
  voteMap,
}: {
  onSelectEntry: (entry: ChallengeEntry) => void;
  onVote: (id: string, initialVotes: number) => void;
  voteMap: Record<string, number>;
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-20 sm:pt-28">
      <ScrollReveal>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/60 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 font-mono text-xs font-semibold text-cyan-400">
              <span className="size-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
              <span>3D SPATIAL ENGINE · EXPERIMENTAL LAB</span>
            </div>
            <h2 className="mt-3 font-display text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl text-foreground">
              Interactive 3D UI Artifacts
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
            Live hardware-accelerated components crafted with pointer-tracked perspective, multi-layer Z-depth, holographic iridescence, and kinetic spring physics.
          </p>
        </div>
      </ScrollReveal>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
        {SPATIAL_3D_ENTRIES.map((entry, index) => {
          const currentVotes = voteMap[entry.id] ?? entry.votes;
          const isUpvoted = voteMap[entry.id] !== undefined && voteMap[entry.id] > entry.votes;

          return (
            <ScrollReveal key={entry.id} delay={(index % 6) * 0.04}>
              <Card padding="none" className="group overflow-hidden rounded-2xl border border-white/8 bg-[#0b0b0f]">
                {/* Interactive Tile Stage with Technical Grid & Glow Background */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectEntry(entry)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectEntry(entry);
                    }
                  }}
                  className="relative flex h-64 sm:h-72 cursor-pointer items-center justify-center overflow-hidden border-b border-white/5 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(255,255,255,0.04),transparent_70%),linear-gradient(180deg,#0a0a0a_0%,#050505_60%,#030303_100%)] transition-transform duration-300 group-hover:scale-[0.995]"
                >
                  {/* Technical wireframe grid backdrop */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-40"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, color-mix(in oklab, var(--foreground) 6%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--foreground) 6%, transparent) 1px, transparent 1px)",
                      backgroundSize: "22px 22px",
                      maskImage:
                        "radial-gradient(ellipse at center, black 40%, transparent 80%)",
                    }}
                  />

                  {/* Top border edge highlight */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  />

                  {/* Shimmer sweep on hover */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -inset-x-8 -top-1 h-full -translate-x-full skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
                  />

                  {/* Halo accent bloom on hover */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(50% 50% at 50% 50%, color-mix(in oklab, var(--accent) 22%, transparent), transparent 70%)",
                    }}
                  />

                  {/* Live rendered component */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="relative z-10 w-full px-4 flex items-center justify-center transition-transform duration-500 group-hover:scale-[1.03]"
                  >
                    {entry.render()}
                  </div>

                  {/* Top-left Tag Badge */}
                  <div className="absolute left-3 top-3 z-20">
                    <Badge size="sm" variant="outline" className="font-mono text-[10px]">
                      {entry.tag}
                    </Badge>
                  </div>

                  {/* Top-right Winner/Rank Badge */}
                  {entry.badge && (
                    <div className="absolute right-3 top-3 z-20">
                      <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-400">
                        {entry.badge}
                      </span>
                    </div>
                  )}

                  {/* Get code hint — bottom-right reveal on hover */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute bottom-2 right-2 z-20 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium text-white/85 opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"
                  >
                    <span className="font-mono text-white/70">{"</>"}</span>
                    Get code
                  </span>
                </div>

                {/* Bottom Author & Likes Bar */}
                <div className="flex items-center justify-between px-4 py-3 bg-surface/50">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar size="xs" name={entry.author} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{entry.title}</p>
                      <p className="truncate text-[11px] text-muted-foreground">
                        @{entry.author.toLowerCase().replace(/\s+/g, "")} · {entry.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onVote(entry.id, entry.votes);
                      }}
                      className="nova-focus-ring inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-subtle hover:text-foreground"
                      aria-label="Like"
                    >
                      <Heart
                        size={13}
                        className={isUpvoted ? "fill-rose-500 text-rose-500" : ""}
                      />
                      <span className="tabular-nums font-mono text-xs">
                        {currentVotes.toLocaleString()}
                      </span>
                    </button>
                  </div>
                </div>
              </Card>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}

/* ─────────────────────────── 3D UI Components ─────────────────────────── */

function HoloTitanium3DCard() {
  const [flipped, setFlipped] = useState(false);
  const [rot, setRot] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  return (
    <motion.div
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      className="w-full max-w-[270px]"
    >
      <div
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          setRot({ x: -y * 22, y: x * 22 });
          setGlare({ x: (x + 0.5) * 100, y: (y + 0.5) * 100, opacity: 0.65 });
        }}
        onMouseLeave={() => {
          setRot({ x: 0, y: 0 });
          setGlare({ x: 50, y: 50, opacity: 0 });
        }}
        onClick={(e) => {
          e.stopPropagation();
          setFlipped(!flipped);
        }}
        style={{ perspective: 1000 }}
        className="relative h-44 w-full cursor-pointer select-none"
      >
        <motion.div
          animate={{
            rotateX: rot.x,
            rotateY: (flipped ? 180 : 0) + rot.y,
          }}
          transition={{ type: "spring", stiffness: 220, damping: 20 }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative size-full rounded-2xl border border-amber-400/40 bg-gradient-to-br from-[#1c1a16] via-[#101014] to-[#08080a] p-4 shadow-[0_15px_35px_rgba(251,191,36,0.25)] transition-shadow duration-300 hover:shadow-[0_20px_45px_rgba(251,191,36,0.4)]"
        >
          {/* Specular Hologram Glare */}
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
            style={{
              opacity: glare.opacity,
              background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(251, 191, 36, 0.45), rgba(56, 189, 248, 0.25), transparent 70%)`,
            }}
          />

          {/* FRONT FACE */}
          <div
            style={{ transform: "translateZ(24px)", backfaceVisibility: "hidden" }}
            className={`flex h-full flex-col justify-between ${flipped ? "hidden" : "flex"}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-ping" />
                <span className="font-mono text-[9px] font-bold tracking-widest text-amber-300 uppercase">
                  Titanium VIP
                </span>
              </div>
              <span className="rounded border border-amber-400/40 bg-amber-400/10 px-1.5 py-0.5 font-mono text-[8px] text-amber-300 font-bold">
                042 // CRAFT
              </span>
            </div>

            {/* Gold Cyber EMV Chip */}
            <div className="my-auto flex items-center justify-between">
              <div
                style={{ transform: "translateZ(14px)" }}
                className="relative h-8 w-11 rounded-md border border-amber-400/70 bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-0.5 shadow-md"
              >
                <div className="grid h-full grid-cols-2 gap-0.5 rounded border border-amber-950/40 bg-amber-600/30 p-0.5">
                  <div className="rounded-xs border-r border-amber-950/40" />
                  <div className="rounded-xs" />
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-[11px] font-bold text-white">4,850 XP</div>
                <div className="font-mono text-[8px] text-amber-400/80">Grandmaster</div>
              </div>
            </div>

            <div style={{ transform: "translateZ(18px)" }} className="flex items-end justify-between">
              <div>
                <div className="font-mono text-[10px] font-extrabold tracking-wider text-white">ALEX RIVERA</div>
                <div className="font-mono text-[8px] text-zinc-400">08/29 · ARCHITECT</div>
              </div>
              <div className="font-display text-xs font-black text-amber-400/90 tracking-tighter">
                NOVIX<span className="text-white">UI</span>
              </div>
            </div>
          </div>

          {/* BACK FACE */}
          <div
            style={{ transform: "rotateY(180deg) translateZ(24px)", backfaceVisibility: "hidden" }}
            className={`flex h-full flex-col justify-between ${flipped ? "flex" : "hidden"}`}
          >
            <div className="-mx-4 -mt-1 h-7 bg-zinc-950 border-y border-amber-400/30 shadow-inner" />
            <div className="my-1 flex items-center justify-between rounded border border-white/10 bg-zinc-900/80 px-2 py-1">
              <span className="font-mono text-[8px] text-zinc-400">CYPHER HASH:</span>
              <span className="font-mono text-[9px] font-bold text-amber-400">9F8A-77C2</span>
            </div>
            <div className="flex items-center justify-between text-[8px] font-mono text-zinc-500">
              <span>AUTHORIZED</span>
              <span className="text-amber-400">TAP TO FLIP</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function Quantum3DFluxCore() {
  const [mode, setMode] = useState<"stasis" | "flux" | "overdrive">("flux");
  const [rot, setRot] = useState({ x: 0, y: 0 });

  const colors = {
    stasis: {
      border: "border-emerald-400/40",
      ring1: "border-emerald-400/70",
      ring2: "border-teal-300/70",
      core: "from-emerald-400 to-teal-200 shadow-[0_0_25px_#10b981]",
      power: "1.2 GW",
    },
    flux: {
      border: "border-cyan-400/40",
      ring1: "border-cyan-400/80",
      ring2: "border-purple-400/70",
      core: "from-cyan-400 via-sky-400 to-blue-500 shadow-[0_0_30px_#22d3ee]",
      power: "4.8 GW",
    },
    overdrive: {
      border: "border-rose-500/50",
      ring1: "border-rose-500/90",
      ring2: "border-amber-400/80",
      core: "from-rose-500 via-orange-500 to-amber-300 shadow-[0_0_35px_#f43f5e]",
      power: "14.4 GW",
    },
  }[mode];

  return (
    <motion.div
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      className="w-full max-w-[270px]"
    >
      <div
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          setRot({ x: -y * 24, y: x * 24 });
        }}
        onMouseLeave={() => setRot({ x: 0, y: 0 })}
        style={{ perspective: 1000 }}
        className="relative h-44 w-full cursor-pointer select-none"
      >
        <motion.div
          animate={{ rotateX: rot.x, rotateY: rot.y }}
          transition={{ type: "spring", stiffness: 220, damping: 20 }}
          style={{ transformStyle: "preserve-3d" }}
          className={`relative size-full rounded-2xl border ${colors.border} bg-gradient-to-b from-[#0a0f18] via-[#080b10] to-[#040508] p-3.5 shadow-xl transition-all duration-500 flex flex-col justify-between`}
        >
          {/* Top HUD */}
          <div style={{ transform: "translateZ(18px)" }} className="flex items-center justify-between">
            <span className="font-mono text-[9px] font-bold text-cyan-300 uppercase tracking-widest">
              SINGULARITY CORE
            </span>
            <span className="font-mono text-[9px] text-zinc-400">{colors.power}</span>
          </div>

          {/* 3D Rotating Gyro Rings + Singularity Core */}
          <div
            style={{ transform: "translateZ(30px)", perspective: 600 }}
            className="relative my-auto flex h-20 items-center justify-center"
          >
            <div
              className={`absolute size-20 rounded-full border-2 ${colors.ring1} [animation:gyro-ring1_4s_linear_infinite]` }
            />
            <div
              className={`absolute size-16 rounded-full border-2 ${colors.ring2} [animation:gyro-ring2_3s_linear_infinite]` }
            />
            <div className={`size-6 rounded-full bg-gradient-to-tr ${colors.core} animate-pulse`} />
          </div>

          {/* Mode Switcher */}
          <div
            style={{ transform: "translateZ(20px)" }}
            className="flex items-center justify-between rounded-lg border border-white/10 bg-black/60 p-0.5 backdrop-blur-md"
          >
            {(["stasis", "flux", "overdrive"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMode(m);
                }}
                className={`flex-1 rounded py-0.5 font-mono text-[8px] font-bold uppercase transition-all duration-200 ${
                  mode === m
                    ? "bg-white text-black shadow scale-95"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function Spatial3DMatrixKeypad() {
  const [codeSequence, setCodeSequence] = useState<string>("734");
  const [activeKey, setActiveKey] = useState<number | null>(null);

  const handlePress = (num: number) => {
    setActiveKey(num);
    setTimeout(() => setActiveKey(null), 250);
    setCodeSequence((prev) => (prev.length >= 6 ? `${num}` : `${prev}${num}`));
  };

  return (
    <motion.div
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      className="w-full max-w-[270px]"
    >
      <div style={{ perspective: 1000 }} className="relative h-44 w-full select-none">
        <div
          style={{
            transform: "rotateX(14deg) rotateY(-6deg)",
            transformStyle: "preserve-3d",
          }}
          className="relative size-full rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-[#0b0f14] via-[#070a0e] to-[#040608] p-3.5 shadow-xl flex flex-col justify-between"
        >
          {/* LCD Screen Display */}
          <div
            style={{ transform: "translateZ(16px)" }}
            className="flex items-center justify-between rounded-lg border border-cyan-500/40 bg-zinc-950/90 px-3 py-1 font-mono text-[10px] shadow-inner"
          >
            <span className="text-zinc-500">CYPHER_PIN //</span>
            <span className="font-bold tracking-widest text-cyan-400">
              {codeSequence.padEnd(6, "•")}
            </span>
          </div>

          {/* 3D Key Matrix */}
          <div
            style={{ transform: "translateZ(24px)" }}
            className="grid grid-cols-3 gap-2 my-auto"
          >
            {[1, 2, 3, 4, 5, 6].map((num) => {
              const isPressed = activeKey === num;
              return (
                <button
                  key={num}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePress(num);
                  }}
                  style={{
                    transform: isPressed ? "translateZ(2px) scale(0.95)" : "translateZ(14px)",
                  }}
                  className={`relative flex h-8 items-center justify-center rounded-lg font-mono text-[10px] font-bold transition-all duration-150 shadow ${
                    isPressed
                      ? "border-cyan-400 bg-cyan-400 text-black shadow-[0_0_15px_#22d3ee]"
                      : "border border-cyan-500/30 bg-gradient-to-b from-zinc-800 to-zinc-900 text-cyan-300 hover:border-cyan-400 hover:bg-zinc-700 hover:shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                  }`}
                >
                  0{num}
                </button>
              );
            })}
          </div>

          {/* Bottom telemetry */}
          <div style={{ transform: "translateZ(12px)" }} className="flex items-center justify-between text-[8px] font-mono text-zinc-500">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
              MATRIX READY
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCodeSequence("");
              }}
              className="text-zinc-400 hover:text-rose-400 transition-colors"
            >
              CLEAR
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function LiquidBiometric3DDial() {
  const [active, setActive] = useState(true);
  const [scanned, setScanned] = useState(false);

  const handleToggle = () => {
    setActive(!active);
    setScanned(true);
    setTimeout(() => setScanned(false), 800);
  };

  return (
    <motion.div
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      className="w-full max-w-[270px]"
    >
      <div style={{ perspective: 1000 }} className="relative h-44 w-full select-none">
        <div
          style={{
            transform: "rotateX(14deg)",
            transformStyle: "preserve-3d",
          }}
          className="relative size-full rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-[#0e171b] via-[#090e11] to-[#040708] p-3.5 shadow-xl flex flex-col justify-between"
        >
          <div style={{ transform: "translateZ(16px)" }} className="flex items-center justify-between">
            <span className="font-mono text-[9px] font-bold text-cyan-300 uppercase tracking-widest">
              BIOMETRIC DIAL
            </span>
            <span className={`font-mono text-[9px] font-bold ${active ? "text-cyan-400" : "text-zinc-500"}`}>
              {active ? "ONLINE" : "OFFLINE"}
            </span>
          </div>

          {/* 3D Dial Enclosure */}
          <div style={{ transform: "translateZ(26px)" }} className="my-auto flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleToggle();
              }}
              className={`relative flex h-11 w-22 items-center rounded-full border p-1 transition-all duration-500 ${
                active
                  ? "border-cyan-400/60 bg-cyan-950/50 shadow-[0_0_25px_rgba(6,182,212,0.4)]"
                  : "border-zinc-800 bg-zinc-900/90 shadow-inner"
              }`}
            >
              <motion.div
                animate={{ x: active ? 44 : 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className={`relative flex size-8 items-center justify-center rounded-full shadow transition-colors ${
                  active
                    ? "bg-gradient-to-tr from-cyan-400 via-sky-300 to-white shadow-[0_0_15px_#22d3ee]"
                    : "bg-gradient-to-tr from-zinc-600 to-zinc-800"
                }`}
              >
                <span className={`size-2 rounded-full ${active ? "bg-zinc-950 animate-ping" : "bg-zinc-400"}`} />
              </motion.div>
            </button>

            {/* Biometric Status */}
            <div className="flex items-center gap-1 font-mono text-[8px] text-zinc-400">
              <span className={`size-1 rounded-full ${scanned ? "bg-cyan-400 animate-ping" : "bg-zinc-600"}`} />
              <span>{scanned ? "AUTH VERIFIED" : "CLICK TO TOGGLE"}</span>
            </div>
          </div>

          <div style={{ transform: "translateZ(14px)" }} className="flex items-center justify-between border-t border-white/5 pt-1.5 text-[8px] font-mono text-zinc-500">
            <span>NEURAL SYNC</span>
            <span className="text-cyan-400">TOUCH SENSITIVE</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AeroGlass3DFloatingDock() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const tools = [
    { label: "Inspect", icon: Eye, color: "text-cyan-400 border-cyan-400/40" },
    { label: "Shaders", icon: Sparkles, color: "text-fuchsia-400 border-fuchsia-400/40" },
    { label: "Physics", icon: Zap, color: "text-amber-400 border-amber-400/40" },
    { label: "Tokens", icon: Layers, color: "text-emerald-400 border-emerald-400/40" },
    { label: "Export", icon: Code2, color: "text-sky-400 border-sky-400/40" },
  ];

  return (
    <motion.div
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
      className="w-full max-w-[270px]"
    >
      <div style={{ perspective: 1000 }} className="relative h-44 w-full select-none">
        <div
          style={{
            transform: "rotateX(14deg) rotateY(-4deg)",
            transformStyle: "preserve-3d",
          }}
          className="relative size-full rounded-2xl border border-sky-500/30 bg-gradient-to-b from-[#0a121d] via-[#070c14] to-[#03060a] p-3.5 shadow-xl flex flex-col justify-between"
        >
          <div style={{ transform: "translateZ(16px)" }} className="flex items-center justify-between">
            <span className="font-mono text-[9px] font-bold text-sky-400 uppercase tracking-widest">
              AERO DOCK
            </span>
            <span className="font-mono text-[8px] text-zinc-400">3D SPATIAL</span>
          </div>

          {/* 3D Floating Glass Dock Stage */}
          <div
            style={{ transform: "translateZ(28px)" }}
            className="my-auto flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] p-1.5 backdrop-blur-xl shadow-xl"
          >
            {tools.map((tool, idx) => {
              const Icon = tool.icon;
              const isHovered = hoveredIdx === idx;

              return (
                <button
                  key={tool.label}
                  type="button"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    transform: isHovered ? "translateZ(20px) scale(1.15)" : "translateZ(6px)",
                  }}
                  className={`relative flex size-8 items-center justify-center rounded-lg border transition-all duration-200 shadow ${
                    isHovered
                      ? `${tool.color} bg-white/15 shadow-[0_0_12px_rgba(255,255,255,0.4)]`
                      : "border-white/10 bg-zinc-900/80 text-zinc-400 hover:text-white"
                  }`}
                >
                  <Icon size={13} />
                </button>
              );
            })}
          </div>

          {/* Tooltip display */}
          <div style={{ transform: "translateZ(16px)" }} className="text-center font-mono text-[9px] text-sky-300">
            {hoveredIdx !== null ? `TOOL: ${tools[hoveredIdx].label.toUpperCase()}` : "HOVER ICONS TO ELEVATE"}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ChallengesFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What technology stack is allowed for challenge submissions?",
      answer:
        "Submissions should be written in React (TypeScript or JavaScript) styled with Tailwind CSS. For animations, you can use Motion (Framer Motion / motion.dev) or pure CSS keyframes. Zero external heavy UI libraries (like Bootstrap or MUI) to keep components drop-in friendly.",
    },
    {
      question: "How does the community voting and judging workflow work?",
      answer:
        "Voting runs for the entire 7-day challenge cycle. Any registered user or GitHub community member can cast upvotes for their favorite elements. The final rank is calculated by combining 50% community peer votes and 50% core design team craft evaluation.",
    },
    {
      question: "How are bounties distributed to winning creators?",
      answer:
        "Cash bounties are distributed within 48 hours of challenge completion. We support direct payout via Stripe, PayPal, GitHub Sponsors, or crypto (USDC), depending on your local region and payout preferences.",
    },
    {
      question: "Who owns the copyright of submitted UI components?",
      answer:
        "You maintain full author attribution and copyright over your creations. By submitting, you grant Novix UI the license to display your component in the open-source gallery under the MIT license, crediting your profile, GitHub, and social handles.",
    },
    {
      question: "Can I submit more than one component to a single challenge?",
      answer:
        "Yes! You can submit up to 3 distinct variations or component designs per weekly challenge. Each submission will receive its own tile in the review gallery and collect independent votes.",
    },
    {
      question: "Are AI-assisted coding tools or generators permitted?",
      answer:
        "Yes, you are welcome to use AI assistants like Antigravity, Claude, or Copilot as part of your development workflow, as long as the component demonstrates high craft, custom tuning, clean architecture, and responsive polish.",
    },
  ];

  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 pt-24 sm:pt-32">
      <ScrollReveal>
        <div className="text-center">
          <Badge variant="outline" className="font-mono text-xs uppercase tracking-[0.18em]">
            FAQ · Knowledge Base
          </Badge>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.02em] md:text-4xl text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Everything you need to know about competing, submitting code, and claiming bounties.
          </p>
        </div>
      </ScrollReveal>

      <div className="mt-10 space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <ScrollReveal key={idx} delay={idx * 0.03}>
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c11]/80 backdrop-blur-md transition-colors hover:border-accent/40">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-4 sm:p-5 text-left text-sm sm:text-base font-semibold text-foreground transition-colors hover:text-accent"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle size={17} className="text-accent shrink-0" />
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 text-muted-foreground transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-accent" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="border-t border-white/5 px-5 pt-3 pb-5 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}

function ChallengesCtaSection({ onOpenSubmit }: { onOpenSubmit: () => void }) {
  return (
    <section className="relative overflow-hidden border-t border-border/60 mt-28">
      {/* Background glow orb matching Home page */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[80%] -translate-x-1/2 opacity-35 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in oklab, var(--accent) 30%, transparent), transparent 70%)",
        }}
      />
      <div className="relative z-10 mx-auto max-w-4xl px-6 py-24 text-center">
        <ScrollReveal>
          <Badge variant="accent" dot className="font-mono">
            Weekly challenge · #042
          </Badge>
          <h2 className="mt-6 text-balance font-display text-4xl font-semibold tracking-[-0.02em] md:text-5xl text-foreground">
            Ready to Showcase Your Frontend Craft?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground leading-relaxed">
            Submit your creation. The community votes. The winner ships on the home page, earns cash bounties, and enters the Hall of Craft.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" leadingIcon={<Sparkles />} onClick={onOpenSubmit}>
              Submit Component Now
            </Button>
            <Button size="lg" variant="secondary" trailingIcon={<ArrowRight />} asChild>
              <a href="https://github.com" target="_blank" rel="noreferrer">
                Explore Community Repo
              </a>
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function ChallengesFooter() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail("");
      setSubscribed(false);
    }, 4000);
  };

  const cols: {
    title: string;
    links: { label: string; href: string; badge?: string; external?: boolean }[];
  }[] = [
    {
      title: "Product",
      links: [
        { label: "Components", href: "/docs/components" },
        { label: "Elements gallery", href: "/elements", badge: "365" },
        { label: "Templates", href: "/docs/templates" },
        { label: "Recipes", href: "/docs/recipes" },
        { label: "Effects", href: "/docs/effects" },
        { label: "Showcase", href: "/docs/showcase" },
      ],
    },
    {
      title: "Docs",
      links: [
        { label: "Introduction", href: "/docs" },
        { label: "Installation", href: "/docs/installation" },
        { label: "Quick start", href: "/docs/quick-start" },
        { label: "Theming", href: "/docs/theming" },
        { label: "Design tokens", href: "/docs/tokens/colors" },
        { label: "Motion", href: "/docs/motion" },
        { label: "CLI", href: "/docs/cli", badge: "beta" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Design principles", href: "/docs/design-principles" },
        { label: "Accessibility", href: "/docs/accessibility" },
        { label: "Playground", href: "/docs/playground" },
        { label: "Migration guides", href: "/docs/migration" },
        { label: "Roadmap", href: "/docs/roadmap" },
        { label: "Changelog", href: "/docs/changelog" },
        { label: "FAQ", href: "/docs/faq" },
      ],
    },
    {
      title: "Community",
      links: [
        { label: "GitHub", href: "https://github.com", external: true },
        { label: "Discord", href: "https://discord.com", external: true },
        { label: "Twitter / X", href: "https://x.com", external: true },
        { label: "Discussions", href: "https://github.com", external: true },
        { label: "Contribute", href: "/docs/guides" },
        { label: "Report a bug", href: "https://github.com", external: true },
      ],
    },
  ];

  const frameworks = [
    { name: "React 19", href: "/docs/quick-start" },
    { name: "Next.js", href: "/docs/installation" },
    { name: "Remix", href: "/docs/installation" },
    { name: "Vite", href: "/docs/installation" },
    { name: "Astro", href: "/docs/installation" },
    { name: "TanStack", href: "/docs/installation" },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-background text-foreground dark:bg-[#050505] dark:text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[80%] -translate-x-1/2 opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in oklab, var(--accent) 30%, transparent), transparent 70%)",
        }}
      />

      {/* Newsletter / CTA strip */}
      <div className="relative border-b border-white/5">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-12 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400">
              <Sparkles className="size-3" />
              The changelog
            </div>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
              New components, every week.
            </h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-400">
              Get a hand-picked drop of premium primitives, effects and templates delivered to your inbox. No spam, unsubscribe anytime.
            </p>
          </div>
          <form
            onSubmit={handleSubscribe}
            className="flex w-full flex-col gap-2 sm:flex-row"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <div className="relative flex-1">
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white placeholder:text-zinc-500 outline-none transition-colors focus:border-white/25 focus:bg-white/[0.05]"
              />
            </div>
            <Button type="submit" size="md" trailingIcon={subscribed ? undefined : <ArrowRight />}>
              {subscribed ? "Subscribed 🎉" : "Subscribe"}
            </Button>
          </form>
        </div>
      </div>

      {/* Main grid */}
      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-10 px-6 py-16 md:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div className="col-span-2 md:col-span-1">
          <div className="-ml-1 flex items-center">
            <Link to="/" className="font-display text-base font-bold tracking-tight hover:opacity-90 transition-opacity">
              novix<span className="text-accent">ui</span>
            </Link>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-400">
            The universe of premium React elements. Open source, community-crafted, obsessively polished.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Button asChild variant="secondary" size="sm" trailingIcon={<ArrowRight />}>
              <Link to="/docs">Read docs</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" leadingIcon={<Github />}>
              <a href="https://github.com" target="_blank" rel="noreferrer noopener">
                Star on GitHub
              </a>
            </Button>
          </div>
          <div className="mt-6">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              Works with
            </div>
            <div className="flex flex-wrap gap-1.5">
              {frameworks.map((f) => (
                <Link
                  key={f.name}
                  to={f.href}
                  className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-[10px] text-zinc-400 transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                >
                  {f.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">
              {col.title}
            </div>
            <ul className="space-y-2">
              {col.links.map((l) => {
                const content = (
                  <span className="inline-flex items-center gap-1.5">
                    <span>{l.label}</span>
                    {l.badge && (
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-zinc-400">
                        {l.badge}
                      </span>
                    )}
                  </span>
                );
                return (
                  <li key={l.label}>
                    {l.external ? (
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-sm text-zinc-400 transition-colors hover:text-white"
                      >
                        {content}
                      </a>
                    ) : (
                      <Link
                        to={l.href}
                        className="text-sm text-zinc-400 transition-colors hover:text-white"
                      >
                        {content}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Wordmark band */}
      <div
        aria-hidden
        className="relative select-none overflow-hidden border-t border-white/5"
      >
        <div className="pointer-events-none mx-auto max-w-[1400px] px-6 py-8">
          <div
            className="bg-clip-text text-center text-[18vw] font-semibold leading-none tracking-tighter text-transparent md:text-[13rem]"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 60%, transparent 100%)",
            }}
          >
            novix<span className="text-accent">ui</span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-6 py-6 text-xs text-zinc-500 md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span>© {new Date().getFullYear()} Novix UI</span>
            <Link to="/docs" className="transition-colors hover:text-zinc-300">
              MIT License
            </Link>
            <Link to="/docs/accessibility" className="transition-colors hover:text-zinc-300">
              Accessibility
            </Link>
            <Link to="/docs/faq" className="transition-colors hover:text-zinc-300">
              Privacy
            </Link>
            <Link to="/docs/faq" className="transition-colors hover:text-zinc-300">
              Terms
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="inline-flex items-center gap-1.5">
              Made with <Heart className="size-3 fill-rose-400 text-rose-400" /> by the community
            </span>
            <span className="hidden text-zinc-700 md:inline">·</span>
            <Link
              to="/docs/changelog"
              className="font-mono transition-colors hover:text-zinc-300"
            >
              v2.4.0
            </Link>
            <span className="hidden text-zinc-700 md:inline">·</span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-zinc-300"
            >
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              </span>
              All systems normal
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
