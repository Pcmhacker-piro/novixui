import { useState, useRef, type ReactNode } from "react";
import { motion } from "motion/react";
import { ArrowRight, Heart, Moon, Plus, Sun, Github, Sparkles, Sliders } from "lucide-react";
import { Avatar, Badge, Card } from "@/nova";
import { CodeModal } from "@/components/elements/code-modal";
import { extractSnippet } from "@/lib/snippet";

export const CATEGORIES = [
  "All",
  "Buttons",
  "Loaders",
  "Toggles",
  "Checkboxes",
  "Cards",
  "Inputs",
  "Tooltips",
] as const;
export type Category = (typeof CATEGORIES)[number];

export type Creation = {
  id: string;
  name: string;
  author: string;
  likes: number;
  category: Exclude<Category, "All">;
  tag: "React" | "CSS" | "Tailwind";
  render: () => ReactNode;
};

export const MOSAIC_TILES: Array<{ id: string; category: string; render: () => ReactNode }> = [
  { id: "m1", category: "Buttons", render: () => (
    <button className="group/el inline-flex h-10 items-center gap-2 rounded-full border-2 border-lime-400 bg-transparent px-5 text-sm font-medium text-lime-400 transition-all duration-300 hover:bg-lime-400 hover:text-neutral-900 hover:shadow-[0_0_24px_-4px_#a3e635]">
      Modern Button
    </button>
  ) },
  { id: "m2", category: "Buttons", render: () => (
    <button className="relative h-10 overflow-hidden rounded-full bg-neutral-900 px-6 text-sm font-medium text-white ring-1 ring-white/10 transition-transform duration-300 hover:scale-[1.04]">
      <span className="relative z-10">Explore</span>
      <span aria-hidden className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
    </button>
  ) },
  { id: "m3", category: "Buttons", render: () => (
    <button className="group/el inline-flex h-10 items-center gap-2 rounded-full border border-white/15 bg-neutral-900 px-5 text-sm font-medium text-white transition-colors hover:border-white/40">
      Button
      <span className="grid size-5 place-items-center rounded-full bg-white/10 transition-transform duration-500 group-hover/el:translate-x-0.5 group-hover/el:scale-110">▶</span>
    </button>
  ) },
  { id: "m4", category: "Checkboxes", render: () => (
    <label className="group/el inline-flex items-center gap-2 text-sm text-white/80">
      <span className="grid size-4 place-items-center rounded-[4px] border border-white/25 transition-all duration-300 group-hover/el:border-emerald-400 group-hover/el:bg-emerald-400/20 group-hover:[&_svg]:opacity-100">
        <svg viewBox="0 0 12 12" className="size-3 text-emerald-400 opacity-0 transition-opacity duration-300"><path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M2 6.5L5 9.5L10 3.5"/></svg>
      </span>
      Morning
    </label>
  ) },
  { id: "m5", category: "Loaders", render: () => (
    <div className="rounded-2xl bg-[#111] px-6 py-4">
      <div className="flex items-center rounded-lg font-mono text-[17px] font-medium text-neutral-400">
        <span>loading</span>
        <div className="relative ml-1.5 h-6 overflow-hidden">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 z-20"
            style={{ background: "linear-gradient(#111 12%, transparent 32%, transparent 68%, #111 88%)" }}
          />
          <div className="flex flex-col pl-1 text-[#956afa] motion-safe:animate-[nova-mosaic-words_8s_cubic-bezier(0.76,0,0.24,1)_infinite]">
            <span className="block h-6 leading-6">buttons</span>
            <span className="block h-6 leading-6">forms</span>
            <span className="block h-6 leading-6">cards</span>
            <span className="block h-6 leading-6">menus</span>
            <span className="block h-6 leading-6">buttons</span>
          </div>
        </div>
      </div>
    </div>
  ) },

  { id: "m6", category: "Inputs", render: () => (
    <div className="group/el inline-flex h-9 w-40 items-center rounded-md border border-white/15 bg-white/5 px-3 text-xs text-white/50 transition-colors focus-within:border-indigo-400/60 group-hover:border-white/25">
      <span>Type here</span>
      <span className="ml-0.5 inline-block h-3 w-px bg-white/70 motion-safe:animate-[nova-caret_1s_steps(2)_infinite]" />
      <span className="ml-auto text-white/40">/</span>
    </div>
  ) },
  { id: "m7", category: "Buttons", render: () => (
    <button className="group/el inline-flex h-10 items-center gap-2 rounded-md bg-neutral-800 px-4 text-sm text-white transition-colors hover:bg-neutral-700">
      <Plus size={14} className="transition-transform duration-500 group-hover/el:rotate-90" /> Message
    </button>
  ) },
  { id: "m8", category: "Loaders", render: () => (
    <div className="relative h-20 w-28 overflow-hidden [perspective:420px]">
      <div
        aria-hidden
        className="absolute inset-2 rounded-full opacity-40 blur-2xl"
        style={{ background: "radial-gradient(circle, rgba(45,212,191,0.45), transparent 68%)" }}
      />
      <div className="absolute inset-0 motion-safe:animate-[nova-stairs-scroll_0.92s_linear_infinite]">
        {Array.from({ length: 15 }).map((_, i) => (
          <span
            key={i}
            className="absolute h-[3px] w-4 rounded-[2px] bg-gradient-to-b from-teal-200 via-teal-300 to-teal-500 shadow-[0_1px_0_rgba(0,0,0,0.65),0_0_10px_rgba(45,212,191,0.28)]"
            style={{ left: `${i * 16 - 40}px`, bottom: `${i * 10 - 26}px` }}
          />
        ))}
      </div>
      <span
        aria-hidden
        className="absolute left-12 bottom-[27px] h-1.5 w-4 rounded-full bg-teal-300/25 blur-[2px] motion-safe:animate-[nova-ball-shadow_0.92s_cubic-bezier(.34,0,.2,1)_infinite]"
      />
      <span
        className="absolute left-12 bottom-[27px] size-2.5 rounded-full bg-white shadow-[inset_-2px_-2px_4px_rgba(20,184,166,0.35),0_0_14px_rgba(94,234,212,0.95)] motion-safe:animate-[nova-ball-hop_0.92s_cubic-bezier(.34,0,.2,1)_infinite]"
      />
    </div>
  ) },
  { id: "m9", category: "Loaders", render: () => (
    <div className="flex items-center gap-2">
      <span className="size-2 rounded-full bg-red-500 shadow-[0_0_8px_#f00] motion-safe:animate-[nova-rec_1.4s_ease-in-out_infinite]" />
      <div className="flex h-10 w-32 items-end gap-1 rounded-md bg-black px-3 py-2 ring-1 ring-white/10">
        {[0,1,2,3,4].map(i => (
          <span key={i} className="w-0.5 rounded-full bg-white/80 motion-safe:animate-[nova-eq_1.1s_ease-in-out_infinite]" style={{ height: "40%", animationDelay: `${i*120}ms` }} />
        ))}
      </div>
    </div>
  ) },
  { id: "m10", category: "Buttons", render: () => (
    <span className="grid size-9 place-items-center rounded-[10px] border border-white/25 transition-all duration-500 hover:rotate-45 hover:border-white/60" />
  ) },
  { id: "m11", category: "Buttons", render: () => (
    <button className="group/el inline-flex h-9 items-center gap-2 rounded-full bg-lime-400 px-4 text-sm font-medium text-neutral-900 transition-shadow hover:shadow-[0_10px_30px_-8px_#a3e635]">
      <span className="grid size-4 place-items-center rounded-full bg-neutral-900 text-lime-400 text-[9px] transition-transform duration-500 group-hover/el:rotate-180">◈</span>
      Explore
    </button>
  ) },
  { id: "m12", category: "Buttons", render: () => (
    <button className="h-10 rounded-md border-2 border-fuchsia-500 bg-black px-6 text-sm font-medium text-white shadow-[0_0_20px_-4px_#d946ef] transition-shadow duration-500 hover:shadow-[0_0_36px_-2px_#d946ef]" style={{ animation: "nova-neon-pulse 2.4s ease-in-out infinite" }}>
      Button
    </button>
  ) },
  { id: "m13", category: "Buttons", render: () => (
    <button className="group/el inline-flex h-10 items-center gap-2 rounded-full bg-blue-600 px-5 text-sm font-medium text-white transition-transform hover:-translate-y-0.5">
      <span className="grid size-5 place-items-center rounded-full bg-white/20 transition-transform duration-500 group-hover/el:translate-y-0.5">↓</span>
      Download
    </button>
  ) },
  { id: "m14", category: "Loaders", render: () => (
    <div className="flex h-10 w-32 items-center gap-2 rounded-md bg-black px-3 font-mono text-xs text-white ring-1 ring-white/10">
      Status <span className="ml-auto size-2 rounded-full bg-red-500 motion-safe:animate-[nova-rec_1.4s_ease-in-out_infinite]" />
      <span className="h-3 w-px bg-green-400 motion-safe:animate-[nova-caret_.9s_steps(2)_infinite]" />
    </div>
  ) },
  { id: "m15", category: "Buttons", render: () => (
    <button className="group/el relative inline-flex h-9 items-center gap-2 overflow-hidden rounded-md bg-violet-600/90 px-4 text-sm font-medium text-white transition-transform hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-8px_#7c3aed]">
      <span className="motion-safe:animate-[nova-zap_1.8s_ease-in-out_infinite]">⚡</span> button
      <span aria-hidden className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover/el:translate-x-full" />
    </button>
  ) },
  { id: "m16", category: "Toggles", render: () => (
    <span className="group/el relative flex h-6 w-11 items-center rounded-full bg-neutral-800 px-1 ring-1 ring-white/10 transition-colors hover:bg-emerald-500/80">
      <span className="size-4 rounded-full bg-white/90 shadow transition-transform duration-500 ease-[cubic-bezier(.5,1.6,.4,1)] group-hover/el:translate-x-5" />
    </span>
  ) },
  { id: "m17", category: "Toggles", render: () => (
    <div className="group/el flex h-8 w-14 items-center rounded-md bg-neutral-700 px-1 ring-1 ring-white/10">
      <span className="h-6 w-6 rounded bg-neutral-500 transition-all duration-500 ease-[cubic-bezier(.5,1.6,.4,1)] group-hover/el:translate-x-6 group-hover/el:bg-white/90" />
    </div>
  ) },
  { id: "m18", category: "Cards", render: () => (
    <div className="grid size-14 place-items-center rounded-lg bg-neutral-700 font-semibold text-neutral-300 transition-all duration-500 hover:-translate-y-0.5 hover:bg-neutral-600 hover:text-white" style={{ transformStyle: "preserve-3d" }}>
      Figma
    </div>
  ) },
  { id: "m19", category: "Buttons", render: () => (
    <span className="group/el grid size-10 place-items-center rounded-full border border-white/25 text-white/70 transition-all duration-500 hover:rotate-90 hover:border-white/60 hover:text-white">
      <Plus size={16} />
    </span>
  ) },
  { id: "m20", category: "Buttons", render: () => (
    <button className="group/el inline-flex h-9 items-center gap-2 rounded-full bg-sky-500/20 px-4 text-sm font-medium text-sky-300 ring-1 ring-sky-400/50 transition-all hover:bg-sky-500/30 hover:ring-sky-400">
      Apply Now <ArrowRight size={14} className="transition-transform duration-300 group-hover/el:translate-x-1" />
    </button>
  ) },
  { id: "m21", category: "Buttons", render: () => (
    <button className="group/el inline-flex h-9 items-center gap-2 rounded-md bg-neutral-900 px-3 text-xs text-white ring-1 ring-white/10 transition-colors hover:ring-white/30">
      <Github size={12} className="transition-transform duration-500 group-hover/el:rotate-[360deg]" /> Star
    </button>
  ) },
];

export function CreationTile({ creation, index }: { creation: Creation; index: number }) {
  const [liked, setLiked] = useState(false);
  const [openCode, setOpenCode] = useState(false);
  const openCodeModal = () => setOpenCode(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.04, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card padding="none" className="group overflow-hidden">
        <div
          role="button"
          tabIndex={0}
          onClick={(e) => {
            const el = e.currentTarget.closest(".group") as HTMLElement | null;
            if (!el) { openCodeModal(); return; }
            const rect = el.getBoundingClientRect();
            el.style.setProperty("--rx", `${e.clientX - rect.left}px`);
            el.style.setProperty("--ry", `${e.clientY - rect.top}px`);
            el.classList.remove("is-active", "is-pressed");
            void el.offsetWidth;
            el.classList.add("is-active", "is-pressed");
            window.setTimeout(() => el.classList.remove("is-pressed"), 260);
            window.setTimeout(() => {
              el.classList.remove("is-active");
              openCodeModal();
            }, 320);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openCodeModal();
            }
          }}
          className="relative flex h-56 cursor-pointer items-center justify-center overflow-hidden border-b border-white/5 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(255,255,255,0.04),transparent_70%),linear-gradient(180deg,#0a0a0a_0%,#050505_60%,#030303_100%)] transition-transform duration-300 group-[.is-pressed]:scale-[.985]"
        >
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
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-8 -top-1 h-full -translate-x-full skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full group-[.is-active]:translate-x-full"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute left-[var(--rx,50%)] top-[var(--ry,50%)] block h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 group-[.is-active]:opacity-100 group-[.is-active]:motion-safe:animate-[nova-mosaic-ripple_.9s_ease-out_forwards]"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--accent) 70%, transparent) 0%, color-mix(in oklab, var(--accent) 30%, transparent) 40%, transparent 70%)",
              boxShadow: "0 0 30px color-mix(in oklab, var(--accent) 60%, transparent)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-[.is-active]:opacity-100"
            style={{
              background:
                "radial-gradient(50% 50% at 50% 50%, color-mix(in oklab, var(--accent) 22%, transparent), transparent 70%)",
            }}
          />
          <div className="relative transition-transform duration-500 group-hover:scale-[1.05] group-[.is-active]:scale-[1.05]">
            {creation.render()}
          </div>
          <div className="absolute left-3 top-3">
            <Badge size="sm" variant="outline" className="font-mono">
              {creation.tag}
            </Badge>
          </div>
          <div
            className="pointer-events-none absolute bottom-2 right-2 flex items-center gap-1.5 opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-[.is-active]:opacity-100 group-[.is-active]:translate-y-0"
          >
            <span className="inline-flex items-center gap-1 rounded-md bg-accent/20 border border-accent/30 px-2 py-0.5 text-[10.5px] font-medium text-accent backdrop-blur-sm">
              <Sliders size={10} aria-hidden />
              Customize
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-white/10 border border-white/15 px-2 py-0.5 text-[10.5px] font-mono text-white/80 backdrop-blur-sm">
              {"</>"} Code
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2 min-w-0">
            <Avatar size="xs" name={creation.author} />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{creation.name}</p>
              <p className="truncate text-[11px] text-muted-foreground">
                @{creation.author.toLowerCase().replace(/\s+/g, "")} · {creation.category}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setLiked((v) => !v)}
              className="nova-focus-ring inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-subtle hover:text-foreground"
              aria-pressed={liked}
              aria-label="Like"
            >
              <Heart
                size={13}
                className={liked ? "fill-danger text-danger" : ""}
              />
              <span className="tabular-nums">
                {(creation.likes + (liked ? 1 : 0)).toLocaleString()}
              </span>
            </button>
          </div>
        </div>
      </Card>
      {openCode && (
        <CodeModal
          item={{
            id: creation.id,
            name: creation.name,
            render: creation.render,
            code: extractSnippet({ name: creation.name, render: creation.render }),
          }}
          shareCategory={creation.category}
          onClose={() => setOpenCode(false)}
        />
      )}
    </motion.div>
  );
}

function GradientButton() {
  return (
    <button className="relative inline-flex h-11 items-center justify-center overflow-hidden rounded-full px-6 text-sm font-medium text-white transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0">
      <span className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,var(--accent),#a78bfa,#22d3ee,var(--accent))] [animation:nova-spin_4s_linear_infinite]" />
      <span className="absolute inset-[2px] rounded-full bg-background" />
      <span className="relative bg-[linear-gradient(90deg,var(--foreground),var(--accent))] bg-clip-text text-transparent">
        Launch app
      </span>
      <style>{`@keyframes nova-spin { to { transform: rotate(360deg); } }`}</style>
    </button>
  );
}

function LiquidButton() {
  return (
    <button className="group relative inline-flex h-11 items-center overflow-hidden rounded-md border border-border bg-surface px-6 text-sm font-medium">
      <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
        Hover me
      </span>
      <span className="absolute inset-y-0 -left-2 z-0 w-0 rounded-md bg-accent transition-all duration-500 ease-out group-hover:w-[calc(100%+16px)]" />
    </button>
  );
}

function GhostArrow() {
  return (
    <button className="group inline-flex items-center gap-2 text-sm font-medium">
      <span className="relative">
        Continue
        <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />
      </span>
      <ArrowRight
        size={14}
        className="transition-transform duration-300 group-hover:translate-x-1"
      />
    </button>
  );
}

function OrbitLoader() {
  return (
    <div className="relative size-16">
      <span className="absolute inset-0 rounded-full border border-border" />
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="absolute inset-0 rounded-full"
          style={{
            animation: `nova-orbit 1.6s linear ${i * 0.2}s infinite`,
          }}
        >
          <span
            className="absolute left-1/2 top-0 size-2 -translate-x-1/2 rounded-full bg-accent"
            style={{ boxShadow: "0 0 12px var(--accent)" }}
          />
        </span>
      ))}
      <style>{`@keyframes nova-orbit { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function BarsLoader() {
  return (
    <div className="flex items-end gap-1.5 h-14">
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="w-1.5 rounded-sm bg-gradient-to-t from-accent/40 to-accent"
          style={{
            animation: `nova-bar 1s ease-in-out ${i * 0.12}s infinite`,
          }}
        />
      ))}
      <style>{`@keyframes nova-bar { 0%,100% { height: 20%; } 50% { height: 100%; } }`}</style>
    </div>
  );
}

function PulseDots() {
  return (
    <div className="flex items-center gap-2">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-2.5 rounded-full bg-accent"
          style={{
            animation: `nova-pulse 1.2s ease-in-out ${i * 0.15}s infinite`,
          }}
        />
      ))}
      <style>{`@keyframes nova-pulse { 0%,100% { opacity: .3; transform: scale(.8); } 50% { opacity: 1; transform: scale(1.15); } }`}</style>
    </div>
  );
}

function NeonToggle() {
  const [on, setOn] = useState(true);
  return (
    <button
      onClick={() => setOn((v) => !v)}
      aria-pressed={on}
      className={
        "relative inline-flex h-8 w-14 items-center rounded-full border transition-colors duration-300 " +
        (on
          ? "border-accent bg-accent/20 shadow-[0_0_18px_color-mix(in_oklab,var(--accent)_50%,transparent)]"
          : "border-border bg-subtle")
      }
    >
      <span
        className={
          "size-6 rounded-full bg-background shadow-md transition-transform duration-300 " +
          (on ? "translate-x-7 bg-accent text-white" : "translate-x-1")
        }
      />
    </button>
  );
}

function DayNightToggle() {
  const [dark, setDark] = useState(false);
  return (
    <button
      onClick={() => setDark((v) => !v)}
      className={
        "relative flex h-9 w-16 items-center rounded-full px-1 transition-colors duration-500 " +
        (dark ? "bg-[#0b1226]" : "bg-[#8ec5fc]")
      }
    >
      <span
        className={
          "grid size-7 place-items-center rounded-full transition-transform duration-500 " +
          (dark
            ? "translate-x-7 bg-slate-200 text-slate-800"
            : "translate-x-0 bg-yellow-300 text-yellow-800")
        }
      >
        {dark ? <Moon size={14} /> : <Sun size={14} />}
      </span>
    </button>
  );
}

function FancyCheckbox() {
  const [checked, setChecked] = useState(true);
  return (
    <label className="inline-flex cursor-pointer items-center gap-3">
      <span
        onClick={() => setChecked((v) => !v)}
        className={
          "relative grid size-6 place-items-center rounded-md border transition-all duration-200 " +
          (checked
            ? "border-accent bg-accent shadow-[0_0_0_4px_color-mix(in_oklab,var(--accent)_20%,transparent)]"
            : "border-border bg-surface")
        }
      >
        <motion.svg
          viewBox="0 0 24 24"
          width={14}
          height={14}
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={checked ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        >
          <motion.path d="M5 12 L10 17 L19 7" />
        </motion.svg>
      </span>
      <span className="text-sm">Ship it</span>
    </label>
  );
}

function GlowCard() {
  const ref = useRef<HTMLDivElement | null>(null);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--px", `${x * 100}%`);
    el.style.setProperty("--py", `${y * 100}%`);
    el.style.setProperty("--rx", `${(0.5 - y) * 14}deg`);
    el.style.setProperty("--ry", `${(x - 0.5) * 16}deg`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
  };
  return (
    <div className="group [perspective:900px]" onMouseMove={onMove} onMouseLeave={onLeave}>
      <div
        ref={ref}
        className="relative w-56 rounded-2xl border border-white/10 bg-[linear-gradient(140deg,#0b0b12_0%,#111124_55%,#0a0a14_100%)] p-5 text-white shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)] transition-transform duration-300 ease-out will-change-transform"
        style={{
          transform:
            "rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)) translateZ(0)",
          transformStyle: "preserve-3d",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-60 blur-[6px] transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "conic-gradient(from 0deg, #ec4899, #a78bfa, #22d3ee, #f472b6, #ec4899)",
            animation: "nova-spin 6s linear infinite",
            maskImage:
              "linear-gradient(#000,#000) content-box, linear-gradient(#000,#000)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            padding: 1,
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(200px 140px at var(--px,50%) var(--py,50%), rgba(255,255,255,0.14), transparent 60%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full opacity-80 blur-xl"
          style={{
            background:
              "radial-gradient(circle, rgba(236,72,153,0.7), rgba(139,92,246,0.2) 60%, transparent 70%)",
            transform: "translateZ(40px)",
          }}
        />
        <div className="relative" style={{ transform: "translateZ(30px)" }}>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
            <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-fuchsia-300/90">
              Pro · Live
            </p>
          </div>
          <p className="mt-2 bg-gradient-to-br from-white to-white/60 bg-clip-text text-lg font-semibold text-transparent">
            Novix Cloud
          </p>
          <p className="mt-1 text-xs text-white/60">
            Deploy elements in seconds.
          </p>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex -space-x-1.5">
              {["#ec4899", "#a78bfa", "#22d3ee"].map((c) => (
                <span
                  key={c}
                  className="h-4 w-4 rounded-full border border-black/40"
                  style={{ background: c }}
                />
              ))}
            </div>
            <span
              className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-white/80 backdrop-blur"
              style={{ transform: "translateZ(20px)" }}
            >
              Deploy →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function GlassInput() {
  return (
    <div className="relative w-56">
      <input
        type="text"
        placeholder=" "
        className="peer h-11 w-full rounded-md border border-border bg-surface/60 px-3 pt-3 text-sm outline-none backdrop-blur transition-colors focus:border-accent"
      />
      <label className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground transition-all peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-accent peer-[&:not(:placeholder-shown)]:top-2 peer-[&:not(:placeholder-shown)]:text-[10px]">
        Email address
      </label>
    </div>
  );
}

function AnimatedTooltip() {
  return (
    <div className="group relative">
      <button className="inline-flex h-10 items-center rounded-md border border-border bg-surface px-4 text-sm">
        Hover me
      </button>
      <div className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[11px] font-medium text-background opacity-0 shadow-lg transition-all duration-200 group-hover:-translate-y-[calc(100%+2px)] group-hover:opacity-100">
        Copy to clipboard
        <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-foreground" />
      </div>
    </div>
  );
}

export const CREATIONS: Creation[] = [
  { id: "1", name: "Gradient Ring Button", author: "Ada", likes: 2431, category: "Buttons", tag: "React", render: GradientButton },
  { id: "2", name: "Liquid Fill", author: "Grace", likes: 1820, category: "Buttons", tag: "CSS", render: LiquidButton },
  { id: "3", name: "Ghost Arrow", author: "Alan", likes: 940, category: "Buttons", tag: "Tailwind", render: GhostArrow },
  { id: "4", name: "Orbit", author: "Katherine", likes: 3120, category: "Loaders", tag: "CSS", render: OrbitLoader },
  { id: "5", name: "Equalizer", author: "Linus", likes: 1580, category: "Loaders", tag: "CSS", render: BarsLoader },
  { id: "6", name: "Pulse Dots", author: "Marie", likes: 1204, category: "Loaders", tag: "Tailwind", render: PulseDots },
  { id: "7", name: "Neon Switch", author: "Nikola", likes: 2201, category: "Toggles", tag: "React", render: NeonToggle },
  { id: "8", name: "Day / Night", author: "Rosalind", likes: 4020, category: "Toggles", tag: "React", render: DayNightToggle },
  { id: "9", name: "Spring Check", author: "Hedy", likes: 1730, category: "Checkboxes", tag: "React", render: FancyCheckbox },
  { id: "10", name: "Aurora Card", author: "Tim", likes: 2890, category: "Cards", tag: "Tailwind", render: GlowCard },
  { id: "11", name: "Floating Label", author: "Barbara", likes: 1102, category: "Inputs", tag: "Tailwind", render: GlassInput },
  { id: "12", name: "Snap Tooltip", author: "Dennis", likes: 984, category: "Tooltips", tag: "CSS", render: AnimatedTooltip },
];
