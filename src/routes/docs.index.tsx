import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Palette, Shield, Sparkles, Zap } from "lucide-react";
import { Badge, Button, Icon } from "@/nova";
import { DocsShell, DocLead, DocSection } from "@/components/docs/docs-shell";

export const Route = createFileRoute("/docs/")({
  component: IntroPage,
  head: () => ({
    meta: [
      { title: "Introduction · Novix UI" },
      {
        name: "description",
        content:
          "Novix UI is a premium, accessible React component ecosystem for SaaS, AI, and dashboards. Sculpted surfaces, spring motion, OKLCH theming, and a foundation that ships v0.1 today.",
      },
    ],
  }),
});

function IntroPage() {
  return (
    <DocsShell
      eyebrow="Getting started"
      title="Introduction"
      description="Novix UI is a premium, accessible, tree-shakable React component library for SaaS, AI, and dashboards. This is the foundation release — the ground the entire ecosystem stands on."
      toc={[
        { id: "philosophy", label: "Philosophy" },
        { id: "what-is-in-v01", label: "What ships in v0.1" },
        { id: "next", label: "Next steps" },
      ]}
    >
      <div className="mb-10 flex flex-wrap items-center gap-2">
        <Badge variant="accent" dot>
          v0.1 · Foundation
        </Badge>
        <Badge variant="outline">MIT licensed</Badge>
        <Badge variant="outline">Zero runtime CSS-in-JS</Badge>
      </div>

      <DocSection id="philosophy" title="Philosophy">
        <DocLead>
          Novix UI is built on the belief that developer tools deserve the same
          craftsmanship as the products they help build. Every surface is sculpted,
          every motion is intentional, and every API is designed to feel obvious in
          hindsight.
        </DocLead>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            { icon: Sparkles, title: "Beautiful defaults", body: "Copy-paste, ship. No config, no debate about spacing." },
            { icon: Shield, title: "Accessible first", body: "WCAG AA baseline. Radix primitives. Keyboard-tested." },
            { icon: Zap, title: "Motion with intent", body: "Spring physics from Apple, Linear, and Framer. Reduced-motion honored." },
            { icon: Palette, title: "OKLCH tokens", body: "Perceptual color. Themeable. Never a hardcoded hex in a component." },
          ].map((p) => (
            <div
              key={p.title}
              className="rounded-lg border border-border/70 bg-surface/40 p-4"
            >
              <div className="mb-2 grid size-8 place-items-center rounded-md bg-accent-muted text-accent">
                <Icon icon={p.icon} size="sm" />
              </div>
              <p className="text-sm font-semibold">{p.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection id="what-is-in-v01" title="What ships in v0.1">
        <p className="leading-relaxed text-muted-foreground">
          The foundation release stabilizes the base of the library before we
          expand. Every primitive is polymorphic, tokenized, and typed with strict
          TypeScript.
        </p>
        <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          {[
            "Design tokens · OKLCH",
            "Theme system · light/dark/system",
            "Motion primitives · springs, variants",
            "Icon system · lucide wrapper",
            "Button · IconButton · Label",
            "Badge · Kbd · Separator",
            "Card · Skeleton · Spinner",
            "Avatar · Input",
          ].map((t) => (
            <li key={t} className="flex items-center gap-2 text-muted-foreground">
              <span aria-hidden className="size-1.5 rounded-full bg-accent" /> {t}
            </li>
          ))}
        </ul>
      </DocSection>

      <DocSection id="next" title="Next steps">
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            to="/docs/installation"
            className="group nova-card-surface nova-card-moon-edge nova-card-halo nova-card-interactive block rounded-xl p-5"
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-semibold">
                <BookOpen size={14} className="text-accent" />
                Installation
              </span>
              <ArrowRight
                size={14}
                className="text-muted-foreground transition-transform group-hover:translate-x-0.5"
              />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Add Novix UI to a new or existing React project in under a minute.
            </p>
          </Link>
          <Link
            to="/docs/components/button"
            className="group nova-card-surface nova-card-moon-edge nova-card-halo nova-card-interactive block rounded-xl p-5"
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-semibold">
                <Sparkles size={14} className="text-accent" />
                Explore components
              </span>
              <ArrowRight
                size={14}
                className="text-muted-foreground transition-transform group-hover:translate-x-0.5"
              />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Preview every primitive with live examples, props, and accessibility notes.
            </p>
          </Link>
        </div>
        <div className="mt-6">
          <Button asChild trailingIcon={<ArrowRight />}>
            <Link to="/docs/installation">Get started</Link>
          </Button>
        </div>
      </DocSection>
    </DocsShell>
  );
}
