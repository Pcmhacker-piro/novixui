import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DocsShell, DocSection, DocLead } from "@/components/docs/docs-shell";
import { CodeBlock } from "@/components/docs/code-block";
import { Check, Copy } from "lucide-react";

export const Route = createFileRoute("/docs/theming")({
  component: ThemingPage,
  head: () => ({
    meta: [
      { title: "Theming · Novix UI" },
      {
        name: "description",
        content:
          "OKLCH-based semantic tokens power every Novix UI component. Override a variable, restyle everything.",
      },
    ],
  }),
});

const NEUTRALS = [
  { name: "background", cls: "bg-background border border-border", oklchLight: "oklch(0.995 0 0)", oklchDark: "oklch(0.145 0.008 260)" },
  { name: "surface", cls: "bg-surface border border-border", oklchLight: "oklch(0.985 0.002 260)", oklchDark: "oklch(0.185 0.01 260)" },
  { name: "subtle", cls: "bg-subtle border border-border", oklchLight: "oklch(0.965 0.004 260)", oklchDark: "oklch(0.22 0.012 260)" },
  { name: "muted", cls: "bg-muted border border-border", oklchLight: "oklch(0.955 0.005 260)", oklchDark: "oklch(0.24 0.013 260)" },
  { name: "border", cls: "bg-border", oklchLight: "oklch(0.918 0.006 260)", oklchDark: "oklch(1 0 0 / 9%)" },
  { name: "border-strong", cls: "bg-border-strong", oklchLight: "oklch(0.86 0.008 260)", oklchDark: "oklch(1 0 0 / 16%)" },
  { name: "foreground", cls: "bg-foreground", oklchLight: "oklch(0.145 0.01 260)", oklchDark: "oklch(0.975 0.003 260)" },
];

const SEMANTICS = [
  { name: "primary", cls: "bg-primary", oklchLight: "oklch(0.19 0.02 260)", oklchDark: "oklch(0.975 0.003 260)" },
  { name: "accent", cls: "bg-accent", oklchLight: "oklch(0.62 0.19 265)", oklchDark: "oklch(0.7 0.18 265)" },
  { name: "success", cls: "bg-success", oklchLight: "oklch(0.68 0.15 155)", oklchDark: "oklch(0.75 0.16 155)" },
  { name: "warning", cls: "bg-warning", oklchLight: "oklch(0.78 0.15 75)", oklchDark: "oklch(0.82 0.15 75)" },
  { name: "danger", cls: "bg-danger", oklchLight: "oklch(0.6 0.22 27)", oklchDark: "oklch(0.6 0.22 27)" },
];

function ThemingPage() {
  return (
    <DocsShell
      eyebrow="Getting started"
      title="Theming"
      description="Novix UI uses OKLCH design tokens exposed as CSS custom properties. Override a variable at any scope — :root, .dark, a section, a component — and the entire surface follows."
      toc={[
        { id: "tokens", label: "Design tokens" },
        { id: "palette", label: "Palette" },
        { id: "css-code", label: "CSS variables code" },
        { id: "modes", label: "Light & dark" },
        { id: "custom", label: "Custom themes" },
      ]}
    >
      <DocSection id="tokens" title="Semantic-only tokens">
        <DocLead>
          Novix UI never hardcodes color inside components. Every surface reads from a
          named token, so a single override cascades everywhere. Use tokens like
          <code className="mx-1 rounded bg-subtle px-1 py-0.5 font-mono text-[12.5px]">bg-surface</code>
          and
          <code className="mx-1 rounded bg-subtle px-1 py-0.5 font-mono text-[12.5px]">text-foreground</code>
          — never <code className="mx-1 rounded bg-subtle px-1 py-0.5 font-mono text-[12.5px]">bg-white</code>.
        </DocLead>
      </DocSection>

      <DocSection id="palette" title="Palette">
        <p className="text-sm text-muted-foreground">
          Click any plate below to copy its CSS variable (<code className="rounded bg-subtle px-1 py-0.5 font-mono text-[11px]">var(--name)</code>) or Tailwind class (<code className="rounded bg-subtle px-1 py-0.5 font-mono text-[11px]">bg-name</code>).
        </p>

        <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Neutrals</p>
        <div className="mt-2.5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {NEUTRALS.map((t) => (
            <Swatch key={t.name} name={t.name} cls={t.cls} oklchLight={t.oklchLight} oklchDark={t.oklchDark} />
          ))}
        </div>

        <p className="mt-8 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Semantic</p>
        <div className="mt-2.5 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {SEMANTICS.map((t) => (
            <Swatch key={t.name} name={t.name} cls={t.cls} oklchLight={t.oklchLight} oklchDark={t.oklchDark} />
          ))}
        </div>
      </DocSection>

      <DocSection id="css-code" title="CSS tokens code">
        <p className="leading-relaxed text-muted-foreground">
          Add these token definitions to your <code className="rounded bg-subtle px-1 py-0.5 font-mono text-[12.5px]">global.css</code> or <code className="rounded bg-subtle px-1 py-0.5 font-mono text-[12.5px]">app.css</code> to match Novix UI's full palette:
        </p>
        <CodeBlock
          className="mt-5"
          language="css"
          code={`:root {
  /* Neutrals — Light */
  --background: oklch(0.995 0 0);
  --foreground: oklch(0.145 0.01 260);
  --surface: oklch(0.985 0.002 260);
  --subtle: oklch(0.965 0.004 260);
  --muted: oklch(0.955 0.005 260);
  --border: oklch(0.918 0.006 260);
  --border-strong: oklch(0.86 0.008 260);

  /* Semantic */
  --primary: oklch(0.19 0.02 260);
  --accent: oklch(0.62 0.19 265);
  --success: oklch(0.68 0.15 155);
  --warning: oklch(0.78 0.15 75);
  --danger: oklch(0.6 0.22 27);
}

.dark {
  /* Neutrals — Dark */
  --background: oklch(0.145 0.008 260);
  --foreground: oklch(0.975 0.003 260);
  --surface: oklch(0.185 0.01 260);
  --subtle: oklch(0.22 0.012 260);
  --muted: oklch(0.24 0.013 260);
  --border: oklch(1 0 0 / 9%);
  --border-strong: oklch(1 0 0 / 16%);

  /* Semantic */
  --primary: oklch(0.975 0.003 260);
  --accent: oklch(0.7 0.18 265);
  --success: oklch(0.75 0.16 155);
  --warning: oklch(0.82 0.15 75);
  --danger: oklch(0.6 0.22 27);
}`}
        />
      </DocSection>

      <DocSection id="modes" title="Light, dark, and system">
        <p className="leading-relaxed text-muted-foreground">
          <code className="rounded bg-subtle px-1 py-0.5 font-mono text-[12.5px]">ThemeProvider</code>{" "}
          persists the user's preference to <code className="rounded bg-subtle px-1 py-0.5 font-mono text-[12.5px]">localStorage</code>{" "}
          and syncs with the OS. The <code className="rounded bg-subtle px-1 py-0.5 font-mono text-[12.5px]">useTheme()</code>{" "}
          hook exposes the current mode plus a <code className="rounded bg-subtle px-1 py-0.5 font-mono text-[12.5px]">toggle()</code> action.
        </p>
        <CodeBlock
          className="mt-5"
          code={`import { useTheme, IconButton } from "@novix-ui/react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, toggle } = useTheme();
  return (
    <IconButton
      aria-label="Toggle theme"
      onClick={toggle}
      icon={resolvedTheme === "dark" ? <Sun /> : <Moon />}
    />
  );
}`}
        />
      </DocSection>

      <DocSection id="custom" title="Custom themes">
        <p className="leading-relaxed text-muted-foreground">
          Override any token at any scope. Novix UI reads variables at paint time, so
          themes can be swapped per-route, per-section, or per-component with zero
          re-mounting.
        </p>
        <CodeBlock
          className="mt-5"
          language="css"
          code={`/* Warm brand override, scoped to a marketing route */
[data-theme="brand"] {
  --accent: oklch(0.7 0.19 30);
  --accent-muted: oklch(0.94 0.05 30);
  --ring: oklch(0.68 0.2 30);
}`}
        />
      </DocSection>
    </DocsShell>
  );
}

function Swatch({
  name,
  cls,
  oklchLight,
  oklchDark,
}: {
  name: string;
  cls: string;
  oklchLight?: string;
  oklchDark?: string;
}) {
  const [copiedType, setCopiedType] = useState<"var" | "class" | null>(null);

  const copy = (type: "var" | "class") => {
    const text = type === "var" ? `var(--${name})` : `bg-${name}`;
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 1800);
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border/80 bg-surface/50 transition-all hover:border-border hover:shadow-md">
      {/* Color Preview Block */}
      <div className={`relative h-20 w-full ${cls}`}>
        {/* Quick action buttons on hover */}
        <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/40 p-2 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
          <button
            type="button"
            onClick={() => copy("var")}
            title="Copy CSS variable: var(--name)"
            className="flex items-center gap-1 rounded-md bg-white/90 px-2 py-1 text-[11px] font-mono font-medium text-black shadow transition-transform hover:scale-105 active:scale-95"
          >
            {copiedType === "var" ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
            <span>var(--{name})</span>
          </button>
        </div>
      </div>

      {/* Info Block */}
      <div className="flex items-center justify-between border-t border-border/60 p-2.5">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <code className="font-mono text-[12px] font-semibold text-foreground">{name}</code>
          </div>
          <p className="mt-0.5 font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground">
            --{name}
          </p>
        </div>

        <button
          type="button"
          onClick={() => copy("class")}
          title={`Copy Tailwind class: bg-${name}`}
          className="flex h-7 items-center gap-1 rounded border border-border/60 bg-surface px-1.5 font-mono text-[10.5px] text-muted-foreground transition-colors hover:border-border hover:text-foreground active:scale-95"
        >
          {copiedType === "class" ? (
            <>
              <Check className="h-3 w-3 text-emerald-500" />
              <span className="text-emerald-500">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>bg-{name}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
