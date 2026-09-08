import { createFileRoute } from "@tanstack/react-router";
import { DocsShell, DocSection, DocLead } from "@/components/docs/docs-shell";
import { CodeBlock, CommandChip } from "@/components/docs/code-block";

export const Route = createFileRoute("/docs/installation")({
  component: InstallationPage,
  head: () => ({
    meta: [
      { title: "Installation · Novix UI" },
      {
        name: "description",
        content:
          "Install Novix UI in a Vite, Next.js, or TanStack Start project. One command, one provider, ready to ship.",
      },
    ],
  }),
});

function InstallationPage() {
  return (
    <DocsShell
      eyebrow="Getting started"
      title="Installation"
      description="Novix UI works with any Vite, Next.js, or TanStack Start project. Install the package, wrap your app with ThemeProvider, and import the styles."
      toc={[
        { id: "install", label: "Install" },
        { id: "styles", label: "Import styles" },
        { id: "provider", label: "Wrap with ThemeProvider" },
        { id: "use", label: "Use a component" },
        { id: "requirements", label: "Requirements" },
      ]}
    >
      <DocSection id="install" title="Install the package">
        <DocLead>Novix UI is a single tree-shakable package. Pick your package manager.</DocLead>
        <div className="mt-5 flex flex-wrap gap-2">
          <CommandChip cmd="npm i @novix-ui/react" />
          <CommandChip cmd="pnpm add @novix-ui/react" />
          <CommandChip cmd="bun add @novix-ui/react" />
          <CommandChip cmd="yarn add @novix-ui/react" />
        </div>
      </DocSection>

      <DocSection id="styles" title="Import the stylesheet">
        <p className="leading-relaxed text-muted-foreground">
          Nova ships a single CSS entry with the design tokens, keyframes, and
          signature utilities. Import it once at the root of your app.
        </p>
        <CodeBlock
          className="mt-5"
          language="tsx"
          title="src/main.tsx"
          code={`import "@novix-ui/react/styles.css";`}
        />
      </DocSection>

      <DocSection id="provider" title="Wrap your app with ThemeProvider">
        <p className="leading-relaxed text-muted-foreground">
          <code className="rounded bg-subtle px-1 py-0.5 font-mono text-[12.5px]">ThemeProvider</code>{" "}
          handles light, dark, and system mode with persistence and OS sync out of the
          box. It renders nothing — just wire it once near the root.
        </p>
        <CodeBlock
          className="mt-5"
          language="tsx"
          title="src/App.tsx"
          code={`import { ThemeProvider } from "@novix-ui/react";

export function App() {
  return (
    <ThemeProvider defaultTheme="system">
      {/* your app */}
    </ThemeProvider>
  );
}`}
        />
      </DocSection>

      <DocSection id="use" title="Use a component">
        <p className="leading-relaxed text-muted-foreground">
          Every primitive is exported from the package root. Named exports keep tree
          shaking honest.
        </p>
        <CodeBlock
          className="mt-5"
          language="tsx"
          code={`import { Button } from "@novix-ui/react";
import { Sparkles } from "lucide-react";

export function CTA() {
  return (
    <Button leadingIcon={<Sparkles className="size-4" />}>
      Generate
    </Button>
  );
}`}
        />
      </DocSection>

      <DocSection id="requirements" title="Requirements">
        <ul className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          {[
            "React ≥ 18",
            "TypeScript ≥ 5 (recommended)",
            "Tailwind CSS v4 (peer)",
            "Modern browsers (Chrome, Safari, Firefox, Edge)",
          ].map((r) => (
            <li key={r} className="flex items-center gap-2">
              <span aria-hidden className="size-1.5 rounded-full bg-accent" />
              {r}
            </li>
          ))}
        </ul>
      </DocSection>
    </DocsShell>
  );
}
