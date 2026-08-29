import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";

export type TooltipItem = {
  id: string;
  name: string;
  render: () => ReactNode;
  code: string;
};

/* Hover previewer — tile-hover forces the tooltip open. Individual tooltips still open on target hover naturally. */
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

function Stage({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div className="relative grid place-items-center" style={style}>{children}</div>;
}

/* Common target (button) */
function Target({ label = "Hover", className = "" }: { label?: string; className?: string }) {
  return (
    <button className={`rounded-lg border border-white/10 bg-white/[0.06] px-3.5 py-1.5 text-[12.5px] font-medium text-white/80 backdrop-blur transition-colors hover:text-white ${className}`}>
      {label}
    </button>
  );
}

/* Reusable wrapper */
function TP({ open, children, className = "", style }: { open: boolean; children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div
      role="tooltip"
      className={`pointer-events-none absolute z-10 transition-all duration-300 ease-[cubic-bezier(0.22,1.2,0.36,1)] group-hover:opacity-100 ${open ? "opacity-100" : "opacity-0"} ${className}`}
      style={{ translate: "none", ...style }}
    >
      {children}
    </div>
  );
}

/* 1 — Classic Top */
function ClassicTop() {
  const [o, s] = useState(false); const ref = useTilePreview(s);
  return (
    <div ref={ref}>
      <Stage>
        <Target />
        <TP open={o} className="bottom-full left-1/2 mb-2 -translate-x-1/2" style={{ transform: `translate(-50%, ${o ? "-4px" : "4px"})` }}>
          <div className="whitespace-nowrap rounded-lg bg-neutral-900 px-2.5 py-1.5 text-[11.5px] font-medium text-white shadow-[0_10px_30px_-8px_rgba(0,0,0,.8)] ring-1 ring-white/10">Save changes</div>
          <span className="mx-auto -mt-1 block h-2 w-2 rotate-45 bg-neutral-900 ring-1 ring-white/10" />
        </TP>
      </Stage>
    </div>
  );
}

/* 2 — Gradient Halo */
function GradientHalo() {
  const [o, s] = useState(false); const ref = useTilePreview(s);
  return (
    <div ref={ref}><Stage><Target />
      <TP open={o} className="bottom-full left-1/2 mb-3 -translate-x-1/2" style={{ transform: `translate(-50%, ${o ? "-4px" : "4px"})` }}>
        <div className="rounded-lg p-[1.5px]" style={{ background: "linear-gradient(135deg,#7c3aed,#ec4899,#f97316)" }}>
          <div className="whitespace-nowrap rounded-[6.5px] bg-[#0a0a0b] px-3 py-1.5 text-[11.5px] font-medium text-white">Premium tooltip</div>
        </div>
      </TP>
    </Stage></div>
  );
}

/* 3 — Glass Blur */
function GlassBlur() {
  const [o, s] = useState(false); const ref = useTilePreview(s);
  return (
    <div ref={ref}><Stage><Target />
      <TP open={o} className="bottom-full left-1/2 mb-2 -translate-x-1/2" style={{ transform: `translate(-50%, ${o ? "-4px" : "4px"})` }}>
        <div className="whitespace-nowrap rounded-xl border border-white/15 bg-white/[0.08] px-3 py-1.5 text-[11.5px] text-white shadow-[0_10px_40px_-8px_rgba(0,0,0,.7)] backdrop-blur-xl">✨ Glass tooltip</div>
      </TP>
    </Stage></div>
  );
}

/* 4 — Slide From Right */
function SlideRight() {
  const [o, s] = useState(false); const ref = useTilePreview(s);
  return (
    <div ref={ref}><Stage><Target />
      <TP open={o} className="left-full top-1/2 ml-3 -translate-y-1/2" style={{ transform: `translate(${o ? "0" : "-6px"}, -50%)` }}>
        <div className="whitespace-nowrap rounded-md bg-neutral-800 px-2.5 py-1.5 text-[11.5px] text-white shadow-lg">Slides in from right</div>
      </TP>
    </Stage></div>
  );
}

/* 5 — Rich Popover */
function RichPopover() {
  const [o, s] = useState(false); const ref = useTilePreview(s);
  return (
    <div ref={ref}><Stage><Target label="Profile" />
      <TP open={o} className="top-full mt-3" style={{ left: "calc(50% - 7rem)", transform: `translateY(${o ? "0px" : "-4px"})` }}>
        <div className="w-56 rounded-xl border border-white/10 bg-[#0e0e10] p-3 shadow-[0_20px_50px_-16px_rgba(0,0,0,.9)]">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 text-[11px] font-bold text-white">AL</span>
            <div>
              <div className="text-[12.5px] font-medium text-white">Aditya Loveable</div>
              <div className="text-[10.5px] text-white/50">Online now</div>
            </div>
          </div>
        </div>
      </TP>
    </Stage></div>
  );
}

/* 6 — Neon Border */
function NeonBorder() {
  const [o, s] = useState(false); const ref = useTilePreview(s);
  return (
    <div ref={ref}><Stage><Target />
      <TP open={o} className="bottom-full left-1/2 mb-2 -translate-x-1/2" style={{ transform: `translate(-50%, ${o ? "-4px" : "4px"})` }}>
        <div className="whitespace-nowrap rounded-lg bg-black px-3 py-1.5 text-[11.5px] font-medium text-cyan-300 ring-1 ring-cyan-400/60 shadow-[0_0_24px_rgba(34,211,238,.4)]">SYSTEM READY</div>
      </TP>
    </Stage></div>
  );
}

/* 7 — Shortcut */
function ShortcutTip() {
  const [o, s] = useState(false); const ref = useTilePreview(s);
  return (
    <div ref={ref}><Stage><Target label="Save" />
      <TP open={o} className="bottom-full left-1/2 mb-2 -translate-x-1/2" style={{ transform: `translate(-50%, ${o ? "-4px" : "4px"})` }}>
        <div className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-neutral-900 px-2.5 py-1.5 text-[11.5px] text-white shadow-xl ring-1 ring-white/10">
          Save
          <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-white/80">⌘S</span>
        </div>
      </TP>
    </Stage></div>
  );
}

/* 8 — Bounce */
function Bounce() {
  const [o, s] = useState(false); const ref = useTilePreview(s);
  return (
    <div ref={ref}><Stage><Target />
      <TP open={o} className="bottom-full left-1/2 mb-2 -translate-x-1/2" style={{ transform: `translate(-50%, ${o ? "-6px scale(1)" : "0 scale(0.9)"})`, transformOrigin: "bottom center" }}>
        <div className="whitespace-nowrap rounded-full bg-fuchsia-500 px-3 py-1.5 text-[11.5px] font-semibold text-white shadow-[0_10px_24px_-8px_rgba(232,121,249,.7)]">Yay! 🎉</div>
      </TP>
    </Stage></div>
  );
}

/* 9 — Info Icon */
function InfoIcon() {
  const [o, s] = useState(false); const ref = useTilePreview(s);
  return (
    <div ref={ref}><Stage>
      <span className="grid h-6 w-6 place-items-center rounded-full bg-white/10 text-[11px] font-bold text-white/70">i</span>
      <TP open={o} className="bottom-full left-1/2 mb-2 -translate-x-1/2" style={{ transform: `translate(-50%, ${o ? "-4px" : "0"})` }}>
        <div className="w-44 rounded-lg bg-neutral-900 px-3 py-2 text-[11px] leading-snug text-white/85 shadow-lg ring-1 ring-white/10">This is a longer helpful tip explaining the feature in context.</div>
      </TP>
    </Stage></div>
  );
}

/* 10 — Arrow Left */
function ArrowLeft() {
  const [o, s] = useState(false); const ref = useTilePreview(s);
  return (
    <div ref={ref}><Stage><Target />
      <TP open={o} className="right-full top-1/2 mr-3 -translate-y-1/2" style={{ transform: `translate(${o ? "0" : "6px"}, -50%)` }}>
        <div className="flex items-center whitespace-nowrap rounded-md bg-neutral-900 px-2.5 py-1.5 text-[11.5px] text-white shadow-lg ring-1 ring-white/10">Left side<span className="ml-1 h-2 w-2 rotate-45 bg-neutral-900" /></div>
      </TP>
    </Stage></div>
  );
}

/* 11 — Status Dot Colored */
function StatusDot() {
  const [o, s] = useState(false); const ref = useTilePreview(s);
  return (
    <div ref={ref}><Stage><Target label="Server" />
      <TP open={o} className="bottom-full left-1/2 mb-2 -translate-x-1/2" style={{ transform: `translate(-50%, ${o ? "-4px" : "0"})` }}>
        <div className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-emerald-500/10 px-2.5 py-1.5 text-[11.5px] font-medium text-emerald-300 ring-1 ring-emerald-400/40">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" /> All systems operational
        </div>
      </TP>
    </Stage></div>
  );
}

/* 12 — Command Palette Tip */
function CmdPalette() {
  const [o, s] = useState(false); const ref = useTilePreview(s);
  return (
    <div ref={ref}><Stage><Target label="⌘K" />
      <TP open={o} className="bottom-full left-1/2 mb-2 -translate-x-1/2" style={{ transform: `translate(-50%, ${o ? "-4px" : "0"})` }}>
        <div className="whitespace-nowrap rounded-lg bg-[#0d0d10] px-2.5 py-1.5 text-[11px] text-white/85 shadow-xl ring-1 ring-violet-400/40">Open command menu</div>
      </TP>
    </Stage></div>
  );
}

/* 13 — Underline */
function UnderlineTip() {
  const [o, s] = useState(false); const ref = useTilePreview(s);
  return (
    <div ref={ref}><Stage>
      <span className="cursor-help border-b border-dashed border-white/50 text-[13px] text-white/85">glossary term</span>
      <TP open={o} className="top-full left-1/2 mt-3 w-52" style={{ transform: `translate(-50%, ${o ? "0px" : "-4px"})` }}>
        <div className="rounded-lg bg-neutral-900 p-2.5 text-[11px] leading-snug text-white/85 shadow-lg ring-1 ring-white/10">A dashed underline signals a term that expands into more context when hovered.</div>
      </TP>
    </Stage></div>
  );
}


/* 14 — Emoji Tip */
function EmojiTip() {
  const [o, s] = useState(false); const ref = useTilePreview(s);
  return (
    <div ref={ref}><Stage><Target label="Like" />
      <TP open={o} className="bottom-full left-1/2 mb-2 -translate-x-1/2" style={{ transform: `translate(-50%, ${o ? "-6px" : "0"})` }}>
        <div className="whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-[13px] shadow-lg">❤️ 🎉 🔥 👏 🚀</div>
      </TP>
    </Stage></div>
  );
}

/* 15 — Dark Card w/ Header */
function CardHeaderTip() {
  const [o, s] = useState(false); const ref = useTilePreview(s);
  return (
    <div ref={ref}><Stage><Target />
      <TP open={o} className="bottom-full left-1/2 mb-2 -translate-x-1/2" style={{ transform: `translate(-50%, ${o ? "-4px" : "0"})` }}>
        <div className="w-56 overflow-hidden rounded-xl bg-neutral-900 shadow-2xl ring-1 ring-white/10">
          <div className="border-b border-white/8 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-white/60">Feature Preview</div>
          <div className="px-3 py-2 text-[11.5px] text-white/85">Structured tooltip with distinct header and body sections.</div>
        </div>
      </TP>
    </Stage></div>
  );
}

/* 16 — Blur to sharp */
function BlurSharp() {
  const [o, s] = useState(false); const ref = useTilePreview(s);
  return (
    <div ref={ref}><Stage><Target />
      <TP open={o} className="bottom-full left-1/2 mb-2 -translate-x-1/2" style={{ transform: `translate(-50%, ${o ? "-4px" : "0"})`, filter: o ? "blur(0px)" : "blur(6px)" }}>
        <div className="whitespace-nowrap rounded-lg bg-cyan-500 px-3 py-1.5 text-[11.5px] font-semibold text-white shadow-lg">Focus in</div>
      </TP>
    </Stage></div>
  );
}

/* 17 — Bottom Arrow */
function BottomArrow() {
  const [o, s] = useState(false); const ref = useTilePreview(s);
  return (
    <div ref={ref}><Stage><Target />
      <TP open={o} className="top-full left-1/2 mt-2 -translate-x-1/2" style={{ transform: `translate(-50%, ${o ? "0" : "-6px"})` }}>
        <span className="mx-auto -mb-1 block h-2 w-2 rotate-45 bg-neutral-900" />
        <div className="whitespace-nowrap rounded-lg bg-neutral-900 px-2.5 py-1.5 text-[11.5px] text-white shadow-lg">Bottom aligned</div>
      </TP>
    </Stage></div>
  );
}

/* 18 — Icon Callout */
function IconCallout() {
  const [o, s] = useState(false); const ref = useTilePreview(s);
  return (
    <div ref={ref}><Stage><Target label="Delete" />
      <TP open={o} className="top-full left-1/2 mt-3 -translate-x-1/2" style={{ transform: `translate(-50%, ${o ? "0px" : "-4px"})` }}>
        <div className="flex items-center gap-2 whitespace-nowrap rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-[11.5px] text-rose-200 shadow-lg backdrop-blur-sm">
          <span>⚠</span> This action cannot be undone.
        </div>
      </TP>
    </Stage></div>
  );
}

/* 19 — Progress Tooltip */
function ProgressTip() {
  const [o, s] = useState(false); const ref = useTilePreview(s);
  return (
    <div ref={ref}><Stage><Target label="Upload" />
      <TP open={o} className="bottom-full left-1/2 mb-2 -translate-x-1/2 w-40" style={{ transform: `translate(-50%, ${o ? "-4px" : "0"})` }}>
        <div className="rounded-xl bg-neutral-900 p-2.5 ring-1 ring-white/10">
          <div className="flex items-center justify-between text-[10.5px] text-white/70"><span>Uploading</span><span>68%</span></div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
            <span className="block h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" style={{ width: "68%" }} />
          </div>
        </div>
      </TP>
    </Stage></div>
  );
}

/* 20 — Split Rows */
function SplitRows() {
  const [o, s] = useState(false); const ref = useTilePreview(s);
  return (
    <div ref={ref}><Stage><Target label="Menu" />
      <TP open={o} className="bottom-full left-1/2 mb-2 -translate-x-1/2" style={{ transform: `translate(-50%, ${o ? "-4px" : "0"})` }}>
        <div className="w-40 divide-y divide-white/8 rounded-lg bg-neutral-900 ring-1 ring-white/10">
          {["Edit", "Duplicate", "Archive"].map((x) => (
            <div key={x} className="px-3 py-1.5 text-[11.5px] text-white/85">{x}</div>
          ))}
        </div>
      </TP>
    </Stage></div>
  );
}

/* 21 — Bubble */
function Bubble() {
  const [o, s] = useState(false); const ref = useTilePreview(s);
  return (
    <div ref={ref}><Stage><Target />
      <TP open={o} className="bottom-full left-1/2 mb-3 -translate-x-1/2" style={{ transform: `translate(-50%, ${o ? "-4px scale(1)" : "0 scale(0.5)"})`, transformOrigin: "bottom center" }}>
        <div className="whitespace-nowrap rounded-3xl bg-gradient-to-br from-pink-400 to-rose-500 px-4 py-2 text-[12px] font-bold text-white shadow-[0_16px_36px_-12px_rgba(244,63,94,.6)]">Yay ✨</div>
      </TP>
    </Stage></div>
  );
}

/* 22 — Typewriter (fake — static) */
function Typewriter() {
  const [o, s] = useState(false); const ref = useTilePreview(s);
  return (
    <div ref={ref}><Stage><Target />
      <TP open={o} className="bottom-full left-1/2 mb-2 -translate-x-1/2" style={{ transform: `translate(-50%, ${o ? "-4px" : "0"})` }}>
        <div className="whitespace-nowrap rounded-lg bg-neutral-950 px-3 py-1.5 font-mono text-[11px] text-emerald-300 ring-1 ring-emerald-400/30">$ nova build_<span className="ml-0.5 inline-block h-3 w-1 -mb-0.5 bg-emerald-300" /></div>
      </TP>
    </Stage></div>
  );
}

/* 23 — Long Ambient */
function LongAmbient() {
  const [o, s] = useState(false); const ref = useTilePreview(s);
  return (
    <div ref={ref}><Stage><Target />
      <TP open={o} className="top-full left-1/2 mt-3 -translate-x-1/2" style={{ transform: `translate(calc(-50% + 64px), ${o ? "0px" : "-4px"})` }}>
        <div className="relative w-52 overflow-hidden rounded-xl bg-neutral-900 p-3 ring-1 ring-white/10">
          <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full opacity-40 blur-2xl" style={{ background: "radial-gradient(circle,#a78bfa,transparent)" }} />
          <div className="relative text-[11.5px] font-medium text-white">Ambient background</div>
          <div className="relative text-[10.5px] text-white/60">Subtle color pooling behind content.</div>
        </div>
      </TP>
    </Stage></div>
  );
}

/* 24 — Follow Cursor (fake — centered) */
function FollowFake() {
  const [o, s] = useState(false); const ref = useTilePreview(s);
  return (
    <div ref={ref}><Stage><Target />
      <TP open={o} className="bottom-full left-1/2 mb-2 -translate-x-1/2" style={{ transform: `translate(-50%, ${o ? "-4px" : "0"})` }}>
        <div className="whitespace-nowrap rounded-md bg-white px-2.5 py-1 text-[11px] font-medium text-black shadow-lg">Follows cursor</div>
      </TP>
    </Stage></div>
  );
}

/* 25 — Kbd Cluster */
function KbdCluster() {
  const [o, s] = useState(false); const ref = useTilePreview(s);
  return (
    <div ref={ref}><Stage><Target label="Search" />
      <TP open={o} className="bottom-full left-1/2 mb-2 -translate-x-1/2" style={{ transform: `translate(-50%, ${o ? "-4px" : "0"})` }}>
        <div className="flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-neutral-900 px-2.5 py-1.5 text-[11px] text-white/85 ring-1 ring-white/10">
          Search
          <kbd className="rounded bg-white/10 px-1 py-0.5 text-[9.5px] font-mono">⌘</kbd>
          <kbd className="rounded bg-white/10 px-1 py-0.5 text-[9.5px] font-mono">K</kbd>
        </div>
      </TP>
    </Stage></div>
  );
}

/* --- Registry --- */
type Entry = { id: string; name: string; C: () => ReactNode };
const ENTRIES: Entry[] = [
  { id: "tp-01", name: "Classic Top", C: ClassicTop },
  { id: "tp-02", name: "Gradient Halo", C: GradientHalo },
  { id: "tp-03", name: "Glass Blur", C: GlassBlur },
  { id: "tp-04", name: "Slide Right", C: SlideRight },
  { id: "tp-05", name: "Rich Popover", C: RichPopover },
  { id: "tp-06", name: "Neon Border", C: NeonBorder },
  { id: "tp-07", name: "Shortcut", C: ShortcutTip },
  { id: "tp-08", name: "Bounce", C: Bounce },
  { id: "tp-09", name: "Info Icon", C: InfoIcon },
  { id: "tp-10", name: "Arrow Left", C: ArrowLeft },
  { id: "tp-11", name: "Status Dot", C: StatusDot },
  { id: "tp-12", name: "Command Palette", C: CmdPalette },
  { id: "tp-13", name: "Underline Term", C: UnderlineTip },
  { id: "tp-14", name: "Emoji Reactions", C: EmojiTip },
  { id: "tp-15", name: "Card Header", C: CardHeaderTip },
  { id: "tp-16", name: "Blur to Sharp", C: BlurSharp },
  { id: "tp-17", name: "Bottom Arrow", C: BottomArrow },
  { id: "tp-18", name: "Warning Callout", C: IconCallout },
  { id: "tp-19", name: "Progress Tip", C: ProgressTip },
  { id: "tp-20", name: "Split Rows", C: SplitRows },
  { id: "tp-21", name: "Bubble", C: Bubble },
  { id: "tp-22", name: "Typewriter", C: Typewriter },
  { id: "tp-23", name: "Long Ambient", C: LongAmbient },
  { id: "tp-24", name: "Follow Cursor", C: FollowFake },
  { id: "tp-25", name: "Kbd Cluster", C: KbdCluster },
];

export const TOOLTIPS: TooltipItem[] = ENTRIES.map((e) => ({
  id: e.id,
  name: e.name,
  render: () => <e.C />,
  code: `// ${e.name} — Novix UI premium tooltip\n// Full source available in /src/data/tooltips.tsx`,
}));
