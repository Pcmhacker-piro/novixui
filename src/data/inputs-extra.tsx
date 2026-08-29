import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import type { InputItem } from "@/data/inputs";

/* Hover previewer — same pattern as base inputs. */
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

/* Palettes */
const G = [
  ["#7c3aed", "#ec4899"], ["#06b6d4", "#3b82f6"], ["#10b981", "#22d3ee"],
  ["#f97316", "#ef4444"], ["#eab308", "#f97316"], ["#8b5cf6", "#22d3ee"],
  ["#ec4899", "#f59e0b"], ["#22c55e", "#84cc16"], ["#0ea5e9", "#a855f7"],
  ["#f472b6", "#a78bfa"], ["#14b8a6", "#0ea5e9"], ["#e11d48", "#7c3aed"],
];
const grad = (i: number) => `linear-gradient(135deg, ${G[i % G.length][0]}, ${G[i % G.length][1]})`;
const c1 = (i: number) => G[i % G.length][0];
const c2 = (i: number) => G[i % G.length][1];

/* ================ FACTORIES ================ */

// A · Glow Ring w/ label (12)
const GlowLabel = (i: number, label: string, ph: string, pv: string) => () => {
  const [v, setV] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  const wrap = useHoverFocus(ref, pv);
  return (
    <div ref={wrap}><Stage>
      <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-white/50">{label}</label>
      <input ref={ref} value={v} onChange={(e) => setV(e.target.value)} placeholder={ph}
        className="peer h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 text-[13px] text-white placeholder:text-white/40 outline-none transition-all"
        style={{ "--c1": c1(i), "--c2": c2(i) } as CSSProperties}
        onFocus={(e) => { e.currentTarget.style.borderColor = c1(i); e.currentTarget.style.boxShadow = `0 0 0 4px ${c1(i)}22, 0 0 20px -2px ${c1(i)}88`; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = ""; e.currentTarget.style.boxShadow = ""; }}
      />
    </Stage></div>
  );
};

// B · Gradient border (12)
const GradBorder = (i: number, ph: string, pv: string) => () => {
  const [v, setV] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  const wrap = useHoverFocus(ref, pv);
  return (
    <div ref={wrap}><Stage>
      <div className="rounded-xl p-[1.5px]" style={{ background: grad(i) }}>
        <input ref={ref} value={v} onChange={(e) => setV(e.target.value)} placeholder={ph}
          className="h-10 w-full rounded-[10px] bg-[#0a0a0a] px-3 text-[13px] text-white placeholder:text-white/40 outline-none" />
      </div>
    </Stage></div>
  );
};

// C · Icon left (12)
const IconLeft = (i: number, icon: string, ph: string, pv: string) => () => {
  const [v, setV] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  const wrap = useHoverFocus(ref, pv);
  return (
    <div ref={wrap}><Stage>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base" style={{ color: c1(i) }}>{icon}</span>
        <input ref={ref} value={v} onChange={(e) => setV(e.target.value)} placeholder={ph}
          className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-3 text-[13px] text-white placeholder:text-white/40 outline-none transition-all"
          onFocus={(e) => { e.currentTarget.style.borderColor = c1(i); e.currentTarget.style.boxShadow = `inset 0 0 0 1px ${c1(i)}66`; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = ""; e.currentTarget.style.boxShadow = ""; }} />
      </div>
    </Stage></div>
  );
};

// D · Floating label (10)
const Floating = (i: number, label: string, pv: string) => () => {
  const [v, setV] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  const wrap = useHoverFocus(ref, pv);
  const has = v.length > 0;
  return (
    <div ref={wrap}><Stage>
      <div className="relative">
        <input ref={ref} value={v} onChange={(e) => setV(e.target.value)}
          className="peer h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 pt-3 text-[13px] text-white outline-none transition-all"
          onFocus={(e) => { e.currentTarget.style.borderColor = c1(i); }} onBlur={(e) => { e.currentTarget.style.borderColor = ""; }} />
        <label className={`pointer-events-none absolute left-3 transition-all ${has ? "top-1 text-[10px]" : "top-1/2 -translate-y-1/2 text-[13px]"} peer-focus:top-1 peer-focus:translate-y-0 peer-focus:text-[10px]`}
          style={{ color: has ? c1(i) : "rgba(255,255,255,0.45)" }}>{label}</label>
      </div>
    </Stage></div>
  );
};

// E · Underline animated (10)
const Underline = (i: number, label: string, pv: string) => () => {
  const [v, setV] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  const wrap = useHoverFocus(ref, pv);
  const has = v.length > 0;
  return (
    <div ref={wrap}><Stage>
      <div className="relative">
        <input ref={ref} value={v} onChange={(e) => setV(e.target.value)}
          className="peer h-10 w-full bg-transparent px-1 text-[13px] text-white outline-none" />
        <label className={`pointer-events-none absolute left-1 top-1/2 -translate-y-1/2 text-[13px] transition-all ${has ? "!top-0 !-translate-y-full !text-[10.5px]" : ""} peer-focus:top-0 peer-focus:-translate-y-full peer-focus:text-[10.5px]`}
          style={{ color: has ? c1(i) : "rgba(255,255,255,0.4)" }}>{label}</label>
        <div className="relative mt-1 h-px w-full bg-white/15">
          <span className="absolute inset-y-0 left-1/2 w-0 -translate-x-1/2 transition-all peer-focus:w-full" style={{ background: grad(i), width: has ? "100%" : undefined }} />
        </div>
      </div>
    </Stage></div>
  );
};

// F · Search w/ kbd (8)
const SearchKbd = (i: number) => () => {
  const [v, setV] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  const wrap = useHoverFocus(ref, "Novix UI components");
  return (
    <div ref={wrap}><Stage>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/50">⌕</span>
        <input ref={ref} value={v} onChange={(e) => setV(e.target.value)} placeholder="Search…"
          className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-9 pr-14 text-[13px] text-white placeholder:text-white/40 outline-none transition-all"
          onFocus={(e) => { e.currentTarget.style.borderColor = c1(i); e.currentTarget.style.boxShadow = `0 0 0 4px ${c1(i)}22`; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = ""; e.currentTarget.style.boxShadow = ""; }} />
        <kbd className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-white/60">⌘K</kbd>
      </div>
    </Stage></div>
  );
};

// G · Password w/ strength meter (8)
const Password = (i: number) => () => {
  const [v, setV] = useState("");
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const wrap = useHoverFocus(ref, "s3cr3t-passw0rd!");
  const strength = Math.min(4, Math.floor(v.length / 3));
  return (
    <div ref={wrap}><Stage>
      <div className="relative">
        <input ref={ref} type={show ? "text" : "password"} value={v} onChange={(e) => setV(e.target.value)} placeholder="Password"
          className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 pr-14 text-[13px] text-white placeholder:text-white/40 outline-none transition-all"
          onFocus={(e) => { e.currentTarget.style.borderColor = c1(i); }} onBlur={(e) => { e.currentTarget.style.borderColor = ""; }} />
        <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-medium text-white/60 hover:text-white">{show ? "hide" : "show"}</button>
      </div>
      <div className="mt-2 flex gap-1">
        {[0, 1, 2, 3].map((n) => (
          <span key={n} className="h-1 flex-1 rounded-full transition-all" style={{ background: n < strength ? grad(i) : "rgba(255,255,255,0.08)" }} />
        ))}
      </div>
    </Stage></div>
  );
};

// H · OTP-style single (6)
const OTP = (i: number) => () => {
  const [vals, setVals] = useState(["", "", "", ""]);
  const refs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  const wrap = useHoverFocus(refs[0], "7");
  useEffect(() => {
    if (vals[0] && !vals[1]) setVals(["7","2","4","9"]);
    else if (!vals[0]) setVals(["","","",""]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vals[0]]);
  return (
    <div ref={wrap}><Stage>
      <div className="flex gap-2">
        {vals.map((val, idx) => (
          <input key={idx} ref={refs[idx]} value={val} onChange={(e) => { const nv = [...vals]; nv[idx] = e.target.value.slice(-1); setVals(nv); }}
            className="h-12 w-12 rounded-xl border border-white/10 bg-white/[0.03] text-center text-[16px] font-semibold text-white outline-none transition-all"
            style={val ? { borderColor: c1(i), boxShadow: `0 0 0 3px ${c1(i)}22, 0 8px 20px -8px ${c1(i)}77`, background: `${c1(i)}11` } : {}} maxLength={1} />
        ))}
      </div>
    </Stage></div>
  );
};

// I · Prefix / suffix (8)
const Prefix = (i: number, prefix: string, suffix: string, ph: string, pv: string) => () => {
  const [v, setV] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  const wrap = useHoverFocus(ref, pv);
  return (
    <div ref={wrap}><Stage>
      <div className="flex h-11 items-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition-all"
        onFocusCapture={(e) => (e.currentTarget.style.borderColor = c1(i))}
        onBlurCapture={(e) => (e.currentTarget.style.borderColor = "")}>
        {prefix && <span className="grid h-full place-items-center px-3 text-[12px] font-medium text-white/60" style={{ background: `${c1(i)}18` }}>{prefix}</span>}
        <input ref={ref} value={v} onChange={(e) => setV(e.target.value)} placeholder={ph}
          className="h-full flex-1 bg-transparent px-3 text-[13px] text-white placeholder:text-white/40 outline-none" />
        {suffix && <span className="grid h-full place-items-center px-3 text-[12px] font-medium text-white/60" style={{ background: `${c2(i)}18` }}>{suffix}</span>}
      </div>
    </Stage></div>
  );
};

// J · Chip / tag input (6)
const ChipInput = (i: number, start: string[]) => () => {
  const [tags, setTags] = useState<string[]>(start);
  const [v, setV] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  const wrap = useHoverFocus(ref, "design");
  const commit = () => { if (v.trim()) { setTags([...tags, v.trim()]); setV(""); } };
  return (
    <div ref={wrap}><Stage>
      <div className="flex min-h-[44px] flex-wrap items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] p-1.5"
        onFocusCapture={(e) => (e.currentTarget.style.borderColor = c1(i))}
        onBlurCapture={(e) => (e.currentTarget.style.borderColor = "")}>
        {tags.map((t, k) => (
          <span key={k} className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium text-white" style={{ background: grad(i) }}>
            {t}<button onClick={() => setTags(tags.filter((_, j) => j !== k))} className="opacity-70 hover:opacity-100">×</button>
          </span>
        ))}
        <input ref={ref} value={v} onChange={(e) => setV(e.target.value)} onKeyDown={(e) => e.key === "Enter" && commit()}
          className="min-w-[80px] flex-1 bg-transparent px-1 text-[13px] text-white placeholder:text-white/40 outline-none" placeholder="Add tag…" />
      </div>
    </Stage></div>
  );
};

// K · Textarea (6)
const TArea = (i: number, label: string, pv: string) => () => {
  const [v, setV] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);
  const wrap = useHoverFocus(ref, pv);
  return (
    <div ref={wrap}><Stage>
      <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-white/50">{label}</label>
      <textarea ref={ref} value={v} onChange={(e) => setV(e.target.value)} rows={3}
        className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] p-3 text-[13px] text-white placeholder:text-white/40 outline-none transition-all"
        placeholder="Type here…"
        onFocus={(e) => { e.currentTarget.style.borderColor = c1(i); e.currentTarget.style.boxShadow = `0 0 0 4px ${c1(i)}22`; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = ""; e.currentTarget.style.boxShadow = ""; }} />
    </Stage></div>
  );
};

// L · Neumorph soft (6)
const Neumorph = (i: number, ph: string, pv: string) => () => {
  const [v, setV] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  const wrap = useHoverFocus(ref, pv);
  return (
    <div ref={wrap}><Stage>
      <input ref={ref} value={v} onChange={(e) => setV(e.target.value)} placeholder={ph}
        className="h-11 w-full rounded-2xl px-4 text-[13px] text-white placeholder:text-white/40 outline-none transition-all"
        style={{ background: "#0d0d0f", boxShadow: `inset 4px 4px 10px rgba(0,0,0,.55), inset -4px -4px 10px rgba(255,255,255,.03)` }}
        onFocus={(e) => { e.currentTarget.style.boxShadow = `inset 4px 4px 10px rgba(0,0,0,.55), inset -4px -4px 10px rgba(255,255,255,.03), 0 0 0 2px ${c1(i)}66`; }}
        onBlur={(e) => { e.currentTarget.style.boxShadow = "inset 4px 4px 10px rgba(0,0,0,.55), inset -4px -4px 10px rgba(255,255,255,.03)"; }} />
    </Stage></div>
  );
};

// M · Glass frosted (6)
const Glass = (i: number, ph: string, pv: string) => () => {
  const [v, setV] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  const wrap = useHoverFocus(ref, pv);
  return (
    <div ref={wrap}><Stage>
      <div className="relative overflow-hidden rounded-xl">
        <div className="absolute inset-0 -z-10" style={{ background: `radial-gradient(120% 120% at 0% 0%, ${c1(i)}44, transparent 60%), radial-gradient(120% 120% at 100% 100%, ${c2(i)}44, transparent 60%)` }} />
        <input ref={ref} value={v} onChange={(e) => setV(e.target.value)} placeholder={ph}
          className="h-11 w-full rounded-xl border border-white/15 bg-white/[0.06] px-3 text-[13px] text-white placeholder:text-white/50 outline-none backdrop-blur-md transition-all"
          onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = ""; }} />
      </div>
    </Stage></div>
  );
};

// N · With action button (6)
const WithBtn = (i: number, ph: string, pv: string, cta: string) => () => {
  const [v, setV] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  const wrap = useHoverFocus(ref, pv);
  return (
    <div ref={wrap}><Stage>
      <div className="flex h-11 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]"
        onFocusCapture={(e) => (e.currentTarget.style.borderColor = c1(i))}
        onBlurCapture={(e) => (e.currentTarget.style.borderColor = "")}>
        <input ref={ref} value={v} onChange={(e) => setV(e.target.value)} placeholder={ph}
          className="h-full flex-1 bg-transparent px-3 text-[13px] text-white placeholder:text-white/40 outline-none" />
        <button className="px-3 text-[12px] font-semibold text-white transition-transform active:translate-y-px" style={{ background: grad(i) }}>{cta}</button>
      </div>
    </Stage></div>
  );
};

// O · Number stepper (4)
const Stepper = (i: number) => () => {
  const [n, setN] = useState(3);
  return (
    <div><Stage>
      <div className="flex h-11 items-center rounded-xl border border-white/10 bg-white/[0.03]">
        <button onClick={() => setN((x) => Math.max(0, x - 1))} className="h-full w-11 text-white/70 transition-colors hover:text-white" style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}>−</button>
        <div className="grid h-full flex-1 place-items-center text-[13px] font-semibold text-white" style={{ background: `${c1(i)}11` }}>{n}</div>
        <button onClick={() => setN((x) => x + 1)} className="h-full w-11 text-white transition-transform active:scale-95" style={{ background: grad(i), borderLeft: "1px solid rgba(255,255,255,0.06)" }}>+</button>
      </div>
    </Stage></div>
  );
};

// P · Validation success/error (4)
const Validated = (i: number, ok: boolean) => () => {
  const [v, setV] = useState(ok ? "alex@novix.dev" : "not-an-email");
  const ref = useRef<HTMLInputElement>(null);
  const wrap = useHoverFocus(ref, ok ? "alex@novix.dev" : "invalid@");
  const color = ok ? "#22c55e" : "#ef4444";
  return (
    <div ref={wrap}><Stage>
      <div className="relative">
        <input ref={ref} value={v} onChange={(e) => setV(e.target.value)}
          className="h-11 w-full rounded-xl border bg-white/[0.03] pl-3 pr-9 text-[13px] text-white outline-none transition-all"
          style={{ borderColor: `${color}88`, boxShadow: `0 0 0 3px ${color}22` }} />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px]" style={{ color }}>{ok ? "✓" : "!"}</span>
      </div>
      <p className="mt-1.5 text-[10.5px]" style={{ color }}>{ok ? "Looks good." : "Please enter a valid email."}</p>
    </Stage></div>
  );
};

/* ============ Registry ============ */

const items: InputItem[] = [];
let id = 0;
const add = (name: string, Comp: React.ComponentType) => {
  const idx = ++id;
  items.push({
    id: `in-ex-${idx}`,
    name: `${name} ${idx}`,
    render: () => <Comp />,
    code: `// ${name} — Novix UI premium input\n// Full source in src/data/inputs-extra.tsx`,
  });
};

// Glow Label — 12
const labels = [
  ["Full name", "Alex Cooper", "Alex Cooper"], ["Email", "you@novix.dev", "hello@novix.ui"],
  ["Company", "Acme Inc.", "Novix Labs"], ["Website", "https://…", "novixui.dev"],
  ["Phone", "+1 555…", "+1 555 010 3121"], ["City", "San Francisco", "Berlin"],
  ["Country", "United States", "Germany"], ["Zip", "94103", "10115"],
  ["Twitter", "@handle", "@novixui"], ["Github", "username", "novixui"],
  ["Role", "Product Designer", "Design Engineer"], ["Team", "Design", "Platform"],
];
labels.forEach(([l, p, v], k) => add("Glow Label", GlowLabel(k, l, p, v)));

// Gradient Border — 12
const gbs = [["Search…", "Novix UI"], ["Project", "novix-ui/core"], ["API key", "sk_live_…"],
  ["Slug", "premium-inputs"], ["Repo", "novix/ui"], ["Domain", "novixui.dev"],
  ["Alias", "alex"], ["Handle", "@novix"], ["Path", "/docs/inputs"],
  ["Bucket", "novix-cdn"], ["Env", "production"], ["Region", "us-east-1"]];
gbs.forEach(([p, v], k) => add("Gradient Border", GradBorder(k, p, v)));

// Icon Left — 12
const icons = [["✉", "Email", "you@novix.dev"], ["⌕", "Search components", "Buttons"],
  ["☎", "Phone", "+1 555 010 3121"], ["◎", "Location", "San Francisco"],
  ["♡", "Favorite", "Novix UI"], ["★", "Rating", "5 stars"],
  ["◈", "Project", "novix-ui"], ["◐", "Theme", "Dark"],
  ["⌗", "Tag", "premium"], ["⏱", "Time", "3:24 PM"],
  ["⚑", "Flag", "important"], ["✎", "Note", "Design tokens"]];
icons.forEach(([ic, p, v], k) => add("Icon Field", IconLeft(k, ic, p, v)));

// Floating — 10
const fl = [["Full name", "Alex Cooper"], ["Email address", "you@novix.dev"], ["Company", "Novix Labs"],
  ["Job title", "Design Engineer"], ["Website", "novixui.dev"], ["Phone", "+1 555 010 3121"],
  ["Address", "1 Market Street"], ["City", "San Francisco"], ["Country", "United States"], ["Zip", "94103"]];
fl.forEach(([l, v], k) => add("Floating Label", Floating(k, l, v)));

// Underline — 10
const ul = [["Full name", "Alex Cooper"], ["Email", "you@novix.dev"], ["Username", "@novix"],
  ["Handle", "novixui"], ["Company", "Novix"], ["Twitter", "@novixui"],
  ["Github", "novixui"], ["Website", "novixui.dev"], ["Team", "Platform"], ["Role", "Founder"]];
ul.forEach(([l, v], k) => add("Underline", Underline(k, l, v)));

// Search + Kbd — 8
for (let k = 0; k < 8; k++) add("Search ⌘K", SearchKbd(k));

// Password — 8
for (let k = 0; k < 8; k++) add("Password Strength", Password(k));

// OTP — 6
for (let k = 0; k < 6; k++) add("OTP", OTP(k));

// Prefix/Suffix — 8
const pf = [["https://", "", "site", "novixui"], ["$", "USD", "0.00", "99"],
  ["@", "", "handle", "novixui"], ["", ".dev", "domain", "novix"],
  ["+1", "", "phone", "5550103121"], ["", "/month", "price", "12"],
  ["/", "", "path", "docs/inputs"], ["#", "", "tag", "premium"]];
pf.forEach(([pre, suf, p, v], k) => add("Prefix Field", Prefix(k, pre, suf, p, v)));

// Chip — 6
const ci = [["react","design"], ["premium","ui"], ["novix","ai"], ["dark","glow"], ["frost","glass"], ["v1","beta"]];
ci.forEach((tags, k) => add("Tag Input", ChipInput(k, tags)));

// Textarea — 6
const ta = [["Message", "Loving the Novix UI craft — buttery smooth."], ["Bio", "Design engineer, obsessed with detail."],
  ["Feedback", "The motion feels incredibly premium."], ["Notes", "Ship the docs today, polish tomorrow."],
  ["Description", "A radical new UI kit for SaaS teams."], ["Comment", "This looks Apple-grade."]];
ta.forEach(([l, v], k) => add("Textarea Glow", TArea(k, l, v)));

// Neumorph — 6
const nm = [["Type here…", "Hello Novix"], ["Search…", "buttons"], ["Command", "npm i novix-ui"],
  ["Message", "Ping!"], ["Query", "premium input"], ["Note", "New idea"]];
nm.forEach(([p, v], k) => add("Neumorph Soft", Neumorph(k, p, v)));

// Glass — 6
const gs = [["Search assets", "Aurora background"], ["Ask AI", "How do I use Novix?"],
  ["Find people", "Alex"], ["Look up", "docs"], ["Filter", "cards"], ["Locate", "components"]];
gs.forEach(([p, v], k) => add("Glass Frost", Glass(k, p, v)));

// With button — 6
const wb = [["Enter email", "you@novix.dev", "Join"], ["Coupon code", "NOVIX20", "Apply"],
  ["Enter URL", "novixui.dev", "Fetch"], ["Search…", "components", "Go"],
  ["Invite email", "friend@novix.dev", "Invite"], ["Subscribe", "you@novix.dev", "Subscribe"]];
wb.forEach(([p, v, cta], k) => add("Input + CTA", WithBtn(k, p, v, cta)));

// Stepper — 4
for (let k = 0; k < 4; k++) add("Number Stepper", Stepper(k));

// Validation — 4
add("Validation Success", Validated(0, true));
add("Validation Error", Validated(1, false));
add("Validation Success", Validated(2, true));
add("Validation Error", Validated(3, false));

export const INPUTS_EXTRA: InputItem[] = items;
