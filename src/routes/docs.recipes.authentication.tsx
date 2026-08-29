import { createFileRoute } from "@tanstack/react-router";
import { Github, Mail } from "lucide-react";
import { Button, Card, Input, Label, Separator } from "@/nova";
import { DocsShell, DocSection, DocLead } from "@/components/docs/docs-shell";
import { ComponentPreview } from "@/components/docs/preview";
import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";

export const Route = createFileRoute("/docs/recipes/authentication")({
  component: AuthRecipe,
  head: () => ({
    meta: [
      { title: "Authentication recipe · Novix UI" },
      { name: "description", content: "Keyboard-first sign in and sign up screens composed from Nova primitives." },
      { property: "og:title", content: "Authentication · Novix UI" },
      { property: "og:description", content: "Keyboard-first auth screens." },
    ],
  }),
});

function AuthRecipe() {
  return (
    <DocsShell
      eyebrow="Recipes · Flows"
      title="Authentication screens"
      description="Sign-in, sign-up, and password reset that respect the keyboard, autofill, and password managers — the three things auth pages usually break."
      toc={[
        { id: "preview", label: "Preview" },
        { id: "source", label: "Source" },
        { id: "checklist", label: "Auth checklist" },
        { id: "related", label: "Related" },
      ]}
    >
      <DocSection id="preview" title="Preview">
        <DocLead>A centered sign-in card with OAuth, divider, and email + password.</DocLead>
        <ComponentPreview className="mt-6" code={SOURCE} align="center">
          <Card className="w-full max-w-sm p-6">
            <div className="mb-5 text-center">
              <p className="text-base font-semibold">Welcome back</p>
              <p className="mt-1 text-sm text-muted-foreground">Sign in to your Nova workspace.</p>
            </div>
            <div className="grid gap-2">
              <Button variant="outline" leadingIcon={<Github className="size-4" />}>Continue with GitHub</Button>
              <Button variant="outline" leadingIcon={<Mail className="size-4" />}>Continue with Email</Button>
            </div>
            <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
              <Separator className="flex-1" />
              <span>or</span>
              <Separator className="flex-1" />
            </div>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-1.5">
                <Label htmlFor="auth-email" required>Email</Label>
                <Input id="auth-email" type="email" autoComplete="email" placeholder="ada@novix.dev" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auth-password" required>Password</Label>
                  <a href="#" className="text-xs text-accent">Forgot?</a>
                </div>
                <Input id="auth-password" type="password" autoComplete="current-password" />
              </div>
              <Button className="w-full">Sign in</Button>
            </form>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              No account? <a className="text-accent" href="#">Create one</a>
            </p>
          </Card>
        </ComponentPreview>
      </DocSection>

      <DocSection id="source" title="Source">
        <CodeBlock code={SOURCE} />
      </DocSection>

      <DocSection id="checklist" title="Auth checklist">
        <Callout variant="best-practice" title="Never break the manager">
          Password managers rely on <code className="rounded bg-subtle px-1 font-mono text-[12.5px]">autoComplete="email"</code> and <code className="rounded bg-subtle px-1 font-mono text-[12.5px]">autoComplete="current-password"</code>. Nova's Input forwards them.
        </Callout>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          <li>Wrap fields in a real <code className="rounded bg-subtle px-1 font-mono text-[12.5px]">&lt;form&gt;</code> so Enter submits.</li>
          <li>Show inline error messages via Input's <code className="rounded bg-subtle px-1 font-mono text-[12.5px]">error</code> prop, not a toast.</li>
          <li>OAuth buttons stay above the divider — most users click them first.</li>
          <li>Sign-up flips the order: email first, password last, terms in copy under the button.</li>
        </ul>
      </DocSection>

      <DocSection id="related" title="Related">
        <ul className="mt-2 space-y-2 text-sm">
          <li><a className="text-accent underline-offset-4 hover:underline" href="/docs/templates/login">Login template</a></li>
          <li><a className="text-accent underline-offset-4 hover:underline" href="/docs/templates/signup">Signup template</a></li>
          <li><a className="text-accent underline-offset-4 hover:underline" href="/docs/recipes/forms">Forms recipe</a></li>
        </ul>
      </DocSection>
    </DocsShell>
  );
}

const SOURCE = `import { Button, Card, Input, Label, Separator } from "@novix-ui/react";
import { Github, Mail } from "lucide-react";

export function SignInCard() {
  return (
    <Card className="w-full max-w-sm p-6">
      <header className="mb-5 text-center">
        <h1 className="text-base font-semibold">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in to your Nova workspace.</p>
      </header>

      <div className="grid gap-2">
        <Button variant="outline" leadingIcon={<Github className="size-4" />}>Continue with GitHub</Button>
        <Button variant="outline" leadingIcon={<Mail className="size-4" />}>Continue with Email</Button>
      </div>

      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
        <Separator className="flex-1" /> or <Separator className="flex-1" />
      </div>

      <form className="space-y-3" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <Label htmlFor="email" required>Email</Label>
          <Input id="email" type="email" autoComplete="email" />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" required>Password</Label>
            <a className="text-xs text-accent" href="/reset">Forgot?</a>
          </div>
          <Input id="password" type="password" autoComplete="current-password" />
        </div>
        <Button className="w-full">Sign in</Button>
      </form>
    </Card>
  );
}`;
