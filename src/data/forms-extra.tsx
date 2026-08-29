import type { ReactNode, CSSProperties } from "react";
import type { FormItem } from "@/data/forms";

/* Shared frame — 3D tilt on hover via group */
function Frame({ children, style, className = "" }: { children: ReactNode; style?: CSSProperties; className?: string }) {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className={`relative w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0b] p-4 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.85)] transition-transform duration-500 [transform:perspective(900px)] group-hover:[transform:perspective(900px)_rotateX(5deg)_translateY(-3px)] ${className}`}
      style={style}
    >
      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      {children}
    </form>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">{children}</p>;
}

function TInput({ placeholder, type = "text" }: { placeholder: string; type?: string }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-[12px] text-white placeholder:text-white/40 outline-none transition-colors focus:border-white/30"
    />
  );
}

function TBtn({ children, grad }: { children: ReactNode; grad?: string }) {
  return (
    <button
      className="w-full rounded-lg py-2 text-[12px] font-semibold text-white shadow-[0_10px_28px_-10px_rgba(0,0,0,.7)] transition-transform group-hover:scale-[1.02]"
      style={{ background: grad ?? "linear-gradient(135deg,#7c3aed,#ec4899)" }}
    >
      {children}
    </button>
  );
}

function Halo({ grad }: { grad: string }) {
  return (
    <span aria-hidden className="pointer-events-none absolute -inset-16 opacity-50 blur-3xl transition-opacity duration-700 group-hover:opacity-90" style={{ background: grad }} />
  );
}

/* ---------- Palettes ---------- */
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
const halos = [
  "conic-gradient(from 90deg at 30% 20%,#7c3aed,#22d3ee,#ec4899,#7c3aed)",
  "conic-gradient(from 180deg at 70% 30%,#06b6d4,#8b5cf6,#f472b6,#06b6d4)",
  "conic-gradient(from 0deg at 50% 50%,#10b981,#0ea5e9,#a855f7,#10b981)",
  "conic-gradient(from 45deg at 30% 70%,#f97316,#ec4899,#8b5cf6,#f97316)",
  "conic-gradient(from 270deg at 60% 40%,#22d3ee,#a78bfa,#f472b6,#22d3ee)",
];
const g = (i: number) => grads[i % grads.length];
const h = (i: number) => halos[i % halos.length];

/* ================================================================== */
/*  TEMPLATE FACTORIES                                                */
/* ================================================================== */

// A · Sign-in variants (10)
const SignIn = (i: number) => () => (
  <Frame><Halo grad={h(i)} />
    <div className="relative space-y-3">
      <Label>Sign in · v{i + 1}</Label>
      <TInput placeholder="you@novixui.dev" type="email" />
      <TInput placeholder="••••••••" type="password" />
      <div className="flex items-center justify-between text-[10px] text-white/50"><span>Remember me</span><span>Forgot?</span></div>
      <TBtn grad={g(i)}>Continue →</TBtn>
    </div>
  </Frame>
);

// B · Newsletter (10)
const Newsletter = (i: number) => () => (
  <Frame><Halo grad={h(i + 1)} />
    <div className="relative space-y-3">
      <Label>Subscribe · v{i + 1}</Label>
      <div className="text-[13px] font-semibold text-white">The Novix weekly.</div>
      <div className="text-[11px] text-white/55">Design, motion, and craft — no spam.</div>
      <div className="flex gap-2"><TInput placeholder="Email address" type="email" /><TBtn grad={g(i + 3)}>Join</TBtn></div>
    </div>
  </Frame>
);

// C · Contact (10)
const Contact = (i: number) => () => (
  <Frame><Halo grad={h(i + 2)} />
    <div className="relative space-y-3">
      <Label>Contact · v{i + 1}</Label>
      <TInput placeholder="Full name" />
      <TInput placeholder="Email" type="email" />
      <textarea placeholder="Message…" rows={3} className="w-full resize-none rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-[12px] text-white placeholder:text-white/40 outline-none focus:border-white/30" />
      <TBtn grad={g(i + 5)}>Send message</TBtn>
    </div>
  </Frame>
);

// D · Search + filter chips (8)
const SearchFilter = (i: number) => () => {
  const chips = ["design", "motion", "css", "react", "tokens"];
  return (
    <Frame><Halo grad={h(i)} />
      <div className="relative space-y-3">
        <Label>Search · v{i + 1}</Label>
        <TInput placeholder="Search everything…" />
        <div className="flex flex-wrap gap-1.5">
          {chips.slice(0, 3 + (i % 3)).map((c, k) => (
            <span key={c} className="rounded-full px-2 py-0.5 text-[10px] font-medium text-white ring-1 ring-white/15" style={{ background: k === 0 ? g(i) : "rgba(255,255,255,0.06)" }}>{c}</span>
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-white/50"><span>128 results</span><span>Enter ↵</span></div>
      </div>
    </Frame>
  );
};

// E · Payment (6)
const Payment = (i: number) => () => (
  <Frame><Halo grad={h(i + 3)} />
    <div className="relative space-y-3">
      <Label>Payment · v{i + 1}</Label>
      <div className="rounded-xl p-3 text-white" style={{ background: g(i) }}>
        <div className="text-[10px] opacity-80">Novix • Debit</div>
        <div className="mt-4 font-mono text-[13px] tracking-[0.2em]">4242 •••• •••• 4242</div>
        <div className="mt-2 flex justify-between text-[10px] opacity-80"><span>M. NAKAMURA</span><span>12/29</span></div>
      </div>
      <div className="flex gap-2"><TInput placeholder="MM / YY" /><TInput placeholder="CVC" /></div>
      <TBtn grad={g(i + 2)}>Pay $19.00</TBtn>
    </div>
  </Frame>
);

// F · OTP (6)
const OTP = (i: number) => () => (
  <Frame><Halo grad={h(i + 4)} />
    <div className="relative space-y-3">
      <Label>Verify · v{i + 1}</Label>
      <div className="text-[12px] text-white/70">We sent a 6-digit code.</div>
      <div className="flex gap-1.5">
        {Array.from({ length: 6 }).map((_, k) => (
          <div key={k} className="grid h-9 w-8 place-items-center rounded-md border border-white/10 bg-white/[0.05] text-[13px] font-semibold text-white">{k < 3 ? "•" : ""}</div>
        ))}
      </div>
      <TBtn grad={g(i + 4)}>Verify code</TBtn>
    </div>
  </Frame>
);

// G · Feedback / rating (6)
const Feedback = (i: number) => () => (
  <Frame><Halo grad={h(i)} />
    <div className="relative space-y-3">
      <Label>Feedback · v{i + 1}</Label>
      <div className="text-[12px] text-white/80">How would you rate Novix?</div>
      <div className="flex gap-1.5">
        {["😞","😐","🙂","😍","🤩"].map((e, k) => (
          <button key={k} type="button" className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.05] text-base transition-transform hover:scale-110" style={k === 3 ? { background: g(i) } : {}}>{e}</button>
        ))}
      </div>
      <textarea rows={2} placeholder="Tell us more (optional)…" className="w-full resize-none rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-[11.5px] text-white placeholder:text-white/40 outline-none" />
      <TBtn grad={g(i + 1)}>Send feedback</TBtn>
    </div>
  </Frame>
);

// H · Multi-step (6)
const MultiStep = (i: number) => () => {
  const step = (i % 3) + 1;
  return (
    <Frame><Halo grad={h(i + 2)} />
      <div className="relative space-y-3">
        <div className="flex items-center gap-1.5">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1">
              <div className="h-1 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full transition-[width] duration-700" style={{ width: s <= step ? "100%" : "0%", background: g(i) }} /></div>
              <div className={`mt-1 text-[9.5px] uppercase tracking-wider ${s === step ? "text-white" : "text-white/45"}`}>Step {s}</div>
            </div>
          ))}
        </div>
        <TInput placeholder={["Full name", "Company", "Team size"][step - 1]} />
        <TInput placeholder={["Email", "Website", "Role"][step - 1]} />
        <div className="flex gap-2"><button type="button" className="flex-1 rounded-lg border border-white/10 py-2 text-[12px] text-white/75">Back</button><TBtn grad={g(i)}>Next →</TBtn></div>
      </div>
    </Frame>
  );
};

// I · Waitlist (6)
const Waitlist = (i: number) => () => (
  <Frame style={{ background: `radial-gradient(circle at 30% 20%, ${grads[i % grads.length]}, transparent 60%), #0a0a0b` }}>
    <div className="relative space-y-3">
      <Label>Waitlist · v{i + 1}</Label>
      <div className="text-[13px] font-semibold text-white">Get early access</div>
      <div className="text-[11px] text-white/60">Join 12,428 designers on the list.</div>
      <TInput placeholder="you@novixui.dev" type="email" />
      <TBtn grad={g(i + 6)}>Join waitlist</TBtn>
    </div>
  </Frame>
);

// J · Booking / date (6)
const Booking = (i: number) => () => (
  <Frame><Halo grad={h(i + 1)} />
    <div className="relative space-y-3">
      <Label>Book a call · v{i + 1}</Label>
      <div className="grid grid-cols-4 gap-1.5">
        {["Mon", "Tue", "Wed", "Thu"].map((d, k) => (
          <button key={d} type="button" className="rounded-lg border border-white/10 bg-white/[0.04] py-1.5 text-[10px] text-white/80" style={k === 1 ? { background: g(i), borderColor: "transparent" } : {}}>
            <div>{d}</div><div className="text-[11px] font-semibold text-white">{12 + k}</div>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {["09:00", "10:30", "13:00"].map((t, k) => (
          <button key={t} type="button" className="rounded-md border border-white/10 py-1.5 text-[10.5px] text-white/85" style={k === 0 ? { background: "rgba(255,255,255,0.08)" } : {}}>{t}</button>
        ))}
      </div>
      <TBtn grad={g(i + 3)}>Confirm booking</TBtn>
    </div>
  </Frame>
);

// K · Profile / avatar upload (6)
const Profile = (i: number) => () => (
  <Frame><Halo grad={h(i + 3)} />
    <div className="relative space-y-3">
      <Label>Profile · v{i + 1}</Label>
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-full text-sm font-semibold text-white ring-2 ring-white/15" style={{ background: g(i) }}>MN</div>
        <div className="flex-1 space-y-1">
          <button type="button" className="w-full rounded-md border border-white/10 bg-white/[0.05] py-1.5 text-[10.5px] text-white/80">Upload photo</button>
          <div className="text-[9.5px] text-white/45">PNG or JPG, up to 4MB</div>
        </div>
      </div>
      <TInput placeholder="Display name" />
      <TInput placeholder="@handle" />
      <TBtn grad={g(i + 2)}>Save profile</TBtn>
    </div>
  </Frame>
);

// L · Password strength (6)
const Password = (i: number) => () => {
  const pct = 40 + (i * 15) % 60;
  return (
    <Frame><Halo grad={h(i + 2)} />
      <div className="relative space-y-3">
        <Label>Create password · v{i + 1}</Label>
        <TInput placeholder="Password" type="password" />
        <div className="space-y-1">
          <div className="flex gap-1">
            {[0, 1, 2, 3].map((k) => (
              <div key={k} className="h-1 flex-1 rounded-full bg-white/10 transition-colors" style={pct / 25 > k ? { background: g(i) } : {}} />
            ))}
          </div>
          <div className="text-[10px] text-white/55">Strength: {pct >= 75 ? "Strong" : pct >= 50 ? "Good" : "Weak"}</div>
        </div>
        <TInput placeholder="Confirm password" type="password" />
        <TBtn grad={g(i + 4)}>Create account</TBtn>
      </div>
    </Frame>
  );
};

// M · Search command (4)
const CmdSearch = (i: number) => () => (
  <Frame><Halo grad={h(i)} />
    <div className="relative space-y-2">
      <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-2 text-[12px] text-white/70">
        <span>⌘</span><input placeholder="Type a command…" className="flex-1 bg-transparent outline-none placeholder:text-white/40" />
        <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px]">K</kbd>
      </div>
      {["Create new project", "Invite teammate", "Toggle theme"].map((t, k) => (
        <div key={t} className="flex items-center justify-between rounded-md px-2 py-1.5 text-[11.5px] text-white/85" style={k === 0 ? { background: `${g(i)}` } : {}}>
          <span>{t}</span><span className="text-[10px] opacity-70">↵</span>
        </div>
      ))}
    </div>
  </Frame>
);

// N · Pricing selector (4)
const Pricing = (i: number) => () => (
  <Frame><Halo grad={h(i + 1)} />
    <div className="relative space-y-3">
      <Label>Choose plan · v{i + 1}</Label>
      {[["Starter", "$0"], ["Pro", "$19"], ["Team", "$49"]].map(([n, price], k) => (
        <label key={n} className="flex cursor-pointer items-center justify-between rounded-lg border px-3 py-2 text-[12px]" style={k === 1 ? { borderColor: "transparent", background: g(i), color: "white" } : { borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.85)" }}>
          <span className="font-medium">{n}</span><span className="font-mono">{price}/mo</span>
        </label>
      ))}
      <TBtn grad={g(i + 5)}>Continue</TBtn>
    </div>
  </Frame>
);

// O · Toggle preferences (4)
const Prefs = (i: number) => () => (
  <Frame><Halo grad={h(i + 4)} />
    <div className="relative space-y-3">
      <Label>Preferences · v{i + 1}</Label>
      {["Email digest", "Product updates", "Community"].map((n, k) => (
        <div key={n} className="flex items-center justify-between text-[12px] text-white/85">
          <span>{n}</span>
          <span className="relative h-5 w-9 rounded-full transition-colors" style={{ background: k !== 1 ? g(i) : "rgba(255,255,255,0.15)" }}>
            <span className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all" style={{ left: k !== 1 ? "18px" : "2px" }} />
          </span>
        </div>
      ))}
      <TBtn grad={g(i + 2)}>Save preferences</TBtn>
    </div>
  </Frame>
);

// P · Address (4)
const Address = (i: number) => () => (
  <Frame><Halo grad={h(i + 2)} />
    <div className="relative space-y-3">
      <Label>Shipping · v{i + 1}</Label>
      <TInput placeholder="Street address" />
      <div className="flex gap-2"><TInput placeholder="City" /><TInput placeholder="ZIP" /></div>
      <TInput placeholder="Country" />
      <TBtn grad={g(i + 1)}>Save address</TBtn>
    </div>
  </Frame>
);

// Q · Team invite (4)
const Invite = (i: number) => () => (
  <Frame><Halo grad={h(i)} />
    <div className="relative space-y-3">
      <Label>Invite · v{i + 1}</Label>
      <div className="flex gap-2"><TInput placeholder="teammate@company.com" type="email" /><TBtn grad={g(i)}>Send</TBtn></div>
      <div className="space-y-1">
        {["Nika R.", "Kenji A."].map((n, k) => (
          <div key={n} className="flex items-center justify-between rounded-md bg-white/[0.03] px-2 py-1.5 text-[11px] text-white/80">
            <div className="flex items-center gap-2"><span className="grid h-5 w-5 place-items-center rounded-full text-[9.5px] font-bold text-white" style={{ background: g(i + k) }}>{n[0]}</span>{n}</div>
            <span className="text-[10px] text-white/45">{k === 0 ? "Admin" : "Member"}</span>
          </div>
        ))}
      </div>
    </div>
  </Frame>
);

// R · Range / slider (4)
const Range = (i: number) => () => {
  const pct = 30 + (i * 20) % 60;
  return (
    <Frame><Halo grad={h(i + 3)} />
      <div className="relative space-y-3">
        <Label>Budget · v{i + 1}</Label>
        <div className="text-[13px] font-semibold text-white">${(pct * 30).toLocaleString()}</div>
        <div className="relative h-1.5 rounded-full bg-white/10">
          <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${pct}%`, background: g(i) }} />
          <div className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow" style={{ left: `${pct}%` }} />
        </div>
        <div className="flex justify-between text-[10px] text-white/50"><span>$0</span><span>$3,000</span></div>
        <TBtn grad={g(i + 4)}>Apply filter</TBtn>
      </div>
    </Frame>
  );
};

/* ================================================================== */
/*  Registry                                                          */
/* ================================================================== */

const groups = [
  { label: "Sign in", make: SignIn, n: 10 },
  { label: "Newsletter", make: Newsletter, n: 10 },
  { label: "Contact", make: Contact, n: 10 },
  { label: "Search", make: SearchFilter, n: 8 },
  { label: "Payment", make: Payment, n: 6 },
  { label: "OTP", make: OTP, n: 6 },
  { label: "Feedback", make: Feedback, n: 6 },
  { label: "Multi-step", make: MultiStep, n: 6 },
  { label: "Waitlist", make: Waitlist, n: 6 },
  { label: "Booking", make: Booking, n: 6 },
  { label: "Profile", make: Profile, n: 6 },
  { label: "Password", make: Password, n: 6 },
  { label: "Command", make: CmdSearch, n: 4 },
  { label: "Pricing", make: Pricing, n: 4 },
  { label: "Preferences", make: Prefs, n: 4 },
  { label: "Address", make: Address, n: 4 },
  { label: "Invite", make: Invite, n: 4 },
  { label: "Range", make: Range, n: 4 },
];

const items: FormItem[] = [];
let idx = 0;
for (const gr of groups) {
  for (let k = 0; k < gr.n; k++) {
    const Comp = gr.make(idx);
    const name = `${gr.label} ${k + 1}`;
    items.push({
      id: `fm-ex-${idx + 1}`,
      name,
      render: () => <Comp />,
      code: `// ${name} — Novix UI premium form\n// Full source in src/data/forms-extra.tsx`,
    });
    idx++;
  }
}

export const FORMS_EXTRA: FormItem[] = items;
