import { useRef, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, useMotionTemplate, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { Sparkles, ArrowUpRight, Github, Zap, Rocket, Cloud, Layers, Bot, Cpu, Palette } from "lucide-react";
import { DocsShell, DocSection, DocLead } from "@/components/docs/docs-shell";
import {
  Announcement, Badge, Comparison, Cursor, Marquee, Rating, Snippet, Status, Ticker,
} from "@/nova";

export const Route = createFileRoute("/docs/lab")({
  component: LabPage,
  head: () => ({
    meta: [
      { title: "Lab · Novix UI" },
      { name: "description", content: "Premium 3D-animated showcase of Nova's newest primitives — Marquee, Announcement, Comparison, Cursor, Ticker, Rating, Snippet, Status." },
      { property: "og:title", content: "Novix UI Lab — 3D showcase" },
      { property: "og:description", content: "Premium animated primitives, presented on tilting glass surfaces." },
      { property: "og:url", content: "/docs/lab" },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Novix UI Lab — 3D showcase" },
      { name: "twitter:description", content: "Premium animated primitives, presented on tilting glass surfaces." },
    ],
    links: [{ rel: "canonical", href: "/docs/lab" }],
  }),
});

/* ---------- TiltCard: 3D perspective on pointer ---------- */
function TiltCard({
  title, kicker, children, accent = "var(--accent)",
}: { title: string; kicker: string; children: ReactNode; accent?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useMotionValue(0), { stiffness: 220, damping: 22, mass: 0.5 });
  const ry = useSpring(useMotionValue(0), { stiffness: 220, damping: 22, mass: 0.5 });

  const halo = useMotionTemplate`radial-gradient(420px circle at ${mx}px ${my}px, color-mix(in oklab, ${accent} 22%, transparent), transparent 55%)`;

  return (
    <motion.div
      ref={ref}
      onPointerMove={(e) => {
        if (reduce || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const px = e.clientX - r.left;
        const py = e.clientY - r.top;
        mx.set(px); my.set(py);
        const nx = px / r.width - 0.5;
        const ny = py / r.height - 0.5;
        ry.set(nx * 10);
        rx.set(-ny * 10);
      }}
      onPointerLeave={() => { rx.set(0); ry.set(0); }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1200 }}
      className="group relative overflow-hidden rounded-2xl border border-border/70 bg-surface p-5 shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_20px_60px_-30px_rgba(0,0,0,0.35)]"
    >
      {/* halo */}
      <motion.div aria-hidden style={{ background: halo }} className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      {/* moon-edge */}
      <div aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl [mask:linear-gradient(#000,transparent_30%)] [background:linear-gradient(180deg,rgba(255,255,255,0.08),transparent)]" />

      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{kicker}</span>
          <span className="text-[10.5px] font-mono text-muted-foreground/70">nova/ui</span>
        </div>
        <h3 className="mb-4 text-[15px] font-semibold tracking-tight text-foreground">{title}</h3>
        <div style={{ transform: "translateZ(30px)" }} className="[transform-style:preserve-3d]">
          {children}
        </div>
      </div>
    </motion.div>
  );
}

function LabPage() {
  return (
    <DocsShell
      eyebrow="Lab"
      title="Nova Lab"
      description="A curated set of premium primitives — inspired by the Kibo pattern library, rebuilt on Nova tokens with 3D-tilting showcases and reduced-motion safety."
      toc={[
        { id: "intro", label: "Intro" },
        { id: "showcase", label: "Showcase" },
        { id: "install", label: "Install" },
      ]}
    >
      <DocSection id="intro" title="Eight new primitives">
        <DocLead>
          Every card below is a live component. Hover to tilt — the surface responds with a cursor-tracked halo and a subtle perspective shift. Motion respects <code className="rounded bg-subtle px-1 py-0.5 font-mono text-[12px]">prefers-reduced-motion</code>.
        </DocLead>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant="accent"><Sparkles className="size-3" /> New in v0.2</Badge>
          <Badge variant="outline">8 primitives</Badge>
          <Badge variant="outline">Zero deps beyond Motion & Lucide</Badge>
        </div>
      </DocSection>

      <DocSection id="showcase" title="Showcase">
        <div className="mt-6 grid gap-5 sm:grid-cols-2 [perspective:1400px]">

          <TiltCard kicker="Marquee" title="Infinite, seamless scroller">
            <Marquee speed={22} className="py-2">
              {[Zap, Rocket, Cloud, Layers, Bot, Cpu, Palette, Sparkles].map((I, i) => (
                <div key={i} className="flex items-center gap-2 rounded-full border border-border/60 bg-subtle/40 px-3 py-1.5 text-[12px] text-foreground">
                  <I className="size-3.5 text-accent" />
                  <span>{["Deploy","Ship","Sync","Compose","Automate","Compile","Design","Delight"][i]}</span>
                </div>
              ))}
            </Marquee>
          </TiltCard>

          <TiltCard kicker="Announcement" title="Top-of-page launch pill">
            <div className="grid place-items-center py-6">
              <Announcement tag="New" variant="accent">
                Nova Lab is live — explore 8 primitives
              </Announcement>
            </div>
          </TiltCard>

          <TiltCard kicker="Ticker" title="Animated count-up numbers">
            <div className="grid grid-cols-3 gap-3 py-2">
              {[
                { v: 12480, s: "installs", p: "" },
                { v: 3.8,  s: "k stars",  p: "" },
                { v: 99,   s: "% a11y",   p: "" },
              ].map((m, i) => (
                <div key={i} className="rounded-xl border border-border/60 bg-subtle/30 p-3">
                  <div className="text-[22px] font-semibold tracking-tight text-foreground">
                    <Ticker value={m.v} decimals={m.v % 1 !== 0 ? 1 : 0} />
                  </div>
                  <div className="text-[11px] text-muted-foreground">{m.s}</div>
                </div>
              ))}
            </div>
          </TiltCard>

          <TiltCard kicker="Status" title="Presence & health">
            <div className="flex flex-wrap items-center gap-2 py-4">
              <Status tone="online">Online</Status>
              <Status tone="busy">Deploying</Status>
              <Status tone="away" pulse={false}>Idle</Status>
              <Status tone="offline" pulse={false}>Offline</Status>
            </div>
          </TiltCard>

          <TiltCard kicker="Rating" title="Keyboard-first star input">
            <div className="flex flex-col items-start gap-3 py-3">
              <Rating defaultValue={4} />
              <p className="text-[12px] text-muted-foreground">Arrow keys nudge; hover previews.</p>
            </div>
          </TiltCard>

          <TiltCard kicker="Snippet" title="Copyable one-liner">
            <div className="py-3">
              <Snippet>npx @novix-ui/cli add marquee announcement rating</Snippet>
            </div>
          </TiltCard>

          <TiltCard kicker="Cursor" title="Live collaboration pointers">
            <div className="relative h-32 overflow-hidden rounded-lg border border-border/60 bg-subtle/30">
              <motion.div
                animate={{ x: [10, 120, 60, 10], y: [12, 40, 80, 12] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute"
              >
                <Cursor name="Ada" color="var(--accent)" />
              </motion.div>
              <motion.div
                animate={{ x: [220, 140, 260, 220], y: [70, 20, 60, 70] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                className="absolute"
              >
                <Cursor name="Grace" color="#ec4899" />
              </motion.div>
            </div>
          </TiltCard>

          <TiltCard kicker="Comparison" title="Before / after slider">
            <div className="py-2">
              <Comparison
                aspect={16 / 9}
                beforeLabel="Before"
                afterLabel="After"
                before={<div className="h-full w-full bg-[linear-gradient(135deg,#1e293b,#0f172a)]" />}
                after={<div className="h-full w-full bg-[linear-gradient(135deg,var(--accent),#8b5cf6)]" />}
              />
            </div>
          </TiltCard>

        </div>
      </DocSection>

      <DocSection id="install" title="Install anywhere">
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Snippet>npm install @novix-ui/react motion lucide-react</Snippet>
          <Snippet prompt="→">{`import { Marquee, Ticker } from "@novix-ui/react"`}</Snippet>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a href="/docs/components" className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-[13px] font-medium text-foreground transition-colors hover:bg-subtle">
            Browse all components <ArrowUpRight className="size-3.5" />
          </a>
          <a href="https://github.com/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-[13px] font-medium text-foreground transition-colors hover:bg-subtle">
            <Github className="size-3.5" /> GitHub
          </a>
        </div>
      </DocSection>
    </DocsShell>
  );
}
