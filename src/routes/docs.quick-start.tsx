import { createFileRoute } from "@tanstack/react-router";
import { DocsShell, DocSection, DocLead, DocParagraph } from "@/components/docs/docs-shell";
import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/preview";
import { Button } from "@/nova";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/docs/quick-start")({
  component: QuickStart,
  head: () => ({
    meta: [
      { title: "Quick start · Novix UI" },
      { name: "description", content: "Ship your first Novix UI component in under two minutes." },
      { property: "og:title", content: "Quick start · Novix UI" },
      { property: "og:description", content: "Ship your first Novix UI component in under two minutes." },
    ],
  }),
});

function QuickStart() {
  return (
    <DocsShell
      eyebrow="Getting started"
      title="Quick start"
      description="From zero to a rendered Nova component in under two minutes. This guide assumes React 19, Tailwind v4, and a Vite or TanStack Start project."
      toc={[
        { id: "install", label: "1. Install" },
        { id: "tokens", label: "2. Add tokens" },
        { id: "provider", label: "3. Wrap in ThemeProvider" },
        { id: "render", label: "4. Render your first component" },
        { id: "next", label: "Next steps" },
      ]}
    >
      <DocSection id="install" title="1. Install">
        <DocLead>Add the Nova packages to your workspace.</DocLead>
        <CodeBlock className="mt-4" code={`npm install @novix-ui/react @novix-ui/tokens`} />
      </DocSection>

      <DocSection id="tokens" title="2. Add tokens">
        <DocParagraph>
          Import Nova's OKLCH-based token system into your root stylesheet. It ships as pure CSS —
          zero JS runtime, zero cascade cost.
        </DocParagraph>
        <CodeBlock
          className="mt-4"
          code={`/* src/styles.css */
@import "tailwindcss";
@import "@novix-ui/tokens/theme.css";`}
        />
      </DocSection>

      <DocSection id="provider" title="3. Wrap in ThemeProvider">
        <DocParagraph>
          The provider handles system/light/dark, persistence, and the smooth theme cross-fade.
        </DocParagraph>
        <CodeBlock
          className="mt-4"
          code={`import { ThemeProvider } from "@novix-ui/react";

export default function App({ children }) {
  return <ThemeProvider defaultTheme="system">{children}</ThemeProvider>;
}`}
        />
      </DocSection>

      <DocSection id="render" title="4. Render your first component">
        <DocParagraph>That's it. Every Nova component is a one-line import.</DocParagraph>
        <ComponentPreview
          className="mt-6"
          code={`import { Button } from "@novix-ui/react";
import { ArrowRight } from "lucide-react";

export default function Hello() {
  return <Button trailingIcon={<ArrowRight />}>Ship it</Button>;
}`}
        >
          <Button trailingIcon={<ArrowRight />}>Ship it</Button>
        </ComponentPreview>
      </DocSection>

      <DocSection id="next" title="Next steps">
        <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
          <li>
            → <a href="/docs/theming" className="text-foreground underline underline-offset-2">Customize the theme</a>
          </li>
          <li>
            → <a href="/docs/tokens/colors" className="text-foreground underline underline-offset-2">Explore the color system</a>
          </li>
          <li>
            → <a href="/docs/playground" className="text-foreground underline underline-offset-2">Try components in the sandbox</a>
          </li>
        </ul>
      </DocSection>
    </DocsShell>
  );
}
