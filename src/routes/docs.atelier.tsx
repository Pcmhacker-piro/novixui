import { useRef, useState, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, useMotionTemplate, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { Sparkles, ArrowUpRight, Bell, Cpu, Cloud, Zap, CheckCircle2, AlertTriangle } from "lucide-react";
import { DocsShell, DocSection, DocLead } from "@/components/docs/docs-shell";
import {
  Badge, Switch, Tabs, TabsList, TabsTrigger, TabsContent,
  Tooltip, TooltipProvider, TooltipTrigger, TooltipContent,
  Slider, Progress, ToastProvider, useToast, Timeline, Steps, Button,
} from "@/nova";

export const Route = createFileRoute("/docs/atelier")({
  component: AtelierPage,
  head: () => ({
    meta: [
      { title: "Atelier · Novix UI" },
      { name: "description", content: "Premium 3D-animated showcase of Nova's next primitive set — Switch, Tabs, Tooltip, Slider, Progress, Toast, Timeline, Steps." },
      { property: "og:title", content: "Novix UI Atelier — 3D primitive showcase" },
      { property: "og:description", content: "Eight new primitives inspired by the best of modern React libraries, rebuilt on Nova tokens." },
      { property: "og:url", content: "/docs/atelier" },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Novix UI Atelier — 3D primitive showcase" },
      { name: "twitter:description", content: "Eight new primitives inspired by the best of modern React libraries, rebuilt on Nova tokens." },
    ],
    links: [{ rel: "canonical", href: "/docs/atelier" }],
  }),
});

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
        ry.set((px / r.width - 0.5) * 10);
        rx.set(-(py / r.height - 0.5) * 10);
      }}
      onPointerLeave={() => { rx.set(0); ry.set(0); }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1200 }}
      className="group relative overflow-hidden rounded-2xl border border-border/70 bg-surface p-5 shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_20px_60px_-30px_rgba(0,0,0,0.35)]"
    >
      <motion.div aria-hidden style={{ background: halo }} className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
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

function ToastDemo() {
  const { toast } = useToast();
  return (
    <div className="flex flex-wrap gap-2 py-2">
      <Button size="sm" variant="secondary" onClick={() => toast({ variant: "success", title: "Deployed", description: "Preview is live in 1.2s" })}>Success</Button>
      <Button size="sm" variant="secondary" onClick={() => toast({ variant: "info", title: "Sync started" })}>Info</Button>
      <Button size="sm" variant="secondary" onClick={() => toast({ variant: "warning", title: "Rate limit near", description: "82% of quota used" })}>Warn</Button>
      <Button size="sm" variant="secondary" onClick={() => toast({ variant: "error", title: "Build failed", description: "See logs for details" })}>Error</Button>
    </div>
  );
}

function SliderDemo() {
  const [v, setV] = useState([42]);
  return (
    <div className="py-3">
      <Slider value={v} onValueChange={setV} max={100} step={1} />
      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>Threshold</span>
        <span className="font-mono tabular-nums text-foreground">{v[0]}%</span>
      </div>
    </div>
  );
}

function ProgressDemo() {
  const [v, setV] = useState(38);
  return (
    <div className="space-y-3 py-2">
      <Progress value={v} />
      <Progress indeterminate />
      <div className="flex gap-2">
        <Button size="sm" variant="ghost" onClick={() => setV((x) => Math.max(0, x - 10))}>−</Button>
        <Button size="sm" variant="ghost" onClick={() => setV((x) => Math.min(100, x + 10))}>+</Button>
        <span className="ml-auto self-center font-mono text-[11px] tabular-nums text-muted-foreground">{v}%</span>
      </div>
    </div>
  );
}

function StepsDemo() {
  const [i, setI] = useState(1);
  return (
    <div className="py-2">
      <Steps
        current={i}
        steps={[
          { id: "a", title: "Account" },
          { id: "b", title: "Workspace" },
          { id: "c", title: "Deploy" },
        ]}
      />
      <div className="mt-4 flex gap-2">
        <Button size="sm" variant="ghost" onClick={() => setI((x) => Math.max(0, x - 1))}>Back</Button>
        <Button size="sm" variant="primary" onClick={() => setI((x) => Math.min(2, x + 1))}>Next</Button>
      </div>
    </div>
  );
}

function AtelierPage() {
  return (
    <ToastProvider>
      <TooltipProvider delayDuration={100}>
        <DocsShell
          eyebrow="Atelier"
          title="Nova Atelier"
          description="Eight new primitives distilled from the best of UntitledUI, shadcn, Kibo, Mantine, HeroUI, and React Aria — rebuilt on Nova tokens with 3D-tilting showcases and reduced-motion safety."
          toc={[
            { id: "intro", label: "Intro" },
            { id: "showcase", label: "Showcase" },
          ]}
        >
          <DocSection id="intro" title="Curated from 14 libraries">
            <DocLead>
              Every card below is a real component. Hover to tilt — the surface responds with a cursor-tracked halo. Motion respects <code className="rounded bg-subtle px-1 py-0.5 font-mono text-[12px]">prefers-reduced-motion</code>.
            </DocLead>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Badge variant="accent"><Sparkles className="size-3" /> New in v0.3</Badge>
              <Badge variant="outline">8 primitives</Badge>
              <Badge variant="outline">Radix-powered · Nova-tokened</Badge>
            </div>
          </DocSection>

          <DocSection id="showcase" title="Showcase">
            <div className="mt-6 grid gap-5 sm:grid-cols-2 [perspective:1400px]">

              <TiltCard kicker="Switch" title="Springy toggle with glow">
                <div className="flex flex-col gap-4 py-2">
                  <label className="flex items-center justify-between gap-3">
                    <span className="text-sm text-foreground">Push notifications</span>
                    <Switch defaultChecked />
                  </label>
                  <label className="flex items-center justify-between gap-3">
                    <span className="text-sm text-foreground">Analytics</span>
                    <Switch size="sm" />
                  </label>
                  <label className="flex items-center justify-between gap-3">
                    <span className="text-sm text-foreground">Beta features</span>
                    <Switch size="lg" defaultChecked />
                  </label>
                </div>
              </TiltCard>

              <TiltCard kicker="Tabs" title="Animated segmented pill">
                <Tabs defaultValue="overview">
                  <TabsList>
                    <TabsTrigger value="overview" layoutGroup="atelier-tabs">Overview</TabsTrigger>
                    <TabsTrigger value="activity" layoutGroup="atelier-tabs">Activity</TabsTrigger>
                    <TabsTrigger value="settings" layoutGroup="atelier-tabs">Settings</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview" className="text-sm text-muted-foreground">Ship-ready summary of your workspace.</TabsContent>
                  <TabsContent value="activity" className="text-sm text-muted-foreground">Live feed of recent deploys and edits.</TabsContent>
                  <TabsContent value="settings" className="text-sm text-muted-foreground">Fine-tune preferences and access.</TabsContent>
                </Tabs>
              </TiltCard>

              <TiltCard kicker="Tooltip" title="Portal-anchored with arrow">
                <div className="flex flex-wrap items-center gap-2 py-4">
                  {[
                    { icon: Bell, label: "Notifications" },
                    { icon: Cpu, label: "Runtime metrics" },
                    { icon: Cloud, label: "Edge regions" },
                    { icon: Zap, label: "Boost priority" },
                  ].map(({ icon: I, label }) => (
                    <Tooltip key={label}>
                      <TooltipTrigger asChild>
                        <button className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-surface text-foreground transition hover:bg-subtle">
                          <I className="size-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>{label}</TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </TiltCard>

              <TiltCard kicker="Slider" title="Gradient range with spring thumb">
                <SliderDemo />
              </TiltCard>

              <TiltCard kicker="Progress" title="Shimmer + indeterminate">
                <ProgressDemo />
              </TiltCard>

              <TiltCard kicker="Toast" title="Stacked, spring-in notifications">
                <ToastDemo />
              </TiltCard>

              <TiltCard kicker="Timeline" title="Milestone rail with pulse">
                <Timeline
                  className="py-1"
                  items={[
                    { id: "1", title: "Repository created", time: "3d", status: "complete", icon: <CheckCircle2 className="size-3" /> },
                    { id: "2", title: "First deploy succeeded", time: "1d", status: "complete", icon: <CheckCircle2 className="size-3" /> },
                    { id: "3", title: "Reviewing pull request #42", time: "now", status: "current" },
                    { id: "4", title: "Ship to production", status: "upcoming", icon: <AlertTriangle className="size-3" /> },
                  ]}
                />
              </TiltCard>

              <TiltCard kicker="Steps" title="Multi-step onboarding">
                <StepsDemo />
              </TiltCard>

            </div>
          </DocSection>

          <DocSection id="install" title="Import anywhere">
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <a href="/docs/lab" className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-[13px] font-medium text-foreground transition-colors hover:bg-subtle">
                Visit the Lab <ArrowUpRight className="size-3.5" />
              </a>
              <a href="/docs/components" className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-[13px] font-medium text-foreground transition-colors hover:bg-subtle">
                Browse all components <ArrowUpRight className="size-3.5" />
              </a>
            </div>
          </DocSection>
        </DocsShell>
      </TooltipProvider>
    </ToastProvider>
  );
}
