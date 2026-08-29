import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Badge } from "@/nova";
import { DocsShell, DocSection, DocLead, DocParagraph } from "@/components/docs/docs-shell";
import { ComponentPreview } from "@/components/docs/preview";
import { CodeBlock } from "@/components/docs/code-block";
import { PropsTable, type PropRow } from "@/components/docs/props-table";
import { Callout } from "@/components/docs/callout";
import { BUTTONS } from "@/data/buttons";
import { MECHANICS, type Mechanic } from "@/data/button-mechanics";
import { getVariant, variantToCssVars } from "@/data/button-variants";

export const Route = createFileRoute("/docs/components/button-mechanics")({
  component: ButtonMechanicsDoc,
  head: () => ({
    meta: [
      { title: "3D Button mechanics · Novix UI" },
      {
        name: "description",
        content:
          "Reference for the 25 base 3D button mechanics in the Nova gallery — visual verb, triggers, GPU cost, when to use, when to avoid, and how the per-button variation engine keeps every instance unique.",
      },
      { property: "og:title", content: "3D Button mechanics · Novix UI" },
      {
        property: "og:description",
        content:
          "Contributor reference for every 3D button mechanic and the variation engine that guarantees uniqueness across all 100 buttons.",
      },
    ],
  }),
});

/* ────────────────────────────── Variation engine props ────────────────── */

const VARIANT_PROPS: PropRow[] = [
  { name: "perspective",  type: "number", default: "720–1640 px", description: "Depth of the 3D scene wrapping the button." },
  { name: "rotX",         type: "number", default: "4°–18°",     description: "Hover X-axis rotation." },
  { name: "rotY",         type: "number", default: "-4°–-18°",   description: "Hover Y-axis rotation." },
  { name: "z",            type: "number", default: "10–40 px",   description: "Hover translateZ (comes toward viewer)." },
  { name: "scale",        type: "number", default: "1.02–1.12",  description: "Hover uniform scale." },
  { name: "pressZ",       type: "number", default: "-2 to -8 px", description: "Active-state Z push (sink)." },
  { name: "duration",     type: "number", default: "320–800 ms", description: "Transition duration for tilt, lift, and shadow." },
  { name: "ease",         type: "string", default: "6 curves",   description: "Cubic-bezier easing chosen per button." },
  { name: "originX / originY", type: "number", default: "% of tile", description: "transform-origin for the tilt pivot." },
  { name: "haloMix",      type: "number", default: "18–56 %",    description: "Accent-color tint applied to the hover halo." },
  { name: "haloBlur",     type: "number", default: "40–100 px",  description: "Halo bloom radius." },
  { name: "shadowSpread", type: "number", default: "40–88 px",   description: "Drop-shadow blur radius under the tile." },
  { name: "shadowY",      type: "number", default: "18–34 px",   description: "Drop-shadow vertical offset." },
  { name: "liftY",        type: "number", default: "2–10 px",    description: "Idle → hover translateY." },
];

const CATEGORY_ORDER: Mechanic["category"][] = [
  "Lift & Press",
  "Glow & Halo",
  "Sweep & Reveal",
  "Structural",
  "True 3D",
  "Loop",
  "Content Swap",
  "Metal",
];

const GPU_TONE: Record<Mechanic["gpu"], string> = {
  cheap:    "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
  moderate: "text-amber-400 border-amber-400/30 bg-amber-400/10",
  heavy:    "text-rose-400 border-rose-400/30 bg-rose-400/10",
};

/* ────────────────────────────── Page ─────────────────────────────────── */

function ButtonMechanicsDoc() {
  return (
    <DocsShell
      eyebrow="Components · v0.1 · Contributor reference"
      title="3D Button mechanics"
      description="The 100-button gallery is built from 25 base mechanics × 4 hues. Each mechanic owns a distinct 3D verb — this page documents every one, the variation engine that keeps duplicates out, and the guidelines contributors follow when adding a new style."
      toc={[
        { id: "overview", label: "Overview" },
        { id: "engine", label: "Variation engine" },
        { id: "engine-api", label: "Engine API" },
        { id: "catalog", label: "Mechanic catalog" },
        ...CATEGORY_ORDER.map((c) => ({ id: `cat-${slug(c)}`, label: c })),
        { id: "adding", label: "Adding a mechanic" },
        { id: "a11y", label: "Accessibility" },
        { id: "checklist", label: "Contributor checklist" },
      ]}
    >
      <DocSection id="overview" title="Overview">
        <DocLead>
          Every button in <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[12px]">/elements?category=Buttons</code>{" "}
          composes two independent layers: a <strong>base mechanic</strong> (the visual verb — cube, aurora, ripple…) and a{" "}
          <strong>variation signature</strong> (perspective, timing, lighting, press feel). The mechanic gives the button its
          identity; the signature guarantees no two tiles animate identically.
        </DocLead>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Stat label="Base mechanics" value="25" />
          <Stat label="Hues per mechanic" value="4" />
          <Stat label="Total buttons" value={String(BUTTONS.length)} />
        </div>
      </DocSection>

      <DocSection id="engine" title="Variation engine">
        <DocParagraph>
          The variation engine is a deterministic function of{" "}
          <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[12px]">(styleKey, hueKey)</code>. It seeds an xmur3 hash
          and picks a discrete step across 15 axes. Combined space is on the order of 10¹² signatures — collisions are
          astronomically unlikely, and the runtime registry salts the input until unique if one ever occurs. That is the guarantee:
          <strong> duplicate button behavior is structurally impossible</strong>.
        </DocParagraph>
        <ComponentPreview
          className="mt-6"
          code={`import { getVariant, variantToCssVars } from "@/data/button-variants";

const v = getVariant(item.id, item.styleKey, item.hue);
<div style={{ perspective: "var(--nova-perspective)", ...variantToCssVars(v) }}>
  {/* ...tile that reads var(--nova-rotx), var(--nova-ease), etc. */}
</div>`}
        >
          <VariantDemo />
        </ComponentPreview>
      </DocSection>

      <DocSection id="engine-api" title="Engine API">
        <DocParagraph>
          Every axis emitted as a CSS custom property. Consumers read them via arbitrary Tailwind values or plain{" "}
          <code>var()</code> — no JS on the hot path.
        </DocParagraph>
        <div className="mt-6">
          <PropsTable rows={VARIANT_PROPS} />
        </div>
        <div className="mt-6">
          <CodeBlock
            code={`// src/data/button-variants.ts
export function getVariant(id: string, styleKey: string, hueKey: string): Variant;
export function variantToCssVars(v: Variant): React.CSSProperties;

// Emits: --nova-perspective, --nova-rotx, --nova-roty, --nova-z,
//        --nova-scale, --nova-press-z, --nova-duration, --nova-ease,
//        --nova-origin, --nova-halo-mix, --nova-halo-blur,
//        --nova-shadow-spread, --nova-shadow-y, --nova-lift-y`}
          />
        </div>
      </DocSection>

      <DocSection id="catalog" title="Mechanic catalog">
        <DocParagraph>
          Each mechanic below lists its distinct 3D verb, the triggers that drive it, GPU cost, and when to use / avoid it.
          Contributors adding a new mechanic must own a verb that no listed mechanic already owns.
        </DocParagraph>
      </DocSection>

      {CATEGORY_ORDER.map((cat) => (
        <DocSection key={cat} id={`cat-${slug(cat)}`} title={cat}>
          <div className="grid gap-4 md:grid-cols-2">
            {MECHANICS.filter((m) => m.category === cat).map((m) => (
              <MechanicCard key={m.key} m={m} />
            ))}
          </div>
        </DocSection>
      ))}

      <DocSection id="adding" title="Adding a mechanic">
        <DocParagraph>Follow this recipe to contribute a 26th base style.</DocParagraph>
        <ol className="mt-4 space-y-3 text-[13.5px] leading-relaxed text-muted-foreground [counter-reset:step]">
          <Step n={1} title="Name the verb">
            The verb must not overlap with an existing mechanic — audit the catalog above. If your idea is "another gradient
            button", it will not ship. Distinct motion verbs only.
          </Step>
          <Step n={2} title="Add the style">
            Append a <code>StyleDef</code> to <code>src/data/buttons.tsx</code>. Populate <code>render(h)</code> using the hue,
            and provide the paste-ready <code>code(h)</code> string.
          </Step>
          <Step n={3} title="Register the mechanic">
            Add an entry to <code>src/data/button-mechanics.ts</code> with a matching <code>key</code>, category, mechanic verb,
            triggers, GPU cost, usage, and avoid guidance. This page renders from that file — omit it and your button ships
            undocumented.
          </Step>
          <Step n={4} title="Respect reduced motion">
            All hover transforms and loop animations must live inside <code>.nova-btn-tile-stage</code> so the global reduced-motion
            rules in <code>src/styles.css</code> can freeze them. Loops must use a <code>nova-btn-*</code> keyframe name to be
            auto-paused.
          </Step>
          <Step n={5} title="Verify uniqueness">
            Load <code>/elements?category=Buttons</code>. The variation engine will assign a fresh 15-axis signature; the
            registry will assert it does not collide with the other 100 tiles.
          </Step>
        </ol>
      </DocSection>

      <DocSection id="a11y" title="Accessibility">
        <Callout variant="accessibility" title="Non-negotiable">
          Every mechanic must degrade cleanly under <code>prefers-reduced-motion: reduce</code>. The tile container already
          freezes transforms and pauses loops; do not add hover transforms outside the stage layer, and never rely on motion
          alone to communicate state.
        </Callout>
        <ul className="mt-4 space-y-2 text-[13.5px] leading-relaxed text-muted-foreground">
          <li>• Tiles expose <code>aria-label="Name — view code"</code> and a visible focus-visible ring.</li>
          <li>• Keyboard activation via <kbd>Enter</kbd> / <kbd>Space</kbd> mirrors click behavior.</li>
          <li>• Color is never the sole differentiator — every mechanic has a shape / motion signature independent of hue.</li>
          <li>• Loops respect reduced motion — <code>nova-btn-holo</code>, <code>nova-btn-spin</code>, <code>nova-btn-ping</code>, and <code>nova-btn-bounce</code> are auto-paused.</li>
        </ul>
      </DocSection>

      <DocSection id="checklist" title="Contributor checklist">
        <div className="mt-2 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border/70 p-4">
            <p className="text-sm font-semibold">Before opening a PR</p>
            <ul className="mt-2 space-y-1.5 text-[13px] text-muted-foreground">
              <li>✓ Verb is not already in the catalog</li>
              <li>✓ Entry added to <code>button-mechanics.ts</code></li>
              <li>✓ Tile renders under all 4 hues</li>
              <li>✓ Reduced-motion path verified</li>
              <li>✓ Focus-visible ring intact</li>
              <li>✓ No new keyframes outside the <code>nova-btn-*</code> namespace</li>
            </ul>
          </div>
          <div className="rounded-xl border border-border/70 p-4">
            <p className="text-sm font-semibold">Automatic rejections</p>
            <ul className="mt-2 space-y-1.5 text-[13px] text-muted-foreground">
              <li>✗ Recolored duplicate of an existing style</li>
              <li>✗ Hover transform outside <code>.nova-btn-tile-stage</code></li>
              <li>✗ Motion-only state (color / shape must also change)</li>
              <li>✗ Uses inline <code>animation</code> without a namespaced keyframe</li>
              <li>✗ Contrast under WCAG AA on any of the 4 hues</li>
            </ul>
          </div>
        </div>
        <div className="mt-6">
          <Link
            to="/elements"
            search={{ category: "Buttons", tag: "All", q: "" }}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/85 transition-colors hover:border-white/25 hover:bg-white/[0.07]"
          >
            Browse the gallery →
          </Link>
        </div>
      </DocSection>
    </DocsShell>
  );
}

/* ────────────────────────────── Sub-components ─────────────────────────── */

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/70 bg-white/[0.02] p-4">
      <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-3xl font-semibold tracking-[-0.02em]">{value}</div>
    </div>
  );
}

function MechanicCard({ m }: { m: Mechanic }) {
  const count = BUTTONS.filter((b) => b.styleKey === m.key).length;
  return (
    <div
      id={`m-${m.key}`}
      className="scroll-mt-24 rounded-xl border border-border/70 bg-white/[0.02] p-5 transition-colors hover:border-border"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold tracking-[-0.01em]">{m.name}</h3>
          <p className="mt-0.5 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">{m.key}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${GPU_TONE[m.gpu]}`}>
            {m.gpu} GPU
          </span>
          <Badge variant="outline">{count} tiles</Badge>
        </div>
      </div>
      <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">{m.summary}</p>
      <dl className="mt-4 space-y-2 text-[12.5px]">
        <Row k="Mechanic">{m.mechanic}</Row>
        <Row k="Triggers">
          <span className="flex flex-wrap gap-1">
            {m.triggers.map((t) => (
              <span key={t} className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[11px] text-white/70">{t}</span>
            ))}
          </span>
        </Row>
        <Row k="Use for">{m.usage}</Row>
        <Row k="Avoid">{m.avoid}</Row>
      </dl>
    </div>
  );
}

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[80px_1fr] gap-3">
      <dt className="text-[11px] uppercase tracking-widest text-muted-foreground/80">{k}</dt>
      <dd className="text-muted-foreground">{children}</dd>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="rounded-lg border border-border/60 bg-white/[0.02] p-4">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-[11px] font-semibold text-white/80">
          {n}
        </span>
        <span className="font-semibold text-foreground">{title}</span>
      </div>
      <div className="mt-2 pl-8">{children}</div>
    </li>
  );
}

function VariantDemo() {
  const [seed, setSeed] = useState("cube::Violet");
  const [styleKey, hueKey] = seed.split("::");
  const variant = useMemo(() => getVariant(seed, styleKey, hueKey), [seed, styleKey, hueKey]);
  const vars = useMemo(() => variantToCssVars(variant), [variant]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        style={{ perspective: "var(--nova-perspective)", ...vars }}
        className="grid h-40 w-full max-w-md place-items-center rounded-xl border border-white/10 bg-gradient-to-b from-[#0f0f10] to-[#050505]"
      >
        <div
          className="transition-transform duration-[var(--nova-duration)] [transition-timing-function:var(--nova-ease)] hover:[transform:rotateX(var(--nova-rotx))_rotateY(var(--nova-roty))_translateZ(var(--nova-z))_scale(var(--nova-scale))]"
          style={{ transformStyle: "preserve-3d", transformOrigin: "var(--nova-origin)" }}
        >
          <button
            className="rounded-xl px-6 py-3 text-sm font-semibold text-white"
            style={{
              background: "linear-gradient(180deg,#7c3aed,#a855f7)",
              boxShadow: "0 var(--nova-shadow-y) var(--nova-shadow-spread) -24px #7c3aed",
            }}
          >
            Hover me
          </button>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {["cube::Violet", "aurora::Cyan", "ripple::Emerald", "flipcard::Rose"].map((k) => (
          <button
            key={k}
            onClick={() => setSeed(k)}
            className={`rounded-md border px-2.5 py-1 font-mono text-[11px] transition-colors ${
              seed === k
                ? "border-white/30 bg-white/[0.08] text-white"
                : "border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20"
            }`}
          >
            {k}
          </button>
        ))}
      </div>
      <div className="w-full rounded-lg border border-white/10 bg-black/40 p-3 font-mono text-[11.5px] text-white/70">
        <div>duration: {variant.duration}ms · ease: {variant.ease}</div>
        <div>rotX/Y: {variant.rotX}° / {variant.rotY}° · Z: {variant.z}px · scale: {variant.scale}</div>
        <div>halo: mix {variant.haloMix}% · blur {variant.haloBlur}px · shadow {variant.shadowSpread}/{variant.shadowY}px</div>
      </div>
    </div>
  );
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
