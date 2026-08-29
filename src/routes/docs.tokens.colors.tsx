import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DocsShell, DocSection, DocLead, DocParagraph } from "@/components/docs/docs-shell";
import { CodeBlock } from "@/components/docs/code-block";
import { Check, Copy } from "lucide-react";

export const Route = createFileRoute("/docs/tokens/colors")({
  component: ColorsPage,
  head: () => ({
    meta: [
      { title: "Colors · Novix UI" },
      { name: "description", content: "The Novix UI OKLCH color system: perceptually uniform, contrast-safe, dark-mode native." },
      { property: "og:title", content: "Colors · Novix UI" },
      { property: "og:description", content: "The Novix UI OKLCH color system: perceptually uniform, contrast-safe, dark-mode native." },
    ],
  }),
});

const SEMANTIC = [
  { name: "background", value: "var(--background)", role: "Page background", oklchLight: "oklch(0.995 0 0)", oklchDark: "oklch(0.145 0.008 260)" },
  { name: "foreground", value: "var(--foreground)", role: "Primary text", oklchLight: "oklch(0.145 0.01 260)", oklchDark: "oklch(0.975 0.003 260)" },
  { name: "surface", value: "var(--surface)", role: "Elevated surfaces", oklchLight: "oklch(0.985 0.002 260)", oklchDark: "oklch(0.185 0.01 260)" },
  { name: "subtle", value: "var(--subtle)", role: "Muted fills, hover states", oklchLight: "oklch(0.965 0.004 260)", oklchDark: "oklch(0.22 0.012 260)" },
  { name: "muted", value: "var(--muted)", role: "Subdued surfaces & badges", oklchLight: "oklch(0.955 0.005 260)", oklchDark: "oklch(0.24 0.013 260)" },
  { name: "border", value: "var(--border)", role: "Hairline strokes", oklchLight: "oklch(0.918 0.006 260)", oklchDark: "oklch(1 0 0 / 9%)" },
  { name: "border-strong", value: "var(--border-strong)", role: "High-contrast borders", oklchLight: "oklch(0.86 0.008 260)", oklchDark: "oklch(1 0 0 / 16%)" },
  { name: "muted-foreground", value: "var(--muted-foreground)", role: "Secondary text", oklchLight: "oklch(0.505 0.015 260)", oklchDark: "oklch(0.68 0.015 260)" },
  { name: "primary", value: "var(--primary)", role: "Neutral emphasis actions", oklchLight: "oklch(0.19 0.02 260)", oklchDark: "oklch(0.975 0.003 260)" },
  { name: "accent", value: "var(--accent)", role: "Hero actions & focus rings", oklchLight: "oklch(0.62 0.19 265)", oklchDark: "oklch(0.7 0.18 265)" },
  { name: "success", value: "var(--success)", role: "Positive intent & badges", oklchLight: "oklch(0.68 0.15 155)", oklchDark: "oklch(0.75 0.16 155)" },
  { name: "warning", value: "var(--warning)", role: "Alerts & caution states", oklchLight: "oklch(0.78 0.15 75)", oklchDark: "oklch(0.82 0.15 75)" },
  { name: "danger", value: "var(--danger)", role: "Destructive intent & errors", oklchLight: "oklch(0.6 0.22 27)", oklchDark: "oklch(0.6 0.22 27)" },
];

function ColorsPage() {
  return (
    <DocsShell
      eyebrow="Design tokens"
      title="Colors"
      description="Novix UI ships an OKLCH-based semantic color system. Perceptually uniform lightness makes theme switching predictable — a token's role stays constant while its hue shifts with the mode."
      toc={[
        { id: "philosophy", label: "Philosophy" },
        { id: "semantic", label: "Semantic tokens" },
        { id: "code", label: "CSS tokens code" },
        { id: "usage", label: "Usage" },
      ]}
    >
      <DocSection id="philosophy" title="Philosophy">
        <DocLead>
          Never reference a raw color in a component. Reference a role — the role decides which
          hue, which lightness, which contrast to apply.
        </DocLead>
        <DocParagraph>
          OKLCH lets us tune lightness independently of hue. Contrast pairings stay AA in light,
          dark, and every custom theme generated from these tokens.
        </DocParagraph>
      </DocSection>

      <DocSection id="semantic" title="Semantic tokens">
        <DocParagraph>
          Click any card to copy its CSS custom property or Tailwind utility class:
        </DocParagraph>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SEMANTIC.map((t) => (
            <ColorCard key={t.name} token={t} />
          ))}
        </div>
      </DocSection>

      <DocSection id="code" title="CSS tokens code">
        <DocParagraph>
          Here is the complete CSS code defining all OKLCH color tokens for both Light and Dark themes:
        </DocParagraph>
        <CodeBlock
          className="mt-4"
          language="css"
          code={`:root {
  /* Light Theme */
  --background: oklch(0.995 0 0);
  --foreground: oklch(0.145 0.01 260);
  --surface: oklch(0.985 0.002 260);
  --subtle: oklch(0.965 0.004 260);
  --muted: oklch(0.955 0.005 260);
  --muted-foreground: oklch(0.505 0.015 260);
  --border: oklch(0.918 0.006 260);
  --border-strong: oklch(0.86 0.008 260);
  --primary: oklch(0.19 0.02 260);
  --accent: oklch(0.62 0.19 265);
  --success: oklch(0.68 0.15 155);
  --warning: oklch(0.78 0.15 75);
  --danger: oklch(0.6 0.22 27);
}

.dark {
  /* Dark Theme */
  --background: oklch(0.145 0.008 260);
  --foreground: oklch(0.975 0.003 260);
  --surface: oklch(0.185 0.01 260);
  --subtle: oklch(0.22 0.012 260);
  --muted: oklch(0.24 0.013 260);
  --muted-foreground: oklch(0.68 0.015 260);
  --border: oklch(1 0 0 / 9%);
  --border-strong: oklch(1 0 0 / 16%);
  --primary: oklch(0.975 0.003 260);
  --accent: oklch(0.7 0.18 265);
  --success: oklch(0.75 0.16 155);
  --warning: oklch(0.82 0.15 75);
  --danger: oklch(0.6 0.22 27);
}`}
        />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <DocParagraph>
          In JSX, use Tailwind utility classes generated from tokens:{" "}
          <code className="rounded bg-subtle px-1 py-0.5 font-mono text-[12.5px]">bg-surface</code>,{" "}
          <code className="rounded bg-subtle px-1 py-0.5 font-mono text-[12.5px]">text-foreground</code>,{" "}
          <code className="rounded bg-subtle px-1 py-0.5 font-mono text-[12.5px]">border-border</code>. Never
          hardcode <code className="rounded bg-subtle px-1 py-0.5 font-mono text-[12.5px]">bg-white</code> or
          hex values — they break dark mode and custom themes.
        </DocParagraph>
        <CodeBlock
          className="mt-4"
          code={`// Example: Card styled exclusively with semantic color tokens
export function FeatureCard() {
  return (
    <div className="bg-surface text-foreground border border-border rounded-xl p-5 shadow-sm">
      <h3 className="font-semibold text-foreground">Semantic Palette</h3>
      <p className="text-muted-foreground text-sm mt-1">Automatically switches between light and dark.</p>
      <button className="mt-4 bg-accent text-white px-3 py-1.5 rounded-lg text-sm font-medium">
        Action
      </button>
    </div>
  );
}`}
        />
      </DocSection>
    </DocsShell>
  );
}

function ColorCard({ token }: { token: typeof SEMANTIC[number] }) {
  const [copiedType, setCopiedType] = useState<"var" | "class" | null>(null);

  const copy = (type: "var" | "class") => {
    const text = type === "var" ? `var(--${token.name})` : `bg-${token.name}`;
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 1800);
  };

  return (
    <div className="nova-card-surface group relative flex items-center justify-between gap-3 rounded-xl p-3 transition-all hover:border-border hover:shadow-sm">
      <div className="flex items-center gap-3 min-w-0">
        <div
          aria-hidden
          className="size-11 shrink-0 rounded-lg border border-border/80 shadow-inner"
          style={{ background: token.value }}
        />
        <div className="min-w-0">
          <p className="font-mono text-[12.5px] font-medium">{token.name}</p>
          <p className="truncate text-[11.5px] text-muted-foreground">{token.role}</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={() => copy("var")}
          title={`Copy variable: var(--${token.name})`}
          className="flex h-7 items-center gap-1 rounded border border-border/60 bg-surface px-2 font-mono text-[11px] text-muted-foreground transition-colors hover:border-border hover:text-foreground active:scale-95"
        >
          {copiedType === "var" ? (
            <>
              <Check className="h-3 w-3 text-emerald-500" />
              <span className="text-emerald-500 text-[10px]">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>var(--{token.name})</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
