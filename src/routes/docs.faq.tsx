import { createFileRoute } from "@tanstack/react-router";
import { DocsShell, DocLead } from "@/components/docs/docs-shell";

export const Route = createFileRoute("/docs/faq")({
  component: FaqPage,
  head: () => ({
    meta: [
      { title: "FAQ · Novix UI" },
      { name: "description", content: "Answers to the questions developers ask in their first ten minutes with Novix UI." },
      { property: "og:title", content: "FAQ · Novix UI" },
      { property: "og:description", content: "Common questions about Novix UI." },
    ],
  }),
});

const GROUPS: { label: string; qas: { q: string; a: string }[] }[] = [
  {
    label: "Getting started",
    qas: [
      { q: "Is Nova a package or a source library?", a: "Both. Install the primitives from npm for stability, or copy the source into your app via the CLI when you want full ownership." },
      { q: "Which frameworks are supported?", a: "React 19 with Tailwind v4 is the primary target. Works with Next.js, TanStack Start, Remix, Vite, and Astro islands. RSC is supported for stateless primitives." },
      { q: "Do I have to use Tailwind?", a: "For v0.1, yes — styling is Tailwind v4 utility classes with CSS-first tokens. Framework-agnostic CSS packages are on the roadmap for v0.4." },
      { q: "Can I use Nova with an existing UI library?", a: "Yes. Nova composes cleanly alongside shadcn/ui, Chakra, MUI, or Radix primitives — migrate route-by-route rather than in one big rewrite." },
    ],
  },
  {
    label: "Comparisons",
    qas: [
      { q: "How is Nova different from shadcn/ui?", a: "Nova is opinionated about material and motion. Sculpted depth, spring physics, and AI-native primitives are first-class — not a theming exercise on top of neutral primitives." },
      { q: "Is Nova heavier than Radix?", a: "No. Nova wraps Radix primitives where semantics matter; the styling layer is compiled Tailwind. There's no runtime CSS-in-JS." },
      { q: "Why not just use Tailwind UI?", a: "Tailwind UI is HTML snippets. Nova is composable React with types, keyboard flows, and accessibility contracts you can trust." },
    ],
  },
  {
    label: "Theming & tokens",
    qas: [
      { q: "How does theming work?", a: "Every color is an OKLCH semantic token defined in CSS. The ThemeProvider swaps a data attribute; the cascade handles the rest. Generate custom palettes via the CLI's `theme` command." },
      { q: "Can I bring my own palette?", a: "Yes. Override the tokens in your own CSS file — Nova components read from CSS variables, so you never fork a component to rebrand." },
      { q: "How do I add a new theme?", a: "Add a `[data-theme='name']` block in your CSS overriding the token variables. ThemeProvider will honor any theme name you pass." },
    ],
  },
  {
    label: "Accessibility",
    qas: [
      { q: "Is Nova accessible?", a: "WCAG 2.2 AA is the baseline, not the ceiling. Every primitive uses Radix under the hood; focus rings, keyboard flows, and ARIA attributes are audited in CI with axe-core." },
      { q: "Does Nova respect prefers-reduced-motion?", a: "Yes. Decorative animations are held; meaningful motion (spinners, progress) is preserved but slowed." },
      { q: "How do you handle focus on modals?", a: "Focus is trapped inside the overlay and restored to the trigger on close — Radix handles the choreography, Nova styles the ring." },
    ],
  },
  {
    label: "Performance & bundle",
    qas: [
      { q: "What's the bundle size cost?", a: "Median gzipped size is under 4KB per primitive, treeshaken. The full v0.1 foundation ships under 22KB gzipped when every component is used." },
      { q: "Does Nova ship a runtime CSS engine?", a: "No. All styling is compiled Tailwind. There's no emotion, no styled-components, no runtime theme walk." },
      { q: "Is SSR supported?", a: "Yes. Every stable primitive is SSR-safe. Client-only widgets are wrapped in <ClientOnly> or dynamically imported." },
    ],
  },
  {
    label: "Roadmap & licensing",
    qas: [
      { q: "What's the license?", a: "MIT. Use it for anything, forever. Contribute back if you extend it — but you don't have to." },
      { q: "Will you charge for Nova?", a: "The library stays MIT. Paid extras (Pro templates, a hosted theme studio) may exist later, but the core is free forever." },
      { q: "How can I contribute?", a: "Open a discussion on GitHub before a large PR. For docs typos, small tweaks, and new recipes — just open a PR." },
    ],
  },
];

function FaqPage() {
  return (
    <DocsShell
      eyebrow="Explore"
      title="FAQ"
      description="Answers to the questions developers ask in their first ten minutes with Nova."
    >
      <DocLead>
        If your question isn't here, open a discussion on GitHub. Every question that shows up twice ends up in this file.
      </DocLead>

      <div className="mt-10 space-y-10">
        {GROUPS.map((g) => (
          <section key={g.label}>
            <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{g.label}</h2>
            <div className="space-y-3">
              {g.qas.map((item) => (
                <details key={item.q} className="nova-card-surface group rounded-xl px-5 py-4 open:pb-5 transition">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium">
                    {item.q}
                    <span aria-hidden className="inline-flex size-6 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </DocsShell>
  );
}
