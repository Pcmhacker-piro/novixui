import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";

export type InputItem = {
  id: string;
  name: string;
  render: () => ReactNode;
  code: string;
};

/* Hover previewer — while the tile is hovered, we focus + populate the input to show its interactive state. */
function useHoverFocus(inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>, previewValue: string) {
  const wrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const host = (el.closest("[data-in-hover-host]") as HTMLElement | null) ?? el;
    let originalValue = "";
    let active = false;
    const enter = () => {
      const input = inputRef.current;
      if (!input || active) return;
      active = true;
      originalValue = input.value;
      input.focus({ preventScroll: true });
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set
                  ?? Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
      setter?.call(input, previewValue);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    };
    const leave = () => {
      const input = inputRef.current;
      if (!input || !active) return;
      active = false;
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set
                  ?? Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
      setter?.call(input, originalValue);
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.blur();
    };
    host.addEventListener("mouseenter", enter);
    host.addEventListener("mouseleave", leave);
    return () => {
      host.removeEventListener("mouseenter", enter);
      host.removeEventListener("mouseleave", leave);
    };
  }, [inputRef, previewValue]);
  return wrapRef;
}

function Stage({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div className="w-full max-w-[280px]" style={style}>{children}</div>;
}

/* 1 — Classic Underline (Material) */
function ClassicUnderline() {
  const [v, setV] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const wrap = useHoverFocus(inputRef, "Alex Cooper");
  const has = v.length > 0;
  return (
    <div ref={wrap}><Stage>
      <div className="relative">
        <input ref={inputRef} value={v} onChange={(e) => setV(e.target.value)} className="peer h-10 w-full bg-transparent px-1 text-[13px] text-white outline-none" />
        <label className={`pointer-events-none absolute left-1 top-1/2 -translate-y-1/2 text-[13px] text-white/40 transition-all peer-focus:top-0 peer-focus:-translate-y-full peer-focus:text-[10.5px] peer-focus:text-cyan-300 ${has ? "!top-0 !-translate-y-full !text-[10.5px] !text-cyan-300" : ""}`}>Full name</label>
        <div className="relative mt-1 h-px w-full bg-white/15">
          <span className="absolute inset-y-0 left-1/2 w-0 -translate-x-1/2 bg-gradient-to-r from-cyan-400 to-violet-500 transition-all peer-focus:w-full" style={{ width: has ? "100%" : undefined }} />
        </div>
      </div>
    </Stage></div>
  );
}

/* 2 — Glow Ring */
function GlowRing() {
  const [v, setV] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const wrap = useHoverFocus(inputRef, "hello@nova.ui");
  return (
    <div ref={wrap}><Stage>
      <input ref={inputRef} value={v} onChange={(e) => setV(e.target.value)} placeholder="Email" className="peer h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 text-[13px] text-white placeholder:text-white/40 outline-none transition-all focus:border-fuchsia-400 focus:shadow-[0_0_0_4px_rgba(232,121,249,.15),0_0_20px_-2px_rgba(232,121,249,.5)]" />
    </Stage></div>
  );
}

/* 3 — Gradient Border */
function GradientBorder() {
  const [v, setV] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const wrap = useHoverFocus(inputRef, "nova/ui");
  return (
    <div ref={wrap}><Stage>
      <div className="rounded-xl p-[1.5px]" style={{ background: "linear-gradient(135deg,#7c3aed,#ec4899,#f97316)" }}>
        <input ref={inputRef} value={v} onChange={(e) => setV(e.target.value)} placeholder="Project name" className="h-11 w-full rounded-[10.5px] bg-[#0a0a0b] px-3 text-[13px] text-white placeholder:text-white/40 outline-none" />
      </div>
    </Stage></div>
  );
}

/* 4 — Icon Left */
function IconLeft() {
  const [v, setV] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const wrap = useHoverFocus(inputRef, "spring boots");
  return (
    <div ref={wrap}><Stage>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">🔍</span>
        <input ref={inputRef} value={v} onChange={(e) => setV(e.target.value)} placeholder="Search" className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-9 pr-3 text-[13px] text-white placeholder:text-white/40 outline-none focus:border-cyan-400" />
      </div>
    </Stage></div>
  );
}

/* 5 — Floating Label Box */
function FloatingBox() {
  const [v, setV] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const wrap = useHoverFocus(inputRef, "Aditya");
  const has = v.length > 0;
  return (
    <div ref={wrap}><Stage>
      <div className="relative">
        <input ref={inputRef} value={v} onChange={(e) => setV(e.target.value)} className="peer h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 pt-4 text-[13px] text-white outline-none focus:border-violet-400" />
        <label className={`pointer-events-none absolute left-3 top-3.5 text-[13px] text-white/40 transition-all peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-violet-300 ${has ? "!top-1 !text-[10px] !text-violet-300" : ""}`}>First name</label>
      </div>
    </Stage></div>
  );
}

/* 6 — Password w/ Reveal */
function PasswordReveal() {
  const [v, setV] = useState("");
  const [show, setShow] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrap = useHoverFocus(inputRef, "sup3r$ecret");
  return (
    <div ref={wrap}><Stage>
      <div className="relative">
        <input ref={inputRef} type={show ? "text" : "password"} value={v} onChange={(e) => setV(e.target.value)} placeholder="Password" className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 pr-14 text-[13px] text-white placeholder:text-white/40 outline-none focus:border-emerald-400" />
        <button onClick={() => setShow((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-[10.5px] font-medium text-white/60 hover:text-white">{show ? "HIDE" : "SHOW"}</button>
      </div>
    </Stage></div>
  );
}

/* 7 — Search w Kbd */
function SearchKbd() {
  const [v, setV] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const wrap = useHoverFocus(inputRef, "Command Menu");
  return (
    <div ref={wrap}><Stage>
      <div className="relative">
        <input ref={inputRef} value={v} onChange={(e) => setV(e.target.value)} placeholder="Search anything…" className="h-11 w-full rounded-full border border-white/10 bg-white/[0.03] px-4 pr-14 text-[13px] text-white placeholder:text-white/40 outline-none focus:border-white/25 focus:bg-white/[0.06]" />
        <span className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1"><kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-white/70">⌘</kbd><kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-white/70">K</kbd></span>
      </div>
    </Stage></div>
  );
}

/* 8 — Textarea Rich */
function TextareaRich() {
  const [v, setV] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const wrap = useHoverFocus(inputRef, "Ship it 🚀");
  return (
    <div ref={wrap}><Stage>
      <div className="rounded-xl border border-white/10 bg-white/[0.03] focus-within:border-cyan-400">
        <textarea ref={inputRef} value={v} onChange={(e) => setV(e.target.value)} rows={3} placeholder="Leave a comment…" className="block w-full resize-none bg-transparent p-3 text-[13px] text-white placeholder:text-white/40 outline-none" />
        <div className="flex items-center justify-between border-t border-white/8 px-2 py-1.5"><div className="flex gap-1 text-white/50 text-[13px]"><span>B</span><span className="italic">I</span></div><span className="rounded bg-cyan-500 px-2 py-0.5 text-[10.5px] font-semibold text-white">Send</span></div>
      </div>
    </Stage></div>
  );
}

/* 9 — OTP-style single */
function OtpSingle() {
  const [v, setV] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const wrap = useHoverFocus(inputRef, "428913");
  return (
    <div ref={wrap}><Stage>
      <input ref={inputRef} maxLength={6} value={v} onChange={(e) => setV(e.target.value.replace(/\D/g, ""))} placeholder="••••••" className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.03] text-center font-mono text-2xl tracking-[0.6em] text-white placeholder:text-white/25 outline-none focus:border-fuchsia-400 focus:shadow-[0_0_0_4px_rgba(232,121,249,.15)]" />
    </Stage></div>
  );
}

/* 10 — Currency */
function CurrencyInput() {
  const [v, setV] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const wrap = useHoverFocus(inputRef, "1,299");
  return (
    <div ref={wrap}><Stage>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-white/60">$</span>
        <input ref={inputRef} value={v} onChange={(e) => setV(e.target.value)} placeholder="0.00" className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-6 pr-14 text-right text-[14px] font-medium text-white placeholder:text-white/30 outline-none focus:border-emerald-400" />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-white/50">USD</span>
      </div>
    </Stage></div>
  );
}

/* 11 — Success Validated */
function SuccessValidated() {
  const [v, setV] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const wrap = useHoverFocus(inputRef, "hello@nova.ui");
  const valid = /@/.test(v);
  return (
    <div ref={wrap}><Stage>
      <div className="relative">
        <input ref={inputRef} value={v} onChange={(e) => setV(e.target.value)} placeholder="Email" className={`h-11 w-full rounded-xl border bg-white/[0.03] px-3 pr-10 text-[13px] text-white placeholder:text-white/40 outline-none transition-colors ${valid ? "border-emerald-400" : "border-white/10 focus:border-white/25"}`} />
        {valid && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400">✓</span>}
      </div>
    </Stage></div>
  );
}

/* 12 — Error State */
function ErrorState() {
  const [v, setV] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const wrap = useHoverFocus(inputRef, "wrong");
  return (
    <div ref={wrap}><Stage>
      <input ref={inputRef} value={v} onChange={(e) => setV(e.target.value)} placeholder="Username" className="h-11 w-full rounded-xl border border-rose-400 bg-rose-500/5 px-3 text-[13px] text-white outline-none placeholder:text-white/40 focus:shadow-[0_0_0_4px_rgba(244,63,94,.15)]" />
      <p className="mt-1.5 text-[10.5px] font-medium text-rose-300">This username is taken.</p>
    </Stage></div>
  );
}

/* 13 — Prefixed Domain */
function PrefixedDomain() {
  const [v, setV] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const wrap = useHoverFocus(inputRef, "nova");
  return (
    <div ref={wrap}><Stage>
      <div className="flex overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] focus-within:border-cyan-400">
        <span className="grid place-items-center border-r border-white/10 bg-white/[0.03] px-3 text-[12px] text-white/50">nova.ui/</span>
        <input ref={inputRef} value={v} onChange={(e) => setV(e.target.value)} placeholder="handle" className="h-11 flex-1 bg-transparent px-3 text-[13px] text-white outline-none placeholder:text-white/40" />
      </div>
    </Stage></div>
  );
}

/* 14 — Chip Tag Input (single input, static chips) */
function TagInput() {
  const [v, setV] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const wrap = useHoverFocus(inputRef, "design");
  return (
    <div ref={wrap}><Stage>
      <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] p-2 focus-within:border-fuchsia-400">
        {["react", "ui", "animation"].map((t) => (
          <span key={t} className="rounded-md bg-white/[0.08] px-2 py-0.5 text-[11px] text-white/85">{t}</span>
        ))}
        <input ref={inputRef} value={v} onChange={(e) => setV(e.target.value)} placeholder="Add tag" className="min-w-[80px] flex-1 bg-transparent px-1 text-[12.5px] text-white outline-none placeholder:text-white/40" />
      </div>
    </Stage></div>
  );
}

/* 15 — Slider Input */
function SliderInput() {
  const [v, setV] = useState(50);
  const wrap = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = wrap.current; if (!el) return;
    const host = (el.closest("[data-in-hover-host]") as HTMLElement | null) ?? el;
    let orig = v; let active = false;
    const enter = () => { if (active) return; active = true; orig = v; setV(78); };
    const leave = () => { active = false; setV(orig); };
    host.addEventListener("mouseenter", enter); host.addEventListener("mouseleave", leave);
    return () => { host.removeEventListener("mouseenter", enter); host.removeEventListener("mouseleave", leave); };
  }, [v]);
  return (
    <div ref={wrap}><Stage>
      <div className="text-[11px] text-white/60">Volume <span className="float-right font-mono text-white">{v}</span></div>
      <div className="relative mt-2 h-1.5 w-full rounded-full bg-white/10">
        <span className="absolute inset-y-0 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-500" style={{ width: `${v}%` }} />
        <span className="absolute -top-1.5 h-4 w-4 -translate-x-1/2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,.7)] transition-all duration-500" style={{ left: `${v}%` }} />
      </div>
    </Stage></div>
  );
}

/* 16 — Character Counter */
function CharCounter() {
  const [v, setV] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const wrap = useHoverFocus(inputRef, "Hello world");
  const max = 60;
  return (
    <div ref={wrap}><Stage>
      <div className="relative">
        <input ref={inputRef} value={v} onChange={(e) => setV(e.target.value.slice(0, max))} placeholder="Bio" className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 pr-14 text-[13px] text-white outline-none placeholder:text-white/40 focus:border-cyan-400" />
        <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10.5px] font-mono ${v.length > max * 0.8 ? "text-amber-300" : "text-white/40"}`}>{v.length}/{max}</span>
      </div>
    </Stage></div>
  );
}

/* 17 — Multi-line Autogrow Fake */
function CommentBox() {
  const [v, setV] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const wrap = useHoverFocus(inputRef, "Loved it!");
  return (
    <div ref={wrap}><Stage>
      <textarea ref={inputRef} value={v} onChange={(e) => setV(e.target.value)} rows={2} placeholder="Reply…" className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-[13px] text-white outline-none placeholder:text-white/40 focus:border-violet-400 focus:shadow-[0_0_0_4px_rgba(139,92,246,.12)]" />
    </Stage></div>
  );
}

/* 18 — Segmented Prefix */
function SegPrefix() {
  const [v, setV] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const wrap = useHoverFocus(inputRef, "9832 4419");
  return (
    <div ref={wrap}><Stage>
      <div className="flex overflow-hidden rounded-xl border border-white/10">
        <span className="grid place-items-center bg-white/[0.06] px-3 text-[12px] text-white/70">🇮🇳 +91</span>
        <input ref={inputRef} value={v} onChange={(e) => setV(e.target.value)} placeholder="Phone" className="h-11 flex-1 bg-white/[0.03] px-3 text-[13px] text-white outline-none placeholder:text-white/40 focus:bg-white/[0.06]" />
      </div>
    </Stage></div>
  );
}

/* 19 — Dark Emboss */
function DarkEmboss() {
  const [v, setV] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const wrap = useHoverFocus(inputRef, "search…");
  return (
    <div ref={wrap}><Stage>
      <input ref={inputRef} value={v} onChange={(e) => setV(e.target.value)} placeholder="Type…" className="h-11 w-full rounded-xl px-3 text-[13px] text-white outline-none placeholder:text-white/40" style={{ background: "linear-gradient(180deg,#050505,#111)", boxShadow: "inset 0 2px 4px rgba(0,0,0,.6), inset 0 -1px 0 rgba(255,255,255,.06)" }} />
    </Stage></div>
  );
}

/* 20 — Neumorphic */
function Neumorphic() {
  const [v, setV] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const wrap = useHoverFocus(inputRef, "neumorphism");
  return (
    <div ref={wrap}><Stage style={{ background: "#1a1a1c", padding: 12, borderRadius: 16 }}>
      <input ref={inputRef} value={v} onChange={(e) => setV(e.target.value)} placeholder="Type…" className="h-10 w-full rounded-lg bg-[#1a1a1c] px-3 text-[13px] text-white outline-none placeholder:text-white/40" style={{ boxShadow: "inset 4px 4px 8px #0e0e10, inset -4px -4px 8px #26262a" }} />
    </Stage></div>
  );
}

/* 21 — Two-tone with helper */
function TwoTone() {
  const [v, setV] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const wrap = useHoverFocus(inputRef, "$29.00");
  return (
    <div ref={wrap}><Stage>
      <label className="text-[10.5px] font-semibold uppercase tracking-wider text-white/50">Amount</label>
      <input ref={inputRef} value={v} onChange={(e) => setV(e.target.value)} placeholder="$0.00" className="mt-1 h-11 w-full rounded-xl border-b-2 border-b-emerald-400/50 border-x border-t border-white/10 bg-white/[0.03] px-3 text-[13px] text-white placeholder:text-white/40 outline-none focus:border-b-emerald-400" />
    </Stage></div>
  );
}

/* 22 — Aurora Focus */
function AuroraFocus() {
  const [v, setV] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const wrap = useHoverFocus(inputRef, "aurora");
  return (
    <div ref={wrap}><Stage>
      <div className="relative">
        <input ref={inputRef} value={v} onChange={(e) => setV(e.target.value)} placeholder="Aurora" className="peer h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 text-[13px] text-white outline-none placeholder:text-white/40" />
        <span className="pointer-events-none absolute -inset-1 -z-10 rounded-2xl opacity-0 blur-lg transition-opacity duration-300 peer-focus:opacity-100" style={{ background: "conic-gradient(from 0deg,#7c3aed,#22d3ee,#ec4899,#7c3aed)" }} />
      </div>
    </Stage></div>
  );
}

/* 23 — Icon w Action Btn */
function IconAction() {
  const [v, setV] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const wrap = useHoverFocus(inputRef, "subscribe@nova.ui");
  return (
    <div ref={wrap}><Stage>
      <div className="relative">
        <input ref={inputRef} value={v} onChange={(e) => setV(e.target.value)} placeholder="Enter your email" className="h-11 w-full rounded-full border border-white/10 bg-white/[0.03] pl-4 pr-24 text-[12.5px] text-white outline-none placeholder:text-white/40 focus:border-white/25" />
        <button className="absolute right-1 top-1 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-3 py-1.5 text-[11.5px] font-semibold text-white">Notify me</button>
      </div>
    </Stage></div>
  );
}

/* 24 — File Drop Field */
function FileDrop() {
  const inputRef = useRef<HTMLInputElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  useEffect(() => {
    const el = wrap.current; if (!el) return;
    const host = (el.closest("[data-in-hover-host]") as HTMLElement | null) ?? el;
    const on = () => setHover(true); const off = () => setHover(false);
    host.addEventListener("mouseenter", on); host.addEventListener("mouseleave", off);
    return () => { host.removeEventListener("mouseenter", on); host.removeEventListener("mouseleave", off); };
  }, []);
  return (
    <div ref={wrap}><Stage>
      <label className={`flex h-24 w-full flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed text-center transition-all ${hover ? "border-cyan-400 bg-cyan-400/5 scale-[1.02]" : "border-white/15 bg-white/[0.02]"}`}>
        <span className="text-2xl">☁</span>
        <span className="text-[11.5px] text-white/70"><b>Click</b> or drop a file</span>
        <input ref={inputRef} type="file" className="sr-only" />
      </label>
    </Stage></div>
  );
}

/* 25 — Suggest Dropdown Hint */
function SuggestHint() {
  const [v, setV] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const wrap = useHoverFocus(inputRef, "des");
  const open = v.length > 0;
  return (
    <div ref={wrap}><Stage>
      <div className="relative">
        <input ref={inputRef} value={v} onChange={(e) => setV(e.target.value)} placeholder="Start typing…" className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 text-[13px] text-white outline-none placeholder:text-white/40 focus:border-violet-400" />
        {open && (
          <div className="absolute left-0 right-0 top-full mt-1 overflow-hidden rounded-xl border border-white/10 bg-[#0e0e10] shadow-2xl">
            {["design", "designer", "designation"].map((s) => (
              <div key={s} className="px-3 py-1.5 text-[12px] text-white/85 hover:bg-white/[0.06]">{s}</div>
            ))}
          </div>
        )}
      </div>
    </Stage></div>
  );
}

/* --- Registry --- */
type Entry = { id: string; name: string; C: () => ReactNode };
const ENTRIES: Entry[] = [
  { id: "in-01", name: "Material Underline", C: ClassicUnderline },
  { id: "in-02", name: "Glow Ring", C: GlowRing },
  { id: "in-03", name: "Gradient Border", C: GradientBorder },
  { id: "in-04", name: "Icon Search", C: IconLeft },
  { id: "in-05", name: "Floating Label", C: FloatingBox },
  { id: "in-06", name: "Password Reveal", C: PasswordReveal },
  { id: "in-07", name: "Search w/ ⌘K", C: SearchKbd },
  { id: "in-08", name: "Textarea Rich", C: TextareaRich },
  { id: "in-09", name: "OTP Single", C: OtpSingle },
  { id: "in-10", name: "Currency", C: CurrencyInput },
  { id: "in-11", name: "Success Validated", C: SuccessValidated },
  { id: "in-12", name: "Error State", C: ErrorState },
  { id: "in-13", name: "Prefixed Domain", C: PrefixedDomain },
  { id: "in-14", name: "Tag Input", C: TagInput },
  { id: "in-15", name: "Slider Input", C: SliderInput },
  { id: "in-16", name: "Char Counter", C: CharCounter },
  { id: "in-17", name: "Comment Box", C: CommentBox },
  { id: "in-18", name: "Phone Prefix", C: SegPrefix },
  { id: "in-19", name: "Dark Emboss", C: DarkEmboss },
  { id: "in-20", name: "Neumorphic", C: Neumorphic },
  { id: "in-21", name: "Two-tone", C: TwoTone },
  { id: "in-22", name: "Aurora Focus", C: AuroraFocus },
  { id: "in-23", name: "Newsletter", C: IconAction },
  { id: "in-24", name: "File Drop", C: FileDrop },
  { id: "in-25", name: "Suggest Hint", C: SuggestHint },
];

export const INPUTS: InputItem[] = ENTRIES.map((e) => ({
  id: e.id,
  name: e.name,
  render: () => <e.C />,
  code: `// ${e.name} — Novix UI premium input\n// Full source available in /src/data/inputs.tsx`,
}));
