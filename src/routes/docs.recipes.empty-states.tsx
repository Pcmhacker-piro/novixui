import { createFileRoute } from "@tanstack/react-router";
import { Inbox, Plus } from "lucide-react";
import { Button, Card } from "@/nova";
import { DocsShell, DocSection, DocLead } from "@/components/docs/docs-shell";
import { ComponentPreview } from "@/components/docs/preview";
import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";

export const Route = createFileRoute("/docs/recipes/empty-states")({
  component: EmptyRecipe,
  head: () => ({
    meta: [
      { title: "Empty states recipe · Novix UI" },
      { name: "description", content: "Zero-data screens that read as intentional, not incomplete." },
      { property: "og:title", content: "Empty states · Novix UI" },
      { property: "og:description", content: "Zero-data screens done right." },
    ],
  }),
});

function EmptyRecipe() {
  return (
    <DocsShell
      eyebrow="Recipes · UX"
      title="Empty states"
      description="First-run and zero-data screens are your onboarding. Treat them like a landing page in miniature."
      toc={[
        { id: "preview", label: "Preview" },
        { id: "source", label: "Source" },
        { id: "checklist", label: "Anatomy" },
      ]}
    >
      <DocSection id="preview" title="Preview">
        <DocLead>An empty inbox with an illustration slot, headline, sub, and a single primary action.</DocLead>
        <ComponentPreview className="mt-6" code={SOURCE}>
          <Card className="w-full max-w-md p-8 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
              <Inbox className="size-6" />
            </div>
            <p className="mt-4 text-base font-semibold">No messages yet</p>
            <p className="mt-1 text-sm text-muted-foreground">When someone sends you a message, it will show up here.</p>
            <Button className="mt-5" leadingIcon={<Plus className="size-4" />}>New message</Button>
          </Card>
        </ComponentPreview>
      </DocSection>

      <DocSection id="source" title="Source">
        <CodeBlock code={SOURCE} />
      </DocSection>

      <DocSection id="checklist" title="Anatomy">
        <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
          <li><span className="font-medium text-foreground">Icon or illustration</span> — one visual anchor. Use a tinted square with an Icon at 24px.</li>
          <li><span className="font-medium text-foreground">Headline</span> — a single sentence that names the emptiness.</li>
          <li><span className="font-medium text-foreground">Sub-copy</span> — one line explaining what happens next.</li>
          <li><span className="font-medium text-foreground">Primary action</span> — never more than one. Secondary belongs as a link below.</li>
        </ul>
        <Callout className="mt-4" variant="best-practice" title="Empty ≠ error">
          Empty states are calm. Save red, exclamation marks, and warning icons for actual failures.
        </Callout>
      </DocSection>
    </DocsShell>
  );
}

const SOURCE = `import { Button, Card } from "@novix-ui/react";
import { Inbox, Plus } from "lucide-react";

export function EmptyInbox() {
  return (
    <Card className="max-w-md p-8 text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
        <Inbox className="size-6" />
      </div>
      <h3 className="mt-4 font-semibold">No messages yet</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        When someone sends you a message, it will show up here.
      </p>
      <Button className="mt-5" leadingIcon={<Plus className="size-4" />}>New message</Button>
    </Card>
  );
}`;
