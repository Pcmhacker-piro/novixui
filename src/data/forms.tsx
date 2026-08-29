import type { ReactNode } from "react";

export type FormItem = {
  id: string;
  name: string;
  render: () => ReactNode;
  code: string;
};

/* Hover host attribute used by <MiniGallery>: data-fm-hover-host */

/* ---------- 01 · Glass Sign In ---------- */
function GlassSignIn() {
  return (
    <form
      className="relative w-64 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] transition-transform duration-500 [transform:perspective(900px)] group-hover:[transform:perspective(900px)_rotateX(4deg)_translateY(-3px)]"
      onSubmit={(e) => e.preventDefault()}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-16 opacity-60 blur-3xl transition-opacity duration-700 group-hover:opacity-90"
        style={{ background: "conic-gradient(from 90deg at 30% 20%, #7c3aed, #22d3ee, #ec4899, #7c3aed)" }}
      />
      <div className="relative space-y-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">Sign in</p>
        <input
          type="email"
          placeholder="you@nova.dev"
          className="w-full rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-[12px] text-white placeholder:text-white/40 outline-none focus:border-white/30"
        />
        <input
          type="password"
          placeholder="••••••••"
          className="w-full rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-[12px] text-white placeholder:text-white/40 outline-none focus:border-white/30"
        />
        <button className="w-full rounded-lg bg-white py-2 text-[12px] font-semibold text-black transition-transform group-hover:scale-[1.02]">
          Continue
        </button>
      </div>
    </form>
  );
}

/* ---------- 02 · Neon Contact ---------- */
function NeonContact() {
  return (
    <form
      className="relative w-64 rounded-2xl border border-white/10 bg-[#0a0a12] p-4 transition-shadow duration-500 group-hover:shadow-[0_0_40px_-6px_rgba(124,58,237,0.55)]"
      onSubmit={(e) => e.preventDefault()}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: "linear-gradient(120deg, transparent 40%, rgba(124,58,237,0.35), transparent 60%)",
          backgroundSize: "200% 100%",
          animation: "nc-sweep 3s linear infinite",
        }}
      />
      <div className="relative space-y-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">Contact</p>
        <input placeholder="Name" className="w-full rounded-md bg-white/[0.05] px-3 py-2 text-[12px] text-white placeholder:text-white/40 outline-none focus:ring-1 focus:ring-fuchsia-400/60" />
        <textarea placeholder="Message" rows={2} className="w-full resize-none rounded-md bg-white/[0.05] px-3 py-2 text-[12px] text-white placeholder:text-white/40 outline-none focus:ring-1 focus:ring-fuchsia-400/60" />
        <button className="w-full rounded-md bg-gradient-to-r from-fuchsia-500 to-violet-500 py-2 text-[12px] font-semibold text-white">
          Send
        </button>
      </div>
      <style>{`@keyframes nc-sweep{0%{background-position:0% 0}100%{background-position:200% 0}}`}</style>
    </form>
  );
}

/* ---------- 03 · Floating Label ---------- */
function FloatingLabel() {
  return (
    <form className="w-64 space-y-3 rounded-2xl border border-white/10 bg-gradient-to-b from-[#111] to-[#050505] p-4">
      {["Email", "Password"].map((label) => (
        <label key={label} className="relative block">
          <input
            placeholder=" "
            className="peer w-full rounded-lg border border-white/10 bg-transparent px-3 pb-2 pt-5 text-[12px] text-white outline-none transition-colors focus:border-cyan-400/60"
          />
          <span className="pointer-events-none absolute left-3 top-1.5 text-[10px] uppercase tracking-[0.15em] text-white/50 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-[12px] peer-placeholder-shown:normal-case peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:uppercase peer-focus:text-cyan-300">
            {label}
          </span>
        </label>
      ))}
      <button className="w-full rounded-lg border border-white/10 bg-white/[0.05] py-2 text-[12px] font-semibold text-white transition-all group-hover:border-cyan-300/40 group-hover:bg-white/[0.08]">
        Log in
      </button>
    </form>
  );
}

/* ---------- 04 · 3D Tilt Card ---------- */
function TiltCardForm() {
  return (
    <div className="[perspective:1000px]">
      <form className="relative w-64 rounded-2xl border border-white/10 bg-[#0e0e14] p-4 shadow-[0_25px_60px_-25px_rgba(0,0,0,0.9)] transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateX(8deg)_rotateY(-8deg)]">
        <div className="space-y-3 [transform:translateZ(30px)]">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">Newsletter</p>
          <h4 className="text-[14px] font-semibold text-white">Join 12k readers</h4>
          <input placeholder="you@nova.dev" className="w-full rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-[12px] text-white placeholder:text-white/40 outline-none focus:border-white/30" />
          <button className="w-full rounded-md bg-white py-2 text-[12px] font-semibold text-black">Subscribe</button>
        </div>
      </form>
    </div>
  );
}

/* ---------- 05 · OTP Code ---------- */
function OtpForm() {
  return (
    <form className="w-64 rounded-2xl border border-white/10 bg-gradient-to-b from-[#0f0f16] to-[#050505] p-4 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">Verify</p>
      <h4 className="mt-1 text-[13px] font-semibold text-white">Enter 4-digit code</h4>
      <div className="mt-3 flex justify-center gap-2">
        {[0, 1, 2, 3].map((i) => (
          <input
            key={i}
            maxLength={1}
            className="h-11 w-9 rounded-lg border border-white/10 bg-white/[0.04] text-center text-[16px] font-semibold text-white outline-none transition-all focus:-translate-y-0.5 focus:border-emerald-400/60 focus:shadow-[0_0_20px_-4px_rgba(52,211,153,0.6)]"
            style={{ transitionDelay: `${i * 40}ms` }}
          />
        ))}
      </div>
      <button className="mt-4 w-full rounded-lg bg-emerald-500 py-2 text-[12px] font-semibold text-black transition-transform group-hover:scale-[1.02]">
        Verify
      </button>
    </form>
  );
}

/* ---------- 06 · Search + Filters ---------- */
function SearchFilters() {
  return (
    <form className="w-64 rounded-2xl border border-white/10 bg-[#0b0b12] p-4">
      <div className="relative">
        <input
          placeholder="Search projects…"
          className="w-full rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 pr-9 text-[12px] text-white placeholder:text-white/40 outline-none focus:border-white/30"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50">⌘K</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {["Design", "Code", "Docs", "Ai"].map((t, i) => (
          <span
            key={t}
            className="cursor-pointer rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] text-white/70 transition-all hover:border-white/30 hover:text-white group-hover:-translate-y-0.5"
            style={{ transitionDelay: `${i * 40}ms` }}
          >
            {t}
          </span>
        ))}
      </div>
    </form>
  );
}

/* ---------- 07 · Card Payment ---------- */
function CardPayment() {
  return (
    <form className="w-64 space-y-3 rounded-2xl border border-white/10 bg-gradient-to-br from-[#141420] via-[#0a0a12] to-[#050505] p-4 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)]">
      <div className="relative h-20 overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 p-3 text-white shadow-inner">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay transition-transform duration-1000 group-hover:translate-x-full"
          style={{ background: "linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.9), transparent 60%)" }}
        />
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/80">Nova</p>
        <p className="mt-3 font-mono text-[13px] tracking-[0.2em]">4242 4242 •••• 4242</p>
      </div>
      <input placeholder="Cardholder" className="w-full rounded-md bg-white/[0.05] px-3 py-2 text-[12px] text-white placeholder:text-white/40 outline-none" />
      <div className="flex gap-2">
        <input placeholder="MM/YY" className="w-1/2 rounded-md bg-white/[0.05] px-3 py-2 text-[12px] text-white placeholder:text-white/40 outline-none" />
        <input placeholder="CVC" className="w-1/2 rounded-md bg-white/[0.05] px-3 py-2 text-[12px] text-white placeholder:text-white/40 outline-none" />
      </div>
      <button className="w-full rounded-md bg-white py-2 text-[12px] font-semibold text-black">Pay $19</button>
    </form>
  );
}

/* ---------- 08 · Waitlist Glow ---------- */
function WaitlistGlow() {
  return (
    <form className="relative w-64 overflow-hidden rounded-2xl border border-white/10 bg-black p-5 text-center">
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-16 opacity-40 blur-3xl transition-opacity duration-700 group-hover:opacity-90"
        style={{ background: "radial-gradient(50% 50% at 50% 0%, #22d3ee, transparent 70%)" }}
      />
      <div className="relative">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-300/80">Waitlist</p>
        <h4 className="mt-1 text-[14px] font-semibold text-white">Be first in line</h4>
        <div className="mt-3 flex overflow-hidden rounded-full border border-white/10 bg-white/[0.04]">
          <input placeholder="you@nova.dev" className="flex-1 bg-transparent px-3 py-2 text-[12px] text-white placeholder:text-white/40 outline-none" />
          <button className="bg-cyan-400 px-3 py-2 text-[12px] font-semibold text-black">Join</button>
        </div>
      </div>
    </form>
  );
}

/* ---------- 09 · Feedback Rating ---------- */
function FeedbackRating() {
  return (
    <form className="w-64 rounded-2xl border border-white/10 bg-[#0d0d14] p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">Feedback</p>
      <h4 className="mt-1 text-[13px] font-semibold text-white">How was it?</h4>
      <div className="mt-3 flex justify-between gap-1.5">
        {["😞", "😐", "🙂", "😄", "🤩"].map((e, i) => (
          <button
            key={e}
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-[18px] transition-all hover:-translate-y-1 hover:scale-110 hover:border-amber-300/50 hover:bg-white/[0.08] hover:shadow-[0_10px_20px_-6px_rgba(251,191,36,0.5)]"
            style={{ transitionDelay: `${i * 30}ms` }}
          >
            {e}
          </button>
        ))}
      </div>
      <textarea placeholder="Tell us more…" rows={2} className="mt-3 w-full resize-none rounded-md bg-white/[0.05] px-3 py-2 text-[12px] text-white placeholder:text-white/40 outline-none" />
      <button className="mt-2 w-full rounded-md bg-amber-400 py-2 text-[12px] font-semibold text-black">Send</button>
    </form>
  );
}

/* ---------- 10 · Multi-Step Progress ---------- */
function MultiStep() {
  return (
    <form className="w-64 rounded-2xl border border-white/10 bg-gradient-to-b from-[#0f0f16] to-[#050505] p-4">
      <div className="mb-3 flex items-center gap-2">
        {[1, 2, 3].map((n, i) => (
          <div key={n} className="flex flex-1 items-center gap-2">
            <span
              className={`grid h-6 w-6 place-items-center rounded-full text-[10px] font-semibold transition-all ${
                i === 0 ? "bg-white text-black" : "bg-white/10 text-white/60"
              } group-hover:scale-110`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {n}
            </span>
            {i < 2 && (
              <span
                className="relative h-[2px] flex-1 overflow-hidden rounded-full bg-white/10"
              >
                <span
                  className="absolute inset-y-0 left-0 w-0 bg-white transition-all duration-700 group-hover:w-full"
                  style={{ transitionDelay: `${i * 200}ms` }}
                />
              </span>
            )}
          </div>
        ))}
      </div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">Step 1 · Profile</p>
      <input placeholder="Full name" className="mt-2 w-full rounded-md bg-white/[0.05] px-3 py-2 text-[12px] text-white placeholder:text-white/40 outline-none" />
      <input placeholder="Username" className="mt-2 w-full rounded-md bg-white/[0.05] px-3 py-2 text-[12px] text-white placeholder:text-white/40 outline-none" />
      <div className="mt-3 flex gap-2">
        <button className="flex-1 rounded-md border border-white/10 py-2 text-[12px] text-white/70">Back</button>
        <button className="flex-1 rounded-md bg-white py-2 text-[12px] font-semibold text-black">Next →</button>
      </div>
    </form>
  );
}

/* ---------- Copy-paste ready React + Tailwind snippets ---------- */

const CODE: Record<string, string> = {
  "Glass Sign In": `// Glass Sign In — React + Tailwind CSS
export function GlassSignIn() {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="group relative w-72 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] transition-transform duration-500 [transform:perspective(900px)] hover:[transform:perspective(900px)_rotateX(4deg)_translateY(-3px)]"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-16 opacity-60 blur-3xl transition-opacity duration-700 group-hover:opacity-90"
        style={{ background: "conic-gradient(from 90deg at 30% 20%, #7c3aed, #22d3ee, #ec4899, #7c3aed)" }}
      />
      <div className="relative space-y-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">Sign in</p>
        <input type="email" placeholder="you@nova.dev"
          className="w-full rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-xs text-white placeholder:text-white/40 outline-none focus:border-white/30" />
        <input type="password" placeholder="••••••••"
          className="w-full rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-xs text-white placeholder:text-white/40 outline-none focus:border-white/30" />
        <button className="w-full rounded-lg bg-white py-2 text-xs font-semibold text-black transition-transform group-hover:scale-[1.02]">
          Continue
        </button>
      </div>
    </form>
  );
}`,

  "Neon Contact": `// Neon Contact — React + Tailwind CSS
export function NeonContact() {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="group relative w-72 rounded-2xl border border-white/10 bg-[#0a0a12] p-4 transition-shadow duration-500 hover:shadow-[0_0_40px_-6px_rgba(124,58,237,0.55)]"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: "linear-gradient(120deg, transparent 40%, rgba(124,58,237,0.35), transparent 60%)",
          backgroundSize: "200% 100%",
          animation: "nc-sweep 3s linear infinite",
        }}
      />
      <div className="relative space-y-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">Contact</p>
        <input placeholder="Name"
          className="w-full rounded-md bg-white/[0.05] px-3 py-2 text-xs text-white placeholder:text-white/40 outline-none focus:ring-1 focus:ring-fuchsia-400/60" />
        <textarea placeholder="Message" rows={2}
          className="w-full resize-none rounded-md bg-white/[0.05] px-3 py-2 text-xs text-white placeholder:text-white/40 outline-none focus:ring-1 focus:ring-fuchsia-400/60" />
        <button className="w-full rounded-md bg-gradient-to-r from-fuchsia-500 to-violet-500 py-2 text-xs font-semibold text-white">
          Send
        </button>
      </div>
      <style>{\`@keyframes nc-sweep{0%{background-position:0% 0}100%{background-position:200% 0}}\`}</style>
    </form>
  );
}`,

  "Floating Label": `// Floating Label — React + Tailwind CSS
export function FloatingLabel() {
  return (
    <form className="w-72 space-y-3 rounded-2xl border border-white/10 bg-gradient-to-b from-[#111] to-[#050505] p-4">
      {["Email", "Password"].map((label) => (
        <label key={label} className="relative block">
          <input placeholder=" "
            className="peer w-full rounded-lg border border-white/10 bg-transparent px-3 pb-2 pt-5 text-xs text-white outline-none transition-colors focus:border-cyan-400/60" />
          <span className="pointer-events-none absolute left-3 top-1.5 text-[10px] uppercase tracking-[0.15em] text-white/50 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:uppercase peer-focus:text-cyan-300">
            {label}
          </span>
        </label>
      ))}
      <button className="w-full rounded-lg border border-white/10 bg-white/[0.05] py-2 text-xs font-semibold text-white transition-all hover:border-cyan-300/40 hover:bg-white/[0.08]">
        Log in
      </button>
    </form>
  );
}`,

  "3D Tilt Newsletter": `// 3D Tilt Newsletter — React + Tailwind CSS
export function TiltNewsletter() {
  return (
    <div className="group [perspective:1000px]">
      <form className="relative w-72 rounded-2xl border border-white/10 bg-[#0e0e14] p-4 shadow-[0_25px_60px_-25px_rgba(0,0,0,0.9)] transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateX(8deg)_rotateY(-8deg)]">
        <div className="space-y-3 [transform:translateZ(30px)]">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">Newsletter</p>
          <h4 className="text-sm font-semibold text-white">Join 12k readers</h4>
          <input placeholder="you@nova.dev"
            className="w-full rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white placeholder:text-white/40 outline-none focus:border-white/30" />
          <button className="w-full rounded-md bg-white py-2 text-xs font-semibold text-black">Subscribe</button>
        </div>
      </form>
    </div>
  );
}`,

  "OTP Verification": `// OTP Verification — React + Tailwind CSS
export function OtpForm() {
  return (
    <form className="group w-72 rounded-2xl border border-white/10 bg-gradient-to-b from-[#0f0f16] to-[#050505] p-4 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">Verify</p>
      <h4 className="mt-1 text-[13px] font-semibold text-white">Enter 4-digit code</h4>
      <div className="mt-3 flex justify-center gap-2">
        {[0, 1, 2, 3].map((i) => (
          <input key={i} maxLength={1}
            style={{ transitionDelay: \`\${i * 40}ms\` }}
            className="h-11 w-9 rounded-lg border border-white/10 bg-white/[0.04] text-center text-base font-semibold text-white outline-none transition-all focus:-translate-y-0.5 focus:border-emerald-400/60 focus:shadow-[0_0_20px_-4px_rgba(52,211,153,0.6)]" />
        ))}
      </div>
      <button className="mt-4 w-full rounded-lg bg-emerald-500 py-2 text-xs font-semibold text-black transition-transform group-hover:scale-[1.02]">
        Verify
      </button>
    </form>
  );
}`,

  "Search + Filters": `// Search + Filters — React + Tailwind CSS
export function SearchFilters() {
  return (
    <form className="group w-72 rounded-2xl border border-white/10 bg-[#0b0b12] p-4">
      <div className="relative">
        <input placeholder="Search projects…"
          className="w-full rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 pr-9 text-xs text-white placeholder:text-white/40 outline-none focus:border-white/30" />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50">⌘K</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {["Design", "Code", "Docs", "Ai"].map((t, i) => (
          <span key={t}
            style={{ transitionDelay: \`\${i * 40}ms\` }}
            className="cursor-pointer rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] text-white/70 transition-all hover:border-white/30 hover:text-white group-hover:-translate-y-0.5">
            {t}
          </span>
        ))}
      </div>
    </form>
  );
}`,

  "Card Payment": `// Card Payment — React + Tailwind CSS
export function CardPayment() {
  return (
    <form className="group w-72 space-y-3 rounded-2xl border border-white/10 bg-gradient-to-br from-[#141420] via-[#0a0a12] to-[#050505] p-4 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)]">
      <div className="relative h-20 overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 p-3 text-white shadow-inner">
        <span aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay transition-transform duration-1000 group-hover:translate-x-full"
          style={{ background: "linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.9), transparent 60%)" }} />
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/80">Nova</p>
        <p className="mt-3 font-mono text-[13px] tracking-[0.2em]">4242 4242 •••• 4242</p>
      </div>
      <input placeholder="Cardholder" className="w-full rounded-md bg-white/[0.05] px-3 py-2 text-xs text-white placeholder:text-white/40 outline-none" />
      <div className="flex gap-2">
        <input placeholder="MM/YY" className="w-1/2 rounded-md bg-white/[0.05] px-3 py-2 text-xs text-white placeholder:text-white/40 outline-none" />
        <input placeholder="CVC" className="w-1/2 rounded-md bg-white/[0.05] px-3 py-2 text-xs text-white placeholder:text-white/40 outline-none" />
      </div>
      <button className="w-full rounded-md bg-white py-2 text-xs font-semibold text-black">Pay $19</button>
    </form>
  );
}`,

  "Waitlist Glow": `// Waitlist Glow — React + Tailwind CSS
export function WaitlistGlow() {
  return (
    <form className="group relative w-72 overflow-hidden rounded-2xl border border-white/10 bg-black p-5 text-center">
      <span aria-hidden
        className="pointer-events-none absolute -inset-16 opacity-40 blur-3xl transition-opacity duration-700 group-hover:opacity-90"
        style={{ background: "radial-gradient(50% 50% at 50% 0%, #22d3ee, transparent 70%)" }} />
      <div className="relative">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-300/80">Waitlist</p>
        <h4 className="mt-1 text-sm font-semibold text-white">Be first in line</h4>
        <div className="mt-3 flex overflow-hidden rounded-full border border-white/10 bg-white/[0.04]">
          <input placeholder="you@nova.dev" className="flex-1 bg-transparent px-3 py-2 text-xs text-white placeholder:text-white/40 outline-none" />
          <button className="bg-cyan-400 px-3 py-2 text-xs font-semibold text-black">Join</button>
        </div>
      </div>
    </form>
  );
}`,

  "Feedback Rating": `// Feedback Rating — React + Tailwind CSS
export function FeedbackRating() {
  return (
    <form className="w-72 rounded-2xl border border-white/10 bg-[#0d0d14] p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">Feedback</p>
      <h4 className="mt-1 text-[13px] font-semibold text-white">How was it?</h4>
      <div className="mt-3 flex justify-between gap-1.5">
        {["😞", "😐", "🙂", "😄", "🤩"].map((e, i) => (
          <button key={e} type="button"
            style={{ transitionDelay: \`\${i * 30}ms\` }}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-lg transition-all hover:-translate-y-1 hover:scale-110 hover:border-amber-300/50 hover:bg-white/[0.08] hover:shadow-[0_10px_20px_-6px_rgba(251,191,36,0.5)]">
            {e}
          </button>
        ))}
      </div>
      <textarea placeholder="Tell us more…" rows={2}
        className="mt-3 w-full resize-none rounded-md bg-white/[0.05] px-3 py-2 text-xs text-white placeholder:text-white/40 outline-none" />
      <button className="mt-2 w-full rounded-md bg-amber-400 py-2 text-xs font-semibold text-black">Send</button>
    </form>
  );
}`,

  "Multi-Step Progress": `// Multi-Step Progress — React + Tailwind CSS
export function MultiStep() {
  return (
    <form className="group w-72 rounded-2xl border border-white/10 bg-gradient-to-b from-[#0f0f16] to-[#050505] p-4">
      <div className="mb-3 flex items-center gap-2">
        {[1, 2, 3].map((n, i) => (
          <div key={n} className="flex flex-1 items-center gap-2">
            <span
              style={{ transitionDelay: \`\${i * 80}ms\` }}
              className={\`grid h-6 w-6 place-items-center rounded-full text-[10px] font-semibold transition-all group-hover:scale-110 \${
                i === 0 ? "bg-white text-black" : "bg-white/10 text-white/60"
              }\`}
            >
              {n}
            </span>
            {i < 2 && (
              <span className="relative h-[2px] flex-1 overflow-hidden rounded-full bg-white/10">
                <span
                  style={{ transitionDelay: \`\${i * 200}ms\` }}
                  className="absolute inset-y-0 left-0 w-0 bg-white transition-all duration-700 group-hover:w-full" />
              </span>
            )}
          </div>
        ))}
      </div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">Step 1 · Profile</p>
      <input placeholder="Full name" className="mt-2 w-full rounded-md bg-white/[0.05] px-3 py-2 text-xs text-white placeholder:text-white/40 outline-none" />
      <input placeholder="Username" className="mt-2 w-full rounded-md bg-white/[0.05] px-3 py-2 text-xs text-white placeholder:text-white/40 outline-none" />
      <div className="mt-3 flex gap-2">
        <button className="flex-1 rounded-md border border-white/10 py-2 text-xs text-white/70">Back</button>
        <button className="flex-1 rounded-md bg-white py-2 text-xs font-semibold text-black">Next →</button>
      </div>
    </form>
  );
}`,
};

const codeFor = (name: string) =>
  CODE[name] ??
  `// ${name} — Novix UI premium form\n// Copy-paste ready snippet coming soon.\n`;

export const FORMS: FormItem[] = [
  { id: "glass-signin", name: "Glass Sign In", render: () => <GlassSignIn />, code: codeFor("Glass Sign In") },
  { id: "neon-contact", name: "Neon Contact", render: () => <NeonContact />, code: codeFor("Neon Contact") },
  { id: "floating-label", name: "Floating Label", render: () => <FloatingLabel />, code: codeFor("Floating Label") },
  { id: "tilt-card", name: "3D Tilt Newsletter", render: () => <TiltCardForm />, code: codeFor("3D Tilt Newsletter") },
  { id: "otp", name: "OTP Verification", render: () => <OtpForm />, code: codeFor("OTP Verification") },
  { id: "search-filters", name: "Search + Filters", render: () => <SearchFilters />, code: codeFor("Search + Filters") },
  { id: "card-payment", name: "Card Payment", render: () => <CardPayment />, code: codeFor("Card Payment") },
  { id: "waitlist-glow", name: "Waitlist Glow", render: () => <WaitlistGlow />, code: codeFor("Waitlist Glow") },
  { id: "feedback-rating", name: "Feedback Rating", render: () => <FeedbackRating />, code: codeFor("Feedback Rating") },
  { id: "multi-step", name: "Multi-Step Progress", render: () => <MultiStep />, code: codeFor("Multi-Step Progress") },
];

