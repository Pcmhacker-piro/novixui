import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import type { TooltipItem } from "@/data/tooltips";

/* ─────────────────── shared primitives ─────────────────── */

function useTilePreview(setOpen: (v: boolean) => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const host = (el.closest("[data-tp-hover-host]") as HTMLElement | null) ?? el;
    const on = () => setOpen(true);
    const off = () => setOpen(false);
    host.addEventListener("mouseenter", on);
    host.addEventListener("mouseleave", off);
    return () => {
      host.removeEventListener("mouseenter", on);
      host.removeEventListener("mouseleave", off);
    };
  }, [setOpen]);
  return ref;
}

function Stage({ children }: { children: ReactNode }) {
  return <div className="relative grid place-items-center py-2">{children}</div>;
}

function Btn({ label = "Hover", tone = "dark" }: { label?: string; tone?: "dark" | "light" | "brand" }) {
  const t =
    tone === "light"
      ? "border-black/10 bg-white text-black/80 hover:text-black"
      : tone === "brand"
      ? "border-white/15 bg-gradient-to-b from-white/[0.14] to-white/[0.04] text-white/90 hover:text-white"
      : "border-white/10 bg-white/[0.06] text-white/80 hover:text-white";
  return (
    <button className={`rounded-lg border px-3.5 py-1.5 text-[12.5px] font-medium backdrop-blur transition-colors ${t}`}>
      {label}
    </button>
  );
}

type Dir = "top" | "bottom" | "left" | "right";
function posClass(dir: Dir) {
  switch (dir) {
    case "top": return "bottom-full left-1/2 mb-2 -translate-x-1/2";
    case "bottom": return "top-full left-1/2 mt-2 -translate-x-1/2";
    case "left": return "right-full top-1/2 mr-2 -translate-y-1/2";
    case "right": return "left-full top-1/2 ml-2 -translate-y-1/2";
  }
}
function motionStyle(dir: Dir, open: boolean, dist = 4): CSSProperties {
  const d = open ? 0 : dist;
  const axis =
    dir === "top" ? `translate(-50%, ${open ? -d : d}px)` :
    dir === "bottom" ? `translate(-50%, ${open ? d : -d}px)` :
    dir === "left" ? `translate(${open ? -d : d}px, -50%)` :
    `translate(${open ? d : -d}px, -50%)`;
  return { transform: axis };
}

function TP({
  open, dir = "top", children, extra = "",
}: { open: boolean; dir?: Dir; children: ReactNode; extra?: string }) {
  return (
    <div
      role="tooltip"
      className={`pointer-events-none absolute z-10 transition-all duration-300 ease-[cubic-bezier(0.22,1.2,0.36,1)] ${open ? "opacity-100" : "opacity-0"} ${posClass(dir)} ${extra}`}
      style={motionStyle(dir, open)}
    >
      {children}
    </div>
  );
}

/* ─────────────────── template A — gradient border ─────────────────── */
function GB({ text, grad, dir = "top" as Dir, label = "Hover" }: { text: string; grad: string; dir?: Dir; label?: string }) {
  const [o, s] = useState(false); const ref = useTilePreview(s);
  return (
    <div ref={ref}><Stage><Btn label={label} />
      <TP open={o} dir={dir}>
        <div className="rounded-lg p-[1.5px] shadow-[0_18px_40px_-18px_rgba(0,0,0,.7)]" style={{ background: grad }}>
          <div className="whitespace-nowrap rounded-[6.5px] bg-[#0a0a0b] px-3 py-1.5 text-[11.5px] font-medium text-white">{text}</div>
        </div>
      </TP>
    </Stage></div>
  );
}

/* ─────────────────── template B — glass ─────────────────── */
function GL({ text, dir = "top" as Dir, tint = "rgba(255,255,255,0.06)", ring = "rgba(255,255,255,0.14)" }: { text: string; dir?: Dir; tint?: string; ring?: string }) {
  const [o, s] = useState(false); const ref = useTilePreview(s);
  return (
    <div ref={ref}><Stage><Btn />
      <TP open={o} dir={dir}>
        <div className="whitespace-nowrap rounded-lg px-3 py-1.5 text-[11.5px] font-medium text-white backdrop-blur-md"
          style={{ background: tint, boxShadow: `inset 0 1px 0 ${ring}, 0 12px 30px -12px rgba(0,0,0,.75)` }}>
          {text}
        </div>
      </TP>
    </Stage></div>
  );
}

/* ─────────────────── template C — neon glow ─────────────────── */
function NG({ text, hue, dir = "top" as Dir }: { text: string; hue: string; dir?: Dir }) {
  const [o, s] = useState(false); const ref = useTilePreview(s);
  return (
    <div ref={ref}><Stage><Btn />
      <TP open={o} dir={dir}>
        <div className="whitespace-nowrap rounded-lg bg-[#0a0a0b] px-3 py-1.5 text-[11.5px] font-medium text-white"
          style={{ boxShadow: `0 0 0 1px ${hue}55, 0 0 18px ${hue}66, 0 0 40px ${hue}33` }}>
          {text}
        </div>
      </TP>
    </Stage></div>
  );
}

/* ─────────────────── template D — solid pill with arrow ─────────────────── */
function PA({ text, bg, dir = "top" as Dir }: { text: string; bg: string; dir?: Dir }) {
  const [o, s] = useState(false); const ref = useTilePreview(s);
  const arrow = dir === "top"
    ? "left-1/2 -translate-x-1/2 -bottom-1"
    : dir === "bottom" ? "left-1/2 -translate-x-1/2 -top-1"
    : dir === "left" ? "top-1/2 -translate-y-1/2 -right-1"
    : "top-1/2 -translate-y-1/2 -left-1";
  return (
    <div ref={ref}><Stage><Btn />
      <TP open={o} dir={dir}>
        <div className="relative whitespace-nowrap rounded-full px-3 py-1.5 text-[11.5px] font-semibold text-white shadow-[0_10px_28px_-10px_rgba(0,0,0,.7)]" style={{ background: bg }}>
          {text}
          <span className={`absolute h-2 w-2 rotate-45 ${arrow}`} style={{ background: bg }} />
        </div>
      </TP>
    </Stage></div>
  );
}

/* ─────────────────── template E — kbd row ─────────────────── */
function KB({ label, keys, dir = "top" as Dir }: { label: string; keys: string[]; dir?: Dir }) {
  const [o, s] = useState(false); const ref = useTilePreview(s);
  return (
    <div ref={ref}><Stage><Btn label={label} />
      <TP open={o} dir={dir}>
        <div className="flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-neutral-900 px-2.5 py-1.5 text-[11px] text-white/85 ring-1 ring-white/10">
          {label}
          {keys.map((k) => (
            <kbd key={k} className="rounded bg-white/10 px-1 py-0.5 font-mono text-[9.5px]">{k}</kbd>
          ))}
        </div>
      </TP>
    </Stage></div>
  );
}

/* ─────────────────── template F — icon + text ─────────────────── */
function IT({ text, icon, color, dir = "top" as Dir }: { text: string; icon: string; color: string; dir?: Dir }) {
  const [o, s] = useState(false); const ref = useTilePreview(s);
  return (
    <div ref={ref}><Stage><Btn />
      <TP open={o} dir={dir}>
        <div className="flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-neutral-900 px-2.5 py-1.5 text-[11.5px] font-medium text-white ring-1 ring-white/10 shadow-[0_10px_28px_-10px_rgba(0,0,0,.7)]">
          <span className="grid h-4 w-4 place-items-center rounded-md text-[10px]" style={{ background: color }}>{icon}</span>
          {text}
        </div>
      </TP>
    </Stage></div>
  );
}

/* ─────────────────── template G — rich card ─────────────────── */
function RC({ title, body, dir = "top" as Dir }: { title: string; body: string; dir?: Dir }) {
  const [o, s] = useState(false); const ref = useTilePreview(s);
  return (
    <div ref={ref}><Stage><Btn />
      <TP open={o} dir={dir}>
        <div className="w-56 rounded-xl border border-white/10 bg-gradient-to-b from-neutral-900 to-neutral-950 p-3 text-white shadow-[0_20px_50px_-20px_rgba(0,0,0,.9)]">
          <div className="text-[12px] font-semibold">{title}</div>
          <div className="mt-1 text-[11px] leading-relaxed text-white/60">{body}</div>
        </div>
      </TP>
    </Stage></div>
  );
}

/* ─────────────────── template H — status dot ─────────────────── */
function SD({ text, color, dir = "top" as Dir }: { text: string; color: string; dir?: Dir }) {
  const [o, s] = useState(false); const ref = useTilePreview(s);
  return (
    <div ref={ref}><Stage><Btn />
      <TP open={o} dir={dir}>
        <div className="flex items-center gap-2 whitespace-nowrap rounded-full bg-neutral-900 px-3 py-1.5 text-[11.5px] font-medium text-white ring-1 ring-white/10">
          <span className="relative grid h-2 w-2 place-items-center">
            <span className="absolute inset-0 rounded-full" style={{ background: color }} />
            <span className="absolute inset-0 animate-ping rounded-full" style={{ background: color, opacity: 0.6 }} />
          </span>
          {text}
        </div>
      </TP>
    </Stage></div>
  );
}

/* ─────────────────── template I — conic border spin ─────────────────── */
function CB({ text, dir = "top" as Dir }: { text: string; dir?: Dir }) {
  const [o, s] = useState(false); const ref = useTilePreview(s);
  return (
    <div ref={ref}><Stage><Btn />
      <TP open={o} dir={dir}>
        <div className="relative rounded-lg p-[1.5px]">
          <span className="absolute inset-0 rounded-lg" style={{ background: "conic-gradient(from 0deg,#60a5fa,#a855f7,#ec4899,#f59e0b,#60a5fa)", animation: "tpx-spin 4s linear infinite" }} />
          <div className="relative whitespace-nowrap rounded-[6.5px] bg-[#0a0a0b] px-3 py-1.5 text-[11.5px] font-medium text-white">{text}</div>
        </div>
      </TP>
    </Stage></div>
  );
}

/* ─────────────────── template J — avatar row ─────────────────── */
function AR({ text, colors, dir = "top" as Dir }: { text: string; colors: string[]; dir?: Dir }) {
  const [o, s] = useState(false); const ref = useTilePreview(s);
  return (
    <div ref={ref}><Stage><Btn />
      <TP open={o} dir={dir}>
        <div className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-neutral-900 px-2.5 py-1.5 text-[11.5px] font-medium text-white ring-1 ring-white/10">
          <span className="flex -space-x-1.5">
            {colors.map((c, i) => (
              <span key={i} className="h-4 w-4 rounded-full ring-2 ring-neutral-900" style={{ background: c }} />
            ))}
          </span>
          {text}
        </div>
      </TP>
    </Stage></div>
  );
}

/* ─────────────────── template K — progress bar ─────────────────── */
function PR({ text, pct, color, dir = "top" as Dir }: { text: string; pct: number; color: string; dir?: Dir }) {
  const [o, s] = useState(false); const ref = useTilePreview(s);
  return (
    <div ref={ref}><Stage><Btn />
      <TP open={o} dir={dir}>
        <div className="w-44 rounded-lg bg-neutral-900 px-3 py-2 ring-1 ring-white/10">
          <div className="flex items-center justify-between text-[11px] text-white/85"><span>{text}</span><span className="tabular-nums text-white/60">{pct}%</span></div>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full transition-[width] duration-700" style={{ width: `${o ? pct : 0}%`, background: color }} /></div>
        </div>
      </TP>
    </Stage></div>
  );
}

/* ─────────────────── template L — 3D flip ─────────────────── */
function FL({ text, grad, dir = "top" as Dir }: { text: string; grad: string; dir?: Dir }) {
  const [o, s] = useState(false); const ref = useTilePreview(s);
  return (
    <div ref={ref}><Stage><Btn />
      <TP open={o} dir={dir}>
        <div className="rounded-lg p-[1.5px]" style={{ background: grad, perspective: 500 }}>
          <div className="whitespace-nowrap rounded-[6.5px] bg-[#0a0a0b] px-3 py-1.5 text-[11.5px] font-medium text-white transition-transform duration-500"
            style={{ transformStyle: "preserve-3d", transform: o ? "rotateX(0)" : "rotateX(-70deg)" }}>
            {text}
          </div>
        </div>
      </TP>
    </Stage></div>
  );
}

/* ─────────────────── template M — code inline ─────────────────── */
function CI({ text, code, dir = "top" as Dir }: { text: string; code: string; dir?: Dir }) {
  const [o, s] = useState(false); const ref = useTilePreview(s);
  return (
    <div ref={ref}><Stage><Btn />
      <TP open={o} dir={dir}>
        <div className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-neutral-900 px-2.5 py-1.5 text-[11px] text-white/85 ring-1 ring-white/10">
          {text}
          <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-emerald-300">{code}</code>
        </div>
      </TP>
    </Stage></div>
  );
}

/* ─────────────────── template N — light theme ─────────────────── */
function LT({ text, dir = "top" as Dir }: { text: string; dir?: Dir }) {
  const [o, s] = useState(false); const ref = useTilePreview(s);
  return (
    <div ref={ref}><Stage><Btn />
      <TP open={o} dir={dir}>
        <div className="whitespace-nowrap rounded-lg bg-white px-3 py-1.5 text-[11.5px] font-medium text-black shadow-[0_10px_28px_-10px_rgba(0,0,0,.35)] ring-1 ring-black/10">{text}</div>
      </TP>
    </Stage></div>
  );
}

/* ─────────────────── template O — gradient text ─────────────────── */
function GT({ text, grad, dir = "top" as Dir }: { text: string; grad: string; dir?: Dir }) {
  const [o, s] = useState(false); const ref = useTilePreview(s);
  return (
    <div ref={ref}><Stage><Btn />
      <TP open={o} dir={dir}>
        <div className="whitespace-nowrap rounded-lg bg-[#0a0a0b] px-3 py-1.5 text-[11.5px] font-semibold ring-1 ring-white/10">
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: grad }}>{text}</span>
        </div>
      </TP>
    </Stage></div>
  );
}

/* ─────────────────── template P — badge callout ─────────────────── */
function BC({ text, badge, badgeBg, dir = "top" as Dir }: { text: string; badge: string; badgeBg: string; dir?: Dir }) {
  const [o, s] = useState(false); const ref = useTilePreview(s);
  return (
    <div ref={ref}><Stage><Btn />
      <TP open={o} dir={dir}>
        <div className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-neutral-900 px-2.5 py-1.5 text-[11.5px] font-medium text-white ring-1 ring-white/10">
          <span className="rounded-full px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-white" style={{ background: badgeBg }}>{badge}</span>
          {text}
        </div>
      </TP>
    </Stage></div>
  );
}

/* ─────────────────── template Q — beam sweep ─────────────────── */
function BS({ text, dir = "top" as Dir }: { text: string; dir?: Dir }) {
  const [o, s] = useState(false); const ref = useTilePreview(s);
  return (
    <div ref={ref}><Stage><Btn />
      <TP open={o} dir={dir}>
        <div className="relative overflow-hidden whitespace-nowrap rounded-lg bg-neutral-900 px-3 py-1.5 text-[11.5px] font-medium text-white ring-1 ring-white/10">
          <span className="absolute inset-y-0 -left-8 w-8 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent" style={{ animation: "tpx-sweep 2.4s ease-in-out infinite" }} />
          {text}
        </div>
      </TP>
    </Stage></div>
  );
}

/* ─────────────────── keyframes (once) ─────────────────── */
function Keyframes() {
  return (
    <style>{`
      @keyframes tpx-spin { to { transform: rotate(360deg); } }
      @keyframes tpx-sweep { 0% { transform: translateX(0); } 100% { transform: translateX(400%); } }
    `}</style>
  );
}

/* ─────────────────── build 100 entries ─────────────────── */

type Entry = { id: string; name: string; C: () => ReactNode };
const list: Entry[] = [];

const dirs: Dir[] = ["top", "bottom", "left", "right"];
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
const hues = ["#7c3aed", "#22d3ee", "#f97316", "#ec4899", "#10b981", "#f43f5e", "#eab308", "#3b82f6"];

// 1–20 gradient border
for (let i = 0; i < 20; i++) {
  const g = grads[i % grads.length];
  const d = dirs[i % 4];
  const text = ["Save", "Share", "Copy link", "Publish", "Duplicate", "Archive", "Star", "Rename", "Move", "Export",
                "Deploy", "Preview", "Invite", "Comment", "Approve", "Assign", "Schedule", "Notify", "Lock", "Delete"][i];
  list.push({ id: `tp-ex-${100 + i}`, name: `Gradient ${i + 1}`, C: () => <GB text={text} grad={g} dir={d} /> });
}

// 21–35 glass
for (let i = 0; i < 15; i++) {
  const tints = ["rgba(255,255,255,0.06)","rgba(124,58,237,0.15)","rgba(34,211,238,0.14)","rgba(236,72,153,0.14)","rgba(16,185,129,0.14)"];
  list.push({ id: `tp-ex-${120 + i}`, name: `Glass ${i + 1}`, C: () => <GL text={`Glass ${i + 1}`} tint={tints[i % tints.length]} dir={dirs[i % 4]} /> });
}

// 36–50 neon
for (let i = 0; i < 15; i++) {
  list.push({ id: `tp-ex-${135 + i}`, name: `Neon ${i + 1}`, C: () => <NG text={`Neon ${i + 1}`} hue={hues[i % hues.length]} dir={dirs[i % 4]} /> });
}

// 51–65 pill with arrow
for (let i = 0; i < 15; i++) {
  list.push({ id: `tp-ex-${150 + i}`, name: `Pill ${i + 1}`, C: () => <PA text={`Pill ${i + 1}`} bg={grads[i % grads.length]} dir={dirs[i % 4]} /> });
}

// 66–75 kbd
const kbds: [string, string[]][] = [
  ["Search", ["⌘", "K"]], ["Save", ["⌘", "S"]], ["Copy", ["⌘", "C"]], ["Paste", ["⌘", "V"]], ["Undo", ["⌘", "Z"]],
  ["New", ["⌘", "N"]], ["Delete", ["⌫"]], ["Refresh", ["⌘", "R"]], ["Toggle", ["⌘", "\\"]], ["Find", ["⌘", "F"]],
];
for (let i = 0; i < 10; i++) {
  list.push({ id: `tp-ex-${165 + i}`, name: `Kbd ${i + 1}`, C: () => <KB label={kbds[i][0]} keys={kbds[i][1]} dir={dirs[i % 4]} /> });
}

// 76–85 icon+text
const icons: [string, string, string][] = [
  ["★", "Favorite", "#f59e0b"], ["✓", "Done", "#10b981"], ["!", "Warning", "#f97316"], ["i", "Info", "#3b82f6"],
  ["✕", "Remove", "#ef4444"], ["↑", "Upload", "#8b5cf6"], ["↓", "Download", "#22d3ee"], ["♥", "Liked", "#ec4899"],
  ["◎", "Live", "#22c55e"], ["✎", "Edit", "#a855f7"],
];
for (let i = 0; i < 10; i++) {
  const [ic, tx, cl] = icons[i];
  list.push({ id: `tp-ex-${175 + i}`, name: `Icon ${tx}`, C: () => <IT text={tx} icon={ic} color={cl} dir={dirs[i % 4]} /> });
}

// 86–90 rich cards
const cards: [string, string][] = [
  ["Novix Cloud", "Everything you need to ship at premium speed."],
  ["Auth ready", "Managed sign-in with Google, Apple, and email."],
  ["Realtime", "WebSocket-backed subscriptions built in."],
  ["Storage", "Global object storage with signed URLs."],
  ["Analytics", "Product analytics with zero configuration."],
];
for (let i = 0; i < 5; i++) {
  list.push({ id: `tp-ex-${185 + i}`, name: `Card ${cards[i][0]}`, C: () => <RC title={cards[i][0]} body={cards[i][1]} dir="top" /> });
}

// 91–94 status dots
const statuses: [string, string][] = [["Online", "#22c55e"], ["Idle", "#eab308"], ["Busy", "#ef4444"], ["Offline", "#64748b"]];
for (let i = 0; i < 4; i++) {
  list.push({ id: `tp-ex-${190 + i}`, name: `Status ${statuses[i][0]}`, C: () => <SD text={statuses[i][0]} color={statuses[i][1]} dir={dirs[i % 4]} /> });
}

// 95 conic
list.push({ id: "tp-ex-194", name: "Conic Border", C: () => <CB text="Aurora border" /> });

// 96 avatar row
list.push({ id: "tp-ex-195", name: "Avatar Stack", C: () => <AR text="+12 online" colors={["#f472b6","#a78bfa","#60a5fa","#34d399"]} /> });

// 97 progress
list.push({ id: "tp-ex-196", name: "Progress 72%", C: () => <PR text="Syncing" pct={72} color="linear-gradient(90deg,#22d3ee,#a855f7)" /> });

// 98 flip
list.push({ id: "tp-ex-197", name: "3D Flip", C: () => <FL text="Flip in" grad="linear-gradient(135deg,#f472b6,#8b5cf6)" /> });

// 99 code inline
list.push({ id: "tp-ex-198", name: "Inline Code", C: () => <CI text="Run" code="npm i novixui" /> });

// 100 light
list.push({ id: "tp-ex-199", name: "Light Theme", C: () => <LT text="Light tooltip" /> });

// (Bonus) extras to strengthen variety
list.push({ id: "tp-ex-200", name: "Gradient Text", C: () => <GT text="Premium plan" grad="linear-gradient(135deg,#f472b6,#facc15,#22d3ee)" /> });
list.push({ id: "tp-ex-201", name: "Badge NEW", C: () => <BC text="Version bump" badge="new" badgeBg="linear-gradient(135deg,#22c55e,#10b981)" /> });
list.push({ id: "tp-ex-202", name: "Badge PRO", C: () => <BC text="Pro feature" badge="pro" badgeBg="linear-gradient(135deg,#f472b6,#a855f7)" /> });
list.push({ id: "tp-ex-203", name: "Beam Sweep", C: () => <BS text="Highlighted" /> });

/* ─────────────────── export with keyframes bundled ─────────────────── */

export const TOOLTIPS_EXTRA: TooltipItem[] = list.map((e, i) => ({
  id: e.id,
  name: e.name,
  render: () => (
    <>
      {i === 0 && <Keyframes />}
      <e.C />
    </>
  ),
  code: `// ${e.name} — Novix UI premium tooltip\n// Full source available in /src/data/tooltips-extra.tsx`,
}));
