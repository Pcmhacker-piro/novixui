import { createFileRoute } from "@tanstack/react-router";
import { DocsShell, DocSection, DocLead, DocParagraph } from "@/components/docs/docs-shell";
import { CodeBlock } from "@/components/docs/code-block";

export const Route = createFileRoute("/docs/cli")({
  component: CliPage,
  head: () => ({
    meta: [
      { title: "CLI · Novix UI" },
      { name: "description", content: "The Novix CLI: init a project, add components, diagnose theme drift." },
      { property: "og:title", content: "CLI · Novix UI" },
      { property: "og:description", content: "The Novix CLI: init a project, add components, diagnose theme drift." },
    ],
  }),
});

const COMMANDS = [
  {
    name: "init",
    cmd: "novix init",
    body: "Bootstraps tokens, tailwind wiring, and the ThemeProvider into an existing React project.",
  },
  {
    name: "add",
    cmd: "novix add button card dialog",
    body: "Copies a component (and its dependencies) into your codebase. Own the source, edit freely.",
  },
  {
    name: "theme",
    cmd: "novix theme --base zinc --accent violet",
    body: "Generates an OKLCH-based palette variant with automatic contrast validation.",
  },
  {
    name: "diff",
    cmd: "novix diff button",
    body: "Shows the delta between your local copy and the latest upstream — no forced upgrades.",
  },
  {
    name: "doctor",
    cmd: "novix doctor",
    body: "Detects missing tokens, stale versions, or accidental hardcoded colors in your components.",
  },
];

function CliPage() {
  return (
    <DocsShell
      eyebrow="Getting started"
      title="Novix CLI"
      description="A small, opinionated command line for scaffolding, adding, and auditing Novix components in your project."
      toc={COMMANDS.map((c) => ({ id: c.name, label: c.name }))}
    >
      <DocLead>
        The CLI is copy-first, not install-first. Every component becomes real code inside your
        repository — no black boxes, no version lock, no cascade of unwanted dependencies.
      </DocLead>

      {COMMANDS.map((c) => (
        <DocSection key={c.name} id={c.name} title={c.name}>
          <DocParagraph>{c.body}</DocParagraph>
          <CodeBlock className="mt-4" code={c.cmd} />
        </DocSection>
      ))}
    </DocsShell>
  );
}
