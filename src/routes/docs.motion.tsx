import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { RotateCcw, Sparkles, Zap, Layers, Orbit, Wand2 } from "lucide-react";
import { Button, Card, IconButton, Spinner } from "@/nova";
import { cn } from "@/nova/utils";
import { DocsShell, DocLead, DocSection } from "@/components/docs/docs-shell";
import { CodeBlock } from "@/components/docs/code-block";

export const Route = createFileRoute("/docs/motion")({
  component: MotionShowcase,
  head: () => ({
    meta: [
      { title: "Motion · Novix UI" },
      {
        name: "description",
        content:
          "Novix UI motion showcase — entrance, hover, loading, spring presets, and reduced-motion behavior.",
      },
      { property: "og:title", content: "Motion · Novix UI" },
      {
        property: "og:description",
        content: "Spring physics, choreography, and motion that respects everybody.",
      },
    ],
  }),
});

const SPRINGS = {
  snap: { type: "spring" as const, stiffness: 500, damping: 32 },
  soft: { type: "spring" as const, stiffness: 260, damping: 26 },
  glide: { type: "spring" as const, stiffness: 140, damping: 22 },
  bounce: { type: "spring" as const, stiffness: 320, damping: 12 },
};

const DURATIONS = [120, 200, 320, 500, 800];

function MotionShowcase() {
  const [key, setKey] = useState(0);
  const reduce = useReducedMotion();

  return (
    <DocsShell
      eyebrow="Foundations"
      title="Motion showcase"
      description="Every Nova animation is a spring or a curve — never a linear tween. Try every preset side by side."
      toc={[
        { id: "entrance", label: "Entrance" },
        { id: "hover", label: "Hover" },
        { id: "tilt", label: "3D Tilt cards" },
        { id: "magnetic", label: "Magnetic pull" },
        { id: "flip", label: "3D Flip" },
        { id: "orbit", label: "Orbit system" },
        { id: "morph", label: "Morphing shape" },
        { id: "parallax", label: "Layered parallax" },
        { id: "loading", label: "Loading" },
        { id: "springs", label: "Spring presets" },
        { id: "duration", label: "Duration comparison" },
        { id: "reduce", label: "Reduced motion" },
      ]}
    >
      <DocLead>
        Motion carries meaning. Nova uses stiff springs for interaction, soft springs for layout,
        and a glide spring for choreography. Every animation checks{" "}
        <code className="rounded bg-subtle px-1 font-mono text-[12.5px]">
          prefers-reduced-motion
        </code>
        .
      </DocLead>

      <div className="mt-6 flex items-center gap-2">
        <Button
          leadingIcon={<RotateCcw />}
          variant="secondary"
          size="sm"
          onClick={() => setKey((k) => k + 1)}
        >
          Replay all
        </Button>
        <span className="text-[12.5px] text-muted-foreground">
          {reduce ? "Reduced motion detected — animations are simplified." : "Full motion enabled."}
        </span>
      </div>

      <DocSection id="entrance" title="Entrance animations">
        <Stage>
          {(["fade", "rise", "scale", "stagger"] as const).map((kind) => (
            <EntranceDemo key={`${kind}-${key}`} kind={kind} />
          ))}
        </Stage>
      </DocSection>

      <DocSection id="hover" title="Hover">
        <Stage>
          <HoverCard label="Lift" whileHover={{ y: -4, transition: SPRINGS.snap }} />
          <HoverCard label="Scale" whileHover={{ scale: 1.04, transition: SPRINGS.snap }} />
          <HoverCard label="Tilt" whileHover={{ rotate: -3, y: -2, transition: SPRINGS.soft }} />
          <HoverCard label="Glow" whileHover={{ boxShadow: "0 0 32px var(--accent)" }} />
        </Stage>
      </DocSection>

      <DocSection id="tilt" title="3D Tilt cards">
        <Stage>
          <TiltCard icon={<Sparkles />} label="Aurora" tint="from-fuchsia-500 to-cyan-400" />
          <TiltCard icon={<Zap />} label="Voltage" tint="from-amber-400 to-rose-500" />
          <TiltCard icon={<Layers />} label="Stack" tint="from-emerald-400 to-sky-500" />
          <TiltCard icon={<Wand2 />} label="Magic" tint="from-violet-500 to-indigo-400" />
        </Stage>
      </DocSection>

      <DocSection id="magnetic" title="Magnetic pull">
        <Card className="grid place-items-center p-10">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Magnetic><Button variant="primary" size="lg">Get Novix</Button></Magnetic>
            <Magnetic strength={0.6}><Button variant="secondary" size="lg">Docs</Button></Magnetic>
            <Magnetic strength={0.9}>
              <div className="grid size-14 place-items-center rounded-full bg-gradient-to-br from-accent to-primary text-white shadow-[0_10px_40px_-10px_var(--accent)]">
                <Sparkles className="size-6" />
              </div>
            </Magnetic>
          </div>
          <p className="mt-6 text-[12px] text-muted-foreground">Hover close — the surface reaches back.</p>
        </Card>
      </DocSection>

      <DocSection id="flip" title="3D Flip">
        <Stage>
          <FlipCard front="Hover" back="Novix" />
          <FlipCard front="Design" back="System" />
          <FlipCard front="Motion" back="Alive" />
          <FlipCard front="Craft" back="Detail" />
        </Stage>
      </DocSection>

      <DocSection id="orbit" title="Orbit system">
        <Card className="grid place-items-center p-10">
          <OrbitSystem />
        </Card>
      </DocSection>

      <DocSection id="morph" title="Morphing shape">
        <Card className="grid place-items-center p-10">
          <MorphBlob />
        </Card>
      </DocSection>

      <DocSection id="parallax" title="Layered parallax">
        <Parallax />
      </DocSection>

      <DocSection id="loading" title="Loading states">

        <Stage>
          <Card className="grid place-items-center p-6">
            <Spinner size="lg" />
            <p className="mt-3 text-[12px] text-muted-foreground">Spinner</p>
          </Card>
          <Card className="grid place-items-center gap-2 p-6">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="size-2 rounded-full bg-accent"
                  animate={{ y: [0, -6, 0], opacity: [0.5, 1, 0.5] }}
                  transition={{
                    duration: 0.9,
                    repeat: Infinity,
                    delay: i * 0.12,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
            <p className="mt-1 text-[12px] text-muted-foreground">Thinking dots</p>
          </Card>
          <Card className="grid place-items-center p-6">
            <div className="relative h-1.5 w-32 overflow-hidden rounded-full bg-subtle">
              <motion.div
                className="absolute inset-y-0 w-1/3 rounded-full bg-gradient-to-r from-accent to-primary"
                animate={{ x: ["-100%", "300%"] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            <p className="mt-3 text-[12px] text-muted-foreground">Progress sweep</p>
          </Card>
        </Stage>
      </DocSection>

      <DocSection id="springs" title="Spring presets">
        <Stage>
          {(Object.keys(SPRINGS) as Array<keyof typeof SPRINGS>).map((name) => (
            <SpringDemo key={`${name}-${key}`} name={name} />
          ))}
        </Stage>
        <CodeBlock
          title="src/nova/animations/springs.ts"
          language="ts"
          showLineNumbers
          code={`export const springs = {
  snap:   { type: "spring", stiffness: 500, damping: 32 },
  soft:   { type: "spring", stiffness: 260, damping: 26 },
  glide:  { type: "spring", stiffness: 140, damping: 22 },
  bounce: { type: "spring", stiffness: 320, damping: 12 },
};`}
        />
      </DocSection>

      <DocSection id="duration" title="Duration comparison">
        <Card className="p-6">
          <div className="space-y-3">
            {DURATIONS.map((d) => (
              <div key={d} className="flex items-center gap-4">
                <span className="w-14 font-mono text-[11px] text-muted-foreground">{d}ms</span>
                <div className="relative h-8 flex-1 rounded-md bg-subtle/60">
                  <motion.div
                    key={key}
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: d / 1000, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-y-0 left-0 rounded-md bg-gradient-to-r from-accent to-primary"
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </DocSection>

      <DocSection id="reduce" title="Reduced-motion preview">
        <Card className="p-6">
          <ReducedPreview />
        </Card>
      </DocSection>
    </DocsShell>
  );
}

function Stage({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{children}</div>;
}

function EntranceDemo({ kind }: { kind: "fade" | "rise" | "scale" | "stagger" }) {
  const initial =
    kind === "fade"
      ? { opacity: 0 }
      : kind === "rise"
        ? { opacity: 0, y: 16 }
        : kind === "scale"
          ? { opacity: 0, scale: 0.92 }
          : { opacity: 0, y: 12 };
  if (kind === "stagger") {
    return (
      <Card className="grid h-32 place-items-center p-4">
        <div className="flex gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <motion.span
              key={i}
              initial={initial}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRINGS.soft, delay: i * 0.08 }}
              className="size-3 rounded-full bg-accent"
            />
          ))}
        </div>
        <p className="mt-2 text-[12px] text-muted-foreground">stagger</p>
      </Card>
    );
  }
  return (
    <Card className="grid h-32 place-items-center p-4">
      <motion.div
        initial={initial}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={SPRINGS.soft}
        className="grid size-10 place-items-center rounded-lg bg-gradient-to-br from-accent to-primary text-white"
      >
        ✦
      </motion.div>
      <p className="mt-2 text-[12px] text-muted-foreground">{kind}</p>
    </Card>
  );
}

function HoverCard({
  label,
  whileHover,
}: {
  label: string;
  whileHover: Parameters<typeof motion.div>[0]["whileHover"];
}) {
  return (
    <motion.div whileHover={whileHover} whileTap={{ scale: 0.97 }} className="h-32">
      <Card className="grid h-full place-items-center p-4">
        <p className="text-[13px] font-medium">{label}</p>
      </Card>
    </motion.div>
  );
}

function SpringDemo({ name }: { name: keyof typeof SPRINGS }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setOn((v) => !v), 1600);
    return () => clearInterval(id);
  }, []);
  return (
    <Card className="grid h-32 place-content-center place-items-center p-4">
      <motion.div
        animate={{ x: on ? 40 : -40 }}
        transition={SPRINGS[name]}
        className="grid size-8 place-items-center rounded-md bg-gradient-to-br from-accent to-primary text-white shadow-[0_6px_18px_-6px_var(--accent)]"
      >
        ✦
      </motion.div>
      <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        {name}
      </p>
    </Card>
  );
}

function ReducedPreview() {
  const [simulate, setSimulate] = useState(false);
  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={simulate}
          onClick={() => setSimulate((v) => !v)}
          className={cn(
            "nova-focus-ring relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
            simulate ? "bg-accent" : "bg-subtle border border-border",
          )}
        >
          <span
            className={cn(
              "size-5 rounded-full bg-background shadow-[0_1px_2px_rgba(0,0,0,0.25)] transition-transform",
              simulate ? "translate-x-[22px]" : "translate-x-0.5",
            )}
          />
        </button>
        <span className="text-[13px] text-muted-foreground">Simulate reduced motion</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={simulate ? "reduced" : "full"}
            initial={simulate ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={simulate ? { opacity: 0 } : { opacity: 0, y: -16, scale: 0.9 }}
            transition={simulate ? { duration: 0.15 } : SPRINGS.bounce}
          >
            <Card className="grid h-32 place-items-center p-4">
              <IconButton variant="accent" icon={<RotateCcw />} aria-label="Replay" />
              <p className="mt-2 text-[12px] text-muted-foreground">
                {simulate ? "Simple fade" : "Bouncy spring"}
              </p>
            </Card>
          </motion.div>
        </AnimatePresence>
        <Card className="p-4 text-[12.5px] text-muted-foreground leading-relaxed">
          Nova components check{" "}
          <code className="rounded bg-subtle px-1 font-mono text-[11.5px]">useReducedMotion()</code>{" "}
          and swap springs for near-instant fades. Never remove animation entirely — remove the
          physics.
        </Card>
      </div>
    </div>
  );
}

function TiltCard({ icon, label, tint }: { icon: React.ReactNode; label: string; tint: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(useTransform(y, [-50, 50], [12, -12]), SPRINGS.soft);
  const ry = useSpring(useTransform(x, [-50, 50], [-12, 12]), SPRINGS.soft);
  const glowX = useTransform(x, [-50, 50], ["0%", "100%"]);
  const glowY = useTransform(y, [-50, 50], ["0%", "100%"]);
  return (
    <motion.div
      ref={ref}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        x.set(e.clientX - r.left - r.width / 2);
        y.set(e.clientY - r.top - r.height / 2);
      }}
      onPointerLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 800 }}
      className="relative h-40 cursor-pointer will-change-transform"
    >
      <Card className="relative grid h-full place-items-center overflow-hidden p-4">
        <motion.div
          style={{ background: `radial-gradient(220px circle at ${glowX} ${glowY}, color-mix(in oklab, var(--accent) 35%, transparent), transparent 60%)` }}
          className="pointer-events-none absolute inset-0"
        />
        <div className={cn("grid size-12 place-items-center rounded-xl bg-gradient-to-br text-white shadow-[0_10px_30px_-10px_var(--accent)]", tint)}>
          {icon}
        </div>
        <p className="mt-2 text-[12.5px] font-medium">{label}</p>
      </Card>
    </motion.div>
  );
}

function Magnetic({ children, strength = 0.4 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, SPRINGS.snap);
  const y = useSpring(0, SPRINGS.snap);
  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onPointerLeave={() => { x.set(0); y.set(0); }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}

function FlipCard({ front, back }: { front: string; back: string }) {
  return (
    <div className="group h-40" style={{ perspective: 1000 }}>
      <motion.div
        className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]"
      >
        <Card className="absolute inset-0 grid place-items-center p-4 [backface-visibility:hidden]">
          <p className="text-[13px] font-medium text-muted-foreground">{front}</p>
        </Card>
        <Card className="absolute inset-0 grid place-items-center overflow-hidden p-4 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/30 via-primary/20 to-transparent" />
          <p className="relative bg-gradient-to-br from-accent to-primary bg-clip-text text-lg font-semibold text-transparent">{back}</p>
        </Card>
      </motion.div>
    </div>
  );
}

function OrbitSystem() {
  return (
    <div className="relative grid size-64 place-items-center">
      <div className="absolute inset-0 rounded-full border border-border/60" />
      <div className="absolute inset-6 rounded-full border border-border/50" />
      <div className="absolute inset-12 rounded-full border border-border/40" />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0"
      >
        <span className="absolute left-1/2 top-0 size-3 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_18px_var(--accent)]" />
      </motion.div>
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute inset-6"
      >
        <span className="absolute left-1/2 top-0 size-2.5 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_14px_var(--primary)]" />
      </motion.div>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        className="absolute inset-12"
      >
        <span className="absolute left-1/2 top-0 size-2 -translate-x-1/2 rounded-full bg-fuchsia-400 shadow-[0_0_12px_theme(colors.fuchsia.400)]" />
      </motion.div>
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative grid size-14 place-items-center rounded-full bg-gradient-to-br from-accent to-primary text-white shadow-[0_0_40px_-4px_var(--accent)]"
      >
        <Orbit className="size-6" />
      </motion.div>
    </div>
  );
}

function MorphBlob() {
  const paths = [
    "M60,-52C74,-36,79,-11,73,10C67,32,50,52,28,62C6,73,-22,74,-42,62C-63,50,-77,25,-77,0C-77,-25,-63,-50,-42,-63C-22,-77,6,-77,28,-70C50,-63,46,-68,60,-52Z",
    "M52,-46C63,-30,64,-9,58,10C51,29,37,45,17,58C-3,71,-30,80,-49,69C-68,58,-80,27,-78,0C-76,-27,-60,-51,-40,-64C-19,-77,6,-79,25,-72C43,-65,41,-62,52,-46Z",
    "M66,-58C81,-42,85,-14,78,10C71,34,53,55,30,66C6,77,-23,79,-44,66C-64,54,-76,27,-76,1C-76,-26,-64,-52,-45,-66C-27,-80,-1,-83,20,-75C42,-67,52,-73,66,-58Z",
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % paths.length), 1800);
    return () => clearInterval(id);
  }, []);
  return (
    <svg viewBox="-100 -100 200 200" className="size-56">
      <defs>
        <linearGradient id="blob" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--primary)" />
        </linearGradient>
      </defs>
      <motion.path
        d={paths[i]}
        fill="url(#blob)"
        animate={{ d: paths[i] }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ filter: "drop-shadow(0 20px 40px color-mix(in oklab, var(--accent) 40%, transparent))" }}
      />
    </svg>
  );
}

function Parallax() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const l1x = useSpring(useTransform(x, [-50, 50], [-8, 8]), SPRINGS.soft);
  const l1y = useSpring(useTransform(y, [-50, 50], [-8, 8]), SPRINGS.soft);
  const l2x = useSpring(useTransform(x, [-50, 50], [-18, 18]), SPRINGS.soft);
  const l2y = useSpring(useTransform(y, [-50, 50], [-18, 18]), SPRINGS.soft);
  const l3x = useSpring(useTransform(x, [-50, 50], [-32, 32]), SPRINGS.soft);
  const l3y = useSpring(useTransform(y, [-50, 50], [-32, 32]), SPRINGS.soft);
  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        x.set(e.clientX - r.left - r.width / 2);
        y.set(e.clientY - r.top - r.height / 2);
      }}
      onPointerLeave={() => { x.set(0); y.set(0); }}
      className="relative grid h-64 place-items-center overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-subtle/50 to-transparent"
      style={{ perspective: 900 }}
    >
      <motion.div style={{ x: l1x, y: l1y }} className="absolute left-10 top-8 size-24 rounded-full bg-gradient-to-br from-fuchsia-500/40 to-transparent blur-2xl" />
      <motion.div style={{ x: l2x, y: l2y }} className="absolute right-12 bottom-10 size-32 rounded-full bg-gradient-to-br from-cyan-400/40 to-transparent blur-2xl" />
      <motion.div style={{ x: l3x, y: l3y }} className="relative grid size-20 place-items-center rounded-2xl bg-gradient-to-br from-accent to-primary text-white shadow-[0_20px_60px_-15px_var(--accent)]">
        <Sparkles className="size-8" />
      </motion.div>
      <p className="absolute bottom-3 right-4 font-mono text-[11px] text-muted-foreground">move your cursor</p>
    </div>
  );
}
