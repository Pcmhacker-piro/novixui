import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Rocket, ArrowUpRight, Zap, Cpu, Layers, Bot } from "lucide-react";
import { DocsShell, DocSection, DocLead } from "@/components/docs/docs-shell";
import { ComponentPreview } from "@/components/docs/preview";
import { CodeBlock } from "@/components/docs/code-block";
import { Badge, Button } from "@/nova";
import {
  Spotlight,
  Aurora,
  Meteors,
  BackgroundBeams,
  MovingBorder,
  CardTilt3D,
  TextGenerate,
  GlareCard,
  BentoGrid,
  BentoTile,
  WavyBackground,
} from "@/nova/ui/effects";

export const Route = createFileRoute("/docs/effects")({
  component: EffectsPage,
  head: () => ({
    meta: [
      { title: "Effects · Novix UI" },
      {
        name: "description",
        content:
          "Premium 3D-animated visual effects for Novix UI — Spotlight, Aurora, Meteors, Background Beams, Moving Border, 3D Tilt, Text Generate, Glare, Bento Grid, Wavy Background. Preview + copyable code.",
      },
      { property: "og:title", content: "Novix UI Effects — premium animated backgrounds" },
      {
        property: "og:description",
        content:
          "Ten reimagined premium effects rebuilt on Nova tokens, with reduced-motion safety and copy-paste code.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/docs/effects" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Novix UI Effects" },
      { name: "twitter:description", content: "Ten premium animated effects with preview + code." },
    ],
    links: [{ rel: "canonical", href: "/docs/effects" }],
  }),
});

/* -------- code strings (shown in Code tab) -------- */

const SPOTLIGHT_CODE = `import { Spotlight } from "@/nova/ui/effects";

<Spotlight className="h-64 border border-border/70 bg-subtle/40">
  <div className="grid h-64 place-items-center">
    <h3 className="text-2xl font-semibold tracking-tight">
      Move your cursor
    </h3>
  </div>
</Spotlight>`;

const AURORA_CODE = `import { Aurora } from "@/nova/ui/effects";

<Aurora className="h-72 border border-border/70 bg-background">
  <div className="grid h-72 place-items-center">
    <h3 className="text-3xl font-semibold tracking-tight">Aurora</h3>
  </div>
</Aurora>`;

const METEORS_CODE = `import { Meteors } from "@/nova/ui/effects";

<div className="relative h-64 overflow-hidden rounded-2xl border border-border/70 bg-background">
  <Meteors count={22} />
  <div className="relative grid h-64 place-items-center">
    <h3 className="text-2xl font-semibold">Meteor shower</h3>
  </div>
</div>`;

const BEAMS_CODE = `import { BackgroundBeams } from "@/nova/ui/effects";

<div className="relative h-72 overflow-hidden rounded-2xl border border-border/70 bg-background">
  <BackgroundBeams />
  <div className="relative grid h-72 place-items-center">
    <h3 className="text-3xl font-semibold tracking-tight">Grid + beams</h3>
  </div>
</div>`;

const MOVING_BORDER_CODE = `import { MovingBorder } from "@/nova/ui/effects";

<MovingBorder duration={3}>
  Launch console
</MovingBorder>`;

const TILT_CODE = `import { CardTilt3D } from "@/nova/ui/effects";

<CardTilt3D>
  <h3 className="text-lg font-semibold">Tilt me</h3>
  <p className="mt-2 text-sm text-muted-foreground">
    Pointer-tracked perspective card with spring physics.
  </p>
</CardTilt3D>`;

const TEXT_GEN_CODE = `import { TextGenerate } from "@/nova/ui/effects";

<TextGenerate
  className="text-2xl font-semibold tracking-tight"
  text="Ship premium interfaces with a motion system that feels alive."
/>`;

const GLARE_CODE = `import { GlareCard } from "@/nova/ui/effects";

<GlareCard>
  <h3 className="text-lg font-semibold">Glare card</h3>
  <p className="mt-2 text-sm text-muted-foreground">
    Hover me — a specular sheen tracks the pointer.
  </p>
</GlareCard>`;

const BENTO_CODE = `import { BentoGrid, BentoTile } from "@/nova/ui/effects";

<BentoGrid>
  <BentoTile span={2} tall>Featured</BentoTile>
  <BentoTile>Metric</BentoTile>
  <BentoTile>Activity</BentoTile>
  <BentoTile span={2}>Timeline</BentoTile>
</BentoGrid>`;

const WAVY_CODE = `import { WavyBackground } from "@/nova/ui/effects";

<div className="relative h-64 overflow-hidden rounded-2xl border border-border/70 bg-background">
  <WavyBackground />
  <div className="relative grid h-64 place-items-center">
    <h3 className="text-2xl font-semibold">Wavy</h3>
  </div>
</div>`;

function EffectsPage() {
  return (
    <DocsShell
      eyebrow="Effects"
      title="Premium visual effects"
      description="Ten reimagined animated effects — Spotlight, Aurora, Meteors, Background Beams, Moving Border, 3D Tilt, Text Generate, Glare, Bento Grid, and Wavy — rebuilt on Nova tokens with reduced-motion safety. Preview + copy-paste code."
      toc={[
        { id: "intro", label: "Intro" },
        { id: "spotlight", label: "Spotlight" },
        { id: "aurora", label: "Aurora" },
        { id: "meteors", label: "Meteors" },
        { id: "beams", label: "Background beams" },
        { id: "moving-border", label: "Moving border" },
        { id: "tilt-3d", label: "3D Tilt card" },
        { id: "text-generate", label: "Text generate" },
        { id: "glare", label: "Glare card" },
        { id: "bento", label: "Bento grid" },
        { id: "wavy", label: "Wavy background" },
        { id: "customize-3d", label: "Customizing 3D" },
        { id: "install", label: "Install" },
      ]}
    >
      <DocSection id="intro" title="Ten premium effects, one design language">
        <DocLead>
          Every effect here is Nova-native — token-driven color, spring-tuned physics, and
          <code className="mx-1 rounded bg-subtle px-1 py-0.5 font-mono text-[12px]">
            prefers-reduced-motion
          </code>
          safety baked in. Toggle to the Code tab to copy the source verbatim.
        </DocLead>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant="accent">
            <Sparkles className="size-3" /> New
          </Badge>
          <Badge variant="outline">10 effects</Badge>
          <Badge variant="outline">Motion + tokens only</Badge>
          <Badge variant="outline">Reduced-motion safe</Badge>
        </div>
      </DocSection>

      {/* Spotlight */}
      <DocSection id="spotlight" title="Spotlight">
        <p className="mb-4 text-sm text-muted-foreground">
          A radial highlight that tracks the pointer — great for hero sections and CTA cards.
        </p>
        <ComponentPreview code={SPOTLIGHT_CODE} filename="spotlight.tsx">
          <Spotlight className="h-64 w-full border border-border/70 bg-subtle/40">
            <div className="grid h-64 place-items-center px-6 text-center">
              <div>
                <h3 className="text-2xl font-semibold tracking-tight">Move your cursor</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  The highlight follows you around the surface.
                </p>
              </div>
            </div>
          </Spotlight>
        </ComponentPreview>
      </DocSection>

      {/* Aurora */}
      <DocSection id="aurora" title="Aurora">
        <p className="mb-4 text-sm text-muted-foreground">
          Slowly drifting gradient blobs. Screen-blended so it plays well over any surface.
        </p>
        <ComponentPreview code={AURORA_CODE} filename="aurora.tsx">
          <Aurora className="h-72 w-full border border-border/70 bg-background">
            <div className="grid h-72 place-items-center px-6 text-center">
              <div>
                <h3 className="text-3xl font-semibold tracking-tight">Aurora</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Ambient gradient motion at 12–20s cadence.
                </p>
              </div>
            </div>
          </Aurora>
        </ComponentPreview>
      </DocSection>

      {/* Meteors */}
      <DocSection id="meteors" title="Meteors">
        <p className="mb-4 text-sm text-muted-foreground">
          Diagonal streaks with randomized timing — subtle depth for dark surfaces.
        </p>
        <ComponentPreview code={METEORS_CODE} filename="meteors.tsx">
          <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-border/70 bg-background">
            <Meteors count={22} />
            <div className="relative grid h-64 place-items-center">
              <div className="text-center">
                <h3 className="text-2xl font-semibold tracking-tight">Meteor shower</h3>
                <p className="mt-1 text-sm text-muted-foreground">Randomized delays & angles.</p>
              </div>
            </div>
          </div>
        </ComponentPreview>
      </DocSection>

      {/* Background Beams */}
      <DocSection id="beams" title="Background beams">
        <p className="mb-4 text-sm text-muted-foreground">
          Masked grid with a rotating conic beam — a premium hero background.
        </p>
        <ComponentPreview code={BEAMS_CODE} filename="background-beams.tsx">
          <div className="relative h-72 w-full overflow-hidden rounded-2xl border border-border/70 bg-background">
            <BackgroundBeams />
            <div className="relative grid h-72 place-items-center">
              <div className="text-center">
                <h3 className="text-3xl font-semibold tracking-tight">Grid + beams</h3>
                <p className="mt-1 text-sm text-muted-foreground">A hero-ready backdrop.</p>
              </div>
            </div>
          </div>
        </ComponentPreview>
      </DocSection>

      {/* Moving Border */}
      <DocSection id="moving-border" title="Moving border">
        <p className="mb-4 text-sm text-muted-foreground">
          A CTA with a rotating conic-gradient border ring. Feels alive without stealing focus.
        </p>
        <ComponentPreview code={MOVING_BORDER_CODE} filename="moving-border.tsx" align="center">
          <div className="flex flex-wrap items-center justify-center gap-4 py-6">
            <MovingBorder duration={3}>
              <span className="inline-flex items-center gap-1.5">
                <Rocket className="size-3.5" /> Launch console
              </span>
            </MovingBorder>
            <MovingBorder duration={5}>
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="size-3.5" /> Try Nova AI
              </span>
            </MovingBorder>
          </div>
        </ComponentPreview>
      </DocSection>

      {/* 3D Tilt */}
      <DocSection id="tilt-3d" title="3D Tilt card">
        <p className="mb-4 text-sm text-muted-foreground">
          Pointer-tracked perspective with spring physics and translated inner layer for real depth.
        </p>
        <ComponentPreview code={TILT_CODE} filename="tilt-3d.tsx">
          <div className="grid w-full gap-5 p-4 sm:grid-cols-2">
            <CardTilt3D>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                <Cpu className="size-3.5" /> Compute
              </div>
              <h3 className="mt-3 text-lg font-semibold">Tilt me</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Pointer-tracked perspective with a translated inner layer.
              </p>
            </CardTilt3D>
            <CardTilt3D intensity={16}>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                <Layers className="size-3.5" /> Layers
              </div>
              <h3 className="mt-3 text-lg font-semibold">Higher intensity</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Increase <code className="font-mono">intensity</code> to lean into the tilt.
              </p>
            </CardTilt3D>
          </div>
        </ComponentPreview>
      </DocSection>

      {/* Text Generate */}
      <DocSection id="text-generate" title="Text generate">
        <p className="mb-4 text-sm text-muted-foreground">
          Staggered word fade-in with a subtle blur — a premium reveal for headlines.
        </p>
        <ComponentPreview code={TEXT_GEN_CODE} filename="text-generate.tsx" replayable>
          <div className="w-full px-6 py-10 text-center">
            <TextGenerate
              className="mx-auto max-w-xl text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
              text="Ship premium interfaces with a motion system that feels alive."
            />
          </div>
        </ComponentPreview>
      </DocSection>

      {/* Glare */}
      <DocSection id="glare" title="Glare card">
        <p className="mb-4 text-sm text-muted-foreground">
          A specular sheen that only reveals on hover. Overlay blend keeps it subtle.
        </p>
        <ComponentPreview code={GLARE_CODE} filename="glare-card.tsx">
          <div className="grid w-full gap-4 p-4 sm:grid-cols-3">
            {[
              { i: Zap, t: "Instant" },
              { i: Bot, t: "AI-native" },
              { i: Sparkles, t: "Premium" },
            ].map(({ i: I, t }, k) => (
              <GlareCard key={k}>
                <I className="size-5 text-primary" />
                <h4 className="mt-3 text-base font-semibold">{t}</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Hover to reveal the glare sweep.
                </p>
              </GlareCard>
            ))}
          </div>
        </ComponentPreview>
      </DocSection>

      {/* Bento */}
      <DocSection id="bento" title="Bento grid">
        <p className="mb-4 text-sm text-muted-foreground">
          A tiled feature grid with variable spans — pair with any effect above for depth.
        </p>
        <ComponentPreview code={BENTO_CODE} filename="bento-grid.tsx">
          <div className="w-full p-4 [perspective:1400px]">
            <div
              className="[transform-style:preserve-3d] [transform:rotateX(6deg)_rotateY(-8deg)] transition-transform duration-700 ease-out hover:[transform:rotateX(3deg)_rotateY(4deg)] motion-safe:animate-[bento3dFloat_8s_ease-in-out_infinite]"
              style={{ willChange: "transform" }}
            >
              <BentoGrid>
                <BentoTile span={2} tall className="min-h-[220px] [transform:translateZ(40px)] shadow-[0_30px_60px_-30px_rgba(124,58,237,0.45)]">
                  <Aurora className="absolute inset-0 h-full w-full opacity-70" />
                  <div className="relative [transform-style:preserve-3d]">
                    <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground [transform:translateZ(20px)]">
                      Featured
                    </div>
                    <h3 className="mt-2 text-xl font-semibold [transform:translateZ(50px)]">Nova AI streaming</h3>
                    <p className="mt-1 max-w-sm text-sm text-muted-foreground [transform:translateZ(30px)]">
                      Structured stream primitives with token-halo reveal.
                    </p>
                  </div>
                </BentoTile>
                <BentoTile className="[transform:translateZ(24px)] shadow-[0_20px_40px_-24px_rgba(0,0,0,0.5)]">
                  <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    Deploys
                  </div>
                  <div className="mt-2 text-3xl font-semibold [transform:translateZ(20px)]">1,204</div>
                  <div className="text-xs text-emerald-500">+18% this week</div>
                </BentoTile>
                <BentoTile className="[transform:translateZ(32px)] shadow-[0_20px_40px_-24px_rgba(0,0,0,0.5)]">
                  <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    Latency
                  </div>
                  <div className="mt-2 text-3xl font-semibold [transform:translateZ(20px)]">
                    42<span className="text-base text-muted-foreground">ms</span>
                  </div>
                  <div className="text-xs text-muted-foreground">p95 edge</div>
                </BentoTile>
                <BentoTile span={2} className="[transform:translateZ(16px)] shadow-[0_20px_40px_-24px_rgba(0,0,0,0.5)]">
                  <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    Timeline
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <span
                        key={i}
                        className="h-8 w-1.5 rounded-full bg-primary/40"
                        style={{ opacity: 0.25 + (i % 6) / 8 }}
                      />
                    ))}
                  </div>
                </BentoTile>
              </BentoGrid>
            </div>
            <style>{`
              @keyframes bento3dFloat {
                0%, 100% { transform: rotateX(6deg) rotateY(-8deg) translateY(0); }
                50%      { transform: rotateX(5deg) rotateY(-5deg) translateY(-6px); }
              }
            `}</style>
          </div>
        </ComponentPreview>
      </DocSection>

      {/* Wavy */}
      <DocSection id="wavy" title="Wavy background">
        <p className="mb-4 text-sm text-muted-foreground">
          Layered SVG waves that gently pan — ideal for footers and marketing sections.
        </p>
        <ComponentPreview code={WAVY_CODE} filename="wavy-background.tsx">
          <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-border/70 bg-background [perspective:1200px]">
            <WavyBackground />
            <div className="relative grid h-64 place-items-center">
              <div
                className="group/wavy3d text-center [transform-style:preserve-3d] [transform:rotateX(8deg)_rotateY(-10deg)] transition-transform duration-700 ease-out hover:[transform:rotateX(4deg)_rotateY(6deg)_translateZ(20px)] motion-safe:animate-[wavy3dFloat_6s_ease-in-out_infinite]"
                style={{ willChange: "transform" }}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-accent/20 via-primary/10 to-transparent opacity-70 blur-2xl [transform:translateZ(-40px)]"
                />
                <h3
                  className="bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-3xl font-semibold tracking-tight text-transparent drop-shadow-[0_6px_20px_rgba(124,58,237,0.35)] [transform:translateZ(40px)]"
                >
                  Wavy
                </h3>
                <p className="mt-1 text-sm text-muted-foreground [transform:translateZ(24px)]">
                  Three layered wave paths.
                </p>
              </div>
            </div>
            <style>{`
              @keyframes wavy3dFloat {
                0%, 100% { transform: rotateX(8deg) rotateY(-10deg) translateY(0px); }
                50%      { transform: rotateX(6deg) rotateY(-6deg)  translateY(-6px); }
              }
            `}</style>
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection id="customize-3d" title="Customizing the 3D effects">
        <DocLead>
          Every 3D surface — the preview stage, <code className="font-mono">BentoTile</code>,{" "}
          <code className="font-mono">CardTilt3D</code>, and the Wavy / Bento hero previews —
          shares one recipe: a <code className="font-mono">perspective</code> ancestor, a{" "}
          <code className="font-mono">preserve-3d</code> stage, and per-layer{" "}
          <code className="font-mono">translateZ</code>. Adjust three knobs and the whole system
          re-tunes together.
        </DocLead>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="nova-card-surface nova-card-moon-edge rounded-xl p-4">
            <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              Perspective
            </div>
            <div className="mt-1 font-mono text-sm">1200–1600px</div>
            <p className="mt-2 text-xs text-muted-foreground">
              Lower = more dramatic dolly. Set on the outer wrapper via{" "}
              <code className="font-mono">[perspective:1400px]</code>.
            </p>
          </div>
          <div className="nova-card-surface nova-card-moon-edge rounded-xl p-4">
            <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              Tilt range
            </div>
            <div className="mt-1 font-mono text-sm">±8–14°</div>
            <p className="mt-2 text-xs text-muted-foreground">
              Rest at <code className="font-mono">rotateX(6deg) rotateY(-8deg)</code>. Stay under
              15° so text stays legible.
            </p>
          </div>
          <div className="nova-card-surface nova-card-moon-edge rounded-xl p-4">
            <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              Depth steps
            </div>
            <div className="mt-1 font-mono text-sm">16 / 24 / 40 px</div>
            <p className="mt-2 text-xs text-muted-foreground">
              Ambient → primary → hero. Use three tiers per surface — more looks busy.
            </p>
          </div>
        </div>

        <h3 className="mt-8 text-base font-semibold">Theme variables</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Depth and glow use existing Nova tokens — override in{" "}
          <code className="font-mono">src/styles.css</code> under{" "}
          <code className="font-mono">@theme</code> to re-skin every effect at once.
        </p>
        <div className="mt-3 overflow-hidden rounded-xl border border-border/60">
          <table className="w-full text-sm">
            <thead className="bg-subtle/50 text-left text-xs uppercase tracking-[0.14em] text-muted-foreground">
              <tr>
                <th className="px-4 py-2 font-medium">Token</th>
                <th className="px-4 py-2 font-medium">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 font-mono text-[12.5px]">
              <tr>
                <td className="px-4 py-2">--color-accent</td>
                <td className="px-4 py-2 font-sans text-muted-foreground">
                  Glow, halo, active edge on tilted layers
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2">--color-primary</td>
                <td className="px-4 py-2 font-sans text-muted-foreground">
                  Aurora sweep, moving border, background beams
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2">--color-border</td>
                <td className="px-4 py-2 font-sans text-muted-foreground">
                  Moon-edge highlight along tile rims
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2">--color-subtle</td>
                <td className="px-4 py-2 font-sans text-muted-foreground">
                  Backing plane behind translated-Z content
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-8 text-base font-semibold">Motion settings</h3>
        <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
          <li>
            <strong className="text-foreground">Idle float:</strong> 6–9s ease-in-out, ±4–6px
            translate. Long duration keeps the surface calm.
          </li>
          <li>
            <strong className="text-foreground">Pointer tilt:</strong> lerp toward target at{" "}
            <code className="font-mono">0.10–0.14</code> per frame — snappy but not jittery.
          </li>
          <li>
            <strong className="text-foreground">Hover lift:</strong> 400–500ms{" "}
            <code className="font-mono">ease-out</code> on{" "}
            <code className="font-mono">translateZ</code> only; never animate layout.
          </li>
          <li>
            <strong className="text-foreground">Reduced motion:</strong> gate every keyframe
            behind <code className="font-mono">motion-safe:</code> and skip the pointer RAF loop
            when <code className="font-mono">prefers-reduced-motion: reduce</code> matches. The
            static rest transform stays so depth reads without movement.
          </li>
        </ul>

        <h3 className="mt-8 text-base font-semibold">Minimal recipe</h3>
        <CodeBlock
          className="mt-2"
          language="tsx"
          code={`<div className="[perspective:1400px]">
  <div
    className="[transform-style:preserve-3d] transition-transform duration-500 ease-out
               motion-safe:animate-[floaty_8s_ease-in-out_infinite]"
    style={{ transform: "rotateX(6deg) rotateY(-8deg)" }}
  >
    <div className="[transform:translateZ(40px)]">Hero layer</div>
    <div className="[transform:translateZ(20px)]">Support layer</div>
    <div className="[transform:translateZ(0)]">Base plane</div>
  </div>
</div>`}
        />
      </DocSection>

      <DocSection id="install" title="Use them today">
        <p className="text-sm text-muted-foreground">
          All ten effects live in <code className="font-mono">@/nova/ui/effects</code>. Import
          what you need — tree-shaking keeps bundles lean.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button asChild>
            <a href="/docs/components">
              Browse components <ArrowUpRight className="size-4" />
            </a>
          </Button>
          <Button variant="ghost" asChild>
            <a href="/docs/lab">Visit the Lab</a>
          </Button>
        </div>
      </DocSection>
    </DocsShell>
  );
}
