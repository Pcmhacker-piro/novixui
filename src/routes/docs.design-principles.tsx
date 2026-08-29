import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Layers, Zap, Feather, ShieldCheck, Type } from "lucide-react";
import { DocsShell, DocSection, DocLead } from "@/components/docs/docs-shell";

export const Route = createFileRoute("/docs/design-principles")({
  component: DesignPrinciplesPage,
  head: () => ({
    meta: [
      { title: "Design principles · Novix UI" },
      { name: "description", content: "The six principles that shape every Nova component and decision." },
      { property: "og:title", content: "Design principles · Novix UI" },
      { property: "og:description", content: "The design tenets behind Novix UI." },
    ],
  }),
});

const PRINCIPLES = [
  { icon: Feather, title: "Beauty is a baseline", body: "Defaults must feel finished. If a component only looks right after five overrides, the component is wrong." },
  { icon: ShieldCheck, title: "Accessible by construction", body: "Semantics, focus order, and reduced-motion aren't polish — they're the shape. If it's not accessible, it's not shipped." },
  { icon: Layers, title: "Composition over configuration", body: "A dozen small primitives compose into a thousand shapes. Prop lists explode; composition scales." },
  { icon: Zap, title: "Motion earns its place", body: "Every animation communicates state. Decoration is fine — but never at the cost of perceived speed or clarity." },
  { icon: Type, title: "Typography is the interface", body: "Ninety percent of a UI is text. Line-height, tracking, and rhythm come before novelty." },
  { icon: Sparkles, title: "Craft is felt, not seen", body: "Optical alignment, sub-pixel shadows, sculpted edges — the details users can't name but always feel." },
];

function DesignPrinciplesPage() {
  return (
    <DocsShell
      eyebrow="Foundations"
      title="Design principles"
      description="The six tenets that shape every Nova component. When we disagree in review, we come back to this page."
      toc={PRINCIPLES.map((p, i) => ({ id: `p-${i}`, label: p.title }))}
    >
      <DocLead>
        Principles are not preferences. They're the arguments we've already had, so we don't have to have them again.
      </DocLead>

      {PRINCIPLES.map((p, i) => (
        <DocSection key={p.title} id={`p-${i}`} title={p.title}>
          <div className="mt-2 flex items-start gap-4">
            <span aria-hidden className="mt-0.5 inline-flex size-10 items-center justify-center rounded-xl border border-border/70 bg-subtle text-accent">
              <p.icon className="size-4" />
            </span>
            <p className="text-[15px] leading-relaxed text-muted-foreground">{p.body}</p>
          </div>
        </DocSection>
      ))}
    </DocsShell>
  );
}
