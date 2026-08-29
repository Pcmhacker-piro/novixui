import { createFileRoute } from "@tanstack/react-router";
import { DocsShell, DocSection, DocLead } from "@/components/docs/docs-shell";
import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";

export const Route = createFileRoute("/docs/troubleshooting")({
  component: TroubleshootingPage,
  head: () => ({
    meta: [
      { title: "Troubleshooting · Novix UI" },
      { name: "description", content: "Fix common Novix UI setup and runtime issues." },
      { property: "og:title", content: "Troubleshooting · Novix UI" },
      { property: "og:description", content: "Common Novix UI issues and their fixes." },
    ],
  }),
});

const ISSUES = [
  {
    id: "styles-missing",
    title: "Styles look unstyled or off-brand",
    diagnose: "Tailwind isn't seeing Nova's source files, or the token layer isn't imported.",
    fix: `/* app/styles.css */\n@import "tailwindcss";\n@import "@novix-ui/react/tokens.css";`,
    tip: "Restart the dev server after editing your Tailwind config or CSS entry.",
  },
  {
    id: "theme-flash",
    title: "Flash of wrong theme on load (FOUT/FOUC)",
    diagnose: "The theme class is applied in a React effect, so the first paint uses the default.",
    fix: `// Inject before hydration (root layout head)\n<script dangerouslySetInnerHTML={{ __html:\n  \`(() => { const t = localStorage.getItem('nova-theme') || 'system';\n     const d = t === 'system' ? matchMedia('(prefers-color-scheme: dark)').matches : t === 'dark';\n     document.documentElement.dataset.theme = d ? 'dark' : 'light'; })();\` }} />`,
    tip: "Nova's ThemeProvider ships this snippet as a helper — use it in your root document.",
  },
  {
    id: "hydration-mismatch",
    title: "Hydration mismatch warnings",
    diagnose: "A component reads window/localStorage during SSR and renders different HTML on the client.",
    fix: `import { useEffect, useState } from "react";\n\nfunction useHydrated() {\n  const [h, setH] = useState(false);\n  useEffect(() => setH(true), []);\n  return h;\n}`,
    tip: "Gate any browser-only render behind useHydrated(). Never read localStorage in a useState initializer.",
  },
  {
    id: "focus-ring",
    title: "Focus ring is missing or invisible",
    diagnose: "Global CSS is suppressing :focus-visible, or a wrapper element captures focus.",
    fix: `/* Remove any global reset like: */\nbutton:focus { outline: none; }\n\n/* Nova relies on :focus-visible for two-layer rings. */`,
    tip: "Never suppress :focus-visible in an app that uses Nova.",
  },
  {
    id: "icon-size",
    title: "Icons render at the wrong size",
    diagnose: "Passing width/height directly instead of using Nova's <Icon size='…' /> wrapper.",
    fix: `import { Icon } from "@novix-ui/react";\nimport { Search } from "lucide-react";\n\n<Icon size="sm" as={Search} label="Search" />`,
    tip: "Nova's Icon wrapper enforces aria-label OR aria-hidden — you can't ship an ambiguous icon.",
  },
  {
    id: "asChild",
    title: "asChild throws 'React.Children.only expected'",
    diagnose: "asChild renders onto a child but expects exactly one child element.",
    fix: `// Wrong — two children\n<Button asChild><Link to="/x">Go</Link><span>!</span></Button>\n\n// Right — single child\n<Button asChild><Link to="/x">Go!</Link></Button>`,
    tip: "asChild is a Radix pattern. Always pass exactly one JSX child.",
  },
  {
    id: "bundle-size",
    title: "Bundle size is larger than expected",
    diagnose: "Barrel imports pull in every component, defeating tree-shaking.",
    fix: `// Prefer named imports the bundler can shake\nimport { Button, Card } from "@novix-ui/react";\n\n// Avoid\nimport * as Nova from "@novix-ui/react";`,
    tip: "Verify with your bundler's analyzer — Nova's median primitive is <4KB gzipped.",
  },
];

function TroubleshootingPage() {
  return (
    <DocsShell
      eyebrow="Explore"
      title="Troubleshooting"
      description="The problems developers hit in their first day with Nova — and the fixes."
      toc={ISSUES.map((i) => ({ id: i.id, label: i.title }))}
    >
      <DocLead>
        If your problem isn't here, open a GitHub discussion. Every second report ends up in this file.
      </DocLead>

      {ISSUES.map((issue) => (
        <DocSection key={issue.id} id={issue.id} title={issue.title}>
          <p className="mt-1 text-sm text-muted-foreground"><span className="font-medium text-fg">Diagnose · </span>{issue.diagnose}</p>
          <CodeBlock className="mt-4" code={issue.fix} />
          <Callout className="mt-4" variant="tip" title="Tip">{issue.tip}</Callout>
        </DocSection>
      ))}
    </DocsShell>
  );
}
